import { useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row, Table, Tag } from 'antd';
import SearchBar from 'layouts/Header/SearchBar';
import Actions from './Actions';
import GlobalActions from './GlobalActions';
import useCurrentPage from 'hooks/useCurrentPage';
import { isEmpty, isFunction, startCase, uniq } from 'lodash';
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
  loading: isLoading = true,
  ...props
}) => {
  const defaultActionKey = 'action';
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableColumns, setTableColumns] = useState(columns);
  const [tableRows, setTableRows] = useState([]);
  const { setQueryParams } = useCurrentPage({ isPaging: false });

  const onSearchBar =
    onSearch ??
    ((value) => {
      setQueryParams((prev) => ({ ...prev, search: value }));
    });

  useEffect(() => {
    if (!isLoading) {
      setTableRows(rows.map((row) => ({ ...row, key: row[rowKey] })));
    }
  }, [rows, isLoading]);

  const columnsInfoRender = useMemo(() => {
    const data = Object.entries(columnsInfo).reduce((acc, [column, isShow]) => {
      if (isShow) {
        const width = '11%';
        acc.push({
          title: startCase(column),
          width,
          align: 'center',
          dataIndex: column,
          key: column,
          hidden: true,
        });
      }
      return acc;
    }, []);
    return data;
  }, []);

  const actionColumn = useMemo(() => {
    if (!isShowActionDefault) return {};
    return {
      title: 'Action',
      key: defaultActionKey,
      fixed: 'right',
      align: 'center',
      width: '6%',
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
  }, [isShowActionDefault]);

  const defaultColumns = useMemo(() => {
    if (isOverideColumns) return columns;
    const fieldsColumnExcludeCustom = [...fieldsColummnExclude, rowKey, 'key'];
    const data = Object.keys(tableRows[0] ?? {}).reduce((acc, fieldName) => {
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
    const otherColumns = columns.filter((column) => !data.find((item) => item.key === column.key));
    return [...data, ...otherColumns];
  }, [tableRows]);

  const [columnsShow, setColumnsShow] = useState([]);
  useEffect(() => {
    const data = new Set([defaultActionKey]);
    tableColumns.forEach((column) => {
      if (column.isViewDefault) data.add(column.key);
    });
    Object.keys(tableRows[0] ?? {}).forEach((key) => {
      if (!columnsInfo[key]) data.add(key);
    });
    setColumnsShow((prev) => uniq([...prev, ...Array.from(data)]));
  }, [tableRows]);

  useEffect(() => {
    const columnsInfoPercentWidth = columnsInfoRender.reduce((acc, item) => acc + getPercentValue(item.width), 0);
    let percentWidthRemain = 100 - columnsInfoPercentWidth;
    const isEmptyActionColumn = isEmpty(actionColumn);
    if (!isEmptyActionColumn) {
      percentWidthRemain -= getPercentValue(actionColumn.width);
    }
    const customColumns = defaultColumns.map((item) => ({
      ...item,
      width: item.width ?? `${percentWidthRemain / defaultColumns.length}%`,
    }));
    const columnsValue = [...customColumns, ...columnsInfoRender];
    const data = isEmptyActionColumn ? columnsValue : [...columnsValue, actionColumn];
    setTableColumns(
      data.map((item) => ({ ...item, hidden: isOverideColumns ? false : !columnsShow.includes(item.key) })),
    );
  }, [columnsInfoRender, actionColumn, defaultColumns, columnsShow]);

  const selectedRowsRef = useRef(new Map());
  const handleSelectedRows = (selectedRowKeys, rowsSelected) => {
    selectedRowKeys = [...selectedRowsRef.current.values()];
    setSelectedRowKeys(selectedRowKeys);
    handleSelected(selectedRowKeys, rowsSelected);
  };

  const handleToggle = (columnsShow) => {
    setColumnsShow(columnsShow);
    setTableColumns((prev) =>
      prev.map((item) => ({
        ...item,
        hidden: !columnsShow.includes(item.key),
      })),
    );
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
          <ToggleColumnsView list={tableColumns} value={columnsShow} onChange={handleToggle} />
        ) : (
          <></>
        )}

        <Table
          key={'table_key'}
          columns={tableColumns}
          dataSource={tableRows}
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
