export class MessageModel {
    message = "";
    date = "";

    constructor(jsonObj) {
        if (jsonObj) {
            Object.assign(this, {
                message: jsonObj.message,
                date: jsonObj.date
            });
        }
    }
}
