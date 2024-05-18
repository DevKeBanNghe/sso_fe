import { Card } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import {
  createGroupPermission,
  getGroupPermissionDetail,
  getGroupPermissionOptions,
  updateGroupPermission,
} from 'pages/GroupPermission/service';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import useQueryKeys from 'hooks/useQueryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPermissionOptions } from 'pages/Permissions/service';

function GroupPermissionFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const {
    formState: { errors: formStateErrors },
    control,
    handleSubmit,
    reset,
    setFocus,
  } = (isFormModal ? useForm : useFormContext)();
  const { id: currentGroupPermissionId, isEdit, isCopy, setQueryParams } = useCurrentPage();
  const { keyList, keyDetail } = useQueryKeys();
  const handleGroupPermissionImport = () => {};

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    try {
      if (isCopy) delete values.group_permission_id;
      const payload = {
        ...values,
        group_permission_parent_id: getDataSelect(values, 'group_permission_parent_id'),
        group_permission_webpage_id: getDataSelect(values, 'group_permission_webpage_id'),
      };
      currentGroupPermissionId && isEdit
        ? mutationUpdateRoles.mutate({ ...payload, group_permission_id: parseInt(currentGroupPermissionId) })
        : mutationCreateRoles.mutate(payload);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentGroupPermissionId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };
  const mutationCreateRoles = useMutation({
    mutationFn: createGroupPermission,
    onSuccess: (data) => {
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdateRoles = useMutation({
    mutationFn: updateGroupPermission,
    onSuccess: handleSubmitSuccess,
  });

  const handleFetchGroupPermissionOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['group_permission_options'],
      queryFn: () => getGroupPermissionOptions({ group_permission_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'group_permission_id', label: 'group_permission_name' });
  };

  const handleFetchPermissionOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['permission_options'],
      queryFn: () => getPermissionOptions({ permission_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'permission_id', label: 'permission_name' });
  };

  const groupPermissionItems = [
    {
      render: () => {
        return (
          <CTButton
            style={{ float: 'right' }}
            icon={<ImportOutlined />}
            onClick={handleGroupPermissionImport}
            content={'Import'}
          />
        );
      },
    },
    {
      field: 'group_permission_name',
      rules: {
        required: 'Please input your new group_permission_name!',
      },
      render: ({ field }) => {
        return (
          <CTInput
            {...field}
            autoSize
            size='large'
            placeholder='Group Permission Name'
            formStateErrors={formStateErrors}
          />
        );
      },
    },
    {
      field: 'group_permission_parent_id',
      render: ({ field }) => {
        return (
          <CTDebounceSelect
            {...field}
            placeholder={'Select Group Permission parent'}
            fetchOptions={handleFetchGroupPermissionOptions}
          />
        );
      },
    },
    {
      field: 'permission_ids',
      render: ({ field }) => {
        return (
          <CTDebounceSelect
            {...field}
            mode={'multiple'}
            placeholder={'Select Permissions'}
            fetchOptions={handleFetchPermissionOptions}
          />
        );
      },
    },
    {
      field: 'group_permission_description',
      render: ({ field }) => {
        return <CTInput {...field} size='large' prefix={<LockOutlined />} placeholder='Group Permission Description' />;
      },
    },
  ];

  const { data: queryGetGroupPermissionDetail = {} } = useQuery({
    queryKey: [keyDetail, currentGroupPermissionId],
    queryFn: () => getGroupPermissionDetail(currentGroupPermissionId),
    enabled: currentGroupPermissionId ? true : false,
  });
  const { data: dataGetGroupPermissionDetail } = queryGetGroupPermissionDetail;

  useEffect(() => {
    if (!dataGetGroupPermissionDetail) return () => {};
    setFocus('group_permission_name');
    reset(dataGetGroupPermissionDetail);
  }, [dataGetGroupPermissionDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='group-role-form'
          items={groupPermissionItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
        />
      </Card>
    </>
  );
}

const GroupPermissionForm = forwardRef(GroupPermissionFormRef);

export default GroupPermissionForm;
