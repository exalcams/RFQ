import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ResHeader, ResVendorRatingView, RFxHeader, RFxIC } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';
// import { forEach } from 'lodash';



@Component({
  selector: 'app-award-response',
  templateUrl: './award-response.component.html',
  styleUrls: ['./award-response.component.scss']
})
export class AwardResponseComponent implements OnInit {
  @ViewChild(MatPaginator) ResPaginator: MatPaginator;
  @ViewChild(MatSort) ResSort: MatSort;
  Rfxheader: RFxHeader = new RFxHeader();
  RFxID: string = null;
  HeaderDetailsDisplayedColumns: string[] = ['PartnerID', 'RESID', 'ModifiedOn', 'ItemResponded'];
  AllHeaderDetails: any = [];
  AllResponseDetails: any = [];
  isProgressBarVisibile: boolean;
  HeaderDetailsDataSource: MatTableDataSource<ResHeader>;
  RatingtableDataSource: MatTableDataSource<ResVendorRatingView>;
  RatingtableDisplayedColumns: string[] = ["RESID", "PartnerID", "Price", "LeadTime", "Rating"]
  partnerID: any;
  Responses: ResHeader[] = [];
  ArrayOfResI: any[] = [];
  ResRating: ResVendorRatingView[] = [];
  ResRatingFiltered: ResVendorRatingView[] = [];
  Totalweight: number = 0;
  criteriaData: RFxIC[];

  constructor(private _RFxService: RFxService,
    private _formBuilder: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.RFxID = localStorage.getItem('A_RFXID');
    this.GetAllRFxs();
    this.GetAllResponses();
    this.GetRFxHsByRFxID(this.RFxID);
    //mounika
    this.GetCriteria();
    //mounika end
  }

  //mounika
  GetCriteria() {
    this._RFxService.GetCriteriaByRFxID_rating(this.RFxID).subscribe(
      (data) => {
        this.criteriaData = data as RFxIC[];
        console.log(this.criteriaData);
        this.criteriaData.forEach(x => {
          this.Totalweight = this.Totalweight + x.Weightage;
        })

        this.GetResponseForRating(this.RFxID);
      }
    )
  }
  GetResponseForRating(RFxID) {
    this._RFxService.GetResponseByRFxID_rating(RFxID).subscribe(
      (data) => {
        this.ResRating = data as ResVendorRatingView[];
        var resid = "";
        this.ResRating.forEach(x => {
          var resdata = new ResVendorRatingView();
          //adding data to convert single resid data
          if (x.RESID != resid) {
            var data = this.ResRating.filter(res => res.PartnerID == x.PartnerID);
            resdata.Client = x.Client;
            resdata.Company = x.Company;
            resdata.RESID = x.RESID;
            resdata.RFxID = x.RFxID;
            resdata.PartnerID = x.PartnerID;
            var LeadTime = 0;
            var price = 0
            for (var i = 0; i < data.length; i++) {
              price = price + data[i].Price;
              LeadTime = LeadTime + parseInt(data[i].LeadTime);
            }
            LeadTime = LeadTime / data.length;
            resdata.LeadTime = LeadTime.toString();
            resdata.Price = price;
            resid = resdata.RESID;
            resdata.Rating = "0";
            this.ResRatingFiltered.push(resdata);
          }
        })
        this.Ratingcalculation();
        this.RatingtableDataSource = new MatTableDataSource(this.ResRatingFiltered);
        console.log(this.ResRatingFiltered);

      }

    )


  }
  Ratingcalculation() {
    const diff = (a, b) => {
      return Math.abs(a - b);
    }
    //var newResRating=Array.from(this.ResRatingFiltered);
    var newResRating = [];
    this.ResRatingFiltered.forEach(x => {
      var newobj = Object.assign({}, x)
      newResRating.push(newobj)
    });

    if (newResRating.length == 1 && this.criteriaData.length) {
      this.ResRatingFiltered[0].Rating = "5";
    }
    else if (this.criteriaData.length == 0) {
      this.ResRatingFiltered.forEach(x => x.Rating = "0")
    }
    else {
      for (var i = 0; i < this.criteriaData.length; i++) {
        var criteriaText = this.criteriaData[i].Text;
        var min = Math.min.apply(null, this.ResRatingFiltered.map(function (item) {
          return item[criteriaText];
        }));
        var max = Math.max.apply(null, this.ResRatingFiltered.map(function (item) {
          return item[criteriaText];
        }));
        if (this.criteriaData[i].Consider == "0") {
          if (min != max) {
            newResRating.find(x => x[criteriaText] == min)[criteriaText] = 1;
            newResRating.find(x => x[criteriaText] == max)[criteriaText] = 0;
          }
          else {
            newResRating.forEach(x => x[criteriaText] = 1);
          }
          newResRating.forEach(x => {
            if (x[criteriaText] != 1 && x[criteriaText] != 0) {
              var inp = x[criteriaText];
              x[criteriaText] = (diff(max, inp) / diff(max, min)) * this.criteriaData[i].Weightage;

            }
            if (x[criteriaText] == 1) {
              x[criteriaText] = this.criteriaData[i].Weightage;
            }
          })
        }
        else {
          if (min != max) {
            newResRating.find(x => x[criteriaText] == min)[criteriaText] = 0;
            newResRating.find(x => x[criteriaText] == max)[criteriaText] = 1;
          }
          else {
            newResRating.forEach(x => x[criteriaText] = 1);
          }
          newResRating.forEach(x => {
            if (x[criteriaText] != 1 && x[criteriaText] != 0) {

              x[criteriaText] = (diff(min, x[criteriaText]) / diff(max, min)) * this.criteriaData[i].Weightage;

            }
            if (x[criteriaText] == 1) {
              x[criteriaText] = this.criteriaData[i].Weightage;
            }
          })
        }
      }
      console.log(newResRating);
      newResRating.forEach(x => {
        x.Rating = (((parseInt(x.LeadTime) + x.Price) / this.Totalweight) * 5).toFixed(2).toString()
      });
      for (var i = 0; i < this.ResRatingFiltered.length; i++) {

        this.ResRatingFiltered[i].Rating = newResRating[i].Rating;

      }
    }
  }
  //mounika end



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
    this._RFxService.GetResponseByRFxID_award(this.RFxID).subscribe(
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
    console.log(this.HeaderDetailsDataSource);

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
  Gotoheader(RFxID: string) {
    localStorage.setItem("E_RFXID", RFxID);
    this.route.navigate(['pages/award']);
  }
  BackClicked() {
    this.route.navigate(['pages/awardhome']);
  }
}
