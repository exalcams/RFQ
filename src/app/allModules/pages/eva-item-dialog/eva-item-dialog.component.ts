import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { EvalCriteriaView, EvalHC, EvalIC, EvaluatedICs, MMaterial, ResItem, ResODAttachment, RespondedItems, RFxItem } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';
export interface PeriodicElement {
  position: number;
  Criteria: number;
  Description: string;
  Action: string;
}
const ElementSource: PeriodicElement[] = [
  {position: 1,  Criteria: 1,Description: 'Hydrogen', Action: 'H'},
  {position: 2,  Criteria:67, Description: 'Helium',Action: 'He'},
];

@Component({
  selector: 'app-eva-item-dialog',
  templateUrl: './eva-item-dialog.component.html',
  styleUrls: ['./eva-item-dialog.component.scss']
})


export class EvaItemDialogComponent implements OnInit {
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description','ItemRating'];
  EvaluationDetailsDataSource: MatTableDataSource<EvalCriteriaView>;
  ResODAttachment:ResODAttachment[]=[];
  EvalHcViews:EvalCriteriaView[]=[];
  EvalICs:EvalIC[]=[];
  RFxItemAttachment:string[]=[];
  ResItemAttachment:string[]=[];
  RespondedI: EvaluatedICs[] = [];
  DialogueFormGroup: FormGroup;
  rfxitem = new RFxItem();
  MaterialMaster:MMaterial[]=[];
  ResItem:ResItem = new ResItem();
  types: any = [
    'Yes',
    'No'
  ];
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<EvaItemDialogComponent>,  private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rfxitem=data.RFxItem;
      this.ResItem=data.ResItem;
      this.EvalHcViews=data.EvalHCs;
      this.EvalICs=data.EvalIC;
     }

  ngOnInit() {
    console.log(this.data);
    this.InitializeDialogueFormGroup();
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    this.GetResODAttachments(this.ResItem.RESID);
    if(this.ResItem.LeadTimeRemark){
      this.DialogueFormGroup.get('LeadTimeAccept').setValue('No');
    }
    else{
      this.DialogueFormGroup.get('LeadTimeAccept').setValue('Yes');
    }
    this.EvaluationDetailsDataSource=new MatTableDataSource(this.EvalHcViews);
    if(this.EvalICs.length==0){
      this.LoadEvalIcs();
    }
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
      Price:[this.ResItem.Price],
      USPRemark:[this.ResItem.USPRemark],
      PriceRating:[this.ResItem.PriceRating],
      LeadTimeRating:[this.ResItem.LeadTimeRating],
      LeadTimeAccept:["No"],
      LeadTimeRemark:[this.ResItem.LeadTimeRemark]
    });
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

  LoadEvalIcs(){
    this.EvalHcViews.forEach(element => {
      var evalIC=new EvalIC();
      evalIC.Client=this.rfxitem.Client;
      evalIC.Company=this.rfxitem.Company;
      evalIC.Item=this.rfxitem.Item;
      evalIC.Criteria=element.CriteriaID;
      evalIC.Rating="0";
      this.EvalICs.push(evalIC);
    });
  }

  OnItemRating($event:{oldValue:number, newValue:number},index:any) {
    this.EvalICs[index].Rating=$event.newValue.toString();
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
    var Result=this.EvalICs;
    this.dialogRef.close(Result);
  }
}
