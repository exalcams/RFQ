import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ResHeader, RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-award-response',
  templateUrl: './award-response.component.html',
  styleUrls: ['./award-response.component.scss']
})
export class AwardResponseComponent implements OnInit {
  @ViewChild(MatPaginator) ResPaginator: MatPaginator;
  @ViewChild(MatSort) ResSort: MatSort;
  Rfxheader: RFxHeader = new RFxHeader();
  RFxFormGroup: FormGroup;
  RFxID: string = null;
  HeaderDetailsDisplayedColumns: string[] = ['position', 'PartnerID', 'RESID', 'ModifiedOn', 'ItemResponded'];
  AllHeaderDetails: any = [];
  AllResponseDetails: any = [];
  isProgressBarVisibile: boolean;
  HeaderDetailsDataSource: MatTableDataSource<ResHeader>;
  constructor(private _RFxService: RFxService,
    private _formBuilder: FormBuilder,private route:Router) { }

  ngOnInit() {
    this.RFxID = localStorage.getItem('A_RFXID');
    this.GetAllRFxs();
    this.GetAllResponses();
    this.GetRFxHsByRFxID(this.RFxID);
    this.InitializeRFxFormGroup();
  }
  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
      RFXID:['',[Validators.required]],
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
    this._RFxService.GetResponseByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.AllResponseDetails = data;      
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllResponseDetails);
        }
      }
    )
  }
  GetRFxHsByRFxID(RFxID: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetRFxByRFxID(this.RFxID).subscribe(
      (data) => {
        if (data) {
          this.Rfxheader = data as RFxHeader;
          this.RFxFormGroup.get("RFXID").setValue(this.Rfxheader.RFxID);
          this.RFxFormGroup.get("RfqType").setValue(this.Rfxheader.RFxType);
          this.RFxFormGroup.get("RfqGroup").setValue(this.Rfxheader.RFxGroup);
          this.RFxFormGroup.get("RfqTitle").setValue(this.Rfxheader.Title);
          this.RFxFormGroup.get("ValidityStartDate").setValue(this.Rfxheader.ValidityStartDate);
          this.RFxFormGroup.get("ValidityEndDate").setValue(this.Rfxheader.ValidityEndDate);
          this.RFxFormGroup.get("ResponseStartDate").setValue(this.Rfxheader.ResponseStartDate);
          this.RFxFormGroup.get("ResponseEndDate").setValue(this.Rfxheader.ResponseEndDate);
          this.RFxFormGroup.get("Currency").setValue(this.Rfxheader.Currency);
          this.RFxFormGroup.disable();
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
  Gotoheader(RFxID:string) {
    localStorage.setItem("E_RFXID",RFxID);
     this.route.navigate(['pages/award']);
  }
}
