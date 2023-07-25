import * as React from "react";
import { Announced } from "@fluentui/react/lib/Announced";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  IGroup,
} from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { ICheckItemAnswered } from "../model/ICheckItem";
import { ICategory, IChecklistDocument } from "../model/IChecklistDocument";
import {
  Label,
  Separator,
  Stack,
  IDropdownOption,
  IStackStyles,
} from "@fluentui/react";
import { ISeverity } from "../model/ISeverity";
import { IStatus } from "../model/IStatus";
import Ft3asItemDetail from "./Ft3asItemDetail";

const classNames = mergeStyleSets({
  controlWrapper: {
    display: "flex",
    flexWrap: "wrap",
  },
  exampleToggle: {
    display: "inline-block",
    marginBottom: "10px",
    marginRight: "30px",
  },
  selectionDetails: {
    marginBottom: "20px",
  },
});

const stackStyles: Partial<IStackStyles> = {
  root: {
    backgroundColor: "azure",
    position: "sticky",
    top: "10px",
    zIndex: 1,
    padding: "10px",
    border: "solid 1px lightskyblue",
  },
};

export interface Ft3asChecklistState {
  columns: IColumn[];
  allItems: ICheckItemAnswered[];
  items: ICheckItemAnswered[];
  selectionDetails: string;
  announcedMessage?: string;
  currentItem?: ICheckItemAnswered;
  groups: IGroup[];
}

interface Ft3asChecklistProps {
  checklistDoc?: IChecklistDocument;
  questionAnswered?: (percentComplete: number) => void;
  visibleCategories?: ICategory[];
  visibleSeverities?: ISeverity[];
  visibleStatuses?: IStatus[];
  filterText?: string;
  groupingField?: IDropdownOption;
}

export class Ft3asChecklist extends React.Component<
  Ft3asChecklistProps,
  Ft3asChecklistState
> {
  private _selection: Selection;

  constructor(props: Ft3asChecklistProps) {
    super(props);

    const columns: IColumn[] = [
      {
        key: "id",
        name: "ID",
        fieldName: "id",
        minWidth: 60,
        maxWidth: 150,
        isRowHeader: true,
        isResizable: true,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true,
      },
      {
        key: "subcategory",
        name: "Subcategory",
        fieldName: "subcategory",
        minWidth: 60,
        maxWidth: 150,
        isRowHeader: true,
        isResizable: true,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true,
      },
      {
        key: "text",
        name: "Text",
        fieldName: "text",
        minWidth: 210,
        maxWidth: 350,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: "string",
      },
      {
        key: "comments",
        name: "Comments",
        fieldName: "comments",
        minWidth: 210,
        maxWidth: 350,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: "string",
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        onRender: (item: ICheckItemAnswered) => item.status?.name,

        onColumnClick: this._onColumnClick,
      },
      {
        key: "severity",
        name: "Severity",
        fieldName: "severity",
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: "string",
        onColumnClick: this._onColumnClick,
      },
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          currentItem: this._selection.getSelection()[0] as ICheckItemAnswered,
        });
      },
    });

    const items = this.filterSourceItems(
      this.props.checklistDoc?.items ?? [],
      this.props.visibleCategories,
      this.props.visibleSeverities,
      this.props.visibleStatuses,
      this.props.filterText
    );
    const result = this.setGroups(
      items,
      this.props.visibleCategories,
      this.props.visibleSeverities,
      this.props.visibleStatuses,
      this.props.groupingField?.key.toString(),
      columns
    );

    this.state = {
      allItems: result.items,
      items: result.items,
      columns: result.columns,
      selectionDetails: this._getSelectionDetails(),
      announcedMessage: "announce message",
      groups: result.groups,
    };
  }

  private setGroups(
    initialItems: ICheckItemAnswered[],
    visibleCategories?: ICategory[],
    visibleSeverities?: ISeverity[],
    visibleStatuses?: IStatus[],
    groupingField?: string,
    columns?: IColumn[]
  ) {
    let newColumns = setHeader(columns!, groupingField!);
    let items = _copyAndSort(
      initialItems,
      groupingField!,
      groupingField!,
      true
    );
    let groups = this.prepareGroups(
      items,
      visibleCategories,
      visibleSeverities,
      visibleStatuses,
      groupingField
    );

    return { groups: groups, items: items, columns: newColumns };
  }

  private prepareGroups(
    items: ICheckItemAnswered[],
    visibleCategories?: ICategory[],
    visibleSeverities?: ISeverity[],
    visibleStatuses?: IStatus[],
    groupingField?: string
  ) {
    const groups: IGroup[] = [];

    if (groupingField === "severity") {
      visibleSeverities?.forEach((item) => {
        let _count = items.filter(
          (i) => i.severity.toString() === item.name
        ).length;
        let _startIndex = items
          .map(function (e) {
            return e.severity.toString();
          })
          .indexOf(item.name);
        groups.push({
          key: item.name,
          name: item.name,
          startIndex: _startIndex ? _startIndex : 0,
          count: _count ? _count : 0,
          level: 0,
        });
      });
    } else if (groupingField === "status") {
      visibleStatuses?.forEach((item) => {
        let _count = items.filter((i) => i.status?.name === item.name).length;
        let _startIndex = items
          .map(function (e) {
            return e.status?.name;
          })
          .indexOf(item.name);
        groups.push({
          key: item.name,
          name: item.name,
          startIndex: _startIndex ? _startIndex : 0,
          count: _count ? _count : 0,
          level: 0,
        });
      });
    } else {
      visibleCategories?.forEach((item) => {
        let _count = items.filter((i) => i.category === item.name).length;
        let _startIndex = items
          .map(function (e) {
            return e.category;
          })
          .indexOf(item.name);
        groups.push({
          key: item.name,
          name: item.name,
          startIndex: _startIndex ? _startIndex : 0,
          count: _count ? _count : 0,
          level: 0,
        });
      });
    }

    return groups;
  }

  public componentWillReceiveProps(props: Ft3asChecklistProps) {
    const items = this.filterSourceItems(
      props.checklistDoc?.items ?? [],
      props.visibleCategories,
      props.visibleSeverities,
      props.visibleStatuses,
      props.filterText
    );
    const result = this.setGroups(
      items,
      props.visibleCategories,
      props.visibleSeverities,
      props.visibleStatuses,
      props.groupingField?.key.toString(),
      this.state.columns
    );
    result.groups.forEach((newGroup) => {
      const _existingGroupFromState = this.state.groups.find(
        (stateGroup) => stateGroup.key === newGroup.key
      );
      if (_existingGroupFromState) {
        newGroup.isCollapsed = _existingGroupFromState.isCollapsed;
      }
    });
    this.setState({
      items: result.items,
      groups: result.groups,
      columns: result.columns,
    });
  }

  private questionAnswered(percentComplete: number) {
    if (this.props.questionAnswered) {
      this.props.questionAnswered(percentComplete);
    }
  }

  private filterSourceItems(
    items: ICheckItemAnswered[],
    visibleCategories?: ICategory[],
    visibleSeverities?: ISeverity[],
    visibleStatuses?: IStatus[],
    filterText?: string
  ): ICheckItemAnswered[] {
    const _filterText = filterText?.toLowerCase();

    return items.filter(
      (item) =>
        (visibleCategories === undefined ||
          visibleCategories.findIndex((c) => c.name === item.category) !==
            -1) &&
        (visibleSeverities === undefined ||
          visibleSeverities.findIndex(
            (s) =>
              s.name.toLowerCase() === item.severity.toString().toLowerCase()
          ) !== -1) &&
        (visibleStatuses === undefined ||
          visibleStatuses.findIndex(
            (s) =>
              item.status &&
              s.name.toLowerCase() === item.status.name.toLowerCase()
          ) !== -1) &&
        (_filterText === undefined ||
          _filterText.trim() === "" ||
          item.category.toLowerCase().indexOf(_filterText) !== -1 ||
          item.subcategory.toLowerCase().indexOf(_filterText) !== -1 ||
          item.text.toLowerCase().indexOf(_filterText) !== -1 ||
          item.severity.toString().toLowerCase().indexOf(_filterText) !== -1)
    );
  }

  private onItemChanged(item: ICheckItemAnswered) {
    const index =
      this.props.checklistDoc?.items.findIndex((c) => c.guid === item.guid) ??
      -1;
    if (index !== -1) {
      let newItems = this.props.checklistDoc?.items ?? [];
      newItems[index] = item;
      let items = this.filterSourceItems(
        newItems,
        this.props.checklistDoc?.categories,
        this.props.checklistDoc?.severities
      );
      const result = this.setGroups(
        items,
        this.props.checklistDoc?.categories,
        this.props.checklistDoc?.severities,
        this.props.checklistDoc?.status,
        this.props.groupingField?.key.toString(),
        this.state.columns
      );
      const notAnswered = this.props.checklistDoc?.status[0];
      const currentProgress =
        items.filter((i) => i.status !== notAnswered).length / items.length;

      result.groups.forEach((newGroup) => {
        const _existingGroupFromState = this.state.groups.find(
          (stateGroup) => stateGroup.key === newGroup.key
        );
        if (_existingGroupFromState) {
          newGroup.isCollapsed = _existingGroupFromState.isCollapsed;
        }
      });

      this.setState({
        allItems: { ...result.items },
        items: result.items,
        groups: result.groups,
        columns: result.columns,
      });
      this.questionAnswered(currentProgress);
    } else {
      console.error(`index for ${item.guid} not found`);
    }
  }

  private onNext(currentGuid: string) {
    const currentIndex = this.state.items.findIndex(
      (a) => a.guid === currentGuid
    );
    console.debug(
      `Current index for ${currentGuid} -> (${currentIndex}/${this.state.items.length})`
    );
    if (currentIndex !== -1 && currentIndex < this.state.items.length - 1) {
      this._selection.setIndexSelected(currentIndex, false, false);
      this._selection.setIndexSelected(currentIndex + 1, true, true);
    }
  }

  private onPrevious(currentGuid: string) {
    const currentIndex = this.state.items.findIndex(
      (a) => a.guid === currentGuid
    );
    console.debug(
      `Current index for ${currentGuid} -> (${currentIndex}/${this.state.items.length})`
    );
    if (currentIndex !== -1 && currentIndex > 0) {
      this._selection.setIndexSelected(currentIndex, false, false);
      this._selection.setIndexSelected(currentIndex - 1, true, true);
    }
  }

  private onDiscardEdition() {
    this._selection.toggleIndexSelected(
      this._selection.getSelectedIndices()[0]
    );
  }

  public render() {
    const {
      columns,
      items,
      selectionDetails,
      announcedMessage,
      currentItem,
      groups,
    } = this.state;

    return (
      <Stack>
        {currentItem ? (
          <Stack styles={stackStyles}>
            <Ft3asItemDetail
              allowedStatus={this.props.checklistDoc?.status ?? []}
              item={currentItem}
              onItemChanged={this.onItemChanged.bind(this)}
              onNext={this.onNext.bind(this)}
              onPrevious={this.onPrevious.bind(this)}
              onDiscard={this.onDiscardEdition.bind(this)}
            />
          </Stack>
        ) : (
          <></>
        )}
        <Stack>
          <Separator>Full list</Separator>
          <div>
            <div className={classNames.controlWrapper}>
              <Announced
                message={`Number of items after filter applied: ${items.length}.`}
              />
            </div>
            <div className={classNames.selectionDetails}>
              {selectionDetails}
            </div>
            <Announced message={selectionDetails} />
            <Label>{`Total: ${this.props.checklistDoc?.items.length} Filtered: ${items.length} `}</Label>
            {announcedMessage ? (
              <Announced message={announcedMessage} />
            ) : undefined}

            <MarqueeSelection selection={this._selection}>
              <DetailsList
                items={items}
                groups={groups}
                groupProps={{
                  showEmptyGroups: true,
                }}
                columns={columns}
                selectionMode={SelectionMode.single}
                getKey={this._getKey}
                setKey="guid"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                enterModalSelectionOnTouch={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
              />
            </MarqueeSelection>
          </div>
        </Stack>
      </Stack>
    );
  }

  private _getKey(item: ICheckItemAnswered, index?: number): string {
    return item.guid;
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return "No items selected";
      case 1:
        return (
          "1 item selected: " +
          (this._selection.getSelection()[0] as ICheckItemAnswered).guid
        );
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (
    ev: React.MouseEvent<HTMLElement> | undefined,
    column: IColumn
  ): void => {
    let _groupingField = this.props.groupingField
      ? this.props.groupingField.key.toString()
      : "category";
    const { columns, items } = this.state;

    const newColumns = setHeader(columns, column.key);
    const newItems = _copyAndSort(
      items,
      _groupingField,
      column.fieldName!,
      !column.isSortedDescending
    );
    let newGroups = this.prepareGroups(
      newItems,
      this.props.checklistDoc?.categories,
      this.props.checklistDoc?.severities,
      this.props.checklistDoc?.status,
      _groupingField
    );

    newGroups.forEach((newGroup) => {
      const _existingGroupFromState = this.state.groups.find(
        (stateGroup) => stateGroup.key === newGroup.key
      );
      if (_existingGroupFromState) {
        newGroup.isCollapsed = _existingGroupFromState.isCollapsed;
      }
    });

    this.setState({
      columns: newColumns,
      items: newItems,
      groups: newGroups,
    });
  };
}

function setHeader(columns: IColumn[], column: string) {
  const newColumns: IColumn[] = columns.slice();
  const currColumn: IColumn = newColumns.filter(
    (currCol) => column === currCol.key
  )[0];
  newColumns.forEach((newCol: IColumn) => {
    if (newCol === currColumn) {
      currColumn.isSortedDescending = !currColumn.isSortedDescending;
      currColumn.isSorted = true;
    } else {
      newCol.isSorted = false;
      newCol.isSortedDescending = true;
    }
  });

  return newColumns;
}

function _copyAndSort<T>(
  items: T[],
  groupKey: string,
  columnKey: string,
  isSortedDescending?: boolean
): T[] {
  if (groupKey === columnKey && groupKey !== "status") {
    const key = groupKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => (a[key] > b[key] ? 1 : -1));
  } else if (groupKey === columnKey && groupKey === "status") {
    const key = groupKey as keyof T;
    return items
      .slice(0)
      .sort((a: T, b: T) =>
        (a[key] as unknown as IStatus).name >
        (b[key] as unknown as IStatus).name
          ? 1
          : -1
      );
  } else if (columnKey === "status") {
    const group = groupKey as keyof T;
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => {
      if (a[group] < b[group]) return -1;
      if (a[group] > b[group]) return 1;
      if (
        (a[key] as unknown as IStatus).name <
        (b[key] as unknown as IStatus).name
      )
        return isSortedDescending ? 1 : -1;
      if (
        (a[key] as unknown as IStatus).name >
        (b[key] as unknown as IStatus).name
      )
        return isSortedDescending ? -1 : 1;
      return 0;
    });
  } else if (groupKey === "status") {
    const group = groupKey as keyof T;
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => {
      if (
        (a[group] as unknown as IStatus).name <
        (b[group] as unknown as IStatus).name
      )
        return -1;
      if (
        (a[group] as unknown as IStatus).name >
        (b[group] as unknown as IStatus).name
      )
        return 1;
      if (a[key] < b[key]) return isSortedDescending ? 1 : -1;
      if (a[key] > b[key]) return isSortedDescending ? -1 : 1;
      return 0;
    });
  } else {
    const group = groupKey as keyof T;
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => {
      if (a[group] < b[group]) return -1;
      if (a[group] > b[group]) return 1;
      if (a[key] < b[key]) return isSortedDescending ? 1 : -1;
      if (a[key] > b[key]) return isSortedDescending ? -1 : 1;
      return 0;
    });
  }
}
