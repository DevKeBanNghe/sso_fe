import { notification } from 'antd';
import { genUUID } from './string.util';
const TYPE_TOAST = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

notification.config({
  duration: 5,
  showProgress: true,
  pauseOnHover: true,
});

const execToast = (type = TYPE_TOAST.INFO, message = 'Đây là thông báo', options) => {
  const key = genUUID();
  notification[type]({
    key,
    description: message,
    onClick: () => notification.destroy(key),
    ...options,
  });
  return notification;
};

export const toast = {
  success: (message, options) => execToast(TYPE_TOAST.SUCCESS, message, options),
  error: (message, options) => execToast(TYPE_TOAST.ERROR, message, options),
  info: (message, options) => execToast(TYPE_TOAST.INFO, message, options),
  warning: (message, options) => execToast(TYPE_TOAST.WARNING, message, options),
};
