export class TopicModel {
    id: number;
    topicName: string;
    messages: string[];

    constructor() {
        this.id = null;
        this.topicName = "";
        this.messages = [];
    }
}
