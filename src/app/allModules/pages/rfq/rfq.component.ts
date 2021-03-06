import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxIC, RFxPartner, MVendor, RFxOD, RFxODAttachment, RFxVendor, RFxVendorView, RFxView, RFxRemark, MRFxType, MRFxGroup, CriteriaTemplateView, QuestionTemplateView } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { CriteriaDialogComponent } from './rfq-dialogs/Criteria-Dialog/criteria-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SelectVendorDialogComponent } from './rfq-dialogs/select-vendor-dialog/select-vendor-dialog.component';
import { AuthenticationDetails, VendorUser } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { MasterService } from 'app/services/master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ForecloseDialogComponent } from './rfq-dialogs/foreclose-dialog/foreclose-dialog.component';
import { DateTimeValidator } from 'app/shared/date-time-validator';
import { BehaviorSubject } from 'rxjs';
import { ItemDialogComponent } from './rfq-dialogs/Item-Dialog/item-dialog.component';
import { PartnerDialogComponent } from './rfq-dialogs/Partner-Dialog/partner-dialog.component';
import { AddVendorDialogComponent } from './rfq-dialogs/add-vendor-dialog/add-vendor-dialog.component';
import { QuestionDialogComponent } from './rfq-dialogs/Question-Dialog/question-dialog.component';
import { RFQAttachmentDialogComponent } from './rfq-dialogs/Attachment-Dialog/rfq-attachment-dialog.component';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit,OnDestroy {
  RFxView: RFxView = new RFxView();
  RFxFormGroup: FormGroup;
  ICFormGroup:FormGroup;
  ItemCriteriaFormArray:FormArray=this._formBuilder.array([]);
  Rfxheader: RFxHeader = new RFxHeader();
  ArrayLength: any;
  HeaderDetails: RFxHeader[] = [];
  EvaluationDetails: RFxHC[] = [];
  ItemDetails: RFxItem[] = [];
  RatingDetails: RFxIC[] = [];
  PartnerDetails: RFxPartner[] = [];
  VendorDetails: RFxVendorView[] = [];
  ODDetails: RFxOD[] = [];
  ODAttachDetails: RFxODAttachment[] = [];
  RFxRemark: RFxRemark = new RFxRemark();
  EvaluationDetailsDisplayedColumns: string[] = ['Description', 'Action'];
  ItemsDetailsDisplayedColumns: string[] = ['Material','MaterialText', 'TotalQty', 'PerScheduleQty', 'TotalSchedules', 'UOM', 'IncoTerm', 'Action'];
  RatingDetailsDisplayedColumns: string[] = ['Criteria', 'Weightage', 'Consider'];
  PartnerDetailsDisplayedColumns: string[] = ['Type', 'Usertables', 'Action'];
  VendorDetailsDisplayedColumns: string[] = [ 'VendorName', 'Type', 'GSTNumber', 'City', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['Question', 'AnswerType', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['DocumentTitle', 'DocumentName', 'Action'];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  RatingDetailsDataSource=new BehaviorSubject<AbstractControl[]>([]);
  PartnerDetailsDataSource: MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource: MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource: MatTableDataSource<RFxOD>;
  ODAttachDetailsDataSource: MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string = null;
  index: number;
  minDate = new Date();
  selectedIndex: number = 0;
  j: number;
  Vendors: RFxVendor[] = [];
  FilesToUpload: File[] = [];
  RFxTypeMasters: MRFxType[] = [];
  RFxGroupMasters: MRFxGroup[] = [];
  RFxNewVendors:number=0;
  isProgressBarVisibile: boolean;
  NewVendorMaser: MVendor[] = [];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  Evaluators: string[] = [];
  CurrencyList: string[] = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"];
  CompletedSteps:boolean[]=[false,false,false,false,false,false,false,false,false];
  Progress:number=0;
  Plants:string[]=[];
  Permission:string;
  CriteriaTemplates:CriteriaTemplateView[]=[];
  QuestionTemplates:QuestionTemplateView[]=[];
  Remarks:FormControl=new FormControl('',Validators.required);
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _router: Router,
    private masterService: MasterService
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.Remarks.valueChanges.subscribe(value=>{
      this.RFxRemark.Remark=value;
      if(value!=''){
        this.CompletedSteps[8]=true;
      }
      else{
        this.CompletedSteps[8]=false;
      }
    });
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    // console.log(retrievedObject);   
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.Permission=this.authenticationDetails.Permission;
      this.Plants=this.authenticationDetails.Plants;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.Rfxheader.Client = "01";
    this.Rfxheader.Company = "Exa";
    this.GetRFQMasters();
    this.GetItemCriterias();
    this.GetAllTemplates();
    this.InitializeRFxFormGroup();
    if (localStorage.getItem('RFXID') != "-1") {
      this.RFxID = localStorage.getItem('RFXID');
    }
    else {
      this.RFxID = null;
    }
    if (this.RFxID) {
      this.GetRFxs();
    }
  }

  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType: ['', [Validators.required]],
      RfqGroup: ['', [Validators.required]],
      RfqTitle: ['', [Validators.required]],
      ValidityStartDate: ['', [Validators.required]],
      ValidityStartTime: ['10:00 am', [Validators.required]],
      ValidityEndDate: ['', [Validators.required]],
      ValidityEndTime: ['5:00 pm', [Validators.required,DateTimeValidator.EndTimeValidator]],
      ResponseStartDate: ['', [Validators.required]],
      ResponseStartTime: ['10:00 am', [Validators.required,DateTimeValidator.ResStartTimeValidator]],
      ResponseEndDate: ['', [Validators.required]],
      ResponseEndTime: ['5:00 pm', [Validators.required,DateTimeValidator.ResEndTimeValidator]],
      EvaluationStartDate:['',[Validators.required]],
      EvaluationStartTime:['10:00 am',[Validators.required,DateTimeValidator.EvalStartTimeValidator]],
      EvaluationEndDate: ['', [Validators.required]],
      EvaluationEndTime: ['5:00 pm', [Validators.required,DateTimeValidator.EvalEndTimeValidator]],
      Evaluator: [null, [Validators.required]],
      Currency: ['INR', [Validators.required]],
      Plant: ['', [Validators.required]],
    });
    this.ICFormGroup=this._formBuilder.group({
      ItemCriterias:this.ItemCriteriaFormArray
    });
    this.RFxFormGroup.get('ValidityStartTime').valueChanges.subscribe(x=>{
      this.DefaultStartTimeValue(x);
    });
    this.RFxFormGroup.get('ValidityEndTime').valueChanges.subscribe(x=>{
      this.DefaultEndTimeValue(x);
    });
  }
  DefaultStartTimeValue(validity){
    this.RFxFormGroup.get('ResponseStartTime').setValue(validity);
    this.RFxFormGroup.get('EvaluationStartTime').setValue(validity);
  }
  DefaultEndTimeValue(validity){
    this.RFxFormGroup.get('ResponseEndTime').setValue(validity);
    this.RFxFormGroup.get('EvaluationEndTime').setValue(validity);
  }
  GetRFQMasters() {
    this.GetRFQTypeMaster();
    this.GetRFQGroupMaster();
    this.masterService.GetRFQRoleWithUsers("Evaluator").subscribe(data => {
      this.Evaluators = data;
      this.RFxFormGroup.get('Evaluator').setValidators([Validators.max(this.Evaluators.length)]);
    });
  }
  GetAllTemplates(){
    this._RFxService.GetCriteriaTemplates().subscribe(res=>{
      this.CriteriaTemplates=res;
    });
    this._RFxService.GetQuestionTemplates().subscribe(res=>{
      this.QuestionTemplates=res;
    });
  }
  GetRFQTypeMaster() {
    this._RFxService.GetAllRFxTypeM().subscribe(res => {
      this.RFxTypeMasters = res as MRFxType[];
    });
  }

  GetRFQGroupMaster() {
    this._RFxService.GetAllRFxGroupM().subscribe(res => {
      this.RFxGroupMasters = res as MRFxGroup[];
    });
  }

  GetRFxs(): void {
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetRFxHCsByRFxID(this.RFxID);
    this.GetRFxICsByRFxID(this.RFxID);
    this.GetRFxItemsByRFxID(this.RFxID);
    this.GetRFxPartnersByRFxID(this.RFxID);
    this.GetRFxVendorsByRFxID(this.RFxID);
    this.GetRFxODsByRFxID(this.RFxID);
    this.GetRFxODAttachmentsByRFxID(this.RFxID);
    this.GetRFxRemarkByRFxID(this.RFxID);
  }
  IsComplete():boolean{
    if(this.CompletedSteps.includes(false)){
      return false;
    }
    return true;
  }
  GetRFxHsByRFxID(RFxID: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.Rfxheader = data as RFxHeader;
          this.RFxFormGroup.get("RfqType").setValue(this.Rfxheader.RFxType);
          this.RFxFormGroup.get("RfqGroup").setValue(this.Rfxheader.RFxGroup);
          this.RFxFormGroup.get("RfqTitle").setValue(this.Rfxheader.Title);
          this.RFxFormGroup.get("ValidityStartDate").setValue(this.Rfxheader.ValidityStartDate);
          this.RFxFormGroup.get("ValidityStartTime").setValue(this.Rfxheader.ValidityStartTime);
          this.RFxFormGroup.get("ValidityEndDate").setValue(this.Rfxheader.ValidityEndDate);
          this.RFxFormGroup.get("ValidityEndTime").setValue(this.Rfxheader.ValidityEndTime);
          this.RFxFormGroup.get("ResponseStartDate").setValue(this.Rfxheader.ResponseStartDate);
          this.RFxFormGroup.get("ResponseStartTime").setValue(this.Rfxheader.ResponseStartTime);
          this.RFxFormGroup.get("ResponseEndDate").setValue(this.Rfxheader.ResponseEndDate);
          this.RFxFormGroup.get("ResponseEndTime").setValue(this.Rfxheader.ResponseEndTime);
          this.RFxFormGroup.get("EvaluationStartDate").setValue(this.Rfxheader.EvalStartDate);
          this.RFxFormGroup.get("EvaluationEndDate").setValue(this.Rfxheader.EvalEndDate);
          this.RFxFormGroup.get("EvaluationStartTime").setValue(this.Rfxheader.EvalStartTime);
          this.RFxFormGroup.get("EvaluationEndTime").setValue(this.Rfxheader.EvalEndTime);
          this.RFxFormGroup.get("Evaluator").setValue(this.Rfxheader.MinEvaluator);
          this.RFxFormGroup.get("Currency").setValue(this.Rfxheader.Currency);
          this.RFxFormGroup.get("Plant").setValue(this.Rfxheader.Plant);
          if (this.Rfxheader.Status == "2") {
            this.RFxFormGroup.disable();
          }
          if(this.RFxFormGroup.valid){
            this.CompletedSteps[0]=true;
          }
        }
        this.isProgressBarVisibile = false;
      }
    );
  }
  GetRFxHCsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxHCsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.EvaluationDetails = <RFxHC[]>data;
          if(this.EvaluationDetails.length>0){
            this.CompletedSteps[2]=true;
          }
          this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
        }
      }
    );
  }
  GetRFxItemsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxItemsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          if(this.ItemDetails.length>0){
            this.CompletedSteps[3]=true;
          }
          this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
        }
      }
    );
  }
  GetRFxICsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxICsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          const ICs=<RFxIC[]>data;
          if(ICs.length>0){
            this.CompletedSteps[1]=true;
          }
          this.ItemCriteriaFormArray.controls.forEach(x => {
            var criteria=x.get("Criteria").value;
            var ic=ICs.find(t=>t.Text==criteria);
            if(ic!=undefined){
              x.get("Weightage").setValue(ic.Weightage);
              x.get("Consider").setValue(ic.Consider);
            }
          });
          this.RatingDetailsDataSource.next(this.ItemCriteriaFormArray.controls);
        }
      }
    );
  }
  GetRFxPartnersByRFxID(RFxID: string): void {
    this._RFxService.GetRFxPartnersByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.PartnerDetails = <RFxPartner[]>data;
          if(this.PartnerDetails.length>0){
            this.CompletedSteps[4]=true;
          }
          this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
        }
      }
    );
  }
  GetRFxVendorsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxVendorsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.VendorDetails = [];
          this.Vendors = <RFxVendor[]>data;
          if(this.Vendors.length>0){
            this.CompletedSteps[5]=true;
          }
          this.RFxNewVendors=0;
          this.Vendors.forEach(element => {
            this.GetRFxVendorViewsByRFxID(element.PatnerID);
            if(element.PatnerID.indexOf(RFxID.replace(/^0+/, '')+'V')>=0){
              this.RFxNewVendors++;
            }
          });
          //console.log("vendors",this.VendorDetails);
        }
      }
    );
  }
  GetRFxVendorViewsByRFxID(parnerId: string) {
    this._RFxService.GetRFxVendorViewsByRFxID(this.RFxID, parnerId).subscribe(result => {
      var data = result as RFxVendorView;
      this.VendorDetails.push(data);
      this.VendorDetailsDataSource = new MatTableDataSource(this.VendorDetails);
    });
  }
  GetRFxODsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          if(this.ODDetails.length>0){
            this.CompletedSteps[6]=true;
          }
          this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
        }
      }
    );
  }
  GetRFxODAttachmentsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODAttachmentsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          if(this.ODAttachDetails.length>0){
            this.CompletedSteps[7]=true;
          }
          this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
        }
      }
    );
  }
  GetRFxRemarkByRFxID(RFxID: string) {
    this._RFxService.GetRFxRemarkByRFxID(RFxID).subscribe((data) => {
      if (data) {
        this.RFxRemark = <RFxRemark>data;
        this.Remarks.setValue(this.RFxRemark.Remark);
      }
    })
  }

  GetItemCriterias(){
    for (let index = 0; index < 3; index++) {
      var IC=new RFxIC();
      IC.Client=this.Rfxheader.Client;
      IC.Company=this.Rfxheader.Company;
      IC.Criteria=(index+1).toString();
      this.RatingDetails.push(IC);
    }
    this.RatingDetails[0].Text="Price";
    this.RatingDetails[1].Text="LeadTime";
    this.RatingDetails[2].Text="Payment";
    this.RatingDetails.forEach(ic => {
      this.AddRowToIC(ic);
    });
    this.RatingDetailsDataSource.next(this.ItemCriteriaFormArray.controls);
  }

  CreateCriteria() {
    var Criteria = new RFxHC();
    Criteria.Client = this.Rfxheader.Client;
    Criteria.Company = this.Rfxheader.Company;
    var len=this.EvaluationDetails.length;
    Criteria.CriteriaID=(len+1).toString();
    this.OpenCriteriaDialog(Criteria, true);
  }
  CreateItem() {
    var Item = new RFxItem();
    Item.RFxID = this.Rfxheader.RFxID;
    Item.Client = this.Rfxheader.Client;
    Item.Company = this.Rfxheader.Company;
    var len=this.ItemDetails.length;
    Item.Item=(len+10).toString();
    Item.Interval="1";
    Item.Attachment="";
    this.OpenItemDialog(Item, true);
  }
  CreatePartner() {
    var Partner = new RFxPartner();
    Partner.Client = this.Rfxheader.Client;
    Partner.Company = this.Rfxheader.Company;
    this.OpenPartnerDialog(Partner, true);
  }
  CreateVendor() {
    var Vendor = new RFxVendorView();
    Vendor.Client = this.Rfxheader.Client;
    Vendor.Company = this.Rfxheader.Company;
    this.OpenVendorDialog(Vendor);
  }
  CreateQuestion() {
    var Question = new RFxOD();
    Question.Client = this.Rfxheader.Client;
    Question.Company = this.Rfxheader.Company;
    this.OpenQuestionDialog(Question, true);
  }
  CreateDocument() {
    var Document = new RFxODAttachment();
    Document.RFxID = this.Rfxheader.RFxID;
    Document.Client = this.Rfxheader.Client;
    Document.Company = this.Rfxheader.Company;
    this.OpenDocumentDialog(Document, true);
  }

  OpenCriteriaDialog(Criteria: RFxHC, bool: boolean) {
    const dialogConfig: MatDialogConfig = {
      data: {
        data: Criteria,
        isCreate: bool 
      },
      panelClass: "criteria-dialog"
    };
    const dialogRef = this.dialog.open(CriteriaDialogComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res && bool) {
        this.EvaluationDetails.push(res.data);
        this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
        if(res.isNew){
          this.CreateCriteria();
        }
      }
    });
  }
  OpenItemDialog(Item: RFxItem, bool: boolean) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      data: { data: Item, isCreate: bool,RFxType:this.RFxFormGroup.get('RfqType').value,Attachments:this.FilesToUpload }, panelClass:"item-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.ItemDetails.push(res.data);
        this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
      }
      if(res){
        res.Attachments.forEach(doc => {
          if (this.FilesToUpload.indexOf(doc) >= 0) {
            this.FilesToUpload[this.FilesToUpload.indexOf(doc)] = doc;
          }
          else {
            this.FilesToUpload.push(doc);
          }
        });
      }
    });
  }
  OpenPartnerDialog(Partner: RFxPartner, bool: boolean) {
    const dialogRef = this.dialog.open(PartnerDialogComponent, {
      data: { data: Partner, isCreate: bool, RFxPartners: this.PartnerDetails }, panelClass:"partner-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.PartnerDetails = res;
        this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
      }
    });
  }
  OpenVendorDialog(Vendor: RFxVendorView) {
    const dialogRef = this.dialog.open(AddVendorDialogComponent, {
      data: { data: Vendor }, panelClass:"add-vendor-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.VendorDetails.push(res.data);
        this.Vendors = [];
        this.VendorDetails.forEach(element => {
          var rfxVendor = new RFxVendor();
          rfxVendor.Client = this.Rfxheader.Client;
          rfxVendor.Company = this.Rfxheader.Company;
          rfxVendor.PatnerID = element.PatnerID;
          this.Vendors.push(rfxVendor);
        });
        this.NewVendorMaser.push(res.vendor);
        this.VendorDetailsDataSource = new MatTableDataSource(this.VendorDetails);
      }
    });
  }
  OpenSelectVendorDialog(vendors: RFxVendorView[]) {
    const dialogRef = this.dialog.open(SelectVendorDialogComponent, {
      data: { data: vendors }, panelClass:"select-vendor-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.VendorDetails = res.data;
        this.Vendors = [];
        this.VendorDetails.forEach(element => {
          var rfxVendor = new RFxVendor();
          rfxVendor.Client = this.Rfxheader.Client;
          rfxVendor.Company = this.Rfxheader.Company;
          rfxVendor.PatnerID = element.PatnerID;
          this.Vendors.push(rfxVendor);
        });
        this.VendorDetailsDataSource = new MatTableDataSource(this.VendorDetails);
      }
    });
  }
  OpenQuestionDialog(Question: RFxOD, bool: boolean) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: { data: Question, isCreate: bool }, panelClass:"question-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.ODDetails.push(res.data);
        this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
        if(this.ODAttachDetails.length>0 && this.ODDetails.length>0){
          this.CompletedSteps[6]=true;
        }
        else if(this.ODDetails.length>0){
          this.CompletedSteps[6]=true;
        }
        else{
          this.CompletedSteps[6]=false;
        }
      }
    });
  }
  OpenDocumentDialog(Document: RFxODAttachment, bool: boolean) {
    const dialogRef = this.dialog.open(RFQAttachmentDialogComponent, {
      data: { data: Document, isCreate: bool }, panelClass:"rfq-attachment-dialog"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.ODAttachDetails.push(res.data);
        this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
        this.CompletedSteps[7]=true;
      }
      if (this.FilesToUpload.indexOf(res.Attachments) >= 0) {
        this.FilesToUpload[this.FilesToUpload.indexOf(res.Attachments)] = res.Attachments;
      }
      else {
        this.FilesToUpload.push(res.Attachments);
      }
    });
  }
  OpenForecloseDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        RFxTitle: this.Rfxheader.Title
      },
      panelClass: 'foreclose-dialog'
    };
    const dialogRef = this.dialog.open(ForecloseDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.RFxRemark.Remark=result;
          this.UpdateRFx(false,true);
          this._router.navigate(["pages/home"]);
        }
      });
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
        if (!formGroup.get(key).valid) {
            //console.log(key);
        }
        formGroup.get(key).markAsTouched();
        formGroup.get(key).markAsDirty();
        if (formGroup.get(key) instanceof FormArray) {
            const FormArrayControls = formGroup.get(key) as FormArray;
            Object.keys(FormArrayControls.controls).forEach(key1 => {
                if (FormArrayControls.get(key1) instanceof FormGroup) {
                    const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
                    Object.keys(FormGroupControls.controls).forEach(key2 => {
                        FormGroupControls.get(key2).markAsTouched();
                        FormGroupControls.get(key2).markAsDirty();
                        if (!FormGroupControls.get(key2).valid) {
                            //console.log(key2);
                        }
                    });
                } else {
                    FormArrayControls.get(key1).markAsTouched();
                    FormArrayControls.get(key1).markAsDirty();
                }
            });
        }
    });
  }

  DeleteCriteria(index) {
    this.EvaluationDetails.splice(index, 1);
    this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
    if(this.EvaluationDetails.length==0){
      this.CompletedSteps[2]=false;
    }
  }
  DeleteItem(index) {
    this.ItemDetails.splice(index, 1);
    this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
    if(this.ItemDetails.length==0){
      this.CompletedSteps[3]=false;
    }
  }
  DeletePartner(index) {
    this.PartnerDetails.splice(index, 1);
    this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
    if(this.PartnerDetails.length==0){
      this.CompletedSteps[4]=false;
    }
  }
  DeleteVendor(index) {
    this.Vendors.splice(index, 1);
    this.VendorDetails.splice(index, 1);
    this.VendorDetailsDataSource = new MatTableDataSource(this.VendorDetails);
    if(this.VendorDetails.length==0){
      this.CompletedSteps[5]=false;
    }
  }
  DeleteQuetion(index) {
    this.ODDetails.splice(index, 1);
    this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
    if(this.ODDetails.length==0){
      this.CompletedSteps[6]=false;
    }
  }
  DeleteAttachment(index) {
    this.ODAttachDetails.splice(index, 1);
    this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
    if(this.ODAttachDetails.length==0){
      this.CompletedSteps[7]=false;
    }
  }
  GetAnswerType(type) {
    if (type == 1) {
      return "Text box";
    }
    else if (type == 2) {
      return "Yes/No";
    }
    else if (type == 3) {
      return "Long text"
    }
    else if(type==4){
      return "Number only"
    }
  }
  NextClicked(index: number): void {
    if(index == 0){
      if(this.RFxFormGroup.valid){
        this.Rfxheader.Status = "1";
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
      }
      else{
        this.ShowValidationErrors(this.RFxFormGroup);
      }
    }
    if(index == 1){
      if(this.ICFormGroup.valid){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
        this.CreateCriteria();
      }
      else{
        this.ShowValidationErrors(this.ICFormGroup);
        this.notificationSnackBarComponent.openSnackBar('Please fill all fields', SnackBarStatus.danger);
      }
    }
    if(index == 2){
      if(this.EvaluationDetails.length > 0){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
        this.CreateItem();
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Criteria is required', SnackBarStatus.danger);
      }
    }
    if(index == 3){
      if(this.ItemDetails.length > 0){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
        this.CreatePartner();
      }
      // else if(this.ItemDetails.length == 0){
      //   this.notificationSnackBarComponent.openSnackBar('Item is required', SnackBarStatus.danger);
      // }
      else{
        this.notificationSnackBarComponent.openSnackBar('Item is required', SnackBarStatus.danger);
      }
    }
    if(index == 4){
      var array = this.PartnerDetails.filter(x => x.Type == "Evaluator")
      var lent = array.length;
      var awardC = this.PartnerDetails.filter(x => x.Type == "Award Committee");
      if (lent < this.RFxFormGroup.get('Evaluator').value || lent == 0) {
        this.notificationSnackBarComponent.openSnackBar('Minimum no of evaluator required', SnackBarStatus.danger);
      }
      else if (awardC.length < 1) {
        this.notificationSnackBarComponent.openSnackBar('Award committee required', SnackBarStatus.danger);
      }
      else {
        this.CompletedSteps[index]=true;
        this.selectedIndex = index + 1;
      }
    }
    if(index == 5){
      if(this.VendorDetails.length > 0){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Vendor is required', SnackBarStatus.danger);
      }
    }
    if(index == 6){
      if(this.ODDetails.length > 0){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Question is required', SnackBarStatus.danger);
      }
    }
    if(index == 7){
      if(this.ODAttachDetails.length > 0){
        this.selectedIndex = index + 1;
        this.CompletedSteps[index]=true;
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Document is required', SnackBarStatus.danger);
      }
    }
  }
  PreviousClicked(index: number): void {
    this.selectedIndex = index - 1;
  }
    
  SaveRFxClicked(isRelease: boolean) {
    if(!isRelease){
      if (!this.RFxID || this.RFxID == "-1") {
        this.CreateRfX(isRelease);
      }
      else {
        this.UpdateRFx(isRelease);
      }
    }
    else if (this.IsComplete()) {
      if (!this.RFxID || this.RFxID == "-1") {
        this.CreateRfX(isRelease);
      }
      else {
        this.UpdateRFx(isRelease);
      }
    }
    else {
      this.notificationSnackBarComponent.openSnackBar('Please complete all steps', SnackBarStatus.danger);
    }
  }
  GetICValues(){
    const ICFormArray = this.ICFormGroup.get('ItemCriterias') as FormArray;
      ICFormArray.controls.forEach((x, i) => {
                this.RatingDetails[i].Consider=x.get('Consider').value;
                this.RatingDetails[i].Weightage=x.get('Weightage').value;
      });
  }
  CreateRfX(isRelease: boolean) {
    this.isProgressBarVisibile = true;
    this.RFxView.Client = this.Rfxheader.Client;
    this.RFxView.Company = this.Rfxheader.Company;
    this.GetRFxValues();
    if (isRelease) {
      this.RFxView.Status = "2";
    }
    else {
      this.RFxView.Status = "1";
    }
    this.RFxView.RFxItems = this.ItemDetails;
    this.RFxView.RFxHCs = this.EvaluationDetails;
    if(this.ICFormGroup.valid){
      this.GetICValues();
      this.RFxView.RFxICs = this.RatingDetails;
    }
    else{
      this.RFxView.RFxICs = [];
    }
    this.RFxView.RFxPartners = this.PartnerDetails;
    this.RFxView.Invited=this.Vendors.length.toString();
    this.Vendors.forEach(vendor => {
      if(vendor.PatnerID==''){
        this.Vendors.splice(this.Vendors.indexOf(vendor),1);
      }
    });
    this.RFxView.RFxVendors = this.Vendors;
    this.RFxView.RFxODs = this.ODDetails;
    this.RFxView.RFxODAttachments = this.ODAttachDetails;
    this.RFxRemark.Client = this.RFxView.Client;
    this.RFxRemark.Company = this.RFxView.Company;
    this.RFxView.RFxRemark = this.RFxRemark;
    console.log("rfxview", this.RFxView);
    this._RFxService.CreateRFx(this.RFxView)
      .subscribe(
        response => {
          localStorage.setItem("RFxID", response.RFxID);
          this.RFxID = response.RFxID;
          if (this.NewVendorMaser.length > 0) {
            this.UpdatePartnerID();
            this._RFxService.UpdateRFxVendors(this.Vendors,response.RFxID).subscribe(x=>{
              this.GetRFxVendorsByRFxID(response.RFxID);
              console.log("vendors updated");
            },
            err=>{
              console.log("vendors not updated");
            });
            console.log(this.NewVendorMaser);
            this._RFxService.AddtoVendorTable(this.NewVendorMaser).subscribe(res => {
              console.log(res);
              var vendors=<MVendor[]>res;
              var vendorUsers=[];
              vendors.forEach(vendor => {
                var vendorUser=new VendorUser();
                vendorUser.UserName=vendor.PatnerID;
                vendorUser.DisplayName=vendor.VendorName;
                vendorUser.Email=vendor.EmailID1;
                vendorUser.Phone=vendor.ContactPersonMobile;
                vendorUsers.push(vendorUser)
              });
              console.log("vendorUsers",vendorUsers);
              if(isRelease){
                this._RFxService.CreateVendorUser(vendorUsers).subscribe(x=>{
                  console.log("vendor user created");
                },
                err=>{
                  console.log("vendor user not created");
                });
              }
            }, err => { console.log("vendor master not created!;") });
          }
          //console.log("response",response);
          this._RFxService.UploadRFxAttachment(response.RFxID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
          if (isRelease) {
            this.isProgressBarVisibile = false;
            Swal.fire('RFQ released successfully');
            this.notificationSnackBarComponent.openSnackBar('RFQ released successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
          else {
            Swal.fire('RFQ saved Successfully');
            this.isProgressBarVisibile = false;
          }
        },
        error => {
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
  UpdateRFx(isRelease: boolean,isForeclose:boolean=false) {
    this.isProgressBarVisibile = true;
    this.RFxView.Client = this.Rfxheader.Client;
    this.RFxView.Company = this.Rfxheader.Company;
    this.RFxView.RFxID = this.RFxID;
    this.GetRFxValues();
    if (isRelease) {
      this.RFxView.Status = "2";
    }
    else if(isForeclose){
      this.RFxView.Status="7"
    }
    else {
      this.RFxView.Status = "1";
    }
    this.RFxView.Responded = this.Rfxheader.Responded;
    this.RFxView.Evaluated = this.Rfxheader.Evaluated;
    this.RFxView.ReleasedOn = this.Rfxheader.ReleasedOn;
    this.RFxView.ReleasedBy = this.Rfxheader.ReleasedBy;
    this.RFxView.RFxItems = this.ItemDetails;
    this.RFxView.RFxHCs = this.EvaluationDetails;
    if(this.ICFormGroup.valid){
      this.GetICValues();
      this.RFxView.RFxICs = this.RatingDetails;
    }
    else{
      this.RFxView.RFxICs = [];
    }
    this.RFxView.RFxPartners = this.PartnerDetails;
    this.RFxView.Invited=this.Vendors.length.toString();
    this.Vendors.forEach(vendor => {
      if(vendor.PatnerID==''){
        this.Vendors.splice(this.Vendors.indexOf(vendor),1);
      }
    });
    this.RFxView.RFxVendors = this.Vendors;
    this.RFxView.RFxODs = this.ODDetails;
    this.RFxView.RFxODAttachments = this.ODAttachDetails;
    this.RFxRemark.Client = this.RFxView.Client;
    this.RFxRemark.Company = this.RFxView.Company;
    this.RFxView.RFxRemark = this.RFxRemark;
    console.log("rfxview", this.RFxView);
    this._RFxService.UpdateRFx(this.RFxView)
      .subscribe(
        response => {
          if (this.NewVendorMaser.length > 0) {
            this.UpdatePartnerID();
            console.log(this.Vendors);
            this._RFxService.UpdateRFxVendors(this.Vendors,response.RFxID).subscribe(x=>{
              this.GetRFxVendorsByRFxID(this.RFxID);
              console.log("vendors updated");
            },
            err=>{
              console.log("vendors not updated");
            });
            console.log(this.NewVendorMaser);
            this._RFxService.AddtoVendorTable(this.NewVendorMaser).subscribe(res => {
              console.log(res);
              var vendors=<MVendor[]>res;
              var vendorUsers=[];
              vendors.forEach(vendor => {
                var vendorUser=new VendorUser();
                vendorUser.UserName=vendor.PatnerID;
                vendorUser.DisplayName=vendor.VendorName;
                vendorUser.Email=vendor.EmailID1;
                vendorUser.Phone=vendor.ContactPersonMobile;
                vendorUser.IsBlocked=false;
                vendorUsers.push(vendorUser);
              });
              console.log("vendorUsers",vendorUsers);
              if(isRelease){
                this._RFxService.CreateVendorUser(vendorUsers).subscribe(x=>{
                  console.log("vendor user created");
                },
                err=>{
                  console.log("vendor user not created");
                });
              }
            }, err => { console.log("vendor master not created!;") });
          }
          this._RFxService.UploadRFxAttachment(response.RFxID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
          if (isRelease) {
            this.isProgressBarVisibile = false;
            Swal.fire('RFQ released successfully');
            this._router.navigate(['pages/home']);
          }
          else {
            this.isProgressBarVisibile = false;
            if(isForeclose){
              Swal.fire('RFQ foreclosed');
            }
            else{
              Swal.fire('RFQ saved Successfully');
            }
          }
        },
        error => {
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
  GetRFxValues(){
    this.RFxView.RFxType = this.RFxFormGroup.get("RfqType").value;
    this.RFxView.RFxGroup = this.RFxFormGroup.get("RfqGroup").value;
    this.RFxView.Title = this.RFxFormGroup.get("RfqTitle").value;
    this.RFxView.ValidityStartDate = this.RFxFormGroup.get("ValidityStartDate").value;
    this.RFxView.ValidityStartTime = this.RFxFormGroup.get("ValidityStartTime").value;
    this.RFxView.ValidityEndDate = this.RFxFormGroup.get("ValidityEndDate").value;
    this.RFxView.ValidityEndTime = this.RFxFormGroup.get("ValidityEndTime").value;
    this.RFxView.ResponseStartDate = this.RFxFormGroup.get("ResponseStartDate").value;
    this.RFxView.ResponseStartTime = this.RFxFormGroup.get("ResponseStartTime").value;
    this.RFxView.ResponseEndDate = this.RFxFormGroup.get("ResponseEndDate").value;
    this.RFxView.ResponseEndTime = this.RFxFormGroup.get("ResponseEndTime").value;
    this.RFxView.EvalStartDate = this.RFxFormGroup.get('EvaluationStartDate').value;
    this.RFxView.EvalStartTime = this.RFxFormGroup.get('EvaluationStartTime').value;
    this.RFxView.EvalEndDate = this.RFxFormGroup.get("EvaluationEndDate").value;
    this.RFxView.EvalEndTime = this.RFxFormGroup.get("EvaluationEndTime").value;
    this.RFxView.Currency = this.RFxFormGroup.get("Currency").value;
    this.RFxView.MinEvaluator=this.RFxFormGroup.get("Evaluator").value;
    this.RFxView.Plant=this.RFxFormGroup.get("Plant").value;
    this.RFxRemark.Remark=this.Remarks.value;
  }
  ForecloseClicked(){
    this.OpenForecloseDialog();
  }
  DeleteClicked(){
    this.OpenConfirmationDialog("Delete","RFx")
  }
  CancelClicked(){
    this._router.navigate(['pages/home']);
  }
  AddRowToIC(Row:RFxIC){
    this.ItemCriteriaFormArray.push(this._formBuilder.group({
      Criteria:[Row.Text],
      Weightage:[Row.Weightage,Validators.required],
      Consider:[Row.Consider,Validators.required]
    }));
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
        formArray.removeAt(0);
    }
}
ItemPriority(){
 if(this.ICFormGroup.value.ItemCriterias[0].Weightage == 100){
  this.ICFormGroup.get('ItemCriterias').setValue([
		{ Criteria:"Price",Weightage: 100, Consider: "1"},
		{ Criteria:"LeadTime",Weightage: 0, Consider: "0"},
    { Criteria:"Payment	",Weightage: 0, Consider: "0"}		
	]);  
 }
 if(this.ICFormGroup.value.ItemCriterias[1].Weightage == 100){
  this.ICFormGroup.get('ItemCriterias').setValue([
		{ Criteria:"Price",Weightage: 0, Consider: "0"},
		{ Criteria:"LeadTime",Weightage: 100, Consider: "1"},
    { Criteria:"Payment	",Weightage: 0, Consider: "0"}		
	]); 
 }
 if(this.ICFormGroup.value.ItemCriterias[2].Weightage == 100){
  this.ICFormGroup.get('ItemCriterias').setValue([
		{ Criteria:"Price",Weightage: 0, Consider: "0"},
		{ Criteria:"LeadTime",Weightage: 0, Consider: "0"},
    { Criteria:"Payment	",Weightage: 100, Consider: "1"}		
	]); 
 }
}
OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
  const dialogConfig: MatDialogConfig = {
    data: {
      Actiontype: Actiontype,
      Catagory: Catagory
    },
    panelClass: 'confirmation-dialog'
  };
  const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(
    result => {
      if (result) {
        this.DeleteRFx(this.RFxID);
      }
    });
}
DeleteRFx(RFxID:string){
  this.isProgressBarVisibile=true;
  this._RFxService.DeleteRFx(RFxID).subscribe(x=>{
    this.isProgressBarVisibile=false;
    Swal.fire('RFQ deleted Successfully');
    this._router.navigate(['pages/home']);
  },err=>{
    console.log(err);
    this.isProgressBarVisibile=false;
  });
}
GetProgress():number{
  const oneStep=11.111111;
  const count=this.CompletedSteps.filter(x=>x==true).length;
  return oneStep*count;
}
GetCompletedSteps():number{
  const count=this.CompletedSteps.filter(x=>x==true).length;
  return count;
}
OpenAttachment(fileName:string){
  var file=this.FilesToUpload.find(t=>t.name==fileName);
  if(file==undefined){
    this.DownloadRFxAttachment(this.RFxID,fileName);
  }
  else{
    let fileType = 'image/jpg';
        fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
          fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
            fileName.toLowerCase().includes('.png') ? 'image/png' :
              fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : 
                  fileName.toLowerCase().includes('.svg') ? 'image/svg+xml' :'';
        if(fileType=='image/jpg' || fileType=='image/jpeg' || fileType=='image/png' || fileType=='image/gif' || fileType=='application/pdf' || fileType=='image/svg+xml'){
          this.openAttachmentDialog(fileName, file);
        }
        else{
          saveAs(file,fileName);
        }
  }
}
DownloadRFxAttachment(RFxID: string,fileName: string): void {
  this.isProgressBarVisibile = true;
  this._RFxService.DowloandAttachment(RFxID, fileName).subscribe(
    data => {
      if (data) {
        let fileType = 'image/jpg';
        fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
          fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
            fileName.toLowerCase().includes('.png') ? 'image/png' :
              fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : 
                  fileName.toLowerCase().includes('.svg') ? 'image/svg+xml' :'';
        const blob = new Blob([data], { type: fileType });
        if(fileType=='image/jpg' || fileType=='image/jpeg' || fileType=='image/png' || fileType=='image/gif' || fileType=='application/pdf' || fileType=='image/svg+xml'){
          this.openAttachmentDialog(fileName, blob);
        }
        else{
          saveAs(blob,fileName);
        }
      }
      this.isProgressBarVisibile = false;
    },
    error => {
      console.error(error);
      this.isProgressBarVisibile = false;
    }
  );
}
openAttachmentDialog(FileName: string, blob: Blob): void {
  const attachmentDetails: any = {
    FileName: FileName,
    blob: blob
  };
  const dialogConfig: MatDialogConfig = {
    data: attachmentDetails,
    panelClass: 'attachment-dialog'
  };
  const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}
IsNewVendor(vendor:RFxVendorView):boolean{
  var new_vendor=this.NewVendorMaser.find(x=>x.VendorName==vendor.VendorName && x.Type==vendor.Type && x.PatnerID=='');
  if(new_vendor!=undefined){
    return true;
  }
  if(this.RFxID!=null){
    if(vendor.PatnerID.indexOf(this.RFxID.replace(/^0+/, '')+'V')>=0){
      return true;
    }
  }
  return false;
}
UpdatePartnerID(){
  this.NewVendorMaser.forEach((vendor,i) => {
    if(vendor.PatnerID==''){
      vendor.PatnerID=this.RFxID+"V"+(this.RFxNewVendors+1);
      vendor.PatnerID=vendor.PatnerID.replace(/^0+/, '');
      var rfxVendor=new RFxVendor();
      rfxVendor.Client=this.RFxView.Client;
      rfxVendor.Company=this.RFxView.Company;
      rfxVendor.PatnerID=vendor.PatnerID;
      this.Vendors.push(rfxVendor);
    }
  });
}
SetCriteriaTemplate(Template:CriteriaTemplateView){
  this.EvaluationDetails=[];
  Template.Criterias.forEach((x,i) => {
    var criteria=new RFxHC();
    criteria.Client=this.Rfxheader.Client;
    criteria.Company=this.Rfxheader.Company;
    criteria.CriteriaID=i.toString();
    criteria.Text=x.Criteria;
    this.EvaluationDetails.push(criteria);
  });
  this.EvaluationDetailsDataSource=new MatTableDataSource(this.EvaluationDetails);
}
SetQuestionTemplate(Template:QuestionTemplateView){
  this.ODDetails=[];
  Template.Questions.forEach((x) => {
    var criteria=new RFxOD();
    criteria.Client=this.Rfxheader.Client;
    criteria.Company=this.Rfxheader.Company;
    criteria.Qusetion=x.Question;
    criteria.AnswerType=x.AnswerType;
    this.ODDetails.push(criteria);
  });
  this.ODDetailsDataSource=new MatTableDataSource(this.ODDetails);
}
ngOnDestroy(){
  localStorage.removeItem('RFXID');
}
}
