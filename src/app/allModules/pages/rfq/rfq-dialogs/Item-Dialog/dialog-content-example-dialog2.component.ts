import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MMaterial, RFxItem } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { round } from 'lodash';


@Component({
  selector: 'app-dialog-content-example-dialog2',
  templateUrl: './dialog-content-example-dialog2.component.html',
  styleUrls: ['./dialog-content-example-dialog2.component.css']
})
export class DialogContentExampleDialog2Component implements OnInit {
  SelectedFileName:string;
  DialogueFormGroup: FormGroup;
  rfxitem = new RFxItem;
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
  MaterialMaster:MMaterial[]=[];
  FileError:boolean=false;
  TotalQty:boolean=false;
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<DialogContentExampleDialog2Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem = data.data;
     }    
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    if(this.rfxitem.Attachment){
      this.SelectedFileName=this.rfxitem.Attachment;
      this.FileError=false;
    }

  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      // Item: [this.rfxitem.Item, Validators.required],
      Uom: [this.rfxitem.UOM, Validators.required],
      LowPrice: [this.rfxitem.BiddingPriceLow, Validators.required],
      HighPrice: [this.rfxitem.BiddingPriceHigh, Validators.required],
      //rating: [this.rfxitem.Rating, Validators.required],
      material: [this.rfxitem.Material, Validators.required],
      TotalQty: [this.rfxitem.TotalQty, [Validators.required]],//,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,3})?$')
      Interval: [this.rfxitem.Interval, Validators.required],
      Notes: [this.rfxitem.Notes, Validators.required],
      material_text: [this.rfxitem.MaterialText, Validators.required],
      per_schedule_qty: [this.rfxitem.PerScheduleQty, [Validators.required]],
      totalSchedules: [this.rfxitem.TotalSchedules],
      incoterm: [this.rfxitem.IncoTerm, [Validators.required,Validators.pattern('^([a-zA-Z]){1,2}?$')]],
      LeadTime:[this.rfxitem.LeadTime,Validators.required]
    });
    this.DialogueFormGroup.get("per_schedule_qty").setValidators(Validators.max(this.DialogueFormGroup.get("TotalQty").value))
    this.DialogueFormGroup.get("TotalQty").setValidators(Validators.min(this.DialogueFormGroup.get("per_schedule_qty").value))
    this.DialogueFormGroup.get('totalSchedules').disable();
  }

  CalculateTotalQTy(){
    this.DialogueFormGroup.get("TotalQty").setValidators(Validators.min(this.DialogueFormGroup.get("per_schedule_qty").value));
  }
onSelect(event) {
  this.files[0]=event.addedFiles[0];
  this.SelectedFileName=this.files[0].name;
  this.FileError=false;
}

MaterialSelected(material:string){
  for (let index = 0; index < this.MaterialMaster.length; index++) {
    if(this.MaterialMaster[index].Material==material){
      this.DialogueFormGroup.get('material_text').setValue(this.MaterialMaster[index].MaterialText);
      this.DialogueFormGroup.get('Uom').setValue(this.MaterialMaster[index].UOM);
      break;
    }
  }
}
CalculateTotalSchedules(){
  var Total=this.DialogueFormGroup.get('TotalQty').value;
  var Schedule=this.DialogueFormGroup.get('per_schedule_qty').value;
  var totalSchedule=parseInt(Total)/parseInt(Schedule);
  this.DialogueFormGroup.get('totalSchedules').setValue(round(totalSchedule).toString());
  this.DialogueFormGroup.get("per_schedule_qty").setValidators(Validators.max(this.DialogueFormGroup.get("TotalQty").value));
}
Save(){
  console.log(this.DialogueFormGroup);
  if(this.DialogueFormGroup.valid){
    // this.rfxitem.Item=this.DialogueFormGroup.get("Item").value;
    this.rfxitem.UOM=this.DialogueFormGroup.get("Uom").value;
    this.rfxitem.BiddingPriceLow=this.DialogueFormGroup.get("LowPrice").value;
    this.rfxitem.BiddingPriceHigh=this.DialogueFormGroup.get("HighPrice").value;
    this.rfxitem.Material=this.DialogueFormGroup.get("material").value;
    this.rfxitem.MaterialText=this.DialogueFormGroup.get("material_text").value;
    this.rfxitem.TotalQty=this.DialogueFormGroup.get("TotalQty").value;
    this.rfxitem.Interval=this.DialogueFormGroup.get("Interval").value;
    this.rfxitem.PerScheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
    this.rfxitem.IncoTerm=this.DialogueFormGroup.get("incoterm").value;
    //this.rfxitem.Rating=this.DialogueFormGroup.get("rating").value;
    this.rfxitem.Notes=this.DialogueFormGroup.get("Notes").value;
    this.rfxitem.TotalSchedules=this.DialogueFormGroup.get("totalSchedules").value;
    this.rfxitem.LeadTime=this.DialogueFormGroup.get("LeadTime").value;
    this.rfxitem.Attachment=this.SelectedFileName;
    var Result={data:this.rfxitem,isCreate:this.data.isCreate,Attachments:this.files[0]};
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.DialogueFormGroup);
  }
  if(!this.SelectedFileName){
    this.FileError=true;
  }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
}
