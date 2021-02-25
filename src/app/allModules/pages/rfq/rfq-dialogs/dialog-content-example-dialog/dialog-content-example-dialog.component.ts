import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHC } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.component.html',
  styleUrls: ['./dialog-content-example-dialog.component.css']
})
export class DialogContentExampleDialogComponent implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxHC = new RFxHC;
  fromPage: string;
  constructor(
    private _formBuilder: FormBuilder, private eventEmitterService: EventEmitterService,
    private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fromPage = data.pageValue;
  }
  RFQComponentFunction(){    
    this.eventEmitterService.onRFQComponentGetRFXHCsByRFXIDs(String);    
  }    
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Criteria: ['', Validators.required],
      Description: ['', Validators.required]
    });
  }
  AddtoEvaluationTable(): void {
    console.log(this.DialogueFormGroup.value);
    this.rfxHC.RFxID =this.fromPage;
    this.rfxHC.Client = "1";
    this.rfxHC.Company = "Exa";
    this.rfxHC.CriteriaID = this.DialogueFormGroup.get("Criteria").value;
    this.rfxHC.Text =this.DialogueFormGroup.get("Description").value;
    this._RFxService.AddtoEvaluationTable(this.rfxHC)
      .subscribe(
        response =>{ console.log('success!', response),
        this.RFQComponentFunction(),
        this.dialogRef.close()},
        error => console.log(error));
        console.log("Heloo");
        
    // window.location.reload()
  }
  close() {
    this.dialogRef.close();
}
}
