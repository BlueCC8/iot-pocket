import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./items/items.component";
import { ItemDetailComponent } from "./items/item/item-detail.component";
import { HomeComponent } from "./home/home.component";
import { ServerDetailsComponent } from "./server-details/server-details.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "items", component: ItemsComponent },
    { path: "item/:id", component: ItemDetailComponent },
    { path: "server", component: ServerDetailsComponent }
];

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
