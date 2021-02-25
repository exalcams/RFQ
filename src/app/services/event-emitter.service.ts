import { Injectable ,EventEmitter } from '@angular/core';   
import { Subscription } from 'rxjs/internal/Subscription';   

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeRFQComponentFunction = new EventEmitter();
  invokeRFQ2ComponentFunction = new EventEmitter();
  invokeRFQ3ComponentFunction = new EventEmitter();
  invokeRFQ4ComponentFunction = new EventEmitter(); 
  invokeRFQ5ComponentFunction = new EventEmitter();
  invokeRFQ6ComponentFunction = new EventEmitter();
  invokeRFQ7ComponentFunction = new EventEmitter();   
  subsVar: Subscription; 
  constructor() { }
  onRFQComponentGetRFXHCsByRFXIDs(String) {    
    this.invokeRFQComponentFunction.emit(String);    
  }   
  onRFQComponentGetRFXIsByRFXIDs(String) {    
    this.invokeRFQ2ComponentFunction.emit(String);    
  }
  onRFQComponentGetRFXIcsByRFXIDs(String) {    
    this.invokeRFQ3ComponentFunction.emit(String);    
  }
  onRFQComponentGetRFXPartnersByRFXIDs(String) {    
    this.invokeRFQ4ComponentFunction.emit(String);    
  }
  onRFQComponentGetRFXVendorsByRFXIDs(String) {    
    this.invokeRFQ5ComponentFunction.emit(String);    
  }
  onRFQComponentGetRFXODsByRFXIDs(String) {    
    this.invokeRFQ6ComponentFunction.emit(String);    
  }
  onRFQComponentGetRFXODAttachsByRFXIDs(String) {    
    this.invokeRFQ7ComponentFunction.emit(String);    
  }     
}
