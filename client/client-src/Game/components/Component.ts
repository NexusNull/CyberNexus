enum ComponentType {
    Core,
    Chassis,
    Armor,
    Storage,
    Turret
}


abstract class Component {
    health: number;
    maxHealth: number;
    name: string;
    type: ComponentType;
    enables: Set<string>;
    disables: Set<string>;

    protected constructor(data) {
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.name = data.name;
        this.enables = new Set(data.enables);
        this.disables = new Set(data.disables);
    }
}

export {Component, ComponentType}