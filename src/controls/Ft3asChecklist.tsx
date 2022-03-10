import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Announced } from '@fluentui/react/lib/Announced';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ICheckItemAnswered } from '../model/ICheckItem';
import { ICategory, IChecklistDocument } from '../model/IChecklistDocument';
import { Label, Separator, Stack } from '@fluentui/react';
import Ft3asItemEdition from './Ft3asItemEdition';
import { ISeverity } from '../model/ISeverity';
import Ft3asItemDetail from './Ft3asItemDetail';

const classNames = mergeStyleSets({
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px',
  },
  selectionDetails: {
    marginBottom: '20px',
  },
});
const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '600px',
  },
};

export interface Ft3asChecklistState {
  columns: IColumn[];
  allItems: ICheckItemAnswered[];
  items: ICheckItemAnswered[];
  selectionDetails: string;
  announcedMessage?: string;
  currentItem?: ICheckItemAnswered;
}

interface Ft3asChecklistProps {
  checklistDoc?: IChecklistDocument;
  questionAnswered?: (percentComplete: number) => void;
  visibleCategories?: ICategory[];
  visibleSeverities?: ISeverity[];
}

export class Ft3asChecklist extends React.Component<Ft3asChecklistProps, Ft3asChecklistState> {
  private _selection: Selection;

  // private _allItems: ICheckItemAnswered[];

  constructor(props: Ft3asChecklistProps) {
    super(props);

    const columns: IColumn[] = [
      {
        key: 'category',
        name: 'Category',
        ariaLabel: 'Category',
        fieldName: 'category',
        minWidth: 110,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
      },
      {
        key: 'subcategory',
        name: 'Subcategory',
        fieldName: 'subcategory',
        minWidth: 60,
        maxWidth: 150,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'text',
        name: 'Text',
        fieldName: 'text',
        minWidth: 210,
        maxWidth: 350,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'string',
      },
      {
        key: 'comments',
        name: 'Comments',
        fieldName: 'comments',
        minWidth: 210,
        maxWidth: 350,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'string',
      },
      {
        key: 'status',
        name: 'Status',
        fieldName: 'status',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        onRender: (item: ICheckItemAnswered) => item.status?.name,

        onColumnClick: this._onColumnClick
      },
      {
        key: 'severity',
        name: 'Severity',
        fieldName: 'severity',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
      },
      {
        key: 'link',
        name: 'Link',
        fieldName: 'link',
        minWidth: 210,
        maxWidth: 360,
        isResizable: true,
        isCollapsible: true,
        data: 'url',
        onColumnClick: this._onColumnClick,
      },

    ];


    this._selection = new Selection({
      onSelectionChanged: () => {
        console.debug('onSelectionChanged');
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          currentItem: this._selection.getSelection()[0] as ICheckItemAnswered
        });
      },
    });

    const items = this.filterSourceItems(this.props.checklistDoc?.items ?? [], this.props.visibleCategories, this.props.visibleSeverities);
    this.state = {
      allItems: items,
      items: items,
      columns: columns,
      selectionDetails: this._getSelectionDetails(),
      announcedMessage: "announce message",
    };
    // this.setState(this.state);
  }

  public componentWillReceiveProps(props: Ft3asChecklistProps) {
    console.log('receiving properties ' + props.visibleCategories + ' \n' + props.visibleSeverities);

    const items = this.filterSourceItems(props.checklistDoc?.items ?? [], props.visibleCategories, props.visibleSeverities);

    this.setState({
      items: items
    });
  }

  private filterSourceItems(items: ICheckItemAnswered[], visibleCategories?: ICategory[], visibleSeverities?: ISeverity[]): ICheckItemAnswered[] {
    if (!visibleSeverities) {
      console.log('no severities??');
    }
    return items.filter(item =>
      (visibleCategories === undefined || visibleCategories.findIndex(c => c.name === item.category) !== -1)
      && (visibleSeverities === undefined || visibleSeverities.findIndex(s => s.name.toLowerCase() === item.severity.toString().toLowerCase())) !== -1);
  }
  private onItemChanged(item: ICheckItemAnswered) {
    console.debug(`comment: ${item.comments} status: ${item.status}`)
    const index = this.props.checklistDoc?.items.findIndex(c => c.guid === item.guid) ?? -1;
    if (index !== -1) {
      let newItems = this.props.checklistDoc?.items ?? [];
      newItems[index] = item;
      let items = this.filterSourceItems(newItems, this.props.checklistDoc?.categories, this.props.checklistDoc?.severities);

      this.setState({
        allItems: { ...newItems },
        items: items
      });
    } else {
      console.error(`index for ${item.guid} not found`);
    }
  }

  private onNext(currentGuid: string) {
    const currentIndex = this.state.items.findIndex(a => a.guid === currentGuid);
    console.debug(`Current index for ${currentGuid} -> (${currentIndex}/${this.state.items.length})`)
    if (currentIndex !== -1 && currentIndex < this.state.items.length - 1) {
      this._selection.setIndexSelected(currentIndex, false, false);
      this._selection.setIndexSelected(currentIndex + 1, true, true);
    }
  }

  private onPrevious(currentGuid: string) {
    const currentIndex = this.state.items.findIndex(a => a.guid === currentGuid);
    console.debug(`Current index for ${currentGuid} -> (${currentIndex}/${this.state.items.length})`)
    if (currentIndex !== -1 && currentIndex > 1) {
      this._selection.setIndexSelected(currentIndex, false, false);
      this._selection.setIndexSelected(currentIndex - 1, true, true);
    }
  }

  private onDiscardEdition(){
    this._selection.toggleIndexSelected(this._selection.getSelectedIndices()[0]);
  }



  public render() {
    const { columns, items, selectionDetails, announcedMessage, currentItem } = this.state;

    return (
      <Stack>
        <Stack>
          {/* {currentItem ? (
            <Ft3asItemEdition
              allowedStatus={this.props.checklistDoc?.status ?? []}
              item={currentItem}
              onItemChanged={this.onItemChanged.bind(this)}
              onNext={this.onNext.bind(this)}
              onPrevious={this.onPrevious.bind(this)}
              onDiscard={this.onDiscardEdition.bind(this)} />

          ) : <></>} */}
          {currentItem ? (
            <Ft3asItemDetail
              allowedStatus={this.props.checklistDoc?.status ?? []}
              item={currentItem}
              onItemChanged={this.onItemChanged.bind(this)}
              onNext={this.onNext.bind(this)}
              onPrevious={this.onPrevious.bind(this)}
              onDiscard={this.onDiscardEdition.bind(this)} />

          ) : <></>}        
        </Stack>
        <Stack>
          <Separator>Full list</Separator>
          <div>
            <div className={classNames.controlWrapper}>
              <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles} readOnly={false} />
              <Announced message={`Number of items after filter applied: ${items.length}.`} />
            </div>
            <div className={classNames.selectionDetails}>{selectionDetails}</div>
            <Announced message={selectionDetails} />
            <Label>{`Total: ${this.state.allItems.length} Filtered: ${items.length} `}</Label>
            {announcedMessage ? <Announced message={announcedMessage} /> : undefined}

            <MarqueeSelection selection={this._selection} >
              <DetailsList
                items={items}
                columns={columns}
                selectionMode={SelectionMode.single}
                getKey={this._getKey}
                setKey="guid"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                onItemInvoked={this._onItemInvoked}
                enterModalSelectionOnTouch={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
                onActiveItemChanged={(item) => console.log('active item changed ' + item)}
              />
            </MarqueeSelection>

          </div>
        </Stack>
      </Stack>
    );
  }

  // public componentDidUpdate(previousProps: any, previousState: Ft3asChecklistState) {
  //   console.log('checklist did update');
  //   if (previousState != this.state) {

  //     const items = this.filterSourceItems(this.props.checklistDoc?.items ?? [], this.props.visibleCategories, this.props.visibleSeverities);
  //     this.setState({
  //       items: items
  //     });
  //   }
  // }

  private _getKey(item: ICheckItemAnswered, index?: number): string {
    return item.guid;
    // console.debug('_getkey ' + item);
    // return index?.toString() ?? '';
  }

  private doFilter(item: ICheckItemAnswered, filterText: string): boolean {
    if (item && (item.category.includes(filterText)
      || item.subcategory.includes(filterText)
      || item.text.includes(filterText)
      || item.severity.toString().includes(filterText))) {
      return true;
    }
    return false;
  }

  private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text?: string): void => {
    const filteredItems = text ? this.state.allItems.filter(item => this.doFilter(item, text)) : this.state.allItems;
    console.log(filteredItems.length);
    this.setState({
      items: filteredItems ?? []
    });
  };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: `);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as ICheckItemAnswered).guid;
      default:
        return `${selectionCount} items selected`;
    }
  }



  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'
            }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
