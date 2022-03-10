import { ICheckItemAnswered } from '../model/ICheckItem';
import { IChecklistDocument } from '../model/IChecklistDocument';
import { IGraphQueryResult } from '../model/IGraphQueryResult';
import GraphServiceInstance from '../service/GraphService';

const guid1 = "abc123";
const guid2 = "def456";
const item1 : ICheckItemAnswered = { guid: guid1, category: "", subcategory: "", ha: 1, text: "", severity: { description: "", name: "" } };
const item2 : ICheckItemAnswered = { guid: guid2, category: "", subcategory: "", ha: 1, text: "", severity: { description: "", name: "" } };
const baseCheckListDoc : IChecklistDocument = {
    items: [ 
        item1, 
        item2 
    ],
    categories: [],
    metadata: [],
    severities: [],
    status: []
};

it('Can map success graph results to the correct checklistItem', () => {
    //Arrange

    let success1 = "success1";
    let success2 = "success2";
    let graphQResult : IGraphQueryResult = { 
        metadata: {
            format: "", timestamp: ""
        },
        checks: [
            { guid: guid1, success: success1 },
            { guid: guid2, success: success2 }
        ]
    };

    //Act
    let output = GraphServiceInstance.processResults(graphQResult, baseCheckListDoc);

    //Assert
    let item1inoutput = output.items.find(i => i.guid === guid1);
    let item2inoutput = output.items.find(i => i.guid === guid2);
    expect(item1inoutput?.graphQResult?.success).toBe(success1);
    expect(item2inoutput?.graphQResult?.success).toBe(success2);
});

//since we don't know what might be filled out in the graphQresult, we just expect all fields can be mapped...
it('Can map multiple graph results to the graphQResult of the checklistItem', () => {
    //Arrange

    let success1 = "success1";
    let success2 = "success2";
    let compliant1 = "compliant1";
    let compliant2 = "compliant2";
    let fail1 = "fail1";
    let fail2 = "fail2";
    let failure1 = "failure1";
    let failure2 = "failure2";
    let result1 = "result1";
    let result2 = "result2";
    let id1 = "id1";
    let id2 = "id2";
    let graphQResult : IGraphQueryResult = { 
        metadata: {
            format: "", timestamp: ""
        },
        checks: [
            { guid: guid1, success: success1, compliant: compliant1, fail: fail1, failure: failure1, result: result1, id: id1 },
            { guid: guid2, success: success2, compliant: compliant2, fail: fail2, failure: failure2, result: result2, id: id2 }
        ]
    };

    //Act
    let output = GraphServiceInstance.processResults(graphQResult, baseCheckListDoc);

    //Assert
    let item1inoutput = output.items.find(i => i.guid === guid1);
    let item2inoutput = output.items.find(i => i.guid === guid2);
    expect(item1inoutput?.graphQResult?.success).toBe(success1);
    expect(item1inoutput?.graphQResult?.compliant).toBe(compliant1);
    expect(item1inoutput?.graphQResult?.fail).toBe(fail1);
    expect(item1inoutput?.graphQResult?.failure).toBe(failure1);
    expect(item1inoutput?.graphQResult?.result).toBe(result1);
    expect(item1inoutput?.graphQResult?.id).toBe(id1);
    expect(item2inoutput?.graphQResult?.success).toBe(success2);
    expect(item2inoutput?.graphQResult?.compliant).toBe(compliant2);
    expect(item2inoutput?.graphQResult?.fail).toBe(fail2);
    expect(item2inoutput?.graphQResult?.failure).toBe(failure2);
    expect(item2inoutput?.graphQResult?.result).toBe(result2);
    expect(item2inoutput?.graphQResult?.id).toBe(id2);
});

it('Should not map in case guids dont match', () => {
    //Arrange

    let success1 = "success1";
    let success2 = "success2";
    let compliant1 = "compliant1";
    let compliant2 = "compliant2";
    let fail1 = "fail1";
    let fail2 = "fail2";
    let failure1 = "failure1";
    let failure2 = "failure2";
    let result1 = "result1";
    let result2 = "result2";
    let id1 = "id1";
    let id2 = "id2";
    let graphQResult : IGraphQueryResult = { 
        metadata: {
            format: "", timestamp: ""
        },
        checks: [
            { guid: "otherguid", success: success1, compliant: compliant1, fail: fail1, failure: failure1, result: result1, id: id1 },
            { guid: guid2, success: success2, compliant: compliant2, fail: fail2, failure: failure2, result: result2, id: id2 }
        ]
    };

    //Act
    let output = GraphServiceInstance.processResults(graphQResult, baseCheckListDoc);

    //Assert
    let item1inoutput = output.items.find(i => i.guid === guid1);
    let item2inoutput = output.items.find(i => i.guid === guid2);
    expect(item1inoutput?.graphQResult?.success).toBeUndefined();
    expect(item1inoutput?.graphQResult?.compliant).toBeUndefined();
    expect(item1inoutput?.graphQResult?.fail).toBeUndefined();
    expect(item1inoutput?.graphQResult?.failure).toBeUndefined();
    expect(item1inoutput?.graphQResult?.result).toBeUndefined();
    expect(item1inoutput?.graphQResult?.id).toBeUndefined();
    expect(item2inoutput?.graphQResult?.success).toBe(success2);
    expect(item2inoutput?.graphQResult?.compliant).toBe(compliant2);
    expect(item2inoutput?.graphQResult?.fail).toBe(fail2);
    expect(item2inoutput?.graphQResult?.failure).toBe(failure2);
    expect(item2inoutput?.graphQResult?.result).toBe(result2);
    expect(item2inoutput?.graphQResult?.id).toBe(id2);
});