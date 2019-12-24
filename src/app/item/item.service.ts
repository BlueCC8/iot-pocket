import { Injectable } from "@angular/core";

import { Item } from "./item";

@Injectable({
    providedIn: "root"
})
export class ItemService {
    private items = new Array<Item>(
        { id: 1, name: "Light bulb", role: "Actuator", type: "bulb" },
        { id: 3, name: "Piqué", role: "Defender", type: "router" },
        {
            id: 4,
            name: "I. Rakitic",
            role: "Midfielder",
            type: "wireless sensor"
        }
    );

    getItems(): Array<Item> {
        return this.items;
    }

    getItem(id: number): Item {
        return this.items.filter(item => item.id === id)[0];
    }
}
