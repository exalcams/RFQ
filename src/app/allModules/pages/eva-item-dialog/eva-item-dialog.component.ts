import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MMaterial, ResItem, RespondedItems, RFxItem } from 'app/models/RFx';
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
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description','Action'];
  // EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  EvaluationDetailsDataSource = ElementSource;
  files: File[] = [];
  RFxID:string;
  SelectedFileName:string[]=[];
  RespondedI: RespondedItems[] = [];
  DialogueFormGroup: FormGroup;
  rfxitem = new RFxItem;
  ResI: ResItem[] = [];
  Rfxitem : RFxItem[] = [];
  MaterialMaster:MMaterial[]=[];
  ResItem:ResItem = new ResItem();
 
  constructor(private _formBuilder: FormBuilder, private _RFxService: RFxService,public dialogRef: MatDialogRef<EvaItemDialogComponent>,  private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      
     }

  ngOnInit() {
    this.InitializeDialogueFormGroup();
    this.DisableRFxItem();
    this.RFxID="0000000007";
    this.GetRFxs();
    this._RFxService.GetRFxItemsByRFxID("0000000007").subscribe(
      data => {
        // console.log("RFXItem",data);
        this.Rfxitem = <RFxItem[]>data;
        console.log("RFxItem",this.Rfxitem);
        
      }
    )
    this._RFxService.GetAllRFxMaterialM().subscribe(master=>{
      this.MaterialMaster=master as MMaterial[];
    });
    if(this.rfxitem.Attachment){
      this.SelectedFileName.push(this.rfxitem.Attachment);
    }
  }
  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Item: ['', Validators.required],
      Uom: ['', Validators.required],
      LowPrice: ['', Validators.required],
      HighPrice: ['', Validators.required],
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
  GetRFxs():void{
    this.GetResI("000003");
  }
  GetResI(ResID: string) {
    this._RFxService.GetResponseItemsByResponseID("0000000007").subscribe(data => {
      // console.log("ResI",data);
      this.ResI = <ResItem[]>data;
      console.log("ResI",this.ResI);
      if (this.ResI.length != 0) {
        this.RespondedI = [];
        this.ResI.forEach(element => {
          var resItem = new RespondedItems();
          resItem.Item = element;
          resItem.isResponded = true;
          this.RespondedI.push(resItem);
        });
      }
    });
  }
}
