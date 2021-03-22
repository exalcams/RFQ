import { NgModule } from '@angular/core';	
import {CommonModule} from "@angular/common";	
import { CustomDatePipe } from './custom-date-pipe';	
import { RemoveLeadingZeroPipe } from './remove-leading-zero';


 @NgModule({	
  declarations:[CustomDatePipe],	
  imports:[CommonModule],	
  exports:[CustomDatePipe] 	
})	

 export class SharedModule{} 