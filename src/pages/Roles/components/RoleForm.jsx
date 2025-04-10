import { Card } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, getRoleDetail, importUrl, updateRole } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import { LockOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetDetail from 'hooks/useGetDetail';
import useRoleOptions from '../hooks/useRoleOptions';
import CTInputTextArea from 'components/shared/CTInput/TextArea';
import { REQUIRED_FIELD_TEMPLATE } from 'common/templates/rules.template';
import { PERMISSION_KEYS } from '../const';
import { convertUndefinedToNull } from 'common/utils/common.util';
import CTUploadButton from 'components/shared/CTButton/CTUploadButton';

function RoleFormRef({ isModal = false, queryKeyFetchListTable }, ref) {
  const { id: currentRoleId, isEdit, setQueryParams, isCopy } = useCurrentPage();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const { control, handleSubmit, reset, setFocus } = useForm();
  const onSubmit = async (values) => {
    if (isCopy) delete values.role_id;
    const payload = convertUndefinedToNull(values);
    currentRoleId && isEdit
      ? mutationUpdateRoles.mutate({ ...payload, role_id: currentRoleId })
      : mutationCreateRoles.mutate(payload);
  };

  const handleRolesImport = () => {};
  const { fetchOptions: handleFetchRoleOptions } = useRoleOptions();

  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentRoleId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: queryKeyFetchListTable });
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

  const handleImport = ({ file }) => {
    if (file.status === 'done') {
      toast.success(`${file.name} file uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: queryKeyFetchListTable });
    } else if (file.status === 'error') {
      toast.error(`${file.name} file upload failed.`);
    }
  };

  const formItems = [
    {
      render: () => {
        return <CTUploadButton content='Import' apiUrl={importUrl} onChange={handleImport} />;
      },
    },
    {
      field: 'role_name',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
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
        return <CTInputTextArea {...field} size='large' prefix={<LockOutlined />} />;
      },
    },
  ];

  const { data: dataGetRoleDetail } = useGetDetail({ func: isModal ? null : getRoleDetail });
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
          isShowActionDefault={isModal ? false : true}
          permissionKeysDefaultAction={[
            {
              type: 'create',
              permission_keys: [PERMISSION_KEYS.CREATE_ROLE_PERMISSION],
            },
            {
              type: 'update',
              permission_keys: [PERMISSION_KEYS.CREATE_ROLE_PERMISSION],
            },
          ]}
        />
      </Card>
    </>
  );
}

const RoleForm = forwardRef(RoleFormRef);

export default RoleForm;
