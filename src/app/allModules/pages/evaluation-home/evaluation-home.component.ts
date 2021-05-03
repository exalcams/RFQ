import { Component,OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader } from 'app/models/RFx';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';
import { ApexDataLabels, ApexLegend, ApexPlotOptions, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors:string[];
  dataLabels: ApexDataLabels;
  plotOptions:ApexPlotOptions;
  legend: ApexLegend;
};

@Component({
  selector: 'app-evaluation-home',
  templateUrl: './evaluation-home.component.html',
  styleUrls: ['./evaluation-home.component.scss']
})
export class EvaluationHomeComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("overviewchart") chart: ChartComponent;
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  AllHeaderDetails: any[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['RFxID','Title', 'RFxType','RFxGroup', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  isProgressBarVisibile:boolean;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  CurrentUserName:string;
  ArrChart: any[] = [];
  currentUserRole: string;
  EvaluatedHeaderDetails: any[] = [];
  ClosedHeaderDetails: any[] = [];
  MenuItems: string[];
  SelectedTab:string="1";
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(private route: Router,
    private _RFxService: RFxService,
    private dialog: MatDialog,public snackBar: MatSnackBar) { 
      this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    
    }

  ngOnInit() {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.CurrentUserName=this.authenticationDetails.UserName;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_EvaluationHome') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this.route.navigate(['/auth/login']);
      }
    } else {
      this.route.navigate(['/auth/login']);
    }
    this.GetAllRFxs();
    this.DoughnutChart();
  }
  Gotoheader(rfqid) {
    this.route.navigate(['pages/evaluationresponse']);
    // { queryParams: { id: rfqid } }
    localStorage.setItem('E_RFXID', rfqid);
  }
  DoughnutChart(){
    this.chartOptions = {
      series:[],
      colors:['#1764e8', '#74a2f1', '#c3d8fd','#b5f9ff'],
      chart: {
        type: "donut",
        width:'320px',
        height:'auto',
        events: {
          dataPointSelection:(event, chartContext, config) => {
            if (config.dataPointIndex == 0) {
              console.log(config.dataPointIndex);
              this.LoadTableSource(this.ClosedHeaderDetails,"2");
            }
            if (config.dataPointIndex == 1) {
              console.log(config.dataPointIndex);
              this.LoadTableSource(this.EvaluatedHeaderDetails,"3");
            }
          }
        }
      },
      labels: ["Evaluated", " Yet to be Evaluated"],
      dataLabels: {
        enabled: true,
        distributed: true,
        textAnchor:'middle',
        style: {
            fontSize: '10px',
            fontFamily: 'Poppins',
            fontWeight: '600',
            colors: ['#083a6f', '#033283', '#1665f0','#0fb752']
        },
        dropShadow: {
          enabled: false,
      }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            offset: 25,
          },
          donut: {
            size: '65%'
          }
        }
      },
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center', 
        floating: false,
        fontSize: '11px',
        fontFamily: 'Poppins',
        fontWeight: 600,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        offsetX: 0,
        offsetY: -8,
        labels: {
            colors: ["#2b3540","#2b3540","#2b3540","#2b3540"],
            useSeriesColors: false
        },
        markers: {
            width: 6,
            height: 6,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 6,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
        },
        itemMargin: {
            horizontal: 8,
            vertical: 4
        },
        onItemClick: {
            toggleDataSeries: true
        },
        onItemHover: {
            highlightDataSeries: true
        },
    }
    };
  }
  GetAllRFxs(): void {
    this.isProgressBarVisibile=true;
    this._RFxService.GetAllEvalRFxH(this.CurrentUserName).subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails =data;
          this.isProgressBarVisibile=false;
          this.LoadTableSource(this.AllHeaderDetails,"0");
        }
      }
    );
    this._RFxService.GetAllEvalRFxH(this.CurrentUserName,'1').subscribe(
      (data) => {
        if (data) {
          this.EvaluatedHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.ArrChart.push(this.EvaluatedHeaderDetails.length);
          // this.LoadTableSource(this.EvaluatedHeaderDetails);
        }
      }
    );
    this._RFxService.GetAllEvalRFxH(this.CurrentUserName,'2').subscribe(
      (data) => {
        if (data) {
          this.ClosedHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.ArrChart.push(this.ClosedHeaderDetails.length);
          // this.LoadTableSource(this.ClosedHeaderDetails);
        }
      }
    );
    this._RFxService.GetEvalPieData(this.CurrentUserName).subscribe(x=>{
      this.chartOptions.series=x;
    });
  }
  LoadTableSource(DataArray:any[],Tab:string){
    this.SelectedTab=Tab;
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator=this.RFQPaginator;
    this.HeaderDetailsDataSource.sort=this.RFQSort;
  }

//fulfilment Status
getStatusColor(element: RFxHeader, StatusFor: string): string {
  switch (StatusFor) {
      case "Responded":
          return element.Status === "1"
              ? "gray"
              : element.Status === "2"
                  ? "gray"
                  : element.Status === "3"
                      ? "#efb577" : "#34ad65";
      case "Evaluated":
          return element.Status === "1"
              ? "gray"
              : element.Status === "2"
                  ? "gray"
                  : element.Status === "3"
                      ? "gray"
                      : element.Status === "4"
                          ? "gray"
                          : "#34ad65";
      case "Closed":
          return element.Status === "1"
              ? "gray"
              : element.Status === "2"
                  ? "gray"
                  : element.Status === "3"
                      ? "gray"
                      : element.Status === "4"
                          ? "gray"
                          : element.Status === "5"
                              ? "gray"
                              : "#34ad65";
      default:
          return "";
  }
}

getTimeline(element: RFxHeader, StatusFor: string): string {
  switch (StatusFor) {
      case "Responded":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "orange-timeline" : "green-timeline";
      case "Evaluated":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "white-timeline"
                      : element.Status === "4"
                          ? "white-timeline"
                          : "green-timeline";
      case "Closed":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "white-timeline"
                      : element.Status === "4"
                          ? "white-timeline"
                          : element.Status === "5"
                              ? "white-timeline"
                              : "green-timeline";
      default:
          return "";
  }
}

getRestTimeline(element: RFxHeader, StatusFor: string): string {
  switch (StatusFor) {
      case "Responded":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "white-timeline"
                      : element.Status === "4"
                          ? "white-timeline"
                          : "green-timeline";
      case "Evaluated":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "white-timeline"
                      : element.Status === "4"
                          ? "white-timeline"
                          : element.Status === "5"
                              ? "white-timeline"
                              : "green-timeline";
      case "Closed":
          return element.Status === "1"
              ? "white-timeline"
              : element.Status === "2"
                  ? "white-timeline"
                  : element.Status === "3"
                      ? "white-timeline"
                      : element.Status === "4"
                          ? "white-timeline"
                          : element.Status === "5"
                              ? "white-timeline"
                              : "green-timeline";
      default:
          return "";
  }
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.HeaderDetailsDataSource.filter = filterValue.trim().toLowerCase();
}

}
