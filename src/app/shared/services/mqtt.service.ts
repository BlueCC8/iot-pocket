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
import { TopicModel } from "~/app/topics/models/topic.model";
import { MessageModel } from "~/app/models/message.model";
import { QualityOfService } from "~/app/shared/helpers/enum.helper";

@Injectable()
export class MQTTService {
    private username = "";
    private password = "";
    private topic = "";
    private clientOptions: ClientOptions;
    private client: MQTTClient;

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
        username = "",
        password = "",
        topic = "",
        clientOptions: ClientOptions
    ) {
        this.username = username;
        this.password = password;
        this.topic = topic;
        this.clientOptions = clientOptions;
        this.client = new MQTTClient(this.clientOptions);

        this.setupHandlers();
    }
    setTopics(topics: TopicModel[]): void {
        //TODO: Remove this:
        console.log("Service topics");
        console.log(topics);

        topics.forEach((topic: TopicModel, index) => {
            if (topic.id === null) {
                topic.id = index + 1;
                this.subscribe(topic);
            }
        });
        this.topicsList = topics;

        //TODO: Remove this:
        console.log("Set topics");
        console.log(topics);

        this.topicsSubject.next(topics);
    }
    getTopic(id: number): TopicModel {
        return this.topicsList.filter(item => item.id === id)[0];
    }
    connect(): void {
        try {
            this.client.connect(this.username, this.password);
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    disconnect(): void {
        try {
            this.client.disconnect();
            this.spinnerService.setSpinner(false);
            this.mqttServerActive.next(false);
            this.alertService.showSuccess("Success", "Disconnected!");
        } catch (e) {
            this.alertService.showError("Caughert error:", e);
        }
    }
    unsubscribe(topicName?): void {
        try {
            const topicModel = new TopicModel(null);

            topicModel.topicName = topicName ? topicName : this.topic;
            this.topicsList = this.topicsList.filter(
                topic => topic.topicName !== topicModel.topicName
            );

            this.setTopics([...this.topicsList]);
            this.client.unsubscribe(topicModel.topicName);
            this.alertService.showSuccess(
                "Unsubscribed topic:",
                topicModel.topicName
            );
        } catch (e) {
            this.alertService.showError("Caught error: ", e);
        }
    }
    subscribe(topic: TopicModel, qos = QualityOfService.BestEffort): void {
        try {
            const opts: SubscribeOptions = { qos };

            topic.topicName = topic ? topic.topicName : this.topic;

            //TODO: Remove this
            console.log("Subscribe=" + topic.topicName);

            topic.date = new Date()
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            this.client.subscribe(topic.topicName, opts);
            this.alertService.showSuccess("Subscribed topic:", topic.topicName);
        } catch (e) {
            this.alertService.showError("Caught error: ", JSON.stringify(e));
        }
    }
    publish(
        mess: string,
        destinationName: string,
        retained = true,
        qos = QualityOfService.BestEffort,
        bytes = null
    ): void {
        try {
            const message = new Message({
                qos,
                destinationName,
                payloadBytes: bytes,
                payloadString: mess,
                retained
            });
            this.client.publish(message);
        } catch (e) {
            this.alertService.showError("Caught error: ", JSON.stringify(e));
        }
    }

    setServerStatus(status: boolean): void {
        this.mqttServerActive.next(status);
    }

    setupHandlers(): void {
        this.client.onConnectionFailure.on(err => {
            this.alertService.showError("Connection failed: ", err);
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["/"]);
        });

        this.client.onConnectionSuccess.on(() => {
            this.alertService.showSuccess(
                "Success",
                "Connected succesfully to the MQTT server!"
            );
            this.setServerStatus(true);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["home"], {
                queryParams: { isConnected: true }
            });
        });

        this.client.onConnectionLost.on(err => {
            this.alertService.showWarning("Connection lost: ", err);
            this.setServerStatus(false);
            this.spinnerService.setSpinner(false);
            this.router.navigate(["home"], {
                queryParams: { isConnected: false }
            });
        });

        this.client.onMessageArrived.on((message: Message) => {
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

                    const messageModel: MessageModel = new MessageModel(null);
                    messageModel.message = message.payload;
                    messageModel.date = time;
                    topic.messages.push(messageModel);
                }
            });

            this.setTopics(changedTopics);
            this.alertService.showInfo("Message received: ", message.payload);
        });

        this.client.onMessageDelivered.on((message: Message) => {
            this.alertService.showSuccess(
                "Message delivered: ",
                message.payload
            );
        });
    }
}
