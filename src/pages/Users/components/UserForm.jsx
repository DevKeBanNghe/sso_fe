import { Card } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { genUUID } from 'common/utils/string.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, getUserDetail, updateUser } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { ImportOutlined } from '@ant-design/icons';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetDetail from 'hooks/useGetDetail';
import { isEmpty } from 'lodash';
import { REQUIRED_FIELD_TEMPLATE } from 'common/templates/rules.template';

function UserFormRef({ isModal = false }, ref) {
  const { keyList } = useQueryKeys();
  const { id: currentUserId, isEdit, setQueryParams, isView, isCopy } = useCurrentPage();
  const { control, handleSubmit, reset, setFocus } = useForm({
    defaultValues: {
      user_password: genUUID(),
    },
  });

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    if (isCopy) delete values.user_id;
    if (isEmpty(values.user_password)) delete values.user_password;
    const payload = { ...values };
    currentUserId && isEdit
      ? mutationUpdateUsers.mutate({ ...payload, user_id: currentUserId })
      : mutationCreateUsers.mutate(payload);
  };

  const handleUsersImport = () => {};

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
  const formItems = [
    {
      render: () => {
        return (
          <CTButton style={{ float: 'right' }} icon={<ImportOutlined />} onClick={handleUsersImport}>
            Import
          </CTButton>
        );
      },
    },
    {
      field: 'user_name',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
      },
    },
    {
      field: 'user_password',
      rules: {
        required: isEdit ? false : REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput disabled={isView} formStateErrors={errors} rules={rules} {...field} />;
      },
    },
  ];

  const { data: dataGetUserDetail } = useGetDetail({ func: getUserDetail });
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
          isShowDefaultAction={isModal ? false : true}
        />
      </Card>
    </>
  );
}

const UserForm = forwardRef(UserFormRef);

export default UserForm;
