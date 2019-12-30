import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy
} from "@angular/core";
import { TopicModel } from "../models/topic.model";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";
import { Subscription } from "rxjs";
import { MQTTService } from "../shared/services/mqtt.service";
@Component({
    selector: "ns-topics-list",
    templateUrl: "./topics-list.component.html",
    styleUrls: ["./topics-list.component.css"]
})
export class TopicsListComponent implements OnInit, OnDestroy {
    topicName = "";
    newTopicName = "";
    isLoading = false;
    listLoaded = false;
    topicsList: TopicModel[] = [];
    subs: Subscription[] = [];
    constructor(private mqttService: MQTTService) {}

    ngOnInit() {
        const firstLoaded = this.mqttService.topicsList;
        this.subs.push(
            this.mqttService.topicsUpdated.subscribe(loadedTopics => {
                console.log("Topics updated");
                this.topicsList = loadedTopics;
                console.log(loadedTopics);
            })
        );
        this.topicsList = firstLoaded;
        console.log("First loaded");
        console.log(firstLoaded);
    }

    add() {
        if (this.newTopicName.trim() === "") {
            alert("Enter a topic item");
            return;
        }
        const topicModel = new TopicModel();
        topicModel.topicName = this.newTopicName;
        this.topicsList.push(topicModel);
        this.mqttService.setTopics(this.topicsList);
        this.newTopicName = "";
    }
    onSwipeCellStarted(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args.object;
        var rightItem = swipeView.getViewById<View>("delete-view");
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = 0;
        swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
    }
    delete(args: ListViewEventData) {
        let topic = <TopicModel>args.object.bindingContext;
        let index = this.topicsList.indexOf(topic);

        this.topicsList.splice(index, 1);
        this.mqttService.setTopics(this.topicsList);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
