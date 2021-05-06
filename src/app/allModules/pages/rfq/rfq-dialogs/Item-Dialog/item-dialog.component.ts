import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MMaterial, RFxItem } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { round } from 'lodash';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ItemDialogComponent implements OnInit {
  SelectedFiles:string="";
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
  filteredOptions:any;
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem = data.data;
     }    
  ngOnInit(): void {
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    if(this.rfxitem.Attachment){
      this.SelectedFiles=this.rfxitem.Attachment;
      this.FileError=false;
    }
    this.filteredOptions = this.DialogueFormGroup.get('material').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Uom: [this.rfxitem.UOM, Validators.required],
      LowPrice: [this.rfxitem.BiddingPriceLow, Validators.required],
      HighPrice: [this.rfxitem.BiddingPriceHigh, Validators.required],
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
    this.DialogueFormGroup.get('totalSchedules').disable();
    this.SetValidators();
  }
  SetValidators(){
    this.DialogueFormGroup.get("LowPrice").valueChanges
    .subscribe(data=> {
      this.SetLowPriceValidator();
    });
    this.DialogueFormGroup.get("TotalQty").valueChanges
    .subscribe(data=> {
      this.SetPerScheduleValidator();
    });
    this.DialogueFormGroup.get("per_schedule_qty").valueChanges
    .subscribe(data=> {
      this.SetTotalQtyValidator();
    });
  }
  SetLowPriceValidator(){
    var LowPrice=this.DialogueFormGroup.get("LowPrice").value;
    this.DialogueFormGroup.get("HighPrice").setValidators([Validators.min(LowPrice)]);
  }
  SetPerScheduleValidator(){
    var TotalQty=this.DialogueFormGroup.get("TotalQty").value;
    this.DialogueFormGroup.get("per_schedule_qty").setValidators([Validators.max(TotalQty)]);
  }
  SetTotalQtyValidator(){
    var PSQ=this.DialogueFormGroup.get("per_schedule_qty").value;
    this.DialogueFormGroup.get("TotalQty").setValidators([Validators.min(PSQ)]);
  }

  CalculateTotalQTy(){
    this.DialogueFormGroup.get("TotalQty").setValidators(Validators.min(this.DialogueFormGroup.get("per_schedule_qty").value));
  }
onSelect(event) {
  event.addedFiles.forEach(file => {
    if(this.SelectedFiles==""){
      this.SelectedFiles=file.name;
    }
    else{
      this.SelectedFiles+=","+file.name;
    }
    this.files.push(file);
  });
  this.FileError=false;
  console.log(this.SelectedFiles);
}
onRemove(event) {
  this.files.splice(this.files.indexOf(event), 1);
  var index=this.SelectedFiles.indexOf(event.name);
  if(index!=0){
    this.SelectedFiles=this.SelectedFiles.slice(0,index-1)+this.SelectedFiles.slice(index);
  }
  else{
    this.SelectedFiles=this.SelectedFiles.slice(event.name.length+1);
  }
  this.SelectedFiles=this.SelectedFiles.replace(event.name,'');
  console.log(this.SelectedFiles);
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
    this.rfxitem.UOM=this.DialogueFormGroup.get("Uom").value;
    this.rfxitem.BiddingPriceLow=this.DialogueFormGroup.get("LowPrice").value;
    this.rfxitem.BiddingPriceHigh=this.DialogueFormGroup.get("HighPrice").value;
    this.rfxitem.Material=this.DialogueFormGroup.get("material").value;
    this.rfxitem.MaterialText=this.DialogueFormGroup.get("material_text").value;
    this.rfxitem.TotalQty=this.DialogueFormGroup.get("TotalQty").value;
    this.rfxitem.Interval=this.DialogueFormGroup.get("Interval").value;
    this.rfxitem.PerScheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
    this.rfxitem.IncoTerm=this.DialogueFormGroup.get("incoterm").value;
    this.rfxitem.Notes=this.DialogueFormGroup.get("Notes").value;
    this.rfxitem.TotalSchedules=this.DialogueFormGroup.get("totalSchedules").value;
    this.rfxitem.LeadTime=this.DialogueFormGroup.get("LeadTime").value;
    this.rfxitem.Attachment=this.SelectedFiles;
    var Result={data:this.rfxitem,isCreate:this.data.isCreate,Attachments:this.files};
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.DialogueFormGroup);
  }
  if(this.SelectedFiles==""){
    this.FileError=true;
  }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
private _filter(value: string): any[] {
  const filterValue = value.toLowerCase();
  return this.MaterialMaster.filter(option => option.Material.toLowerCase().indexOf(filterValue) === 0);
}
}
