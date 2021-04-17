import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxHeader, RFxIC } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-dialog-content-example-dialog1',
  templateUrl: './dialog-content-example-dialog1.component.html',
  styleUrls: ['./dialog-content-example-dialog1.component.css']
})
export class DialogContentExampleDialog1Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxIC = new RFxIC;
  rfxHeader: RFxHeader;
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService, public dialogRef: MatDialogRef<DialogContentExampleDialog1Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RFxHeader) { this.rfxHeader = data; }

  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
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
    this.rfxIC.RFxID =this.rfxHeader.RFxID;
    this.rfxIC.Client = this.rfxHeader.Client;
    this.rfxIC.Company = this.rfxHeader.Company;
    //this.rfxIC.Item=this.DialogueFormGroup.get("Item").value;
    this.rfxIC.Criteria = this.DialogueFormGroup.get("Criteria").value;
    this.rfxIC.Text = this.DialogueFormGroup.get("Description").value;
    this._RFxService.AddtoRatingTable(this.rfxIC)
      .subscribe(
        response => {console.log('success!', response),
        this.dialogRef.close()},
        error => console.log(error));
    // window.location.reload()
  }
  close() {
    this.dialogRef.close();
}
}
