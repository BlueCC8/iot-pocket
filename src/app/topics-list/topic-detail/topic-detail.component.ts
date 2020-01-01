import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TopicModel } from "~/app/models/topic.model";
import { MQTTService } from "~/app/shared/services/mqtt.service";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
    selector: "ns-topic-detail",
    templateUrl: "./topic-detail.component.html"
})
export class TopicDetailComponent implements OnInit, OnDestroy {
    topic: TopicModel;
    subs: Subscription[] = [];
    topicsList: TopicModel[] = [];
    constructor(
        private mqttService: MQTTService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        const firstLoaded = this.mqttService.topicsList;
        this.subs.push(
            this.mqttService.topicsUpdated.subscribe(loadedTopics => {
                console.log("Topics updated");
                this.topicsList = loadedTopics;
                this.topic = this.topicsList.find(topic => topic.id === id);
                console.log(loadedTopics);
            })
        );
        this.topicsList = firstLoaded;

        this.topic = this.topicsList.find(topic => topic.id === id);
    }
    unsubscribeTopic() {
        this.mqttService.unsubscribe(this.topic.topicName);
        this.location.back();
    }
    goBack() {
        this.location.back();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
