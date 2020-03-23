import { Injectable } from "@angular/core";
import { BleDevice } from "../models/ble-device.model";
import { Bluetooth } from "nativescript-bluetooth/bluetooth";
import { AlertService } from "./alert.service";

@Injectable()
export class BluetoothService {
    private bluetooth: Bluetooth = new Bluetooth();
    public bleDevicesAround: Array<BleDevice> = new Array();
    private scanTime = 3;

    constructor(private alertService: AlertService) {}
    write(bluetoothMessage): void {
        // console.log("Writing message: " + JSON.stringify(bluetoothMessage));

        this.bluetooth.write(bluetoothMessage).then(
            result => console.log("Value written " + JSON.stringify(result)),
            error => console.log("Write error: " + JSON.stringify(error))
        );
    }

    fixLocationPermission(): void {
        this.bluetooth.hasCoarseLocationPermission().then(granted => {
            console.log("Has location permission ? " + granted);

            if (!granted) {
                this.bluetooth
                    .requestCoarseLocationPermission()
                    .then(() => console.log("Location permission requested"));
            }
        });
    }

    connect(UUID: string): Promise<any> {
        return this.bluetooth.connect({
            UUID: UUID,
            onConnected: peripheral => {
                this.alertService.showSuccess(
                    "Periperhal connected with UUID: " + peripheral.UUID
                );
                console.log(
                    "Periperhal connected with UUID: " + peripheral.UUID
                );
                peripheral.services.forEach(service => {
                    console.log("Service found: " + JSON.stringify(service));
                });
            },
            onDisconnected: peripheral => {
                console.log(
                    "Periperhal disconnected with UUID: " + peripheral.UUID
                );
                this.alertService.showWarning(
                    "Periperhal disconnected with UUID: " + peripheral.UUID
                );
            }
        });
    }

    disconnect(UUID: string): void {
        this.bluetooth.disconnect({ UUID: UUID }).then(
            () => console.log("Disconnected successfully"),
            err => console.log("Disconnection error: " + err)
        );
    }

    scan(): Promise<any> {
        console.log("Scanning...");
        this.bleDevicesAround = new Array();

        return this.bluetooth
            .startScanning({
                // serviceUUIDs: [],
                seconds: this.scanTime,
                onDiscovered: device => {
                    console.log("UUID: " + device.UUID);
                    console.log("Name: " + device.name);
                    console.log("State: " + JSON.stringify(device.RSSI));

                    const bleDevice = new BleDevice(
                        device.UUID,
                        device.name,
                        ""
                    );
                    this.bleDevicesAround.push(bleDevice);
                }
            })
            .catch(e => {
                this.alertService.showError("Bluetooth error:", e);
            });
    }
}
