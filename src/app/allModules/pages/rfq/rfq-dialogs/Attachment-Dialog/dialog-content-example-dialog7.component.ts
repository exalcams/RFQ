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
  SelectedFileName:string;
  DialogueFormGroup: FormGroup;
  rfxAttachment = new RFxODAttachment;
  files: File[] = [];
  FileError:boolean=false;
  constructor(private _RFxService:RFxService,
    private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogContentExampleDialog7Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.rfxAttachment = data.data; }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this.SelectedFileName=this.rfxAttachment.DocumentName;
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Documenttitle: [this.rfxAttachment.DocumentTitle, Validators.required]
    });
  }
  Save(){
    if(this.DialogueFormGroup.valid && this.SelectedFileName){
      this.rfxAttachment.DocumentTitle=this.DialogueFormGroup.get('Documenttitle').value;
      this.rfxAttachment.DocumentName=this.SelectedFileName;
      var Result={data:this.rfxAttachment,isCreate:this.data.isCreate,Attachments:this.files[0]};
      this.dialogRef.close(Result);
    }
    else{
      this.ShowValidationErrors(this.DialogueFormGroup);
      this.FileError=true;
    }
  }
  onSelect(event) {
    this.files[0]=event.addedFiles[0];
    this.SelectedFileName=this.files[0].name;
    this.FileError=false;
  }
  ShowValidationErrors(formGroup:FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });
  }
}
