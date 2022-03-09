import { IChecklistDocument } from "../model/IChecklistDocument";
import { IGraphQueryResult } from "../model/IGraphQueryResult";

class GraphService {
    processResults(graphQResult: IGraphQueryResult, checklistDoc: IChecklistDocument | undefined) : IChecklistDocument {
        throw new Error("Method not implemented.");
    }
}

const GraphServiceInstance = new GraphService();

export default GraphServiceInstance;