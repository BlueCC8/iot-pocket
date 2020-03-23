import { Injectable } from "@angular/core";
import { BluetoothService } from "../../shared/services/bluetooth.service";
import { BleDevice } from "../../shared/models/ble-device.model";
import { HexHelper } from "../../shared/helpers/hex-helper";
import { Subject, BehaviorSubject } from "rxjs";
import { AlertService } from "../../shared/services/alert.service";
import { SpinnerService } from "../../shared/services/spinner.service";
import { BleMessage } from "../../shared/models/ble-message.model";

@Injectable()
export class LightBulbCommandService {
    private magicBlue: BleDevice;

    private stateMagicBlue = new BehaviorSubject<BleDevice>(null);
    public stateMagicBlueUpdated = this.stateMagicBlue.asObservable();

    private stateBulb = new BehaviorSubject<boolean>(false);
    public stateBulbUpdated = this.stateBulb.asObservable();

    constructor(
        private bluetoothService: BluetoothService,
        private alertService: AlertService,
        private spinnerService: SpinnerService
    ) {}

    connectToMagicBlue(): void {
        this.bluetoothService.scan().then(() => {
            // console.log("Scanning completed");
            const magicblue = this.getMagicBlue();

            this.magicBlue = magicblue;
            this.stateMagicBlue.next(magicblue);

            if (this.magicBlue) {
                // console.log("Magic blue found");
                this.bluetoothService
                    .connect(this.magicBlue.UUID)
                    .then(device => {
                        // console.log("Connected: " + JSON.stringify(device));
                        this.alertService.showSuccess(
                            "Success",
                            "Successfully conected to the lightbulb "
                        );
                        this.spinnerService.setSpinner(false);
                        this.stateBulb.next(true);
                    });
            } else {
                this.alertService.showError(
                    "Error",
                    "Device not found, please check bluetooth connection"
                );
                this.spinnerService.setSpinner(false);
            }
        });
    }
    disconnectMagicBlue(magicBlue: BleDevice): void {
        if (magicBlue) {
            console.log("Magic blue found");
            try {
                this.bluetoothService.disconnect(magicBlue.UUID);
                this.alertService.showSuccess(
                    "Success",
                    "Disconnect successful"
                );
                this.stateBulb.next(false);
                this.spinnerService.setSpinner(false);
            } catch (e) {
                this.alertService.showError("Error", "Disconnect unsuccessful");
                this.spinnerService.setSpinner(false);
            }
        } else {
            this.alertService.showError("Not device");
            this.spinnerService.setSpinner(false);
        }
    }

    update(red: number, green: number, blue: number, white: number): void {
        if (!this.magicBlue) {
            this.alertService.showError("Not connected to device");
            return;
        }
        // console.log("color=" + [56, red, green, blue, white, 240, 170]);
        let color = [86, red, green, blue, white, 240, 170]
            .map(param => {
                return this.convertToHexString(param);
            })
            .join("");
        color = HexHelper.hex2a(color);
        // console.log("Updating the color:" + HexHelper.hex2a(color));

        const updateMessage = this.getMessage(this.magicBlue.UUID, color);
        this.bluetoothService.write(updateMessage);
    }

    getMessage(UUID: string, value: string): BleMessage {
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
