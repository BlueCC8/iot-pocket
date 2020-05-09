import { Device } from "~/app/devices/models/device.model";
import { Subscription } from "rxjs/internal/Subscription";

describe("Devices suite ", () => {
    let device: Device;
    let subs: Subscription[] = [];

    beforeEach(() => {
        device = new Device(null);
    });

    it("Should push new subscriptions to the array", () => {
        // * GIVEN - A  subscriptions array

        // * WHEN - A new subscriptions is pushed to the array
        subs.push(new Subscription());

        // * THEN - The array to preserve it before it is unsubscribed
        expect(subs.length).toEqual(1);
    });

    it("Should unsubscribe the newly added subscription from the array the array", () => {
        // * GIVEN - A  subscriptions array

        // * WHEN - A new subscriptions is pushed to the array and then unsubscribed
        const subscription = new Subscription();
        subs.push(subscription);
        subs.pop().unsubscribe();

        // * THEN - The sub should be closed
        expect(subscription.closed).toBeTruthy();
    });

    it("Should initialize all the properties of the Device", () => {
        // * GIVEN - A  dummy device data
        const exampleDevice = {
            id: 2,
            name: "name!!!",
            role: "undefined",
            type: "unknown",
        };
        // * WHEN - A device type is initialized
        device = new Device(exampleDevice);

        // * THEN - The properties should match
        expect(device.id).toEqual(exampleDevice.id);
        expect(device.name).toEqual(exampleDevice.name);
        expect(device.role).toEqual(exampleDevice.role);
        expect(device.type).toEqual(exampleDevice.type);
    });
});
