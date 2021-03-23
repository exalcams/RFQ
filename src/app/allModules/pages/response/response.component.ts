import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RFxHeader, RFxHC, RFxItem, RFxPartner, RFxOD, RFxVendorView, MRFxGroup, MRFxType, ResponseView, RespondedItems, ResItem, RespondedODs, ResOD, ResHC, ResHeader, ResODAttachment, RespondedODAttachments, RFxRemark, RFxODAttachment } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ResItemDialogComponent } from './response-dialogs/res-item-dialog/res-item-dialog.component';
import { ResAnsDialogComponent } from './response-dialogs/res-ans-dialog/res-ans-dialog.component';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
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
  EvaluationDetails: RFxHC[] = [];
  ItemDetails: RFxItem[] = [];
  ODDetails: RFxOD[] = [];
  ResH: ResHeader = new ResHeader();
  ResI: ResItem[] = [];
  ResHC: ResHC[] = [];
  ResOD: ResOD[] = [];
  ResODAttachment: ResODAttachment[] = [];
  // ResAttachment: ResODAttachment[] = [];
  RFxRemark: RFxRemark = new RFxRemark();
  ResRemarks: string;
  RespondedI: RespondedItems[] = [];
  RespondedOD: RespondedODs[] = [];
  RespondedAttachment: RespondedODAttachments[] = [];
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description'];
  ItemsDetailsDisplayedColumns: string[] = ['position', 'Item', 'Material', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['position', 'Question', 'Answertype', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['position', 'Documenttitle', 'Remark'];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  PartnerDetailsDataSource: MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource: MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource: MatTableDataSource<RFxOD>;
  // ODAttachDetailsDataSource: MatTableDataSource<ResODAttachment>;
  ODAttachDetailsDataSource:MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string = null;
  index: number = 0;
  minDate = new Date();
  selectedIndex: number = 0;
  FilesToUpload: File[] = [];
  ODAttachDetails: RFxODAttachment[] = [];

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
    // this._route.queryParams.subscribe(params => {
    //   this.RFxID = params['id'];
    // });
    this.RFxID=localStorage.getItem('ResID');
    this.GetRFxs();
    this.GetResH(this.RFxID, this.currentUserName);
    this.GetRFQMasters();
    this.RFxFormGroup.disable();
  }

  GetRFxs(): void {
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetRFxHCsByRFxID(this.RFxID);
    this.GetRFxItemsByRFxID(this.RFxID);
    this.GetRFxODsByRFxID(this.RFxID);
    this.GetRFxODAttachmentsByRFxID(this.RFxID);
    this.GetRFxRemarkByRFxID(this.RFxID);
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
  GetResOD(ResID: string) {
    this._RFxService.GetResponseODsByResponseID(ResID).subscribe(data => {
      this.ResOD = <ResOD[]>data;
      if (this.ResOD.length != 0) {
        this.RespondedOD = [];
        this.ResOD.forEach(element => {
          var resItem = new RespondedODs();
          resItem.OD = element;
          resItem.OD.QuestionID = undefined;
          resItem.isResponded = true;
          this.RespondedOD.push(resItem);
        });
      }
    });
  }
  GetResODAttachments(ResID: string) {
    this._RFxService.GetResponseODAttachmentsByResponseID(ResID).subscribe(data => {
      this.ResODAttachment = <ResODAttachment[]>data;
      
    });
  }


  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RfqType: ['', [Validators.required]],
      RfqGroup: ['', [Validators.required]],
      RfqTitle: ['', [Validators.required]],
      ValidityStartDate: ['', [Validators.required]],
      ValidityEndDate: ['', [Validators.required]],
      ResponseStartDate: ['', [Validators.required]],
      ResponseEndDate: ['', [Validators.required]],
      Currency: ['', [Validators.required]],
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

  // CreateDocument() {
  //   var Document = new ResODAttachment();
  //   Document.RFxID = this.RFxID;
  //   Document.Client = this.Rfxheader.Client;
  //   Document.Company = this.Rfxheader.Company;
  //   this.OpenResDocumentDialog(Document, true);
  // }

  CreateRes() {
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
    this.ResH.ItemResponded = RICount.toString();
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
    console.log("resview", this.ResView);
    this._RFxService.CreateResponse(this.ResView)
      .subscribe(
        response => {
          console.log("response", response);
          this.isProgressBarVisibile = false;
          this._router.navigate(['pages/responsehome']);
          this.notificationSnackBarComponent.openSnackBar('Res saved successfully', SnackBarStatus.success);
          this._RFxService.UploadResAttachment(response.RESID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false
        });
  }
  UpdateRes() {
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
    this.ResH.ItemResponded = RICount.toString();
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
    console.log("resview", this.ResView);
    this._RFxService.UpdateResponse(this.ResView)
      .subscribe(
        response => {
          // console.log("response", response);
          this.isProgressBarVisibile = false;
          this._RFxService.UploadResAttachment(response.RESID, this.FilesToUpload).subscribe(x => console.log("attachRes", x));
          this.notificationSnackBarComponent.openSnackBar('Res saved successfully', SnackBarStatus.success);
          this._router.navigate(['pages/responsehome']);
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false
        });
  }
  tabClick(tab: any) {
    this.index = parseInt(tab.index);
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
          // console.log("attachs",this.ODAttachDetails);
          this.ODAttachDetailsDataSource = new MatTableDataSource(this.ODAttachDetails);
        }
      }
    );
  }

  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }

  NextClicked(index: number): void {
    // if(index==0 && !this.RFxFormGroup.valid && this.Rfxheader.RFxID==null){
    //   this.ShowValidationErrors(this.RFxFormGroup);
    // }
    // else if(index==0){
    //   this.Rfxheader.Status="1";
    //   this.selectedIndex=index+1;
    // }
    // if(index==1 && this.EvaluationDetails.length==0){}
    // else if(index==2 && this.ItemDetails.length==0){}
    // else if(index==3 && this.ODDetails.length==0){}
    // else if(index!=0){
    //   this.selectedIndex=index+1;
    // }
    this.selectedIndex = index + 1;
  }
  PreviousClicked(index: number): void {
    this.selectedIndex = index - 1;
  }
  SaveResClicked() {
    if (!this.ResH.RESID) {
      this.CreateRes();
    }
    else {
      this.UpdateRes();
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
  OpenResItemDialog(index, RFxItem) {
    const dialogRef = this.dialog.open(ResItemDialogComponent, {
      data: { data: RFxItem,Res:this.RespondedI[index].Item,Docs:this.ResODAttachment }, height: '90%',
      width: '82%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.RespondedI[index].isResponded = true;
        this.RespondedI[index].Item = res.data;
        this.ResODAttachment=[];
        this.FilesToUpload=[];
        res.Attachments.forEach(element => {
          this.FilesToUpload.push(element);
        });
        res.Docs.forEach(element => {
          this.ResODAttachment.push(element);
        });
      }
    });
  }
  OpenResAnsDialog(item, index) {
    const dialogRef = this.dialog.open(ResAnsDialogComponent, {
      data: { data: item, data1: this.RespondedOD[index] }, height: '44%',
      width: '44%'
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

  // OpenResDocumentDialog(Document: ResODAttachment, bool: boolean) {
  //   const dialogRef = this.dialog.open(ResAttachDialogComponent, {
  //     data: { data: Document, isCreate: bool }, height: '52%',
  //     width: '50%'
  //   });
  //   dialogRef.disableClose = true;
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res && res.isCreate) {
  //       this.ResAttachment.push(res.data);
  //       this.ODAttachDetailsDataSource = new MatTableDataSource(this.ResAttachment);
  //     }
  //     this.FilesToUpload.push(res.Attachments);
  //   });
  // }
  // DeleteAttachment(index) {
  //   this.ResAttachment.splice(index, 1);
  //   this.ODAttachDetailsDataSource = new MatTableDataSource(this.ResAttachment);
  // }
}
