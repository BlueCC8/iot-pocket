import { MessageModel } from "../../models/message.model";

export class TopicModel {
    id: number = null;
    topicName = "";
    messages: MessageModel[] = [];
    messagesTime: string[];
    date?: string = "";

    constructor() {}
}
