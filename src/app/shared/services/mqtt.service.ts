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
    constructor(
        private router: Router,
        private spinnerService: SpinnerService,
        private alertService: AlertService
    ) {
        this.mqtt_client = new MQTTClient(this.mqtt_clientOptions);
        this.setupHandlers();
    }
    public connect(username?, password?): void {
        try {
            this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
            this.spinnerService.setSpinner(false);
            this.alertService.showSuccess(
                "Succes",
                "You connected succesfully to the MQTT server"
            );
            this.router.navigate(["/items"]);
        } catch (e) {
            console.log("Caught error: " + e);
        }
    }
    subscribe(): void {
        try {
            const opts: SubscribeOptions = {
                qos: 0
            };

            this.mqtt_client.subscribe(this.mqtt_topic, opts);
        } catch (e) {
            console.log("Caught error: " + e);
        }
    }
    setupHandlers(): void {
        this.mqtt_client.onConnectionFailure.on(err => {
            console.log("Connection failed: " + err);
        });

        this.mqtt_client.onConnectionSuccess.on(() => {
            console.log("Connected successfully!");
            this.subscribe();
        });

        this.mqtt_client.onConnectionLost.on(err => {
            console.log("Connection lost: " + err);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            console.log("Message received: " + message.payload);
        });

        this.mqtt_client.onMessageDelivered.on((message: Message) => {
            console.log("Message delivered: " + message.payload);
        });
    }
}
