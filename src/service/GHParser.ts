import { IGHFileList, ITreeItem } from "../model/IGHFileList";
import { IParseResult } from "../model/IParseResult";

class GHParser {
    parse(listToParse : IGHFileList) : IParseResult {
        var result : IParseResult = {checklists: []};
        for ( var element of listToParse.tree){
            var name = this.findTechnology(element.path);
            var language = this.findLanguage(element.path);
            var existing = result.checklists.find(o => o.name === name)
            if (! existing) {
                result.checklists.push({name: name, languages: [language], categories: []});
            }
            else {
                existing.languages.push(language);
            }
        }
        return result;
    }
    findLanguage(path: string) {
        var startIndex = path.indexOf('.');
        var endIndex = path.indexOf('.', startIndex);
        return path.slice(startIndex, endIndex-startIndex);
    }

    findTechnology(element : string) : string {
        var index = element.indexOf("_");
        return element.slice(0, index);
    }
}

const ghParserInstance = new GHParser();

export default ghParserInstance;