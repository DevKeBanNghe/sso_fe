import React from 'react';
const ResetPassword = React.lazy(() => import('./pages'));

const resetPasswordRouters = [
  {
    path: '/reset-password',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: ResetPassword,
  },
];

export default resetPasswordRouters;
