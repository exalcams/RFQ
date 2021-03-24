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


@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
  RFxView:RFxView=new RFxView();
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
  RFxRemark:RFxRemark=new RFxRemark();
  EvaluationDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  ItemsDetailsDisplayedColumns: string[] = ['position', 'Item', 'Material', 'TotalQty', 'PerScheduleQty', 'Noofschedules', 'Uom', 'Incoterm', 'Action'];
  RatingDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'Description', 'Action'];
  PartnerDetailsDisplayedColumns: string[] = ['position', 'Type', 'Usertables', 'Action'];
  VendorDetailsDisplayedColumns: string[] = ['position', 'Vendor', 'Type', 'VendorName', 'GSTNo', 'City', 'Action'];
  ODDetailsDisplayedColumns: string[] = ['position', 'Question', 'Answertype', 'Action'];
  ODAttachDetailsDisplayedColumns: string[] = ['position', 'Documenttitle', 'Remark', 'Action'];
  EvaluationDetailsDataSource:MatTableDataSource<RFxHC>;
  ItemDetailsDataSource:MatTableDataSource<RFxItem>;
  // RatingDetailsDataSource=new BehaviorSubject<RFxVendorView[]>([]);
  PartnerDetailsDataSource:MatTableDataSource<RFxPartner>;
  VendorDetailsDataSource:MatTableDataSource<RFxVendorView>;
  ODDetailsDataSource:MatTableDataSource<RFxOD>;
  ODAttachDetailsDataSource:MatTableDataSource<RFxODAttachment>;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  RFxID: string=null;
  index: number;
  minDate = new Date();
  selectedIndex:number=0;
  Vendors:RFxVendor[]=[];
  FilesToUpload:File[]=[];
  RFxTypeMasters:MRFxType[]=[];
  RFxGroupMasters:MRFxGroup[]=[];
  isProgressBarVisibile:boolean;
  NewVendorMaser:MVendor[]=[];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _router:Router
    ) { 
      this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
      const retrievedObject = localStorage.getItem('authorizationData');
      console.log(retrievedObject);   
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
      this.Rfxheader.Client="01";
      this.Rfxheader.Company="Exa";
      this.index=0;
      this.InitializeRFxFormGroup();
      // this._route.queryParams.subscribe(params => {
      //   this.RFxID = params['id'];
      // });
      this.RFxID=localStorage.getItem('RFXID');
      if(this.RFxID){
        this.GetRFxs();   
      }
      this.GetRFQMasters();
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

  GetRFQMasters(){
    this.GetRFQTypeMaster();
    this.GetRFQGroupMaster();
  }

  GetRFQTypeMaster(){
    this._RFxService.GetAllRFxTypeM().subscribe(res=>{
      this.RFxTypeMasters=res as MRFxType[];
    });
  }

  GetRFQGroupMaster(){
    this._RFxService.GetAllRFxGroupM().subscribe(res=>{
      this.RFxGroupMasters=res as MRFxGroup[];
    })
  }

  CreateRfX(isRelease:boolean) {
    this.isProgressBarVisibile=true;
    this.RFxView.Client =this.Rfxheader.Client;
    this.RFxView.Company =this.Rfxheader.Company;
    this.RFxView.RFxType = this.RFxFormGroup.get("RfqType").value;
    this.RFxView.RFxGroup = this.RFxFormGroup.get("RfqGroup").value;
    this.RFxView.Title = this.RFxFormGroup.get("RfqTitle").value;
    this.RFxView.ValidityStartDate = this.RFxFormGroup.get("ValidityStartDate").value;
    this.RFxView.ValidityEndDate = this.RFxFormGroup.get("ValidityEndDate").value;
    this.RFxView.ResponseStartDate = this.RFxFormGroup.get("ResponseStartDate").value;
    this.RFxView.ResponseEndDate = this.RFxFormGroup.get("ResponseEndDate").value;
    this.RFxView.Currency = this.RFxFormGroup.get("Currency").value;
    if(isRelease){
      this.RFxView.Status="2";
    }
    else{
      this.RFxView.Status="1";
    }
    this.RFxView.RFxItems=this.ItemDetails;
    this.RFxView.RFxHCs=this.EvaluationDetails;
    this.RFxView.RFxICs=this.RatingDetails;
    this.RFxView.RFxPartners=this.PartnerDetails;
    this.RFxView.RFxVendors=this.Vendors;
    this.RFxView.RFxODs=this.ODDetails;
    this.RFxView.RFxODAttachments=this.ODAttachDetails;
    this.RFxRemark.Client=this.RFxView.Client;
    this.RFxRemark.Company=this.RFxView.Company;
    this.RFxView.RFxRemark=this.RFxRemark;
    console.log("rfxview",this.RFxView);
    this._RFxService.CreateRFx(this.RFxView)
      .subscribe(
        response => {
          console.log("response",response);
          this._RFxService.UploadRFxAttachment(response.RFxID,this.FilesToUpload).subscribe(x=>console.log("attachRes",x));
          if(isRelease){
            this.isProgressBarVisibile=false;
            this.notificationSnackBarComponent.openSnackBar('RFQ released successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
          else{ 
            this.notificationSnackBarComponent.openSnackBar('RFQ saved successfully', SnackBarStatus.success);
            this.isProgressBarVisibile=false;
            this._router.navigate(['pages/home']);
          }
        },
        error => {
          this.isProgressBarVisibile=false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
  UpdateRFx(isRelease:boolean){
    this.isProgressBarVisibile=true;
      this.RFxView.Client =this.Rfxheader.Client;
      this.RFxView.Company =this.Rfxheader.Company;
      this.RFxView.RFxID=this.RFxID;
      this.RFxView.Plant=this.Rfxheader.Plant;
      this.RFxView.RFxType = this.RFxFormGroup.get("RfqType").value;
      this.RFxView.RFxGroup = this.RFxFormGroup.get("RfqGroup").value;
      if(isRelease){
        this.RFxView.Status="2";
      }
      else{
        this.RFxView.Status="1";
      }
      this.RFxView.Title = this.RFxFormGroup.get("RfqTitle").value;
      this.RFxView.ValidityStartDate = this.RFxFormGroup.get("ValidityStartDate").value;
      this.RFxView.ValidityEndDate = this.RFxFormGroup.get("ValidityEndDate").value;
      this.RFxView.ResponseStartDate = this.RFxFormGroup.get("ResponseStartDate").value;
      this.RFxView.ResponseEndDate = this.RFxFormGroup.get("ResponseEndDate").value;
      this.RFxView.Currency = this.RFxFormGroup.get("Currency").value;
      this.RFxView.Invited=this.Rfxheader.Invited;
      this.RFxView.Responded=this.Rfxheader.Responded;
      this.RFxView.Evaluated=this.Rfxheader.Evaluated;
      this.RFxView.ReleasedOn=this.Rfxheader.ReleasedOn;
      this.RFxView.ReleasedBy=this.Rfxheader.ReleasedBy;
      this.RFxView.RFxItems=this.ItemDetails;
      this.RFxView.RFxHCs=this.EvaluationDetails;
      this.RFxView.RFxICs=this.RatingDetails;
      this.RFxView.RFxPartners=this.PartnerDetails;
      this.RFxView.RFxVendors=this.Vendors;
      this.RFxView.RFxODs=this.ODDetails;
      this.RFxView.RFxODAttachments=this.ODAttachDetails;
      this.RFxRemark.Client=this.RFxView.Client;
      this.RFxRemark.Company=this.RFxView.Company;
      this.RFxView.RFxRemark=this.RFxRemark;
      console.log("rfxview",this.RFxView);
      this._RFxService.UpdateRFx(this.RFxView)
      .subscribe(
        response => {
          console.log("response",response);
          this._RFxService.UploadRFxAttachment(response.RFxID,this.FilesToUpload).subscribe(x=>console.log("attachRes",x));
          if(isRelease){
            this.isProgressBarVisibile=false;
            this.notificationSnackBarComponent.openSnackBar('RFQ released successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
          else{
            this.isProgressBarVisibile=false;
            this.notificationSnackBarComponent.openSnackBar('RFQ saved successfully', SnackBarStatus.success);
            this._router.navigate(['pages/home']);
          }
        },
        error => {
          this.isProgressBarVisibile=false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
  }
  tabClick(tab:any) {
    this.index=parseInt(tab.index);
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

  GetRFxHsByRFxID(RFxID:string): void {
    this.isProgressBarVisibile=true;
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
          if(this.Rfxheader.Status=="2"){
            this.RFxFormGroup.disable();
          }
        }
        this.isProgressBarVisibile=false;
      }
    );
  }
  GetRFxHCsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxHCsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.EvaluationDetails = <RFxHC[]>data;
          this.EvaluationDetailsDataSource=new MatTableDataSource(this.EvaluationDetails);
        }
      }
    );
  }
  GetRFxItemsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxItemsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ItemDetails = <RFxItem[]>data;
          this.ItemDetailsDataSource=new MatTableDataSource(this.ItemDetails);
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
  GetRFxPartnersByRFxID(RFxID:string): void {
    this._RFxService.GetRFxPartnersByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.PartnerDetails = <RFxPartner[]>data;
          this.PartnerDetailsDataSource=new MatTableDataSource(this.PartnerDetails);
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
      this.VendorDetailsDataSource=new MatTableDataSource(this.VendorDetails);
    });
  }
  GetRFxODsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxODsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODDetails = <RFxOD[]>data;
          this.ODDetailsDataSource=new MatTableDataSource(this.ODDetails);
        }
      }
    );
  }
  GetRFxODAttachmentsByRFxID(RFxID:string): void {
    this._RFxService.GetRFxODAttachmentsByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.ODAttachDetails = <RFxODAttachment[]>data;
          this.ODAttachDetailsDataSource=new MatTableDataSource(this.ODAttachDetails);
        }
      }
    );
  }
  GetRFxRemarkByRFxID(RFxID:string){
    this._RFxService.GetRFxRemarkByRFxID(RFxID).subscribe((data)=>{
      if(data){
        this.RFxRemark=<RFxRemark>data;
        //console.log(this.RFxRemark);
      }
    })
  }

  CreateCriteria(){
    var Criteria=new RFxHC();
    Criteria.Client=this.Rfxheader.Client;
    Criteria.Company=this.Rfxheader.Company;
    this.OpenCriteriaDialog(Criteria,true);
  }
  CreateItem(){
    var Item=new RFxItem();
    Item.RFxID=this.Rfxheader.RFxID;
    Item.Client=this.Rfxheader.Client;
    Item.Company=this.Rfxheader.Company;
    this.OpenItemDialog(Item,true);
  }
  CreatePartner(){
    var Partner=new RFxPartner();
    Partner.Client=this.Rfxheader.Client;
    Partner.Company=this.Rfxheader.Company;
    this.OpenPartnerDialog(Partner,true);
  }
  CreateVendor(){
    var Vendor=new RFxVendorView();
    Vendor.Client=this.Rfxheader.Client;
    Vendor.Company=this.Rfxheader.Company;
    this.OpenVendorDialog(Vendor);
  }
  CreateQuestion(){
    var Question=new RFxOD();
    Question.Client=this.Rfxheader.Client;
    Question.Company=this.Rfxheader.Company;
    this.OpenQuestionDialog(Question,true);
  }
  CreateDocument(){
    var Document=new RFxODAttachment();
    Document.RFxID=this.Rfxheader.RFxID;
    Document.Client=this.Rfxheader.Client;
    Document.Company=this.Rfxheader.Company;
    this.OpenDocumentDialog(Document,true);
  }

  OpenCriteriaDialog(Criteria:RFxHC,bool:boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialogComponent, {
      data: {data:Criteria,isCreate:bool}, height: '40%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.isCreate){
        this.EvaluationDetails.push(res.data);
        this.EvaluationDetailsDataSource=new MatTableDataSource(this.EvaluationDetails);
      }
    });
  }
  OpenItemDialog(Item:RFxItem,bool:boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog2Component, {
      data: {data:Item,isCreate:bool}, height: '82%',
      width: '82%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.isCreate){
        this.ItemDetails.push(res.data);
        this.ItemDetailsDataSource=new MatTableDataSource(this.ItemDetails);
      }
      this.FilesToUpload.push(res.Attachments);
    });
  }
  OpenPartnerDialog(Partner:RFxPartner,bool:boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog3Component, {
      data: {data:Partner,isCreate:bool}, height: '43%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.isCreate){
        this.PartnerDetails.push(res.data);
        this.PartnerDetailsDataSource=new MatTableDataSource(this.PartnerDetails);
      }
    });
  }
  OpenVendorDialog(Vendor:RFxVendorView) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog4Component, {
      data: {data:Vendor}, height: '90%',
      width: '40%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      console.log(res);
      if(res){
        this.VendorDetails.push(res.data);
        this.Vendors=[];
        this.VendorDetails.forEach(element => {
          var rfxVendor=new RFxVendor();
          rfxVendor.Client=this.Rfxheader.Client;
          rfxVendor.Company=this.Rfxheader.Company;
          rfxVendor.PatnerID=element.PatnerID;
          this.Vendors.push(rfxVendor);
        });
        this.NewVendorMaser.push(res.vendor);
        this.VendorDetailsDataSource=new MatTableDataSource(this.VendorDetails);
      }
    });
  }
  OpenSelectVendorDialog(vendors:RFxVendorView[]) {
    const dialogRef = this.dialog.open(SelectVendorDialogComponent, {
      data: {data:vendors}, height: '80%',
      width: '40%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      console.log(res);
      if(res){
        this.VendorDetails=res.data;
        this.Vendors=[];
        this.VendorDetails.forEach(element => {
          var rfxVendor=new RFxVendor();
          rfxVendor.Client=this.Rfxheader.Client;
          rfxVendor.Company=this.Rfxheader.Company;
          rfxVendor.PatnerID=element.PatnerID;
          this.Vendors.push(rfxVendor);
        });
        this.VendorDetailsDataSource=new MatTableDataSource(this.VendorDetails);
      }
    });
  }
  OpenQuestionDialog(Question:RFxOD,bool:boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog5Component, {
      data: {data:Question,isCreate:bool}, height: '44%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.isCreate){
        this.ODDetails.push(res.data);
        this.ODDetailsDataSource=new MatTableDataSource(this.ODDetails);
      }
    });
  }
  OpenDocumentDialog(Document:RFxODAttachment,bool:boolean) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog7Component, {
      data: {data:Document,isCreate:bool}, height: '52%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res=>{
      console.log(res);
      if(res && res.isCreate){
        this.ODAttachDetails.push(res.data);
        this.ODAttachDetailsDataSource=new MatTableDataSource(this.ODAttachDetails);
      }
      if(this.FilesToUpload.indexOf(res.Attachments)>=0){
        this.FilesToUpload[this.FilesToUpload.indexOf(res.Attachments)]=res.Attachments;
      }
      else{
        this.FilesToUpload.push(res.Attachments);
      }
      console.log(this.FilesToUpload);
    });
  }
  ShowValidationErrors(formGroup:FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }

  NextClicked(index: number): void {
    if(index==0 && !this.RFxFormGroup.valid && this.Rfxheader.RFxID==null){
      this.ShowValidationErrors(this.RFxFormGroup);
    }
    else if(index==0){
      this.Rfxheader.Status="1";
      this.selectedIndex=index+1;
    }
    if(index==1 && this.EvaluationDetails.length==0){}
    else if(index==2 && this.ItemDetails.length==0){}
    else if(index==3 && this.PartnerDetails.length==0){}
    else if(index==4 && this.VendorDetails.length==0){}
    else if(index==5 && this.ODDetails.length==0 && this.ODAttachDetails.length==0){}
    else if(index!=0){
      this.selectedIndex=index+1;
    }
  }
  PreviousClicked(index: number): void {
    this.selectedIndex=index-1;
  }
  SaveRFxClicked(isRelease:boolean){
    if(this.Rfxheader.Status=="1" && this.EvaluationDetails.length>0 && this.ItemDetails.length>0 && this.PartnerDetails.length>0 && this.VendorDetails.length>0 && this.ODDetails.length>0 && this.ODAttachDetails.length>0){
      if(this.NewVendorMaser.length>0){
        this._RFxService.AddtoVendorTable(this.NewVendorMaser).subscribe(res=>{
          console.log("vendor created");
        },err=>{console.log("vendor master not created!;")});
      }
      if(!this.RFxID){
        this.CreateRfX(isRelease);
      }
      else{
        this.UpdateRFx(isRelease);
      }
    }
    else{
      this.notificationSnackBarComponent.openSnackBar('Please complete all steps', SnackBarStatus.danger);
    }
  }
  DeleteCriteria(index){
    this.EvaluationDetails.splice(index,1);
    this.EvaluationDetailsDataSource=new MatTableDataSource(this.EvaluationDetails);
  }
  DeleteItem(index){
    this.ItemDetails.splice(index,1);
    this.ItemDetailsDataSource=new MatTableDataSource(this.ItemDetails);
  }
  DeletePartner(index){
    this.PartnerDetails.splice(index,1);
    this.PartnerDetailsDataSource=new MatTableDataSource(this.PartnerDetails);
  }
  DeleteVendor(index){
    this.VendorDetails.splice(index,1);
    this.VendorDetailsDataSource=new MatTableDataSource(this.VendorDetails);
  }
  DeleteQuetion(index){
    this.ODDetails.splice(index,1);
    this.ODDetailsDataSource=new MatTableDataSource(this.ODDetails);
  }
  DeleteAttachment(index){
    this.ODAttachDetails.splice(index,1);
    this.ODAttachDetailsDataSource=new MatTableDataSource(this.ODAttachDetails);
  }
  GetAnswerType(type){
    if(type==1){
      return "Text box";
    }
    else if(type==2){
      return "Yes/No";
    }
    else if(type==3){
      return "Long text"
    }
  }
}
