import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxODAttachment } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog7',
  templateUrl: './dialog-content-example-dialog7.component.html',
  styleUrls: ['./dialog-content-example-dialog7.component.css']
})
export class DialogContentExampleDialog7Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxODAttachment;
  fromPage: string;
  constructor(
    private eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog7Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.fromPage = data.pageValue; }
    RFQComponentFunction(){    
      this.eventEmitterService.onRFQComponentGetRFXODAttachsByRFXIDs(String);    
    }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Documenttitle: ['', Validators.required],
      Remarks: ['', Validators.required]
    });
  }
  AddtoODAttachTable(): void {
    console.log(this.DialogueFormGroup.value);
    this.rfx.RFxID = this.fromPage;
    this.rfx.Client = "1";
    this.rfx.Company = "Exa";
    this.rfx.DocumentTitle =this.DialogueFormGroup.get("Documenttitle").value;
    this.rfx.Remark = this.DialogueFormGroup.get("Remarks").value;
    this.rfx.SlNo = "1";
    this._RFxService.AddtoODAttachTable(this.rfx)
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
