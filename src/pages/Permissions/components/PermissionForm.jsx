import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { toast } from 'common/utils/toast.util';
import { getDataSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPermission,
  getHttpMethodOptions,
  getPermissionActionsOptions,
  getPermissionDetail,
  importUrl,
  updatePermission,
} from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import { LockOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import usePermissionOptions from '../hooks/usePermissionOptions';
import useGetDetail from 'hooks/useGetDetail';
import { useForm } from 'react-hook-form';
import { REQUIRED_FIELD_TEMPLATE } from 'common/templates/rules.template';
import CTCheckboxTree from 'components/shared/CTCheckbox/CheckboxTree';
import CTUploadButton from 'components/shared/CTButton/CTUploadButton';

function PermissionFormRef({ isModal = false, queryKeyFetchListTable }, ref) {
  const { keyList } = useQueryKeys();
  const { id: currentPermissionId, isEdit, isCopy, setQueryParams } = useCurrentPage();
  const [checkedKeysDefault, setCheckedKeysDefault] = useState([]);
  const { control, handleSubmit, reset, setFocus, setValue } = useForm();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    if (isCopy) delete values.permission_id;
    const payload = { ...values, permission_id: getDataSelect(values, 'permission_id') };
    currentPermissionId && isEdit
      ? mutationUpdatePermissions.mutate({ ...payload, permission_id: currentPermissionId })
      : mutationCreatePermissions.mutate(payload);
  };

  const queryClient = useQueryClient();

  const handlePermissionsImport = () => {};
  const { fetchOptions: fetchPermissionOptions } = usePermissionOptions();

  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentPermissionId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: queryKeyFetchListTable });
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

  const { data: permissionActionOptionsData = [] } = useQuery({
    queryKey: ['getPermissionActionsOptions'],
    queryFn: async () => {
      const { data, errors } = await getPermissionActionsOptions();
      if (errors) return toast.error('Get permission action options failed!');
      return data;
    },
  });

  const { data: httpMethodOptionsData = [] } = useQuery({
    queryKey: ['getHttpMethodOptions'],
    queryFn: async () => {
      const { data, errors } = await getHttpMethodOptions();
      if (errors) return toast.error('Get http method options failed!');
      return data;
    },
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
      field: 'permission_key',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
      },
    },
    {
      field: 'permission_router',
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} />;
      },
    },
    {
      render: () => {
        const checkboxActions = httpMethodOptionsData.map((method) => ({
          title: method,
          key: method,
          children: permissionActionOptionsData.map((action) => ({ title: action, key: `${method}_${action}` })),
        }));

        const onCheck = (values) => {
          const permission_actions = values.reduce((acc, value) => {
            const methodChecked = httpMethodOptionsData.find((item) => item === value);
            if (methodChecked) {
              acc[methodChecked] = ['manage'];
              return acc;
            }
            const [method, action] = value.split('_');
            const actionsPrev = acc[method] ?? [];
            const isExistManageAction = actionsPrev.includes('manage');
            if (!isExistManageAction) {
              acc[method] = [...actionsPrev, action];
            }
            return acc;
          }, {});

          setValue('permission_actions', permission_actions);
        };
        return <CTCheckboxTree data={checkboxActions} onCheck={onCheck} checkedKeysDefault={checkedKeysDefault} />;
      },
    },
    {
      field: 'permission_name',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
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
        return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} />;
      },
    },
  ];

  const { data: dataGetPermissionDetail } = useGetDetail({ func: getPermissionDetail });
  useEffect(() => {
    if (dataGetPermissionDetail) {
      setFocus('permission_name');
      reset(dataGetPermissionDetail);
      const permission_actions = dataGetPermissionDetail.permission_actions;
      if (permission_actions) {
        const checkboxActions = Object.entries(dataGetPermissionDetail.permission_actions).reduce(
          (acc, [method, actions]) => {
            const isExistManageAction = actions.includes('manage');
            acc.push(
              ...(isExistManageAction ? permissionActionOptionsData : actions).map((action) => `${method}_${action}`),
            );
            return acc;
          },
          [],
        );
        setCheckedKeysDefault(checkboxActions);
      }
    }
  }, [dataGetPermissionDetail]);

  return (
    <Card style={{ width: '100%' }}>
      <CTForm
        name='reset-password-form'
        items={formItems}
        global_control={control}
        onSubmit={handleSubmit(onSubmit)}
        isShowActionDefault={isModal ? false : true}
      />
    </Card>
  );
}

const PermissionForm = forwardRef(PermissionFormRef);

export default PermissionForm;
