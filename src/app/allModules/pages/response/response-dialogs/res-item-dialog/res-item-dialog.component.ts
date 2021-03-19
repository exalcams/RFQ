import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogContentExampleDialog2Component } from 'app/allModules/pages/rfq/rfq-dialogs/Item-Dialog/dialog-content-example-dialog2.component';
import { ResItem,MMaterial,RFxItem, ResODAttachment } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';
import { round } from 'lodash';

@Component({
  selector: 'app-res-item-dialog',
  templateUrl: './res-item-dialog.component.html',
  styleUrls: ['./res-item-dialog.component.scss']
})
export class ResItemDialogComponent implements OnInit {
  RFxID:string;
  SelectedFileName:string[]=[];
  DialogueFormGroup: FormGroup;
  rfxitem = new RFxItem;
  files: File[] = [];
  MaterialMaster:MMaterial[]=[];
  ResItem:ResItem=new ResItem();
  accept:boolean=false;

  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<ResItemDialogComponent>,  private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem = data.data;
      this.ResItem=data.Res;
      this.RFxID=this.rfxitem.RFxID;
     }    

  ngOnInit() {
    this.InitializeDialogueFormGroup();
    this.DialogueFormGroup.controls['Item'].disable();
    this.DialogueFormGroup.controls['material_text'].disable();
    this.DialogueFormGroup.controls['Uom'].disable();
    this.DialogueFormGroup.controls['TotalQty'].disable();
    this.DialogueFormGroup.controls['per_schedule_qty'].disable();
    this.DialogueFormGroup.controls['totalSchedules'].disable();
    this.DialogueFormGroup.controls['LowPrice'].disable();
    this.DialogueFormGroup.controls['HighPrice'].disable();
    this.DialogueFormGroup.controls['Interval'].disable();
    this.DialogueFormGroup.controls['incoterm'].disable();
    this.DialogueFormGroup.controls['Notes'].disable();
    this.DialogueFormGroup.controls['LeadTime'].disable();
    if(this.ResItem.LeadTimeRemark.length){
      this.DialogueFormGroup.get('LeadTimeAccept').setValue('No');
    }
    else{
      this.DialogueFormGroup.get('LeadTimeAccept').setValue('Yes');
    }
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    if(this.rfxitem.Attachment){
      this.SelectedFileName.push(this.rfxitem.Attachment);
    }
  }
  types: any = [
    'Yes',
    'No'
  ];
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Item: [this.rfxitem.Item, Validators.required],
      Uom: [this.rfxitem.UOM, Validators.required],
      LowPrice: [this.rfxitem.BiddingPriceLow, Validators.required],
      HighPrice: [this.rfxitem.BiddingPriceHigh, Validators.required],
      //rating: [this.rfxitem.Rating, Validators.required],
      material: [this.rfxitem.Material, Validators.required],
      TotalQty: [this.rfxitem.TotalQty, [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,3})?$')]],
      Interval: [this.rfxitem.Interval, Validators.required],
      Notes: [this.rfxitem.Notes, Validators.required],
      material_text: [this.rfxitem.MaterialText, Validators.required],
      per_schedule_qty: [this.rfxitem.PerScheduleQty, [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,3})?$')]],
      totalSchedules: [this.rfxitem.TotalSchedules],
      incoterm: [this.rfxitem.IncoTerm, [Validators.required,Validators.pattern('^([a-zA-Z]){1,2}?$')]], 
      LeadTime:[this.rfxitem.LeadTime,[Validators.required]], 
      Price:[this.ResItem.Price,Validators.required],
      USPRemark:[this.ResItem.USPRemark,Validators.required],
      PriceRating:[this.ResItem.PriceRating,[Validators.required,Validators.pattern('^([0-9]{1})?$')]],
      LeadTimeRating:[this.ResItem.LeadTimeRating,Validators.required],
      LeadTimeAccept:[this.ResItem.LeadTimeAccept,Validators.required],
      LeadTimeRemark:[this.ResItem.LeadTimeRemark]
    });
  }

  // CalculateInterval(){
  // this._TotalQty=this.DialogueFormGroup.get("TotalQty").value;
  // this._perscheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
  // this._Interval=this._TotalQty-this._perscheduleQty;
  // console.log(this._Interval);
  // }
  
  openAttachmentViewDialog(RFxID:string,Ataachments:string[]): void {
    const dialogConfig: MatDialogConfig = {
        data: {Documents:Ataachments,RFxID:RFxID},
        panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
        AttachmentViewDialogComponent,
        dialogConfig
    );
}
onSelect(event) {
  if(this.files.length<=2){
    this.files.push(event.addedFiles[0]);
  }
  console.log(this.files);
}

// MaterialSelected(material:string){
//   for (let index = 0; index < this.MaterialMaster.length; index++) {
//     if(this.MaterialMaster[index].Material==material){
//       this.DialogueFormGroup.get('material_text').setValue(this.MaterialMaster[index].MaterialText);
//       this.DialogueFormGroup.get('Uom').setValue(this.MaterialMaster[index].UOM);
//       break;
//     }
//   }
// }
ValueSelected(type:string){
    if(this.DialogueFormGroup.get('LeadTimeAccept').value == "Yes"){
      this.accept=false;
    } 
    else if(this.DialogueFormGroup.get('LeadTimeAccept').value == "No"){
      this.accept=true;
      this.DialogueFormGroup.get('LeadTimeAccept').setValidators(Validators.required);
    }
}
// CalculateTotalSchedules(){
//   var Total=this.DialogueFormGroup.get('TotalQty').value;
//   var Schedule=this.DialogueFormGroup.get('per_schedule_qty').value;
//   var totalSchedule=parseInt(Total)/parseInt(Schedule);
//   this.DialogueFormGroup.get('totalSchedules').setValue(round(totalSchedule).toString());
// }
Save(){
  console.log(this.DialogueFormGroup);
  if(this.DialogueFormGroup.valid){
    this.ResItem.Client=this.rfxitem.Client;
    this.ResItem.Company=this.rfxitem.Company;
    this.ResItem.RFxID=this.rfxitem.RFxID;
    this.ResItem.Price=this.DialogueFormGroup.get('Price').value;
    this.ResItem.LeadTime=this.DialogueFormGroup.get('LeadTime').value;
    this.ResItem.USPRemark=this.DialogueFormGroup.get('USPRemark').value;
    this.ResItem.PriceRating=this.DialogueFormGroup.get('PriceRating').value;
    this.ResItem.LeadTimeRating=this.DialogueFormGroup.get('LeadTimeRating').value;
    this.ResItem.LeadTimeRemark=this.DialogueFormGroup.get('LeadTimeRemark').value;
    var Result={data:this.ResItem,Attachments:this.files};
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.DialogueFormGroup);
  }
  // console.log(this.DialogueFormGroup);
  // if(this.DialogueFormGroup.valid){
  //   this.rfxitem.Item=this.DialogueFormGroup.get("Item").value;
  //   this.rfxitem.UOM=this.DialogueFormGroup.get("Uom").value;
  //   this.rfxitem.BiddingPriceLow=this.DialogueFormGroup.get("LowPrice").value;
  //   this.rfxitem.BiddingPriceHigh=this.DialogueFormGroup.get("HighPrice").value;
  //   this.rfxitem.Material=this.DialogueFormGroup.get("material").value;
  //   this.rfxitem.MaterialText=this.DialogueFormGroup.get("material_text").value;
  //   this.rfxitem.TotalQty=this.DialogueFormGroup.get("TotalQty").value;
  //   this.rfxitem.Interval=this.DialogueFormGroup.get("Interval").value;
  //   this.rfxitem.PerScheduleQty=this.DialogueFormGroup.get("per_schedule_qty").value;
  //   this.rfxitem.IncoTerm=this.DialogueFormGroup.get("incoterm").value;
  //   //this.rfxitem.Rating=this.DialogueFormGroup.get("rating").value;
  //   this.rfxitem.Notes=this.DialogueFormGroup.get("Notes").value;
  //   this.rfxitem.TotalSchedules=this.DialogueFormGroup.get("totalSchedules").value;
  //   this.rfxitem.Attachment=this.SelectedFileName;
  //   var Result={data:this.rfxitem,isCreate:this.data.isCreate,Attachments:this.files[0]};
  //   this.dialogRef.close(Result);
  // }
  // else{
  //   this.ShowValidationErrors(this.DialogueFormGroup);
  // }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
}
