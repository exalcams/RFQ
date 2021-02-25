import { Component, OnInit ,Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MVendor } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';


@Component({
  selector: 'app-dialog-content-example-dialog4',
  templateUrl: './dialog-content-example-dialog4.component.html',
  styleUrls: ['./dialog-content-example-dialog4.component.css']
})
export class DialogContentExampleDialog4Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new MVendor;
  visible = true;
  selectable = true;
  removable = true;
  fromPage: string;
  constructor
  (
    private eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog4Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.fromPage = data.pageValue; }
  RFQComponentFunction(){    
    this.eventEmitterService.onRFQComponentGetRFXVendorsByRFXIDs(String);    
  }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
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
    this.rfx.PatnerID=this.fromPage;
    this.rfx.Client="2";
    this.rfx.Company="Exa";
    this.rfx.VendorName=this.DialogueFormGroup.get("v_name").value;
    this.rfx.Type=this.DialogueFormGroup.get("Type").value;
    this.rfx.GST=this.DialogueFormGroup.get("GST").value;
    this.rfx.City=this.DialogueFormGroup.get("City").value;
    this._RFxService.AddtoVendorTable(this.rfx)
    .subscribe(
      response => {console.log('success!', response),this.RFQComponentFunction(),
      this.dialogRef.close()},
      error => console.log(error));
      // window.location.reload()
  }
  close() {
    this.dialogRef.close();
}
}
