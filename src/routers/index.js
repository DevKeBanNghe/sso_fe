import rolesRouters from 'pages/Roles/route';
import permissionRouters from 'pages/Permissions/route';
import webpageRouters from 'pages/Webpage/route';
import usersRouters from 'pages/Users/route';
import rolePermissionRouters from 'pages/RolePermission/route';
import userRoleRouters from 'pages/UserRole/route';

export const routers = [
  ...usersRouters,
  ...rolesRouters,
  ...userRoleRouters,
  ...permissionRouters,
  ...rolePermissionRouters,
  ...webpageRouters,
];
