import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHC, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.component.html',
  styleUrls: ['./dialog-content-example-dialog.component.css']
})
export class DialogContentExampleDialogComponent implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxHC = new RFxHC;
  rfxHeader: RFxHeader;
  constructor(
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RFxHeader
  ) {
    this.rfxHeader = data;
  }   
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Criteria: ['', Validators.required],
      Description: ['', Validators.required]
    });
  }
  AddtoEvaluationTable(): void {
    console.log(this.DialogueFormGroup.value);
    this.rfxHC.RFxID =this.rfxHeader.RFxID;
    this.rfxHC.Client = this.rfxHeader.Client;
    this.rfxHC.Company = this.rfxHeader.Company;
    this.rfxHC.CriteriaID = this.DialogueFormGroup.get("Criteria").value;
    this.rfxHC.Text =this.DialogueFormGroup.get("Description").value;
    this._RFxService.AddtoEvaluationTable(this.rfxHC)
      .subscribe(
        response =>{ console.log('success!', response);
        this.dialogRef.close()},
        error => console.log(error));
        console.log("Heloo");
  }
  close() {
    this.dialogRef.close();
}
}
