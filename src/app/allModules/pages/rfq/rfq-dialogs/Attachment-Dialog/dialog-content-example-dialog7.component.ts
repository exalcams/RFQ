import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHeader, RFxODAttachment } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog7',
  templateUrl: './dialog-content-example-dialog7.component.html',
  styleUrls: ['./dialog-content-example-dialog7.component.css']
})
export class DialogContentExampleDialog7Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxODAttachment;
  rfxHeader: RFxHeader;
  constructor(
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog7Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RFxHeader) { this.rfxHeader = data; }
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
    this.rfx.RFxID =this.rfxHeader.RFxID;
    this.rfx.Client = this.rfxHeader.Client;
    this.rfx.Company = this.rfxHeader.Company;
    this.rfx.DocumentTitle =this.DialogueFormGroup.get("Documenttitle").value;
    this.rfx.Remark = this.DialogueFormGroup.get("Remarks").value;
    this._RFxService.AddtoODAttachTable(this.rfx)
      .subscribe(
        response => {console.log('success!', response),
        this.dialogRef.close()},
        error => console.log(error));
  }
  close() {
    this.dialogRef.close();
}
}
