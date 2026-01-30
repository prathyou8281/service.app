import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
const PaytmChecksum = require('paytmchecksum');

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private readonly mid: string;
    private readonly key: string;
    private readonly website: string;
    private readonly channelId: string;
    private readonly industryTypeId: string;
    private readonly callbackUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly db: DatabaseService,
    ) {
        this.mid = this.configService.get('PAYTM_MID');
        this.key = this.configService.get('PAYTM_MERCHANT_KEY');
        this.website = this.configService.get('PAYTM_WEBSITE');
        this.channelId = this.configService.get('PAYTM_CHANNEL_ID');
        this.industryTypeId = this.configService.get('PAYTM_INDUSTRY_TYPE_ID');
        this.callbackUrl = this.configService.get('PAYTM_CALLBACK_URL');
    }

    async initiatePayment(userId: number, orderId: number, amount: number) {
        // Trial/Simulation Mode Check
        if (!this.mid || this.mid === 'YOUR_PAYTM_MID_HERE' || !this.key || this.key === 'YOUR_PAYTM_KEY_HERE') {
            this.logger.log('Payment initialized in TRIAL MODE');
            return {
                paytmUrl: 'http://localhost:3000/payments/paytm-trial',
                orderId: orderId,
                amount: amount,
                mid: 'SERVICEHUB_TRIAL_ID'
            };
        }

        const paytmParams: any = {};
        paytmParams['MID'] = this.mid;
        paytmParams['WEBSITE'] = this.website;
        paytmParams['CHANNEL_ID'] = this.channelId;
        paytmParams['INDUSTRY_TYPE_ID'] = this.industryTypeId;
        paytmParams['ORDER_ID'] = `ORDER_${orderId}_${Date.now()}`;
        paytmParams['CUST_ID'] = `CUST_${userId}`;
        paytmParams['TXN_AMOUNT'] = amount.toString();
        paytmParams['CALLBACK_URL'] = this.callbackUrl;

        try {
            // Some versions of PaytmChecksum.generateSignature take the object directly
            const checksum = await PaytmChecksum.generateSignature(
                paytmParams,
                this.key,
            );

            return {
                ...paytmParams,
                CHECKSUMHASH: checksum,
                paytmUrl: 'https://securegw-stage.paytm.in/order/process',
            };
        } catch (error) {
            this.logger.error('Error generating Paytm checksum', error);
            throw error;
        }
    }

    async forceUpdateOrder(orderId: number, txnId: string) {
        this.logger.log(`Forcing payment update for order ${orderId} [TXN: ${txnId}]`);
        await this.db.execute(
            'UPDATE services_histories SET status = "processing", payment_status = "paid", payment_id = ? WHERE id = ?',
            [txnId, orderId],
        );
        return { success: true, orderId };
    }

    async handleCallback(body: any) {
        const paytmChecksum = body.CHECKSUMHASH;
        if (!paytmChecksum) {
            return { success: false, message: 'Missing checksum' };
        }

        const params = { ...body };
        delete params.CHECKSUMHASH;

        const isVerifySignature = PaytmChecksum.verifySignature(
            params,
            this.key,
            paytmChecksum,
        );

        if (isVerifySignature) {
            this.logger.log('Checksum Matched');
            const orderIdMatch = body.ORDER_ID.match(/ORDER_(\d+)_/);
            const orderId = orderIdMatch ? orderIdMatch[1] : null;

            if (body.STATUS === 'TXN_SUCCESS') {
                await this.db.execute(
                    'UPDATE services_histories SET status = "processing", payment_status = "paid", payment_id = ? WHERE id = ?',
                    [body.TXNID, orderId],
                );
                return { success: true, orderId };
            } else {
                await this.db.execute(
                    'UPDATE services_histories SET payment_status = "failed" WHERE id = ?',
                    [orderId],
                );
                return { success: false, orderId, message: body.RESPMSG };
            }
        } else {
            this.logger.error('Checksum Mismatch');
            return { success: false, message: 'Checksum Mismatch' };
        }
    }
}
