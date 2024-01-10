import { mLoc } from "./classes";
import { locs } from "./locs";

export function getAllStatesInNigeria() {
  const states:mLoc[] = []
  for (const stateCode in locs) {
    if (locs.hasOwnProperty(stateCode)) {
      const state = locs[stateCode];
      delete state['lga']
      states.push(new mLoc(stateCode,state))
    }
  }
  return states;
}


export function getLgasByState(stateCode:string) {
  const lgas:mLoc[] = []
  const state = locs[stateCode]
  if(state){
    for (const lgaCode in state['lgas']) {
      if (state['lgas'].hasOwnProperty(lgaCode)) {
        const lga = state['lgas'][lgaCode];
        lgas.push(new mLoc(lgaCode, lga))
      }
    }
  }
  return lgas;
}

