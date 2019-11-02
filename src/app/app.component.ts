import { Component } from '@angular/core';
import { MQTTClient, ClientOptions, SubscribeOptions } from 'nativescript-mqtt';
import { Message } from 'nativescript-mqtt/common';
// import * as Kinvey from 'kinvey-nativescript-sdk';

@Component({
    selector: 'ns-app',
    templateUrl: './app.component.html',
})
export class AppComponent {
    mqtt_host: string = 'broker.mqttdashboard.com';
    mqtt_port: number = 8000;
    mqtt_useSSL: boolean = false;
    mqtt_path: string = '/mqtt';
    mqtt_username: string = '';
    mqtt_password: string = '';
    mqtt_topic: string = 'ninja-topic';
    mqtt_cleanSession: boolean = true;
    client;
    mqtt_clientOptions: ClientOptions = {
        host: this.mqtt_host,
        port: this.mqtt_port,
        useSSL: this.mqtt_useSSL,
        path: this.mqtt_path,
        cleanSession: this.mqtt_cleanSession,
    };

    mqtt_client: MQTTClient = new MQTTClient(this.mqtt_clientOptions);

    loading: boolean = false;

    constructor() {
        // Kinvey.init({
        //     appKey: 'kid_SkEOLIs9H',
        //     appSecret: '1f266895508c46528569ac47f1a81a6c',
        // });
        // Kinvey.ping()
        //     .then(response => {
        //         console.log(
        //             `Kinvey Ping Success. Kinvey Service is alive,
        //     version: ${response.version}, response: ${response.kinvey}`,
        //         );
        //     })
        //     .catch(error => {
        //         console.log(
        //             `Kinvey Ping Failed. Response: ${error.description}`,
        //         );
        //     });
        this.setupHandlers();
    }

    connect(): void {
        try {
            this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
        } catch (e) {
            console.log('Caught error: ' + e);
        }
    }

    subscribe(): void {
        try {
            const opts: SubscribeOptions = {
                qos: 0,
            };

            this.mqtt_client.subscribe(this.mqtt_topic, opts);
        } catch (e) {
            console.log('Caught error: ' + e);
        }
    }

    setupHandlers(): void {
        this.mqtt_client.onConnectionFailure.on(err => {
            console.log('Connection failed: ' + err);
        });

        this.mqtt_client.onConnectionSuccess.on(() => {
            console.log('Connected successfully!');
            this.subscribe();
        });

        this.mqtt_client.onConnectionLost.on(err => {
            console.log('Connection lost: ' + err);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            console.log('Message received: ' + message.payload);
        });

        this.mqtt_client.onMessageDelivered.on((message: Message) => {
            console.log('Message delivered: ' + message.payload);
        });
    }
}
