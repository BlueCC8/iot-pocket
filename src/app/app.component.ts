import { Component, OnInit, OnDestroy } from "@angular/core";

import { SpinnerService } from "./shared/services/spinner.service";
import { Subscription } from "rxjs";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit, OnDestroy {
    isLoading = false;
    subs: Subscription[] = [];
    constructor(private spinnerService: SpinnerService) {}

    ngOnInit(): void {
        this.subs.push(
            this.spinnerService.spinnerUpdated.subscribe(
                spinnerState => (this.isLoading = spinnerState)
            )
        );
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
