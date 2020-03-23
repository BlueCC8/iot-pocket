import { Component, OnInit, OnDestroy } from "@angular/core";
import { LightBulbCommandService } from "../../services/lightbulb-command.service";
import { BluetoothService } from "../../../shared/services/bluetooth.service";
import { Colors } from "../../../shared/helpers/enum.helper";
import { SpinnerService } from "../../../shared/services/spinner.service";
import { Subscription } from "rxjs/internal/Subscription";

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
        private spinnerService: SpinnerService
    ) {}
    connectToMagicBlue(): void {
        this.spinnerService.setSpinner(true);
        this.lightBulbCommandService.connectToMagicBlue();
    }
    disconnectToMagicBlue(): void {
        this.spinnerService.setSpinner(true);
        this.lightBulbCommandService.disconnectMagicBlue(this.magicBlue);
    }

    ngOnInit(): void {
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

    updateLightBulb(): void {
        this.lightBulbCommandService.update(
            this.redValue,
            this.greenValue,
            this.blueValue,
            this.whiteValue
        );
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
