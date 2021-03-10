import { Component, OnInit ,Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MVendor, RFxVendor, RFxVendorView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';


@Component({
  selector: 'app-dialog-content-example-dialog4',
  templateUrl: './dialog-content-example-dialog4.component.html',
  styleUrls: ['./dialog-content-example-dialog4.component.css']
})
export class DialogContentExampleDialog4Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxVendor;
  VendorView=new RFxVendorView;
  visible = true;
  selectable = true;
  removable = true;
  VendorMaster:MVendor[]=[];
  isNewVendor:boolean=false;
  constructor
  (
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog4Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.VendorView = data.data; }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this.DialogueFormGroup.get('Type').disable();
    this.DialogueFormGroup.get('v_name').disable();
    this.DialogueFormGroup.get('GST').disable();
    this.DialogueFormGroup.get('City').disable();
    this._RFxService.GetAllRFxVendorM().subscribe(master=>{
      this.VendorMaster=master as MVendor[];
    });
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Vendor: [this.VendorView.PatnerID, Validators.required],
      Type: [this.VendorView.Type, Validators.required],
      v_name: [this.VendorView.VendorName, Validators.required],
      GST: [this.VendorView.GSTNumber, Validators.required],
      City: [this.VendorView.City, Validators.required],
      mailid1:[],
      mailid2:[],
      contactPerson:[],
      mobile:[]
    });
  }
  Save(){
    if(this.DialogueFormGroup.valid){
      this.rfx.PatnerID=this.DialogueFormGroup.get('Vendor').value;
      this.VendorView.PatnerID=this.DialogueFormGroup.get('Vendor').value;
      this.VendorView.Type=this.DialogueFormGroup.get('Type').value;
      this.VendorView.VendorName=this.DialogueFormGroup.get('v_name').value;
      this.VendorView.GSTNumber=this.DialogueFormGroup.get('GST').value;
      this.VendorView.City=this.DialogueFormGroup.get('City').value;
      if(this.isNewVendor==true){
        var vendor=new MVendor();
        vendor.Client=this.VendorView.Client;
        vendor.Company=this.VendorView.Company;
        vendor.PatnerID=this.VendorView.PatnerID;
        vendor.Type=this.VendorView.Type;
        vendor.VendorName=this.VendorView.VendorName;
        vendor.GST=this.VendorView.GSTNumber;
        vendor.City=this.VendorView.City;
        vendor.EmailID1=this.DialogueFormGroup.get('mailid1').value;
        vendor.EmailID2=this.DialogueFormGroup.get('mailid2').value;
        vendor.ContactPerson=this.DialogueFormGroup.get('contactPerson').value;
        vendor.ContactPersonMobile=this.DialogueFormGroup.get('mobile').value;
        this._RFxService.AddtoVendorTable(vendor).subscribe(res=>{
          var Result={data:this.VendorView,isCreate:this.data.isCreate};
          this.dialogRef.close(Result);
        },err=>{console.log("vendor master not created!;")});
      }else{
        var Result={data:this.VendorView,isCreate:this.data.isCreate};
        this.dialogRef.close(Result);
      }
    }
    else{
      this.ShowValidationErrors(this.DialogueFormGroup);
    }
  }

VendorSelected(patnerid:string){
  for (let i = 0; i < this.VendorMaster.length; i++) {
    if(this.VendorMaster[i].PatnerID==patnerid){
      this.DialogueFormGroup.get('Type').setValue(this.VendorMaster[i].Type);
      this.DialogueFormGroup.get('v_name').setValue(this.VendorMaster[i].VendorName);
      this.DialogueFormGroup.get('GST').setValue(this.VendorMaster[i].GST);
      this.DialogueFormGroup.get('City').setValue(this.VendorMaster[i].City);
    }
  }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
NewClicked(){
  this.isNewVendor=true;
  this.DialogueFormGroup.enable();
  this.DialogueFormGroup.get('mailid1').setValidators(Validators.required);
}
}
