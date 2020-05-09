import { Component, OnInit, OnDestroy } from "@angular/core";
import { MQTTService } from "../shared/services/mqtt.service";
import { Subscription } from "rxjs";
import { SpinnerService } from "../shared/services/spinner.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TopicModel } from "../topics/models/topic.model";
import { ActivatedRoute } from "@angular/router";
import { DialogActionModel } from "../shared/models/dialog-action.model";
import { PromptMessage } from "../shared/models/prompt-message.mode";
@Component({
    selector: "ns-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
    public isLoading = false;
    public isConnected = false;

    private subs: Subscription[] = [];
    public topics: TopicModel[] = [];
    public selectedTopic = "";

    constructor(
        private mqttService: MQTTService,
        private spinnerService: SpinnerService,
        private route: ActivatedRoute
    ) {}
    ngOnInit(): void {
        const { queryParams } = this.route.snapshot;
        this.isConnected = queryParams["isConnected"]
            ? queryParams["isConnected"]
            : false;

        this.subs.push(
            this.mqttService.mqttServerUpdated.subscribe(
                (statusServer: boolean) => {
                    this.isConnected = statusServer;
                }
            )
        );
        this.subs.push(
            this.spinnerService.spinnerUpdated.subscribe(
                (spinnerState) => (this.isLoading = spinnerState)
            )
        );
        const firstLoaded = this.mqttService.topicsList;

        this.topics = firstLoaded;
        this.subs.push(
            this.mqttService.topicsUpdated.subscribe((loadedTopics) => {
                this.topics = loadedTopics;
            })
        );
    }
    sendMessage(topics): void {
        const topicsNames = [];

        topics.forEach((topic: TopicModel) => {
            if (topicsNames.indexOf(topic.topicName) == -1) {
                topicsNames.push(topic.topicName);
            }
        });
        const availableDialog: DialogActionModel = {
            message: "Select available topics",
            cancelButtonText: "Cancel",
            actions: topicsNames,
        };
        const promptMessage: PromptMessage = {
            title: `Message to the ${this.selectedTopic} topic`,
            message: "Enter your message",
            okButtonText: "Send",
            cancelButtonText: "Cancel",
            defaultText: "Default message",
            inputType: dialogs.inputType.text,
        };
        dialogs.action(availableDialog).then((result) => {
            this.selectedTopic = result;
            if (this.selectedTopic !== "Cancel") {
                dialogs.prompt(promptMessage).then((res) => {
                    if (res.result) {
                        this.mqttService.publish(res.text, this.selectedTopic);
                    } else {
                        alert("Message cancelled");
                    }
                });
            } else {
                alert("Unselected topic");
            }
        });
    }
    public connect(): void {
        this.spinnerService.setSpinner(true);
        this.mqttService.connect();
    }
    public disconnect(): void {
        this.spinnerService.setSpinner(true);
        this.mqttService.disconnect();
    }
    ngOnDestroy(): void {
        this.subs.forEach((sub) => sub.unsubscribe());
    }
}
