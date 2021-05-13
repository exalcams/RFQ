import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CriteriaTemplate, CriteriaTemplateView } from 'app/models/RFx';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})

export class CriteriaComponent implements OnInit {
  CriteriaDetailsDisplayedColumns: string[] = ['Criteria', 'Action'];
  CriteriaDetailsDataSource = new BehaviorSubject<AbstractControl[]>([]);;
  TemplateFormGroup: FormGroup;
  TemplateFormArray: FormArray = this._formBuilder.array([]);
  AllCriteriaTemplates: CriteriaTemplateView[] = [];
  searchText: string = "";
  selectedTemplate: CriteriaTemplateView = new CriteriaTemplateView();
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
      Criterias: this.TemplateFormArray
    });
  }
  GetCriteriaTemplates() {
    this._rfxService.GetCriteriaTemplates().subscribe(res => {
      this.AllCriteriaTemplates = <CriteriaTemplateView[]>res;
      this.isProgressBarVisibile = false;
      if (this.AllCriteriaTemplates.length > 0) {
        this.loadSelected(this.AllCriteriaTemplates[0]);
      }
    });
  }
  AddRow(Template: CriteriaTemplate) {
    this.TemplateFormArray.push(this._formBuilder.group({
      Criteria: [Template.Criteria, Validators.required]
    }));
    this.CriteriaDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  AddClicked() {
    this.AddRow(new CriteriaTemplate());
  }
  DeleteRow(index: any) {
    this.TemplateFormArray.removeAt(index);
    this.CriteriaDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  ResetControl(): void {
    this.selectedTemplate = new CriteriaTemplateView();
    this.selectID = 0;
    this.TemplateFormGroup.reset();
    Object.keys(this.TemplateFormGroup.controls).forEach(key => {
      this.TemplateFormGroup.get(key).markAsUntouched();
    });
    this.ClearFormArray(this.TemplateFormArray);
    this.CriteriaDetailsDataSource.next(this.TemplateFormArray.controls);
  }
  loadSelected(selected: CriteriaTemplateView): void {
    this.selectID = selected.Group;
    this.selectedTemplate = selected;
    this.SetValues();
  }
  SetValues(): void {
    this.TemplateFormGroup.get('Description').patchValue(this.selectedTemplate.Description);
    this.ClearFormArray(this.TemplateFormArray);
    this.selectedTemplate.Criterias.forEach(criteria => {
      this.AddRow(criteria);
    });
  }
  SaveClicked() {
    if (this.TemplateFormGroup.valid) {
      this.isProgressBarVisibile = true;
      this.GetValues();
      this._rfxService.CreateCriteriaTemplate(this.selectedTemplate).subscribe(res => {
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
      const Templates = this.TemplateFormGroup.get('Criterias') as FormArray;
      this.selectedTemplate.Criterias=[];
      Templates.controls.forEach((x) => {
        var ctemplate=new CriteriaTemplate();
        ctemplate.Criteria=x.get('Criteria').value;
        this.selectedTemplate.Criterias.push(ctemplate);
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
