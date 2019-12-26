import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BulbControlComponent } from "./bulb-control/bulb-control.component";

import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HomeComponent } from "./home/home.component";
import { ItemsComponent } from "./items/items.component";
import { ItemDetailComponent } from "./items/item/item-detail.component";
import { BluetoothService } from "./shared/services/bluetooth.service";
import { LightBulbCommandService } from "./shared/services/lightbulb-command.service";
import { MQTTService } from "./shared/services/mqtt.service";
import { SpinnerService } from "./shared/services/spinner.service";
import { AlertService } from "./shared/services/alert.service";
@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        BulbControlComponent,
        ItemDetailComponent,
        HomeComponent
    ],
    providers: [
        BluetoothService,
        LightBulbCommandService,
        MQTTService,
        SpinnerService,
        AlertService
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
