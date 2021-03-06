import {GameState, Action, Behaviour} from '../Engine/interfaces';
import {WALL, DO, ANIME, SKILL} from '../Enums/enums';
import {Soldier} from './interfaces';
import {Hex, HexMap} from '../Hex/interfaces';
import {getCords, canMove, canOpen, allTill} from '../Game/mapCheck';
import {HackWallData, WallCoords} from '../Game/interfaces';

export function updateBehaviour(state: GameState): GameState {
  state.behaviours = [];
  state.hexMap.forEach(l => l.forEach(h => h.acts = []));
  return shootHeavy(shootRifle(evac(grab(hack(moves(skip(state)))))));
};

function evac(state: GameState): GameState {
  able(state, SKILL.EVAC) ? state.behaviours.push({
    id: `evac-${state.active}`,
    display: 'EVAC',
    event: 'onclick',
    action: {do: DO.EVAC, active: state.active, player: state.soldiers[state.active].player, payload: {winner: state.soldiers[state.active].player}}
  })
    : '';
  return state;
};

function grab(state: GameState): GameState {
  able(state, SKILL.GRAB_DISC) ? state.behaviours.push({
    id: `grab-${state.active}`,
    display: 'GRAB',
    event: 'onclick',
    action: {do: DO.GRAB_DISC, active: state.active, player: state.soldiers[state.active].player, payload: {}}
  })
    : '';
  return state;
};

function skip(state: GameState): GameState {
  able(state, SKILL.SKIP) ? state.behaviours.push({
    id: `skip-${state.active}`,
    display: 'SKIP',
    event: 'onclick',
    action: {do: DO.SKIP, active: state.active, player: state.soldiers[state.active].player, payload: {}}
  })
    : '';
  return state;
};

function shootRifle(state: GameState): GameState {
  const {soldiers} = state;
  const {x, y, player} = soldiers[state.active];
  if (!able(state, SKILL.SHOOT_RIFLE)) {
    return state;
  }
  
  const shootxy = <WallCoords[][]>Array.from(new Array(6), (a, d) => allTill(x, y, d, state.hexMap, WALL.DOORCLOSED
  )).filter(canShootSomebody);
  
  shootxy.forEach(wc => {
    const srb = shootRifleBehave(wc);
    state.behaviours.push(srb);
    state.hexMap[wc[wc.length - 1].y][wc[wc.length - 1].x].acts.push(srb);
  });
  
  return state;
  
  function canShootSomebody(coords: WallCoords[]): boolean {
    return coords.findIndex(c => state.hexMap[c.y][c.x].soldiers.findIndex(s => soldiers[s].player !== player && !soldiers[s].KIA) > -1) > -1;
  }

  
  
  function shootRifleBehave(wc: WallCoords[]): Behaviour {
    return {
      id: `hex-${wc[wc.length - 1].x}-${wc[wc.length - 1].y}-${wc[wc.length - 1].d}-shoot_rifle`,
      display: 'SHOOT',
      color: `darkred sd-${wc[wc.length - 1].d}`,
      event: 'onclick',
      action: {
        do: DO.SHOOT_RIFLE,
        active: state.active,
        player: player,
        payload: {
          wc: wc
        }
      }
    }
  };
}

function shootHeavy(state: GameState): GameState {
  const {x, y, player} = state.soldiers[state.active];
  if (!able(state, SKILL.SHOOT_HEAVY, 2)) {
    return state;
  }
  
  const shootxy = <WallCoords[][]>Array.from(new Array(6), (a, d) => allTill(x, y, d, state.hexMap, WALL.NOT)).filter(a => a.length > 0);
  
  shootxy.forEach(wc => {
    const shb = shootHeavyBehave(wc);
    state.behaviours.push(shb);
    state.hexMap[wc[wc.length - 1].y][wc[wc.length - 1].x].acts.push(shb);
  });
  
  return state;
  
  function shootHeavyBehave(wc: WallCoords[]): Behaviour {
    return {
      id: `hex-${wc[wc.length - 1].x}-${wc[wc.length - 1].y}-${wc[wc.length - 1].d}-shoot_heavy`,
      display: 'BARRAGE',
      color: `darkred sd-${wc[wc.length - 1].d} heavy`,
      event: 'onclick',
      action: {
        do: DO.SHOOT_HEAVY,
        active: state.active,
        player: player,
        payload: {
          wc: wc
        }
      }
    }
  };
}

function hack(state: GameState): GameState {
  const {x, y, player} = state.soldiers[state.active];
  if (!able(state, SKILL.OPEN)) {
    return state;
  }
  
  const openxy = <HackWallData[]>Array.from(new Array(6), (a, d) => canOpen(x, y, d, state.hexMap)).filter(a => !!a);
  
  openxy.forEach(hwd => {
    const ob = openBehave(hwd);
    state.behaviours.push(ob);
    state.hexMap[hwd.dy][hwd.dx].acts.push(ob);
  });
  
  return state;
  
  function openBehave(hwd: HackWallData): Behaviour {
    return {
      id: `hex-${hwd.tx}-${hwd.ty}-${hwd.td}-hack`,
      display: 'HACK',
      color: 'darkgrey',
      event: 'onclick',
      action: {
        do: DO.HACK,
        active: state.active,
        player: player,
        payload: {
          hwd: hwd
        }
      }
    }
  };
};

function moves(state: GameState): GameState {
  const {x, y, player} = state.soldiers[state.active];
  if (!able(state, SKILL.MOVE)) {
    return state;
  }
  const movxy = <{x: number, y: number}[]>Array.from(new Array(6), (a, i) => movesTo(x, y, i, state.hexMap)).filter(a => !!a);
  movxy.forEach(m => {
    const mb = moveBehave(m.x, m.y);
    state.behaviours.push(mb);
    state.hexMap[m.y][m.x].acts.push(mb);
  });
  
  return state;
  
  function movesTo(ox: number, oy: number, d: number, map: HexMap) {
    const {x, y} = getCords(ox, oy, d);
    
    return canMove(ox, oy, d, map) ? {x, y} : false;
  };
  
  function moveBehave(x: number, y: number): Behaviour {
    return {
      id: `hex-${x}-${y}-${DO.MOVE}`,
      display: 'MOVE',
      color: `p${player}`,
      event: 'onclick',
      action: {
        do: DO.MOVE,
        active: state.active,
        player: player,
        payload: {
          x: x,
          y: y
        }
      }
    }
  };
};

function able(state, skill: SKILL, cost = 1): boolean {
  const {KIA, moves, skills} = state.soldiers[state.active];
  return (!KIA && moves >= cost && skills.indexOf(skill) > -1);
}
