import { Component, OnInit ,Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MVendor, RFxVendor, RFxVendorView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';


@Component({
  selector: 'app-add-vendor-dialog',
  templateUrl: './add-vendor-dialog.component.html',
  styleUrls: ['./add-vendor-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AddVendorDialogComponent implements OnInit {
  DialogueFormGroup: FormGroup;
  VendorView=new RFxVendorView;
  VendorMaster:MVendor[]=[];
  constructor
  (
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<AddVendorDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.VendorView = data.data; }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxVendorM().subscribe(master=>{
      this.VendorMaster=master as MVendor[];
    });
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Vendor: [''],
      Type: ['', Validators.required],
      v_name: ['', Validators.required],
      GST: [''],
      City: ['', Validators.required],
      mailid1:['',[Validators.required,Validators.email]],
      mailid2:['',Validators.email],
      contactPerson:['',Validators.required],
      mobile:['',[Validators.required,Validators.pattern('[0-9]{10}')]]
    });
  }
  Save(){
    if(this.DialogueFormGroup.valid){
      this.VendorView.PatnerID=this.DialogueFormGroup.get('Vendor').value;
      this.VendorView.Type=this.DialogueFormGroup.get('Type').value;
      this.VendorView.VendorName=this.DialogueFormGroup.get('v_name').value;
      this.VendorView.GSTNumber=this.DialogueFormGroup.get('GST').value;
      this.VendorView.City=this.DialogueFormGroup.get('City').value;
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
      var Result={data:this.VendorView,vendor:vendor};
      this.dialogRef.close(Result);
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
}
