import { CommonClass } from './common';

export class RFxH extends CommonClass{
    Client: string;
    Company: string;
    RFxID: string;
    Plant: string;
    RFxType: string;
    RFxGroup: string;
    Status: string;
    Title: string;
    ValidityStartDate: Date | string | null;
    ValidityEndDate: Date | string | null;
    ResponseStartDate: Date | string | null;
    ResponseStartTime: string;
    ResponseEndDate: Date | string | null;
    ResponseEndTime: string;
    Currency: string;
    Invited: string;
    Responded: string;
    Evaluated: string;
    ReleasedOn: Date | string | null;
    ReleasedBy: string;    
}

export class MVendor extends CommonClass {
    Client: string;
    Company: string;
    PatnerID: string;
    VendorName: string;
    GST: string;
    EmailID1: string;
    EmailID2: string;
    ContactPerson: string;
    ContactPersonMobile: string;
    Type:string;
    City:string;
}
export class MVendorView extends CommonClass {
    Client: string;
    Company: string;
    PatnerID: string;
    VendorName: string;
    GST: string;
    EmailID1: string;
    EmailID2: string;
    ContactPerson: string;
    ContactPersonMobile: string;
    Type:string;
    City:string;
    Checked:boolean;
}

export class MMaterial extends CommonClass {
    Client: string;
    Company: string;
    Material: string;
    MaterialText: string;
    UOM: string;
}

export class MRFxType extends CommonClass {
    Client: string;
    Company: string;
    RFQType:string;
    Text:string;
}

export class MRFxGroup extends CommonClass {
    Client: string;
    Company: string;
    RFQGroup:string;
    Text:string;
}

export class RFxHeader extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    Plant: string;
    RFxType: string;
    RFxGroup: string;
    Status: string;
    Title: string;
    ValidityStartDate: Date;
    ValidityEndDate: Date;
    ResponseStartDate: Date;
    ResponseStartTime: string;
    ResponseEndDate: Date;
    ResponseEndTime: string;
    Currency: string;
    Invited: string;
    Responded: string;
    Evaluated: string;
    ReleasedOn: Date | string | null;
    ReleasedBy: string;
}

export class RFxItem extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    Item: string;
    Material: string;
    MaterialText: string;
    TotalQty: number;
    PerScheduleQty: number | null;
    TotalSchedules: string;
    BiddingPriceLow: string;
    BiddingPriceHigh: string;
    Interval: string;
    UOM: string;
    IncoTerm: string;
    LeadTime: string;
    Rating:string;
    Notes:string;
    Attachment:string;
}

export class RFxHC extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    CriteriaID: string;
    Text: string;
}

export class RFxIC extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    Item: string;
    Criteria: string;
    Text: string;
}

export class RFxOD extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    QuestionID: number;
    Qusetion: string;
    AnswerType: string;
    //Answer:string;
}

export class RFxODAttachment extends CommonClass{
    Client: string;
    Company: string;
    RFxID: string;
    DocumentID: number;
    DocumentTitle: string;
    DocumentName: string;
}

export class RFxVendor extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    PatnerID: string;
    Date: Date | string;
    IsMuted: boolean;
    Responded: string;
    RespondedOn: Date | string | null;
}
export class RFxVendorView extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    PatnerID:string;
    Type: string;
    VendorName:string;
    GSTNumber: string;
    City: string;
}
export class RFxPartner extends CommonClass {
    Client: string;
    Company: string;
    RFxID: string;
    Type: string;
    User: Date | string;
}
export class RFxRemark extends CommonClass{
    Client:string;
    Company:string;
    RFxID:string;
    SlNo:string;
    Remark:string;
}


export class ResHeader extends CommonClass {
    Client: string;
    Company: string;
    RESID: string;
    RFxID: string;
    PartnerID: string;
    Date: Date | string;
    ItemResponded: string;
    ResRemarks: string;
}

export class ResItem extends CommonClass {
    Client: string;
    Company: string;
    RESID: string;
    Item: string;
    RFxID: string;
    Price: number;
    LeadTime: string;
    USPRemark: string;
    PriceRating: string;
    LeadTimeRating: string;
    LeadTimeAccept:string;
    LeadTimeRemark:string;
}

export class ResOD extends CommonClass {
    Client: string;
    Company: string;
    RESID: string;
    QuestionID: number;
    RFxID: string;
    Answer: string;
    Attachment: string;
    Date: Date | string;
}
export class ResODAttachment extends CommonClass{
    Client: string;
    Company: string;
    RFxID: string;
    RESID:string;
    DocumentID: number;
    DocumentTitle: string;
    DocumentName: string;
}

export class ResHC extends CommonClass {
    Client: string;
    Company: string;
    RESID: string;
    CriteriaID: string;
    Rating: string;
    EvaluatedOn: Date | string;
}

export class ResIC extends CommonClass {
    Client: string;
    Company: string;
    RESID: string;
    Item: string;
    Criteria: string;
    Rating: string;
    EvaluatedOn: Date | string;
}


export class EvalHeader extends CommonClass {
    Client: string;
    Company: string;
    EvalID: string;
    RESID: string;
    RFxID: string;
    User: string;
    Date: Date | string;
    ItemsResponsed: string;
    EvalRemarks: string;
}

export class EvalHC extends CommonClass {
    Client: string;
    Company: string;
    EvalID: string;
    Criteria: string;
    Rating: string;
}

export class EvalIC extends CommonClass {
    Client: string;
    Company: string;
    EvalID: string;
    Item: string;
    Criteria: string;
    Rating: string;
}


export class RFxView {
    Client: string;
    Company: string;
    RFxID: string;
    Plant: string;
    RFxType: string;
    RFxGroup: string;
    Status: string;
    Title: string;
    ValidityStartDate: Date | string | null;
    ValidityEndDate: Date | string | null;
    ResponseStartDate: Date | string | null;
    ResponseStartTime: string;
    ResponseEndDate: Date | string | null;
    ResponseEndTime: string;
    Currency: string;
    Invited: string;
    Responded: string;
    Evaluated: string;
    ReleasedOn: Date | string | null;
    ReleasedBy: string;
    RFxItems: RFxItem[];
    RFxHCs: RFxHC[];
    RFxICs: RFxIC[];
    RFxPartners: RFxPartner[];
    RFxVendors: RFxVendor[];
    RFxODs: RFxOD[];
    RFxODAttachments:RFxODAttachment[];
    RFxRemark:RFxRemark;
}


export class ResponseView {
    Client: string;
    Company: string;
    RESID: string;
    RFxID: string;
    PartnerID: string;
    Date: Date | string;
    ItemResponded: string;
    ResRemarks: string;
    ResItems: ResItem[];
    ResHCs: ResHC[];
    ResICs: ResIC[];
    ResODs: ResOD[];
    ResODAttach : ResODAttachment[];
}
export class RespondedItems{
    isResponded:boolean;
    Item:ResItem;
}
export class RespondedODs{
    isResponded:boolean;
    OD:ResOD;
}
export class RespondedODAttachments{
    isResponded:boolean;
    Attachment:ResODAttachment;
}