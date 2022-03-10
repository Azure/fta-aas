//{ \"metadata\": 
//      {
//          \"format\": \"${format}\", 
//          \"timestamp\": \"$(date)\"
//      }, 
//  \"checks\": ["
// SHORT INFO
//      "{
//          \"guid\": \"$this_guid\", 
//          \"success\": \"$success_result\", 
//          \"failure\": \"$failure_result\"
//      }"
// EXTENDED INFO SUCCESS
//      "{
//          \"guid\": \"$this_guid\", 
//          \"result\": \"success or fail\", 
//          \"id\": \"$resource_id\"
//      }"
// POSSIBLE NEW FORMAT
//      "{
//          \"guid\": \"$this_guid\", 
//          \"compliant\": \"boolean\", 
//          \"id\": \"$resource_id\"
//      }"//

interface IGraphQMetadata {
    format: string,
    timestamp: string
}

export interface ICheck {
    guid: string,
    success?: string,
    failure?: string,
    result?: string, 
    fail?: string,
    id?: string
    compliant?: string
}

export interface IGraphQueryResult {
    metadata: IGraphQMetadata,
    checks: ICheck[]
}