export class ServerModel {
    host = "broker.mqttdashboard.com";
    port = 8000;
    useSSL = false;
    path = "/mqtt";
    username = "";
    password = "";
    topic = "DefaultTopic";
    cleanSession = true;

    constructor(jsonObj) {
        if (jsonObj) {
            Object.assign(this, {
                host: jsonObj.host,
                port: jsonObj.port,
                useSSL: jsonObj.useSSL,
                path: jsonObj.path,
                username: jsonObj.username,
                password: jsonObj.password,
                topic: jsonObj.topic,
                cleanSession: jsonObj.cleanSession
            });
        }
    }
}
