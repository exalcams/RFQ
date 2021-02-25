import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxPartner } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog3',
  templateUrl: './dialog-content-example-dialog3.component.html',
  styleUrls: ['./dialog-content-example-dialog3.component.css']
})
export class DialogContentExampleDialog3Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxPartner;
  fromPage: string;
  constructor(private eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder, private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog3Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.fromPage = data.pageValue; }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup(); 
  }
  RFQComponentFunction(){    
    this.eventEmitterService.onRFQComponentGetRFXPartnersByRFXIDs(String);    
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Partner: ['', Validators.required],
      User: ['', Validators.required]
    });
  }
  AddtoPartnerTable(): void {
    // console.log(this.DialogueFormGroup.value);
    this.rfx.RFxID =  this.fromPage;
    this.rfx.Client = "1";
    this.rfx.Company = "Exa";
    this.rfx.Type = this.DialogueFormGroup.get("Partner").value;
    this.rfx.User = this.DialogueFormGroup.get("User").value;
    console.log(this.rfx);
    this._RFxService.AddtoPartnerTable(this.rfx)
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
