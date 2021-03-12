import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResODAttachment } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-res-attach-dialog',
  templateUrl: './res-attach-dialog.component.html',
  styleUrls: ['./res-attach-dialog.component.scss']
})
export class ResAttachDialogComponent implements OnInit {
  SelectedFileName:string;
  DialogueFormGroup: FormGroup;
  resAttachment = new ResODAttachment;
  files: File[] = [];
  FileError:boolean=false;
  constructor(private _RFxService:RFxService,
    private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ResAttachDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {this.resAttachment = data.data; }

  ngOnInit() {
    this.InitializeDialogueFormGroup();
    this.SelectedFileName=this.resAttachment.DocumentName;
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Documenttitle: [this.resAttachment.DocumentTitle, Validators.required]
    });
  }
  Save(){
    if(this.DialogueFormGroup.valid && this.SelectedFileName){
      this.resAttachment.DocumentTitle=this.DialogueFormGroup.get('Documenttitle').value;
      this.resAttachment.DocumentName=this.SelectedFileName;
      var Result={data:this.resAttachment,isCreate:this.data.isCreate,Attachments:this.files[0]};
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
