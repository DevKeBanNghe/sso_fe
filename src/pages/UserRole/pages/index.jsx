import { useRef } from 'react';
import RoleModal from '../components/RoleModal';
import UserRoleTable from '../components/UserRoleTable';
import UserModal from '../components/UserModal';

export default function UserRolePage() {
  const roleModalRef = useRef();
  const userModalRef = useRef();

  const setIsOpenRoleModal = (value) => roleModalRef.current.setIsOpenRoleModal(value);
  const setIsOpenUserModal = (value) => userModalRef.current.setIsOpenUserModal(value);

  return (
    <>
      <UserRoleTable setIsOpenRoleModal={setIsOpenRoleModal} setIsOpenUserModal={setIsOpenUserModal} />
      <RoleModal ref={roleModalRef} />
      <UserModal ref={userModalRef} />
    </>
  );
}
