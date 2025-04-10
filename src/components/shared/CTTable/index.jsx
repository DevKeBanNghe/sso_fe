import { useMemo, useRef, useState } from 'react';
import { Col, Row, Table, Tag } from 'antd';
import SearchBar from 'layouts/Header/SearchBar';
import Actions from './Actions';
import GlobalActions from './GlobalActions';
import useCurrentPage from 'hooks/useCurrentPage';
import { isFunction, startCase } from 'lodash';
import CheckPermission from '../CheckPermission';
import { getPercentValue } from 'common/utils/number.util';
import { getPlaceholderDefault } from 'common/utils/component.util';
import ToggleColumnsView from './ToggleColumnsView';

const CTTable = ({
  fixed = 'bottom',
  itemPerPage = 6,
  totalItems = 1,
  currentPage = 1,
  columns = [],
  rows = [],
  rowKey,
  actions = [],
  isShowActionDefault = true,
  handleSelected = () => {},
  onGlobalDelete = () => {},
  onGlobalExport = () => {},
  onGlobalToggleActive = () => {},
  onSearch,
  searchProps = {},
  globalActions = [],
  isShowGlobalActionsDefault = [],
  columnsInfo = { created_at: true, created_by: true, updated_at: true, updated_by: true },
  permission_keys = [],
  isOverideColumns = false,
  fieldsColummnExclude = [],
  isToggleColumnsView = true,
  ...props
}) => {
  const defaultActionKey = 'action';
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnsShow, setColumnsShow] = useState(isShowActionDefault ? [defaultActionKey] : []);

  const { setQueryParams } = useCurrentPage({ isPaging: false });

  const onSearchBar =
    onSearch ??
    ((value) => {
      setQueryParams((prev) => ({ ...prev, search: value }));
    });

  const table_rows = useMemo(() => rows.map((row) => ({ ...row, key: row[rowKey] })), [rowKey, rows]);

  const table_columns = useMemo(() => {
    if (table_rows.length === 0) return columns;

    let mainColumns = columns;
    if (!isOverideColumns) {
      const fieldsColumnExcludeCustom = [...fieldsColummnExclude, rowKey, 'key'];
      mainColumns = Object.keys(table_rows[0]).reduce((acc, fieldName) => {
        const isShowColumn = !columnsInfo[fieldName] && !fieldsColumnExcludeCustom.includes(fieldName);
        if (isShowColumn) {
          const column = {
            title: getPlaceholderDefault(fieldName),
            dataIndex: fieldName,
            key: fieldName,
            ...(columns.find((item) => item.key === fieldName) ?? {}),
          };
          if (fieldName === 'is_active') {
            column.render = (value, index) => {
              const data = {
                1: { color: 'blue', content: 'Active' },
                0: { color: 'red', content: 'Inactive' },
              };
              const currentData = data[value];
              return (
                <Tag color={currentData.color} key={`is_active_${index}`}>
                  {currentData.content}
                </Tag>
              );
            };
          }
          acc.push(column);
        }
        return acc;
      }, []);
    }

    const { columnsInfoRender, columnsInfoPercentWidth } = Object.entries(columnsInfo).reduce(
      (acc, [column, isShow]) => {
        if (isShow) {
          const width = '11%';
          acc.columnsInfoRender.push({
            title: startCase(column),
            width,
            align: 'center',
            dataIndex: column,
            key: column,
          });
          acc.columnsInfoPercentWidth += getPercentValue(width);
        }
        return acc;
      },
      { columnsInfoRender: [], columnsInfoPercentWidth: 0 },
    );

    let percentWidthRemain = 100 - columnsInfoPercentWidth;
    let columnAction;
    if (isShowActionDefault) {
      columnAction = {
        title: 'Action',
        key: defaultActionKey,
        fixed: 'right',
        align: 'center',
        width: '8%',
        render: (record) => {
          const row_id = record[rowKey];
          return (
            <Actions
              key={row_id}
              isShowActionDefault={isShowActionDefault}
              actions={actions}
              dataRecord={{ ...record, row_id }}
              onGlobalDelete={onGlobalDelete}
              onGlobalToggleActive={onGlobalToggleActive}
            />
          );
        },
      };
      percentWidthRemain -= getPercentValue(columnAction.width);
    }

    mainColumns = mainColumns.map((item) => ({
      ...item,
      width: item.width ?? percentWidthRemain / mainColumns.length + '%',
    }));
    const columnsValue = [...mainColumns, ...columnsInfoRender];
    const data = columnAction ? [...columnsValue, columnAction] : columnsValue;
    return data.map((item) => ({
      ...item,
      hidden: isToggleColumnsView ? !columnsShow.includes(item.key) : false,
    }));
  }, [actions, columns, isShowActionDefault, table_rows]);

  const selectedRowsRef = useRef(new Map());
  const handleSelectedRows = (selectedRowKeys, rowsSelected) => {
    selectedRowKeys = [...selectedRowsRef.current.values()];
    setSelectedRowKeys(selectedRowKeys);
    handleSelected(selectedRowKeys, rowsSelected);
  };

  return (
    <>
      <CheckPermission permission_keys={permission_keys}>
        <Row style={{ marginBottom: '5px' }}>
          <Col span={16}>
            <GlobalActions
              actions={globalActions}
              selectedRowsRef={selectedRowsRef}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              onGlobalDelete={onGlobalDelete}
              onGlobalToggleActive={onGlobalToggleActive}
              onGlobalExport={onGlobalExport}
              isShowGlobalActionsDefault={isShowGlobalActionsDefault}
            />
          </Col>
          <Col span={8}>{isFunction(onSearchBar) ? <SearchBar onSearch={onSearchBar} {...searchProps} /> : <></>}</Col>
        </Row>

        {isToggleColumnsView ? (
          <ToggleColumnsView
            isShowActionDefault={isShowActionDefault}
            columnsInfo={columnsInfo}
            table_columns={table_columns}
            table_rows={table_rows}
            columnsShow={columnsShow}
            setColumnsShow={setColumnsShow}
          />
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
            fixed: 'left',
          }}
          onChange={({ current: page }) => setQueryParams((pre) => ({ ...pre, page }))}
          {...props}
        />
      </CheckPermission>
    </>
  );
};
export default CTTable;
