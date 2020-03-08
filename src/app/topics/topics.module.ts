import { NgModule } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { TopicsRoutingModule } from "./topics-routing.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { TopicsListComponent } from "./components/topics-list/topics-list.component";
import { TopicDetailComponent } from "./components/topics-list/topic-detail/topic-detail.component";
import { MQTTService } from "../shared/services/mqtt.service";
import { NativeScriptCommonModule } from "nativescript-angular/common";
@NgModule({
    imports: [
        NativeScriptCommonModule,
        TopicsRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule
    ],
    declarations: [TopicsListComponent, TopicDetailComponent],
    providers: []
})
export class TopicsModule {}
