import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface PeriodicElement {
  Description: string;
  Action:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Description: "",Action:""}
];
@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})

export class CriteriaComponent implements OnInit {
  CriteriaDetailsDisplayedColumns: string[] = ['Description', 'Action'];
  CriteriaDetailsDataSource=ELEMENT_DATA;
  MainFormGroup: FormGroup;
  editable:boolean = true;
 
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
      // }
      this.MainFormGroup = this._formBuilder.group({
        groupName: ['', Validators.required]
      });
  }
  onKeypressEvent(){
    this.editable=false;
  }
}
