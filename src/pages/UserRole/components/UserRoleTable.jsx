import useQueryKeys from 'hooks/useQueryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from 'antd';
import { getRoleOptions } from 'pages/Roles/service';
import { getUserList } from 'pages/Users/service';
import { exportUserRoleList, getUserRoleList, importUrl, updateUserRole } from '../service';
import { isArray, isEmpty } from 'lodash';
import { toast } from 'common/utils/toast.util';
import { useEffect, useMemo, useState } from 'react';
import CTTable from 'components/shared/CTTable';
import { SearchAddonBefore } from './SearchSelect';
import { SEARCH_TYPES } from '../const';
import CTUploadButton from 'components/shared/CTButton/CTUploadButton';

function UserRoleTable({ setIsOpenRoleModal, setIsOpenUserModal }) {
  const { keyList } = useQueryKeys();
  const { queryParams } = useCurrentPage();
  const { control, watch, setValue, getValues, reset } = useForm();
  const [searchType, setSearchType] = useState(() => {
    const defaultSearchType = SEARCH_TYPES.find((item) => item.isDefault) ?? SEARCH_TYPES[0];
    return defaultSearchType.value;
  });
  const [searchUserValue, setSearchUserValue] = useState();
  const [searchRoleValue, setSearchRole] = useState();

  const keyUserList = [`${keyList}-${queryParams.page}`, searchUserValue];
  const { data: queryGetUserListData = {}, isFetched: isFetchedUsers } = useQuery({
    queryKey: keyUserList,
    queryFn: () => getUserList({ ...queryParams, search: searchUserValue }),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetUserListData;
  const { totalItems, itemPerPage, list = [], page } = data ?? {};

  const keyRoleOptions = ['role_options', searchRoleValue];
  const { data: roleOptionsDataQuery = {}, isFetched: isFetchedRoles } = useQuery({
    queryKey: keyRoleOptions,
    queryFn: () => getRoleOptions({ search: searchRoleValue }),
  });

  const { data: dataRoleOptions = [] } = roleOptionsDataQuery;

  const isSearchUser = useMemo(() => {
    const searchTypeCurrent = SEARCH_TYPES.find((item) => item.value === searchType);
    return searchTypeCurrent.value === 'user';
  }, [searchType]);

  const keyUserRoleList = ['user_role_list', searchUserValue, searchRoleValue];
  const { data: userRoleDataQuery = {}, isLoading } = useQuery({
    queryKey: keyUserRoleList,
    queryFn: async () => {
      const user_id_role_id_list = list.reduce((acc, { user_id }) => {
        const data = dataRoleOptions.reduce((accRole, { role_id }) => [...accRole, { user_id, role_id }], []);
        return [...acc, ...data];
      }, []);
      const data = await getUserRoleList({ user_id_role_id_list });
      return data;
    },
    enabled: isFetchedUsers && isFetchedRoles,
  });

  const { data: userRoleData = [] } = userRoleDataQuery;

  useEffect(() => {
    if (userRoleData?.length > 0) {
      const data = {};
      for (const { user_id, role_ids } of userRoleData) {
        const fieldName = `user_${user_id}`;
        data[fieldName] = role_ids;
        for (const role_id of role_ids) {
          data[`${fieldName}_role_${role_id}_is_checked`] = true;
        }
      }
      reset(data);
    }
  }, [userRoleData]);

  const columns = [
    {
      title: '',
      width: 70,
      dataIndex: 'user_name',
      key: 'user_name',
      fixed: 'left',
    },
    ...dataRoleOptions.map(({ role_id, role_name }) => {
      return {
        title: role_name,
        width: 70,
        align: 'center',
        render: (value) => {
          const fieldName = `user_${value.user_id}`;
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

                      const userChildren = value.children;
                      if (userChildren) {
                        for (const per of userChildren) {
                          const fieldName = `user_${per.user_id}`;
                          const fieldChecked = `${fieldName}_role_${role_id}_is_checked`;
                          setValue(fieldChecked, isChecked);
                          handleChecked({ fieldName });
                        }
                      }
                      handleChecked({ fieldName });
                    }}
                  ></Checkbox>
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
      await queryClient.invalidateQueries({ queryKey: keyUserList });
      await queryClient.invalidateQueries({ queryKey: keyRoleOptions });
      await queryClient.invalidateQueries({ queryKey: keyUserRoleList });
    } else if (file.status === 'error') {
      toast.error(`${file.name} file upload failed.`);
    }
  };

  const globalActions = [
    {
      content: 'Export',
      onClick: () => exportUserRoleList(),
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
            user_id: key.replace('user_', ''),
            role_ids: value,
          });
        }

        const { errors } = await updateUserRole(payload);
        if (errors) return toast.error(errors);

        toast.success('Update user role successful!');
      },
    },
    {
      content: 'Create role',
      onClick: () => setIsOpenRoleModal(true),
    },
    {
      content: 'Create user',
      onClick: () => setIsOpenUserModal(true),
    },
  ];

  const onSearch = async (value) => {
    if (isSearchUser) {
      setSearchUserValue(value);
      setSearchRole('');
      return;
    }
    setSearchUserValue('');
    setSearchRole(value);
  };

  return (
    <CTTable
      rowKey={'user_id'}
      loading={isLoading}
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

export default UserRoleTable;
