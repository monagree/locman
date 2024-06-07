import { catalogData, categoryData, initConfig, monagreeActions, productData, storeData } from "./classes";
import { fireMan, getDocId } from "./firehelper";
import { getRootLoc, initErr, isStore } from "./helpers";


export class monagree{
  private static fire?: fireMan;
  private static config:initConfig;

  /**
   * Initializes the Monagree SDK. If you are using the Monagree CLI, you dont need to call this.
   * Otherwise, please call this at the entry point of the website and dont proceed unless a success result is returned in the callback.
   * For instance, you call this at `App.tsx` or `App.jsx` in a react app
   *
   * @param {initConfig} config
   * @param {(monagreeActions)=> void} callback 
   */
  static init(config:initConfig,callback:(action:monagreeActions)=>void){
    this.config = config
    localStorage.setItem('did',config.did)
    localStorage.setItem('bid',config.bid)
    this.fire = new fireMan()
    this.fire.prepare((task)=>{
      callback(task)
    })
  }

   /**
   * Get the business ID you provided at `init`
   *
   * @returns {string} The business ID (bid)
   */
  static getBusinessID(): string{
    return this.config.bid
  }

  /**
   * Get the business ID (bid) from URL `path`
   * Call this, only if you are using the Monagree CLI 
   * Only call at init
   *
   * @returns {string} The business ID (bid)
   */
  static getBizIdFromPath(): string{
    const currentUrl = window.location.href.split('//')[1]
    const urlParts = currentUrl.split('/')
    return urlParts[2]
  }


  /**
   * Get information about the store (for e-commerce users only)
   *
   * @param {(monagreeActions, storeData?)=> void} callback 
   */
  static getStoreData(callback:(action:monagreeActions, data?:storeData)=>void){
    if(!this.fire){
      callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getFS(getRootLoc()+`/stores/${this.config.bid}`,(task)=>{
      if(task.isSuccessful()){
        callback(new monagreeActions(true,'OK'),new storeData(task.getResult(),this.config.bid))
      }else{
        callback(new monagreeActions(false,task.getEr()))
      }
    })
  }

  /**
   * Get information about a sub-category
   *
   * @param {(monagreeActions, categoryData?)=> void} callback
   * @param {string} mainCategoryId Get from storeData.getMainCatID
   * @param {string} subCategoryId
   */
  static getSubCategoryData(mainCategoryId:string,subCategoryId:string,callback:(action:monagreeActions, data?:categoryData)=>void){
    if(!this.fire){
      callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getFS(`meta/cats/${isStore(this.config.bid)?'s':'l'}/${mainCategoryId}/sc/${subCategoryId}`,(task)=>{
      if(task.isSuccessful()){
        callback(new monagreeActions(true,'OK'),new categoryData(task.getResult(),subCategoryId))
      }else{
        callback(new monagreeActions(false,task.getEr()))
      }
    })
  }

  /**
   * Get information about a catalog
   *
   * @param {(monagreeActions, catalogData?)=> void} callback
   * @param {string} catalogID
   */
  static getCatalogData(catalogID:string,callback:(action:monagreeActions, data?:catalogData)=>void){
    if(!this.fire){
      callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getFS(getRootLoc()+`/stores/${this.config.bid}/cats/${catalogID}`,(task)=>{
      if(task.isSuccessful()){
        callback(new monagreeActions(true,'OK'),new catalogData(task.getResult(),catalogID))
      }else{
        callback(new monagreeActions(false,task.getEr()))
      }
    })
  }


  /**
   * Get catalogs for this business
   * Catalogs are like containers for products
   *
   * @param {(monagreeActions, catalogData[]?)=> void} callback
   */
  static getCatalogs(callback:(action:monagreeActions, data?:catalogData[])=>void){
    if(!this.fire){
      callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getQuery(getRootLoc()+`/stores/${this.config.bid}`,'cats',100, (task)=>{
      if(task.isSuccessful()){
        const tem:catalogData[] = []
        task.getResult().forEach((doc:any)=>{
          const ts = new catalogData(doc, getDocId(doc))
          tem.push(ts)
        })
        callback(new monagreeActions(true,'OK'),tem)
      }else{
        callback(new monagreeActions(false,task.getEr()))
      }
    },{})
  }

  /**
   * Get information about a product
   *
   * @param {(monagreeActions, productData?)=> void} callback
   * @param {string} productID
   */
  static getProductData(productID:string,callback:(action:monagreeActions, data?:productData)=>void){
    if(!this.fire){
      callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getFS(getRootLoc()+`/stores/${this.config.bid}/products/${productID}`,(task)=>{
      if(task.isSuccessful()){
        callback(new monagreeActions(true,'OK'),new productData(task.getResult(),productID))
      }else{
        callback(new monagreeActions(false,task.getEr()))
      }
    })
  }

  /**
   * Get products for this business
   * You can also get products belonging to a catalog by supplying `catalogID'
   *
   * @param {(monagreeActions, productData[]?)=> void} opts.callback
   * @param {string?} opts.catalogID Specify if you want to filter by catalog
   * @param {number?} opts.lastId ID of the last product so the new products continue after it 
   * @param {number?} opts.limit Max products to return (10 if not specified)
   */
  static getProducts(opts:{callback:(action:monagreeActions, data?:productData[])=>void, 
    catalogID?:string, lastId?:number, limit?:number}){
    if(!this.fire){
      opts.callback(new monagreeActions(false,initErr))
      return
    }
    this.fire.getQuery(getRootLoc()+`/stores/${this.config.bid}`,'products',opts.limit ?? 10, (task)=>{
      if(task.isSuccessful()){
        const tem:productData[] = []
        task.getResult().forEach((doc:any)=>{
          const ts = new productData(doc, getDocId(doc))
          tem.push(ts)
        })
        opts.callback(new monagreeActions(true,'OK'),tem)
      }else{
        opts.callback(new monagreeActions(false,task.getEr()))
      }
    },{
      startAt: opts.lastId,
      wheres:opts.catalogID?{commands:[{field:'c',op:'EQUAL',value:opts.catalogID}]}:undefined
    })
  }
  

}