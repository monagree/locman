import axios from "axios";
import { monagreeActions } from "./classes";

const token_expiry = 3600000

export function getACT(finise:(task:monagreeActions)=>void){ //TODO Do they expire?
  axios.post('https://us-central1-monagree-apps.cloudfunctions.net/generateOAuthToken', {
    key: localStorage.getItem('did'),
    bid: localStorage.getItem('bid')
    }).then(response => {
        if(response.status==200){
          localStorage.setItem('lid',response.data.lid)
          finise(new monagreeActions(true,response.data.accessToken))
        }else{
          finise(new monagreeActions(false, 'Monagree Backend Error'))
        }
    }).catch(error => {
        console.error('Error calling Cloud Function:', error);
        finise(new monagreeActions(false, error))
    });
}

export type queryOperator = 'LESS_THAN' | 'LESS_THAN_OR_EQUAL'| 'GREATER_THAN'| 'GREATER_THAN_OR_EQUAL'| 'EQUAL'| 'NOT_EQUAL'| 'ARRAY_CONTAINS'| 'IN'| 'ARRAY_CONTAINS_ANY'| 'NOT_IN';
export type orderByDirection = 'ASCENDING' | 'DESCENDING'
export type whereOps = 'AND' | 'OR'

export class fireMan{
  accessToken?:string;

  constructor(){
    this.accessToken = undefined
  }

  prepare(finise:(task:monagreeActions)=>void, forceNew?:boolean){
    if(!forceNew && localStorage.getItem('atk_time')!=null && Date.now()-parseFloat(localStorage.getItem('atk_time')!) < token_expiry ){
      this.accessToken = localStorage.getItem('atk_val')!
      finise(new monagreeActions(true,this.accessToken))
      return
    }
    getACT((task)=>{
      if(task.success){
        this.accessToken = task.message;
        localStorage.setItem('atk_val',this.accessToken)
        localStorage.setItem('atk_time',Date.now().toString())
      }
      finise(task)
    });
  }

  isOk(){
    return this.accessToken!=undefined
  }

  setFS(path:string,pld:Object,task:(task:fsSet)=>void){
    if(!this.accessToken){
      this.prepare((ok)=>{
        if(ok){
          this.setFS(path,pld,task)
        }else{
          task(new fsSet(false))
        }
      })
      return
    }
    const data = {
      fields: Object.entries(pld).reduce((acc:any, [key, value]) => {
        if (Array.isArray(value)) {
          // Handle array values
          acc[key] = {
            arrayValue: {
              values: value.map((item: any) => {
                return {
                  [Number.isInteger(item) ? 'integerValue' : 'stringValue']: item
                };
              })
            }
          };
        } else {
          // Handle non-array values
          acc[key] = {
            [Number.isInteger(value) ? 'integerValue' : 'stringValue']: value
          };
        }
        return acc;
      }, {})
    };
  
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/monagree-apps/databases/(default)/documents/${path}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
    
    // Make the POST request to create a document
    axios.patch(firestoreUrl, data, { headers })
      .then(response => {
        task(new fsSet(true))
      })
      .catch(error => {
        console.error('Error creating document:', error.response ? error.response.data : error.message);
        task(new fsSet(false,error.message))
      });
  }
  
  getFS(path:string,task:(task:fsTask)=>void){
    if(!this.accessToken){
      this.prepare((ok)=>{
        if(ok){
          this.getFS(path,task)
        }else{
          task(new fsTask(false))
        }
      })
      return
    }
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/monagree-apps/databases/(default)/documents/${path}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    axios.get(firestoreUrl, { headers })
      .then(response => {
        const retrievedData = response.data;
        task(new fsTask(true,undefined,retrievedData))
      })
      .catch(error => {
        console.error('Error retrieving document:', error.response ? error.response.data : error.message);
        task(new fsTask(false,error.message))
      });
  }

  getQuery(docPath:string,colId:string,limit:number,task:(task:queryTask)=>void,
  opts:{
    orderBys?:{field:string,direction:orderByDirection}[],
    wheres?:{op?:whereOps,commands:{field:string,value:string,op:queryOperator}[]},
    startAt?:number
  },){
    if(!this.accessToken){
      this.prepare((ok)=>{
        if(ok){
          this.getQuery(docPath,colId,limit,task,opts)
        }else{
          task(new queryTask(false))
        }
      })
      return
    }
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/monagree-apps/databases/(default)/documents/${docPath}:runQuery`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
    // Add query parameters for filtering
    const queryParams:any = {
      structuredQuery: {
        from: [{ collectionId :colId }],
        limit: limit,
      }
    };
    if(opts.orderBys){
      let ob = []
      for(const odb of opts.orderBys){
        ob.push({ field: { fieldPath: odb.field}, direction: odb.direction })
      }
      queryParams['structuredQuery']['orderBy'] = ob
    }
    if(opts.wheres){
      if(opts.wheres.op){
        let filters = []
        for(const cmd of opts.wheres.commands){
          filters.push({
            fieldFilter: {
              field: { fieldPath: cmd.field },
              op: cmd.op,
              value: { stringValue: cmd.value }
            }
          })
        }
        queryParams['structuredQuery']['where'] = {
          compositeFilter:{
            op: opts.wheres.op,
            filters:filters
          }
        }
      }else{
        queryParams['structuredQuery']['where'] = {
          fieldFilter: {
            field: { fieldPath: opts.wheres.commands[0].field },
            op: opts.wheres.commands[0].op,
            value: { stringValue: opts.wheres.commands[0].value }
          }
        }
      }
    }
    if(opts.startAt){
      queryParams['structuredQuery']['startAt'] = {
        values: [{ integerValue: opts.startAt }]
      }
    }
    // Make the POST request with query parameters
    axios.post(firestoreUrl, queryParams, { headers })
    .then(response => {
        // Process the retrieved data
        console.log(response.data)
        const documents = response.data.map((doc:any) => {
          if (doc.document) {
            return {
              name: doc.document.name,
              fields: doc.document.fields
            };
          }
          return null;
        }).filter((doc:any) => doc !== null);
        task(new queryTask(true, undefined, documents));
    })
    .catch(error => {
        console.error('Error retrieving documents:', error.response ? error.response.data : error.message);
        task(new queryTask(false));
    });
  }
}


export function getData(doc:any, key:string):string{
    if(!doc){
        return "";
    }
    return doc.fields[key].stringValue;
}

export function getDocId(doc:any):string{
  const documentPath = doc.name;
  return documentPath.split('/').pop();
}



class fsSet{
    _success:boolean;
    _e?:any;
    constructor(_success:boolean, _e?:any){
        this._success = _success;
        this._e = _e; 
    }
    get getEr():string{
      return getErrMsg(this._e);
    }
  }



  class fsTask{
    _success:boolean;
    _exists:boolean;
    _snapshot?:any;
    _e?:any;
  
    constructor(_success:boolean,_e?:any,_snapshot?:any){
        this._success = _success;
        this._snapshot = _snapshot;
        this._e = _e;
        this._exists = (!_success?false:_snapshot!=undefined);
    }
  
    getVRes(){
      return getData(this._snapshot!, "v");
    }

    getEr(){//NEEDS CORRECTION IN getEC
      return getErrMsg(this._e);
    }

    isSuccessful(){
      return this._success;
    }

    exists(){
      return this._exists;
    }

    getResult(){
      return this._snapshot!;
    }

  }


class queryTask{
    _success:boolean;
    _exists:boolean;
    _snapshot?:any;
    _e?:any;
  
    constructor(_success:boolean,_e?:any,_snapshot?:any){
        this._success = _success;
        this._snapshot = _snapshot;
        this._e = _e;
        this._exists = (!_success?false:(_snapshot!.length!=0));
    }
  
    getEr(){//NEEDS CORRECTION IN getEC
      return getErrMsg(this._e);
    }

    isSuccessful(){
      return this._success;
    }

    getResult(){
      return this._snapshot!;
    }

  }

  
function getEC(ez:any):number{
    if(ez != undefined){
      const e = ez.toString()
      if(e.startsWith('[firebase_auth/network-request-failed]')){
        return 0;
      }
      if(e.startsWith('[firebase_auth/wrong-password]')){
        return 1;
      }if(e.startsWith('[firebase_auth/too-many-requests]')){
        return 2;
      }
      if(e.startsWith('[firebase_auth/user-not-found]')){
        return 4;
      }
    }
    return 3;
  }
  
  function getErrMsg(e:any):string{
    if (getEC(e) === 0) {
      return 'Network Error';
    } else if (getEC(e) === 2) {
     return 'Too many attempts. To protect this account, we will not allow sign in for a while. Please try again later. ';
    }else if (getEC(e) === 1) {
     return 'Invalid Credentials';
    } else {
      return 'An error occurred. Please try again';
    }
  }

  