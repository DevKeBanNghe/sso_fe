import { Card, Col, Row } from 'antd';
import CTForm from 'components/shared/CTForm';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { createGroupRole, getGroupRoleDetail, getGroupRoleOptions, updateGroupRole } from 'pages/GroupRole/service';
import { toast } from 'common/utils';
import { getDataSelect, transferToOptionSelect } from 'common/utils/select.util';
import { DEFAULT_PAGINATION, SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import CTButton from 'components/shared/CTButton';
import { LockOutlined, PlusCircleFilled, ImportOutlined } from '@ant-design/icons';
import CTIcon from 'components/shared/CTIcon';
import CTDebounceSelect from 'components/shared/CTDebounceSelect';
import CTInput from 'components/shared/CTInput';
import { getWebPageOptions } from 'pages/Webpage/service';
import CTModal from 'components/shared/CTModal';
import useCurrentPage from 'hooks/useCurrentPage';
import useQueryKeys from 'hooks/useQueryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroupPermissionOptions } from 'pages/GroupPermission/service';
import GroupPermissionForm from 'pages/GroupPermission/components/GroupPermissionForm';
import WebpageForm from 'pages/Webpage/components/WebpageForm';
import RoleForm from 'pages/Roles/components/RoleForm';
import { getRoleOptions } from 'pages/Roles/service';

function GroupRoleFormRef({ isShowDefaultActions = true, isFormModal = !isShowDefaultActions }, ref) {
  const {
    formState: { errors: formStateErrors },
    control,
    handleSubmit,
    reset,
    setFocus,
  } = (isFormModal ? useForm : useFormContext)();

  const { id: currentGroupRoleId, isEdit, setQueryParams, isCopy } = useCurrentPage();
  const { keyList, keyDetail } = useQueryKeys();
  const [isOpenGroupPermissionModal, setIsOpenGroupPermissionModal] = useState(false);
  const groupPermissionFormRef = useRef();
  const [isOpenWebpageModal, setIsOpenWebpageModal] = useState(false);
  const webpageFormRef = useRef();
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const roleFormRef = useRef();
  const handleGroupRoleImport = () => {};

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit(onSubmit),
  }));

  const onSubmit = async (values) => {
    try {
      if (isCopy) delete values.group_role_id;
      const payload = {
        ...values,
        group_role_parent_id: getDataSelect(values, 'group_role_parent_id'),
        group_role_webpage_id: getDataSelect(values, 'group_role_webpage_id'),
        group_role_group_permission_id: getDataSelect(values, 'group_role_group_permission_id'),
      };
      currentGroupRoleId && isEdit
        ? mutationUpdateRoles.mutate({ ...payload, group_role_id: parseInt(currentGroupRoleId) })
        : mutationCreateRoles.mutate(payload);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitSuccess = ({ errors }) => {
    if (errors) return toast.error(errors);
    toast.success(`${currentGroupRoleId && isEdit ? 'Update' : 'Create'} successful`);
    setQueryParams((prev) => ({ ...prev, ...DEFAULT_PAGINATION }));
    queryClient.invalidateQueries({ queryKey: [`${keyList}-${DEFAULT_PAGINATION.page}`] });
  };

  const queryClient = useQueryClient();
  const mutationCreateRoles = useMutation({
    mutationFn: createGroupRole,
    onSuccess: (data) => {
      if (!data.errors) reset();
      handleSubmitSuccess(data);
    },
  });
  const mutationUpdateRoles = useMutation({
    mutationFn: updateGroupRole,
    onSuccess: handleSubmitSuccess,
  });

  const handleFetchWebPageOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['webpage_options'],
      queryFn: () => getWebPageOptions({ webpage_url: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'webpage_id', label: 'webpage_url' });
  };

  const handleFetchGroupRoleOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['group_role_options'],
      queryFn: () => getGroupRoleOptions({ group_role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'group_role_id', label: 'group_role_name' });
  };

  const handleFetchRoleOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['role_options'],
      queryFn: () => getRoleOptions({ role_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'role_id', label: 'role_name' });
  };

  const handleFetchGroupPermissionOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['group_permission_options'],
      queryFn: () => getGroupPermissionOptions({ group_permission_name: value, limit: SELECT_LIMIT_OPTIONS }),
    });
    return transferToOptionSelect({ data, value: 'group_permission_id', label: 'group_permission_name' });
  };

  const groupRoleItems = [
    {
      render: () => {
        return (
          <CTButton
            style={{ float: 'right' }}
            icon={<ImportOutlined />}
            onClick={handleGroupRoleImport}
            content={'Import'}
          />
        );
      },
    },
    {
      field: 'webpage_id',
      render: ({ field }) => {
        return (
          <Row>
            <Col span={22}>
              <CTDebounceSelect {...field} fetchOptions={handleFetchWebPageOptions} placeholder={'Select web page'} />
            </Col>
            <Col span={2}>
              <CTIcon
                style={{ marginLeft: '5px', fontSize: '20px', marginTop: '10px' }}
                color={'green'}
                icon={PlusCircleFilled}
                onClick={() => setIsOpenWebpageModal(true)}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      field: 'group_role_name',
      rules: {
        required: 'Please input your new group_role_name!',
      },
      render: ({ field }) => {
        return (
          <CTInput {...field} autoSize size='large' placeholder='Group Role Name' formStateErrors={formStateErrors} />
        );
      },
    },
    {
      field: 'group_role_parent_id',
      render: ({ field }) => {
        return (
          <CTDebounceSelect
            {...field}
            placeholder={'Select group role parent'}
            fetchOptions={handleFetchGroupRoleOptions}
          />
        );
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
      field: 'group_permission_ids',
      render: ({ field }) => {
        return (
          <Row>
            <Col span={22}>
              <CTDebounceSelect
                {...field}
                mode={'multiple'}
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
      field: 'group_role_description',
      render: ({ field }) => {
        return <CTInput {...field} size='large' prefix={<LockOutlined />} placeholder='Group Role Description' />;
      },
    },
  ];

  const { data: queryGetGroupRoleDetail = {} } = useQuery({
    queryKey: [keyDetail, currentGroupRoleId],
    queryFn: () => getGroupRoleDetail(currentGroupRoleId),
    enabled: currentGroupRoleId ? true : false,
  });
  const { data: dataGetGroupRoleDetail } = queryGetGroupRoleDetail;

  useEffect(() => {
    if (!dataGetGroupRoleDetail) return () => {};
    setFocus('group_role_name');
    reset(dataGetGroupRoleDetail);
  }, [dataGetGroupRoleDetail]);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CTForm
          name='group-role-form'
          items={groupRoleItems}
          global_control={control}
          onSubmit={handleSubmit(onSubmit)}
          isShowDefaultActions={isShowDefaultActions}
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
      <CTModal
        open={isOpenWebpageModal}
        title='Webpage add'
        onCancel={() => setIsOpenWebpageModal(false)}
        onOk={() => webpageFormRef.current.onSubmit()}
      >
        <WebpageForm ref={webpageFormRef} isShowDefaultActions={false} />
      </CTModal>
      <CTModal
        open={isOpenRoleModal}
        title='Role add'
        onCancel={() => setIsOpenRoleModal(false)}
        onOk={() => roleFormRef.current.onSubmit()}
      >
        <RoleForm ref={roleFormRef} isShowDefaultActions={false} />
      </CTModal>
    </>
  );
}

const GroupRoleForm = forwardRef(GroupRoleFormRef);

export default GroupRoleForm;
