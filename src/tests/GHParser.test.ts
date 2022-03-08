import { IGHFileList, ITreeItem } from '../model/IGHFileList';
import GHParserInstance from '../service/GHParser';

it('Adds the checklist only once to the result', () => {
    var item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    var item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    var item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    var item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    var listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    var result = GHParserInstance.parse(listToParse)
    expect(result.checklists.length).toBe(1);
});

it('Adds another checklist if it sees another name', () => {
    var item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    var item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    var item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    var item4 : ITreeItem = { path: "avd_checklist.ko.json", url: new URL("http://nothing.com")};
    var listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    var result = GHParserInstance.parse(listToParse)
    expect(result.checklists.length).toBe(2);
});

it('Creates an aks checklist with all languages', () => {
    var item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    var item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    var item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    var item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    var listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    var result = GHParserInstance.parse(listToParse);
    var aksChecklist = result.checklists.find(cl => cl.name === "aks");
    expect(aksChecklist?.languages.length).toBe(4);
});

it('Can do this for multiple tech and languages', () => {
    var item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    var item2 : ITreeItem = { path: "avd_checklist.es.json", url: new URL("http://nothing.com")};
    var item3 : ITreeItem = { path: "abc_checklist.ja.json", url: new URL("http://nothing.com")};
    var item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    var item5 : ITreeItem = { path: "abc_checklist.ko.json", url: new URL("http://nothing.com")};
    var item6 : ITreeItem = { path: "avd_checklist.ko.json", url: new URL("http://nothing.com")};
    var item7 : ITreeItem = { path: "xyz_checklist.ko.json", url: new URL("http://nothing.com")};
    var listToParse : IGHFileList = {tree: [item1, item2, item3, item4, item5, item6, item7]};
    
    var result = GHParserInstance.parse(listToParse);
    var aksChecklist = result.checklists.find(cl => cl.name === "aks");
    var avdChecklist = result.checklists.find(cl => cl.name === "avd");
    var abcChecklist = result.checklists.find(cl => cl.name === "abc");
    var xyzChecklist = result.checklists.find(cl => cl.name === "xyz");
    expect(aksChecklist?.languages.length).toBe(2);
    expect(avdChecklist?.languages.length).toBe(2);
    expect(abcChecklist?.languages.length).toBe(2);
    expect(xyzChecklist?.languages.length).toBe(1);
});