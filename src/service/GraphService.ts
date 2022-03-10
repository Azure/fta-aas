import { ICheckItemAnswered, IGraphQResult } from "../model/ICheckItem";
import { IChecklistDocument } from "../model/IChecklistDocument";
import { ICheck, IGraphQueryResult } from "../model/IGraphQueryResult";

class GraphService {
    processResults(graphQResult: IGraphQueryResult, checklistDoc: IChecklistDocument) : IChecklistDocument {
        let outputdoc = {...checklistDoc,
            items: checklistDoc.items.map<ICheckItemAnswered>((i: ICheckItemAnswered) => {
                const extendedI: ICheckItemAnswered = {
                    ...i,
                    graphQResult: this.assembleOutput(graphQResult.checks.filter(c => c.guid === i.guid))
                };
                return extendedI;
            })
        };
        return outputdoc;
    }

    assembleOutput = (items : ICheck[] | undefined) : IGraphQResult[] => {
        if (!items) return [];

        let toreturn : IGraphQResult[] = items.map(i => 
                {
                    let result : IGraphQResult = {
                    success: i.success,
                    compliant: i.compliant,
                    fail: i.fail,
                    failure: i.failure,
                    result: i.result, 
                    id: i.id
                }
                return result;
            });
        return toreturn;
    }
}

const GraphServiceInstance = new GraphService();

export default GraphServiceInstance;