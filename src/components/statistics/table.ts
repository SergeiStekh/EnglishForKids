import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface TableInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  table: Control;
  tableData: Array<{ [key: string]: string | number }>;
  tableCaptionName: string;
  tableHeadersNames: string[];
  tableCaptionElement: Control;
  updateData(data: Array<{ [key: string]: string | number }>): void;
  updateTableView(): void;
  sortTable?(nameOfField: string, sortType: string): void;
}

export default class Table extends Control implements TableInterface {
  table: Control;

  tableData: Array<{ [key: string]: string | number }>;

  tableHeadersNames: string[];

  tableCaptionName: string;

  tableCaptionElement: Control;

  tableHeadersWrapperElement: Control;

  tableHeadersElements: Control[];

  tableRows: Control[];

  sortTable?(nameOfField: string, sortType: string): void;

  constructor(
    parent: HTMLElement,
    options: ControlNodeOptionsInterface,
    tableData: Array<{ [key: string]: string | number }>,
    tableCaptionName: string,
    tableHeadersNames: string[],
  ) {
    if (tableData.length === 0) {
      throw new Error('No data provided for table');
    }
    super(parent, options);
    this.tableData = tableData;
    this.tableHeadersNames = tableHeadersNames;
    if (Object.keys(this.tableData[0]).length !== tableHeadersNames.length) {
      throw new Error('Number of keys in provided data is not equal to table headers quantity.');
    }
    this.table = new Control(this.node, { type: 'table', className: 'table' });
    this.tableCaptionName = tableCaptionName;
    this.tableCaptionElement = this.renderTableCaption();
    this.tableHeadersWrapperElement = this.renderTableHeadersWrapper();
    this.tableHeadersElements = this.renderTableHeaders();
    this.tableRows = this.renderTableRows();
  }

  updateData(data: Array<{ [key: string]: string | number }>) {
    if (Object.keys(data[0]).length !== this.tableHeadersNames.length) {
      throw new Error('Number of keys in provided data is not equal to table headers quantity.');
    }
    this.tableData = data;
    this.updateTableView();
  }

  updateTableView() {
    this.tableRows.forEach((el) => el.removeNodeFromDom());
    this.tableRows = this.renderTableRows();
  }

  renderTableView(): void {
    this.renderTableView();
    this.renderTableHeaders();
  }

  renderTableCaption() {
    return new Control(this.table.node, {
      type: 'caption',
      className: 'table__caption',
      innerText: this.tableCaptionName,
    });
  }

  renderTableHeadersWrapper() {
    return new Control(this.table.node, { type: 'tr', className: 'table__headers' });
  }

  renderTableHeaders() {
    const tableHeaders = this.tableHeadersNames.map((headerName) => {
      const tableHeader = new Control(this.tableHeadersWrapperElement.node, {
        type: 'th',
        className: 'table__header-item',
      });
      const tableHeaderContent = new Control(tableHeader.node, { type: 'div', className: 'table__header-content' });
      new Control(tableHeaderContent.node, { type: 'p', className: 'table__header-name', innerText: headerName });
      const sortWrapper = new Control(tableHeaderContent.node, { type: 'div', className: 'table__sort__wrapper' });
      const sortAsc = new Control(sortWrapper.node, {
        type: 'p',
        className: 'table__sort__top',
        innerText: '↑',
        attributes: [{ title: 'Ascending sort' }],
      });
      const sortDesc = new Control(sortWrapper.node, {
        type: 'p',
        className: 'table__sort__bottom',
        innerText: '↓',
        attributes: [{ title: 'Descending sort' }],
      });

      sortAsc.node.onclick = () => {
        this.sortTable?.(headerName, 'asc');
      };
      sortDesc.node.onclick = () => {
        this.sortTable?.(headerName, 'desc');
      };
      return tableHeader;
    });
    return tableHeaders;
  }

  renderTableRows() {
    return this.tableData.map((rowData) => {
      const row = new Control(this.table.node, { type: 'tr', className: 'table__row' });
      const data = Object.values(rowData);
      data.map(
        (columnData) => new Control(row.node, { type: 'td', className: 'table__item', innerText: String(columnData) }),
      );
      return row;
    });
  }
}
