import { Card, Col, Input, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useEffect, useMemo, useRef, useState } from 'react';
import CTModal from 'components/shared/CTModal';
import { useFormContext } from 'react-hook-form';
import { getGroupPermissionOptions } from 'pages/GroupPermission/service';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPermission, getPermissionDetail, updatePermission } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, PlusCircleFilled, ImportOutlined } from '@ant-design/icons';
import CTIcon from 'components/shared/CTIcon';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import GroupPermissionForm from 'pages/GroupPermission/components/GroupPermissionForm';

function PermissionForm() {
  const [isOpenGroupPermissionModal, setIsOpenGroupPermissionModal] = useState(false);
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentPermissionId, isEdit, isCopy, setQueryParams } = useCurrentPage();
  const groupPermissionFormRef = useRef();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors },
    setFocus,
  } = useFormContext();
  const onSubmit = async (values) => {
    if (isCopy) delete values.permission_id;
    const payload = { ...values, group_permission_id: getDataSelect(values, 'group_permission_id') };
    currentPermissionId && isEdit
      ? mutationUpdatePermissions.mutate({ ...payload, permission_id: parseInt(currentPermissionId) })
      : mutationCreatePermissions.mutate(payload);
  };

  const handlePermissionsImport = () => {};
  const handleFetchGroupPermissionOptions = async (value) => {
    const { data, errors } = await queryClient.fetchQuery({
      queryKey: ['group_permission_options'],
      queryFn: () => getGroupPermissionOptions({ group_permission_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    if (errors) return toast.error(errors);
    return transferToOptionSelect({ data, value: 'group_permission_id', label: 'group_permission_name' });
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
            <CTButton
              style={{ float: 'right' }}
              icon={<ImportOutlined />}
              onClick={handlePermissionsImport}
              content={'Import'}
            />
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
        field: 'group_permission_id',
        rules: {
          required: 'Please input your new group_permission_id!',
        },
        render: ({ field }) => {
          return (
            <Row>
              <Col span={22}>
                <CTDebounceSelect
                  {...field}
                  formStateErrors={formStateErrors}
                  placeholder={'Select group permission'}
                  fetchOptions={handleFetchGroupPermissionOptions}
                />
              </Col>

              <Col span={2}>
                <CTIcon
                  style={{ marginLeft: '5px', fontSize: '20px', marginTop: '10px' }}
                  color={'green'}
                  icon={PlusCircleFilled}
                  onClick={() => setIsOpenGroupPermissionModal(true)}
                />
              </Col>
            </Row>
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
      <CTModal
        open={isOpenGroupPermissionModal}
        title='Group Permission add'
        onCancel={() => setIsOpenGroupPermissionModal(false)}
        onOk={() => groupPermissionFormRef.current.onSubmit()}
      >
        <GroupPermissionForm ref={groupPermissionFormRef} isShowDefaultActions={false} />
      </CTModal>
    </>
  );
}

export default PermissionForm;
