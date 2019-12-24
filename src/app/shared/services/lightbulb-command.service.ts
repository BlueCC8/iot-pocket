import { Injectable } from "@angular/core";
import { BluetoothService } from "./bluetooth.service";
import { BleDevice } from "../../models/ble-device.model";
import { HexHelper } from "../../helpers/hex-helper";
import { Subject } from "rxjs";

@Injectable()
export class LightBulbCommandService {
    magicBlue: BleDevice;
    private stateBulb = new Subject<boolean>();
    public stateBulbUpdated = this.stateBulb.asObservable();

    constructor(private bluetoothService: BluetoothService) {}

    connectToMagicBlue() {
        this.bluetoothService.scan().then(() => {
            console.log("Scanning completed");
            this.magicBlue = this.getMagicBlue();
            if (this.magicBlue) {
                console.log("Magic blue found");
                this.bluetoothService
                    .connect(this.magicBlue.UUID)
                    .then(device => {
                        console.log("Connected: " + JSON.stringify(device));
                        this.stateBulb.next(true);
                    });
            } else {
                console.log("Device not found");
            }
        });
    }

    update(red: number, green: number, blue: number, white: number) {
        if (!this.magicBlue) {
            console.log("Not connected to device");
            return;
        }
        console.log("color=" + [56, red, green, blue, white, 240, 170]);
        let color = [86, red, green, blue, white, 240, 170]
            .map(param => {
                return this.convertToHexString(param);
            })
            .join("");
        color = HexHelper.hex2a(color);
        console.log("Updating the color:" + HexHelper.hex2a(color));

        const updateMessage = this.getMessage(this.magicBlue.UUID, color);
        this.bluetoothService.write(updateMessage);
    }

    getMessage(UUID: string, value: string): any {
        return {
            peripheralUUID: UUID,
            serviceUUID: "ffe5",
            characteristicUUID: "ffe9",
            value: value
        };
    }

    getMagicBlue(): BleDevice {
        return this.bluetoothService.bleDevicesAround.filter(
            d => d.name && d.name.indexOf("LEDBLE") > -1
        )[0];
    }

    convertToHexString(code: number): string {
        return code.toString(16);
    }
}
