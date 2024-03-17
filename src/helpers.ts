
export function getCountryId(){
    const locid = localStorage.getItem('lid')!
    return locid.substring(0,2)
}
export function getStateId(){
    const locid = localStorage.getItem('lid')!
    return locid.substring(2,4)
}
export function getLgaId(){
    const locid = localStorage.getItem('lid')!
    return locid.substring(4,6)
}

export function getRootLoc(){
    return `countries/${getCountryId()}/states/${getStateId()}/lgas/${getLgaId()}`
}

export const initErr = 'SDK not yet initialized. You must first call monagree.init'

export function isStore(bid:string){
    return bid.startsWith('e')
}