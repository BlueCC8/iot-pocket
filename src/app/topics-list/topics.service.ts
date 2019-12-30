import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TopicModel } from "../models/topic.model";
import { Observable } from "tns-core-modules/ui/page/page";

@Injectable()
export class TopicsService {
    public topicsList: TopicModel[] = [];
    private topicsSubject = new Subject<TopicModel[]>();
    public topicsUpdated = this.topicsSubject.asObservable();

    constructor() {}

    setTopics(topics: TopicModel[]) {
        console.log("Service topics");
        console.log(topics);
        topics.forEach((topic: TopicModel, index) => {
            if (topic.id === null) {
                topic.id = index;
            }
        });
        this.topicsList = topics;
        this.topicsSubject.next(topics);
    }
    getTopic(id: number): TopicModel {
        return this.topicsList.filter(item => item.id === id)[0];
    }
    load() {
        return this.topicsUpdated;
    }
    add(name: string) {}
    delete(id: string) {
        // return this.http.delete(
        //     this.baseUrl + "/" + id,
        //     { headers: this.getCommonHeaders() }
        // ).pipe(
        //     catchError(this.handleErrors)
        // );
    }

    // handleErrors(error: Response) {
    //     console.log(JSON.stringify(error));
    //     return throwError(error);
    // }
}
