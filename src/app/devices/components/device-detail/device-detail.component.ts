import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Location } from "@angular/common";
import { Device } from "../../models/device.model";
import { DevicesService } from "../../services/devices.service";

@Component({
    selector: "ns-details",
    templateUrl: "./device-detail.component.html"
})
export class DeviceDetailComponent implements OnInit {
    public device: Device;

    constructor(
        private devicesService: DevicesService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.device = this.devicesService.getDevice(id);
    }
    goBack(): void {
        this.location.back();
    }
}
