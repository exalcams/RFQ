import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ByCriteria, ByMaterial, EvaluationRating, ResHeader, RFxAward, RFxCECriteria, RFxCEMaterial, RFxCEPartner, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit {
  @ViewChild(MatPaginator) EvalPaginator: MatPaginator;
  @ViewChild(MatSort) EvalSort: MatSort;
  RFxID: string = null;
  EvaluationRating: EvaluationRating[] = [];
  AwardFormGroup: FormGroup;
  HeaderDetailsDisplayedColumns: string[] = ['position', 'PartnerID', 'Rating'];
  MaterialDetailsDisplayedColumns: string[] = ['position', 'Material', 'BestSupplier'];
  CriteriaDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'BestSupplier'];
  authenticationDetails: AuthenticationDetails;
  HeaderDetailsDataSource: MatTableDataSource<EvaluationRating>;
  MaterialDetailsDataSource: MatTableDataSource<ByMaterial>;
  CriteriaDetailsDataSource: MatTableDataSource<ByCriteria>;
  AllEvalRatingDetails: any = [];
  AllMaterialDetails: any = [];
  AllCriteriaDetails: any = [];
  isProgressBarVisibile: boolean;
  SelectedVendor :string = "";
  BestSupplier : string = "";
  BestSupplier1: string = "";
  value: number = 1;
  Rfxheader: RFxHeader = new RFxHeader();
  Responses:ResHeader = new ResHeader();
  RFxAward:RFxAward=new RFxAward();
  RFxCEPartner:RFxCEPartner = new RFxCEPartner();
  RFxCEMaterial: RFxCEMaterial = new RFxCEMaterial();
  RFxCECriteria: RFxCECriteria = new RFxCECriteria();
  selection = new SelectionModel<EvaluationRating>(true, []);
  isHightlight: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  currentUserID: any;
  currentUserName: string;
  AllResponseDetails: any = [];
  rating:string = "";
  material : string = "";
  criteria  : string = "";
  Click:number=0;

  constructor(private _RFxService: RFxService, private _route: ActivatedRoute,private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private _router: Router) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit() {
    const retrievedObject = localStorage.getItem("authorizationData");
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(
        retrievedObject
      ) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
    }
    this.RFxID = localStorage.getItem('E_RFXID');
    this.GetEvalRatingByID(this.RFxID);
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetMaterialByVendor(this.RFxID);
    this.GetCriteriaByVendor(this.RFxID);
    this.GetAllResponses();
    this.InitializeRFxFormGroup();
  }
  GetAllResponses(): void {
    this._RFxService.GetResponseByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.Responses = data as ResHeader;  
          console.log("responses",this.Responses);  
        }
      }
    )
  }
  GetRFxHsByRFxID(RFxID: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
      (data) => {
        if (data) {
          this.Rfxheader = data as RFxHeader;
        }
      }
    );
  }
  
  InitializeRFxFormGroup(): void {
    this.AwardFormGroup = this._formBuilder.group({
      Remark:  ['', [Validators.required]],
      Reason: ['', [Validators.required]],
    });
  }
  GetEvalRatingByID(RFxID: string): void {
    this._RFxService.GetEvalRatingByID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllEvalRatingDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllEvalRatingDetails);
        }
      })
  }

  AwardClicked(isRelease: boolean) {
    this.CreateAward(isRelease);
  }

  CreateAward(isRelease: boolean) {

    this.isProgressBarVisibile = true;
    this.RFxAward.Client = this.Rfxheader.Client;
    this.RFxAward.Company = this.Rfxheader.Company;
    this.RFxAward.RFxID = this.RFxID;
    this.RFxAward.AwardedBy = this.currentUserName;
    this.RFxAward.PartnerID = this.Responses.PartnerID;
    this.RFxAward.RESID = this.Responses.RESID;
    this.RFxAward.Reason =this.AwardFormGroup.get('Reason').value;
    this.RFxAward.Remark = this.AwardFormGroup.get('Remark').value;

    this._RFxService.CreateAward(this.RFxAward).subscribe(x => {
      this.isProgressBarVisibile = false;
      console.log(this.RFxAward); 
    })
    
    if (isRelease) {
      this._RFxService.UpdateHeaderStatus(this.RFxID, "6").subscribe(x => {
        this.isProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(' Awarded successfully', SnackBarStatus.success);
        this._router.navigate(['pages/awardhome']);
      },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
    }
    this.CreateCEPartner();
    this.CreateCEMatrial();
    this.CreateCECriteria();

    // else {
    //   this.isProgressBarVisibile = false;
    //   this.notificationSnackBarComponent.openSnackBar('Awarded successfully', SnackBarStatus.success);
    // }
  }
  CreateCEPartner() {
    this.RFxCEPartner.Client = this.Rfxheader.Client;
    this.RFxCEPartner.Company = this.Rfxheader.Company;
    this.RFxCEPartner.RFxID = this.RFxID;
    this.RFxCEPartner.PartnerID = this.SelectedVendor;
    this.RFxCEPartner.Rating = this.rating;

    this._RFxService.CreateCEPartner(this.RFxCEPartner).subscribe(x =>{
      console.log(this.RFxCEPartner);
    })
  }

  CreateCEMatrial() {
    this.RFxCEMaterial.Client = this.Rfxheader.Client;
    this.RFxCEMaterial.Company = this.Rfxheader.Company;
    this.RFxCEMaterial.RFxID = this.RFxID;
    this.RFxCEMaterial.BestSupplier = this.BestSupplier;
    this.RFxCEMaterial.Material = this.material;

    this._RFxService.CreateCEMaterial(this.RFxCEMaterial).subscribe(x=> {
      console.log(this.RFxCEMaterial);
      
    })
  }

  CreateCECriteria() {
    this.RFxCECriteria.Client = this.Rfxheader.Client;
    this.RFxCECriteria.Company = this.Rfxheader.Company;
    this.RFxCECriteria.RFxID = this.RFxID;
    this.RFxCECriteria.BestSupplier = this.BestSupplier1;
    this.RFxCECriteria.Criteria = this.criteria;

    this._RFxService.CreateCECriteria(this.RFxCECriteria).subscribe(x=>{
      console.log(this.RFxCECriteria);
    })
  }
  GetMaterialByVendor(RFxID: string): void {
    this._RFxService.GetMaterialByVendor(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllMaterialDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadMaterialTableSource(this.AllMaterialDetails);
        }
      })
  }

  GetCriteriaByVendor(RFxID: string): void {
    this._RFxService.GetCriteriaByVendor(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllCriteriaDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadCriteriaTableSource(this.AllCriteriaDetails);
        }
      }
    )
  }
  TableHighlight(row: EvaluationRating) {
    this.SelectedVendor = row.PartnerID;
    this.rating = row.Rating.toString();  
    console.log(this.SelectedVendor,this.rating);
      
  }
  TableHighlight2(row: ByMaterial) {
    this.BestSupplier = row.BestSupplier;
    this.material = row.Material;
    console.log(this.BestSupplier,this.material);
  }
  TableHighlight3(row: ByCriteria) {
    this.BestSupplier1 = row.BestSupplier;
    this.criteria = row.Criteria;
    console.log(this.BestSupplier1,this.criteria);
    this.Click=3;
  }
  LoadCriteriaTableSource(DataArray: any[]) {
    this.CriteriaDetailsDataSource = new MatTableDataSource(DataArray);
    this.CriteriaDetailsDataSource.paginator = this.EvalPaginator;
    this.CriteriaDetailsDataSource.sort = this.EvalSort;
  }

  LoadMaterialTableSource(DataArray: any[]) {
    this.MaterialDetailsDataSource = new MatTableDataSource(DataArray);
    this.MaterialDetailsDataSource.paginator = this.EvalPaginator;
    this.MaterialDetailsDataSource.sort = this.EvalSort;
  }

  LoadTableSource(DataArray: any[]) {
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator = this.EvalPaginator;
    this.HeaderDetailsDataSource.sort = this.EvalSort;
  }

  TableVendor(): void {
    this.value = 1;
  }

  TableMaterial(): void {
    this.value = 2;
  }

  TableEvaluation(): void {
    this.value = 3;
  }

  onRate($event: { oldValue: number, newValue: number }, index: any) {
    this.AllEvalRatingDetails[index].Rating = $event.newValue.toString();
  }
}
