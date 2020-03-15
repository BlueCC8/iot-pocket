import { NgModule } from "@angular/core";
import { DevicesRoutingModule } from "./devices-routing.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { DevicesListComponent } from "./components/devices-list/devices-list.component";
import { DeviceDetailComponent } from "./components/device-detail/device-detail.component";
import { DevicesService } from "./services/devices.service";
import { BulbControlComponent } from "./components/bulb-control/bulb-control.component";
import { LightBulbCommandService } from "./services/lightbulb-command.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        DevicesRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        DevicesListComponent,
        DeviceDetailComponent,
        BulbControlComponent
    ],
    providers: [DevicesService, LightBulbCommandService]
})
export class DevicesModule {}
