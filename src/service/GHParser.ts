import { IGHFileList } from "../model/IGHFileList";
import { IParseResult } from "../model/IParseResult";

class GHParser {
    parse(listToParse : Promise<IGHFileList>) : IParseResult {
        return {} as IParseResult;
    }
}

export default GHParser;