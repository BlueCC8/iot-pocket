import { Component, OnInit, OnDestroy } from "@angular/core";
import { MQTTService } from "../shared/services/mqtt.service";
import { Subscription } from "rxjs";
import { SpinnerService } from "../shared/services/spinner.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TopicModel } from "../models/topic.model";
import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "ns-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    isConnected: boolean = false;
    subs: Subscription[] = [];
    topics: TopicModel[] = [];
    selectedTopic = "";
    constructor(
        private mqttService: MQTTService,
        private spinnerService: SpinnerService,
        private route: ActivatedRoute
    ) {}
    ngOnInit() {
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
                spinnerState => (this.isLoading = spinnerState)
            )
        );
        const firstLoaded = this.mqttService.topicsList;
        console.log("Home first loaded");
        this.topics = firstLoaded;
        this.subs.push(
            this.mqttService.topicsUpdated.subscribe(loadedTopics => {
                // console.log("Home loaded");
                // console.log(loadedTopics);
                this.topics = loadedTopics;
            })
        );
    }
    sendMessage(topics) {
        const topicsNames = [];
        topics.forEach((topic: TopicModel) => {
            if (topicsNames.indexOf(topic.topicName) == -1) {
                topicsNames.push(topic.topicName);
            }
        });
        dialogs
            .action({
                message: "Select available topics",
                cancelButtonText: "Cancel",
                actions: topicsNames
            })
            .then(result => {
                this.selectedTopic = result;
                if (this.selectedTopic !== "Cancel") {
                    dialogs
                        .prompt({
                            title: `Message to the ${this.selectedTopic} topic`,
                            message: "Enter your message",
                            okButtonText: "Send",
                            cancelButtonText: "Cancel",
                            defaultText: "Default message",
                            inputType: dialogs.inputType.text
                        })
                        .then(res => {
                            if (res.result) {
                                this.mqttService.publish(
                                    res.text,
                                    this.selectedTopic
                                );
                            } else {
                                alert("Message cancelled");
                            }
                        });
                } else {
                    alert("Unselected topic");
                }
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
