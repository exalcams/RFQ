import { Component, OnInit ,Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MVendor, RFxHeader, RFxVendor, RFxVendorView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';


@Component({
  selector: 'app-dialog-content-example-dialog4',
  templateUrl: './dialog-content-example-dialog4.component.html',
  styleUrls: ['./dialog-content-example-dialog4.component.css']
})
export class DialogContentExampleDialog4Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxVendor;
  visible = true;
  selectable = true;
  removable = true;
  rfxHeader: RFxHeader;
  VendorMaster:MVendor[]=[];
  constructor
  (
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog4Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RFxHeader
  ) { this.rfxHeader = data; }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxVendorM().subscribe(master=>{
      this.VendorMaster=master as MVendor[];
    });
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Vendor: ['', Validators.required],
      Type: ['', Validators.required],
      v_name: ['', Validators.required],
      GST: ['', Validators.required],
      City: ['', Validators.required]
    });
  }
  AddtoVendorTable():void{
    console.log(this.DialogueFormGroup.value);
    this.rfx.RFxID =this.rfxHeader.RFxID;
    this.rfx.Client = this.rfxHeader.Client;
    this.rfx.Company = this.rfxHeader.Company;
    this.rfx.PatnerID=this.DialogueFormGroup.get('Vendor').value;
    this._RFxService.AddtoVendorTable(this.rfx)
    .subscribe(
      response => {console.log('success!', response),
      this.dialogRef.close()},
      error => console.log(error));
      // window.location.reload()
  }
  close() {
    this.dialogRef.close();
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
}
