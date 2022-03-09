import { DefaultButton, Dropdown, IDropdownOption, Panel, PrimaryButton } from "@fluentui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import TemplateServiceInstance from "../service/TemplateService";

const buttonStyles = { root: { marginRight: 8 } };

interface Ft3AsTemplateSelectorProps {
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

    const [selectedTechItem, setSelectedTechItem] = useState<IDropdownOption>();
    const [selectedLanguageItem, setSelectedLanguageItem] = useState<IDropdownOption>();

    const onOk = () => {
        if (selectedLanguageItem && selectedTechItem){
            console.log(selectedTechItem.text);
            console.log(selectedLanguageItem.text);
            var url : string = TemplateServiceInstance.getPathforTechAndLanguage(selectedTechItem.text, selectedLanguageItem.text);
            console.log(url);
            props.onTemplateSelected(url);
        }
        // props.onClose();
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

    const onChangeOfTechnology = (event: FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        setSelectedTechItem(item);
        if (item) {
            console.log(item.text);
            const languages = TemplateServiceInstance.getAvailableLanguagesforTemplate(item.text);
            console.log(languages);
            setAvailableLanguages(languages.map<IDropdownOption>(t => {
                return {
                    key: t, text: t
                };
            }));
        }
    }

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
        <p>Technology list</p>
        <Dropdown
            label="Select template"
            selectedKey={selectedTechItem ? selectedTechItem.key : undefined}
            options={availableTechnologies}
            placeholder="Select a technology"
            onChange={onChangeOfTechnology} />
        <p>Language list</p>
        <Dropdown
            label="Select language"
            selectedKey={selectedLanguageItem ? selectedLanguageItem.key : undefined}
            options={availableLanguages}
            placeholder="Select a language"
            onChange={onChangeOfLanguage} />        
    </Panel>)
}