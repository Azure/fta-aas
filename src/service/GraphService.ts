import { stringify } from "querystring";
import { ICheckItemAnswered, IGraphQResult } from "../model/ICheckItem";
import { IChecklistDocument } from "../model/IChecklistDocument";
import { ICheck, IGraphQueryResult } from "../model/IGraphQueryResult";

class GraphService {
    processResults(graphQResult: IGraphQueryResult, checklistDoc: IChecklistDocument) : IChecklistDocument {
        let outputdoc = {...checklistDoc,
            items: checklistDoc.items.map<ICheckItemAnswered>((i: ICheckItemAnswered) => {
                const extendedI: ICheckItemAnswered = {
                    ...i,
                    graphQResult: this.assembleOutput(graphQResult.checks.find(c => c.guid === i.guid))
                };
                return extendedI;
            })
        };
        return outputdoc;
    }

    assembleOutput = (item : ICheck | undefined) : IGraphQResult => {
        if (!item) return {};

        let toreturn : IGraphQResult = {
            success: item.success,
            compliant: item.compliant,
            fail: item.fail,
            failure: item.failure,
            result: item.result, 
            id: item.id
        };
        return toreturn;
    }
}

const GraphServiceInstance = new GraphService();

export default GraphServiceInstance;