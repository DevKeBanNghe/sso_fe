import { Card, Col, Input, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'common/utils/toast.util';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWebpage, getWebpageDetail, updateWebpage } from '../service';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, ImportOutlined, PlusCircleFilled } from '@ant-design/icons';
import useQueryKeys from 'hooks/useQueryKeys';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import { PERMISSIONS_KEY_MUTATION } from '../const';
import { upperCase } from 'lodash';
import useGenValueForm from 'hooks/useGenValueForm';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import CTIcon from 'components/shared/CTIcon';
import { getRoleOptions } from 'pages/Roles/service';
import CTModal from 'components/shared/CTModal';
import RoleForm from 'pages/Roles/components/RoleForm';
import usePermissionOptions from 'pages/Permissions/hooks/usePermissionOptions';
import useGetDetail from 'hooks/useGetDetail';

function WebpageFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const { keyList } = useQueryKeys();
  const { id: currentWebpageId, isEdit, setQueryParams, isCopy } = useCurrentPage();
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const roleFormRef = useRef();

  const { control, handleSubmit, reset, setFocus, watch } = (isFormModal ? useForm : useFormContext)();

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

  const handleFetchRoleOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['role_options'],
      queryFn: () => getRoleOptions({ role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'role_id', label: 'role_name' });
  };

  const { fetchOptions } = usePermissionOptions({ params: { role_ids: watch('role_ids')?.join(',') } });

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
        required: 'Please input your new webpage_name!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Webpage name' />;
      },
    },
    {
      field: 'webpage_url',
      rules: {
        required: 'Please input your new webpage_url!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Webpage url' />;
      },
    },
    {
      field: 'webpage_key',
      rules: {
        required: 'Please input your new webpage_key!',
      },
      render: ({ field, formState: { errors } }) => {
        return <CTInput formStateErrors={errors} {...field} placeholder='Webpage key' />;
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
                onClick={() => setIsOpenRoleModal(true)}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      field: 'key_all_permission',
      render: ({ field }) => {
        return <CTDebounceSelect {...field} placeholder={'Select key all permission'} fetchOptions={fetchOptions} />;
      },
    },
    {
      field: 'webpage_description',
      render: ({ field }) => {
        return <Input.TextArea {...field} size='large' prefix={<LockOutlined />} placeholder='Webpage Description' />;
      },
    },
  ];

  const { data: dataGetWebpageDetail } = useGetDetail({ func: getWebpageDetail });
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
      <CTModal
        open={isOpenRoleModal}
        title='Role add'
        onCancel={() => setIsOpenRoleModal(false)}
        onOk={() => roleFormRef.current.onSubmit()}>
        <RoleForm ref={roleFormRef} isShowDefaultActions={false} />
      </CTModal>
    </>
  );
}

const WebpageForm = forwardRef(WebpageFormRef);

export default WebpageForm;
