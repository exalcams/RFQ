import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxIC, RFxPartner, MVendor, RFxOD, RFxODAttachment, RFxVendor, RFxVendorView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
// import { DialogContentExampleDialogComponent } from './rfq-dialogs/Criteria-Dialog/dialog-content-example-dialog.component';
// import { DialogContentExampleDialog1Component } from './rfq-dialogs/Rateing-Dialog/dialog-content-example-dialog1.component';
// import { DialogContentExampleDialog2Component } from './rfq-dialogs/Item-Dialog/dialog-content-example-dialog2.component';
// import { DialogContentExampleDialog3Component } from './rfq-dialogs/Partner-Dialo/dialog-content-example-dialog3.component';
// import { DialogContentExampleDialog4Component } from './rfq-dialogs/Vendor-Dialog/dialog-content-example-dialog4.component';
// import { DialogContentExampleDialog5Component } from './rfq-dialogs/Question-Dialog/dialog-content-example-dialog5.component';
// import { DialogContentExampleDialog7Component } from './rfq-dialogs/Attachment-Dialog/dialog-content-example-dialog7.component';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  Rfxheader:RFxHeader=new RFxHeader();
  ArrayLength: any;
  HeaderDetails: RFxHeader[] = [];
  EvaluationDetails: RFxHC[] = [];
  ItemDetails: RFxItem[] = [];
  RatingDetails: RFxIC[] = [];
  PartnerDetails: RFxPartner[] = [];
  VendorDetails: RFxVendorView[] = [];
  ODDetails: RFxOD[] = [];
  ODAttachDetails: RFxODAttachment[] = [];
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  ItemsDetailsDisplayedColumns: string[] = ['position', 'Item', 'Material', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  RatingDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  PartnerDetailsDisplayedColumns: string[] = ['position', 'Type', 'Usertables', 'Action'];
  VendorDetailsDisplayedColumns: string[] = ['position', 'Vendor', 'Type', 'VendorName', 'GSTNo', 'City', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['position', 'Question', 'Answertype', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['position', 'Documenttitle', 'Remark', 'Action'];
  EvaluationDetailsDataSource=new BehaviorSubject<RFxHC[]>([]);
  ItemDetailsDataSource=new BehaviorSubject<RFxItem[]>([]);
  // RatingDetailsDataSource=new BehaviorSubject<RFxVendorView[]>([]);
  PartnerDetailsDataSource=new BehaviorSubject<RFxPartner[]>([]);
  VendorDetailsDataSource= new BehaviorSubject<RFxVendorView[]>([]);
  ODDetailsDataSource= new BehaviorSubject<RFxOD[]>([]);
  ODAttachDetailsDataSource= new BehaviorSubject<RFxODAttachment[]>([]);
  RFxID: string=null;
  index: number;
  minDate = new Date();
  selectedIndex:number=0;
  Vendors:RFxVendor[]=[];
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
  ) 
  { }

  ngOnInit() {
    this.index=0;
    this.InitializeRFxFormGroup();
    this._route.queryParams.subscribe(params => {
      this.RFxID = params['id'];
    });
    console.log(this.RFxID);
    if(this.RFxID){
      this.GetRFxs();   
    }
    else{
      if(localStorage.getItem("rfxid")){
        this.RFxID=localStorage.getItem("rfxid");
        this.GetRFxs();
      }
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
  CreateRfX() {
    if(this.RFxFormGroup.valid){
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
            //console.log('success!', response);
            this.Rfxheader=response as RFxHeader;
            console.log("response",this.Rfxheader);
            this.selectedIndex=1;
            localStorage.setItem("rfxid",this.Rfxheader.RFxID);
            this.GetRFxs();
          },
          error => console.log(error));
    }
    else{
      this.ShowValidationErrors(this.RFxFormGroup);
    }
  }
  tabClick(tab) {
    this.index=tab.index;
  }
  

  GetRFxs(): void {
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetRFxHCsByRFxID(this.RFxID);
    this.GetRFxItemsByRFxID(this.RFxID);
    //this.GetRFxICsByRFxID(this.RFxID);
    this.GetRFxPartnersByRFxID(this.RFxID);
    this.GetRFxVendorsByRFxID(this.RFxID);
    this.GetRFxODsByRFxID(this.RFxID);
    this.GetRFxODAttachmentsByRFxID(this.RFxID);
  }

  GetRFxHsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.Rfxheader = data as RFxHeader;
          this.RFxFormGroup.get("RfqType").setValue(this.Rfxheader.RFxType);
          this.RFxFormGroup.get("RfqGroup").setValue(this.Rfxheader.RFxGroup);
          this.RFxFormGroup.get("RfqTitle").setValue(this.Rfxheader.Title);
          this.RFxFormGroup.get("ValidityStartDate").setValue(this.Rfxheader.ValidityStartDate);
          this.RFxFormGroup.get("ValidityEndDate").setValue(this.Rfxheader.ValidityEndDate);
          this.RFxFormGroup.get("ResponseStartDate").setValue(this.Rfxheader.ResponseStartDate);
          this.RFxFormGroup.get("ResponseEndDate").setValue(this.Rfxheader.ResponseEndDate);
          this.RFxFormGroup.get("Currency").setValue(this.Rfxheader.Currency);
        }
      }
    );
  }
  GetRFxHCsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxHCsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.EvaluationDetails = <RFxHC[]>data;
          this.EvaluationDetailsDataSource.next(this.EvaluationDetails);
        }
      }
    );
  }
  GetRFxItemsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxItemsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          this.ItemDetailsDataSource.next(this.ItemDetails);
        }
      }
    );
  }

  GetRFxPartnersByRFxID(RFxID:string): void {
    this._RFxService.GetRFxPartnersByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.PartnerDetails = <RFxPartner[]>data;
          this.PartnerDetailsDataSource.next(this.PartnerDetails);
        }
      }
    );
  }
  GetRFxVendorsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxVendorsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.VendorDetails=[];
          this.Vendors = <RFxVendor[]>data;
          this.Vendors.forEach(element => {
            this.GetRFxVendorViewsByRFxID(element.PatnerID);
          });
          //console.log("vendors",this.VendorDetails);
        }
      }
    );
  }
  GetRFxVendorViewsByRFxID(parnerId:string){
    this._RFxService.GetRFxVendorViewsByRFxID(this.RFxID,parnerId).subscribe(result=>{
      var data=result as RFxVendorView;
      this.VendorDetails.push(data);
      this.VendorDetailsDataSource.next(this.VendorDetails);
    });
  }
  GetRFxODsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxODsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          this.ODDetailsDataSource.next(this.ODDetails);
        }
      }
    );
  }
  GetRFxODAttachmentsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxODAttachmentsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          this.ODAttachDetailsDataSource.next(this.ODAttachDetails);
        }
      }
    );
  }

  ShowValidationErrors(formGroup:FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }

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
}
