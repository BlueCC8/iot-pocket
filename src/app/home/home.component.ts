import { Component, OnInit } from "@angular/core";
import { MQTTService } from "../shared/services/mqtt.service";
import { Subscription } from "rxjs";
import { SpinnerService } from "../shared/services/spinner.service";
@Component({
    selector: "ns-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    loading: boolean = false;
    constructor(
        private mqttService: MQTTService,
        private spinnerService: SpinnerService
    ) {}
    ngOnInit() {}

    public connect() {
        this.spinnerService.setSpinner(true);
        this.mqttService.connect();
    }
}
