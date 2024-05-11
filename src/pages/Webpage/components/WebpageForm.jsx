import { Card, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'common/utils';
import { getDataSelect } from 'common/utils/select.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createWebpage, getWebpageDetail, updateWebpage } from '../service';
import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined } from '@ant-design/icons';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import { PERMISSIONS_KEY_MUTATION } from '../const';
import { upperCase } from 'lodash';
import useGenValueForm from 'hooks/useGenValueForm';

function WebpageFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const { keyList, keyDetail } = useQueryKeys();
  const { id: currentWebpageId, isEdit, setQueryParams, isCopy } = useCurrentPage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors },
    setFocus,
  } = (isFormModal ? useForm : useFormContext)();

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    if (isCopy) delete values.webpage_id;
    const payload = { ...values, group_webpage_id: getDataSelect(values, 'group_webpage_id') };
    currentWebpageId && isEdit
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
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdateWebpages = useMutation({
    mutationFn: updateWebpage,
    onSuccess: handleSubmitSuccess,
  });

  useGenValueForm({
    field_name: 'webpage_key',
    format: (values) => `WP_${upperCase(values[0])}`,
    keys_dependency: ['webpage_name'],
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
        field: 'webpage_name',
        rules: {
          required: 'Please input your new webpage_name!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Webpage name' />;
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
        field: 'webpage_key',
        rules: {
          required: 'Please input your new webpage_key!',
        },
        render: ({ field }) => {
          return <CTInput formStateErrors={formStateErrors} {...field} placeholder='Webpage key' />;
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

  const { data: queryGetWebpageDetail = {} } = useQuery({
    queryKey: [keyDetail, currentWebpageId],
    queryFn: () => getWebpageDetail(currentWebpageId),
    enabled: currentWebpageId ? true : false,
  });
  const { data: dataGetWebpageDetail } = queryGetWebpageDetail;

  useEffect(() => {
    if (!dataGetWebpageDetail) return () => {};
    setFocus('webpage_url');
    reset(dataGetWebpageDetail);
  }, [dataGetWebpageDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='webpage-form'
          items={formItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
          permission_keys_default_actions={PERMISSIONS_KEY_MUTATION}
        />
      </Card>
    </>
  );
}

const WebpageForm = forwardRef(WebpageFormRef);

export default WebpageForm;
