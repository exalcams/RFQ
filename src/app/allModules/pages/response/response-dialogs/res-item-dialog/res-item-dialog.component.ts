import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogContentExampleDialog2Component } from 'app/allModules/pages/rfq/rfq-dialogs/Item-Dialog/dialog-content-example-dialog2.component';
import { ResItem } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-res-item-dialog',
  templateUrl: './res-item-dialog.component.html',
  styleUrls: ['./res-item-dialog.component.scss']
})
export class ResItemDialogComponent implements OnInit {

  ResItem:ResItem;
  DialogueFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
     private _RFxService: RFxService,
     public dialogRef: MatDialogRef<DialogContentExampleDialog2Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.ResItem=data.data.Item;
     }

  ngOnInit() {
    console.log("data",this.data);
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Price:[this.ResItem.Price,Validators.required],
      LeadTime:[this.ResItem.LeadTime,[Validators.required,Validators.pattern('^([0-9]{1,3})?$')]],
      USPRemark:[this.ResItem.USPRemark,Validators.required],
      PriceRating:[this.ResItem.PriceRating,[Validators.required,Validators.pattern('^([0-9]{1})?$')]],
      LeadTimeRating:[this.ResItem.LeadTimeRating,Validators.required]
    });
  }
  SaveClicked(){
    if(this.DialogueFormGroup.valid){
      this.ResItem.Price=this.DialogueFormGroup.get('Price').value;
      this.ResItem.LeadTime=this.DialogueFormGroup.get('LeadTime').value;
      this.ResItem.USPRemark=this.DialogueFormGroup.get('USPRemark').value;
      this.ResItem.PriceRating=this.DialogueFormGroup.get('PriceRating').value;
      this.ResItem.LeadTimeRating=this.DialogueFormGroup.get('LeadTimeRating').value;
      this.dialogRef.close(this.ResItem);
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
