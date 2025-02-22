import { useMemo, useRef, useState } from 'react';
import { Badge, Button, Col, Flex, Row, Table } from 'antd';
import SearchBar from 'layouts/Header/SearchBar';
import Actions from './Actions';
import GlobalActions from './GlobalActions';
import useCurrentPage from 'hooks/useCurrentPage';
import { isFunction, startCase } from 'lodash';
import { ACTIVATE_STATUS } from 'common/consts/constants.const';
import CheckPermission from '../CheckPermission';
import { getPercentValue } from 'common/utils/number.util';
import { getPlaceholderDefault } from 'common/utils/component.util';

const CTTable = ({
  fixed = 'bottom',
  itemPerPage = 6,
  totalItems = 1,
  currentPage = 1,
  columns = [],
  rows = [],
  rowKey,
  actions = [],
  isShowDefaultAction = true,
  handleSelected = () => {},
  onGlobalDelete = () => {},
  onGlobalToggleActive = () => {},
  onSearch,
  searchProps = {},
  globalActions = [],
  columnsInfo = { created_at: true, created_by: true, updated_at: true, updated_by: true },
  permission_keys = [],
  isOverideColumns = false,
  fieldsColummnExclude = [],
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
      const fieldsColumnExcludeCustom = [...fieldsColummnExclude, rowKey, 'key', 'is_active'];
      mainColumns = Object.keys(table_rows[0]).reduce((acc, fieldName) => {
        const isShowColumn = !columnsInfo[fieldName] && !fieldsColumnExcludeCustom.includes(fieldName);
        if (isShowColumn) {
          acc.push({
            title: getPlaceholderDefault(fieldName),
            dataIndex: fieldName,
            key: fieldName,
            ...(columns.find((item) => item.key === fieldName) ?? {}),
          });
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
    if (isShowDefaultAction) {
      columnAction = {
        title: 'Action',
        key: 'Action',
        fixed: 'right',
        align: 'center',
        width: '8%',
        render: (record) => {
          const row_id = record[rowKey];
          return (
            <Actions
              key={row_id}
              isShowDefaultAction={isShowDefaultAction}
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
    const data = [...mainColumns, ...columnsInfoRender];
    return columnAction ? [...data, columnAction] : data;
  }, [actions, columns, isShowDefaultAction, table_rows]);

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

  const itemsSelected = selectedRowKeys.length;

  return (
    <>
      <CheckPermission permission_keys={permission_keys}>
        <Row style={{ marginBottom: '5px' }}>
          <Col span={16}>
            <Flex gap={'middle'} wrap='wrap'>
              {itemsSelected > 0 ? (
                <>
                  <Badge count={itemsSelected}>
                    <Button style={{ background: '#ffffb8' }} onClick={handleClearAllChecked}>
                      Clear
                    </Button>
                  </Badge>
                  <Badge count={itemsSelected}>
                    <Button
                      style={{ background: '#ffccc7' }}
                      onClick={() => {
                        onGlobalDelete(selectedRowKeys);
                        handleClearAllChecked();
                      }}
                    >
                      Delete
                    </Button>
                  </Badge>

                  <Badge count={itemsSelected}>
                    <Button
                      style={{ background: '#bae7ff' }}
                      onClick={() => {
                        onGlobalToggleActive({ ids: selectedRowKeys, is_active: ACTIVATE_STATUS.ACTIVE });
                        handleClearAllChecked();
                      }}
                    >
                      Active
                    </Button>
                  </Badge>

                  <Badge count={itemsSelected}>
                    <Button
                      style={{ background: '#d9d9d9' }}
                      onClick={() => {
                        onGlobalToggleActive({ ids: selectedRowKeys, is_active: ACTIVATE_STATUS.INACTIVE });
                        handleClearAllChecked();
                      }}
                    >
                      Deactive
                    </Button>
                  </Badge>
                </>
              ) : (
                <></>
              )}
              <GlobalActions actions={globalActions} />
            </Flex>
          </Col>
          <Col span={8}>{isFunction(onSearchBar) ? <SearchBar onSearch={onSearchBar} {...searchProps} /> : <></>}</Col>
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
