
interface mlocData {
    name: string;
    center: {
        lat:number,
        lon:number
    };
  }

export class mLoc{
    id:string
    data:mlocData
    constructor(id:string,data:mlocData){
        this.id = id
        this.data = data;
    }
}