import { Component, OnInit } from "@angular/core";
import { LightBulbCommandService } from "../shared/services/lightbulb-command.service";
import { BluetoothService } from "../shared/services/bluetooth.service";
import { Colors } from "../helpers/colors";
import { Slider } from "tns-core-modules/ui/slider/slider";
import { SpinnerService } from "../shared/services/spinner.service";

@Component({
    moduleId: module.id,
    selector: "ns-bulb-control",
    templateUrl: "bulb-control.component.html",
    styleUrls: ["bulb-control.component.css"]
})
export class BulbControlComponent implements OnInit {
    maxValue = 255;
    minValue = 0;
    Colors = Colors;
    redValue = 128;
    redValueTextField = "";
    greenValueTextField = "";
    blueValueTextField = "";
    greenValue = 200;
    blueValue = 120;
    whiteValue = 100;
    isLoading = false;
    bulbConnected = false;
    constructor(
        private lightBulbCommandService: LightBulbCommandService,
        private bluetoothService: BluetoothService,
        private spinnerService: SpinnerService
    ) {}
    connectToMagicBlue() {
        this.spinnerService.setSpinner(true);
        console.log("Connecting to device");
        this.lightBulbCommandService.connectToMagicBlue();
        this.lightBulbCommandService.stateBulbUpdated.subscribe(
            bulbConnected => {
                this.bulbConnected = bulbConnected;
                this.spinnerService.setSpinner(false);
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
