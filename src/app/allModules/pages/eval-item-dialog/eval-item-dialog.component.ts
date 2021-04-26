import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { EvalCriteriaView, EvalHC, EvalIC, EvaluatedICs, MMaterial, ResItem, ResODAttachment, RespondedItems, RFxItem } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-eva-item-dialog',
  templateUrl: './eval-item-dialog.component.html',
  styleUrls: ['./eval-item-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})


export class EvaItemDialogComponent implements OnInit {
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description','ItemRating'];
  EvaluationDetailsDataSource: MatTableDataSource<EvalCriteriaView>;
  ResODAttachment:ResODAttachment[]=[];
  RFxItemAttachment:string[]=[];
  ResItemAttachment:string[]=[];
  RespondedI: EvaluatedICs[] = [];
  DialogueFormGroup: FormGroup;
  ResItemFormGroup:FormGroup;
  rfxitem = new RFxItem();
  MaterialMaster:MMaterial[]=[];
  ResItem:ResItem = new ResItem();
  types: any = [
    'Yes',
    'No'
  ];
  IsReadOnly:boolean=false;
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<EvaItemDialogComponent>,  private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem=data.RFxItem;
      this.ResItem=data.ResItem;
      this.IsReadOnly=data.IsReadOnly;
     }

  ngOnInit() {
    console.log(this.data);
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    this.GetResODAttachments(this.ResItem.RESID);
    this.DialogueFormGroup.disable();
  }
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
      Price:[this.ResItem.Price],
      USPRemark:[this.ResItem.USPRemark],
      PriceRating:[this.ResItem.PriceRating],
      LeadTimeRating:[this.ResItem.LeadTimeRating],
      LeadTimeAccept:[null],
      LeadTimeRemark:[this.ResItem.LeadTimeRemark]
    });
    if(this.ResItem.LeadTimeRemark){
      this.ResItemFormGroup.get('LeadTimeAccept').setValue('No');
    }
    else{
      this.ResItemFormGroup.get('LeadTimeAccept').setValue('Yes');
    }
    this.DialogueFormGroup.disable();
    this.ResItemFormGroup.disable();
    this.RFxItemAttachment.push(this.rfxitem.Attachment);
  }
  GetResODAttachments(ResID: string) {
    this._RFxService.GetResponseODAttachmentsByResponseID(ResID).subscribe(data => {
      this.ResODAttachment = <ResODAttachment[]>data;  
      this.ResODAttachment.forEach(element => {
        this.ResItemAttachment.push(element.DocumentName);
      });
    });
  }  
  openAttachmentViewDialog(RFxID:string,Ataachments:string[],isResponse:boolean): void {
    const dialogConfig: MatDialogConfig = {
        data: {Documents:Ataachments,RFxID:RFxID,isResponse:isResponse},
        panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
        AttachmentViewDialogComponent,
        dialogConfig
    );
  }
  Save(){
    this.dialogRef.close();
  }
}
