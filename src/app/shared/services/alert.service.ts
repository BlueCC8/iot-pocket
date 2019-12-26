import { Injectable } from "@angular/core";
import {
    Feedback,
    FeedbackType,
    FeedbackPosition
} from "nativescript-feedback";
import { Color } from "tns-core-modules/color";
@Injectable()
export class AlertService {
    private feedback: Feedback;

    constructor() {
        this.feedback = new Feedback();
    }
    public showSuccess(title?, message?): void {
        this.feedback.success({
            title: title || "Success",
            message: message || "",
            position: FeedbackPosition.Bottom,
            duration: 2500,
            onTap: () => console.log("showSuccess tapped")
        });
    }
    public showError(title?, message?): void {
        this.feedback.show({
            title: title || "Error",
            message: message || "",
            duration: 1000,
            position: FeedbackPosition.Top,
            type: FeedbackType.Error,
            onTap: () => console.log("showError tapped")
        });
    }
    public showWarning(title?, message?): void {
        this.feedback.show({
            title: title || "Warning",
            message: message || "",
            duration: 4000,
            position: FeedbackPosition.Top,
            type: FeedbackType.Warning,
            onTap: () => console.log("showWarning tapped")
        });
    }

    public showInfo(title?, message?) {
        this.feedback.show({
            title: title,
            message: message,
            duration: 2000,
            position: FeedbackPosition.Bottom, // iOS only
            type: FeedbackType.Info,
            onTap: () => console.log("showInfo tapped"),
            onShow: (animating?: boolean) =>
                console.log(`showInfo ${animating ? "animating" : "shown"}`),
            onHide: () => console.log("showInfo hidden")
        });
    }
}
