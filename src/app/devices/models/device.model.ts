export class Device {
    id: number;
    name: string;
    role: string;
    type: string;

    constructor(jsonObj) {
        if (jsonObj) {
            Object.assign(this, {
                id: jsonObj.id,
                name: jsonObj.name,
                role: jsonObj.role,
                type: jsonObj.type
            });
        }
    }
}
