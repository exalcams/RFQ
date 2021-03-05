import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  RFxPartner } from 'app/models/RFx';

@Component({
  selector: 'app-dialog-content-example-dialog3',
  templateUrl: './dialog-content-example-dialog3.component.html',
  styleUrls: ['./dialog-content-example-dialog3.component.css']
})
export class DialogContentExampleDialog3Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxPartner;
  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogContentExampleDialog3Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.rfx = data.data; }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup(); 
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Partner: [this.rfx.Type, Validators.required],
      User: [this.rfx.User, Validators.required]
    });
  }
  
  Save(){
    if(this.DialogueFormGroup.valid){
      this.rfx.Type = this.DialogueFormGroup.get("Partner").value;
      this.rfx.User = this.DialogueFormGroup.get("User").value;
      var Result={data:this.rfx,isCreate:this.data.isCreate};
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
