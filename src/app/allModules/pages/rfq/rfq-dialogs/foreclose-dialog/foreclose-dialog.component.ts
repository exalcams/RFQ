import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { DialogData } from 'app/notifications/notification-dialog/dialog-data';

@Component({
  selector: 'app-foreclose-dialog',
  templateUrl: './foreclose-dialog.component.html',
  styleUrls: ['./foreclose-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ForecloseDialogComponent implements OnInit {
  DialogueFormGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,private _formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<ForecloseDialogComponent>,
  ) {

  }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Remarks: ["", Validators.required]
    });
  }
  YesClicked(): void {
    if(this.DialogueFormGroup.valid){
      this.dialogRef.close(this.DialogueFormGroup.get("Remarks").value);
    }
    else{
      this.ShowValidationErrors(this.DialogueFormGroup);
    }
  }

  CloseClicked(): void {
    this.dialogRef.close(false);
  }
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
}
