import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResItem,MMaterial,RFxItem, ResODAttachment } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';
import { parseInt, round } from 'lodash';

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
    this.files=this.ResItemFiles;
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
      Price:[this.ResItem.Price,[Validators.required,Validators.min(parseInt(this.rfxitem.BiddingPriceLow)),Validators.max(parseInt(this.rfxitem.BiddingPriceHigh))]],
      USPRemark:[this.ResItem.USPRemark,Validators.required],
      PriceRating:[this.ResItem.PriceRating,[Validators.required,Validators.pattern('^([0-9]{1})?$')]],
      LeadTimeRating:[this.ResItem.LeadTimeRating,Validators.required],
      LeadTimeAccept:[this.ResItem.LeadTimeAccept,Validators.required],
      LeadTimeRemark:[this.ResItem.LeadTimeRemark]
    });
  }
  DisableRFxItem(){
    this.DialogueFormGroup.get('Item').disable();
    this.DialogueFormGroup.get('material_text').disable();
    this.DialogueFormGroup.get('Uom').disable();
    this.DialogueFormGroup.get('TotalQty').disable();
    this.DialogueFormGroup.get('per_schedule_qty').disable();
    this.DialogueFormGroup.get('totalSchedules').disable();
    this.DialogueFormGroup.get('LowPrice').disable();
    this.DialogueFormGroup.get('HighPrice').disable();
    this.DialogueFormGroup.get('Interval').disable();
    this.DialogueFormGroup.get('incoterm').disable();
    this.DialogueFormGroup.get('Notes').disable();
    this.DialogueFormGroup.get('LeadTime').disable();
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
      this.ResODAttachments=[];
      this.files=[];
      event.addedFiles.forEach(doc => {
        var resodAttach=new ResODAttachment;
        resodAttach.Client=this.rfxitem.Client;
        resodAttach.Company=this.rfxitem.Company;
        resodAttach.RFxID=this.rfxitem.RFxID;
        resodAttach.DocumentName=doc.name;
        this.ResODAttachments.push(resodAttach);
        this.files.push(doc);
      });
    }
    else{
      if(this.files.length<3){
        var resodAttach=new ResODAttachment;
        resodAttach.Client=this.rfxitem.Client;
        resodAttach.Company=this.rfxitem.Company;
        resodAttach.RFxID=this.rfxitem.RFxID;
        resodAttach.DocumentName=event.addedFiles[0].name;
        this.ResODAttachments.push(resodAttach);
        this.files.push(event.addedFiles[0]);
      }
    }
  }
}
onRemove(event) {
  this.ResODAttachments.splice(this.files.indexOf(event),1);
  this.files.splice(this.files.indexOf(event), 1);
}

ValueSelected(type:string){
    if(this.DialogueFormGroup.get('LeadTimeAccept').value == "Yes"){
      this.accept=false;
    } 
    else if(this.DialogueFormGroup.get('LeadTimeAccept').value == "No"){
      this.accept=true;
      this.DialogueFormGroup.get('LeadTimeAccept').setValidators(Validators.required);
    }
}
Save(){
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
    var Result={data:this.ResItem,Attachments:this.files,Docs:this.ResODAttachments};
    // console.log(Result);
    this.dialogRef.close(Result);
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
