import { useMemo, useRef, useState } from 'react';
import { Button, Col, Row, Table } from 'antd';
import SearchBar from 'layouts/Header/SearchBar';
import Actions from './Actions';
import GlobalActions from './GlobalActions';

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
  handleSelected = () => {},
  onGlobalDelete = () => {},
  isSearch = true,
  globalActions = [],
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const table_columns = useMemo(() => {
    const isShowActions = actions.length > 0 || isShowDefaultActions;
    if (columns.length === 0 || !isShowActions) return columns;

    const column_action = {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 30,
      render: (record) => (
        <Actions
          isShowDefaultActions={isShowDefaultActions}
          actions={actions}
          dataRecord={{ ...record, row_id: record[rowKey] }}
          onGlobalDelete={onGlobalDelete}
        />
      ),
    };

    return [...columns, column_action];
  }, [actions, columns, isShowDefaultActions]);

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

  const table_rows = useMemo(() => rows.map((row) => ({ ...row, key: row[rowKey] })), [rowKey, rows]);

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

      <Row style={{ marginBottom: '10px' }}>
        <Col span={16}>
          <GlobalActions actions={globalActions} />
        </Col>
        <Col span={8}>{isSearch && <SearchBar />}</Col>
      </Row>
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
