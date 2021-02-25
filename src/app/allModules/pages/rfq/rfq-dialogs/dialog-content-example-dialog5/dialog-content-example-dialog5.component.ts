import { Component, OnInit , Optional, Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxOD } from 'app/models/RFx';
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
  fromPage: string;
  AnswerType: any;
  constructor(
    private eventEmitterService: EventEmitterService,   
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,public dialogRef: MatDialogRef<DialogContentExampleDialog5Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {  this.fromPage = data.pageValue;}
    RFQComponentFunction(){    
      this.eventEmitterService.onRFQComponentGetRFXODsByRFXIDs(String);    
    }
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Question: ['', Validators.required],
      Answer: ['', Validators.required]
    });
  }
  AddtoODTable():void{
    console.log(this.DialogueFormGroup.value);
    this.rfx.RFxID=this.fromPage;
    this.rfx.Client="1";
    this.rfx.Company="Exa";
    this.rfx.Qusetion=this.DialogueFormGroup.get("Question").value;
    this.rfx.AnswerType=this.DialogueFormGroup.get("Answer").value;
    
    this.rfx.SlNo="1";
    this._RFxService.AddtoODTable(this.rfx)
    .subscribe(
      response => {console.log('success!', response),this.RFQComponentFunction(),
      this.dialogRef.close()},
      error => console.log(error));
      // window.location.reload()
  }
  close() {
    this.dialogRef.close();
}
}
