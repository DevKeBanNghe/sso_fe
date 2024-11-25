import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useQuery } from '@tanstack/react-query';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from 'antd';
import { getRoleOptions } from 'pages/Roles/service';
import { getPermissionList } from 'pages/Permissions/service';
import { getRolePermissionList, updateRolePermission } from '../service';
import { isArray } from 'lodash';
import { toast } from 'common/utils/toast.util';
import { useEffect } from 'react';
function RolePermissionTable() {
  const { keyList } = useQueryKeys();
  const { queryParams } = useCurrentPage();
  const { control, watch, setValue, getValues, reset } = useForm();

  const { data: queryGetPermissionListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getPermissionList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetPermissionListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

  const { data: roleOptionsDataQuery = {} } = useQuery({
    queryKey: ['role_options'],
    queryFn: () => getRoleOptions(),
  });

  const { data: dataRoleOptions = [] } = roleOptionsDataQuery;

  const { data: rolePermissionDataQuery = {} } = useQuery({
    queryKey: ['role_permission_list'],
    queryFn: () => getRolePermissionList(),
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

  const globalActions = [
    {
      content: 'Update',
      onClick: async () => {
        const values = getValues();
        const payload = [];
        for (const [key, value] of Object.entries(values)) {
          if (!isArray(value)) continue;
          payload.push({
            permission_id: parseInt(key.replace('permission_', '')),
            role_ids: value,
          });
        }

        const { errors } = await updateRolePermission(payload);
        if (errors) return toast.error(errors);

        toast.success('Update role permission successful!');
      },
    },
  ];

  return (
    <CTTable
      rowKey={'permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      rowSelection={false}
      currentPage={page}
      isShowDefaultActions={false}
      globalActions={globalActions}
    />
  );
}

export default RolePermissionTable;
