import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxIC } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog1',
  templateUrl: './dialog-content-example-dialog1.component.html',
  styleUrls: ['./dialog-content-example-dialog1.component.css']
})
export class DialogContentExampleDialog1Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxIC = new RFxIC;
  fromPage: string;
  constructor(private eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder, private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog1Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.fromPage = data.pageValue; }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  RFQComponentFunction(){    
    this.eventEmitterService.onRFQComponentGetRFXIcsByRFXIDs(String);    
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Item:['',Validators.required],
      Criteria: ['', Validators.required],
      Description: ['', Validators.required]
    });
  }
  AddtoRatingTable(): void {
    console.log(this.DialogueFormGroup.value);
    this.rfxIC.RFxID =this.fromPage;
    this.rfxIC.Client = "1";
    this.rfxIC.Company = "Exa";
    this.rfxIC.Item=this.DialogueFormGroup.get("Item").value;
    this.rfxIC.Criteria = this.DialogueFormGroup.get("Criteria").value;
    this.rfxIC.Text = this.DialogueFormGroup.get("Description").value;
    this._RFxService.AddtoRatingTable(this.rfxIC)
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
