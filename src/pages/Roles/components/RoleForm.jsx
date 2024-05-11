import { Card, Checkbox, Col, Input, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CTModal from 'components/shared/CTModal';
import { useForm, useFormContext } from 'react-hook-form';
import { getGroupRoleOptions } from 'pages/GroupRole/service';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, getRoleDetail, updateRole } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, PlusCircleFilled, ImportOutlined } from '@ant-design/icons';
import CTIcon from 'components/shared/CTIcon';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import GroupRoleForm from 'pages/GroupRole/components/GroupRoleForm';

function RoleFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const [isOpenGroupRoleModal, setIsOpenGroupRoleModal] = useState(false);
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentRoleId, isEdit, setQueryParams, isCopy } = useCurrentPage();
  const groupRoleFormRef = useRef();

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
    const payload = { ...values, group_role_id: getDataSelect(values, 'group_role_id') };
    currentRoleId && isEdit
      ? mutationUpdateRoles.mutate({ ...payload, role_id: parseInt(currentRoleId) })
      : mutationCreateRoles.mutate(payload);
  };

  const handleRolesImport = () => {};
  const handleFetchGroupRoleOptions = async (value) => {
    const { data, errors } = await queryClient.fetchQuery({
      queryKey: ['group_role_options'],
      queryFn: () => getGroupRoleOptions({ group_role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    if (errors) return toast.error(errors);
    return transferToOptionSelect({ data, value: 'group_role_id', label: 'group_role_name' });
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
            <CTButton
              style={{ float: 'right' }}
              icon={<ImportOutlined />}
              onClick={handleRolesImport}
              content={'Import'}
            />
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
        field: 'group_role_id',
        rules: {
          required: 'Please input your new group_role_id!',
        },
        render: ({ field }) => {
          return (
            <Row>
              <Col span={22}>
                <CTDebounceSelect
                  {...field}
                  formStateErrors={formStateErrors}
                  placeholder={'Select group role'}
                  fetchOptions={handleFetchGroupRoleOptions}
                />
              </Col>

              <Col span={2}>
                <CTIcon
                  style={{ marginLeft: '5px', fontSize: '20px', marginTop: '10px' }}
                  color={'green'}
                  icon={PlusCircleFilled}
                  onClick={() => setIsOpenGroupRoleModal(true)}
                />
              </Col>
            </Row>
          );
        },
      },
      {
        field: 'role_is_all_permissions',
        render: ({ field }) => {
          return (
            <Checkbox {...field} checked={field.value}>
              All Permissions
            </Checkbox>
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
      <CTModal
        open={isOpenGroupRoleModal}
        title='Group Role add'
        onCancel={() => setIsOpenGroupRoleModal(false)}
        onOk={() => groupRoleFormRef.current.onSubmit()}
      >
        <GroupRoleForm ref={groupRoleFormRef} isShowDefaultActions={false} />
      </CTModal>
    </>
  );
}

const RoleForm = forwardRef(RoleFormRef);

export default RoleForm;
