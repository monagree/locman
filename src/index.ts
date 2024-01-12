import { mLoc, mlocData } from "./classes";
import { locs } from "./locs";

export class mCountry{

  /**
 * Retrieves an array of all countries (Only supports Nigeria for now). 
 * Set oderedList to true if you want the data ordered 
 *
 * @returns {mLoc[]} An array of mLoc objects representing countries.
 */
  static getAllCountries(oderedList?:boolean) {
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
    if(oderedList){
      return countries.slice().sort((a, b) => a.getName().localeCompare(b.getName()));
    }
    return countries;
  }

  /**
 * Retrieves a country by its code
 *
 * @returns {mLoc}
 */
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

  /**
 * Retrieves an array of all states in the provided country code.
 * Set oderedList to true if you want the data ordered 
 *
 * @returns {mLoc[]} An array of mLoc objects representing states.
 */
  static getStatesByCountry(countryCode:string,oderedList?:boolean) {
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
    if(oderedList){
      return states.slice().sort((a, b) => a.getName().localeCompare(b.getName()));
    }
    return states;
  }

  /**
 * Retrieves a state by its code and countryCode
 *
 * @returns {mLoc}
 */
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

  /**
 * Retrieves an array of all LGAs in the specified country & state.
 * Set oderedList to true if you want the data ordered 
 *
 * @returns {mLoc[]} An array of mLoc objects representing LGAs.
 */
  static getLgasByState(countryCode:string,stateCode:string,oderedList?:boolean) {
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
    if(oderedList){
      return lgas.slice().sort((a, b) => a.getName().localeCompare(b.getName()));
    }
    return lgas;
  }

  /**
 * Retrieves an LGA by its code, state code and country code
 *
 * @returns {mLoc}
 */
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