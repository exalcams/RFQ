import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResItem,MMaterial,RFxItem, ResODAttachment } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';
import { parseInt, round } from 'lodash';

@Component({
  selector: 'app-res-item-dialog',
  templateUrl: './res-item-dialog.component.html',
  styleUrls: ['./res-item-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ResItemDialogComponent implements OnInit {
  RFxID:string;
  SelectedFileName:string[]=[];
  DialogueFormGroup: FormGroup;
  ResItemFormGroup: FormGroup;
  rfxitem = new RFxItem;
  MaterialMaster:MMaterial[]=[];
  ResItem:ResItem=new ResItem();
  accept:boolean=false;
  ResODAttachments:ResODAttachment[]=[];
  ResItemFiles:File[]=[];
  isProgressBarVisibile:boolean;

  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<ResItemDialogComponent>,  private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem = data.data;
      this.ResItem=data.Res;
      this.RFxID=this.rfxitem.RFxID;
      this.ResODAttachments=data.Docs;
      this.ResItemFiles=data.DocFiles;
     }    

  ngOnInit() {
    this.InitializeDialogueFormGroup();
    this.DisableRFxItem();
    if(this.ResItem.LeadTimeRemark){
      this.ResItemFormGroup.get('LeadTimeAccept').setValue('No');
    }
    else{
      this.ResItemFormGroup.get('LeadTimeAccept').setValue('Yes');
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
      Item: [this.rfxitem.Item],
      Uom: [this.rfxitem.UOM],
      LowPrice: [this.rfxitem.BiddingPriceLow],
      HighPrice: [this.rfxitem.BiddingPriceHigh],
      material: [this.rfxitem.Material],
      TotalQty: [this.rfxitem.TotalQty],
      Interval: [this.rfxitem.Interval],
      Notes: [this.rfxitem.Notes],
      material_text: [this.rfxitem.MaterialText],
      per_schedule_qty: [this.rfxitem.PerScheduleQty],
      totalSchedules: [this.rfxitem.TotalSchedules],
      incoterm: [this.rfxitem.IncoTerm], 
      LeadTime:[this.rfxitem.LeadTime], 
    });
    this.ResItemFormGroup=this._formBuilder.group({
      Price:[this.ResItem.Price,[Validators.required,Validators.min(parseInt(this.rfxitem.BiddingPriceLow)),Validators.max(parseInt(this.rfxitem.BiddingPriceHigh))]],
      USPRemark:[this.ResItem.USPRemark,Validators.required],
      PriceRating:[this.ResItem.PriceRating,[Validators.required,Validators.pattern('^([0-9]{1})?$')]],
      LeadTimeRating:[this.ResItem.LeadTimeRating,Validators.required],
      LeadTimeAccept:[null,Validators.required],
      LeadTimeRemark:[this.ResItem.LeadTimeRemark]
    });
  }
  DisableRFxItem(){
    this.DialogueFormGroup.disable();
  }
  
  openAttachmentViewDialog(RFxID:string,Ataachments:string[]): void {
    const dialogConfig: MatDialogConfig = {
        data: {Documents:Ataachments,RFxID:RFxID,isResponse:false},
        panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
        AttachmentViewDialogComponent,
        dialogConfig
    );
}
onSelect(event) {
  if(event.addedFiles.length<=3){
    if(event.addedFiles.length>1){
      this.ResItemFiles=[];
      event.addedFiles.forEach(doc => {
        var resodAttach=new ResODAttachment;
        resodAttach.Client=this.rfxitem.Client;
        resodAttach.Company=this.rfxitem.Company;
        resodAttach.RFxID=this.rfxitem.RFxID;
        resodAttach.DocumentTitle=this.rfxitem.Item;
        resodAttach.DocumentName=doc.name;
        this.ResODAttachments.push(resodAttach);
        this.ResItemFiles.push(doc);
      });
    }
    else{
      if(this.ResItemFiles.length<3){
        var resodAttach=new ResODAttachment;
        resodAttach.Client=this.rfxitem.Client;
        resodAttach.Company=this.rfxitem.Company;
        resodAttach.RFxID=this.rfxitem.RFxID;
        resodAttach.DocumentTitle=this.rfxitem.Item;
        resodAttach.DocumentName=event.addedFiles[0].name;
        this.ResODAttachments.push(resodAttach);
        this.ResItemFiles.push(event.addedFiles[0]);
      }
    }
  }
}
onRemove(event) {
  this.ResODAttachments.splice(this.ResItemFiles.indexOf(event),1);
  this.ResItemFiles.splice(this.ResItemFiles.indexOf(event), 1);
}

ValueSelected(type:string){
    if(type == "No"){
      this.DialogueFormGroup.get('LeadTimeRemark').setValidators(Validators.required);
    }
}
Save(){
  if(this.ResItemFormGroup.valid){
    this.ResItem.Client=this.rfxitem.Client;
    this.ResItem.Company=this.rfxitem.Company;
    this.ResItem.RFxID=this.rfxitem.RFxID;
    this.ResItem.Price=this.ResItemFormGroup.get('Price').value;
    this.ResItem.LeadTime=this.DialogueFormGroup.get('LeadTime').value;
    this.ResItem.USPRemark=this.ResItemFormGroup.get('USPRemark').value;
    this.ResItem.PriceRating=this.ResItemFormGroup.get('PriceRating').value;
    this.ResItem.LeadTimeRating=this.ResItemFormGroup.get('LeadTimeRating').value;
    this.ResItem.LeadTimeRemark=this.ResItemFormGroup.get('LeadTimeRemark').value;
    var Result={data:this.ResItem,Attachments:this.ResItemFiles,Docs:this.ResODAttachments};
    // console.log(Result);
    this.dialogRef.close(Result);
  }
  else{
    this.ShowValidationErrors(this.ResItemFormGroup);
  }
}
ShowValidationErrors(formGroup:FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    formGroup.get(key).markAsTouched();
    formGroup.get(key).markAsDirty();
  });
}
}
