import { Component, OnInit } from "@angular/core";

import { registerElement } from "nativescript-angular/element-registry";
import { CardView } from "@nstudio/nativescript-cardview";
import { Location } from "@angular/common";
import { Device } from "../../models/device.model";
import { DevicesService } from "../../services/devices.service";

registerElement("CardView", () => CardView);

@Component({
    selector: "ns-devices",
    templateUrl: "./devices-list.component.html",
    styleUrls: ["./devices-list.component.css"]
})
export class DevicesListComponent implements OnInit {
    public devices: Array<Device>;
    public data = [];
    constructor(
        private devicesService: DevicesService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.devices = this.devicesService.getDevices();
    }
    goBack(): void {
        this.location.back();
    }
}
