import { FormProvider, useForm } from 'react-hook-form';
import RolePermissionTable from '../components/RolePermissionTable';

export default function Permissions() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <RolePermissionTable />
    </FormProvider>
  );
}
