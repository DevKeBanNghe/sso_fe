import { useQueryClient } from '@tanstack/react-query';
import CTModal from 'components/shared/CTModal';
import RoleForm from 'pages/Roles/components/RoleForm';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

function RoleModalRef(props, ref) {
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const roleFormRef = useRef();

  useImperativeHandle(ref, () => ({
    setIsOpenRoleModal,
  }));

  const queryClient = useQueryClient();
  const onSubmit = async () => {
    await roleFormRef.current.onSubmit();
    await queryClient.invalidateQueries({ queryKey: ['role_options'] });
  };

  return (
    <CTModal open={isOpenRoleModal} title='Role add' onCancel={() => setIsOpenRoleModal(false)} onOk={onSubmit}>
      <RoleForm ref={roleFormRef} isModal={true} />
    </CTModal>
  );
}

const RoleModal = forwardRef(RoleModalRef);

export default RoleModal;
