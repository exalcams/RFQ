import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  Question: string;
  Action:string;
  Answertype:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Question: "",Answertype: "",Action:""}
];

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  QuestionDetailsDisplayedColumns: string[] = ['Question','Answertype', 'Action'];
  QuestionDetailsDataSource=ELEMENT_DATA;
  MainFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.MainFormGroup = this._formBuilder.group({
      groupName: ['', Validators.required]
    });
  }

}
