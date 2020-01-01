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

@Injectable()
export class MQTTService {
    topics: TopicModel[] = [];
    mqtt_username: string = "";
    mqtt_password: string = "";
    mqtt_topic: string = "";

    mqtt_clientOptions: ClientOptions;

    mqtt_client: MQTTClient;
    private mqttServerActive = new BehaviorSubject<boolean>(false);
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
    setTopics(topics: TopicModel[]) {
        console.log("Service topics");
        console.log(topics);
        topics.forEach((topic: TopicModel, index) => {
            if (topic.id === null) {
                topic.id = index + 1;
                this.subscribe(topic.topicName);
            }
        });
        // topics = topics.filter((item, pos) => {
        //     return topics.indexOf(item) == pos;
        // });
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
    unsubscribe(topicName?): void {
        try {
            const topicModel = new TopicModel();

            topicModel.topicName = topicName ? topicName : this.mqtt_topic;
            console.log("Unsubscribe=" + topicModel.topicName);
            this.topics = this.topics.filter(
                topic => topic.topicName !== topicModel.topicName
            );

            this.setTopics([...this.topics]);
            this.mqtt_client.unsubscribe(topicModel.topicName);
            this.alertService.showSuccess(
                "Unsubscribed topic:",
                topicModel.topicName
            );
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    subscribe(topicName?): void {
        try {
            const opts: SubscribeOptions = {
                qos: 0
            };
            const topicModel = new TopicModel();

            topicModel.topicName = topicName ? topicName : this.mqtt_topic;
            console.log("Subscribe=" + topicModel.topicName);
            topicModel.id = this.topics.push(topicModel);

            this.setTopics([...this.topics]);
            this.mqtt_client.subscribe(topicModel.topicName, opts);
            this.alertService.showSuccess(
                "Subscribed topic:",
                topicModel.topicName
            );
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
            this.subscribe();
        });

        this.mqtt_client.onConnectionLost.on(err => {
            this.alertService.showWarning("Connection lost: ", err);
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/"]);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            const changedTopics = [...this.topics];
            changedTopics.forEach((topic: TopicModel) => {
                if (topic.topicName === message.topic) {
                    topic.messages.push(message.payload);
                }
            });
            this.setTopics(changedTopics);
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
