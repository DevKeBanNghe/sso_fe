import { isObject } from 'lodash';

export const transferToOptionSelect = ({ data = [], value = 'id', label = '' }) =>
  data?.map((item) => ({
    value: item[value] ?? item,
    label: item[label] ?? item,
  }));

export const getDataSelect = (data = {}, key) => {
  const obj = data[key];
  if (!obj) return obj;
  return isObject(obj) ? obj.value : obj;
};
