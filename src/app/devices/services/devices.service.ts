import { Injectable } from "@angular/core";
import { Device } from "../models/device.model";

@Injectable()
export class DevicesService {
    private devices = new Array<Device>({
        id: 1,
        name: "Light bulb",
        role: "Actuator",
        type: "bulb"
    });

    getDevices(): Array<Device> {
        return this.devices;
    }

    getDevice(id: number): Device {
        return this.devices.filter(item => item.id === id)[0];
    }
}
