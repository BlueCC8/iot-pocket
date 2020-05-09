import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { DevicesListComponent } from "./components/devices-list/devices-list.component";
import { DeviceDetailComponent } from "./components/device-detail/device-detail.component";

const DEVICES_ROUTES: Routes = [
    { path: "", component: DevicesListComponent },
    { path: ":id", component: DeviceDetailComponent }
];

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(DEVICES_ROUTES)
    ],
    exports: [NativeScriptRouterModule]
})
export class DevicesRoutingModule {}
