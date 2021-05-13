import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { VendorViewListDialogComponent } from 'app/notifications/vendor-view-list-dialog/vendor-view-list-dialog.component';
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
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};

@Component({
  selector: 'app-rfq-home',
  templateUrl: './rfq-home.component.html',
  styleUrls: ['./rfq-home.component.scss']
})
export class RfqHomeComponent implements OnInit, OnDestroy {
  @ViewChild("overviewchart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  RFxTableAttachments: string[] = [];
  AllHeaderDetails: any[] = [];
  InitiatedHeaderDetails: any[] = [];
  RespondedHeaderDetails: any[] = [];
  EvaluatedHeaderDetails: any[] = [];
  ClosedHeaderDetails: any[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['RFxID', 'Title', 'RFxType', 'RFxGroup', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Attachment', 'Vendor', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  isProgressBarVisibile: boolean;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsNewHeader: boolean = true;
  SelectedTab: string = "1";

  constructor(private route: Router,
    private _RFxService: RFxService,
    private dialog: MatDialog, public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);

  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    //console.log(retrievedObject);   
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_RFQ') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this.route.navigate(['/auth/login']);
      }
    } else {
      this.route.navigate(['/auth/login']);
    }
    this.GetAllRFxs();
    // chart begin
    this.RenderDounghtChart();

    // chart end
  }
  Gotoheader(rfqid) {
    this.IsNewHeader = false;
    this.route.navigate(['pages/rfq']);
    // { queryParams: { id: rfqid } }
    localStorage.setItem('RFXID', rfqid);
  }

  GetAllRFxs(): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetAllRFxHDocumets().subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllHeaderDetails, "1");
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('1').subscribe(
      (data) => {
        if (data) {
          this.InitiatedHeaderDetails = data;
          //this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('2').subscribe(
      (data) => {
        if (data) {
          this.RespondedHeaderDetails = data;
          //this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('3').subscribe(
      (data) => {
        if (data) {
          this.EvaluatedHeaderDetails = data;
          //this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('5').subscribe(
      (data) => {
        if (data) {
          this.ClosedHeaderDetails = data;
          //this.isProgressBarVisibile = false;
        }
      }
    );
     this._RFxService.GetAllRFxHDocumets('5').subscribe(
      (data) => {
        if (data) {
          this.ClosedHeaderDetails = data;
          //this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetRFxPieData().subscribe(x => {
      this.chartOptions.series = x;
    });
  }
  RenderDounghtChart() {
    this.chartOptions = {
      series: [],
      colors: ['#1764e8', '#74a2f1', '#c3d8fd', '#b5f9ff'],
      chart: {
        type: "donut",
        width: 280,
        height: 'auto',
        events: {
          dataPointSelection:(event, chartContext, config) => {
            if (config.dataPointIndex == 0) {
              this.LoadTableSource(this.RespondedHeaderDetails,"3");
            }
            if (config.dataPointIndex == 1) {
              this.LoadTableSource(this.EvaluatedHeaderDetails,"4");
            }
            if (config.dataPointIndex == 2) {
              this.LoadTableSource(this.ClosedHeaderDetails,"5");
            }
            if (config.dataPointIndex == 3) {
              this.route.navigate(['pages/awardreport']);
            }
          }
        }
      },
      labels: ["Released", "Responded", "Evaluated", "Awarded"],
      dataLabels: {
        enabled: true,
        distributed: true,
        textAnchor: 'middle',
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins',
          fontWeight: '600',
          colors: ['#083a6f', '#033283', '#1665f0', '#0fb752']
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
        position: 'left',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '11px',
        fontFamily: 'Poppins',
        fontWeight: 600,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        offsetX: 0,
        offsetY: -16,
        labels: {
          colors: ["#2b3540", "#2b3540", "#2b3540", "#2b3540"],
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
  LoadTableSource(DataArray: any[], Tab: string) {
    this.SelectedTab = Tab;
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator = this.RFQPaginator;
    this.HeaderDetailsDataSource.sort = this.RFQSort;
  }
  openAttachmentViewDialog(RFxID: string, Ataachments: string[]): void {
    const dialogConfig: MatDialogConfig = {
      data: { Documents: Ataachments, RFxID: RFxID, isResponse: false },
      panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
      AttachmentViewDialogComponent,
      dialogConfig
    );
  }
  openVendorViewList(RFxID: string, Vendor: string[]): void {
    const dialogConfig: MatDialogConfig = {
      data: { PartnerID: Vendor, RFxID: RFxID, isResponse: false },
      panelClass: "vendor-view-list-dialog",
    };
    const dialogRef = this.dialog.open(
      VendorViewListDialogComponent,
      dialogConfig
    );
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
  ngOnDestroy() {
    if (this.IsNewHeader) {
      localStorage.setItem('RFXID', "-1");
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.HeaderDetailsDataSource.filter = filterValue.trim().toLowerCase();
  }
}
