import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPermission, getPermissionDetail, getPermissionOptions, updatePermission } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';

function PermissionForm() {
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentPermissionId, isEdit, isCopy, setQueryParams } = useCurrentPage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors },
    setFocus,
  } = useFormContext();
  const onSubmit = async (values) => {
    if (isCopy) delete values.permission_id;
    const payload = { ...values, permission_id: getDataSelect(values, 'permission_id') };
    currentPermissionId && isEdit
      ? mutationUpdatePermissions.mutate({ ...payload, permission_id: parseInt(currentPermissionId) })
      : mutationCreatePermissions.mutate(payload);
  };

  const handlePermissionsImport = () => {};
  const handleFetchPermissionOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['permission_options'],
      queryFn: () => getPermissionOptions({ permission_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'permission_id', label: 'permission_name' });
  };
  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentPermissionId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };
  const mutationCreatePermissions = useMutation({
    mutationFn: createPermission,
    onSuccess: async (data) => {
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdatePermissions = useMutation({
    mutationFn: updatePermission,
    onSuccess: handleSubmitSuccess,
  });
  const formItems = useMemo(
    () => [
      {
        render: () => {
          return (
            <CTButton style={{ float: 'right' }} icon={<ImportOutlined />} onClick={handlePermissionsImport}>
              Import
            </CTButton>
          );
        },
      },
      {
        field: 'permission_key',
        rules: {
          required: 'Please input your new permission_key!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Permission Key' />;
        },
      },
      {
        field: 'permission_router',
        rules: {
          required: 'Please input your new permission_router!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Permission Router' />;
        },
      },
      {
        field: 'permission_name',
        rules: {
          required: 'Please input your new permission_name!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Permission Name' />;
        },
      },
      {
        field: 'permission_parent_id',
        render: ({ field }) => {
          return (
            <CTDebounceSelect
              {...field}
              formStateErrors={formStateErrors}
              placeholder={'Select permission parent'}
              fetchOptions={handleFetchPermissionOptions}
            />
          );
        },
      },
      {
        field: 'permission_description',
        render: ({ field }) => {
          return (
            <Input.TextArea {...field} size='large' prefix={<LockOutlined />} placeholder='Permission Description' />
          );
        },
      },
    ],
    [formStateErrors],
  );

  const { data: queryGetPermissionDetail = {} } = useQuery({
    queryKey: [keyDetail, currentPermissionId],
    queryFn: () => getPermissionDetail(currentPermissionId),
    enabled: currentPermissionId ? true : false,
  });
  const { data: dataGetPermissionDetail } = queryGetPermissionDetail;

  useEffect(() => {
    if (!dataGetPermissionDetail) return () => {};
    setFocus('permission_name');
    reset(dataGetPermissionDetail);
  }, [dataGetPermissionDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='reset-password-form'
          items={formItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
        />
      </Card>
    </>
  );
}

export default PermissionForm;
