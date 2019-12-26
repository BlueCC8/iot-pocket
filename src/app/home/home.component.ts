import { Component, OnInit, OnDestroy } from "@angular/core";
import { MQTTService } from "../shared/services/mqtt.service";
import { Subscription } from "rxjs";
import { SpinnerService } from "../shared/services/spinner.service";
@Component({
    selector: "ns-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    isConnected: boolean = false;
    subs: Subscription[] = [];
    constructor(
        private mqttService: MQTTService,
        private spinnerService: SpinnerService
    ) {}
    ngOnInit() {
        this.subs.push(
            this.mqttService.mqttServerUpdated.subscribe(
                (statusServer: boolean) => {
                    this.isConnected = statusServer;
                }
            )
        );
    }

    public connect() {
        this.spinnerService.setSpinner(true);
        this.mqttService.connect();
    }
    public disconnect() {
        this.spinnerService.setSpinner(true);
        this.mqttService.disconnect();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
