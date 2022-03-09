import { DefaultButton, Dropdown, IDropdownOption, Panel, PrimaryButton } from "@fluentui/react";
import { FormEvent, useCallback, useState } from "react";

const buttonStyles = { root: { marginRight: 8 } };

interface Ft3AsTemplateSelectorProps {
    isOpen: boolean;
    availableTemplates: string[];
    onTemplateSelected: (templateUrl?: string) => void;
    onClose: () => void;
}

export default function Ft3AsTemplateSelector(props: Ft3AsTemplateSelectorProps) {
    const { isOpen } = props;
    // const [availableTemplates, setAvailableTemplates] = useState<IDropdownOption[]>([]);
    const availableTemplates = props.availableTemplates.map<IDropdownOption>(t => {
        return {
            key: t, text: t
        }
    });
    const [selectedItem, setSelectedItem] = useState<IDropdownOption>();
    const onOk = () => {
        props.onTemplateSelected(selectedItem?.key as string | undefined);
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

    const onChange = (event: FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        setSelectedItem(item);
    };

    return (<Panel
        isOpen={isOpen}
        onDismiss={props.onClose}
        headerText="Select a checklist template"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
    >
        <p>Template list</p>
        <Dropdown
            label="Select template"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            options={availableTemplates}
            placeholder="Select a template"
            onChange={onChange} />
    </Panel>)
}