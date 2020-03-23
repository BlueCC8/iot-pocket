import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { TopicDetailComponent } from "./components/topics-list/topic-detail/topic-detail.component";
import { TopicsListComponent } from "./components/topics-list/topics-list.component";

const TOPICS_ROUTES: Routes = [
    { path: "", component: TopicsListComponent },
    { path: ":id", component: TopicDetailComponent }
];

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(TOPICS_ROUTES)
    ],
    exports: [NativeScriptRouterModule]
})
export class TopicsRoutingModule {}
