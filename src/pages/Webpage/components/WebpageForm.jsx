import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'common/utils';
import { getDataSelect } from 'common/utils/select.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWebpage, updateWebpage } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';

function WebpageFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const { keyList } = useQueryKeys();
  const { id: currentWebpageId, isEdit, setQueryParams } = useCurrentPage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors },
  } = (isFormModal ? useForm : useFormContext)();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    const payload = { ...values, group_webpage_id: getDataSelect(values, 'group_webpage_id') };
    currentWebpageId
      ? mutationUpdateWebpages.mutate({ ...payload, webpage_id: parseInt(currentWebpageId) })
      : mutationCreateWebpages.mutate(payload);
  };

  const handleWebpagesImport = () => {};
  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentWebpageId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };
  const mutationCreateWebpages = useMutation({
    mutationFn: createWebpage,
    onSuccess: async (data) => {
      if (!data.errors) reset({ webpage_url: '' });
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdateWebpages = useMutation({
    mutationFn: updateWebpage,
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
              onClick={handleWebpagesImport}
              content={'Import'}
            />
          );
        },
      },
      {
        field: 'webpage_url',
        rules: {
          required: 'Please input your new webpage_url!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Webpage url' />;
        },
      },
      {
        field: 'webpage_description',
        render: ({ field }) => {
          return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} placeholder='Webpage Description' />;
        },
      },
    ],
    [formStateErrors],
  );

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='webpage-form'
          items={formItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
        />
      </Card>
    </>
  );
}

const WebpageForm = forwardRef(WebpageFormRef);

export default WebpageForm;
