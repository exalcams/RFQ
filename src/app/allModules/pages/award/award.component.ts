import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ByCriteria, ByMaterial, EvaluationRating, PartnerWithRating, ResHeader, RFxAward, RFxCECriteria, RFxCEMaterial, RFxCEPartner, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'app-award',
  templateUrl: './award-new.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit {
  @ViewChild(MatPaginator) EvalPaginator: MatPaginator;
  @ViewChild(MatSort) EvalSort: MatSort;
  RFxID: string = null;
  EvaluationRating: EvaluationRating[] = [];
  AwardFormGroup: FormGroup;
  HeaderDetailsDisplayedColumns: string[] = [ 'PartnerID', 'Rating'];
  MaterialDetailsDisplayedColumns: string[] = [ 'Material', 'BestSupplier'];
  CriteriaDetailsDisplayedColumns: string[] = [ 'Criteria', 'BestSupplier'];
  authenticationDetails: AuthenticationDetails;
  HeaderDetailsDataSource: MatTableDataSource<EvaluationRating>;
  MaterialDetailsDataSource: MatTableDataSource<ByMaterial>;
  CriteriaDetailsDataSource: MatTableDataSource<ByCriteria>;
  AllEvalRatingDetails: any = [];
  AllMaterialDetails: any = [];
  AllCriteriaDetails: any = [];
  isProgressBarVisibile: boolean;
  SelectedVendor: string ;
  selectedRESID:string;
  value: number = 1;
  Rfxheader: RFxHeader = new RFxHeader();
  Responses: ResHeader = new ResHeader();
  RFxAward: RFxAward = new RFxAward();
  VendorRating: PartnerWithRating = new PartnerWithRating();
  RFxCEPartner: RFxCEPartner[] = [];
  RFxCEMaterial: RFxCEMaterial[] = [];
  RFxCECriteria: RFxCECriteria[] = [];
  selection = new SelectionModel<EvaluationRating>(true, []);
  isHightlight: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  currentUserID: any;
  currentUserName: string;
  AllResponseDetails: any = [];
  rating: string = "";
  material: string = "";
  criteria: string = "";
  Click: boolean = false;

  constructor(private _RFxService: RFxService, private _route: ActivatedRoute, private _formBuilder: FormBuilder,
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
          console.log("responses", this.Responses);
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
      Remarks: ['', [Validators.required]],
      Reason: ['', [Validators.required]],
    });
  }

  AwardClicked() {
    if (this.AwardFormGroup.valid) {
      this.CreateAward();
    }
    else {
      this.ShowValidationErrors(this.AwardFormGroup);
    }
  }
  CancelClicked(){
    this._router.navigate(['pages/awardhome']);
  }
  CreateAward() {
    this.isProgressBarVisibile = true;
    this.RFxAward.Client = this.Rfxheader.Client;
    this.RFxAward.Company = this.Rfxheader.Company;
    this.RFxAward.RFxID = this.RFxID;
    this.RFxAward.AwardedBy = this.currentUserName;
    this.RFxAward.PartnerID = this.SelectedVendor;
    this.RFxAward.RESID = this.selectedRESID;
    this.RFxAward.Reason = this.AwardFormGroup.get('Reason').value;
    this.RFxAward.Remarks = this.AwardFormGroup.get('Remarks').value;

    this._RFxService.CreateAward(this.RFxAward).subscribe(x => {
      this._RFxService.UpdateHeaderStatus(this.RFxID, "6").subscribe(x => {
        this.isProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(' Awarded successfully', SnackBarStatus.success);
        this._router.navigate(['pages/awardresponse']);
      },
        error => {
          console.log(error);
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
        });
    },err=>{
      console.log(err);
      this.isProgressBarVisibile=false;
      this.notificationSnackBarComponent.openSnackBar('something went wrong', SnackBarStatus.danger);
    }
    );
    this.CreateCEPartner();
    this.CreateCEMatrial();
    this.CreateCECriteria();
  }
  CreateCEPartner() {
    this.AllEvalRatingDetails.forEach(CEPartner => {
      var cepartner = new RFxCEPartner();
      cepartner.Client = this.Rfxheader.Client;
      cepartner.Company = this.Rfxheader.Company;
      cepartner.RFxID = this.RFxID;
      cepartner.PartnerID = CEPartner.PartnerID;
      cepartner.Rating = CEPartner.Rating;
      this.RFxCEPartner.push(cepartner);
    });
    console.log("Partner", this.RFxCEPartner);
    this._RFxService.CreateCEPartner(this.RFxCEPartner).subscribe(x => {
      console.log(x);
    })
  }

  CreateCEMatrial() {
    this.AllMaterialDetails.forEach(CEPartner => {
      var cepartner = new RFxCEMaterial();
      cepartner.Client = this.Rfxheader.Client;
      cepartner.Company = this.Rfxheader.Company;
      cepartner.RFxID = this.RFxID;
      cepartner.BestSupplier = CEPartner.BestSupplier;
      cepartner.Material = CEPartner.Material;
      this.RFxCEMaterial.push(cepartner);
    });
    console.log("Material", this.RFxCEMaterial);

    this._RFxService.CreateCEMaterial(this.RFxCEMaterial).subscribe(x => {
      console.log(this.RFxCEMaterial);

    })
  }

  CreateCECriteria() {
    this.AllCriteriaDetails.forEach(CEPartner => {
      var cepartner = new RFxCECriteria();
      cepartner.Client = this.Rfxheader.Client;
      cepartner.Company = this.Rfxheader.Company;
      cepartner.RFxID = this.RFxID;
      cepartner.BestSupplier = CEPartner.BestSupplier;
      cepartner.Criteria = CEPartner.Criteria;
      this.RFxCECriteria.push(cepartner);
    });
    console.log("Criteria", this.RFxCECriteria);

    this._RFxService.CreateCECriteria(this.RFxCECriteria).subscribe(x => {
      console.log(this.RFxCECriteria);
    })
  }
  GetEvalRatingByID(RFxID: string): void {
    this._RFxService.GetEvalRatingByID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllEvalRatingDetails = data;
          this.isProgressBarVisibile = false;
          this.HeaderDetailsDataSource = new MatTableDataSource(this.AllEvalRatingDetails);
        }
      })
  }
  GetMaterialByVendor(RFxID: string): void {
    this._RFxService.GetMaterialByVendor(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllMaterialDetails = data;
          this.isProgressBarVisibile = false;
          this.MaterialDetailsDataSource = new MatTableDataSource(this.AllMaterialDetails);
        }
      })
  }

  GetCriteriaByVendor(RFxID: string): void {
    this._RFxService.GetCriteriaByVendor(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllCriteriaDetails = data;
          this.isProgressBarVisibile = false;
          this.CriteriaDetailsDataSource = new MatTableDataSource(this.AllCriteriaDetails);
        }
      }
    )
  }
  TableHighlight(row: any,table:number) {
    if(table==1){
      this.SelectedVendor = row.PartnerID;
    }
    else{
      this.SelectedVendor = row.BestSupplier;
    }
    this.selectedRESID=row.RESID;
    this.Click = true;
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

  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }
}
