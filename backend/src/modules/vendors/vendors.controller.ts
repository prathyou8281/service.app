import { Body, Controller, Post, BadRequestException } from "@nestjs/common";
import { VendorsService } from "./vendors.service";

@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const result = await this.vendorsService.login(email, password);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      success: true,
      vendor: result.vendor,
    };
  }
}
