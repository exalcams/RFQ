import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHC, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-criteria-dialog',
  templateUrl: './criteria-dialog.component.html',
  styleUrls: ['./criteria-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CriteriaDialogComponent implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxHC:RFxHC;
  constructor(
    private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<CriteriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rfxHC = data.data;
  }   
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Description: [this.rfxHC.Text, Validators.compose([Validators.required,Validators.maxLength(60)])]
    });
  }

Save(){
  if(this.DialogueFormGroup.valid){
    this.rfxHC.Text =this.DialogueFormGroup.get("Description").value;
    var Result={data:this.rfxHC};
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.DialogueFormGroup);
  }
}
AddAndNew(){
  if(this.DialogueFormGroup.valid){
    this.rfxHC.Text =this.DialogueFormGroup.get("Description").value;
    var Result={data:this.rfxHC,isNew:true};
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
