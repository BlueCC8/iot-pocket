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
    mqtt_username: string = "";
    mqtt_password: string = "";
    mqtt_topic: string = "";

    mqtt_clientOptions: ClientOptions;

    mqtt_client: MQTTClient;
    private mqttServerActive = new BehaviorSubject<boolean>(false);
    public mqttServerUpdated = this.mqttServerActive.asObservable();

    constructor(
        private router: Router,
        private spinnerService: SpinnerService,
        private alertService: AlertService
    ) {}
    setupClientOptions(
        username,
        password,
        topic,
        mqtt_clientOptions: ClientOptions
    ) {
        this.mqtt_username = username;
        this.mqtt_password = password;
        this.mqtt_topic = topic;
        this.mqtt_clientOptions = mqtt_clientOptions;
        this.mqtt_client = new MQTTClient(this.mqtt_clientOptions);
        this.setupHandlers();
    }
    connect(): void {
        try {
            this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
            this.setServerStatus(true);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/"]);
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
            console.log("Subscribe=" + this.mqtt_topic);
            this.mqtt_client.subscribe(this.mqtt_topic, opts);
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    publish(mess: string): void {
        try {
            console.log(mess);
            const message = new Message({
                qos: 0,
                destinationName: this.mqtt_topic,
                payloadBytes: null,
                payloadString: mess,
                retained: true
            });
            this.mqtt_client.publish(message);
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
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/"]);
        });

        this.mqtt_client.onConnectionSuccess.on(() => {
            this.alertService.showSuccess(
                "Success",
                "Connected succesfully to the MQTT server!"
            );
            this.subscribe();
        });

        this.mqtt_client.onConnectionLost.on(err => {
            this.alertService.showWarning("Connection lost: ", err);
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/"]);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            this.alertService.showInfo("Message received: ", message.payload);
        });

        this.mqtt_client.onMessageDelivered.on((message: Message) => {
            this.alertService.showSuccess(
                "Message delivered: ",
                message.payload
            );
        });
    }
}
