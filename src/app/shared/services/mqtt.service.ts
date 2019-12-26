import { Injectable } from "@angular/core";

import {
    ClientOptions,
    MQTTClient,
    SubscribeOptions,
    Message
} from "nativescript-mqtt";
import { Router } from "@angular/router";
import { SpinnerService } from "./spinner.service";
import { AlertService } from "./alert.service";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable()
export class MQTTService {
    mqtt_host: string = "broker.mqttdashboard.com";
    mqtt_port: number = 8000;
    mqtt_useSSL: boolean = false;
    mqtt_path: string = "/mqtt";
    mqtt_username: string = "";
    mqtt_password: string = "";
    mqtt_topic: string = "safeTopic";
    mqtt_cleanSession: boolean = true;
    client;
    mqtt_clientOptions: ClientOptions = {
        host: this.mqtt_host,
        port: this.mqtt_port,
        useSSL: this.mqtt_useSSL,
        path: this.mqtt_path,
        cleanSession: this.mqtt_cleanSession
    };

    mqtt_client: MQTTClient;
    private mqttServerActive = new BehaviorSubject<boolean>(false);
    public mqttServerUpdated = this.mqttServerActive.asObservable();

    constructor(
        private router: Router,
        private spinnerService: SpinnerService,
        private alertService: AlertService
    ) {
        this.mqtt_client = new MQTTClient(this.mqtt_clientOptions);
        this.setupHandlers();
    }
    connect(username?, password?): void {
        try {
            this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/items"]);
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    disconnect() {
        try {
            this.mqtt_client.disconnect();
            this.spinnerService.setSpinner(false);
            this.mqttServerActive.next(false);
            this.alertService.showSuccess("Success", "Disconnected!");
        } catch (e) {
            this.alertService.showError("Caughert error:", e);
        }
    }
    subscribe(): void {
        try {
            const opts: SubscribeOptions = {
                qos: 0
            };

            this.mqtt_client.subscribe(this.mqtt_topic, opts);
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    setServerStatus(status: boolean) {
        this.mqttServerActive.next(status);
    }
    setupHandlers(): void {
        this.mqtt_client.onConnectionFailure.on(err => {
            this.alertService.showError("Connection failed: ", err);
        });

        this.mqtt_client.onConnectionSuccess.on(() => {
            this.alertService.showSuccess(
                "Success",
                "Connected succesfully to the MQTT server!"
            );
            this.setServerStatus(true);
            this.subscribe();
        });

        this.mqtt_client.onConnectionLost.on(err => {
            this.alertService.showWarning("Connection lost: ", err);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            this.alertService.showInfo("Message received: ", message.payload);
        });

        this.mqtt_client.onMessageDelivered.on((message: Message) => {
            this.alertService.showInfo("Message delivered: ", message.payload);
        });
    }
}
