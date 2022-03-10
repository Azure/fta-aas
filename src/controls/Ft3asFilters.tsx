import { IInputProps, ITag, Panel, TagPicker } from '@fluentui/react';
import * as React from 'react';
import { ICategory, IChecklistDocument } from "../model/IChecklistDocument";
import { ICheckItemAnswered } from "../model/ICheckItem";
import { ISeverity } from '../model/ISeverity';
import { TextField } from '@fluentui/react/lib/TextField';


const getTextFromItem = (item: ITag) => item.name;

const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
    if (!tagList || !tagList.length || tagList.length === 0) {
        return false;
    }
    return tagList.some(compareTag => compareTag.key === tag.key);
};

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
    filterTextChanged?: (filterText: string) => void
    onClose: () => void;
}
export default function Ft3asFilters(props: Ft3asFiltersProps) {

    const { categories, severities } = props.checklistDoc;
    const { isOpen } = props;
    const availableTags = categories.map<ITag>(c => {
        return { key: c.name, name: c.name }
    });
    const availableSeverities = severities.map<ITag>(s => {
        return { key: s.name, name: s.name }
    });

    const filterSuggestedCategoryTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? availableTags.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList))
            : [];
    };

    const filterSuggestedSeveritiesTags = (filterText: string, tagList?: ITag[]): ITag[] => {
        return filterText
            ? availableSeverities.filter(
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

    return (
        <Panel
            isOpen={isOpen}
            isBlocking={false}
            onDismiss={props.onClose}
        >
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
        </Panel>
    );
}