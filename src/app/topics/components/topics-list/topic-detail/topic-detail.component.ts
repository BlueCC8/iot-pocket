import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Location } from "@angular/common";
import { Subscription } from "rxjs";
import { TopicModel } from "~/app/topics/models/topic.model";
import { MQTTService } from "~/app/shared/services/mqtt.service";

@Component({
    selector: "ns-topic-detail",
    templateUrl: "./topic-detail.component.html"
})
export class TopicDetailComponent implements OnInit, OnDestroy {
    public topic: TopicModel;
    private subs: Subscription[] = [];
    public topicsList: TopicModel[] = [];

    constructor(
        private mqttService: MQTTService,
        private route: ActivatedRoute,
        private location: Location,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        const firstLoaded = this.mqttService.topicsList;
        this.topicsList = firstLoaded;

        this.topic = this.topicsList.find(topic => topic.id === id);

        this.subs.push(
            this.mqttService.topicsUpdated.subscribe(loadedTopics => {
                console.log("Topics detail updated");
                this.topicsList = loadedTopics;
                const newTopic = this.topicsList.find(topic => topic.id === id);
                this.topic = newTopic;
                console.log(loadedTopics);
                this.ref.markForCheck();
            })
        );
    }
    unsubscribeTopic(): void {
        this.location.back();
        this.mqttService.unsubscribe(this.topic.topicName);
    }
    goBack(): void {
        this.location.back();
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
