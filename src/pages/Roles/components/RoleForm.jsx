import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, getRoleDetail, getRoleOptions, updateRole } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';

function RoleFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentRoleId, isEdit, setQueryParams, isCopy } = useCurrentPage();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors },
    setFocus,
  } = (isFormModal ? useForm : useFormContext)();
  const onSubmit = async (values) => {
    if (isCopy) delete values.role_id;
    const payload = { ...values, role_id: getDataSelect(values, 'role_id') };
    currentRoleId && isEdit
      ? mutationUpdateRoles.mutate({ ...payload, role_id: parseInt(currentRoleId) })
      : mutationCreateRoles.mutate(payload);
  };

  const handleRolesImport = () => {};
  const handleFetchRoleOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['role_options'],
      queryFn: () => getRoleOptions({ role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'role_id', label: 'role_name' });
  };
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
  const formItems = useMemo(
    () => [
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
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Role Name' />;
        },
      },
      {
        field: 'role_parent_id',
        render: ({ field }) => {
          return (
            <CTDebounceSelect
              {...field}
              formStateErrors={formStateErrors}
              placeholder={'Select role parent'}
              fetchOptions={handleFetchRoleOptions}
            />
          );
        },
      },
      {
        field: 'role_description',
        render: ({ field }) => {
          return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} placeholder='Role Description' />;
        },
      },
    ],
    [formStateErrors],
  );

  const { data: queryGetRoleDetail = {} } = useQuery({
    queryKey: [keyDetail, currentRoleId],
    queryFn: () => getRoleDetail(currentRoleId),
    enabled: currentRoleId ? true : false,
  });
  const { data: dataGetRoleDetail } = queryGetRoleDetail;

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
