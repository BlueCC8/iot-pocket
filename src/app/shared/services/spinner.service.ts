import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class SpinnerService {
    private spinnerActive = new Subject<boolean>();
    public spinnerUpdated = this.spinnerActive.asObservable();

    public setSpinner(state: boolean): void {
        this.spinnerActive.next(state);
    }
}
