import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxIC, RFxPartner, MVendor, RFxOD, RFxODAttachment } from 'app/models/RFx';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { RFxService } from 'app/services/rfx.service';
import { DialogContentExampleDialogComponent } from './rfq-dialogs/dialog-content-example-dialog/dialog-content-example-dialog.component';
import { DialogContentExampleDialog1Component } from './rfq-dialogs/dialog-content-example-dialog1/dialog-content-example-dialog1.component';
import { DialogContentExampleDialog2Component } from './rfq-dialogs/dialog-content-example-dialog2/dialog-content-example-dialog2.component';
import { DialogContentExampleDialog3Component } from './rfq-dialogs/dialog-content-example-dialog3/dialog-content-example-dialog3.component';
import { DialogContentExampleDialog4Component } from './rfq-dialogs/dialog-content-example-dialog4/dialog-content-example-dialog4.component';
import { DialogContentExampleDialog5Component } from './rfq-dialogs/dialog-content-example-dialog5/dialog-content-example-dialog5.component';
import { DialogContentExampleDialog7Component } from './rfq-dialogs/dialog-content-example-dialog7/dialog-content-example-dialog7.component';


@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  // Rfxheader:RFxHeader;
  Rfxheader = new RFxHeader;
  ArrayLength: any;
  HeaderDetails: RFxHeader[] = [];
  EvaluationDetails: RFxHC[] = [];
  ItemDetails: RFxItem[] = [];
  RatingDetails: RFxIC[] = [];
  PartnerDetails: RFxPartner[] = [];
  VendorDetails: MVendor[] = [];
  ODDetails: RFxOD[] = [];
  ODAttachDetails: RFxODAttachment[] = [];
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  ItemsDetailsDisplayedColumns: string[] = ['position', 'Item', 'Material', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  RatingDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  PartnerDetailsDisplayedColumns: string[] = ['position', 'Type', 'Usertables', 'Action'];
  VendorDetailsDisplayedColumns: string[] = ['position', 'Vendor', 'Type', 'VendorName', 'GSTNo', 'City', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['position', 'Question', 'Answertype', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['position', 'Documenttitle', 'Remark', 'Action'];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  RatingDetailsDataSource: MatTableDataSource<RFxIC>;
  PartnerDetailsDataSource: MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource: MatTableDataSource<MVendor>;
  ODDetailsDataSource: MatTableDataSource<RFxOD>;
  ODAttachDetailsDataSource: MatTableDataSource<RFxODAttachment>;
  FinalLength: any;
  RFxID: string;
  index: number;
  tick: boolean = false;
  tick1: boolean = false;
  tick2: boolean = false;
  tick3: boolean = false;
  tick4: boolean = false;
  tick5: boolean = false;
  tick6: boolean = false;
  editable: boolean = false;
  minDate = new Date();
  highlightedRows = [];

  constructor(private route: Router,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,  private eventEmitterService: EventEmitterService) { }

  openDialogComponent1() {
    const dialogRef = this.dialog.open(DialogContentExampleDialogComponent, {
      data: { pageValue: this.RFxID }, height: '38%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent2() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog2Component, {
      data: { pageValue: this.RFxID }, height: '90%',
      width: '90%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent3() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog1Component, {
      data: { pageValue: this.RFxID }, height: '82%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent4() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog3Component, {
      data: { pageValue: this.RFxID }, height: '40%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent5() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog4Component, {
      data: { pageValue: this.RFxID }, height: '66%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent6() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog5Component, {
      data: { pageValue: this.RFxID }, height: '40%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }
  openDialogComponent7() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog7Component, {
      data: { pageValue: this.RFxID }, height: '42%',
      width: '50%'
    });
    dialogRef.disableClose = true;
  }

  selectedIndex = 0;

  NextClicked(index: number): void {
    if(index==0){
      this.CreateRfX();
    }
    else{
      this.selectedIndex = index+1;
    }
  }
  PreviousClicked(index: number): void {
    this.selectedIndex=index-1;
  }

  ngOnInit(): void {
    this.index=0;
    this.InitializeRFxFormGroup();
    //this.GetRFxs();
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxHCsByRFxID(this.RFxID);    
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ2ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxItemsByRFxID(this.RFxID);    
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ3ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxICsByRFxID(this.RFxID);    
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ4ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxPartnersByRFxID(this.RFxID);    
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ5ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxVendorsByRFxID(this.RFxID);    
      });        
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ6ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxODsByRFxID(this.RFxID);    
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeRFQ7ComponentFunction.subscribe((RFXID:string) => {    
        this.GetRFxODAttachmentsByRFxID(this.RFxID);    
      });
    }    
  }
  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType:  ['', [Validators.required]],
      RfqGroup: ['', [Validators.required]],
      RfqTitle: ['', [Validators.required]],
      ValidityStartDate: ['',[ Validators.required]],
      ValidityEndDate: ['', [Validators.required]],
      ResponseStartDate: ['',[ Validators.required]],
      ResponseEndDate: ['', [Validators.required]],
      Currency: ['', [Validators.required]],
    });
  }
  findOut(row){
    if(this.highlightedRows.indexOf(row) === -1){
      this.highlightedRows.push(row);
      }
      else{
      
        this.highlightedRows[this.highlightedRows.indexOf(row)] = -1;
      }
      
    }
  CreateRfX() {
    this.Rfxheader.Client = "2";
    this.Rfxheader.Company = "FAQ";
    //this.Rfxheader.RFxID="3000";
    this.Rfxheader.RFxType = this.RFxFormGroup.get("RfqType").value;
    this.Rfxheader.RFxGroup = this.RFxFormGroup.get("RfqGroup").value;
    this.Rfxheader.Title = this.RFxFormGroup.get("RfqTitle").value;
    this.Rfxheader.ValidityStartDate = this.RFxFormGroup.get("ValidityStartDate").value;
    this.Rfxheader.ValidityEndDate = this.RFxFormGroup.get("ValidityEndDate").value;
    this.Rfxheader.ResponseStartDate = this.RFxFormGroup.get("ResponseStartDate").value;
    this.Rfxheader.ResponseEndDate = this.RFxFormGroup.get("ResponseEndDate").value;
    this.Rfxheader.Currency = this.RFxFormGroup.get("Currency").value;
    this._RFxService.CreateRFxByRFxID(this.Rfxheader)
      .subscribe(
        response => {
          console.log('success!', response);
          this.Rfxheader=response;
          this.selectedIndex=1;
          this.GetRFxs();
        },
        error => console.log(error));
  }
  tabClick(tab) {
    this.index=tab.index;
  }
  

  GetRFxs(): void {
    // window.location.reload()
    this._RFxService.GetAllRFxs().subscribe(
      (data) => {
        var index;
        console.log("rfqdata",data);
        const myClonedArray = Object.assign([], data);
        this.ArrayLength = data.length;
        index = this.ArrayLength - 1;
        this.RFxID = myClonedArray[index].rFxID;
        console.log(this.RFxID);
        this.GetRFxHCsByRFxID(this.RFxID);
        this.GetRFxItemsByRFxID(this.RFxID);
        this.GetRFxICsByRFxID(this.RFxID);
        this.GetRFxPartnersByRFxID(this.RFxID);
        this.GetRFxVendorsByRFxID(this.RFxID);
        this.GetRFxODsByRFxID(this.RFxID);
        this.GetRFxODAttachmentsByRFxID(this.RFxID);
      }
    )
  }
  GetRFxHCsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxHCsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.EvaluationDetails = <RFxHC[]>data;
          this.EvaluationDetailsDataSource = new MatTableDataSource(
            this.EvaluationDetails
          );
        }
      }
    );
  }
  GetRFxItemsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxItemsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          this.ItemDetailsDataSource = new MatTableDataSource(
            this.ItemDetails
          );
        }
      }
    );
  }
  GetRFxICsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxICsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.RatingDetails = <RFxIC[]>data;
          this.RatingDetailsDataSource = new MatTableDataSource(
            this.RatingDetails
          );
        }
      }
    );
  }
  GetRFxPartnersByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxPartnersByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.PartnerDetails = <RFxPartner[]>data;
          this.PartnerDetailsDataSource = new MatTableDataSource(
            this.PartnerDetails
          );
        }
      }
    );
  }
  GetRFxVendorsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxVendorsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.VendorDetails = <MVendor[]>data;
          this.VendorDetailsDataSource = new MatTableDataSource(
            this.VendorDetails
          );
        }
      }
    );
  }
  GetRFxODsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxODsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          this.ODDetailsDataSource = new MatTableDataSource(
            this.ODDetails
          );
        }
      }
    );
  }
  GetRFxODAttachmentsByRFxID(RFxID): void {
    // this.GetRFxs();
    this._RFxService.GetRFxODAttachmentsByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          this.ODAttachDetailsDataSource = new MatTableDataSource(
            this.ODAttachDetails
          );
        }
      }
    );
  }
}
