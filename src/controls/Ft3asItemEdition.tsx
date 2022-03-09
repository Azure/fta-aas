import { ComboBox, FocusZone, IComboBoxOption, Stack, TextField, Text, IStackTokens, Link, PrimaryButton, DefaultButton, IComboBox } from "@fluentui/react";
import { FormEvent, useState } from "react";
import { ICheckItemAnswered } from "../model/ICheckItem";
import { IStatus } from "../model/IStatus";



const horizontalGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

interface Ft3asItemEditionProps {
    item: ICheckItemAnswered;
    allowedStatus: IStatus[];
    onItemChanged?: (itemchanged: ICheckItemAnswered) => void;
    onDiscard?: () => void;
}
export default function Ft3asItemEdition(props: Ft3asItemEditionProps) {
    const statusOptions: IComboBoxOption[] = props.allowedStatus.map<IComboBoxOption>(s => {
        return {
            key: s.name,
            text: s.description
        }
    });
    const [currentItem, setCurrentItem] = useState(props.item);
    const onResponseChanged = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setCurrentItem({ ...currentItem, comments: value });
    }

    const onStatusChanged = (event: FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        if (value) {
            const status: IStatus = {
                name: value,
                description: value
            }
            setCurrentItem({ ...currentItem, status: status });
        } else {
            setCurrentItem({ ...currentItem, status: undefined });
        }
    }
    const onSave = () => {
        if (props.onItemChanged) {
            props.onItemChanged(currentItem);
        }
    }
    const onDiscard = () => {
        if (props.onDiscard) {
            props.onDiscard();
        }
    }
    return (
        <Stack horizontal tokens={{
            childrenGap: 20
        }}>
            <Stack.Item>
                <DefaultButton text="Previous"></DefaultButton>
            </Stack.Item>
            <Stack.Item grow={4}>
                <FocusZone>
                    <Stack>
                        <Stack.Item align="start">
                            <Text variant={'xLarge'} block >
                                {`Category: ${props.item.category} - ${props.item.subcategory}`}
                            </Text>
                        </Stack.Item>
                        <Stack.Item align="start">
                            <Text variant={'large'}>
                                {`Severity: ${props.item.severity.name}`}
                            </Text>
                        </Stack.Item>
                        <Stack.Item align="start">
                            <Text >
                                {props.item.text}
                            </Text>
                        </Stack.Item>
                        <Stack.Item align="start">
                            <Text>
                                {"Learn more: "}
                            </Text>
                            <Link href={props.item.link} target="_blank">{props.item.link}</Link>
                        </Stack.Item>

                    </Stack>
                    <Stack horizontal={true} wrap tokens={horizontalGapStackTokens} >
                        <Stack.Item grow={3}>
                            <TextField
                                label="Response"
                                multiline
                                rows={3}
                                value={currentItem.comments}
                                onChange={onResponseChanged} />
                        </Stack.Item>
                        <Stack.Item grow={1}>
                            <ComboBox
                                label="Status"
                                options={statusOptions}
                                defaultSelectedKey={props.item.status?.name}
                                onChange={onStatusChanged} />
                        </Stack.Item>
                    </Stack>
                    <Stack horizontal tokens={{
                        childrenGap: 10
                    }}>
                        <PrimaryButton text="Save" onClick={onSave} />
                        <DefaultButton text="Discard" onClick={onDiscard} />
                    </Stack>
                </FocusZone>
            </Stack.Item>
            <Stack.Item>
                <DefaultButton text="Next"></DefaultButton>
            </Stack.Item>
        </Stack>);

}