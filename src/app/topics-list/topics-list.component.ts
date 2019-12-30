import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy
} from "@angular/core";
import { TopicModel } from "../models/topic.model";
import { TopicsService } from "./topics.service";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";
import { Subscription } from "rxjs";
@Component({
    selector: "ns-topics-list",
    templateUrl: "./topics-list.component.html",
    styleUrls: ["./topics-list.component.css"]
})
export class TopicsListComponent implements OnInit, OnDestroy {
    @ViewChild("topicTextField", { static: false }) topicTextField: ElementRef;
    topicName = "";
    isLoading = false;
    listLoaded = false;
    topicsList: TopicModel[] = [];
    subs: Subscription[] = [];
    public items = new Array<any>(
        { id: 1, name: "Light bulb", role: "Actuator", type: "bulb" },
        { id: 3, name: "Piqué", role: "Defender", type: "router" },
        {
            id: 4,
            name: "I. Rakitic",
            role: "Midfielder",
            type: "wireless sensor"
        }
    );
    constructor(private topicsService: TopicsService) {}

    ngOnInit() {
        const firstLoaded = this.topicsService.topicsList;
        this.subs.push(
            this.topicsService.topicsUpdated.subscribe(loadedTopics => {
                console.log("Topics updated");
                loadedTopics.forEach((topicObj: TopicModel) => {
                    this.topicsList.unshift(topicObj);
                });
                console.log(loadedTopics);
            })
        );
        this.topicsList = firstLoaded;
        console.log("First loaded");
        console.log(firstLoaded);
    }

    add() {
        if (this.topicName.trim() === "") {
            alert("Enter a topic item");
            return;
        }
        // Dismiss the keyboard
        let textField = this.topicTextField.nativeElement;
        textField.dismissSoftInput();
        const topicModel = new TopicModel();

        topicModel.topicName = this.topicName;
        this.topicsList.push(topicModel);
        this.topicsService.setTopics(this.topicsList);
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
        this.topicsService.setTopics(this.topicsList);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
