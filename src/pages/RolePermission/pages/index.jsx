import { useRef } from 'react';
import RolePermissionTable from '../components/RolePermissionTable';
import PermissionModal from '../components/PermissionModal';
import RoleModal from 'pages/UserRole/components/RoleModal';

export default function RolePermissionPage() {
  const roleModalRef = useRef();
  const permissionModalRef = useRef();

  const setIsOpenRoleModal = (value) => roleModalRef.current.setIsOpenRoleModal(value);
  const setIsOpenPermissionModal = (value) => permissionModalRef.current.setIsOpenPermissionModal(value);

  return (
    <>
      <RolePermissionTable
        setIsOpenRoleModal={setIsOpenRoleModal}
        setIsOpenPermissionModal={setIsOpenPermissionModal}
      />
      <RoleModal ref={roleModalRef} />
      <PermissionModal ref={permissionModalRef} />
    </>
  );
}
