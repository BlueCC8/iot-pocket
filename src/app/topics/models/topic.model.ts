import { MessageModel } from "../../shared/models/message.model";

export class TopicModel {
    id: number = null;
    topicName = "";
    messages: MessageModel[] = [];
    messagesTime: string[];
    date = "";

    constructor(jsonObj) {
        if (jsonObj) {
            Object.assign(this, {
                id: jsonObj.id,
                topicName: jsonObj.topicName,
                messages: jsonObj.messages,
                messagesTime: jsonObj.messagesTime,
                date: jsonObj.date
            });
        }
    }
}
