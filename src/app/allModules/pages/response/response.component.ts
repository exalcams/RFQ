import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxPartner, RFxOD, RFxVendorView, MRFxGroup, MRFxType, ResponseView, RespondedItems, ResItem, RespondedODs, ResOD, ResHC, ResHeader, ResODAttachment, RespondedODAttachments, RFxRemark, RFxODAttachment, RFxIC } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ResItemDialogComponent } from './response-dialogs/res-item-dialog/res-item-dialog.component';
import { ResAnsDialogComponent } from './response-dialogs/res-ans-dialog/res-ans-dialog.component';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  partnerID: string;
  menuItems: string[];
  isProgressBarVisibile: boolean;

  ResView: ResponseView = new ResponseView();
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  Rfxheader: RFxHeader = new RFxHeader();
  RFxTypeMasters: MRFxType[] = [];
  RFxGroupMasters: MRFxGroup[] = [];
  HeaderDetails: RFxHeader[] = [];
  RatingDetails:RFxIC[]=[];
  EvaluationDetails: RFxHC[] = [];
  ItemDetails: RFxItem[] = [];
  ODDetails: RFxOD[] = [];
  ResH: ResHeader = new ResHeader();
  ResI: ResItem[] = [];
  ResHC: ResHC[] = [];
  ResOD: ResOD[] = [];
  ResODAttachment: ResODAttachment[] = [];
  RFxRemark: RFxRemark = new RFxRemark();
  ResRemarks: string;
  RespondedI: RespondedItems[] = [];
  RespondedOD: RespondedODs[] = [];
  RespondedAttachment: RespondedODAttachments[] = [];
  RatingDetailsDisplayedColumns:string[]=['Criteria','Weightage','Consider'];
  EvaluationDetailsDisplayedColumns: string[] = ['Description'];
  ItemsDetailsDisplayedColumns: string[] = ['Material','MaterialText', 'TotalQty', 'PerScheduleQty', 'TotalSchedules', 'UOM', 'IncoTerm', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['Question', 'AnswerType', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['DocumentTitle', 'DocumentName','Action'];
  CurrencyList: string[] = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  RatingDetailsDataSource:MatTableDataSource<RFxIC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  PartnerDetailsDataSource: MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource: MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource: MatTableDataSource<RFxOD>;
  ODAttachDetailsDataSource:MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string = null;
  selectedIndex: number = 0;
  FilesToUpload: File[] = [];
  ResItemFiles:File[]=[];
  ODAttachDetails: RFxODAttachment[] = [];
  minDate=new Date();

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
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem("authorizationData");
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(
        retrievedObject
      ) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.partnerID = this.authenticationDetails.UserName;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
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
    this.RFxID=localStorage.getItem('RRFxID');
    this.GetRFxs();
    this.GetResH(this.RFxID, this.currentUserName);
    this.GetRFQMasters();
    this.RFxFormGroup.disable();
  }
  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType: [''],
      RfqGroup: [''],
      RfqTitle: [''],
      ValidityStartDate: [''],
      ValidityStartTime:[''],
      ValidityEndDate: [''],
      ValidityEndTime:[''],
      ResponseStartDate: [''],
      ResponseStartTime:[''],
      ResponseEndDate: [''],
      ResponseEndTime:[''],
      EvaluationEndDate:[''],
      EvaluationEndTime:[''],
      Evaluator:[''],
      Currency: [''],
      Site:['']
    });
  }

  GetRFxs(): void {
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetRFxHCsByRFxID(this.RFxID);
    this.GetRFxItemsByRFxID(this.RFxID);
    this.GetRFxODsByRFxID(this.RFxID);
    this.GetRFxODAttachmentsByRFxID(this.RFxID);
    this.GetRFxRemarkByRFxID(this.RFxID);
  }

  GetRFxHsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          //console.log("header",data);
          this.Rfxheader = data as RFxHeader;
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
          this.RFxFormGroup.get("Site").setValue(this.Rfxheader.Site);
          this.ResH.Client = this.Rfxheader.Client;
          this.ResH.Company = this.Rfxheader.Company;
          this.ResH.RFxID = this.Rfxheader.RFxID;
          this.ResH.PartnerID = this.currentUserName;
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
            var res = new ResHC();
            res.Client = element.Client;
            res.Company = element.Company;
            res.CriteriaID = element.CriteriaID;
            this.ResHC.push(res);
          });
          this.EvaluationDetailsDataSource = new MatTableDataSource(this.EvaluationDetails);
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
  GetRFxItemsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxItemsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          this.ItemDetails.forEach(element => {
            var res = new RespondedItems();
            res.Item = new ResItem();
            res.Item.Client = element.Client;
            res.Item.Company = element.Company;
            res.Item.RFxID = this.RFxID;
            res.Item.Item = element.Item;
            res.isResponded = false;
            res.Attachments=[];
            this.RespondedI.push(res);
          });
          this.ItemDetailsDataSource = new MatTableDataSource(this.ItemDetails);
        }
      }
    );
  }

  GetRFxODsByRFxID(RFxID: string): void {
    this._RFxService.GetRFxODsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          this.ODDetails.forEach(element => {
            var res = new RespondedODs();
            res.OD = new ResOD();
            res.OD.Client = element.Client;
            res.OD.Company = element.Company;
            res.OD.RFxID = this.RFxID;
            res.OD.QuestionID=element.QuestionID;
            res.isResponded = false;
            this.RespondedOD.push(res);
          });
          this.ODDetailsDataSource = new MatTableDataSource(this.ODDetails);
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
  GetResH(RFxID: string, Vendor: string) {
    this._RFxService.GetResponseByPartnerID(RFxID, Vendor).subscribe(data => {
      if (data) {
        this.ResH = data as ResHeader;
        this.GetResI(this.ResH.RESID);
        this.GetResOD(this.ResH.RESID);
        this.GetResODAttachments(this.ResH.RESID);
      }
    });
  }
  GetResI(ResID: string) {
    this._RFxService.GetResponseItemsByResponseID(ResID).subscribe(data => {
      this.ResI = <ResItem[]>data;
      if (this.ResI.length != 0) {
        this.ResI.forEach(element => {
          var res=this.RespondedI.filter(x=>x.Item.Item==element.Item);
          if(res.length>0){
            res[0].isResponded=true;
            res[0].Item=element;
            res[0].Attachments=[];
          }
        });
      }
    });
  }
  GetResOD(ResID: string) {
    this._RFxService.GetResponseODsByResponseID(ResID).subscribe(data => {
      this.ResOD = <ResOD[]>data;
      if (this.ResOD.length != 0) {
        this.RespondedOD = [];
        this.ResOD.forEach(element => {
          var resItem = new RespondedODs();
          resItem.OD = element;
          resItem.OD.QuestionID = element.QuestionID;
          resItem.isResponded = true;
          this.RespondedOD.push(resItem);
        });
      }
    });
  }
  GetResODAttachments(ResID: string) {
    this._RFxService.GetResponseODAttachmentsByResponseID(ResID).subscribe(data => {
      this.ResODAttachment = <ResODAttachment[]>data;  
      this.ResODAttachment.forEach(oda => {
        this._RFxService.DowloandResAttachment(oda.DocumentName).subscribe(data=>{
          const blob = new Blob([data])
          let blobArr=new Array<Blob>();
          blobArr.push(blob);
          var file=new File(blobArr,oda.DocumentName);
          this.ResItemFiles.push(file);
          this.isProgressBarVisibile=false;
        });
      });
    });
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

  CreateRes(IsRelease:boolean) {
    this.isProgressBarVisibile = true;
    // Header & Item
    this.ResH.Date = new Date();
    var RICount = 0;
    this.ResI = [];
    this.ResOD = [];
    this.RespondedI.forEach(element => {
      if (element.isResponded) {
        RICount++;
        this.ResI.push(element.Item);
      }
    });
    // OD
    this.RespondedOD.forEach(element => {
      if (element.isResponded) {
        this.ResOD.push(element.OD);
      }
    });
    this.ResView.ItemResponded = RICount.toString();
    this.ResView.Client = this.Rfxheader.Client;
    this.ResView.Company = this.Rfxheader.Company;
    this.ResView.RFxID = this.Rfxheader.RFxID;
    this.ResView.ResRemarks = this.ResH.ResRemarks;
    this.ResView.PartnerID = this.ResH.PartnerID;
    this.ResView.Date = this.ResH.Date;
    this.ResView.ResItems = this.ResI;
    this.ResView.ResHCs = this.ResHC;
    this.ResView.ResODs = this.ResOD;
    this.ResView.ResODAttach = this.ResODAttachment;
    if(IsRelease){
      this.ResView.Status="2";
    }
    else{
      this.ResView.Status="1";
    }
    console.log("resview", this.ResView);
    this._RFxService.CreateResponse(this.ResView)
      .subscribe(
        response => {
          if(IsRelease){
            this.isProgressBarVisibile = false;
            this._router.navigate(['pages/responsehome']);
            this.notificationSnackBarComponent.openSnackBar('Responded successfully', SnackBarStatus.success);
          }
          else{
            this.isProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar('Response saved successfully', SnackBarStatus.success);
          }
          console.log("response", response);this.notificationSnackBarComponent.openSnackBar('Responded successfully', SnackBarStatus.success);
          this._RFxService.UploadResAttachment(response.RESID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false
        });
  }
  UpdateRes(IsRelease:boolean) {
    this.isProgressBarVisibile = true;
    // Header & Item
    this.ResH.Date = new Date();
    var RICount = 0;
    this.ResI = [];
    this.ResOD = [];
    this.RespondedI.forEach(element => {
      if (element.isResponded) {
        RICount++;
        this.ResI.push(element.Item);
      }
    });
    // OD
    this.RespondedOD.forEach(element => {
      if (element.isResponded) {
        this.ResOD.push(element.OD);
      }
    });
    this.ResView.ItemResponded = RICount.toString();
    this.ResView.Client = this.Rfxheader.Client;
    this.ResView.Company = this.Rfxheader.Company;
    this.ResView.RFxID = this.Rfxheader.RFxID;
    this.ResView.RESID = this.ResH.RESID;
    this.ResView.ResRemarks = this.ResH.ResRemarks;
    this.ResView.PartnerID = this.ResH.PartnerID;
    this.ResView.Date = this.ResH.Date;
    this.ResView.ResItems = this.ResI;
    this.ResView.ResHCs = this.ResHC;
    this.ResView.ResODs = this.ResOD;
    this.ResView.ResODAttach = this.ResODAttachment;
    if(IsRelease){
      this.ResView.Status="2";
    }
    else{
      this.ResView.Status="1";
    }
    console.log("resview", this.ResView);
    this._RFxService.UpdateResponse(this.ResView)
      .subscribe(
        response => {
          if(IsRelease){
            this.isProgressBarVisibile = false;
            this._router.navigate(['pages/responsehome']);
            this.notificationSnackBarComponent.openSnackBar('Responded successfully', SnackBarStatus.success);
          }
          else{
            this.isProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar('Response saved successfully', SnackBarStatus.success);
          }
          console.log("response", response);this.notificationSnackBarComponent.openSnackBar('Responded successfully', SnackBarStatus.success);
          this._RFxService.UploadResAttachment(response.RESID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false
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
  SaveResClicked(IsRelease:boolean) {
    if (!this.ResH.RESID) {
      this.CreateRes(IsRelease);
    }
    else {
      this.UpdateRes(IsRelease);
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
  }
  OpenResItemDialog(index, RFxItem:RFxItem) {
    var resDocs=this.ResODAttachment.filter(x=>x.Client==RFxItem.Client && x.Company==RFxItem.Company && x.DocumentTitle==RFxItem.Item);
    this.ResItemFiles.forEach(element => {
      if(resDocs.filter(x=>x.DocumentName==element.name).length>0){
        this.RespondedI[index].Attachments.push(element);
      }
    });
    const dialogRef = this.dialog.open(ResItemDialogComponent, {
      data: { data: RFxItem,Res:this.RespondedI[index].Item,Docs:this.ResODAttachment,DocFiles:this.RespondedI[index].Attachments },panelClass:"res-item-dialog"
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.RespondedI[index].isResponded = true;
        this.RespondedI[index].Item = res.data;
        this.RespondedI[index].Attachments=res.Attachments;
        this.RespondedI[index].Attachments.forEach(file => {
          if(this.FilesToUpload.filter(t=>t.name==file.name).length==0){
            this.FilesToUpload.push(file);
          }
        });
      }
    });
  }
  OpenResAnsDialog(item, index) {
    const dialogRef = this.dialog.open(ResAnsDialogComponent, {
      data: { data: item, data1: this.RespondedOD[index] }, panelClass:"res-answer-dialog"
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.RespondedOD[index].isResponded = true;
        this.RespondedOD[index].OD = res;
        console.log("respondedOD", this.RespondedOD);
      }
    });
  }
  CancelClicked(){
    this._router.navigate(['pages/responsehome']);
  }
  IsItemComplete():boolean{
    if(this.RespondedI.filter(x=>x.isResponded==false).length>0){
      return false;
    }
    return true;
  }
  IsODComplete():boolean{
    if(this.RespondedOD.filter(x=>x.isResponded==false).length>0){
      return false;
    }
    return true;
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
}

