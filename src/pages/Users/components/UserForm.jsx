import { Card, Col, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CTModal from 'components/shared/CTModal';
import { useForm, useFormContext } from 'react-hook-form';
import { getRoleOptions } from 'pages/Roles/service';
import { genUUID, toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUserDetail, updateUser } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { PlusCircleFilled, ImportOutlined } from '@ant-design/icons';
import CTIcon from 'components/shared/CTIcon';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import RoleForm from 'pages/Roles/components/RoleForm';

function UserFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentUserId, isEdit, setQueryParams, isView, isCopy } = useCurrentPage();
  const groupUserFormRef = useRef();

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
    if (isCopy) delete values.user_id;
    const payload = { ...values, role_id: getDataSelect(values, 'role_id') };
    currentUserId && isEdit
      ? mutationUpdateUsers.mutate({ ...payload, user_id: parseInt(currentUserId) })
      : mutationCreateUsers.mutate(payload);
  };

  const handleUsersImport = () => {};
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
    toast.success(`${currentUserId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };
  const mutationCreateUsers = useMutation({
    mutationFn: createUser,
    onSuccess: async (data) => {
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdateUsers = useMutation({
    mutationFn: updateUser,
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
              onClick={handleUsersImport}
              content={'Import'}
            />
          );
        },
      },
      {
        field: 'user_name',
        rules: {
          required: 'Please input your new user_name!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='User Name' />;
        },
      },
      {
        field: 'user_password',
        rules: {
          required: 'Please input your new user_password!',
        },
        render: ({ field }) => {
          return (
            <CTInput
              disabled={isEdit || isView}
              formStateErrors={formStateErrors}
              {...field}
              placeholder='User Password'
            />
          );
        },
      },
      {
        field: 'role_id',
        rules: {
          required: 'Please input your new role_id!',
        },
        render: ({ field }) => {
          return (
            <Row>
              <Col span={22}>
                <CTDebounceSelect
                  {...field}
                  formStateErrors={formStateErrors}
                  placeholder={'Select role'}
                  fetchOptions={handleFetchRoleOptions}
                />
              </Col>

              <Col span={2}>
                <CTIcon
                  style={{ marginLeft: '5px', fontSize: '20px', marginTop: '10px' }}
                  color={'green'}
                  icon={PlusCircleFilled}
                  onClick={() => setIsOpenRoleModal(true)}
                />
              </Col>
            </Row>
          );
        },
      },
    ],
    [formStateErrors],
  );

  const { data: queryGetUserDetail = {} } = useQuery({
    queryKey: [keyDetail, currentUserId],
    queryFn: () => getUserDetail(currentUserId),
    enabled: currentUserId ? true : false,
  });
  const { data: dataGetUserDetail } = queryGetUserDetail;

  useEffect(() => {
    if (!dataGetUserDetail) return () => {};
    setFocus('user_name');
    reset({ ...dataGetUserDetail, user_password: isCopy ? genUUID() : null });
  }, [dataGetUserDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='user-form'
          items={formItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
        />
      </Card>
      <CTModal
        open={isOpenRoleModal}
        title='Group User add'
        onCancel={() => setIsOpenRoleModal(false)}
        onOk={() => groupUserFormRef.current.onSubmit()}
      >
        <RoleForm ref={groupUserFormRef} isShowDefaultActions={false} />
      </CTModal>
    </>
  );
}

const UserForm = forwardRef(UserFormRef);

export default UserForm;
