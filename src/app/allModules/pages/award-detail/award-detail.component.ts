import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RFxHeader, ResHeader, EvalHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailComponent implements OnInit {
  @ViewChild(MatPaginator) ResPaginator: MatPaginator;
  @ViewChild(MatSort) ResSort: MatSort;
  Rfxheader: RFxHeader = new RFxHeader();
  RFxFormGroup: FormGroup;
  RFxID: string = null;
  AwardedTo:string=null;
  HeaderDetailsDisplayedColumns: string[] = ['EvalID', 'Evaluator', 'EvaluatedOn', 'Action'];
  AllHeaderDetails: any = [];
  AllResponseDetails: any = [];
  isProgressBarVisibile: boolean;
  HeaderDetailsDataSource: MatTableDataSource<EvalHeader>;
  constructor(private _RFxService: RFxService,
    private _formBuilder: FormBuilder,private route:Router) { }

  ngOnInit() {
    this.RFxID = localStorage.getItem('ARFXID');
    this.AwardedTo=localStorage.getItem('AwardedTo');
    this.GetEvalHeaderByResponse();
    this.GetRFxByRFxID();
  }

  GetEvalHeaderByResponse(): void {
    this._RFxService.GetEvalHeaderByResponse(this.RFxID,this.AwardedTo).subscribe(
      (data) => {
        if (data) {
          this.AllResponseDetails = data;      
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllResponseDetails);
        }
      }
    )
  }
  GetRFxByRFxID(): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetRFxByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.Rfxheader = data as RFxHeader;
        }
        this.isProgressBarVisibile = false;
      }
    );
  }
  LoadTableSource(DataArray: any[]) {
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator = this.ResPaginator;
    this.HeaderDetailsDataSource.sort = this.ResSort;
  }

  getStatusColor(AllHeaderDetails: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return AllHeaderDetails.Status === "1"
          ? "gray"
          : AllHeaderDetails.Status === "2"
            ? "gray"
            : AllHeaderDetails.Status === "3"
              ? "#efb577" : "#34ad65";
      case "Evaluated":
        return AllHeaderDetails.Status === "1"
          ? "gray"
          : AllHeaderDetails.Status === "2"
            ? "gray"
            : AllHeaderDetails.Status === "3"
              ? "gray"
              : AllHeaderDetails.Status === "4"
                ? "gray"
                : "#34ad65";
      case "Closed":
        return AllHeaderDetails.Status === "1"
          ? "gray"
          : AllHeaderDetails.Status === "2"
            ? "gray"
            : AllHeaderDetails.Status === "3"
              ? "gray"
              : AllHeaderDetails.Status === "4"
                ? "gray"
                : AllHeaderDetails.Status === "5"
                  ? "gray"
                  : "#34ad65";
      default:
        return "";
    }
  }

  getTimeline(AllHeaderDetails: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "orange-timeline" : "green-timeline";
      case "Evaluated":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "white-timeline"
              : AllHeaderDetails.Status === "4"
                ? "white-timeline"
                : "green-timeline";
      case "Closed":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "white-timeline"
              : AllHeaderDetails.Status === "4"
                ? "white-timeline"
                : AllHeaderDetails.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      default:
        return "";
    }
  }

  getRestTimeline(AllHeaderDetails: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "white-timeline"
              : AllHeaderDetails.Status === "4"
                ? "white-timeline"
                : "green-timeline";
      case "Evaluated":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "white-timeline"
              : AllHeaderDetails.Status === "4"
                ? "white-timeline"
                : AllHeaderDetails.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      case "Closed":
        return AllHeaderDetails.Status === "1"
          ? "white-timeline"
          : AllHeaderDetails.Status === "2"
            ? "white-timeline"
            : AllHeaderDetails.Status === "3"
              ? "white-timeline"
              : AllHeaderDetails.Status === "4"
                ? "white-timeline"
                : AllHeaderDetails.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      default:
        return "";
    }
  }
  GotoAwardEvaluation(EvalID:string,RESID:string) {
    localStorage.setItem("AE_EvalID",EvalID);
    localStorage.setItem("AE_RESID",RESID);
    this.route.navigate(['pages/award-evaluation']);
  }

  BackClicked(){
    this.route.navigate(['pages/awardreport']);
  }

}
