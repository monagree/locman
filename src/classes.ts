
export interface mlocData {
    name: string;
    center: {
        lat:string,
        lon:string
    };
  }

export class mLoc{
    id:string
    data:mlocData
    constructor(id:string,data:mlocData){
        this.id = id
        this.data = data;
    }
    getId(){
        return this.id
    }
    getName(){
        return this.data.name
    }
    getLatitude(){
        return this.data.center.lat
    }
    getLongitude(){
        return this.data.center.lon
    }
}