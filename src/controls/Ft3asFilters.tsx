import { IInputProps, ITag, Panel, TagPicker, Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react';
import * as React from 'react';
import { ICategory, IChecklistDocument } from "../model/IChecklistDocument";
import { ISeverity } from '../model/ISeverity';
import { IStatus } from '../model/IStatus';
import { TextField } from '@fluentui/react/lib/TextField';


const getTextFromItem = (item: ITag) => item.name;

const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
    if (!tagList || !tagList.length || tagList.length === 0) {
        return false;
    }
    return tagList.some(compareTag => compareTag.key === tag.key);
};

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 290 },
  };
  
  const options: IDropdownOption[] = [
    { key: 'category', text: 'Category' },
    { key: 'status', text: 'Status' },
    { key: 'severity', text: 'Severity' },
  ];

const inputProps: IInputProps = {
    onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
    onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => console.log('onChange called ' + ev.target.value)
};

interface Ft3asFiltersProps {
    checklistDoc: IChecklistDocument;
    isOpen: boolean;
    categoriesChanged?: (selectedCategories: ICategory[]) => void
    severitiesChanged?: (selectedSeverities: ISeverity[]) => void
    statusesChanged?: (selectedStatuses: IStatus[]) => void
    filterTextChanged?: (filterText: string) => void
    groupChange?: (option: IDropdownOption<any>) => void
    onClose: () => void;
}
export default function Ft3asFilters(props: Ft3asFiltersProps) {

    const { categories, severities, status } = props.checklistDoc;
    const { isOpen } = props;
    const availableTags = categories.map<ITag>(c => {
        return { key: c.name, name: c.name }
    });
    const availableSeverities = severities.map<ITag>(s => {
        return { key: s.name, name: s.name }
    });
    const availableStatuses = status.map<ITag>(s => {
        return { key: s.name, name: s.name }
    });

    const [excludedTags, setExcludedTags] = React.useState<ITag[]>([]);
    const [excludedSeverities, setExcludedSeverities] = React.useState<ITag[]>([]);
    const [excludedStatuses, setExcludedStatuses] = React.useState<ITag[]>([]);
    const [groupingField, setGroupingField] = React.useState<IDropdownOption>(options[0]);
    

    const filterSuggestedCategoryTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? availableTags.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterExcludedCategoryTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? excludedTags.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterSuggestedSeveritiesTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? availableSeverities.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterExcludedSeverityTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? excludedSeverities.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterSuggestedStatusesTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? availableStatuses.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterExcludedStatusesTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? excludedStatuses.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const onCategoriesPickerChanged = (items?: ITag[] | undefined) => {
        if (props.categoriesChanged) {
            props.categoriesChanged(items?.map<ICategory>(item => {
                return {
                    name: item.name
                }
            }) ?? []);
        }

        let _excludedTags : ITag[] = [];
        setExcludedTags([]);
        availableTags.forEach( (tag: ITag) => { if(!listContainsTagList(tag, items)) { _excludedTags.push(tag)} });
        setExcludedTags(_excludedTags);

    };

    const onSeveritiesPickerChanged = (items?: ITag[] | undefined) => {
        if (props.severitiesChanged) {
            props.severitiesChanged(items?.map<ISeverity>(item => {
                return {
                    name: item.name,
                    description: item.name
                }
            }) ?? []);
        }

        let _excludedSeverities : ITag[] = [];
        setExcludedSeverities([]);
        availableSeverities.forEach( (tag: ITag) => { if(!listContainsTagList(tag, items)) { _excludedSeverities.push(tag)} });
        setExcludedSeverities(_excludedSeverities);
    };

    const onStatusesPickerChanged = (items?: ITag[] | undefined) => {
        if (props.statusesChanged) {
            props.statusesChanged(items?.map<IStatus>(item => {
                return {
                    name: item.name,
                    description: item.name
                }
            }) ?? []);
        }

        let _excludedStatuses : ITag[] = [];
        setExcludedStatuses([]);
        availableStatuses.forEach( (tag: ITag) => { if(!listContainsTagList(tag, items)) { _excludedStatuses.push(tag)} });
        setExcludedStatuses(_excludedStatuses);
    };
  
    const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text?: string): void => {
        if (props.filterTextChanged && text) {
            props.filterTextChanged(text);
        }
        else if (props.filterTextChanged)
        {
            props.filterTextChanged('');
        }
    };

    const onGroupChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined): void => {        
        if (props.groupChange && option) {
            setGroupingField(option);
            props.groupChange(option);
        }
    };

    return (
        <Panel
            isOpen={isOpen}
            isBlocking={false}
            onDismiss={props.onClose}
        >
            <Dropdown
              label="Group by: "
              selectedKey={groupingField ? groupingField.key : undefined}
              options={options}
              styles={dropdownStyles}
              onChange={onGroupChange}
            />
            <TextField label="Filter by name:" onChange={_onChangeText} readOnly={false} />
            <label htmlFor='picker1'>Included categories</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Included categories"
                onResolveSuggestions={filterSuggestedCategoryTags}
                getTextFromItem={getTextFromItem}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: 'Suggested categories',
                    noResultsFoundText: 'No categories found'
                }}
                defaultSelectedItems={availableTags}
                inputProps={{
                    ...inputProps,
                    id: 'picker1',
                }}
                onChange={onCategoriesPickerChanged}

            />

            <label htmlFor='picker3'>Excluded categories</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Excluded categories"
                onResolveSuggestions={filterExcludedCategoryTags}
                selectedItems={excludedTags}
                getTextFromItem={getTextFromItem}
                inputProps={{
                    ...inputProps,
                    id: 'picker3',
                }}
            />

            <label htmlFor='picker2'>Included severities</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Included severities"
                
                onItemSelected={(selectedItem?: ITag) => {
                    console.debug('seleted item ' + selectedItem?.name);
                    return selectedItem ?? null;
                }}
                onResolveSuggestions={filterSuggestedSeveritiesTags}
                getTextFromItem={getTextFromItem}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: 'Suggested severities',
                    noResultsFoundText: 'No severities found'
                }}
                defaultSelectedItems={availableSeverities}
                inputProps={{
                    ...inputProps,
                    id: 'picker2',
                }}
                onChange={onSeveritiesPickerChanged}
            />

            <label htmlFor='picker4'>Excluded severities</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Excluded severities"
                onResolveSuggestions={filterExcludedSeverityTags}
                selectedItems={excludedSeverities}
                getTextFromItem={getTextFromItem}
                inputProps={{
                    ...inputProps,
                    id: 'picker4',
                }}
            />

            <label htmlFor='picker5'>Included statuses</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Included statuses"
                
                onItemSelected={(selectedItem?: ITag) => {
                    console.debug('selected item ' + selectedItem?.name);
                    return selectedItem ?? null;
                }}
                onResolveSuggestions={filterSuggestedStatusesTags}
                getTextFromItem={getTextFromItem}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: 'Suggested statuses',
                    noResultsFoundText: 'No statuses found'
                }}
                defaultSelectedItems={availableStatuses}
                inputProps={{
                    ...inputProps,
                    id: 'picker5',
                }}
                onChange={onStatusesPickerChanged}
            />

            <label htmlFor='picker6'>Excluded statuses</label>
            <TagPicker
                removeButtonAriaLabel="Remove"
                selectionAriaLabel="Excluded statuses"
                onResolveSuggestions={filterExcludedStatusesTags}
                selectedItems={excludedStatuses}
                getTextFromItem={getTextFromItem}
                inputProps={{
                    ...inputProps,
                    id: 'picker6',
                }}
            />            
        </Panel>
    );
}