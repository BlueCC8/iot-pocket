export class ServerModel {
    host: string;
    port: number;
    useSSL: boolean;
    path: string;
    username: string;
    password: string;
    topic: string;
    cleanSession: boolean;

    constructor(jsonObj) {
        if (jsonObj) {
            this.host = jsonObj.host;
            this.port = jsonObj.port;
            this.useSSL = jsonObj.useSSL;
            this.path = jsonObj.ath;
            this.username = jsonObj.username;
            this.password = jsonObj.password;
            this.topic = jsonObj.topic;
            this.cleanSession = jsonObj.cleanSession;
        } else {
            this.host = "broker.mqttdashboard.com";
            this.port = 8000;
            this.useSSL = false;
            this.path = "/mqtt";
            this.username = "";
            this.password = "";
            this.topic = "DefaultTopic";
            this.cleanSession = true;
        }
    }
}
