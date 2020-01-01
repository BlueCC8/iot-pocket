import { Component, OnInit } from "@angular/core";

import { Item } from "./item/item";
import { ItemService } from "./item/item.service";
import { registerElement } from "nativescript-angular/element-registry";
import { CardView } from "@nstudio/nativescript-cardview";
import { Location } from "@angular/common";
registerElement("CardView", () => CardView);

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html",
    styleUrls: ["./items.component.css"]
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    data = [];
    constructor(private itemService: ItemService, private location: Location) {}

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }
    goBack() {
        this.location.back();
    }
}
