import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHeader, RFxPartner } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog3',
  templateUrl: './dialog-content-example-dialog3.component.html',
  styleUrls: ['./dialog-content-example-dialog3.component.css']
})
export class DialogContentExampleDialog3Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxPartner;
  rfxHeader: RFxHeader;
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog3Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RFxHeader) { this.rfxHeader = data; }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup(); 
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Partner: ['', Validators.required],
      User: ['', Validators.required]
    });
  }
  AddtoPartnerTable(): void {
    // console.log(this.DialogueFormGroup.value);
    this.rfx.RFxID =this.rfxHeader.RFxID;
    this.rfx.Client = this.rfxHeader.Client;
    this.rfx.Company = this.rfxHeader.Company;
    this.rfx.Type = this.DialogueFormGroup.get("Partner").value;
    this.rfx.User = this.DialogueFormGroup.get("User").value;
    console.log(this.rfx);
    this._RFxService.AddtoPartnerTable(this.rfx)
      .subscribe(
        response => {console.log('success!', response),
        this.dialogRef.close()},
        error => console.log(error));
  }
  close() {
    this.dialogRef.close();
}
}
