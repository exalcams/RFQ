import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { QuestionTemplate, QuestionTemplateView } from 'app/models/RFx';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  QuestionDetailsDisplayedColumns: string[] = ['Question','AnswerType', 'Action'];
  QuestionDetailsDataSource = new BehaviorSubject<AbstractControl[]>([]);;
  TemplateFormGroup: FormGroup;
  TemplateFormArray: FormArray = this._formBuilder.array([]);
  AllQuestionTemplates: QuestionTemplateView[] = [];
  searchText: string = "";
  selectedTemplate: QuestionTemplateView = new QuestionTemplateView();
  selectID: number;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;

  constructor(private _formBuilder: FormBuilder,
    private _rfxService: RFxService,
    public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = true;
  }

  ngOnInit() {
    this.InitializeFormGroup();
    this.GetCriteriaTemplates();
  }
  InitializeFormGroup() {
    this.TemplateFormGroup = this._formBuilder.group({
      Description: ['', Validators.required],
      Questions: this.TemplateFormArray
    });
  }
  GetCriteriaTemplates() {
    this._rfxService.GetQuestionTemplates().subscribe(res => {
      this.AllQuestionTemplates = <QuestionTemplateView[]>res;
      this.isProgressBarVisibile = false;
      if (this.AllQuestionTemplates.length > 0) {
        this.loadSelected(this.AllQuestionTemplates[0]);
      }
    });
  }
  AddRow(Template: QuestionTemplate) {
    this.TemplateFormArray.push(this._formBuilder.group({
      Question: [Template.Question, Validators.required],
      AnswerType:[Template.AnswerType,Validators.required]
    }));
    this.QuestionDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  AddClicked() {
    this.AddRow(new QuestionTemplate());
  }
  DeleteRow(index: any) {
    this.TemplateFormArray.removeAt(index);
    this.QuestionDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  ResetControl(): void {
    this.selectedTemplate = new QuestionTemplateView();
    this.selectID = 0;
    this.TemplateFormGroup.reset();
    Object.keys(this.TemplateFormGroup.controls).forEach(key => {
      this.TemplateFormGroup.get(key).markAsUntouched();
    });
    this.ClearFormArray(this.TemplateFormArray);
    this.QuestionDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  loadSelected(selected: QuestionTemplateView): void {
    this.selectID = selected.Group;
    this.selectedTemplate = selected;
    this.SetValues();
  }
  SetValues(): void {
    this.TemplateFormGroup.get('Description').patchValue(this.selectedTemplate.Description);
    this.ClearFormArray(this.TemplateFormArray);
    this.selectedTemplate.Questions.forEach(criteria => {
      this.AddRow(criteria);
    });
  }
  SaveClicked() {
    if (this.TemplateFormGroup.valid) {
      this.isProgressBarVisibile = true;
      this.GetValues();
      this._rfxService.CreateQuestionTemplate(this.selectedTemplate).subscribe(res => {
        this.ResetControl();
        this.GetCriteriaTemplates();
        this.notificationSnackBarComponent.openSnackBar('Templated saved successfully', SnackBarStatus.success);
      });
    }
    else {
      this.ShowValidationErrors(this.TemplateFormGroup);
    }
  }
  GetValues(){
    this.selectedTemplate.Description=this.TemplateFormGroup.get('Description').value;
      const Templates = this.TemplateFormGroup.get('Questions') as FormArray;
      this.selectedTemplate.Questions=[];
      Templates.controls.forEach((x) => {
        var ctemplate=new QuestionTemplate();
        ctemplate.Question=x.get('Question').value;
        ctemplate.AnswerType=x.get('AnswerType').value;
        this.selectedTemplate.Questions.push(ctemplate);
      });
  }
  DeleteClicked() {
    this.isProgressBarVisibile=true;
    this._rfxService.DeleteCriteriaTemplate(this.selectID).subscribe(res=>{
      this.ResetControl();
      this.GetCriteriaTemplates();
    });
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        //console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                //console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });
  }

}
