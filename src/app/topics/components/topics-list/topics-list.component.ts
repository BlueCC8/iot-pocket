import { Component, OnInit, OnDestroy } from "@angular/core";
import { TopicModel } from "../../models/topic.model";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";
import { Subscription } from "rxjs";
import { MQTTService } from "../../../shared/services/mqtt.service";
import { Location } from "@angular/common";
@Component({
    selector: "ns-topics-list",
    templateUrl: "./topics-list.component.html",
    styleUrls: ["./topics-list.component.css"]
})
export class TopicsListComponent implements OnInit, OnDestroy {
    public topicName = "";
    public newTopicName = "";
    public isLoading = false;
    public listLoaded = false;
    public topicsList: TopicModel[] = [];

    private subs: Subscription[] = [];

    constructor(private mqttService: MQTTService, private location: Location) {}

    ngOnInit(): void {
        const firstLoaded = this.mqttService.topicsList;
        this.topicsList = firstLoaded;

        this.subs.push(
            this.mqttService.topicsUpdated.subscribe(loadedTopics => {
                console.log("Topics updated");
                this.topicsList = loadedTopics;
                console.log(loadedTopics);
            })
        );
    }

    add(): void {
        if (this.newTopicName.trim() === "") {
            alert("Enter a topic item");
            return;
        }
        const topicModel = new TopicModel(null);
        topicModel.topicName = this.newTopicName;
        this.topicsList.push(topicModel);
        this.mqttService.setTopics(this.topicsList);
        this.newTopicName = "";
    }
    delete(args: ListViewEventData): void {
        let topic = <TopicModel>args.object.bindingContext;
        let index = this.topicsList.indexOf(topic);

        this.topicsList.splice(index, 1);
        this.mqttService.setTopics(this.topicsList);
    }
    goBack(): void {
        this.location.back();
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
