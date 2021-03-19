import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MVendor, MVendorView, RFxVendor, RFxVendorView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-select-vendor-dialog',
  templateUrl: './select-vendor-dialog.component.html',
  styleUrls: ['./select-vendor-dialog.component.scss']
})
export class SelectVendorDialogComponent implements OnInit {
  Searchkey:string='';
  VendorType:string;
  VendorMaster:MVendor[]=[];
  FilteredVendors:MVendorView[]=[];
  VendorViews:RFxVendorView[]=[];
  RFxVendorsViews:RFxVendorView[]=[];
  MVendorViews:MVendorView[]=[];
  SelectedVendors:MVendorView[]=[];
  constructor(public dialogRef: MatDialogRef<SelectVendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private _RFxService:RFxService) {
      this.RFxVendorsViews=this.data.data;
    }

  ngOnInit() {
    console.log(this.RFxVendorsViews);
    this._RFxService.GetAllRFxVendorM().subscribe(master=>{
      this.VendorMaster=master as MVendor[];
      this.VendorMaster.forEach((vendor:any) => {
        vendor.Checked=false;
        this.MVendorViews.push(vendor)
      });
      console.log("total",this.MVendorViews);
      this.MVendorViews.forEach(element => {
        var MVendor=this.RFxVendorsViews.filter(t=>t.PatnerID==element.PatnerID);
        if(MVendor.length>0){
          element.Checked=true;
          this.SelectedVendors.push(element);
        }
      });
      console.log("selected",this.SelectedVendors);
    });
    
  }
  
  FilterVendor(){
    if(this.Searchkey.length>=3){
      this.FilteredVendors=this.MVendorViews.filter(vm=>
        vm.VendorName.toLowerCase().indexOf(this.Searchkey.toLowerCase())>=0 ||
        vm.GST.toLowerCase().indexOf(this.Searchkey.toLowerCase())>=0 ||
        vm.City.toLowerCase().indexOf(this.Searchkey.toLowerCase())>=0
      );
    }
    else{
      this.FilteredVendors=[];
    }
  }

  Toggle(vendor:MVendorView){
    console.log(vendor);
    vendor.Checked=!vendor.Checked;
    if(vendor.Checked){
      this.SelectedVendors.push(vendor);
    }
    else{
      for (let index = 0; index < this.SelectedVendors.length; index++) {
        if(this.SelectedVendors[index].PatnerID==vendor.PatnerID){
          this.SelectedVendors.splice(index,1);
          break;
        }
      }
    }
  }

  TransferClicked(){
    console.log(this.SelectedVendors);
    this.SelectedVendors.forEach(vendor => {
      var VendorView=new RFxVendorView();
      VendorView.PatnerID=vendor.PatnerID;
      VendorView.Type=vendor.Type;
      VendorView.VendorName=vendor.VendorName;
      VendorView.GSTNumber=vendor.GST;
      VendorView.City=vendor.City;
      this.VendorViews.push(VendorView);
    });
    var Result={data:this.VendorViews};
    this.dialogRef.close(Result);
  }
  
  ShowValidationErrors(formGroup:FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });
  }
}
