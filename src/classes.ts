import { getData } from "./firehelper";

export interface initConfig {
    /**
     * Type of Business this website is for (s for ecommerce(ie store), l for logistics)
     */
    type: bizType;
    /**
     * Developer ID (Get yours from the developer dashboard at https://developers.monagree.com)
     */
    did: string;
    /**
     * If this website is for a specific business only, include their business ID (Ask from the business).
     * Otherwise, add a logic to get the business id from the URL `path`. If you're using the `Monagree CLI`,
     * call `monagree.getBizIdFromPath` to get the biz id 
     */
    bid:string;
  }

export type bizType = 's' | 'l';


export class monagreeActions{
    success:boolean
    message:string
    constructor(success:boolean,message?:string){
        this.success = success
        this.message = message || 'No Msg'
    }
    isSuccessful(){
        return this.success
    }
    getMsg(){
        return this.message
    }
}


export class storeData{
    private doc:any;
    private id:string;
    constructor(doc:any, id:string){
        this.doc = doc
        this.id = id
    }
    getId(){
        return this.id
    }
    getName(){
        return getData(this.doc, 'n')
    }
    getShortDescription(){
        return getData(this.doc, 'sd')
    }
    getLongDescription(){
        return getData(this.doc, 'ld')
    }
    getMainCatID(){
        return getData(this.doc, 'c2')
    }
    getSubcats(){
        const tvals:string[] = []
        for(const key in this.doc.fields['c3'].arrayValue.values){
            tvals.push(this.doc.fields['c3'].arrayValue.values[key].stringValue)
        }
        return tvals
    }
    getL1(){
        return getData(this.doc, 'l1')
    }
    getL2(){
        return getData(this.doc, 'l2')
    }
    getL3(){
        return getData(this.doc, 'l3')
    }
    getLocId(){
        return this.getL1()+this.getL2()+this.getL3()
    }
    getImg(){
        return getData(this.doc, 'img')
    }
}


export class categoryData{
    private doc:any;
    private id:string
    constructor(doc:any, id:string){
        this.doc = doc
        this.id = id
    }
    getId(){
        return this.id
    }
    getTitle(){
        return getData(this.doc, 't')
    }
}


export class catalogData{
    private doc:any;
    private id:string
    constructor(doc:any, id:string){
        this.doc = doc
        this.id = id
    }
    getId(){
        return this.id
    }
    getTitle(){
        return getData(this.doc, 't')
    }
    getImg(){
        return getData(this.doc, 'img')
    }
}


export class productData{
    doc:any;
    id:string
    constructor(doc:any,id:string){
        this.doc = doc
        this.id = id
    }
    getId(){
        return this.id
    }
    getTitle(){
        return getData(this.doc, 't')
    }
    getDescription(){
        return getData(this.doc, 'd')
    }
    getPrice(){
        return getData(this.doc, 'p')
    }
    getCatalog(){
        return getData(this.doc, 'c')
    }
    getC2(){
        return getData(this.doc, 'c2')
    }
    getC3(){
        return getData(this.doc, 'c3')
    }
    getImg(){
        return getData(this.doc, 'img')
    }
}