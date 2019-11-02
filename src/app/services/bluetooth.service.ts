import { Injectable } from '@angular/core';
import { BleDevice } from '../models/ble-device.model';
import { Bluetooth } from 'nativescript-bluetooth/bluetooth';

@Injectable()
export class BluetoothService {
    bluetooth: Bluetooth = new Bluetooth();
    bleDevicesAround: Array<BleDevice> = new Array();

    write(bluetoothMessage): void {
        console.log('Writing message: ' + JSON.stringify(bluetoothMessage));

        this.bluetooth
            .write(bluetoothMessage)
            .then(
                result =>
                    console.log('Value written ' + JSON.stringify(result)),
                error => console.log('Write error: ' + JSON.stringify(error)),
            );
    }

    fixPermission(): void {
        this.bluetooth.hasCoarseLocationPermission().then(granted => {
            console.log('Has location permission ? ' + granted);

            if (!granted) {
                this.bluetooth
                    .requestCoarseLocationPermission()
                    .then(() => console.log('Location permission requested'));
            }
        });
    }

    connect(UUID: string): Promise<any> {
        return this.bluetooth.connect({
            UUID: UUID,
            onConnected: peripheral => {
                console.log(
                    'Periperhal connected with UUID: ' + peripheral.UUID,
                );
                peripheral.services.forEach(function(service) {
                    console.log('Service found: ' + JSON.stringify(service));
                });
            },
            onDisconnected: peripheral => {
                console.log(
                    'Periperhal disconnected with UUID: ' + peripheral.UUID,
                );
            },
        });
    }

    disconnect(UUID: string): void {
        this.bluetooth
            .disconnect({ UUID: UUID })
            .then(
                () => console.log('Disconnected successfully'),
                err => console.log('Disconnection error: ' + err),
            );
    }

    scan(): Promise<any> {
        console.log('Scanning...');
        this.bleDevicesAround = new Array();

        return this.bluetooth.startScanning({
            // serviceUUIDs: [],
            seconds: 3,
            onDiscovered: device => {
                console.log('UUID: ' + device.UUID);
                console.log('Name: ' + device.name);
                console.log('State: ' + JSON.stringify(device.RSSI));

                const bleDevice = new BleDevice(device.UUID, device.name, '');
                this.bleDevicesAround.push(bleDevice);
            },
        });
    }
}
