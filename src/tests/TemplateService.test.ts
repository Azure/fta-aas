import TemplateServiceInstance from '../service/TemplateService';
import { IGHFileList } from '../model/IGHFileList'
import { ICheckList, IParseResult } from '../model/IParseResult';
import GHDownloaderInstance from '../service/GHDownloader';
import GHParserInstance from '../service/GHParser';

jest.mock('../service/GHDownloader');
jest.mock('../service/GHParser');

it('Download checklist template', () => {
    const checklistSampleUrl = 'https://github.com/Azure/review-checklists/blob/main/checklists/aks_checklist.en.json';
    TemplateServiceInstance.openTemplate(checklistSampleUrl).then(doc => {
        console.info(doc.items.length);
    });
});

it('Asks the GHDownloader to get the file list', () => {
    TemplateServiceInstance.init();
    expect(GHDownloaderInstance.getAllFiles).toBeCalledTimes(1);
});

it('Asks the GHParser to parse the file list', async () => {
    const theresponse : IGHFileList = {tree: [] };
    GHDownloaderInstance.getAllFiles = jest.fn(() => Promise.resolve(theresponse));
    
    await TemplateServiceInstance.init();
    expect(GHParserInstance.parse).toBeCalledTimes(1);
    expect(GHParserInstance.parse).toBeCalledWith(theresponse);
});

it('Returns the list of available template names', async () => {
    //setup mock
    const checklist1 : ICheckList = { name: "check1", languages: ["en", "es"], categories: ["cat1", "cat2"] };
    const checklist2 : ICheckList = { name: "check2", languages: ["en", "nl"], categories: ["cat3", "cat4"] };
    const checklists : ICheckList[] = [ checklist1, checklist2 ];
    const theResponse : IParseResult = { checklists: checklists };
    const parseMock = jest.fn()
        .mockReturnValueOnce(theResponse);

    GHParserInstance.parse = parseMock;

    //init
    await TemplateServiceInstance.init();
    
    //test
    var names = TemplateServiceInstance.getAvailableTemplateNames();
    expect(names).toContain( "check1" );
    expect(names).toContain( "check2" );
});

it('Returns available languages for a checklist', async () => {
    //setup mock
    const checklist1 : ICheckList = { name: "check1", languages: ["en", "es"], categories: ["cat1", "cat2"] };
    const checklist2 : ICheckList = { name: "check2", languages: ["en", "nl"], categories: ["cat3", "cat4"] };
    const checklists : ICheckList[] = [ checklist1, checklist2 ];
    const theResponse : IParseResult = { checklists: checklists };
    const parseMock = jest.fn()
        .mockReturnValueOnce(theResponse);

        GHParserInstance.parse = parseMock;

    //init
    await TemplateServiceInstance.init();
    
    //test
    var languages1 = TemplateServiceInstance.getAvailableLanguagesforTemplate(theResponse.checklists[0].name);
    expect(languages1).toContain( "en" );
    expect(languages1).toContain( "es" );    
    var languages2 = TemplateServiceInstance.getAvailableLanguagesforTemplate("check2");
    expect(languages2).toContain( "en" );
    expect(languages2).toContain( "nl" );    
});