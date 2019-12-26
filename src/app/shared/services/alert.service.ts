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
            title: title,
            message: message,
            position: FeedbackPosition.Bottom,
            duration: 2500,
            onTap: () => console.log("showSuccess tapped")
        });
    }
    public showError(): void {
        this.feedback.show({
            title: "The error title",
            message: "Not too long a text here. But it could be..",
            duration: 1000,
            position: FeedbackPosition.Top,
            type: FeedbackType.Error,
            onTap: () => console.log("showError tapped")
        });
    }
    public showWarning(): void {
        this.feedback.show({
            // title: "The warning title",
            message:
                "This one doesn't have a title, but a very long message so this baby will wrap. Showing off multi-line feedback. Woohoo!",
            duration: 4000,
            position: FeedbackPosition.Top,
            type: FeedbackType.Warning,
            onTap: () => console.log("showWarning tapped")
        });
    }

    public showInfo(title?, message?) {
        // this.feedback.show({
        //     title: `Info ${title}!`,
        //     titleColor: new Color("#222222"),
        //     position: FeedbackPosition.Bottom, // iOS only
        //     type: FeedbackType.Custom, // this is the default type, by the way
        //     message: message,
        //     messageColor: new Color("#333333"),
        //     duration: 3000,
        //     backgroundColor: new Color("#f7f7f7"),
        //     // icon: "customicon", // in App_Resources/platform folders
        //     android: {
        //         iconColor: new Color("#222222") // optional, leave out if you don't need it
        //     },
        //     onTap: () => console.log("showCustomIcon tapped"),
        //     onShow: animating =>
        //         console.log(
        //             animating
        //                 ? "showCustomIcon animating"
        //                 : "showCustomIcon shown"
        //         ),
        //     onHide: () => console.log("showCustomIcon hidden")
        // });
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
