import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { getDataSelect } from 'common/utils/select.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, getRoleDetail, updateRole } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetDetail from 'hooks/useGetDetail';
import useRoleOptions from '../hooks/useRoleOptions';

function RoleFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const { keyList } = useQueryKeys();
  const { id: currentRoleId, isEdit, setQueryParams, isCopy } = useCurrentPage();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const { control, handleSubmit, reset, setFocus } = (isFormModal ? useForm : useFormContext)();
  const onSubmit = async (values) => {
    if (isCopy) delete values.role_id;
    const payload = { ...values, role_id: getDataSelect(values, 'role_id') };
    currentRoleId && isEdit
      ? mutationUpdateRoles.mutate({ ...payload, role_id: parseInt(currentRoleId) })
      : mutationCreateRoles.mutate(payload);
  };

  const handleRolesImport = () => {};
  const { fetchOptions: handleFetchRoleOptions } = useRoleOptions();

  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentRoleId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };
  const mutationCreateRoles = useMutation({
    mutationFn: createRole,
    onSuccess: async (data) => {
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });

  const mutationUpdateRoles = useMutation({
    mutationFn: updateRole,
    onSuccess: handleSubmitSuccess,
  });
  const formItems = [
    {
      render: () => {
        return (
          <CTButton style={{ float: 'right' }} icon={<ImportOutlined />} onClick={handleRolesImport}>
            Import
          </CTButton>
        );
      },
    },
    {
      field: 'role_name',
      rules: {
        required: 'Please input your new role_name!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Role Name' />;
      },
    },
    {
      field: 'role_parent_id',
      render: ({ field }) => {
        return <CTDebounceSelect {...field} placeholder={'Select role parent'} fetchOptions={handleFetchRoleOptions} />;
      },
    },
    {
      field: 'role_description',
      render: ({ field }) => {
        return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} placeholder='Role Description' />;
      },
    },
  ];

  const { data: dataGetRoleDetail } = useGetDetail({ func: getRoleDetail });
  useEffect(() => {
    if (!dataGetRoleDetail) return () => {};
    setFocus('role_name');
    reset(dataGetRoleDetail);
  }, [dataGetRoleDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='role-form'
          items={formItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
        />
      </Card>
    </>
  );
}

const RoleForm = forwardRef(RoleFormRef);

export default RoleForm;
