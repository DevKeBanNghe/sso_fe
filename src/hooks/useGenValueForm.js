import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function useGenValueForm({ field_name, format, keys_dependency = [] }) {
  const { watch, setValue } = useFormContext();
  const values = watch(keys_dependency);
  useEffect(() => {
    setValue(field_name, typeof format === 'function' ? format(values) : format);
  }, [values]);
}
