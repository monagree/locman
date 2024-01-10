import { mLoc, mlocData } from "./classes";
import { locs } from "./locs";

export class mCountry{

  static getAllCountries() {
    const countries:mLoc[] = []
    for (const countryCode in locs) {
      if (locs.hasOwnProperty(countryCode)) {
        const acountry = locs[countryCode];
        const country:mlocData = {
          name: acountry.name,
          center: acountry.center
        }
        countries.push(new mLoc(countryCode,country))
      }
    }
    return countries;
  }

  static getCountryByCode(countryCode:string) {
    if (locs[countryCode]) {
      const acountry = locs[countryCode];
      const country:mlocData = {
        name: acountry.name,
        center: acountry.center
      }
      return new mLoc(countryCode,country);
    }
    return undefined;
  }

}


export class mState{

  static getStatesByCountry(countryCode:string) {
    const states:mLoc[] = []
    if(locs[countryCode]){
      const nLoc = locs[countryCode]['states']
      for (const stateCode in nLoc) {
        if (nLoc.hasOwnProperty(stateCode)) {
          const astate = nLoc[stateCode];
          const state:mlocData = {
            name: astate.name,
            center: astate.center
          }
          states.push(new mLoc(stateCode,state))
        }
      }
    }
    return states;
  }

  static getStateByCode(countryCode:string,stateCode:string) {
    if(locs[countryCode]){
      const nLoc = locs[countryCode]['states']
      if (nLoc && nLoc[stateCode]) {
        const astate = nLoc[stateCode];
        const state:mlocData = {
          name: astate.name,
          center: astate.center
        }
        return new mLoc(stateCode, state)
      }
    }
    return undefined;
  }

}

export class mLga{

  static getLgasByState(countryCode:string,stateCode:string) {
    const lgas:mLoc[] = []
    if(locs[countryCode]){
      const nLoc = locs[countryCode]['states']
      if(nLoc && nLoc[stateCode]){
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

  static getLgaByCode(countryCode:string,stateCode:string, lgaCode:string) {
    if(locs[countryCode]){
      const nLoc = locs[countryCode]['states']
      if(nLoc && nLoc[stateCode]){
        const nnLoc = nLoc[stateCode]['lgas']
        if(nnLoc && nnLoc[lgaCode]){
          const lga = nnLoc[lgaCode];
          return new mLoc(lgaCode,lga)
        }
      }
    }
    return undefined;
  }

}