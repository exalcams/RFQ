import { Component, OnInit , Optional, Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHeader, RFxOD } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog5',
  templateUrl: './dialog-content-example-dialog5.component.html',
  styleUrls: ['./dialog-content-example-dialog5.component.css']
})
export class DialogContentExampleDialog5Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxOD;
  constructor(  
    private _formBuilder: FormBuilder,public dialogRef: MatDialogRef<DialogContentExampleDialog5Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {  this.rfx = data.data;}
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Question: [this.rfx.Qusetion, Validators.required],
      AnswerType: [this.rfx.AnswerType, Validators.required],
      //Answer: [this.rfx.Answer, Validators.required]
    });
  }
  
  Save(){
    if(this.DialogueFormGroup.valid){
      this.rfx.Qusetion=this.DialogueFormGroup.get("Question").value;
      this.rfx.AnswerType=this.DialogueFormGroup.get("AnswerType").value;
      //this.rfx.Answer=this.DialogueFormGroup.get("Answer").value;
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
