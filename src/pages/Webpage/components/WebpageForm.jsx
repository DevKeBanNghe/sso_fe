import { Card, Col, Input, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWebpage, getWebpageDetail, updateWebpage } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined, PlusCircleFilled } from '@ant-design/icons';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import CTIcon from 'components/shared/CTIcon';
import { getRoleOptions } from 'pages/Roles/service';
import CTModal from 'components/shared/CTModal';
import RoleForm from 'pages/Roles/components/RoleForm';
import useGetDetail from 'hooks/useGetDetail';
import { genUUID } from 'common/utils/string.util';
import { REQUIRED_FIELD_TEMPLATE } from 'common/templates/rules.template';

function WebpageFormRef({ queryKeyFetchListTable }, ref) {
  const { id: currentWebpageId, isEdit, setQueryParams, isCopy, isView } = useCurrentPage();
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const roleFormRef = useRef();

  const { control, handleSubmit, reset, setFocus } = useForm({
    defaultValues: {
      webpage_key: genUUID(),
    },
  });

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    if (isCopy) delete values.webpage_id;
    const payload = { ...values };
    currentWebpageId && isEdit
      ? mutationUpdateWebpages.mutate({ ...payload, webpage_id: currentWebpageId })
      : mutationCreateWebpages.mutate(payload);
  };

  const handleWebpagesImport = () => {};
  const queryClient = useQueryClient();
  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentWebpageId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: queryKeyFetchListTable });
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

  const handleFetchRoleOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['role_options'],
      queryFn: () => getRoleOptions({ role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'role_id', label: 'role_name' });
  };

  const formItems = [
    {
      render: () => {
        return (
          <CTButton style={{ float: 'right' }} icon={<ImportOutlined />} onClick={handleWebpagesImport}>
            Import
          </CTButton>
        );
      },
    },
    {
      field: 'webpage_name',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
      },
    },
    {
      field: 'webpage_url',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
      },
    },
    {
      field: 'webpage_key',
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      render: ({ field, formState: { errors }, rules }) => {
        return <CTInput formStateErrors={errors} rules={rules} {...field} />;
      },
    },
    {
      field: 'role_ids',
      render: ({ field }) => {
        return (
          <Row>
            <Col span={22}>
              <CTDebounceSelect
                {...field}
                mode={'multiple'}
                placeholder={'Select roles'}
                fetchOptions={handleFetchRoleOptions}
              />
            </Col>
            <Col span={2}>
              <CTIcon
                style={{ marginLeft: '5px', fontSize: '20px', marginTop: '10px' }}
                color={'green'}
                icon={PlusCircleFilled}
                onClick={() => setIsOpenRoleModal(isView ? false : true)}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      field: 'webpage_description',
      render: ({ field }) => {
        return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} />;
      },
    },
  ];

  const { data: dataGetWebpageDetail } = useGetDetail({ func: getWebpageDetail });
  useEffect(() => {
    if (!dataGetWebpageDetail) return () => {};
    setFocus('webpage_url');
    if (isCopy) delete dataGetWebpageDetail.webpage_key;
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
          isShowDefaultAction={true}
        />
      </Card>
      <CTModal
        open={isOpenRoleModal}
        title='Role add'
        onCancel={() => setIsOpenRoleModal(false)}
        onOk={() => roleFormRef.current.onSubmit()}
      >
        <RoleForm ref={roleFormRef} isModal={true} />
      </CTModal>
    </>
  );
}

const WebpageForm = forwardRef(WebpageFormRef);

export default WebpageForm;
