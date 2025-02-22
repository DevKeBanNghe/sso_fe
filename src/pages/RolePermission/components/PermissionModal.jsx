import CTModal from 'components/shared/CTModal';
import PermissionForm from 'pages/Permissions/components/PermissionForm';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

function PermissionModalRef(props, ref) {
  const [isOpenPermissionModal, setIsOpenPermissionModal] = useState(false);
  const userFormRef = useRef();

  useImperativeHandle(ref, () => ({
    setIsOpenPermissionModal,
  }));

  return (
    <CTModal
      open={isOpenPermissionModal}
      title='Permission add'
      onCancel={() => setIsOpenPermissionModal(false)}
      onOk={() => userFormRef.current.onSubmit()}
    >
      <PermissionForm ref={userFormRef} isModal={true} />
    </CTModal>
  );
}

const PermissionModal = forwardRef(PermissionModalRef);

export default PermissionModal;
