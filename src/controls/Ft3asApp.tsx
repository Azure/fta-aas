import { FocusZone, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { useEffect, useState } from "react";
import { ICheckItemAnswered, Status } from "../model/ICheckItem";
import { IChecklistDocument } from "../model/IChecklistDocument";
import TemplateServiceInstance from "../service/TemplateService";
import { Ft3asChecklist } from "./Ft3asChecklist";
import Ft3AsTemplateSelector from "./Ft3asTemplateSelector";
import { Ft3asToolbar } from "./Ft3asToolbar";
import { Ft3asProgress } from "./Ft3asProgress";

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
    const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
    const [showSelectTemplate, setShowSelectTemplate] = useState(false);
    const [percentComplete, setPercentComplete] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            await changeTemplate('https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json');
            const templates = await TemplateServiceInstance.getAvailableTemplates();
            console.log('template count ' + templates.length);
            setAvailableTemplates(templates);
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

    return (
        <Stack verticalFill styles={stackStyles} tokens={stackTokens}>
            <Ft3asToolbar
                onSelectTemplateClick={e => {
                    setShowSelectTemplate(true);
                }} />
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
                availableTemplates={availableTemplates}
                isOpen={showSelectTemplate}
                onTemplateSelected={onTemplateSelected}
                onClose={() => { alert('close?'); setShowSelectTemplate(false); }} />
        </Stack>
    );

}