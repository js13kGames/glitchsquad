import {Action, Behaviour, GameState, Animation} from './interfaces';
import {DO} from '../Enums/do';

export class Game {
  private pastStates: GameState[];
  private pastActions: Action[];

  constructor(
    private state: GameState, 
    private render: (state: GameState) => void, 
    private behave: (behaviours: Behaviour[], doIt: (Action) => void) => void,
    private reducer: (state: GameState, action: Action) => GameState,
    private animate: (animations: Animation[], doIt: (Action) => void) => void
  ) {
    this.act = this.act.bind(this);
    this.pastStates = [];
    this.pastActions = [];
    this.act({do: DO.NOT, payload: {}});
  }
  
  private act(action: Action): void {
    const state = this.reducer(this.state, action);
//    this.pastStates.push(state);
//    this.pastActions.push(action);
    this.render(state);
    this.behave(state.behaviours, this.act);
    this.animate(state.animations, this.act);
    state.animations = [];
    this.state = state;
  }
}
