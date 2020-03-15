import { Component, OnInit, OnDestroy } from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import { alert } from "tns-core-modules/ui/dialogs";
import { ServerModel } from "../models/server.model";
import { SpinnerService } from "../shared/services/spinner.service";
import { MQTTService } from "../shared/services/mqtt.service";
import { ClientOptions } from "nativescript-mqtt";
import { AlertService } from "../shared/services/alert.service";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";

@Component({
    selector: "ns-server-details",
    moduleId: module.id,
    templateUrl: "./server-details.component.html",
    styleUrls: ["./server-details.component.css"]
})
export class ServerDetailsComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    subs: Subscription[] = [];
    serverModel: ServerModel = new ServerModel(null);
    constructor(
        private spinnerService: SpinnerService,
        private mqttService: MQTTService,
        private alertService: AlertService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.spinnerService.spinnerUpdated.subscribe(
                spinnerState => (this.isLoading = spinnerState)
            )
        );
        // TODO: For multiple servers a new date must be concatinated

        Object.keys(this.serverModel).forEach(key => {
            if (typeof this.serverModel[key] === "number") {
                this.serverModel[key] = appSettings.getNumber(
                    key,
                    this.serverModel[key]
                );
            } else if (typeof this.serverModel[key] === "string") {
                this.serverModel[key] = appSettings.getString(
                    key,
                    this.serverModel[key]
                );
            } else if (typeof this.serverModel[key] === "boolean") {
                this.serverModel[key] = appSettings.getBoolean(
                    key,
                    this.serverModel[key]
                );
            }
        });
    }

    saveNumber(key, number) {
        if (!isNaN(parseFloat(number))) {
            appSettings.setNumber(key, parseFloat(number));
            // alert("You saved: " + appSettings.getNumber(key));
        }
    }

    removeNumber(key) {
        appSettings.remove(key);
        this.serverModel[key] = 0;
        // alert("You removed the number from app settings!");
    }

    saveString(key, str) {
        appSettings.setString(key, str);
        // alert("You saved: " + appSettings.getString(key));
    }

    removeString(key) {
        appSettings.remove(key);
        this.serverModel[key] = "";
        // alert("You removed the string from app settings!");
    }

    saveBoolean(key, bool) {
        appSettings.setBoolean(key, bool);
        // alert("You saved new: " + appSettings.getBoolean(key));
    }

    removeBoolean(key) {
        appSettings.remove(key);
        this.serverModel[key] = false;
        // alert("You removed the boolean from app settings!");
    }
    goBack() {
        this.location.back();
    }
    save() {
        Object.keys(this.serverModel).forEach(key => {
            if (typeof this.serverModel[key] === "number") {
                this.saveNumber(key, this.serverModel[key]);
            } else if (typeof this.serverModel[key] === "string") {
                this.saveString(key, this.serverModel[key]);
            } else if (typeof this.serverModel[key] === "boolean") {
                this.saveBoolean(key, this.serverModel[key]);
            }
        });
        const mqtt_clientOptions: ClientOptions = {
            host: this.serverModel.host,
            port: this.serverModel.port,
            useSSL: this.serverModel.useSSL,
            path: this.serverModel.path,
            cleanSession: this.serverModel.cleanSession
        };
        this.spinnerService.setSpinner(true);
        this.mqttService.setupClientOptions(
            this.serverModel.username,
            this.serverModel.password,
            this.serverModel.topic,
            mqtt_clientOptions
        );
        this.mqttService.connect();
    }
    removeAll() {
        appSettings.clear();
        Object.keys(this.serverModel).forEach(key => {
            if (typeof this.serverModel[key] === "number") {
                this.serverModel[key] = 0;
            } else if (typeof this.serverModel[key] === "string") {
                this.serverModel[key] = "";
            } else if (typeof this.serverModel[key] === "boolean") {
                this.serverModel[key] = false;
            }
        });
        this.serverModel = new ServerModel(null);
        this.alertService.showSuccess(
            "All app settings values have been cleared!"
        );
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
