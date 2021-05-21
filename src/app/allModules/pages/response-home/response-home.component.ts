import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { ResHeader, RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { VendorViewListDialogComponent } from 'app/notifications/vendor-view-list-dialog/vendor-view-list-dialog.component';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';
import { MutedialogComponent } from './Dialogs/mutedialog/mutedialog.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApexDataLabels, ApexLegend, ApexPlotOptions, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { animate, animateChild, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';

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
  selector: 'app-response-home',
  templateUrl: './response-home.component.html',
  styleUrls: ['./response-home.component.scss'],
  animations: [trigger('blub', [
    transition(':leave', [
      style({ background: 'pink' }),
      query('*', stagger(-150, [animateChild()]), { optional: true })
    ]),
  ]),

  trigger('fadeOut', [
    state('void', style({ background: 'pink', borderBottomColor: 'pink', opacity: 0, transform: 'translateX(-550px)', 'box-shadow': 'none' })),
    transition('void => *', sequence([
      animate(".2s ease")
    ])),
    transition('* => void', [animate("2s ease")])
  ]),

  trigger('rotatedState', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(90deg)' })),
    transition('rotated => default', animate('1500ms ease-out')),
    transition('default => rotated', animate('400ms ease-in'))
  ])

  ],
})
export class ResponseHomeComponent implements OnInit {
  isProgressBarVisibile: boolean;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("overviewchart") chart: ChartComponent;
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  RFxTableAttachments: string[] = [];
  AllHeaderDetails: any[] = [];
  ArrChart: any[] = [];
  DueToRespondHeaderDetails: any[] = [];
  RespondedHeaderDetails: any[] = [];
  HeaderStatus: any[];
  SelectedTab:string="1";
  HeaderDetailsDisplayedColumns: string[] = ['RFxID','Title','RFxType','RFxGroup', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Attachment','Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  imgArray: any[] = [
    {
      url: '../assets/images/1.png'
    },
    {
      url: '../assets/images/2.png'
    },
    {
      url: '../assets/images/3.png'
    },
    {
      url: '../assets/images/4.png'
    },
    {
      url: '../assets/images/5.png'
    }
  ]
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  state: string = 'default';
  filter: boolean = true;

  constructor(private route: Router,
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
    private dialog: MatDialog, public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
   
    // chart start
   
    // chart end
   
  }

  ngOnInit() {
    const retrievedObject = localStorage.getItem("authorizationData");
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(
        retrievedObject
      ) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_ResponseHome') < 0) {
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
    this.route.navigate(['pages/response']);
    // { queryParams: { id: rfqid } }
    localStorage.setItem('RRFxID', rfqid);

  }
  rotate() {
    this.filter = false;
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }
  rotate1() {
    this.filter = true;
    this.state = (this.state === 'rotated' ? 'default' : 'rotated');
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
              this.LoadTableSource(this.RespondedHeaderDetails,"2");
            }
            if (config.dataPointIndex == 1) {
              console.log(config.dataPointIndex);
              this.LoadTableSource(this.DueToRespondHeaderDetails,"3");
            }
          }
        }
      },
      labels: [" Responded", "Yet to be Responded"],
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
    this.isProgressBarVisibile = true;
    this._RFxService.GetAllRFxHDocumetsByVendorName(this.currentUserName).subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllHeaderDetails,"1");
        }
      }
    );
    this._RFxService.GetAllRFxHDocumetsByVendorName(this.currentUserName, '2').subscribe(
      (data) => {
        if (data) {
          this.DueToRespondHeaderDetails = data;
          this.ArrChart.push(this.DueToRespondHeaderDetails.length);
          this.isProgressBarVisibile = false;
        
        }
      }
    );
    
    this._RFxService.GetAllRFxHDocumetsByVendorName(this.currentUserName, '3').subscribe(
      (data) => {
        if (data) {
          this.RespondedHeaderDetails = data;
          this.ArrChart.push(this.RespondedHeaderDetails.length);
          this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetResPeiData(this.currentUserName).subscribe(x=>{
       this.chartOptions.series=x;
    });
    //  this.chartOptions.series=this.ArrChart;
  }
  LoadTableSource(DataArray: any[],Tab:string) {
    this.SelectedTab=Tab;
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator = this.RFQPaginator;
    this.HeaderDetailsDataSource.sort = this.RFQSort;
  }

  openAttachmentViewDialog(RFxID: string, Ataachments: string[]): void {
    const dialogConfig: MatDialogConfig = {
      data: { Documents: Ataachments, RFxID: RFxID, isResponse: true },
      panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
      AttachmentViewDialogComponent,
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
OpenMuteDialog(RFxH:RFxHeader):void{
  const dialogRef = this.dialog.open(MutedialogComponent, {
    panelClass:"mute-dialog"
  });
  dialogRef.afterClosed().subscribe(res=>{
    if(res){
      var header=new ResHeader();
      header.Client=RFxH.Client;
      header.Company=RFxH.Company;
      header.RFxID=RFxH.RFxID;
      header.PartnerID=this.currentUserName;
      header.ResRemarks=res;
      this.MuteRFx(header);
    }
  });
}
MuteRFx(header:ResHeader){
  this.isProgressBarVisibile=true;
  this._RFxService.MuteRFx(header).subscribe(res=>{
    Swal.fire('RFQ muted Successfully');
    this.GetAllRFxs();
    this.isProgressBarVisibile=false;
  },err=>{
    this.isProgressBarVisibile=false;
    console.log(err);
  }
  );
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.HeaderDetailsDataSource.filter = filterValue.trim().toLowerCase();
}
}
