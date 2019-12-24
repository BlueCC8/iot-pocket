import { Component, OnInit } from "@angular/core";
import { LightBulbCommandService } from "../services/lightbulb-command.service";
import { BluetoothService } from "../services/bluetooth.service";

@Component({
    moduleId: module.id,
    selector: "ns-bulb-control",
    templateUrl: "bulb-control.component.html",
    styleUrls: ["bulb-control.component.css"]
})
export class BulbControlComponent implements OnInit {
    maxValue = 255;
    minValue = 0;

    redValue = 128;
    greenValue = 200;
    blueValue = 120;
    whiteValue = 100;
    isLoading = false;
    bulbConnected = false;
    constructor(
        private lightBulbCommandService: LightBulbCommandService,
        private bluetoothService: BluetoothService
    ) {}

    connectToMagicBlue() {
        this.isLoading = true;
        console.log("Connecting to device");
        this.lightBulbCommandService.connectToMagicBlue();
        this.lightBulbCommandService.stateBulbUpdated.subscribe(
            bulbConnected => {
                this.bulbConnected = bulbConnected;
                this.isLoading = false;
            }
        );
    }

    ngOnInit() {
        this.bluetoothService.fixPermission();
    }

    updateLightBulb() {
        console.log("Update color");
        this.lightBulbCommandService.update(
            this.redValue,
            this.greenValue,
            this.blueValue,
            this.whiteValue
        );
    }
}
