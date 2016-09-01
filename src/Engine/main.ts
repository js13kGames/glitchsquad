import {Action, Behaviour, GameState} from './interfaces';
import {makeRender, behave, makeReducer} from './make';
import {Game} from './game';
import {DO} from '../Enums/do';
import {MenuState} from '../Menu/state';
import {menuRender} from '../Menu/render';
import {gameRender} from '../Game/render';
import {menuReducer} from '../Menu/reducer';

export function start(dom: any) {
  const state = new MenuState();
  const render = makeRender([menuRender, gameRender], dom);
  const reduce = makeReducer([menuReducer]);
  const game: Game = new Game(state, render, behave, reduce);
}
