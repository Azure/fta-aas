import { ComboBox, FocusZone, IComboBoxOption, Stack, TextField, Text, IStackTokens, Link, PrimaryButton, DefaultButton, IComboBox, DetailsList, IColumn, IconButton, IIconProps, Spinner, IDropdownOption } from "@fluentui/react";
import React from "react";
import { FormEvent, useEffect, useState } from "react";
import { ICheckItemAnswered } from "../model/ICheckItem";
import { IStatus } from "../model/IStatus";
import './ItemDetail.css';
const horizontalGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

interface Ft3asItemDetailProps {
    item: ICheckItemAnswered;
    allowedStatus: IStatus[];
    onItemChanged?: (itemchanged: ICheckItemAnswered) => void;
    onDiscard?: () => void;
    onNext?: (currentGuid: string) => void;
    onPrevious?: (currentGuid: string) => void;
    groupingField?: IDropdownOption
}

export default function Ft3asItemDetail(props: Ft3asItemDetailProps) {

    const [showSavingIcon, setShowSavingIcon] = React.useState<boolean | undefined>(false);
    const [comments, setComments] = useState(props.item.comments);
    const [itemStatus, setItemStatus] = useState(props.item.status);

    useEffect(() => {
        if (props.item.comments) {
            setComments(props.item.comments);
        }
        else {
            setComments('');
        }
        setItemStatus(props.item.status);
    }, [props.item]);

    const statusOptions: IComboBoxOption[] = props.allowedStatus.map<IComboBoxOption>(s => {
        return {
            key: s.name,
            text: s.name
        }
    });

    const onCommentsChanged = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setComments(value);
    };

    const onStatusChanged = (event: FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        if (option) {
            const index = props.allowedStatus.findIndex(s => s.name === option.key);
            if (index !== -1) {
                setShowSavingIcon(true);
                setTimeout(() => {
                    setShowSavingIcon(false);
                }, 500);
                const status = props.allowedStatus[index];
                setItemStatus(status);
                if (props.onItemChanged) {
                    props.onItemChanged({ ...props.item, comments: comments, status: status });
                }
                return;
            }
        }
        setItemStatus(undefined);
    };

    const onFocusOut = () => {
        if (comments && comments !== props.item.comments) {
            setShowSavingIcon(true);
            setTimeout(() => {
                setShowSavingIcon(false);
            }, 500);
            if (props.onItemChanged) {
                props.onItemChanged({ ...props.item, comments: comments, status: itemStatus });
            }
        }
    };

    const onDiscard = () => {
        if (props.onDiscard) {
            props.onDiscard();
        }
    };

    const onPrevious = () => {
        if (props.onPrevious) {
            props.onPrevious(props.item.guid);
        }
    };

    const onNext = () => {
        if (props.onNext) {
            props.onNext(props.item.guid);
        }
    };

    const getColumnskeleton = (ctr: number, propname: string): IColumn => {
        return {
            key: `column${ctr}`,
            name: propname,
            fieldName: propname,
            minWidth: 70,
            maxWidth: 90,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            isPadded: true,
        };
    };

    const detailColumns2 = (): IColumn[] => {
        let cols: IColumn[] = [];
        let ctr = 1;

        if (!props.item.graphQResult) return cols;

        let result = props.item.graphQResult[0];
        if (!result) return cols;

        if (result.success) {
            cols.push(getColumnskeleton(ctr, 'success'));
            ctr++;
        }
        if (result.compliant) {
            cols.push(getColumnskeleton(ctr, 'compliant'));
            ctr++;
        }
        if (result.fail) {
            cols.push(getColumnskeleton(ctr, 'fail'));
            ctr++;
        }
        if (result.failure) {
            cols.push(getColumnskeleton(ctr, 'failure'));
            ctr++;
        }
        if (result.id) {
            cols.push(getColumnskeleton(ctr, 'id'));
            ctr++;
        }
        if (result.result) {
            cols.push(getColumnskeleton(ctr, 'result'));
            ctr++;
        }
        return cols;
    };

    const nextIcon: IIconProps = { iconName: 'Next' };
    const previousIcon: IIconProps = { iconName: 'Previous' };
    const removeIcon: IIconProps = { iconName: 'Clear' };
    const handleClickOutside = () => {
        onDiscard();
    }
    const handleClickInsidePanel = (e:any) => {
        e.stopPropagation();
    }
    return (
        <div className="itemDetailsWrapper" onClick={handleClickOutside}>
            <div className="itemDetails" onClick={handleClickInsidePanel}>
                 <Stack horizontal tokens={{
            childrenGap: 20
        }}>
            <Stack.Item>
                <IconButton
                    split
                    iconProps={previousIcon}
                    ariaLabel="Previous"
                    onClick={onPrevious}
                />
            </Stack.Item>
            <Stack.Item grow={4}>
                <FocusZone>
                    <Stack>
                        <Stack.Item align="start">
                            <Text variant={'large'}  >
                                {props?.groupingField?.key!=='category' && <>{`Waf: ${props.item.waf}`}</>}
                                {props?.groupingField?.key==='category' && <>{`Category: ${props.item.category} - ${props.item.subcategory}`}</>}
                                
                            </Text>
                        </Stack.Item>
                        <Stack.Item align="start">
                            <Text variant={'large'}>
                                {`Severity: ${props.item.severity}`}
                            </Text>
                        </Stack.Item>
                        <Stack.Item align="start">
                            <Text variant={'xLarge'}>
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
                                rows={4}
                                value={comments}
                                onChange={onCommentsChanged}
                                onBlur={onFocusOut} />
                        </Stack.Item>
                        <Stack.Item grow={1}>
                            <ComboBox
                                label="Status"
                                options={statusOptions}
                                selectedKey={itemStatus?.name}
                                onChange={onStatusChanged} />
                        </Stack.Item>
                    </Stack>
                    {showSavingIcon && <Stack>
                        <div>
                            <Spinner label="Saving..." ariaLive="assertive" labelPosition="right" />
                        </div>
                    </Stack>}
                    <Stack>
                        {props.item.graphQResult ? (
                            <DetailsList
                                columns={detailColumns2()}
                                items={props.item.graphQResult} />
                        ) : <></>}
                    </Stack>
                    <Stack horizontal tokens={{
                        childrenGap: 10
                    }}>
                    </Stack>
                </FocusZone>
            </Stack.Item>
            <Stack.Item>
                <IconButton
                    split
                    iconProps={nextIcon}
                    ariaLabel="Next"
                    onClick={onNext}
                />
                <IconButton
                    split
                    iconProps={removeIcon}
                    ariaLabel="Discard"
                    onClick={onDiscard}
                />
            </Stack.Item>
        </Stack>
            </div>
        </div>
    )

}