import {
  ITag,
  Panel,
  TagPicker,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react";
import * as React from "react";
import { ICategory, IChecklistDocument, IWaf } from "../model/IChecklistDocument";
import { ISeverity } from "../model/ISeverity";
import { IStatus } from "../model/IStatus";
import { TextField } from "@fluentui/react/lib/TextField";

const getTextFromItem = (item: ITag) => item.name;

const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
  if (!tagList || !tagList.length || tagList.length === 0) {
    return false;
  }
  return tagList.some((compareTag) => compareTag.key === tag.key);
};

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 290 },
};

const options: IDropdownOption[] = [
  { key: "category", text: "Category" },
  { key: "status", text: "Status" },
  { key: "severity", text: "Severity" },
  { key: "waf", text: "Waf" },
];

interface Ft3asFiltersProps {
  checklistDoc?: IChecklistDocument;
  isOpen: boolean;
  filterText?: string;
  wafChanged?: (selectedCategories: ICategory[]) => void;
  categoriesChanged?: (selectedCategories: ICategory[]) => void;
  severitiesChanged?: (selectedSeverities: ISeverity[]) => void;
  statusesChanged?: (selectedStatuses: IStatus[]) => void;
  filterTextChanged?: (filterText: string) => void;
  groupChange?: (option: IDropdownOption<any>) => void;
  onClose: () => void;
}
export default function Ft3asFilters(props: Ft3asFiltersProps) {
  const {  severities=[], status=[], waf=[], categories = [] } = props?.checklistDoc ?? {};
  const { isOpen , filterText=''  } = props;
  const availableTags = categories.map<ITag>((c) => {
    return { key: c.name, name: c.name };
  });
  const [includedTags, setIncludedTags] = React.useState<ITag[]>(availableTags);
  const [excludedTags, setExcludedTags] = React.useState<ITag[]>([]);

  const availableSeverities = severities.map<ITag>((s) => {
    return { key: s.name, name: s.name };
  });
  const [includedSeverities, setIncludedSeverities] =
    React.useState<ITag[]>(availableSeverities);
  const [excludedSeverities, setExcludedSeverities] = React.useState<ITag[]>(
    []
  );

  const availableWaf = waf.map<ITag>((w)=> {
    return {key: w.name , name: w.name}
  });
  const [includedWaf, setIncludedWaf] =
  React.useState<ITag[]>(availableWaf);
const [excludedWaf, setExcludedWaf] = React.useState<ITag[]>(
  []
);
  const availableStatuses = status.map<ITag>((s) => {
    return { key: s.name, name: s.name };
  });
  const [includedStatuses, setIncludedStatuses] =
    React.useState<ITag[]>(availableStatuses);
  const [excludedStatuses, setExcludedStatuses] = React.useState<ITag[]>([]);

  const [groupingField, setGroupingField] = React.useState<IDropdownOption>(
    options[3]
  );

  const filterSuggestedCategoryTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? availableTags.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterExcludedCategoryTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? excludedTags.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterSuggestedSeveritiesTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? availableSeverities.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterExcludedSeverityTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? excludedSeverities.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterSuggestedStatusesTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? availableStatuses.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterExcludedStatusesTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? excludedStatuses.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterSuggestedWafTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? availableWaf.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };

  const filterExcludedWafTags = (
    filterText: string,
    tagList?: ITag[]
  ): ITag[] => {
    return filterText
      ? excludedWaf.filter(
          (tag) =>
            tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
            !listContainsTagList(tag, tagList)
        )
      : [];
  };
  const onIncludedCategoriesPickerChanged = (items?: ITag[] | undefined) => {
    setIncludedTags([...(items ?? [])]);

    let _excludedTags: ITag[] = [];
    setExcludedTags([]);
    availableTags.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _excludedTags.push(tag);
      }
    });
    setExcludedTags(_excludedTags);

    if (props.categoriesChanged) {
      props.categoriesChanged(
        items?.map<ICategory>((item) => {
          return {
            name: item.name,
          };
        }) ?? []
      );
    }
  };

  const onExcludedCategoriesPickerChanged = (items?: ITag[] | undefined) => {
    setExcludedTags([...(items ?? [])]);

    let _includedTags: ITag[] = [];
    setIncludedTags([]);
    availableTags.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _includedTags.push(tag);
      }
    });
    setIncludedTags(_includedTags);

    if (props.categoriesChanged) {
      props.categoriesChanged(
        _includedTags?.map<ICategory>((item) => {
          return {
            name: item.name,
          };
        }) ?? []
      );
    }
  };

  const onIncludedSeveritiesPickerChanged = (items?: ITag[] | undefined) => {
    setIncludedSeverities([...(items ?? [])]);

    let _excludedSeverities: ITag[] = [];
    setExcludedSeverities([]);
    availableSeverities.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _excludedSeverities.push(tag);
      }
    });
    setExcludedSeverities(_excludedSeverities);

    if (props.severitiesChanged) {
      props.severitiesChanged(
        items?.map<ISeverity>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };

  const onExcludedSeveritiesPickerChanged = (items?: ITag[] | undefined) => {
    setExcludedSeverities([...(items ?? [])]);

    let _includedSeverities: ITag[] = [];
    setIncludedSeverities([]);
    availableSeverities.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _includedSeverities.push(tag);
      }
    });
    setIncludedSeverities(_includedSeverities);

    if (props.severitiesChanged) {
      props.severitiesChanged(
        _includedSeverities?.map<ISeverity>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };

  
  const onIncludedWafPickerChanged = (items?: ITag[] | undefined) => {
    setIncludedWaf([...(items ?? [])]);

    let _excludedWaf: ITag[] = [];
    setExcludedWaf([]);
    availableWaf.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _excludedWaf.push(tag);
      }
    });
    setExcludedWaf(_excludedWaf);

    if (props.wafChanged) {
      props.wafChanged(
        items?.map<ISeverity>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };

  const onExcludedWafPickerChanged = (items?: ITag[] | undefined) => {
    setExcludedWaf([...(items ?? [])]);

    let _includedWaf: ITag[] = [];
    setIncludedWaf([]);
    availableWaf.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _includedWaf.push(tag);
      }
    });
    setIncludedWaf(_includedWaf);

    if (props.wafChanged) {
      props.wafChanged(
        _includedWaf?.map<IWaf>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };
  const onIncludedStatusesPickerChanged = (items?: ITag[] | undefined) => {
    setIncludedStatuses([...(items ?? [])]);

    let _excludedStatuses: ITag[] = [];
    setExcludedStatuses([]);
    availableStatuses.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _excludedStatuses.push(tag);
      }
    });
    setExcludedStatuses(_excludedStatuses);

    if (props.statusesChanged) {
      props.statusesChanged(
        items?.map<IStatus>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };

  const onExcludedStatusesPickerChanged = (items?: ITag[] | undefined) => {
    setExcludedStatuses([...(items ?? [])]);

    let _includedStatuses: ITag[] = [];
    setIncludedStatuses([]);
    availableStatuses.forEach((tag: ITag) => {
      if (!listContainsTagList(tag, items)) {
        _includedStatuses.push(tag);
      }
    });
    setIncludedStatuses(_includedStatuses);

    if (props.statusesChanged) {
      props.statusesChanged(
        _includedStatuses?.map<IStatus>((item) => {
          return {
            name: item.name,
            description: item.name,
          };
        }) ?? []
      );
    }
  };

  const _onChangeText = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text?: string
  ): void => {
    if (props.filterTextChanged && text) {
      props.filterTextChanged(text);
    } else if (props.filterTextChanged) {
      props.filterTextChanged("");
    }
  };

  const onGroupChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined,
  ): void => {
    if (props.groupChange && option) {
      setGroupingField(option);
      props.groupChange(option);
    }
  };
  return (
    <Panel isOpen={isOpen} isBlocking={false} onDismiss={props.onClose}>
      <Dropdown
        label="Group by: "
        selectedKey={groupingField ? groupingField.key : undefined}
        options={options}
        styles={dropdownStyles}
        onChange={onGroupChange}
      />
      <TextField
        label="Filter by name:"
        value={filterText}
        onChange={_onChangeText}
        readOnly={false}
      />
      <label htmlFor="picker1">Included categories</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Included categories"
        onResolveSuggestions={filterSuggestedCategoryTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested categories",
          noResultsFoundText: "No categories found",
        }}
        selectedItems={includedTags}
        onChange={onIncludedCategoriesPickerChanged}
      />

      <label htmlFor="picker3">Excluded categories</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Excluded categories"
        onResolveSuggestions={filterExcludedCategoryTags}
        getTextFromItem={getTextFromItem}
        selectedItems={excludedTags}
        onChange={onExcludedCategoriesPickerChanged}
      />

      <label htmlFor="picker2">Included severities</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Included severities"
        onItemSelected={(selectedItem?: ITag) => {
          console.debug("seleted item " + selectedItem?.name);
          return selectedItem ?? null;
        }}
        onResolveSuggestions={filterSuggestedSeveritiesTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested severities",
          noResultsFoundText: "No severities found",
        }}
        selectedItems={includedSeverities}
        onChange={onIncludedSeveritiesPickerChanged}
      />

      <label htmlFor="picker4">Excluded severities</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Excluded severities"
        onResolveSuggestions={filterExcludedSeverityTags}
        selectedItems={excludedSeverities}
        getTextFromItem={getTextFromItem}
        onChange={onExcludedSeveritiesPickerChanged}
      />

      <label htmlFor="picker5">Included statuses</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Included statuses"
        onItemSelected={(selectedItem?: ITag) => {
          console.debug("selected item " + selectedItem?.name);
          return selectedItem ?? null;
        }}
        onResolveSuggestions={filterSuggestedStatusesTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested statuses",
          noResultsFoundText: "No statuses found",
        }}
        selectedItems={includedStatuses}
        onChange={onIncludedStatusesPickerChanged}
      />

      <label htmlFor="picker6">Excluded statuses</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Excluded statuses"
        onResolveSuggestions={filterExcludedStatusesTags}
        selectedItems={excludedStatuses}
        getTextFromItem={getTextFromItem}
        onChange={onExcludedStatusesPickerChanged}
      />
            <label htmlFor="picker5">Included Waf</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Included Waf"
        onItemSelected={(selectedItem?: ITag) => {
          console.debug("seleted item " + selectedItem?.name);
          return selectedItem ?? null;
        }}
        onResolveSuggestions={filterSuggestedWafTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested Waf",
          noResultsFoundText: "No Waf found",
        }}
        selectedItems={includedWaf}
        onChange={onIncludedWafPickerChanged}
      />

      <label htmlFor="picker6">Excluded Waf</label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Excluded Waf"
        onResolveSuggestions={filterExcludedWafTags}
        selectedItems={excludedWaf}
        getTextFromItem={getTextFromItem}
        onChange={onExcludedWafPickerChanged}
      />
    </Panel>
  );
}
