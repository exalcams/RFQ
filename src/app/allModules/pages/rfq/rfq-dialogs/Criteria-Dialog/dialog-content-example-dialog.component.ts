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
  rfxHC:RFxHC;
  constructor(
    private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogContentExampleDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rfxHC = data.data;
  }   
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Criteria: [this.rfxHC.CriteriaID, Validators.required],
      Description: [this.rfxHC.Text, Validators.compose([Validators.required,Validators.maxLength(20)])]
    });
  }

Save(){
  if(this.DialogueFormGroup.valid){
    this.rfxHC.CriteriaID = this.DialogueFormGroup.get("Criteria").value;
    this.rfxHC.Text =this.DialogueFormGroup.get("Description").value;
    var Result={data:this.rfxHC,isCreate:this.data.isCreate};
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.DialogueFormGroup);
  }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
}
