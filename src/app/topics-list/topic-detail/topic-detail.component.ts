import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TopicModel } from "~/app/models/topic.model";
import { MQTTService } from "~/app/shared/services/mqtt.service";

@Component({
    selector: "ns-topic-detail",
    templateUrl: "./topic-detail.component.html"
})
export class TopicDetailComponent implements OnInit {
    topic: TopicModel;

    constructor(
        private mqttService: MQTTService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.topic = this.mqttService.getTopic(id);
    }
}
