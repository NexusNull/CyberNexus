/**
 * This class serves as the source of truth, once a server connection is established this class will get periodical updates that keep the client in sync with the server.
 *
 */


import {EventSystem} from '../util/EventSystem';
import {GameScene} from './rendering/GameScene';

export class GameState extends EventSystem {

    constructor(gameScene: GameScene) {
        super();
        gameScene.clear();
    }

}

