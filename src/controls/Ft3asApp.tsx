import { FocusZone, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import {BrowserRouter, Link, Route} from 'react-router-dom';
import { ICheckItemAnswered, Status } from "../model/ICheckItem";
import { IChecklistDocument } from "../model/IChecklistDocument";
import TemplateServiceInstance from "../service/TemplateService";
import { Ft3asChecklist } from "./Ft3asChecklist";
import Ft3AsTemplateSelector from "./Ft3asTemplateSelector";
import { Ft3asToolbar } from "./Ft3asToolbar";
import { Ft3asProgress } from "./Ft3asProgress";
import { setVirtualParent } from '@fluentui/dom-utilities';
import { getAppInsights }  from "../service/TelemetryService";
import TelemetryProvider from '../service/telemetry-provider';

const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
    root: {
        width: '960px',
        margin: '0 auto',
        textAlign: 'center',
        color: '#605e5c',
    },
};

export default function Ft3asApp() {

    const [checklistDoc, setChecklistDoc] = useState<IChecklistDocument>();
    const [showSelectTemplate, setShowSelectTemplate] = useState(false);
    const [percentComplete, setPercentComplete] = useState(0);

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
                    status: i.status ?? Status.NotVerified
                }
                return defaultedI;
            })
        });
    }
    // useEffect(()=>{setChecklistDoc(checklistDoc)}, [checklistDoc]);

    const downloadFile = () => {
        console.log('Test')
        const fileName = 'review.json'
        const fileType = 'text/json'
        var data = JSON.stringify(checklistDoc) 
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const uploadFile = (ev: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
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
            inputElement.onchange= (e) => {
                if ((e.target as HTMLInputElement).files === null) {
                    return
                }
                else {
                    var files = (e.target as HTMLInputElement).files;
                    var file = files?.item(0);

                    if (file) {
                    
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            const contents = event?.target?.result
                            const doc = JSON.parse(contents as string) as IChecklistDocument
                            setChecklistDoc(doc)
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


    return (
        <BrowserRouter>
            <TelemetryProvider instrumentationKey="INSTRUMENTATION_KEY" after={() => { appInsights = getAppInsights() }}>
                <Stack verticalFill styles={stackStyles} tokens={stackTokens}>
                    <Ft3asToolbar
                        onSelectTemplateClick={e => { setShowSelectTemplate(true); }}
                        onDownloadReviewClick={e => { downloadFile(); }}
                        onUploadReviewClick={e => { uploadFile(e); }}
                        />
                    <Ft3asProgress
                        percentComplete={percentComplete}
                    />
                    <FocusZone>
                        <Ft3asChecklist
                            checklistDoc={checklistDoc}
                            questionAnswered={(percentComplete) => { setPercentComplete(percentComplete); }}>
                        </Ft3asChecklist>
                    </FocusZone>
                    <Ft3AsTemplateSelector
                        isOpen={showSelectTemplate}
                        onTemplateSelected={onTemplateSelected}
                        onClose={() => { alert('close?'); setShowSelectTemplate(false); }} />
                </Stack>
            </TelemetryProvider>
        </BrowserRouter>
    );

}
