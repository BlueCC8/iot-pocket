import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { DevicesListComponent } from "./components/devices-list/devices-list.component";
import { DeviceDetailComponent } from "./components/device-detail/device-detail.component";

const routes: Routes = [
    { path: "", component: DevicesListComponent },
    { path: ":id", component: DeviceDetailComponent }
];

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes)
    ],
    exports: [NativeScriptRouterModule]
})
export class TopicsRoutingModule {}
