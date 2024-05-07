import rolesRouters from 'pages/Roles/route';
import permissionRouters from 'pages/Permissions/route';
import groupRoleRouters from 'pages/GroupRole/route';
import groupPermissionRouters from 'pages/GroupPermission/route';
import webpageRouters from 'pages/Webpage/route';
import usersRouters from 'pages/Users/route';

export const routers = [
  ...usersRouters,
  ...rolesRouters,
  ...groupRoleRouters,
  ...permissionRouters,
  ...groupPermissionRouters,
  ...webpageRouters,
];
