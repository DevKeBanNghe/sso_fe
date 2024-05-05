import { Modal } from 'antd';
const CTModal = ({ children, title = 'CTModal', open = false, footer, onCancel, onOk, ...props }) => {
  return (
    <>
      <Modal
        {...props}
        maskClosable={false}
        open={open}
        title={title}
        onOk={onOk}
        onCancel={onCancel}
        footer={footer}
        okText={'Submit'}
      >
        {children}
      </Modal>
    </>
  );
};
export default CTModal;
