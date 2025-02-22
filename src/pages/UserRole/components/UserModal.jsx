import CTModal from 'components/shared/CTModal';
import UserForm from 'pages/Users/components/UserForm';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

function UserModalRef(props, ref) {
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const userFormRef = useRef();

  useImperativeHandle(ref, () => ({
    setIsOpenUserModal,
  }));

  return (
    <CTModal
      open={isOpenUserModal}
      title='User add'
      onCancel={() => setIsOpenUserModal(false)}
      onOk={() => userFormRef.current.onSubmit()}
    >
      <UserForm ref={userFormRef} isModal={true} />
    </CTModal>
  );
}

const UserModal = forwardRef(UserModalRef);

export default UserModal;
