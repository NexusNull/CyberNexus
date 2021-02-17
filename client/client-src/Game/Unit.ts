import {EventSystem} from "../util/EventSystem";
import {Object3D} from "three";
import {ArmorComponent} from "./components/Armor";
import {TurretComponent} from "./components/Turret";
import {ChassisComponent} from "./components/ChassisComponent";
import {StorageComponent} from "./components/Storage";
import {CoreComponent} from "./components/Core";

/**
 * what does a unit need?
 * components
 * where do we get components
 * array of component names
 * how do we store components
 * different Unit tiers
 * core:
 * basic core
 * simple core
 * advanced core
 * sub commander core
 * commander core
 *
 *
 *
 * component types:
 *  chassis defines the movement options
 *  chassis:
 *  vertical drive| allows for relatively fast vertical movement with limited horizontal movement
 *  simple walker| semi high mobility up 1 block high medium speed cheap not able to act while moving
 *  advanced walker| high mobility 2 blocks high can act while moving medium speed
 *  wheel drive | fast fragile not able to move up blocks
 *  tracks | high hp slow not able to move up blocks
 *  static| can't move very durable essentially a tower
 *
 *  armor:
 *  iron weak
 *  titanium stronk
 *
 *  mounts:
 *  mining drill| can mine materials and actually gets resources, low reach
 *  mining laser| vaporises material semi fast but destroy mined resources medium reach
 *  machine gun| high rate of fire medium damage
 *  laser gun| high rate of fire low damage high accuracy
 *  cannon | slow rate of fire high damage
 *  gauss cannon| slow rate of fire massive damage high energy usage
 *  {
 *      components:{
 *          core
 *      }
 *
 *
 *  }
 *
 *
 */
class Unit extends EventSystem {
    components: {
        core: CoreComponent,
        chassis: Array<ChassisComponent>,
        turrets: Array<TurretComponent>,
        armor: Array<ArmorComponent>,
        storage: Array<StorageComponent>,
    };
    position: {
        x: number;
        y: number;
        z: number;
    };
    health: number;
    maxHealth: number;


    object: Object3D;

    constructor(data) {
        super();

        this.health = data.health;
        this.maxHealth = data.maxHealth;

        this.components = {
            core: null,
            chassis: [],
            turrets: [],
            armor: [],
            storage: [],
        };


        //create components
        for (let componentData of data.components) {

        }

        this.object = new Object3D();


    }


}

export {Unit}