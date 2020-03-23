import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ServerDetailsComponent } from "./server-details/server-details.component";

const APP_ROUTES: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "devices", loadChildren: "./devices/devices.module#DevicesModule" },
    { path: "server", component: ServerDetailsComponent },
    { path: "topics", loadChildren: "./topics/topics.module#TopicsModule" }
];

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(APP_ROUTES)
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
