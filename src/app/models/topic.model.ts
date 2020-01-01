import { MessageModel } from "./message.model";

export class TopicModel {
    id: number;
    topicName: string;
    messages: MessageModel[];
    messagesTime: string[];
    date?: string;
    constructor() {
        this.id = null;
        this.topicName = "";
        this.messages = [];
        this.date = "";
    }
}
