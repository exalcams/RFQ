import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResOD, RFxOD } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-res-ans-dialog',
  templateUrl: './res-ans-dialog.component.html',
  styleUrls: ['./res-ans-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ResAnsDialogComponent implements OnInit {
  Question:RFxOD;
  ResOD:ResOD;
  DialogueFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
     private _RFxService: RFxService,
     public dialogRef: MatDialogRef<ResAnsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.Question=data.data;
      this.ResOD=data.data1.OD;
     }

  ngOnInit() {
    this.InitializeDialogueFormGroup();
    this.DialogueFormGroup.get('Question').disable();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Question:[this.Question.Qusetion],
      Answer:[this.ResOD.Answer,Validators.required]
    });
  }
  SaveClicked(){
    if(this.DialogueFormGroup.valid){
      this.ResOD.Answer=this.DialogueFormGroup.get('Answer').value;
      this.dialogRef.close(this.ResOD);
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
