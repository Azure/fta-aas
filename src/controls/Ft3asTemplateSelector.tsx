import { DefaultButton, Dropdown, IDropdownOption, Panel, PrimaryButton } from "@fluentui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import TemplateServiceInstance from "../service/TemplateService";

const buttonStyles = { root: { marginRight: 8 } };

interface Ft3AsTemplateSelectorProps {
    onMultiTemplateSelected(listOfUrl: any): unknown;
    isOpen: boolean;
    onTemplateSelected: (templateUrl?: string) => void;
    onClose: () => void;
}

export default function Ft3AsTemplateSelector(props: Ft3AsTemplateSelectorProps) {
    const { isOpen } = props;
    const [availableTechnologies, setAvailableTechnologies] = useState<IDropdownOption[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<IDropdownOption[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await TemplateServiceInstance.init();
            const technologyNames = TemplateServiceInstance.getAvailableTemplateNames();
            setAvailableTechnologies(technologyNames.map<IDropdownOption>(t => {
                return {
                    key: t, text: t
                }
            }));
        }
        fetchData()
            .then(() => console.log('loaded'))
            .catch(reason => {
                console.error(reason);
            })
    }, []);

    const [selectedLanguageItem, setSelectedLanguageItem] = useState<IDropdownOption>();
    const [selectedKeys, setSelectedKeys] = useState<IDropdownOption[]>([]);


    const onOk = () => {
        if (selectedLanguageItem && selectedKeys?.length) {
            let listOfUrl: any = [];
            selectedKeys.forEach((val) => {
                const url: string = TemplateServiceInstance.getPathforTechAndLanguage(val?.text, selectedLanguageItem?.text);
                listOfUrl.push(url);
            })
            props.onMultiTemplateSelected(listOfUrl);

        }
        props.onClose();
    }

    const onRenderFooterContent = useCallback(
        () => (
            <div>
                <PrimaryButton onClick={onOk} styles={buttonStyles}>
                    Load template
                </PrimaryButton>
                <DefaultButton onClick={props.onClose}>Cancel</DefaultButton>
            </div>
        ), [onOk, props.onClose]);

    const onChangeOfTechMultiSelect = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            let tempTechList = [];
            if(item.selected){
                tempTechList=[...selectedKeys, item]
            }
            else {
                tempTechList= selectedKeys.filter(val => val?.key !== item.key)
            }
            const arrayOfTech = tempTechList.map(function (el) { return el.text; });
            const listOfLang = TemplateServiceInstance.getAvailableLanguagesforSelectedTemplate(arrayOfTech)
            const updatedFilteredLanguage = listOfLang?.map<IDropdownOption>(t => {
                    return {
                        key: t, text: t
                    };
                });
            setSelectedKeys(
                tempTechList
            );
            setAvailableLanguages(updatedFilteredLanguage);

            if(tempTechList?.length){
                const enItem = updatedFilteredLanguage?.find((val)=>val.key==="en");
                setSelectedLanguageItem(Object.keys(enItem||{})?.length>0? enItem : updatedFilteredLanguage[0])
            }
            else {
                setSelectedLanguageItem(undefined)
                setAvailableLanguages([])
            }
        }
    };
    const onChangeOfLanguage = (event: FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        setSelectedLanguageItem(item);
    };

    return (<Panel
        isOpen={isOpen}
        onDismiss={props.onClose}
        headerText="Select a checklist technology"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
    >
        <p>Service list</p>
        <Dropdown
            label="Select Service"
            selectedKeys={selectedKeys?.map((item) => String(item?.key ?? ''))}
            options={availableTechnologies}
            placeholder="Select a Service"
            multiSelect
            onChange={onChangeOfTechMultiSelect} />
        <p>Language list</p>
        <Dropdown
            label="Select language"
            selectedKey={selectedLanguageItem ? selectedLanguageItem.key : undefined}
            options={availableLanguages}
            placeholder="Select a language"
            onChange={onChangeOfLanguage} />
    </Panel>)
}