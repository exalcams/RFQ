import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class DateTimeValidator{
    static EndTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent || !control) {
            return null;
        }
        const startDate = control.parent.get('ValidityStartDate').value;
        const startTime = control.parent.get('ValidityStartTime').value;
        const endDate=control.parent.get('ValidityEndDate').value;
        const endTime=control.parent.get('ValidityEndTime').value;
        if (!startDate || !startTime || !endDate || !endTime) {
            return null;
        }
        var StartDateTime=DateTimeValidator.ConvertToDateTime(startDate,startTime);
        var EndDateTime=DateTimeValidator.ConvertToDateTime(endDate,endTime);
        if(StartDateTime<EndDateTime){
            return null;
        }
        return { 'EndTimeValidator': true };
    }
    static ResStartTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent || !control) {
            return null;
        }
        const startDate = control.parent.get('ValidityStartDate').value;
        const startTime = control.parent.get('ValidityStartTime').value;
        const endDate=control.parent.get('ResponseStartDate').value;
        const endTime=control.parent.get('ResponseStartTime').value;
        const valendDate=control.parent.get('ValidityEndDate').value;
        const valendTime=control.parent.get('ValidityEndTime').value;
        if (!startDate || !startTime || !endDate || !endTime || !valendDate || !valendTime) {
            return null;
        }
        var StartDateTime=DateTimeValidator.ConvertToDateTime(startDate,startTime);
        var EndDateTime=DateTimeValidator.ConvertToDateTime(endDate,endTime);
        var valEndDateTime=DateTimeValidator.ConvertToDateTime(valendDate,valendTime);
        if(StartDateTime<EndDateTime && EndDateTime<valEndDateTime){
            return null;
        }
        return { 'ResStartTimeValidator': true };
    }
    static ResEndTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent || !control) {
            return null;
        }
        const startDate = control.parent.get('ResponseStartDate').value;
        const startTime = control.parent.get('ResponseStartTime').value;
        const endDate=control.parent.get('ResponseEndDate').value;
        const endTime=control.parent.get('ResponseEndTime').value;
        const valendDate=control.parent.get('ValidityEndDate').value;
        const valendTime=control.parent.get('ValidityEndTime').value;
        if (!startDate || !startTime || !endDate || !endTime || !valendDate || !valendTime) {
            return null;
        }
        var StartDateTime=DateTimeValidator.ConvertToDateTime(startDate,startTime);
        var EndDateTime=DateTimeValidator.ConvertToDateTime(endDate,endTime);
        var valEndDateTime=DateTimeValidator.ConvertToDateTime(valendDate,valendTime);
        if(StartDateTime<EndDateTime && EndDateTime<valEndDateTime){
            return null;
        }
        return { 'ResEndTimeValidator': true };
    }
    static EvalEndTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent || !control) {
            return null;
        }
        const startDate = control.parent.get('ValidityStartDate').value;
        const startTime = control.parent.get('ValidityStartTime').value;
        const resDate=control.parent.get('ResponseStartDate').value;
        const resTime=control.parent.get('ResponseStartTime').value;
        const endDate=control.parent.get('EvaluationEndDate').value;
        const endTime=control.parent.get('EvaluationEndTime').value;
        const valendDate=control.parent.get('ValidityEndDate').value;
        const valendTime=control.parent.get('ValidityEndTime').value;
        if (!startDate || !startTime || !endDate || !endTime || !valendDate || !valendTime || !resDate || !resTime) {
            return null;
        }
        var StartDateTime=DateTimeValidator.ConvertToDateTime(startDate,startTime);
        var EndDateTime=DateTimeValidator.ConvertToDateTime(endDate,endTime);
        var valEndDateTime=DateTimeValidator.ConvertToDateTime(valendDate,valendTime);
        var resStartDateTime=DateTimeValidator.ConvertToDateTime(resDate,resTime);
        if(StartDateTime<EndDateTime && EndDateTime<valEndDateTime && resStartDateTime<EndDateTime){
            return null;
        }
        return { 'EvalEndTimeValidator': true };
    }
    static ConvertToDateTime(ParamDate: any, Time: any): Date {
        var date=new Date(ParamDate);
        var test = Time;
        var timeReg =/([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])/;
        var parts = test.match(timeReg);
        var hours = /am/i.test(parts[3]) ?
          function (am) { return am < 12 ? am : 0 }(parseInt(parts[1], 10)) :
          function (pm) { return pm < 12 ? pm + 12 : 12 }(parseInt(parts[1], 10));
    
        var minutes = parseInt(parts[2], 10);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0,0);
        return date;
      }
}