import { Upload } from 'antd';
import CTButton from '..';
import { UploadOutlined } from '@ant-design/icons';
const { VITE_API_URL: API_URL, VITE_WEBPAGE_KEY: WEBPAGE_KEY } = import.meta.env;

const httpConfig = {
  headers: {
    authorization: 'authorization-text',
    'x-webpage-key': WEBPAGE_KEY,
  },
  withCredentials: true,
};
const CTUploadButton = ({ content = 'Upload', apiUrl, onChange, ...props }) => {
  return (
    <Upload
      showUploadList={false}
      accept='.xlsx, .xls'
      action={`${API_URL}${apiUrl}`}
      {...httpConfig}
      onChange={onChange}
      {...props}>
      <CTButton icon={<UploadOutlined />}>{content}</CTButton>
    </Upload>
  );
};

export default CTUploadButton;
