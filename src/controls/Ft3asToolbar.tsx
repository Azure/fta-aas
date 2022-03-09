import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from '@fluentui/react/lib/Button';
import { setVirtualParent } from '@fluentui/dom-utilities';
import { FocusZone } from '@fluentui/react';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

interface Ft3asToolbarProps {
    onSelectTemplateClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onDownloadReviewClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onUploadReviewClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onUploadGraphQResultClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
}

export function Ft3asToolbar(props: Ft3asToolbarProps) {

    const _items: ICommandBarItemProps[] = [
        {
            key: 'importChecklist',
            text: 'Import checklist',
            iconProps: { iconName: 'CheckList' },
            cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
            onClick: props.onSelectTemplateClick
        },
        {
            key: 'uploadFile',
            text: 'Upload responses',
            iconProps: { iconName: 'Upload' },
            onClick: props.onUploadReviewClick,
        },
        {
            key: 'download',
            text: 'Download',
            iconProps: { iconName: 'Download' },
            onClick: props.onDownloadReviewClick
        },
        {
            key: 'excel',
            text: 'Export Excel',
            iconProps: { iconName: 'ExcelDocument' },
            onClick: () => console.log('Export Excel'),
        },
        {
            key: 'graph',
            text: 'Import Graph Query',
            iconProps: { iconName: 'Cloudy' },
            onClick: () => props.onUploadGraphQResultClick
        }
    ];

    const _overflowItems: ICommandBarItemProps[] = [
        { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
        { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
        { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
    ];

    const _farItems: ICommandBarItemProps[] = [
        {
            key: 'tile',
            text: 'Grid view',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Grid view',
            iconOnly: true,
            iconProps: { iconName: 'Tiles' },
            onClick: () => console.log('Tiles'),
        },
        {
            key: 'info',
            text: 'Info',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: () => console.log('Info'),
        },
    ];


    return (
        <FocusZone>
            <CommandBar
                items={_items}
                overflowItems={_overflowItems}
                overflowButtonProps={overflowProps}
                farItems={_farItems}
                ariaLabel="Inbox actions"
                primaryGroupAriaLabel="Email actions"
                farItemsGroupAriaLabel="More actions"
            />
        </FocusZone>
    );
};


