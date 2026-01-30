import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('initiate')
    async initiate(@Request() req, @Body() body: { orderId: number; amount: number }) {
        return this.paymentsService.initiatePayment(req.user.id, body.orderId, body.amount);
    }

    @Post('callback')
    async callback(@Body() body: any, @Res() res: Response) {
        const result = await this.paymentsService.handleCallback(body);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        if (result.success) {
            // Redirect to a success page or orders page with success flag
            return res.redirect(`${frontendUrl}/orders?payment=success&orderId=${result.orderId}`);
        } else {
            return res.redirect(`${frontendUrl}/orders?payment=failed&message=${result.message}`);
        }
    }

    @Post('callback/simulated')
    async simulatedCallback(@Body() body: any) {
        // Bypass checksum for simulation
        const orderIdMatch = body.ORDER_ID.match(/ORDER_(\d+)_/);
        const orderId = orderIdMatch ? orderIdMatch[1] : null;

        if (body.STATUS === 'TXN_SUCCESS') {
            return this.paymentsService.forceUpdateOrder(Number(orderId), body.TXNID);
        }
        return { success: false };
    }
}
