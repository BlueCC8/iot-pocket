import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
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
                alert(JSON.stringify(this.topic));
                console.log(loadedTopics);
                this.ref.markForCheck();
            })
        );
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
