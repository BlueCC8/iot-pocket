import { Component, OnInit, OnDestroy } from "@angular/core";
import { MQTTService } from "../shared/services/mqtt.service";
import { Subscription } from "rxjs";
import { SpinnerService } from "../shared/services/spinner.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
@Component({
    selector: "ns-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
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
        this.subs.push(
            this.spinnerService.spinnerUpdated.subscribe(
                spinnerState => (this.isLoading = spinnerState)
            )
        );
    }
    sendMessage() {
        dialogs
            .prompt({
                title: "Message to the current topic",
                message: "Enter your message",
                okButtonText: "Send",
                cancelButtonText: "Cancel",
                defaultText: "Default text",
                inputType: dialogs.inputType.text
            })
            .then(res => {
                // alert("Dialog result: " + res.result + ", text: " + res.text);
                this.mqttService.publish(res.text);
            });
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
