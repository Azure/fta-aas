import { ComboBox, FocusZone, IComboBoxOption, Stack, TextField, Text, IStackTokens, Link, PrimaryButton, DefaultButton, IComboBox } from "@fluentui/react";
import { FormEvent, useEffect, useState } from "react";
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
            text: s.name
        }
    });
    const [comments, setComments] = useState(props.item.comments);
    const [itemStatus, setItemStatus] = useState(props.item.status);
    // const [currentItem, setCurrentItem] = useState(props.item);

    useEffect(() => {
        setComments(props.item.comments);
        setItemStatus(props.item.status);
    }, [props.item]);

    const onCommentsChanged = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setComments(value);
    }

    const onStatusChanged = (event: FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {

        if (option) {
            const index = props.allowedStatus.findIndex(s => s.name === option.key);
            if (index !== -1) {
                const status = props.allowedStatus[index];
                setItemStatus(status);
            } else{
                setItemStatus(undefined);
            }            
        } else {
            setItemStatus(undefined);
        }
    }
    const onSave = () => {
        if (props.onItemChanged) {
            props.onItemChanged({...props.item, comments: comments, status: itemStatus});
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
                                label="Comments"
                                multiline
                                rows={3}
                                value={comments}
                                onChange={onCommentsChanged} />
                        </Stack.Item>
                        <Stack.Item grow={1}>
                            <ComboBox
                                label="Status"
                                options={statusOptions}
                                selectedKey={itemStatus?.name}
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