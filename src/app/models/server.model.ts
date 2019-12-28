export class ServerModel {
    mqtt_host: string;
    mqtt_port: number;
    mqtt_useSSL: boolean;
    mqtt_path: string;
    mqtt_username: string;
    mqtt_password: string;
    mqtt_topic: string;
    mqtt_cleanSession: boolean;

    constructor(jsonObj) {
        if (jsonObj) {
            this.mqtt_host = jsonObj.mqtt_host;
            this.mqtt_port = jsonObj.mqtt_port;
            this.mqtt_useSSL = jsonObj.mqtt_useSSL;
            this.mqtt_path = jsonObj.mqtt_path;
            this.mqtt_username = jsonObj.mqtt_username;
            this.mqtt_password = jsonObj.mqtt_password;
            this.mqtt_topic = jsonObj.mqtt_topic;
            this.mqtt_cleanSession = jsonObj.mqtt_cleanSession;
        } else {
            this.mqtt_host = "broker.mqttdashboard.com";
            this.mqtt_port = 8000;
            this.mqtt_useSSL = false;
            this.mqtt_path = "/mqtt";
            this.mqtt_username = "";
            this.mqtt_password = "";
            this.mqtt_topic = "safeTopic";
            this.mqtt_cleanSession = true;
        }
    }
}
