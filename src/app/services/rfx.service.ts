import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
// import { _MatChipListMixinBase } from '@angular/material';
// import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { ResHC, ResHeader, ResIC, ResItem, ResOD, ResponseView, RFxHC, RFxHeader, RFxIC, RFxItem, RFxOD,RFxODAttachment,RFxRemark, RFxPartner, MVendor, RFxVendorView, RFxView, MMaterial, RFxVendor, MRFxType, MRFxGroup, ResODAttachment, ResODView, EvaluationView, EvalHC, EvalIC, EvalHeader, EvaluationRating, ByMaterial, ByCriteria, RFxAward, RFxCEPartner, RFxCEMaterial, RFxCECriteria, ResVendorRatingView } from '../models/RFx';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class RFxService {
    baseAddress: string;
    NotificationEvent: Subject<any>;

    GetNotification(): Observable<any> {
        return this.NotificationEvent.asObservable();
    }

    TriggerNotification(eventName: string): void {
        this.NotificationEvent.next(eventName);
    }

    constructor(
        private _httpClient: HttpClient
    ) {
        // this.baseAddress = 'http://localhost:5019/';
        this.baseAddress = environment.baseAddress;
        // this.baseAddress=environment.baseAddress;
        this.NotificationEvent = new Subject();
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
    }

    CreateRFxByRFxID(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/post`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }

    GetAllRFxs(): Observable<RFxHeader[] | string> {
        return this._httpClient.get<RFxHeader[]>(`${this.baseAddress}rfxapi/RFx/GetAllRFxs`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRFxMaterialM(): Observable<MMaterial[] | string> {
        return this._httpClient.get<MMaterial[]>(`${this.baseAddress}rfxapi/RFx/GetAllRFxMaterialM`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRFxVendorM(): Observable<MVendor[] | string> {
        return this._httpClient.get<MVendor[]>(`${this.baseAddress}rfxapi/RFx/GetAllRFxVendorM`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllRFxTypeM(): Observable<MRFxType[] | string> {
        return this._httpClient.get<MRFxType[]>(`${this.baseAddress}rfxapi/RFx/GetAllRFxTypeM`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRFxGroupM(): Observable<MRFxGroup[] | string> {
        return this._httpClient.get<MRFxGroup[]>(`${this.baseAddress}rfxapi/RFx/GetAllRFxGroupM`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRFxHDocumets(status?:string):Observable<any>{
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAllRFxHDocumets?status=${status}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRFxHDocumetsByVendorName(UserName:string,status?:string):Observable<any>{
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAllRFxHDocumetsByVendorName?UserName=${UserName}&status=${status}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllEvalRFxH(UserName:string,status?:string):Observable<any>{
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAllEvalRFxH?UserName=${UserName}&status=${status}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllAwardRFxH(UserName:string):Observable<any>{
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAllAwardRFxH?UserName=${UserName}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxByRFxID(RFxID: string): Observable<RFxHeader | string> {
        return this._httpClient.get<RFxHeader>(`${this.baseAddress}rfxapi/RFx/GetRFxByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }


    GetRFxItemsByRFxID(RFxID: string): Observable<RFxItem[] | string> {
        return this._httpClient.get<RFxItem[]>(`${this.baseAddress}rfxapi/RFx/GetRFxItemsByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetRFxHCsByRFxID(RFxID: string): Observable<RFxHC[] | string> {
        return this._httpClient.get<RFxHC[]>(`${this.baseAddress}rfxapi/RFx/GetRFxHCsByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxICsByRFxID(RFxID: string): Observable<RFxIC[] | string> {
        return this._httpClient.get<RFxIC[]>(`${this.baseAddress}rfxapi/RFx/GetRFxICsByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetRFxPartnersByRFxID(RFxID: string): Observable<RFxPartner[] | string> {
        return this._httpClient.get<RFxPartner[]>(`${this.baseAddress}rfxapi/RFx/GetRFxPartnersByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    
    GetRFxVendorsByRFxID(RFxID: string): Observable<RFxVendor[] | string> {
        return this._httpClient.get<RFxVendor[]>(`${this.baseAddress}rfxapi/RFx/GetRFxVendorsByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxVendorViewsByRFxID(RFxID: string,PatnerID:string): Observable<RFxVendorView | string> {
        return this._httpClient.get<RFxVendorView>(`${this.baseAddress}rfxapi/RFx/GetRFxVendorViewsByRFxID?RFxID=${RFxID}&PatnerID=${PatnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxODsByRFxID(RFxID: string): Observable<RFxOD[] | string> {
        return this._httpClient.get<RFxOD[]>(`${this.baseAddress}rfxapi/RFx/GetRFxODsByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxODAttachmentsByRFxID(RFxID: string): Observable<RFxODAttachment[] | string> {
        return this._httpClient.get<RFxODAttachment[]>(`${this.baseAddress}rfxapi/RFx/GetRFxODAttachmentsByRFxId?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFxRemarkByRFxID(RFxID: string): Observable<RFxRemark | string> {
        return this._httpClient.get<RFxRemark>(`${this.baseAddress}rfxapi/RFx/GetRFxRemarksByRFxID?RFxID=${RFxID}`)
            .pipe(catchError(this.errorHandler));
    }
    CreateRFx(RFx: RFxView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateRFx`,
            RFx,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateRFx(RFx: RFxView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/UpdateRFx`,
            RFx,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeleteRFx(RFx: string): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/DeleteRFx?RFxID=${RFx}`)
            .pipe(catchError(this.errorHandler));
    }


    GetAllResponses(): Observable<ResHeader[] | string> {
        return this._httpClient.get<ResHeader[]>(`${this.baseAddress}rfxapi/RFx/GetAllResponses`)
            .pipe(catchError(this.errorHandler));
    }

    GetResponseByResponseID(ResponseID: string): Observable<ResHeader | string> {
        return this._httpClient.get<ResHeader>(`${this.baseAddress}rfxapi/RFx/GetResponseByResponseID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetResponseByPartnerID(RFxID:string,PartnerID: string): Observable<ResHeader | string> {
        return this._httpClient.get<ResHeader>(`${this.baseAddress}rfxapi/RFx/GetResponseByPartnerID?RFxID=${RFxID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetResponseByRFxID(RFxID:string):Observable<ResHeader | string> {
        return this._httpClient.get<ResHeader>(`${this.baseAddress}rfxapi/RFx/GetResponseByRFxID?RFxID=${RFxID}`)
        .pipe(catchError(this.errorHandler));
    }
    //mounika 
    GetResponseByRFxID_award(RFxID:string):Observable<ResHeader[] | string> {
        return this._httpClient.get<ResHeader[]>(`${this.baseAddress}rfxapi/RFx/GetResponseByRFxID?RFxID=${RFxID}`)
        .pipe(catchError(this.errorHandler));
    }
    GetResponseByRFxID_rating(RFxID:string):Observable<ResVendorRatingView[] | string> {
        return this._httpClient.get<ResVendorRatingView[]>(`${this.baseAddress}rfxapi/RFx/GetResponseByRFxID_rating?RFxID=${RFxID}`)
        .pipe(catchError(this.errorHandler));
    }
    GetCriteriaByRFxID_rating(RFxID:string):Observable<RFxIC[] | string> {
        return this._httpClient.get<RFxIC[]>(`${this.baseAddress}rfxapi/RFx/GetCriteriaByRFxID_rating?RFxID=${RFxID}`)
        .pipe(catchError(this.errorHandler));
    }
    // mounika end
    GetResponseItemsByResponseID(ResponseID: string): Observable<ResItem[] | string> {
        return this._httpClient.get<ResItem[]>(`${this.baseAddress}rfxapi/RFx/GetResponseItemsByResponseID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetResponseHCsByResponseID(ResponseID: string): Observable<ResHC[] | string> {
        return this._httpClient.get<ResHC[]>(`${this.baseAddress}rfxapi/RFx/GetResponseHCsByResponseID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetResponseICsByResponseID(ResponseID: string): Observable<ResIC[] | string> {
        return this._httpClient.get<ResIC[]>(`${this.baseAddress}rfxapi/RFx/GetResponseICsByResponseID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetResponseODsByResponseID(ResponseID: string): Observable<ResOD[] | string> {
        return this._httpClient.get<ResOD[]>(`${this.baseAddress}rfxapi/RFx/GetResponseODsByResponseID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetResponseODAttachmentsByResponseID(ResponseID : string): Observable<RFxODAttachment[] | string>{
        return this._httpClient.get<ResODAttachment[]>(`${this.baseAddress}rfxapi/RFx/GetResponseODAttachmentsByResponseID?ResponseID=${ResponseID}`)
    }
    CreateResponse(Response: ResponseView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateResponse`,
            Response,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateResponse(Response: ResponseView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/UpdateResponse`,
            Response,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeleteResponse(Response: ResHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/DeleteResponse`,
            Response,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    AddtoEvaluationTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTableHC`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoItemTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTableItem`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoRatingTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTableIC`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoPartnerTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTablePartner`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoVendorTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToMVendor`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoODTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTableOD`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      AddtoODAttachTable(RFx){
            return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/AddToTableODAttach`,RFx,
              {
                headers:new HttpHeaders({
                  'Content-Type':'application/json'
                })
              })
      }
      UploadRFxAttachment(RFxID: string, selectedFiles: File[],perviousFileName=null): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('RFxID', RFxID);
        formData.append('PerviousFileName', perviousFileName);
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/UploadRFxAttachment`,
          formData
        ).pipe(catchError(this.errorHandler));
      }
      UploadResAttachment(RFxID: string, selectedFiles: File[],perviousFileName=null): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('RESID', RFxID);
        formData.append('PerviousFileName', perviousFileName);
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/UploadResAttachment`,
          formData
        ).pipe(catchError(this.errorHandler));
      }
      DowloandAttachment(RFxID: string,DocumentName:string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}rfxapi/RFx/DowloandRFxAttachment?RFxID=${RFxID}&DocumentName=${DocumentName}`, {
          responseType: 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
          .pipe(catchError(this.errorHandler));
      }
      DowloandResAttachment(DocumentName:string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}rfxapi/RFx/DowloandResAttachment?DocumentName=${DocumentName}`, {
          responseType: 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
          .pipe(catchError(this.errorHandler));
      }

      //Evaluation
      GetResODViewsByRESID(ResponseID: string): Observable<ResODView[] | string> {
        return this._httpClient.get<ResODView[]>(`${this.baseAddress}rfxapi/RFx/GetResODViewsByRESID?ResponseID=${ResponseID}`)
            .pipe(catchError(this.errorHandler));
    }
    CreateEvaluation(Eval: EvaluationView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateEvaluation`,
        Eval,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateEvaluation(Eval: EvaluationView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/UpdateEvaluation`,
        Eval,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetEvalHeaderByID(RESID: string,User:string): Observable<EvalHeader | string> {
        return this._httpClient.get<EvalHeader>(`${this.baseAddress}rfxapi/RFx/GetEvalHeaderByID?RESID=${RESID}&User=${User}`)
            .pipe(catchError(this.errorHandler));
    }
    GetEvalHCsByID(EvalID: string): Observable<EvalHC[] | string> {
        return this._httpClient.get<EvalHC[]>(`${this.baseAddress}rfxapi/RFx/GetEvalHCsByID?EvalID=${EvalID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetEvalICsByID(EvalID: string): Observable<EvalIC[] | string> {
        return this._httpClient.get<EvalIC[]>(`${this.baseAddress}rfxapi/RFx/GetEvalICsByID?EvalID=${EvalID}`)
            .pipe(catchError(this.errorHandler));
    }
    UpdateHeaderStatus(RFxID:string,Status:string):Observable<RFxHeader | string> {
        return this._httpClient.get<RFxHeader>(`${this.baseAddress}rfxapi/RFx/UpdateHeaderStatus?RFxID=${RFxID}&Status=${Status}`)
            .pipe(catchError(this.errorHandler));
    }
    GetEvalRatingByID(RFxID:string):Observable<EvaluationRating | string> {
        return this._httpClient.get<EvaluationRating>(`${this.baseAddress}rfxapi/RFx/GetEvalRating?RFxID=${RFxID}`)
             .pipe(catchError(this.errorHandler));    
    }
    GetMaterialByVendor(RFxID:string):Observable<ByMaterial | string> {
        return this._httpClient.get<ByMaterial>(`${this.baseAddress}rfxapi/RFx/CompareByMaterial?RFxID=${RFxID}`)
             .pipe(catchError(this.errorHandler));    
    }
    GetCriteriaByVendor(RFxID:string):Observable<ByCriteria | string> {
        return this._httpClient.get<ByCriteria>(`${this.baseAddress}rfxapi/RFx/CompareByCriteria?RFxID=${RFxID}`)
             .pipe(catchError(this.errorHandler));    
    }
    CreateAward(RFxAward : RFxAward):Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateAward`,
        RFxAward,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    CreateCEPartner(RfxPartner : RFxCEPartner[]):Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateCEPartner`,RfxPartner,
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.errorHandler));
    }
    CreateCEMaterial(RfxMaterial : RFxCEMaterial[]):Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateCEMaterial`,
        RfxMaterial,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    CreateCECriteria(RfxCriteria : RFxCECriteria[]):Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/CreateCECriteria`,
        RfxCriteria,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetAllAwardedWithAttachments(): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAllAwardedWithAttachments`)
            .pipe(catchError(this.errorHandler));
    }
    GetEvalHeaderByResponse(RFxID:string,AwardedTo:string):Observable<EvalHeader[] | string> {
        return this._httpClient.get<EvalHeader[]>(`${this.baseAddress}rfxapi/RFx/GetEvalHeaderByResponse?RFxID=${RFxID}&RESID=${AwardedTo}`)
        .pipe(catchError(this.errorHandler));
    }
    GetEvalHeaderByEvalID(EvalID: string): Observable<EvalHeader | string> {
        return this._httpClient.get<EvalHeader>(`${this.baseAddress}rfxapi/RFx/GetEvalHeaderByEvalID?EvalID=${EvalID}`)
            .pipe(catchError(this.errorHandler));
    }
    FiterMVendors(key:string,type:string): Observable<MVendor[] | string> {
        return this._httpClient.get<MVendor[]>(`${this.baseAddress}rfxapi/RFx/FilterVendorM?key=${key}&type=${type}`)
            .pipe(catchError(this.errorHandler));
    }
    MuteRFx(ResH:ResHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}rfxapi/RFx/MuteRFx`,
        ResH,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetRFxPieData(): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetRFxPieData`)
            .pipe(catchError(this.errorHandler));
    }
    GetResPeiData(UserName:string): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetResPieData?UserName=${UserName}`)
        .pipe(catchError(this.errorHandler));
    }
    GetEvalPieData(): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetEvalPieData`)
            .pipe(catchError(this.errorHandler));
    }
    GetAwardPieData(): Observable<any> {
        return this._httpClient.get<any>(`${this.baseAddress}rfxapi/RFx/GetAwardPieData`)
            .pipe(catchError(this.errorHandler));
    }
}
