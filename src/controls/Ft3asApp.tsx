import { FocusZone, IStackStyles, IStackTokens, Pivot, PivotItem, Stack, Text, IDropdownOption } from "@fluentui/react";
import { ICheckItemAnswered } from "../model/ICheckItem";
import React, { useEffect, useState } from "react";
import { ICategory, IChecklistDocument, IWaf } from "../model/IChecklistDocument";
import TemplateServiceInstance from "../service/TemplateService";
import { Ft3asChecklist } from "./Ft3asChecklist";
import Ft3AsTemplateSelector from "./Ft3asTemplateSelector";
import { Ft3asToolbar } from "./Ft3asToolbar";
import { Ft3asProgress } from "./Ft3asProgress";
import Ft3asFilters from "./Ft3asFilters";
import { ISeverity } from "../model/ISeverity";
import { setVirtualParent } from '@fluentui/dom-utilities';
import GraphServiceInstance from "../service/GraphService";
import { IGraphQueryResult } from "../model/IGraphQueryResult";
import CsvGeneratorInstance from '../service/CsvGenerator';
import Ft3asCharts from "./Ft3asCharts";
import { IStatus } from "../model/IStatus";
import { useBeforeunload } from 'react-beforeunload';

export interface IGroupingField {
    [index: number]: IDropdownOption;
}

export interface IFilter {
    [index: number]: any;
}
const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
    root: {
        marginTop: '10px',
        marginLeft: '25px',
        marginRight: '25px',
        textAlign: 'left',
        color: '#605e5c',
    },
};

export default function Ft3asApp() {
    const [isModified, setIsModified] = useState(false);
    const [checklistDoc, setChecklistDoc] = useState<IChecklistDocument>();
    const [multiChecklistDoc, setMultiChecklistDoc] = useState<(IChecklistDocument)[]>();

    const [showSelectTemplate, setShowSelectTemplate] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [percentComplete, setPercentComplete] = useState(0);
    const [visibleCategories, setVisibleCategories] = useState<ICategory[]>();
    const [visibleWaf, setVisibleWaf] = useState<IWaf[]>();
    const [visibleSeverities, setVisibleSeverities] = useState<ISeverity[]>();
    const [visibleStatuses, setVisibleStatuses] = useState<IStatus[]>();
    const [filterText, setFilterText] = useState('');
    const [groupingField, setGroupingField] = React.useState<IDropdownOption>();

    useBeforeunload((event) => {
        if (isModified) {
            event.preventDefault();
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            let initialDoc : any = ['https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json']
            await changeMultiTemplate(initialDoc);
        }
        fetchData()
            .then(() => console.log('loaded'))
            .catch(reason => {
                console.error(reason);
            })
    }, []);

    const onTemplateSelected = async (templateUrl?: string) => {
        if (templateUrl) {
            try {
                await changeTemplate(templateUrl);
            }
            catch (reason) {
                console.log(reason);
            }
        }

        setShowSelectTemplate(false);
    }

    const changeTemplate = async (templateUrl: string) => {
        const doc = await TemplateServiceInstance.openTemplate(templateUrl);
        updateDocument(doc);
    }

    const updateDocument = (doc: IChecklistDocument) => {
        setChecklistDoc({
            ...doc,
            items: doc.items.map<ICheckItemAnswered>((i: ICheckItemAnswered) => {
                const defaultedI: ICheckItemAnswered = {
                    ...i,
                    status: i.status ?? doc.status[0]
                }
                return defaultedI;
            })
        });
        setVisibleCategories(doc.categories);
        setVisibleWaf(doc.waf);
        setVisibleSeverities(doc.severities);
        setIsModified(false);
        setVisibleStatuses(doc.status);
    }

    const generateFileNameTimeStamp = () => {
        const date = new Date();
        const month = (date.getMonth()+1).toString().padStart(2, '0');
        const currentDate = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${month}${currentDate}${date.getFullYear()}` + '_' + `${hours}${minutes}${seconds}`
    }
    const downloadFile = (index:number) => {
        const timeStamp = generateFileNameTimeStamp();
        const fileName = `AzureDesignReview_${timeStamp}.json`;
        const fileType = 'text/json';
        const data = JSON.stringify(multiChecklistDoc)

        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })

        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        downloadHelper(fileName, blob);
        setIsModified(false);
    }

    const downloadCsv = (index:number) => {
        const fileName = getChecklistName(index);
        const arr = ['category', 'subcategory', 'text', 'link', 'guid', 'severity', 'comments'];
        const replacer = (key: string, value: object) => {
            if (typeof value != 'object' && !arr.includes(key)) {
                return void (0);
            } else if (key === 'status') {
                const keys = Object.values(value);
                return keys[0];
            }

            return value;
        }

        CsvGeneratorInstance.JSONToCSVConvertor(JSON.stringify(multiChecklistDoc?.[index], replacer), fileName, true);
    }

    const uploadFile = (ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => {
        ev?.persist();

        Promise.resolve().then(() => {
            const inputElement = document.createElement('input');
            inputElement.style.visibility = 'hidden';
            inputElement.setAttribute('type', 'file');

            document.body.appendChild(inputElement);

            const target = ev?.target as HTMLElement | undefined;

            if (target) {
                setVirtualParent(inputElement, target);
            }

            inputElement.click();
            inputElement.onchange = (e) => {
                if ((e.target as HTMLInputElement).files === null) {
                    return
                }
                else {
                    let files = (e.target as HTMLInputElement).files;
                    let file = files?.item(0);

                    if (file) {

                        let reader = new FileReader();
                        reader.onload = function (event) {
                            const contents = event?.target?.result
                            const doc = JSON.parse(contents as string) as IChecklistDocument
                            updateMultiDocument(doc);
                        };

                        (e.target as HTMLInputElement).value = ''

                        reader.readAsText(file);
                    } else {
                        console.error(
                            'File could not be uploaded. Please try again.'
                        )
                    }
                }
            }

            if (target) {
                setVirtualParent(inputElement, null);
            }

            setTimeout(() => {
                inputElement.remove();
            }, 10000);
        });
    };

    const uploadGraphQResult = (ev: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
        ev?.persist();

        Promise.resolve().then(() => {
            const inputElement = document.createElement('input');
            inputElement.style.visibility = 'hidden';
            inputElement.setAttribute('type', 'file');

            document.body.appendChild(inputElement);

            const target = ev?.target as HTMLElement | undefined;

            if (target) {
                setVirtualParent(inputElement, target);
            }

            inputElement.click();
            inputElement.onchange = (e) => {
                if ((e.target as HTMLInputElement).files === null) {
                    return
                }
                else {
                    let files = (e.target as HTMLInputElement).files;
                    let file = files?.item(0);

                    if (file) {

                        let reader = new FileReader();
                        reader.onload = function (event) {
                            const contents = event?.target?.result;
                            const graphQResult = JSON.parse(contents as string) as IGraphQueryResult;
                            if (checklistDoc) {
                                const doc = GraphServiceInstance.processResults(graphQResult, checklistDoc);
                                updateDocument(doc);
                            }
                        };

                        (e.target as HTMLInputElement).value = ''

                        reader.readAsText(file);
                    } else {
                        console.error(
                            'File could not be uploaded. Please try again.'
                        )
                    }
                }
            }

            if (target) {
                setVirtualParent(inputElement, null);
            }

            setTimeout(() => {
                inputElement.remove();
            }, 10000);
        });
    };

    function downloadHelper(fileName: string, blob: Blob) {
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    }

    const getChecklistName = (index:number): string => {
        if (multiChecklistDoc?.[index] && multiChecklistDoc?.[index]?.metadata['name']) {
            return multiChecklistDoc?.[index].metadata['name'];
        } else {
            return 'No checklist loaded';
        }
    }

    const definePercentComplete = (percentComplete: number) => {
        setPercentComplete(percentComplete);
        setIsModified(true);
    }

    const changeMultiTemplate = async (listOfUrl: []) => {
        const promises = listOfUrl.map(url => fetch(url));
        let data: any = [];
        const response = await Promise.all(promises)
        try {
            if (response.length) {
                await Promise.all(response.map(async (item) => {
                    const respObject = (await item.json()) as IChecklistDocument
                    data = data.concat(respObject);
                }))
                updateMultiDocument(data)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const updateMultiDocument = (data: any) => {
        let categoriesArray: (ICategory)[] = [];
        let wafArray: (IWaf)[] = [];
        let severityArray: (ISeverity)[] = [];
        let statusArray: (IStatus)[] = [];
        const temp = data.map((item: IChecklistDocument) => {
            item?.categories?.forEach((v)=>{
                if(!categoriesArray?.some((val)=>val.name===v.name)){
                    categoriesArray = categoriesArray.concat(v);

                }
            })
            
            if(wafArray?.length===0){
                wafArray = wafArray.concat(item?.waf);
            }
            if(severityArray?.length===0){
                severityArray = severityArray.concat(item?.severities);
            }
            if(statusArray?.length===0){
                statusArray = statusArray.concat(item?.status);
            }
            return {
                ...item,
                items: item?.items?.map<ICheckItemAnswered>((i: ICheckItemAnswered) => {
                    const defaultedI: ICheckItemAnswered = {
                        ...i,
                        status: i.status ?? item?.status?.[0]
                    }
                    return defaultedI;
                })
            }
        })
        setVisibleCategories(categoriesArray);
        setVisibleWaf(wafArray);
        setVisibleSeverities(severityArray);
        setIsModified(false);
        setVisibleStatuses(statusArray)
        setMultiChecklistDoc(temp);
    }
    const onMultiTemplateSelected = async (listOfUrl: any) => {
        if (listOfUrl?.length) {
            try {
                await changeMultiTemplate(listOfUrl);
            }
            catch (reason) {
                console.log(reason);
            }
        }
    }

    return (
        <>
            
                        <Stack styles={stackStyles} tokens={stackTokens}>
                       
                            <Ft3asToolbar
                                isModified={isModified}
                                onFilter={e => { setShowFilters(true) }}
                                onSelectTemplateClick={e => { setShowSelectTemplate(true); }}
                                onDownloadReviewClick={e => { downloadFile(0); }}
                                onDownloadCsvClick={e => { downloadCsv(0); }}
                                onUploadReviewClick={e => { uploadFile(e); }}
                                onUploadGraphQResultClick={e => { uploadGraphQResult(e); }}
                            />
                             {
                multiChecklistDoc?.map((doc,index) => (
                    <>
                  
                            <Text variant={'xxLarge'}>{getChecklistName(index)}</Text>
                            <FocusZone>
                                <Pivot aria-label="Checklist">
                                    <PivotItem headerText="Checklist" itemIcon="GridViewSmall">
                                        <Ft3asProgress percentComplete={percentComplete} />
                                        <Ft3asChecklist
                                            index= {index}
                                            checklistDoc={doc}
                                            questionAnswered={definePercentComplete}
                                            visibleWaf={visibleWaf}
                                            visibleCategories={visibleCategories}
                                            visibleSeverities={visibleSeverities}
                                            visibleStatuses={visibleStatuses}
                                            filterText={filterText}
                                            groupingField={groupingField}
                                        />
                                    </PivotItem>
                                    <PivotItem headerText="Dashboard" itemIcon="BIDashboard">
                                        <Ft3asCharts checklistDoc={doc} />
                                    </PivotItem>
                                </Pivot>
                            </FocusZone>
                            </>
                                ))}
                            {multiChecklistDoc?.[0] ? (<Ft3asFilters
                                isOpen={showFilters}
                                checklistDoc={multiChecklistDoc?.[0]}
                                wafChanged={setVisibleWaf}
                                categoriesChanged={setVisibleCategories}
                                severitiesChanged={setVisibleSeverities}
                                statusesChanged={setVisibleStatuses}
                                filterText={filterText}
                                filterTextChanged={setFilterText}
                                groupChange={setGroupingField}
                                onClose={() => setShowFilters(false)}></Ft3asFilters>) : (<></>)}
                                
                                <Ft3AsTemplateSelector
                                onMultiTemplateSelected={onMultiTemplateSelected}
                                isOpen={showSelectTemplate}
                                onTemplateSelected={onTemplateSelected}
                                onClose={() => { setShowSelectTemplate(false); }} />
                                
                        </Stack>
        </>

    );
}
