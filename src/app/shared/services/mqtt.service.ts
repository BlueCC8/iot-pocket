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
import { TopicModel } from "~/app/models/topic.model";
import { MessageModel } from "~/app/models/message.model";

@Injectable()
export class MQTTService {
    mqtt_username: string = "";
    mqtt_password: string = "";
    mqtt_topic: string = "";

    mqtt_clientOptions: ClientOptions;

    mqtt_client: MQTTClient;
    private mqttServerActive = new Subject<boolean>();
    public mqttServerUpdated = this.mqttServerActive.asObservable();
    public topicsList: TopicModel[] = [];
    private topicsSubject = new Subject<TopicModel[]>();
    public topicsUpdated = this.topicsSubject.asObservable();

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
    setTopics(topics: TopicModel[], sourceMethod?) {
        console.log(sourceMethod);
        console.log("Service topics");
        console.log(topics);
        topics.forEach((topic: TopicModel, index) => {
            if (topic.id === null) {
                topic.id = index + 1;
                this.subscribe(topic);
            }
        });
        this.topicsList = topics;
        console.log("Set topics");
        console.log(topics);
        this.topicsSubject.next(topics);
    }
    getTopic(id: number): TopicModel {
        return this.topicsList.filter(item => item.id === id)[0];
    }
    connect(): void {
        try {
            this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
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
    unsubscribe(topicName?): void {
        try {
            const topicModel = new TopicModel();

            topicModel.topicName = topicName ? topicName : this.mqtt_topic;
            console.log("Unsubscribe=" + topicModel.topicName);
            this.topicsList = this.topicsList.filter(
                topic => topic.topicName !== topicModel.topicName
            );

            this.setTopics([...this.topicsList], "unsubscribe");
            this.mqtt_client.unsubscribe(topicModel.topicName);
            this.alertService.showSuccess(
                "Unsubscribed topic:",
                topicModel.topicName
            );
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    subscribe(topic: TopicModel): void {
        try {
            const opts: SubscribeOptions = {
                qos: 0
            };

            topic.topicName = topic ? topic.topicName : this.mqtt_topic;
            console.log("Subscribe=" + topic.topicName);
            topic.date = new Date()
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            // this.setTopics([...this.topics], "subscribe");
            this.mqtt_client.subscribe(topic.topicName, opts);
            this.alertService.showSuccess("Subscribed topic:", topic.topicName);
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    publish(mess: string, destinationName: string): void {
        try {
            console.log(mess);
            const message = new Message({
                qos: 0,
                destinationName: destinationName,
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
            this.setServerStatus(true);
            this.spinnerService.setSpinner(false);
            // this.subscribe(null);
            this.router.navigate(["home"], {
                queryParams: { isConnected: true }
            });
        });

        this.mqtt_client.onConnectionLost.on(err => {
            this.alertService.showWarning("Connection lost: ", err);
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["home"], {
                queryParams: { isConnected: false }
            });
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            const changedTopics = [...this.topicsList];
            console.log("Mesage arrived");
            console.log(this.topicsList);
            console.log(changedTopics);
            changedTopics.forEach((topic: TopicModel) => {
                if (topic.topicName === message.topic) {
                    const time = new Date()
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");

                    const messageModel: MessageModel = new MessageModel();
                    messageModel.message = message.payload;
                    messageModel.date = time;
                    topic.messages.push(messageModel);
                }
            });

            this.setTopics(changedTopics, "new message");
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
