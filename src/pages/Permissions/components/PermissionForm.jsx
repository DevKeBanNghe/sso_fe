import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { getDataSelect } from 'common/utils/select.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPermission, getPermissionDetail, updatePermission } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import usePermissionOptions from '../hooks/usePermissionOptions';
import useGetDetail from 'hooks/useGetDetail';

function PermissionForm() {
  const { keyList } = useQueryKeys();
  const { id: currentPermissionId, isEdit, isCopy, setQueryParams } = useCurrentPage();

  const { control, handleSubmit, reset, setFocus } = useFormContext();
  const onSubmit = async (values) => {
    if (isCopy) delete values.permission_id;
    const payload = { ...values, permission_id: getDataSelect(values, 'permission_id') };
    currentPermissionId && isEdit
      ? mutationUpdatePermissions.mutate({ ...payload, permission_id: parseInt(currentPermissionId) })
      : mutationCreatePermissions.mutate(payload);
  };

  const queryClient = useQueryClient();

  const handlePermissionsImport = () => {};
  const { fetchOptions: fetchPermissionOptions } = usePermissionOptions();

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
  const formItems = [
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
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Permission Key' />;
      },
    },
    {
      field: 'permission_router',
      rules: {
        required: 'Please input your new permission_router!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Permission Router' />;
      },
    },
    {
      field: 'permission_name',
      rules: {
        required: 'Please input your new permission_name!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Permission Name' />;
      },
    },
    {
      field: 'permission_parent_id',
      render: ({ field }) => {
        return (
          <CTDebounceSelect {...field} placeholder={'Select permission parent'} fetchOptions={fetchPermissionOptions} />
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
  ];

  const { data: dataGetPermissionDetail } = useGetDetail({ func: getPermissionDetail });
  useEffect(() => {
    if (dataGetPermissionDetail) {
      setFocus('permission_name');
      reset(dataGetPermissionDetail);
    }
  }, [dataGetPermissionDetail]);

  return (
    <Card style={{ width: '100%' }}>
      <CTForm name='reset-password-form' items={formItems} global_control={control} onSubmit={handleSubmit(onSubmit)} />
    </Card>
  );
}

export default PermissionForm;
