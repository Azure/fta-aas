import { FocusZone, IStackStyles, IStackTokens, Pivot, PivotItem, Stack, Text, } from "@fluentui/react";
import { ICheckItemAnswered } from "../model/ICheckItem";
import React, { useEffect, useState } from "react";
import { ICategory, IChecklistDocument } from "../model/IChecklistDocument";
import { BrowserRouter } from 'react-router-dom';
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
import { getAppInsights } from "../service/TelemetryService";
import TelemetryProvider from '../service/telemetry-provider';
import CsvGeneratorInstance from '../service/CsvGenerator';
import Ft3asCharts from "./Ft3asCharts";

const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
    root: {
        // width: '960px',
        marginTop: '10px',
        marginLeft: '25px',
        marginRight: '25px',
        // margin: '100 auto',
        textAlign: 'left',
        color: '#605e5c',
    },
};

export default function Ft3asApp() {
    const [isModified, setIsModified] = useState(false);
    const [checklistDoc, setChecklistDoc] = useState<IChecklistDocument>();
    const [showSelectTemplate, setShowSelectTemplate] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const [percentComplete, setPercentComplete] = useState(0);
    const [visibleCategories, setVisibleCategories] = useState<ICategory[]>();
    const [visibleSeverities, setVisibleSeverities] = useState<ISeverity[]>();
    const [filterText, setFilterText] = useState('');
    const appInsightKey = process.env.REACT_APP_APP_INSIGHTS_KEY

    let appInsights = null;

    useEffect(() => {
        const fetchData = async () => {
            await changeTemplate('https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json');
        }
        fetchData()
            .then(() => console.log('loaded'))
            .catch(reason => {
                console.error(reason);
            })
    }, []);

    const onTemplateSelected = (templateUrl?: string) => {
        if (templateUrl) {
            changeTemplate(templateUrl)
                .then(() => console.log(templateUrl + ' loaded?'))
                .catch(reason => console.error(reason));
        } else {
            console.log('no template?');
        }
        setShowSelectTemplate(false);
    }

    const changeTemplate = async (templateUrl: string) => {
        const doc = await TemplateServiceInstance.openTemplate(templateUrl);

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
        setVisibleSeverities(doc.severities);
        setIsModified(false);
    }
    // useEffect(()=>{setChecklistDoc(checklistDoc)}, [checklistDoc]);

    const downloadFile = () => {
        const fileName = `${getChecklistName()}.json`;
        const fileType = 'text/json';
        const data = JSON.stringify(checklistDoc)
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        downloadHelper(fileName, blob);
        setIsModified(false);
    }

    const downloadCsv = () => {
        const fileName = getChecklistName();
        //const replacer = (key: string, value: object) => typeof value === 'undefined' ? null : value;
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

        CsvGeneratorInstance.JSONToCSVConvertor(JSON.stringify(checklistDoc, replacer), fileName, true);
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
                            setChecklistDoc(doc)
                            setIsModified(false);
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
                                setChecklistDoc(doc);
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

    const getChecklistName = (): string => {
        if (checklistDoc && checklistDoc.metadata['name']) {
            return checklistDoc.metadata['name'];
        } else {
            return 'No checklist loaded';
        }
    }


    const definePercentComplete = (percentComplete: number) => {
        setPercentComplete(percentComplete);
        setIsModified(true);
    }

    return (
        <BrowserRouter>
            <TelemetryProvider instrumentationKey={appInsightKey} after={() => { appInsights = getAppInsights() }}>
                <Stack verticalFill styles={stackStyles} tokens={stackTokens}>
                    <Ft3asToolbar
                        isModified={isModified}
                        onFilter={e => { setShowFilters(true) }}
                        onSelectTemplateClick={e => { setShowSelectTemplate(true); }}
                        onDownloadReviewClick={e => { downloadFile(); }}
                        onDownloadCsvClick={e => { downloadCsv(); }}
                        onUploadReviewClick={e => { uploadFile(e); }}
                        onUploadGraphQResultClick={e => { uploadGraphQResult(e); }}
                    />
                    <Text variant={'xxLarge'}>{getChecklistName()}</Text>
                    <FocusZone>
                        <Pivot aria-label="Checklist">
                            <PivotItem headerText="Checklist" itemIcon="GridViewSmall">


                                <Ft3asProgress percentComplete={percentComplete} />
                                <Ft3asChecklist
                                    checklistDoc={checklistDoc}
                                    questionAnswered={definePercentComplete}
                                    visibleCategories={visibleCategories}
                                    visibleSeverities={visibleSeverities}
                                    filterText={filterText}
                                >
                                </Ft3asChecklist>
                            </PivotItem>
                            <PivotItem headerText="Dashboard" itemIcon="BIDashboard">
                                <Ft3asCharts checklistDoc={checklistDoc} />
                            </PivotItem>
                        </Pivot>
                    </FocusZone>

                    {checklistDoc ? (<Ft3asFilters
                        isOpen={showFilters}
                        checklistDoc={checklistDoc}
                        categoriesChanged={setVisibleCategories}
                        severitiesChanged={setVisibleSeverities}
                        filterTextChanged={setFilterText}
                        onClose={() => setShowFilters(false)}></Ft3asFilters>) : (<></>)}


                    <Ft3AsTemplateSelector
                        isOpen={showSelectTemplate}
                        onTemplateSelected={onTemplateSelected}
                        onClose={() => { setShowSelectTemplate(false); }} />
                </Stack>
            </TelemetryProvider>
        </BrowserRouter>
    );

}
