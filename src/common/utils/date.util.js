import moment from 'moment';
export const getCurrentDate = (format = 'DD/MM/YYYY') => {
  return moment().format(format);
};

export const antdDateToStringDate = ({ value, format = 'DD/MM/YYYY' }) => {
  if (!value) return value;
  return moment(new Date(value)).format(format);
};
