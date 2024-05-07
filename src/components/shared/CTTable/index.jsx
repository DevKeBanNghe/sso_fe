import { useMemo, useRef, useState } from 'react';
import { Button, Table } from 'antd';
import createActions from './DefaultActions';

const CTTable = ({
  fixed = 'bottom',
  itemPerPage = 6,
  totalItems = 1,
  currentPage = 1,
  columns = [],
  rows = [],
  rowKey,
  actions = [],
  isShowDefaultActions = true,
  onEdit = () => {},
  onView = () => {},
  onDelete = () => {},
  onCopy = () => {},
  handleSelected = () => {},
  onGlobalDelete = () => {},
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const table_actions = useMemo(() => {
    if (isShowDefaultActions) actions.push(...createActions({ onEdit, onView, onDelete, onCopy }));
    return actions;
  }, [actions, isShowDefaultActions, onDelete, onEdit, onView, onCopy]);

  const table_columns = useMemo(
    () => (columns.length > 0 ? columns.concat(table_actions) : columns),
    [columns, table_actions],
  );

  const selectedRowsRef = useRef(new Map());
  const handleSelectedRows = (selectedRowKeys, rowsSelected) => {
    selectedRowKeys = [...selectedRowsRef.current.values()];
    setSelectedRowKeys(selectedRowKeys);
    handleSelected(selectedRowKeys, rowsSelected);
  };

  const handleClearAllChecked = () => {
    selectedRowsRef.current.clear();
    setSelectedRowKeys([]);
  };

  const table_rows = useMemo(() => {
    return rows.map((row) => ({ ...row, key: row[rowKey] }));
  }, [rowKey, rows]);

  return (
    <>
      {selectedRowKeys.length > 0 ? (
        <>
          <Button style={{ margin: '0 5px 5px 0', background: '#fbdf00' }} onClick={handleClearAllChecked}>
            Clear all checked
          </Button>
          <Button
            danger
            style={{ marginBottom: '5px' }}
            onClick={() => {
              onGlobalDelete(selectedRowKeys);
              handleClearAllChecked();
            }}
          >
            Delete all
          </Button>
          <span style={{ marginLeft: 8 }}>Selected {selectedRowKeys.length} items</span>
        </>
      ) : (
        <></>
      )}
      <Table
        columns={table_columns}
        dataSource={table_rows}
        scroll={{
          x: 1000,
        }}
        pagination={{
          showSizeChanger: false,
          pageSize: itemPerPage,
          total: totalItems,
          current: currentPage,
        }}
        summary={() => <Table.Summary fixed={fixed}></Table.Summary>}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys, rowsSelected) => {
            if (selectedRowKeys.length === 0) {
              for (const row of rows) {
                selectedRowsRef.current.delete(row[rowKey]);
              }
            }
            if (selectedRowKeys.length === rows.length) {
              for (const rowKey of selectedRowKeys) {
                selectedRowsRef.current.set(rowKey, rowKey);
              }
            }
            handleSelectedRows(selectedRowKeys, rowsSelected);
          },
          onSelect: (record, selected) => {
            selected
              ? selectedRowsRef.current.set(record[rowKey], record[rowKey])
              : selectedRowsRef.current.delete(record[rowKey]);
          },
          columnWidth: '3%',
        }}
        {...props}
      />
    </>
  );
};
export default CTTable;
