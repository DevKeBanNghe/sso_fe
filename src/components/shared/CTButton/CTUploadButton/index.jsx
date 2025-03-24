import { Upload } from 'antd';
import CTButton from '..';
import { toast } from 'common/utils/toast.util';
import { UploadOutlined } from '@ant-design/icons';
const { VITE_API_URL: API_URL, VITE_WEBPAGE_KEY: WEBPAGE_KEY } = import.meta.env;

const httpConfig = {
  headers: {
    // 'Content-Type': 'multipart/form-data',
    authorization: 'authorization-text',
    'x-webpage-key': WEBPAGE_KEY,
  },
  withCredentials: true,
};
const CTUploadButton = ({ content = 'Upload', ...props }) => {
  const onChange = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
    if (file.status === 'done') {
      toast.success(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      toast.error(`${file.name} file upload failed.`);
    }
  };
  return (
    <Upload
      // name='file'
      accept='.xlsx, .xls'
      action={`${API_URL}/users/import`}
      {...httpConfig}
      onChange={onChange}
      {...props}>
      <CTButton icon={<UploadOutlined />}>{content}</CTButton>
    </Upload>
  );
};

export default CTUploadButton;
