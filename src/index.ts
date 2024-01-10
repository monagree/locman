import { mLoc } from "./classes";
import { locs } from "./locs";

export function getAllCountries() {
  const countries:mLoc[] = []
  for (const countryCode in locs) {
    if (locs.hasOwnProperty(countryCode)) {
      const country = locs[countryCode];
      delete country['states']
      countries.push(new mLoc(countryCode,country))
    }
  }
  return countries;
}

export function getCountryByCode(countryCode:string) {
  if (locs[countryCode]) {
    const country = locs[countryCode];
    delete country['states']
    return new mLoc(countryCode,country);
  }
  return undefined;
}

export function getStatesByCountry(countryCode:string) {
  const states:mLoc[] = []
  if(locs[countryCode]){
    const nLoc = locs[countryCode]['states']
    for (const stateCode in nLoc) {
      if (nLoc.hasOwnProperty(stateCode)) {
        const state = nLoc[stateCode];
        delete state['lga']
        states.push(new mLoc(stateCode,state))
      }
    }
  }
  return states;
}

export function getStateByCode(countryCode:string,stateCode:string) {
  if(locs[countryCode]){
    const nLoc = locs[countryCode]['states']
    if (nLoc[stateCode]) {
      const state = nLoc[stateCode];
      delete state['lga']
      return new mLoc(stateCode, state)
    }
  }
  return undefined;
}


export function getLgasByState(countryCode:string,stateCode:string) {
  const lgas:mLoc[] = []
  if(locs[countryCode]){
    const nLoc = locs[countryCode]['states']
    if(nLoc[stateCode]){
      const nnLoc = nLoc[stateCode]['lgas']
      for (const lgaCode in nnLoc) {
        if (nnLoc.hasOwnProperty(lgaCode)) {
          const lga = nnLoc[lgaCode];
          lgas.push(new mLoc(lgaCode,lga))
        }
      }
    }
  }
  return lgas;
}

export function getLgaByCode(countryCode:string,stateCode:string, lgaCode:string) {
  if(locs[countryCode]){
    const nLoc = locs[countryCode]['states']
    if(nLoc[stateCode]){
      const nnLoc = nLoc[stateCode]['lgas']
      if(nnLoc[lgaCode]){
        const lga = nnLoc[lgaCode];
        return new mLoc(lgaCode,lga)
      }
    }
  }
  return undefined;
}

