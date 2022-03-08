import { IGHFileList } from "../model/IGHFileList";
import { IParseResult } from "../model/IParseResult";

class GHParser {
    parse(listToParse : IGHFileList) : IParseResult {
        return {} as IParseResult;
    }
}

const ghParserInstance = new GHParser();

export default ghParserInstance;