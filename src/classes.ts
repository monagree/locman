
interface stateData {
    name: string;
    center: {
        lat:number,
        lon:number
    };
  }

export class mLoc{
    id:string
    data:stateData
    constructor(id:string,data:stateData){
        this.id = id
        this.data = data;
    }
}