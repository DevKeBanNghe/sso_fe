import { api } from './api.util';
import { getCurrentDate } from './date.util';

const exportExcel = async ({ url, fileName, params = {} }) => {
  try {
    const { data } = await api.get(url, {
      responseType: 'blob',
      params,
    });
    if (!data) throw new Error(`Export ${fileName} excel failed!`);

    const urlResponse = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = urlResponse;
    link.setAttribute('download', `${fileName}_${getCurrentDate('DD_MM_YYYY')}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlResponse);
  } catch (error) {
    console.error('Error exporting Excel:', error);
  }
};

export { exportExcel };
