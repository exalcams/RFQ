import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RFxItem } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';


@Component({
  selector: 'app-dialog-content-example-dialog2',
  templateUrl: './dialog-content-example-dialog2.component.html',
  styleUrls: ['./dialog-content-example-dialog2.component.css']
})
export class DialogContentExampleDialog2Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfxitem = new RFxItem;
  fromPage: string;
  files: File[] = [];
  attachments: any;
  myDecimal:any;
  _localvariable:any;
  myDecimal2:any;
  _lvqty:any;
  editable: boolean = false;
  _TotalQty:number;
  _perscheduleQty:number;
  _Interval:number;
  constructor(  private eventEmitterService: EventEmitterService  ,private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<DialogContentExampleDialog2Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.fromPage = data.pageValue;
     }
    RFQComponentFunction(){    
      this.eventEmitterService.onRFQComponentGetRFXIsByRFXIDs(String);    
    }     
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Item: ['', Validators.required],
      Uom: ['', Validators.required],
      LowPrice: ['', Validators.required],
      HighPrice: ['', Validators.required],
      rating: ['', Validators.required],
      material: ['', Validators.required],
      TotalQty: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,3})?$')]],
      Interval: ['', Validators.required],
      Notes: ['', Validators.required],
      material_text: ['', Validators.required],
      per_schedule_qty: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,3})?$')]],
      incoterm: ['', Validators.required],
    });
  }
  AddtoItemTable():void{
    console.log(this.DialogueFormGroup.value);
    this.rfxitem.RFxID=this.fromPage;
    this.rfxitem.Client="1";
    this.rfxitem.Company="Exa";
    this.rfxitem.Item=this.DialogueFormGroup.get("Item").value;
    this.rfxitem.UOM=this.DialogueFormGroup.get("Uom").value;
    this.rfxitem.BiddingPriceLow=this.DialogueFormGroup.get("LowPrice").value;
    this.rfxitem.BiddingPriceHigh=this.DialogueFormGroup.get("HighPrice").value;
    this.rfxitem.Material=this.DialogueFormGroup.get("material").value;
    this.rfxitem.MaterialText=this.DialogueFormGroup.get("material_text").value;
    this.rfxitem.TotalQty=this.DialogueFormGroup.get("TotalQty").value;
    this.rfxitem.Interval=this.DialogueFormGroup.get("Interval").value;
    this.rfxitem.PerScheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
    this.rfxitem.IncoTerm=this.DialogueFormGroup.get("incoterm").value;
    this.rfxitem.Rating=this.DialogueFormGroup.get("rating").value;
    this.rfxitem.Notes=this.DialogueFormGroup.get("Notes").value;
    // this.rfxitem.Attachment=this.DialogueFormGroup.get("").value;
    this._RFxService.AddtoItemTable(this.rfxitem)
    .subscribe(
      response => {console.log('success!', response),
      this.RFQComponentFunction(),
        this.dialogRef.close()},
      error => console.log(error));
      // window.location.reload()
      // this.AddAttachment();
  }
  CalculateInterval(){
  this._TotalQty=this.DialogueFormGroup.get("TotalQty").value;
  this._perscheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
  this._Interval=this._TotalQty-this._perscheduleQty;
  console.log(this._Interval);
  }
  close() {
    this.dialogRef.close();
}
onSelect(event) {
  this.files.push(event.addedFiles[0]);
  console.log(this.files);
}
onRemove(event) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}
AddAttachment() {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.files.length; i++) {
    this.attachments.push(this.files[i]);
  }
  this.files = [];
}
}
