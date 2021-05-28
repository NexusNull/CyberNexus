import type {Scene} from 'three';
import type {Game} from "../Game";
import type Util from "../util/Util";

export interface document {
    scene: Scene;
    game: Game;
    util: Util;
}
