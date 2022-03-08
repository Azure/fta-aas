import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Announced } from '@fluentui/react/lib/Announced';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ICheckItemAnswered } from '../model/ICheckItem';
import TemplateServiceInstance from '../service/TemplateService';
import { IChecklistDocument } from '../model/IChecklistDocument';
import { Label } from '@fluentui/react';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px',
  },
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
    maxWidth: '300px',
  },
};

export interface Ft3asChecklistState {
  columns: IColumn[];
  items: ICheckItemAnswered[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
}

// export interface IDocument {
//   key: string;
//   name: string;
//   value: string;
//   iconName: string;
//   fileType: string;
//   modifiedBy: string;
//   dateModified: string;
//   dateModifiedValue: number;
//   fileSize: string;
//   fileSizeRaw: number;
// }

interface Ft3asChecklistProps {
  checklistDoc?: IChecklistDocument;
  questionAnswered?: (percentComplete:number)=>void;
}

export class Ft3asChecklist extends React.Component<Ft3asChecklistProps, Ft3asChecklistState> {
  private _selection: Selection;
  // private _allItems: ICheckItemAnswered[];

  constructor(props: Ft3asChecklistProps) {
    super(props);

    console.log('items ' + props.checklistDoc?.items.length);

    const columns: IColumn[] = [
      {
        key: 'category',
        name: 'Category',
        ariaLabel: 'Category',
        fieldName: 'category',
        minWidth: 210,
        maxWidth: 350,
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
        minWidth: 210,
        maxWidth: 350,
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
        data: 'number',
      },
      {
        key: 'ha',
        name: 'HA',
        fieldName: 'ha',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'number',
        onColumnClick: this._onColumnClick,
        isPadded: true,
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
      {
        key: 'status',
        name: 'Status',
        fieldName: 'status',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick
      },
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
        });
      },
    });

    console.log('check items ' + this.props.checklistDoc?.items.length);
    this.state = {
      items: this.props.checklistDoc?.items ?? [],
      columns: columns,
      selectionDetails: this._getSelectionDetails(),
      isModalSelection: false,
      isCompactMode: false,
      announcedMessage: undefined,
    };
    // this.setState(this.state);
  }

  public componentWillReceiveProps(props: Ft3asChecklistProps) {
    console.log('receiving properties');
    this.setState({
      items: props.checklistDoc?.items ?? []
    });
  }

  public render() {
    const { columns, isCompactMode, items, selectionDetails, isModalSelection, announcedMessage } = this.state;

    return (
      <div>
        <div className={classNames.controlWrapper}>
          {/* <Toggle
            label="Enable compact mode"
            checked={isCompactMode}
            onChange={this._onChangeCompactMode}
            onText="Compact"
            offText="Normal"
            styles={controlStyles}
          />
          <Toggle
            label="Enable modal selection"
            checked={isModalSelection}
            onChange={this._onChangeModalSelection}
            onText="Modal"
            offText="Normal"
            styles={controlStyles}
          /> */}
          <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles} readOnly={false} />
          <Announced message={`Number of items after filter applied: ${items.length}.`} />
        </div>
        <div className={classNames.selectionDetails}>{selectionDetails}</div>
        <Announced message={selectionDetails} />
        <Label>{`Total: ${this.props.checklistDoc?.items.length} Filtered: ${items.length} `}</Label>
        {announcedMessage ? <Announced message={announcedMessage} /> : undefined}
        {isModalSelection ? (
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              items={items}
              compact={isCompactMode}
              columns={columns}
              selectionMode={SelectionMode.multiple}
              getKey={this._getKey}
              setKey="multiple"
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              onItemInvoked={this._onItemInvoked}
              enterModalSelectionOnTouch={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        ) : (
          <DetailsList
            items={items}
            compact={isCompactMode}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={this._getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onItemInvoked={this._onItemInvoked}
          />
        )}
      </div>
    );
  }

  public componentDidUpdate(previousProps: any, previousState: Ft3asChecklistState) {
    if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
      this._selection.setAllSelected(false);
    }
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    this.setState({ isCompactMode: checked ?? false });
  };

  private _onChangeModalSelection = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    this.setState({ isModalSelection: checked ?? false });
  };

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
    const filteredItems = text ? this.props.checklistDoc?.items.filter(item => this.doFilter(item, text)) : this.props.checklistDoc?.items;
    this.setState({
      items: filteredItems ?? []
    });
  };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as ICheckItemAnswered).text;
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

function _generateDocuments() {
  let result: ICheckItemAnswered[] = [];
  TemplateServiceInstance.openTemplate('https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json')
    .then(templateDoc => {
      result = templateDoc.items;
      console.log(result.length);
    })
    .catch(reason => console.error(reason));
  return result;
  // const items: ICheckItemAnswered[] = [];
  // for (let i = 0; i < 500; i++) {
  //   const randomDate = _randomDate(new Date(2012, 0, 1), new Date());
  //   const randomFileSize = _randomFileSize();
  //   const randomFileType = _randomFileIcon();
  //   let fileName = _lorem(2);
  //   fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(`.${randomFileType.docType}`);
  //   let userName = _lorem(2);
  //   userName = userName
  //     .split(' ')
  //     .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
  //     .join(' ');
  //   items.push({
  //     key: i.toString(),
  //     name: fileName,
  //     value: fileName,
  //     iconName: randomFileType.url,
  //     fileType: randomFileType.docType,
  //     modifiedBy: userName,
  //     dateModified: randomDate.dateFormatted,
  //     dateModifiedValue: randomDate.value,
  //     fileSize: randomFileSize.value,
  //     fileSizeRaw: randomFileSize.rawSize,
  //   });
  // }
  // return items;
}

function _randomDate(start: Date, end: Date): { value: number; dateFormatted: string } {
  const date: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return {
    value: date.valueOf(),
    dateFormatted: date.toLocaleDateString(),
  };
}

const FILE_ICONS: { name: string }[] = [
  { name: 'accdb' },
  { name: 'audio' },
  { name: 'code' },
  { name: 'csv' },
  { name: 'docx' },
  { name: 'dotx' },
  { name: 'mpp' },
  { name: 'mpt' },
  { name: 'model' },
  { name: 'one' },
  { name: 'onetoc' },
  { name: 'potx' },
  { name: 'ppsx' },
  { name: 'pdf' },
  { name: 'photo' },
  { name: 'pptx' },
  { name: 'presentation' },
  { name: 'potx' },
  { name: 'pub' },
  { name: 'rtf' },
  { name: 'spreadsheet' },
  { name: 'txt' },
  { name: 'vector' },
  { name: 'vsdx' },
  { name: 'vssx' },
  { name: 'vstx' },
  { name: 'xlsx' },
  { name: 'xltx' },
  { name: 'xsn' },
];

function _randomFileIcon(): { docType: string; url: string } {
  const docType: string = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
  return {
    docType,
    url: `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`,
  };
}

function _randomFileSize(): { value: string; rawSize: number } {
  const fileSize: number = Math.floor(Math.random() * 100) + 30;
  return {
    value: `${fileSize} KB`,
    rawSize: fileSize,
  };
}

const LOREM_IPSUM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
  'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
  'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt '
).split(' ');
let loremIndex = 0;
function _lorem(wordCount: number): string {
  const startIndex = loremIndex + wordCount > LOREM_IPSUM.length ? 0 : loremIndex;
  loremIndex = startIndex + wordCount;
  return LOREM_IPSUM.slice(startIndex, loremIndex).join(' ');
}
