import { IGHFileList } from "../model/IGHFileList";
import { IParseResult } from "../model/IParseResult";

class GHParser {
    parse(listToParse : IGHFileList) : IParseResult {
        let result : IParseResult = {checklists: []};
        for ( let element of listToParse.tree){
            if ( element.path.match('[a-z]+_checklist.[a-z]+.json')) {      
                let name = this.findTechnology(element.path);
                let language = this.findLanguage(element.path);
                let existing = result.checklists.find(o => o.name === name)
                if (! existing) {
                    result.checklists.push({name: name, languages: [language], categories: []});
                }
                else {
                    existing.languages.push(language);
                }
            }
        }
        return result;
    }
    
    findLanguage(path: string) {
        let startIndex = path.indexOf('.');
        let endIndex = path.indexOf('.', startIndex+1);
        return path.slice(startIndex +1, endIndex);
    }

    findTechnology(element : string) : string {
        let startIndex = element.indexOf("/");
        let endIndex = element.lastIndexOf("_");
        return element.slice(startIndex+1, endIndex);
    }
}

const ghParserInstance = new GHParser();

export default ghParserInstance;