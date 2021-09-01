import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader, MRFxType, MRFxGroup, RFxHC, RFxItem, ResItem, RFxRemark, RFxPartner, RFxVendorView, RFxODAttachment, EvalHC, EvalIC, EvaluatedICs, EvalHeader, ResODView, EvaluationView, EvalCriteriaView, RFxIC, ResHeader } from 'app/models/RFx';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';
import { EvaItemDialogComponent } from '../eval-item-dialog/eval-item-dialog.component';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  partnerID: string;
  menuItems: string[];
  isProgressBarVisibile: boolean;

  EvalView: EvaluationView = new EvaluationView();
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  Rfxheader: RFxHeader = new RFxHeader();
  ResH:ResHeader=new ResHeader();
  EvalHeader:EvalHeader=new EvalHeader();
  RFxTypeMasters: MRFxType[] = [];
  RFxGroupMasters: MRFxGroup[] = [];
  HeaderDetails: RFxHeader[] = [];
  EvaluationDetails: RFxHC[] = [];
  RatingDetails:RFxIC[]=[];
  EvalHcs:EvalHC[]=[];
  EvalIcs:EvalIC[]=[];
  ResItem:ResItem[]=[];
  ItemDetails: RFxItem[] = [];
  ODDetails: ResODView[] = [];
  ODAttachDetails:RFxODAttachment[]=[];
  RFxRemark: RFxRemark = new RFxRemark();
  RatingDetailsDisplayedColumns:string[]=['Criteria','Weightage','Consider'];
  EvaluationDetailsDisplayedColumns: string[] = ['Description','Rating'];
  ItemsDetailsDisplayedColumns: string[] = ['Material','MaterialText', 'TotalQty', 'PerScheduleQty', 'TotalSchedules', 'UOM', 'IncoTerm', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['Question', 'Answer'];
  ODAttachDetailsDisplayedColumns: string[] = ['DocumentTitle', 'DocumentName','Action'];
  CurrencyList: string[] = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  RatingDetailsDataSource:MatTableDataSource<RFxIC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  VendorDetailsDataSource: MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource: MatTableDataSource<ResODView>;
  ODAttachDetailsDataSource:MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string = null;
  RESID: string = null;
  index: number = 0;
  minDate = new Date();
  selectedIndex: number = 0;
  EvalRemarks:string="";
  Plants:string[]=[];

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    //Retrive authorizationData
    const retrievedObject = localStorage.getItem("authorizationData");
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(
        retrievedObject
      ) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.partnerID = this.authenticationDetails.UserName;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.Plants=this.authenticationDetails.Plants;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(
        ","
      );
      // console.log(this.authenticationDetails);
      // if (this.menuItems.indexOf("OrderFulFilmentCenter") < 0) {
      //     this.notificationSnackBarComponent.openSnackBar(
      //         "You do not have permission to visit this page",
      //         SnackBarStatus.danger
      //     );
      //     this._router.navigate(["/auth/login"]);
      // }
    } else {
      this._router.navigate(["/auth/login"]);
    }
    this.InitializeRFxFormGroup();
    this.RFxID=localStorage.getItem("E_RFXID");
    this.RESID=localStorage.getItem("E_RESID");
    this.GetRFxs();
    this.GetRFQMasters();
    this.GetEvalHeader(this.RESID,this.currentUserName);
    this.RFxFormGroup.disable();
  }

  GetRFxs(): void {
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetRFxHCsByRFxID(this.RFxID);
    this.GetRFxICsByRFxID(this.RFxID);
    this.GetRFxItemsByRFxID(this.RFxID);
    this.GetResHeader(this.RESID);
    this.GetResItem(this.RESID);
    this.GetResODViewsByRESID(this.RESID);
    this.GetRFxODAttachmentsByRFxID(this.RFxID);
    this.GetRFxRemarkByRFxID(this.RFxID);
  }
  GetConsider(bit:string):string{
    if(bit=="0"){
      return "Low";
    }
    return "High";
  }

  GetRFxHsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          // console.log("header",data);
          this.Rfxheader=<RFxHeader>data;
          this.RFxFormGroup.get("RfqType").setValue(this.Rfxheader.RFxType);
          this.RFxFormGroup.get("RfqGroup").setValue(this.Rfxheader.RFxGroup);
          this.RFxFormGroup.get("RfqTitle").setValue(this.Rfxheader.Title);
          this.RFxFormGroup.get("ValidityStartDate").setValue(this.Rfxheader.ValidityStartDate);
          this.RFxFormGroup.get("ValidityEndDate").setValue(this.Rfxheader.ValidityEndDate);
          this.RFxFormGroup.get("ResponseStartDate").setValue(this.Rfxheader.ResponseStartDate);
          this.RFxFormGroup.get("ResponseEndDate").setValue(this.Rfxheader.ResponseEndDate);
          this.RFxFormGroup.get("Currency").setValue(this.Rfxheader.Currency);
          this.RFxFormGroup.get("ValidityStartTime").setValue(this.Rfxheader.ValidityStartTime);
          this.RFxFormGroup.get("ValidityEndTime").setValue(this.Rfxheader.ValidityEndTime);
          this.RFxFormGroup.get("ResponseStartTime").setValue(this.Rfxheader.ResponseStartTime);
          this.RFxFormGroup.get("ResponseEndTime").setValue(this.Rfxheader.ResponseEndTime);
          this.RFxFormGroup.get("EvaluationEndDate").setValue(this.Rfxheader.EvalEndDate);
          this.RFxFormGroup.get("EvaluationEndTime").setValue(this.Rfxheader.EvalEndTime);
          this.RFxFormGroup.get("Evaluator").setValue(this.Rfxheader.MinEvaluator);
          this.RFxFormGroup.get("Plant").setValue(this.Rfxheader.Plant);
        }
      }
    );
  }
  GetRFxICsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxICsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.RatingDetails = <RFxIC[]>data;
          this.RatingDetailsDataSource = new MatTableDataSource(this.RatingDetails);
        }
      }
    );
  }
  GetRFxHCsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxHCsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.EvaluationDetails = <RFxHC[]>data;
          this.EvaluationDetails.forEach(element => {
            var criteria=new EvalHC();
            criteria.Client=element.Client;
            criteria.Company=element.Company;
            criteria.Criteria=element.CriteriaID;
            criteria.Rating=null;
            this.EvalHcs.push(criteria);
          });
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
          this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
        }
      }
    );
  }

  GetResHeader(RESID:string):void{
    this._RFxService.GetResponseByResponseID(RESID).subscribe(data=>{
      this.ResH=<ResHeader>data;
    });
  }

  GetResODViewsByRESID(RESID: string): void {
    this._RFxService.GetResODViewsByRESID(RESID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <ResODView[]>data;
          this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
        }
      }
    );
  }

  GetResItem(ResID: string) {
    this._RFxService.GetResponseItemsByResponseID(ResID).subscribe(data => {
      this.ResItem = <ResItem[]>data;
    });
  }
  
  GetRFxRemarkByRFxID(RFxID: string) {
    this._RFxService.GetRFxRemarkByRFxID(RFxID).subscribe((data) => {
      if (data) {
        this.RFxRemark = <RFxRemark>data;
      }
    })
  }
  
  GetRFxODAttachmentsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODAttachmentsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
        }
      }
    );
  }
  
  GetRFQMasters() {
    this.GetRFQTypeMaster();
    this.GetRFQGroupMaster();
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
  
  GetEvalHeader(RESID:string,User:string){
    this._RFxService.GetEvalHeaderByID(RESID,User).subscribe(evalH=>{
      if(evalH){
        this.EvalHeader=<EvalHeader>evalH;
        this.EvalRemarks=this.EvalHeader.EvalRemarks;
        this.GetEvalHCs(this.EvalHeader.EvalID);
        this.GetEvalICs(this.EvalHeader.EvalID);
      }
    });
  }

  GetEvalHCs(EvalID:string){
    this._RFxService.GetEvalHCsByID(EvalID).subscribe(data=>{
      if(data){
        this.EvalHcs=<EvalHC[]>data;
      }
    });
  }
  GetEvalICs(EvalID:string){
    this._RFxService.GetEvalICsByID(EvalID).subscribe(data=>{
      if(data){
        this.EvalIcs=<EvalIC[]>data;
      }
    });
  }

  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType: [''],
      RfqGroup: [''],
      RfqTitle: [''],
      Plant:[''],
      ValidityStartDate: [''],
      ValidityStartTime:[''],
      ValidityEndDate: [''],
      ValidityEndTime:[''],
      ResponseStartDate: [''],
      ResponseStartTime:[''],
      ResponseEndDate: [''],
      ResponseEndTime:[''],
      EvaluationStartDate:[''],
      EvaluationStartTime:[''],
      EvaluationEndDate:[''],
      EvaluationEndTime:[''],
      Evaluator:[''],
      Currency: [''],
      Site:['']
    });
  }
  
  tabClick(tab: any) {
    this.selectedIndex = parseInt(tab.index);
  }

  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }

  NextClicked(index: number): void {
    this.selectedIndex = index + 1;
  }
  PreviousClicked(index: number): void {
    this.selectedIndex = index - 1;
  }
  SaveEvalClicked(isRelease:boolean) {
    if(this.EvalHeader.EvalID){
      this.UpdateEval(isRelease);
    }
    else{
      this.CreateEval(isRelease);
    }
  }

  CreateEval(isRelease:boolean){
    this.isProgressBarVisibile = true;
    this.EvalView.Client=this.Rfxheader.Client;
    this.EvalView.Company=this.Rfxheader.Company;
    this.EvalView.RFxID=this.Rfxheader.RFxID;
    this.EvalView.RESID=this.RESID;
    this.EvalView.User=this.currentUserName;
    this.EvalView.Date=new Date();
    this.EvalView.ItemResponded=null;
    this.EvalView.EvalRemarks=this.EvalRemarks;
    this.EvalView.EvalHCs=this.EvalHcs;
    this.EvalView.EvalICs=[];
    if(isRelease){
      this.EvalView.Status="2";
    }
    else{
      this.EvalView.Status="1";
    }
    console.log(this.EvalView);
    this._RFxService.CreateEvaluation(this.EvalView).subscribe((response)=>{
      console.log("response",response);
      this.isProgressBarVisibile = false;
      if(isRelease){
        this.notificationSnackBarComponent.openSnackBar('Evaluation released successfully', SnackBarStatus.success);
        this._router.navigate(['pages/evaluationresponse']);
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Evaluation saved successfully', SnackBarStatus.success);
      }
    },
    error => {
      console.log(error);
      this.isProgressBarVisibile = false;
      this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
    });
  }
  UpdateEval(isRelease:boolean){
    this.isProgressBarVisibile = true;
    this.EvalView.Client=this.Rfxheader.Client;
    this.EvalView.Company=this.Rfxheader.Company;
    this.EvalView.RFxID=this.Rfxheader.RFxID;
    this.EvalView.RESID=this.RESID;
    this.EvalView.EvalID=this.EvalHeader.EvalID;
    this.EvalView.User=this.currentUserName;
    this.EvalView.Date=new Date();
    this.EvalView.ItemResponded=null;
    this.EvalView.EvalRemarks=this.EvalRemarks;
    this.EvalView.EvalHCs=this.EvalHcs;
    this.EvalView.EvalICs=[];
    if(isRelease){
      this.EvalView.Status="2";
    }
    else{
      this.EvalView.Status="1";
    }
    console.log(this.EvalView);
    this._RFxService.UpdateEvaluation(this.EvalView).subscribe((response)=>{
      console.log("response",response);
      this.isProgressBarVisibile = false;
      if(isRelease){
        this.notificationSnackBarComponent.openSnackBar('Evaluation Released successfully', SnackBarStatus.success);
        this._router.navigate(['pages/evaluationresponse']);
      }
      else{
        this.notificationSnackBarComponent.openSnackBar('Evaluation saved successfully', SnackBarStatus.success);
      }
    },
    error => {
      console.log(error);
      this.isProgressBarVisibile = false;
      this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
    });
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

  OpenEvaItemDialog(item:RFxItem) {
    var resItem=this.ResItem.filter(x=>x.Item==item.Item && x.Client==item.Client && x.Company==item.Company);
    const dialogRef = this.dialog.open(EvaItemDialogComponent, {
      data: { RFxItem:item,ResItem:resItem[0]}, panelClass:"eval-item-dialog"
    });
  }

  onRate($event:{oldValue:number, newValue:number},index:any) {
    this.EvalHcs[index].Rating=$event.newValue.toString();
  }

  CancelClicked(){
    this._router.navigate(['pages/evaluationresponse']);
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
                  fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
          const blob = new Blob([data], { type: fileType });
          if(fileType=='image/jpg' || fileType=='image/jpeg' || fileType=='image/png' || fileType=='image/gif' || fileType=='application/pdf'){
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
  IsComplete():boolean{
    if(this.EvalHcs.filter(x=>x.Rating==null).length>0){
      return false;
    }
    return true;
  }
}
