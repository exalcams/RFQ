import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { ResHeader, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-evaluation-response',
  templateUrl: './evaluation-response.component.html',
  styleUrls: ['./evaluation-response.component.scss']
})
export class EvaluationResponseComponent implements OnInit {
  @ViewChild(MatPaginator) ResPaginator: MatPaginator;
  @ViewChild(MatSort) ResSort: MatSort;
  Rfxheader: RFxHeader = new RFxHeader();
  RFxFormGroup: FormGroup;
  RFxID: string = null;
  HeaderDetailsDisplayedColumns: string[] = ['RESID','PartnerID', 'ModifiedOn', 'ItemResponded', 'Action'];
  AllHeaderDetails: any = [];
  AllResponseDetails: any[] = [];
  EvalResponseCount: number = 0;
  YetEvalResponsCount: number = 0;
  isProgressBarVisibile: boolean;
  HeaderDetailsDataSource: MatTableDataSource<ResHeader>;
  authenticationDetails: AuthenticationDetails;
  CurrentUserName:string;
  constructor(private _RFxService: RFxService,
    private _formBuilder: FormBuilder,private route:Router) { }

  ngOnInit() {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName=this.authenticationDetails.UserName;
    } else {
      this.route.navigate(['/auth/login']);
    }
    this.RFxID = localStorage.getItem('E_RFXID');
    this.GetAllRFxs();
    this.GetAllResponses();
    this.GetRFxHsByRFxID(this.RFxID);
  }

  GetAllRFxs(): void {
    this._RFxService.GetRFxByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails = data;
          this.isProgressBarVisibile = false;
        }
      }
    );
  }

  GetAllResponses(): void {
    this._RFxService.GetResWithEvalStatus(this.RFxID,this.CurrentUserName).subscribe(
      (data) => {
        if (data) {
          this.AllResponseDetails = data;      
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllResponseDetails);
          this.EvalResponseCount=this.AllResponseDetails.filter(x=>x.EvalStatus=='2').length;
          this.YetEvalResponsCount=this.AllResponseDetails.filter(x=>x.EvalStatus!='2').length;
        }
      }
    );
  }
  GetRFxHsByRFxID(RFxID: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetRFxByRFxID(RFxID).subscribe(
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
  Gotoheader(RESID:string) {
    localStorage.setItem("E_RESID",RESID);
    this.route.navigate(['pages/evaluation']);
  }
  BackClicked(){
    this.route.navigate(['pages/evaluationhome']);
  }
}
