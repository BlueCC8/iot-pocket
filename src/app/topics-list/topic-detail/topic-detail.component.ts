import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TopicModel } from "~/app/models/topic.model";
import { TopicsService } from "../topics.service";

@Component({
    selector: "ns-topic-detail",
    templateUrl: "./topic-detail.component.html"
})
export class TopicDetailComponent implements OnInit {
    topic: TopicModel;

    constructor(
        private topicsService: TopicsService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.topic = this.topicsService.getTopic(id);
    }
}
