import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useCurrentPage from 'hooks/useCurrentPage';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from 'antd';
import { getRoleOptions } from 'pages/Roles/service';
import { getPermissionList } from 'pages/Permissions/service';
import { exportRolePermissionList, getRolePermissionList, importUrl, updateRolePermission } from '../service';
import { isArray, isEmpty } from 'lodash';
import { toast } from 'common/utils/toast.util';
import { useEffect, useMemo, useState } from 'react';
import { SearchAddonBefore } from './SearchSelect';
import { SEARCH_TYPES } from '../const';
import CTUploadButton from 'components/shared/CTButton/CTUploadButton';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
function RolePermissionTable({ setIsOpenRoleModal, setIsOpenPermissionModal }) {
  const { keyList } = useQueryKeys();
  const { queryParams } = useCurrentPage();
  const { control, watch, setValue, getValues, reset } = useForm();
  const [searchType, setSearchType] = useState(() => {
    const defaultSearchType = SEARCH_TYPES.find((item) => item.isDefault) ?? SEARCH_TYPES[0];
    return defaultSearchType.value;
  });
  const [searchPermissionValue, setSearchPermissionValue] = useState();
  const [searchRoleValue, setSearchRole] = useState();

  const keyPermissionList = [`${keyList}-${queryParams.page}`, searchPermissionValue];
  const { data: queryGetPermissionListData = {}, isFetched: isFetchedPermissions } = useQuery({
    queryKey: keyPermissionList,
    queryFn: () => getPermissionList({ ...queryParams, search: searchPermissionValue }),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetPermissionListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

  const keyRoleOptions = ['role_options', searchRoleValue];
  const { data: roleOptionsDataQuery = {}, isFetched: isFetchedRoles } = useQuery({
    queryKey: keyRoleOptions,
    queryFn: () => getRoleOptions({ search: searchRoleValue }),
  });

  const { data: dataRoleOptions = [] } = roleOptionsDataQuery;

  const isSearchPermission = useMemo(() => {
    const searchTypeCurrent = SEARCH_TYPES.find((item) => item.value === searchType);
    return searchTypeCurrent.value === 'permission';
  }, [searchType]);

  const keyPermissionRoleList = ['permission_role_list', searchPermissionValue, searchRoleValue];
  const { data: rolePermissionDataQuery = {} } = useQuery({
    queryKey: keyPermissionRoleList,
    queryFn: async () => {
      const permission_id_role_id_list = list.reduce((acc, { permission_id }) => {
        const data = dataRoleOptions.reduce((accRole, { role_id }) => [...accRole, { permission_id, role_id }], []);
        return [...acc, ...data];
      }, []);
      const data = await getRolePermissionList({ permission_id_role_id_list });
      return data;
    },
    enabled: isFetchedPermissions && isFetchedRoles,
  });

  const { data: rolePermissionData = [] } = rolePermissionDataQuery;

  useEffect(() => {
    if (rolePermissionData?.length > 0) {
      const data = {};
      for (const { permission_id, role_ids } of rolePermissionData) {
        const fieldName = `permission_${permission_id}`;
        data[fieldName] = role_ids;
        for (const role_id of role_ids) {
          data[`${fieldName}_role_${role_id}_is_checked`] = true;
        }
      }
      reset(data);
    }
  }, [rolePermissionData]);

  const columns = [
    {
      title: '',
      width: 70,
      dataIndex: 'permission_name',
      key: 'permission_name',
      fixed: 'left',
    },
    ...dataRoleOptions.map(({ role_id, role_name }) => {
      return {
        title: role_name,
        width: 70,
        align: 'center',
        render: (value) => {
          const fieldName = `permission_${value.permission_id}`;
          const fieldChecked = `${fieldName}_role_${role_id}_is_checked`;
          return (
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => {
                return (
                  <Checkbox
                    {...field}
                    checked={watch(fieldChecked)}
                    value={watch(fieldChecked)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setValue(fieldChecked, isChecked);
                      const handleChecked = ({ fieldName }) => {
                        const role_ids = watch(fieldName) ?? [];
                        if (isChecked) {
                          if (!role_ids.includes(role_id)) {
                            setValue(fieldName, [...role_ids, role_id]);
                          }
                        } else {
                          setValue(
                            fieldName,
                            role_ids.filter((item) => item !== role_id),
                          );
                        }
                      };

                      const permissionChildren = value.children;
                      if (permissionChildren) {
                        for (const per of permissionChildren) {
                          const fieldName = `permission_${per.permission_id}`;
                          const fieldChecked = `${fieldName}_role_${role_id}_is_checked`;
                          setValue(fieldChecked, isChecked);
                          handleChecked({ fieldName });
                        }
                      }
                      handleChecked({ fieldName });
                    }}></Checkbox>
                );
              }}
            />
          );
        },
      };
    }),
  ];

  const queryClient = useQueryClient();
  const handleImport = async ({ file }) => {
    if (file.status === 'done') {
      toast.success(`${file.name} file uploaded successfully`);
      await queryClient.invalidateQueries({ queryKey: keyPermissionList });
      await queryClient.invalidateQueries({ queryKey: keyRoleOptions });
      await queryClient.invalidateQueries({ queryKey: keyPermissionRoleList });
    } else if (file.status === 'error') {
      toast.error(`${file.name} file upload failed.`);
    }
  };
  const globalActions = [
    {
      content: 'Export',
      onClick: () => exportRolePermissionList(),
    },
    {
      render: () => (
        <CTUploadButton key={'role_permission_import'} content='Import' apiUrl={importUrl} onChange={handleImport} />
      ),
    },
    {
      content: 'Update',
      onClick: async () => {
        const values = getValues();
        if (isEmpty(values)) return toast.error('Not found values update!');
        const payload = [];
        for (const [key, value] of Object.entries(values)) {
          if (!isArray(value)) continue;
          payload.push({
            permission_id: key.replace('permission_', ''),
            role_ids: value,
          });
        }

        const { errors } = await updateRolePermission(payload);
        if (errors) return toast.error(errors);

        toast.success('Update role permission successful!');
      },
    },
    {
      content: 'Create role',
      onClick: () => setIsOpenRoleModal(true),
    },
    {
      content: 'Create permission',
      onClick: () => setIsOpenPermissionModal(true),
    },
  ];

  const onSearch = async (value) => {
    if (isSearchPermission) {
      setSearchPermissionValue(value);
      setSearchRole('');
      return;
    }
    setSearchPermissionValue('');
    setSearchRole(value);
  };

  return (
    <CTTable
      rowKey={'permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      isOverideColumns={true}
      rowSelection={false}
      currentPage={page}
      isShowActionDefault={false}
      globalActions={globalActions}
      columnsInfo={{}}
      onSearch={onSearch}
      isToggleColumnsView={false}
      isShowGlobalActionsDefault={false}
      searchProps={{
        addonBefore: <SearchAddonBefore onSelect={setSearchType} />,
      }}
    />
  );
}

export default RolePermissionTable;
