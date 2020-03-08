import { Component, OnInit, OnDestroy } from "@angular/core";
import { LightBulbCommandService } from "../../services/lightbulb-command.service";
import { BluetoothService } from "../../../shared/services/bluetooth.service";
import { Colors } from "../../../helpers/colors";
import { Slider } from "tns-core-modules/ui/slider/slider";
import { SpinnerService } from "../../../shared/services/spinner.service";
import { AlertService } from "../../../shared/services/alert.service";
import { Subscription } from "rxjs";

@Component({
    moduleId: module.id,
    selector: "ns-bulb-control",
    templateUrl: "bulb-control.component.html",
    styleUrls: ["bulb-control.component.css"]
})
export class BulbControlComponent implements OnInit, OnDestroy {
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
    magicBlue: any;
    subs: Subscription[] = [];
    constructor(
        private lightBulbCommandService: LightBulbCommandService,
        private bluetoothService: BluetoothService,
        private spinnerService: SpinnerService,
        private alertService: AlertService
    ) {}
    connectToMagicBlue() {
        this.spinnerService.setSpinner(true);
        console.log("Connecting to device");
        this.lightBulbCommandService.connectToMagicBlue();
    }
    disconnectToMagicBlue() {
        this.spinnerService.setSpinner(true);
        this.lightBulbCommandService.disconnectToMagicBlue(this.magicBlue);
    }

    ngOnInit() {
        this.subs.push(
            this.lightBulbCommandService.stateBulbUpdated.subscribe(
                bulbConnected => {
                    this.bulbConnected = bulbConnected;
                }
            )
        );
        this.subs.push(
            this.lightBulbCommandService.stateMagicBlueUpdated.subscribe(
                magicBlue => {
                    this.magicBlue = magicBlue;
                }
            )
        );
        this.subs.push(
            this.spinnerService.spinnerUpdated.subscribe(
                spinnerState => (this.isLoading = spinnerState)
            )
        );
        this.bluetoothService.fixLocationPermission();
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
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
