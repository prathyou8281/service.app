import { Controller, Get, Query, Param } from "@nestjs/common";
import { ServicesService } from "./services.service";

@Controller("services")
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.servicesService.findAll(query);
    }

    @Get("types")
    getServiceTypes() {
        return this.servicesService.getServiceTypes();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.servicesService.findOne(id);
    }
}
