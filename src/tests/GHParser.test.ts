import { IGHFileList, ITreeItem } from '../model/IGHFileList';
import GHParserInstance from '../service/GHParser';

it('Adds the checklist only once to the result', () => {
    let item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    let item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    let item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    let item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    let listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    let result = GHParserInstance.parse(listToParse)
    expect(result.checklists.length).toBe(1);
});

it('Adds another checklist if it sees another name', () => {
    let item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    let item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    let item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    let item4 : ITreeItem = { path: "avd_checklist.ko.json", url: new URL("http://nothing.com")};
    let listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    let result = GHParserInstance.parse(listToParse)
    expect(result.checklists.length).toBe(2);
});

it('Creates an aks checklist with all languages', () => {
    let item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    let item2 : ITreeItem = { path: "aks_checklist.es.json", url: new URL("http://nothing.com")};
    let item3 : ITreeItem = { path: "aks_checklist.ja.json", url: new URL("http://nothing.com")};
    let item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    let listToParse : IGHFileList = {tree: [item1, item2, item3, item4]};
    
    let result = GHParserInstance.parse(listToParse);
    let aksChecklist = result.checklists.find(cl => cl.name === "aks");
    expect(aksChecklist?.languages.length).toBe(4);
});

it('Can do this for multiple tech and languages', () => {
    let item1 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    let item2 : ITreeItem = { path: "avd_checklist.es.json", url: new URL("http://nothing.com")};
    let item3 : ITreeItem = { path: "abc_checklist.ja.json", url: new URL("http://nothing.com")};
    let item4 : ITreeItem = { path: "aks_checklist.ko.json", url: new URL("http://nothing.com")};
    let item5 : ITreeItem = { path: "abc_checklist.ko.json", url: new URL("http://nothing.com")};
    let item6 : ITreeItem = { path: "avd_checklist.ko.json", url: new URL("http://nothing.com")};
    let item7 : ITreeItem = { path: "xyz_checklist.ko.json", url: new URL("http://nothing.com")};
    let listToParse : IGHFileList = {tree: [item1, item2, item3, item4, item5, item6, item7]};
    
    let result = GHParserInstance.parse(listToParse);
    let aksChecklist = result.checklists.find(cl => cl.name === "aks");
    let avdChecklist = result.checklists.find(cl => cl.name === "avd");
    let abcChecklist = result.checklists.find(cl => cl.name === "abc");
    let xyzChecklist = result.checklists.find(cl => cl.name === "xyz");
    expect(aksChecklist?.languages.length).toBe(2);
    expect(aksChecklist?.languages).toContain('en');
    expect(aksChecklist?.languages).toContain('ko');
    expect(avdChecklist?.languages.length).toBe(2);
    expect(abcChecklist?.languages.length).toBe(2);
    expect(xyzChecklist?.languages.length).toBe(1);
});

it('Ignores any files that dont comply to the tech_checklist.lang.json format', () => {
    let item0 : ITreeItem = { path: "aks_checklist.en.json", url: new URL("http://nothing.com")};
    let item1 : ITreeItem = { path: "README.md", url: new URL("http://nothing.com")};
    let item2 : ITreeItem = { path: "avd_checklist.es.json", url: new URL("http://nothing.com")};

    let listToParse : IGHFileList = {tree: [item0, item1, item2]};
    
    let result = GHParserInstance.parse(listToParse);
    let avdChecklist = result.checklists.find(cl => cl.name === "avd");

    expect(result.checklists.length).toBe(2);
    expect(avdChecklist?.languages.length).toBe(1);
});