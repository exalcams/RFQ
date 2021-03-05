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
  constructor
  (
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog4Component>,
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
      Vendor: [this.VendorView.PatnerID, Validators.required],
      Type: [this.VendorView.Type, Validators.required],
      v_name: [this.VendorView.VendorName, Validators.required],
      GST: [this.VendorView.GSTNumber, Validators.required],
      City: [this.VendorView.City, Validators.required]
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
      var Result={data:this.VendorView,isCreate:this.data.isCreate};
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
