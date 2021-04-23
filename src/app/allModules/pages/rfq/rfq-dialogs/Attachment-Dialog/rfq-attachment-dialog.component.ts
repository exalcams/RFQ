import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHeader, RFxODAttachment } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-rfq-attachment-dialog',
  templateUrl: './rfq-attachment-dialog.component.html',
  styleUrls: ['./rfq-attachment-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class RFQAttachmentDialogComponent implements OnInit {
  SelectedFileName:string;
  DialogueFormGroup: FormGroup;
  rfxAttachment = new RFxODAttachment;
  files: File[] = [];
  FileError:boolean=false;
  constructor(private _RFxService:RFxService,
    private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<RFQAttachmentDialogComponent>,
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
    if(this.DialogueFormGroup.valid){
      if(!this.SelectedFileName){
        this.FileError=true;
      }
      else{
        this.rfxAttachment.DocumentTitle=this.DialogueFormGroup.get('Documenttitle').value;
        this.rfxAttachment.DocumentName=this.SelectedFileName;
        var Result={data:this.rfxAttachment,isCreate:this.data.isCreate,Attachments:this.files[0]};
        this.dialogRef.close(Result);
      }
    }
    else{
      this.ShowValidationErrors(this.DialogueFormGroup);
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
