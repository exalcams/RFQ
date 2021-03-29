import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader, MRFxType, MRFxGroup, RFxHC, RFxItem, ResItem, RFxRemark, RFxPartner, RFxVendorView, RFxODAttachment, EvalHC, EvalIC, EvaluatedICs, EvalHeader, ResODView, EvaluationView, EvalCriteriaView } from 'app/models/RFx';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';
import { EvaItemDialogComponent } from '../eva-item-dialog/eva-item-dialog.component';
import { ResItemDialogComponent } from '../response/response-dialogs/res-item-dialog/res-item-dialog.component';

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
  EvalHCViews:EvalCriteriaView[]=[];
  RFxFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  Rfxheader: RFxHeader = new RFxHeader();
  EvalHeader:EvalHeader=new EvalHeader();
  RFxTypeMasters: MRFxType[] = [];
  RFxGroupMasters: MRFxGroup[] = [];
  HeaderDetails: RFxHeader[] = [];
  EvaluationDetails: RFxHC[] = [];
  EvalHcs:EvalHC[]=[];
  EvalIcs:EvalIC[]=[];
  ResItem:ResItem[]=[];
  EvaluatedICs:EvaluatedICs[]=[];
  ItemDetails: RFxItem[] = [];
  ODDetails: ResODView[] = [];
  ODAttachDetails:RFxODAttachment[]=[];
  RFxRemark: RFxRemark = new RFxRemark();
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description','Action'];
  ItemsDetailsDisplayedColumns: string[] = ['position', 'Item', 'Material', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['position', 'Question', 'Answer'];
  ODAttachDetailsDisplayedColumns: string[] = ['position', 'Documenttitle', 'Remark'];
  EvaluationDetailsDataSource: MatTableDataSource<RFxHC>;
  ItemDetailsDataSource: MatTableDataSource<RFxItem>;
  PartnerDetailsDataSource: MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource: MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource: MatTableDataSource<ResODView>;
  ODAttachDetailsDataSource:MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string = null;
  RESID: string = null;
  index: number = 0;
  minDate = new Date();
  selectedIndex: number = 0;

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
    this.GetRFxItemsByRFxID(this.RFxID);
    this.GetResItem(this.RESID);
    this.GetResODViewssByRFxID(this.RESID);
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
            criteria.Rating="0";
            this.EvalHcs.push(criteria);
            var hcview=new EvalCriteriaView();
            hcview.CriteriaID=element.CriteriaID;
            hcview.Text=element.Text;
            hcview.Rating="0";
            this.EvalHCViews.push(hcview);
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
          this.ItemDetails.forEach(item => {
            var EIC=new EvaluatedICs();
            EIC.isEvaluated=false;
            EIC.IC=[];
            this.EvaluatedICs.push(EIC);
          });
        }
      }
    );
  }

  GetResODViewssByRFxID(RESID: string): void {
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
        this.GetEvalHCs(this.EvalHeader.EvalID);
        this.GetEvalICs(this.EvalHeader.EvalID);
      }
    });
  }

  GetEvalHCs(EvalID:string){
    this._RFxService.GetEvalHCsByID(EvalID).subscribe(data=>{
      if(data){
        this.EvalHcs=<EvalHC[]>data;
        for (let index = 0; index < this.EvalHcs.length; index++) {
          this.EvalHCViews[index].Rating=this.EvalHcs[index].Rating;
        }
      }
    });
  }
  GetEvalICs(EvalID:string){
    this._RFxService.GetEvalICsByID(EvalID).subscribe(data=>{
      if(data){
        this.EvalIcs=<EvalIC[]>data;
        this.EvaluatedICs=[];
        this.ItemDetails.forEach(evalIC => {
          var EItem=new EvaluatedICs();
          EItem.IC=this.EvalIcs.filter(x=>x.Item==evalIC.Item);
          EItem.isEvaluated=true;
          this.EvaluatedICs.push(EItem);
        });
      }
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
  
  tabClick(tab: any) {
    this.index = parseInt(tab.index);
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
    this.EvalView.EvalRemarks=null;
    this.EvalView.EvalHCs=this.EvalHcs;
    this.EvalView.EvalICs=[];
    this.EvaluatedICs.forEach(EICs => {
      if(EICs.isEvaluated){
        this.EvalView.EvalICs=this.EvalView.EvalICs.concat(EICs.IC);
      }
    });
    console.log(this.EvalView);
    this._RFxService.CreateEvaluation(this.EvalView).subscribe((response)=>{
      console.log("response",response);
      if(isRelease){
        this._RFxService.UpdateHeaderStatus(this.RFxID,"5").subscribe(x=>{
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Evaluation Released successfully', SnackBarStatus.success);
          this._router.navigate(['pages/evaluationresponse']);
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
      }
      else{
        this.isProgressBarVisibile = false;
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
    this.EvalView.EvalRemarks=null;
    this.EvalView.EvalHCs=this.EvalHcs;
    this.EvalView.EvalICs=[];
    this.EvaluatedICs.forEach(EICs => {
      if(EICs.isEvaluated){
        this.EvalView.EvalICs=this.EvalView.EvalICs.concat(EICs.IC);
      }
    });
    console.log(this.EvalView);
    this._RFxService.UpdateEvaluation(this.EvalView).subscribe((response)=>{
      console.log("response",response);
      if(isRelease){
        this._RFxService.UpdateHeaderStatus(this.RFxID,"5").subscribe(x=>{
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Evaluation Released successfully', SnackBarStatus.success);
          this._router.navigate(['pages/evaluationresponse']);
        },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
      }
      else{
        this.isProgressBarVisibile = false;
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

  OpenEvaItemDialog(item:RFxItem, index) {
    var resItem=this.ResItem.filter(x=>x.Item==item.Item && x.Client==item.Client && x.Company==item.Company);
    var EvalICs=this.EvaluatedICs[index].IC;
    console.log("opening",this.EvaluatedICs);
    const dialogRef = this.dialog.open(EvaItemDialogComponent, {
      data: { RFxItem:item,ResItem:resItem[0],EvalHCs:this.EvalHCViews,EvalIC:EvalICs}, height: '90%',
      width: '82%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.EvaluatedICs[index].IC=<EvalIC[]>res;
        this.EvaluatedICs[index].isEvaluated=true;
      }
    });
  }

  onRate($event:{oldValue:number, newValue:number},index:any) {
    this.EvalHcs[index].Rating=$event.newValue.toString();
    this.EvalHCViews[index].Rating=$event.newValue.toString();
  }

  CancelClicked(){
    this._router.navigate(['pages/evaluationresponse']);
  }
}
