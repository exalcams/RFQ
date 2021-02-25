import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface PeriodicElement {
  position: number;
  RfqId: number;
  Type: string;
  Date:string;
  Exp:string;
  Fulfilment:string;
  Attachment:string;
  Action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1,RfqId:9091,Type:'Purchase safety stock',Date:'29/03/1955',Exp:'05/04/1950',Fulfilment:'assets/image/t2.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 2,RfqId:9092,Type:'Lorem ipsum sor',Date:'24/04/1999',Exp:'07/04/1995',Fulfilment:'assets/image/t3.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 3,RfqId:9093,Type:'Purchase safety stock',Date:'16/12/1959',Exp:'24/02/2007',Fulfilment:'assets/image/t1.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 4,RfqId:9094,Type:'safety stock',Date:'16/01/1953',Exp:'28/03/2017',Fulfilment:'assets/image/t4.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 5,RfqId:9095,Type:'Purchase safety stock',Date:'29/11/2017',Exp:'03/01/1968',Fulfilment:'assets/image/t5.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 6,RfqId:9096,Type:'Purchase safety stock',Date:'01/05/2019',Exp:'14/04/1958',Fulfilment:'assets/image/t7.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'},
  {position: 7,RfqId:9096,Type:'Purchase safety stock',Date:'01/05/2019',Exp:'14/04/1958',Fulfilment:'assets/image/t6.png',Attachment:'assets/image/pdf.png', Action: 'assets/image/edit.png'}
];

@Component({
  selector: 'app-rfq-home',
  templateUrl: './rfq-home.component.html',
  styleUrls: ['./rfq-home.component.css']
})
export class RfqHomeComponent implements OnInit {

  displayedColumns: string[] = ['position', 'RfqId', 'Type','Date', 'Exp','Fulfilment','Attachment','Action'];
  dataSource = ELEMENT_DATA;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }
  Gotoheader(){
    this.route.navigate(['pages/rfq']);
  }

}
