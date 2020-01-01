import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TopicModel } from "~/app/models/topic.model";
import { MQTTService } from "~/app/shared/services/mqtt.service";
import { Location } from "@angular/common";

@Component({
    selector: "ns-topic-detail",
    templateUrl: "./topic-detail.component.html"
})
export class TopicDetailComponent implements OnInit {
    topic: TopicModel;

    constructor(
        private mqttService: MQTTService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.topic = this.mqttService.getTopic(id);
    }
    unsubscribeTopic() {
        this.mqttService.unsubscribe(this.topic.topicName);
        this.location.back();
    }
    goBack() {
        this.location.back();
    }
}
