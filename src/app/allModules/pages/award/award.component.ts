import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ByCriteria, ByMaterial, EvaluationRating, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';

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
  RFxFormGroup: FormGroup;
  HeaderDetailsDisplayedColumns: string[] = ['position', 'PartnerID', 'Rating'];
  MaterialDetailsDisplayedColumns: string[] = ['position', 'Material', 'BestSupplier'];
  CriteriaDetailsDisplayedColumns: string[] = ['position', 'Criteria', 'BestSupplier'];
  HeaderDetailsDataSource: MatTableDataSource<EvaluationRating>;
  MaterialDetailsDataSource: MatTableDataSource<ByMaterial>;
  CriteriaDetailsDataSource: MatTableDataSource<ByCriteria>;
  AllEvalRatingDetails: any = [];
  AllMaterialDetails: any = [];
  AllCriteriaDetails: any = [];
  isProgressBarVisibile: boolean;
  SelectedVendor = "";
  BestSupplier = "";
  BestSupplier1 = "";
  value: number = 1;
  Click : number = 0;
  Rfxheader: RFxHeader = new RFxHeader();
  selection = new SelectionModel<EvaluationRating>(true, []);
  isHightlight: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(private _RFxService: RFxService, private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _router: Router) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit() {
    this.RFxID = localStorage.getItem('E_RFXID');
    this.GetEvalRatingByID(this.RFxID);
    this.GetRFxHsByRFxID(this.RFxID);
    this.GetMaterialByVendor(this.RFxID);
    this.GetCriteriaByVendor(this.RFxID);
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
    // else {
    //   this.isProgressBarVisibile = false;
    //   this.notificationSnackBarComponent.openSnackBar('Awarded successfully', SnackBarStatus.success);
    // }
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
    this.Click=1;
    this.SelectedVendor = row.PartnerID;
  }
  TableHighlight2(row: ByMaterial) {
    this.Click=2;
    this.BestSupplier = row.BestSupplier;
  }
  TableHighlight3(row: ByCriteria) {
    this.BestSupplier1 = row.BestSupplier;
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
