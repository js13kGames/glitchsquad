import {SKILL, SOLDIER, PLAYER} from '../Enums/enums';
import {Soldier} from './interfaces';

export function soldierSquadie (player: PLAYER, name: string): Soldier {
  return {
    type: SOLDIER.SQUADIE,
    code: 'SQ',
    moves: 2,
    movesPerTurn: 2,
    initiative: 5 + Math.random()*5,
    KIA: false,
    skills: [SKILL.MOVE, SKILL.SHOOT_RIFLE, SKILL.OPEN, SKILL.GRAB_DISC, SKILL.SKIP],
    player: player, 
    name: name
  }
}

export function soldierHeavy (player: PLAYER, name: string): Soldier {
  return {
    type: SOLDIER.HEAVY,
    code: 'HE',
    moves: 1,
    movesPerTurn: 1,
    initiative: 3 + Math.random()*3,
    KIA: false,
    skills: [SKILL.MOVE, SKILL.RUN, SKILL.SHOOT_HEAVY, SKILL.OPEN, SKILL.GRAB_DISC, SKILL.SKIP],
    player: player, 
    name: name
  }
}