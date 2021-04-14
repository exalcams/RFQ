import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxIC, RFxPartner, MVendor, RFxOD, RFxODAttachment, RFxVendor, RFxVendorView, RFxView, RFxRemark, MRFxType, MRFxGroup } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { DialogContentExampleDialogComponent } from './rfq-dialogs/Criteria-Dialog/dialog-content-example-dialog.component';
import { DialogContentExampleDialog1Component } from './rfq-dialogs/Rateing-Dialog/dialog-content-example-dialog1.component';
import { DialogContentExampleDialog2Component } from './rfq-dialogs/Item-Dialog/dialog-content-example-dialog2.component';
import { DialogContentExampleDialog3Component } from './rfq-dialogs/Partner-Dialo/dialog-content-example-dialog3.component';
import { DialogContentExampleDialog4Component } from './rfq-dialogs/Vendor-Dialog/dialog-content-example-dialog4.component';
import { DialogContentExampleDialog5Component } from './rfq-dialogs/Question-Dialog/dialog-content-example-dialog5.component';
import { DialogContentExampleDialog7Component } from './rfq-dialogs/Attachment-Dialog/dialog-content-example-dialog7.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SelectVendorDialogComponent } from './rfq-dialogs/select-vendor-dialog/select-vendor-dialog.component';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { MasterService } from 'app/services/master.service';


@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
  RFxView: RFxView = new RFxView();
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
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
  EvaluationDetailsDisplayedColumns: string[] = ['Criteria', 'Description', 'Action'];
  ItemsDetailsDisplayedColumns: string[] = ['Material','MaterialText', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  RatingDetailsDisplayedColumns: string[] = ['Criteria', 'Description', 'Action'];
  PartnerDetailsDisplayedColumns: string[] = ['Type', 'Usertables', 'Action'];
  VendorDetailsDisplayedColumns: string[] = ['Vendor', 'Type', 'VendorName', 'GSTNo', 'City', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['Question', 'Answertype', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['Documenttitle', 'Remark', 'Action'];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  // RatingDetailsDataSource=new BehaviorSubject<RFxVendorView[]>([]);
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
  isProgressBarVisibile: boolean;
  NewVendorMaser: MVendor[] = [];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  Evaluators: string[] = [];
  CurrencyList: string[] = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"];
  IsComplete:boolean=false;
  Progress:number=0;
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
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    // console.log(retrievedObject);   
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
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
    this.index = 0;
    this.InitializeRFxFormGroup();
    // this._route.queryParams.subscribe(params => {
    //   this.RFxID = params['id'];
    // });
    if (localStorage.getItem('RFXID') != "undefined" || localStorage.getItem('RFXID') != "-1") {
      this.RFxID = localStorage.getItem('RFXID');
    }
    else {
      this.RFxID = null;
    }
    //console.log(this.RFxID);
    if (this.RFxID) {
      this.GetRFxs();
    }
    this.GetRFQMasters();
  }

  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType: ['', [Validators.required]],
      RfqGroup: ['', [Validators.required]],
      RfqTitle: ['', [Validators.required]],
      ValidityStartDate: ['', [Validators.required]],
      ValidityStartTime: ['', [Validators.required]],
      ValidityEndDate: ['', [Validators.required]],
      ValidityEndTime: ['', [Validators.required]],
      ResponseStartDate: ['', [Validators.required]],
      ResponseStartTime: ['', [Validators.required]],
      ResponseEndDate: ['', [Validators.required]],
      ResponseEndTime: ['', [Validators.required]],
      EvaluationEndDate: ['', [Validators.required]],
      EvaluationEndTime: ['', [Validators.required]],
      Evaluator: [null, [Validators.required]],
      Currency: ['INR', [Validators.required]],
      Site: ['', [Validators.required]],
    });
  }

  GetRFQMasters() {
    this.GetRFQTypeMaster();
    this.GetRFQGroupMaster();
    this.masterService.GetRFQRoleWithUsers("Evaluator").subscribe(data => {
      this.Evaluators = data;
      this.RFxFormGroup.get('Evaluator').setValidators([Validators.max(this.Evaluators.length)]);
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
    })
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
    this.GetRFxRemarkByRFxID(this.RFxID);
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
          this.RFxFormGroup.get("EvaluationEndDate").setValue(this.Rfxheader.EvalEndDate);
          this.RFxFormGroup.get("EvaluationEndTime").setValue(this.Rfxheader.EvalEndTime);
          this.RFxFormGroup.get("Evaluator").setValue(this.Rfxheader.MinEvaluator);
          this.RFxFormGroup.get("Currency").setValue(this.Rfxheader.Currency);
          this.RFxFormGroup.get("Site").setValue(this.Rfxheader.Site);
          if (this.Rfxheader.Status == "2") {
            this.RFxFormGroup.disable();
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
          this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
          if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
            this.IsComplete=true;
          }else{this.IsComplete=false}
        }
      }
    );
  }
  GetRFxItemsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxItemsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
          if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
            this.IsComplete=true;
          }else{this.IsComplete=false}
        }
      }
    );
  }
  // GetRFxICsByRFxID(RFxID:string): void {
  //   this._RFxService.GetRFxICsByRFxID(RFxID).subscribe(
  //     (data) => {
  //       if (data) {
  //         this.RatingDetails = <RFxIC[]>data;
  //         this.RatingDetailsDataSource = new MatTableDataSource(
  //           this.RatingDetails
  //         );
  //       }
  //     }
  //   );
  // }
  GetRFxPartnersByRFxID(RFxID: string): void {
    this._RFxService.GetRFxPartnersByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.PartnerDetails = <RFxPartner[]>data;
          this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
          if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
            this.IsComplete=true;
          }else{this.IsComplete=false}
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
          this.Vendors.forEach(element => {
            this.GetRFxVendorViewsByRFxID(element.PatnerID);
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
      if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
        this.IsComplete=true;
      }else{this.IsComplete=false}
    });
  }
  GetRFxODsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
          if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
            this.IsComplete=true;
          }else{this.IsComplete=false}
        }
      }
    );
  }
  GetRFxODAttachmentsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODAttachmentsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
          if (this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
            this.IsComplete=true;
          }else{this.IsComplete=false}
        }
      }
    );
  }
  GetRFxRemarkByRFxID(RFxID: string) {
    this._RFxService.GetRFxRemarkByRFxID(RFxID).subscribe((data) => {
      if (data) {
        this.RFxRemark = <RFxRemark>data;
        //console.log(this.RFxRemark);
      }
    })
  }

  CreateCriteria() {
    var Criteria = new RFxHC();
    Criteria.Client = this.Rfxheader.Client;
    Criteria.Company = this.Rfxheader.Company;
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
    const dialogRef = this.dialog.open(DialogContentExampleDialogComponent, {
      data: { data: Criteria, isCreate: bool }, height: '40%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.EvaluationDetails.push(res.data);
        this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
      }
    });
  }
  OpenItemDialog(Item: RFxItem, bool: boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog2Component, {
      data: { data: Item, isCreate: bool }, height: '82%',
      width: '82%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.ItemDetails.push(res.data);

        this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
      }
      this.FilesToUpload.push(res.Attachments);
    });
  }
  OpenPartnerDialog(Partner: RFxPartner, bool: boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog3Component, {
      data: { data: Partner, isCreate: bool, RFxPartners: this.PartnerDetails }, height: '43%',
      width: '40%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.PartnerDetails = res;
        this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
      }
    });
  }
  OpenVendorDialog(Vendor: RFxVendorView) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog4Component, {
      data: { data: Vendor }, height: '90%',
      width: '40%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
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
      data: { data: vendors }, height: '80%',
      width: '40%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
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
    const dialogRef = this.dialog.open(DialogContentExampleDialog5Component, {
      data: { data: Question, isCreate: bool }, height: '44%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isCreate) {
        this.ODDetails.push(res.data);
        this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
        if(this.ODAttachDetails.length>0){
          this.Progress=7*14.28571428571429;
        }
        else{
          this.Progress=6*14.28571428571429;
        }
      }
    });
  }
  OpenDocumentDialog(Document: RFxODAttachment, bool: boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog7Component, {
      data: { data: Document, isCreate: bool }, height: '52%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res && res.isCreate) {
        this.ODAttachDetails.push(res.data);
        this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
        this.Progress=7*14.28571428571429;
        if (this.Rfxheader.Status == "1" && this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
          this.IsComplete=true;
        }else{this.IsComplete=false}
      }
      if (this.FilesToUpload.indexOf(res.Attachments) >= 0) {
        this.FilesToUpload[this.FilesToUpload.indexOf(res.Attachments)] = res.Attachments;
      }
      else {
        this.FilesToUpload.push(res.Attachments);
      }
      //console.log(this.FilesToUpload);
    });
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }

  DeleteCriteria(index) {
    this.EvaluationDetails.splice(index, 1);
    this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
  }
  DeleteItem(index) {
    this.ItemDetails.splice(index, 1);
    this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
  }
  DeletePartner(index) {
    this.PartnerDetails.splice(index, 1);
    this.PartnerDetailsDataSource = new MatTableDataSource(this.PartnerDetails);
  }
  DeleteVendor(index) {
    this.VendorDetails.splice(index, 1);
    this.VendorDetailsDataSource = new MatTableDataSource(this.VendorDetails);
  }
  DeleteQuetion(index) {
    this.ODDetails.splice(index, 1);
    this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
  }
  DeleteAttachment(index) {
    this.ODAttachDetails.splice(index, 1);
    this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
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
  }
  ConvertToDateTime(ParamDate: Date, Time: string): Date {
    var date=new Date(ParamDate);
    var test = Time;
    var timeReg =/([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])/;
    var parts = test.match(timeReg);
    var hours = /am/i.test(parts[3]) ?
      function (am) { return am < 12 ? am : 0 }(parseInt(parts[1], 10)) :
      function (pm) { return pm < 12 ? pm + 12 : 12 }(parseInt(parts[1], 10));

    var minutes = parseInt(parts[2], 10);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0,0);
    return date;
  }
  NextClicked(index: number): void {
    if(index == 0){
      if(this.RFxFormGroup.valid && (this.RFxID == null || this.RFxID=="-1")){
        this.Rfxheader.Status = "1";
        this.selectedIndex = index + 1;
        this.Progress=14.28571428571429;
        this.CreateCriteria();
      }
      else{
        this.ShowValidationErrors(this.RFxFormGroup);
      }
    }
    if(index == 1){
      if(this.EvaluationDetails.length > 0){
        this.selectedIndex = index + 1;
        this.Progress=2*14.28571428571429;
        this.CreateItem();
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Criteria is required', SnackBarStatus.danger);
      }
    }
    if(index == 2){
      if(this.ItemDetails.length >= 0){
        this.selectedIndex = index + 1;
        this.Progress=3*14.28571428571429;
        this.CreatePartner();
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Item is required', SnackBarStatus.danger);
      }
    }
    if(index == 3){
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
        this.selectedIndex = index + 1;
        this.Progress=4*14.28571428571429;
      }
    }
    if(index == 4){
      if(this.VendorDetails.length >= 0){
        this.selectedIndex = index + 1;
        this.Progress=5*14.28571428571429;
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Vendor is required', SnackBarStatus.danger);
      }
    }
  }
  PreviousClicked(index: number): void {
    this.selectedIndex = index - 1;
    if (this.Rfxheader.Status == "1" && this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
      this.IsComplete=true;
    }else{this.IsComplete=false}
  }
    
  tabClick(tab: any) {
    this.index = parseInt(tab.index);
    if (this.Rfxheader.Status == "1" && this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0){
      this.IsComplete=true;
    }else{this.IsComplete=false}
  }
  SaveRFxClicked(isRelease: boolean) {
    if (this.Rfxheader.Status == "1" && this.EvaluationDetails.length > 0 && this.ItemDetails.length > 0 && this.PartnerDetails.length > 0 && this.VendorDetails.length > 0 && this.ODDetails.length > 0 && this.ODAttachDetails.length > 0) {
      if (this.NewVendorMaser.length > 0) {
        this._RFxService.AddtoVendorTable(this.NewVendorMaser).subscribe(res => {
          //console.log("vendor created");
        }, err => { console.log("vendor master not created!;") });
      }
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
  CreateRfX(isRelease: boolean) {
    this.isProgressBarVisibile = true;
    this.RFxView.Client = this.Rfxheader.Client;
    this.RFxView.Company = this.Rfxheader.Company;
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
    this.RFxView.EvalEndDate = this.RFxFormGroup.get("EvaluationEndDate").value;
    this.RFxView.EvalEndTime = this.RFxFormGroup.get("EvaluationEndTime").value;
    this.RFxView.Currency = this.RFxFormGroup.get("Currency").value;
    this.RFxView.MinEvaluator=this.RFxFormGroup.get("Evaluator").value;
    this.RFxView.Site=this.RFxFormGroup.get("Site").value;
    if (isRelease) {
      this.RFxView.Status = "2";
    }
    else {
      this.RFxView.Status = "1";
    }
    this.RFxView.RFxItems = this.ItemDetails;
    this.RFxView.RFxHCs = this.EvaluationDetails;
    this.RFxView.RFxICs = this.RatingDetails;
    this.RFxView.RFxPartners = this.PartnerDetails;
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
          //console.log("response",response);
          this._RFxService.UploadRFxAttachment(response.RFxID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
          if (isRelease) {
            this.isProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar('RFQ released successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
          else {
            this.notificationSnackBarComponent.openSnackBar('RFQ saved successfully', SnackBarStatus.success);
            this.isProgressBarVisibile = false;
          }
        },
        error => {
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
  UpdateRFx(isRelease: boolean) {
    this.isProgressBarVisibile = true;
    this.RFxView.Client = this.Rfxheader.Client;
    this.RFxView.Company = this.Rfxheader.Company;
    this.RFxView.RFxID = this.RFxID;
    this.RFxView.Plant = this.Rfxheader.Plant;
    this.RFxView.RFxType = this.RFxFormGroup.get("RfqType").value;
    this.RFxView.RFxGroup = this.RFxFormGroup.get("RfqGroup").value;
    if (isRelease) {
      this.RFxView.Status = "2";
    }
    else {
      this.RFxView.Status = "1";
    }
    this.RFxView.Title = this.RFxFormGroup.get("RfqTitle").value;
    this.RFxView.ValidityStartDate = this.RFxFormGroup.get("ValidityStartDate").value;
    this.RFxView.ValidityStartTime = this.RFxFormGroup.get("ValidityStartTime").value;
    this.RFxView.ValidityEndDate = this.RFxFormGroup.get("ValidityEndDate").value;
    this.RFxView.ValidityEndTime = this.RFxFormGroup.get("ValidityEndTime").value;
    this.RFxView.ResponseStartDate = this.RFxFormGroup.get("ResponseStartDate").value;
    this.RFxView.ResponseStartTime = this.RFxFormGroup.get("ResponseStartTime").value;
    this.RFxView.ResponseEndDate = this.RFxFormGroup.get("ResponseEndDate").value;
    this.RFxView.ResponseEndTime = this.RFxFormGroup.get("ResponseEndTime").value;
    this.RFxView.EvalEndDate = this.RFxFormGroup.get("EvaluationEndDate").value;
    this.RFxView.EvalEndTime = this.RFxFormGroup.get("EvaluationEndTime").value;
    this.RFxView.Currency = this.RFxFormGroup.get("Currency").value;
    this.RFxView.MinEvaluator=this.RFxFormGroup.get("Evaluator").value;
    this.RFxView.Site=this.RFxFormGroup.get("Site").value;
    this.RFxView.Invited = this.Rfxheader.Invited;
    this.RFxView.Responded = this.Rfxheader.Responded;
    this.RFxView.Evaluated = this.Rfxheader.Evaluated;
    this.RFxView.ReleasedOn = this.Rfxheader.ReleasedOn;
    this.RFxView.ReleasedBy = this.Rfxheader.ReleasedBy;
    this.RFxView.RFxItems = this.ItemDetails;
    this.RFxView.RFxHCs = this.EvaluationDetails;
    this.RFxView.RFxICs = this.RatingDetails;
    this.RFxView.RFxPartners = this.PartnerDetails;
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
          //console.log("response",response);
          this._RFxService.UploadRFxAttachment(response.RFxID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
          if (isRelease) {
            this.isProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar('RFQ released successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
          else {
            this.isProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar('RFQ saved successfully', SnackBarStatus.success);
          }
        },
        error => {
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
}
