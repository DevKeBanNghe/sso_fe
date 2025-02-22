import { Layout } from 'antd';
import { MailFilled, LinkedinFilled, YoutubeFilled, GithubFilled, FacebookFilled } from '@ant-design/icons';
import { Space } from 'antd';
const { Footer: FooterLayout } = Layout;
const socials = [
  {
    link_to: 'https://www.linkedin.com/in/cutrung',
    icon: <LinkedinFilled style={{ color: '#2365b1' }} />,
  },
  {
    link_to: 'mailto:cuphanthanhtrung4112003@gmail.com',
    icon: <MailFilled style={{ color: '#42b8e5' }} />,
  },
  {
    link_to: 'https://www.youtube.com/channel/UCSW1h6pjj4WttEI_s4esvKg',
    icon: <YoutubeFilled style={{ color: '#fd0100' }} />,
  },
  {
    link_to: 'https://github.com/CuTrung',
    icon: <GithubFilled style={{ color: '#000' }} />,
  },
  {
    link_to: 'https://www.facebook.com/cuphan.thanhtrung/',
    icon: <FacebookFilled style={{ color: '#1775f1' }} />,
  },
];
const Footer = () => {
  return (
    <>
      <FooterLayout style={{ textAlign: 'center', bottom: 0 }}>
        <hr />
        <p style={{ float: 'left' }}>Dev Kể Bạn Nghe ©{new Date().getFullYear()} Created by Cù Trung</p>
        <Space style={{ float: 'right', fontSize: '24px' }} size={'middle'}>
          {socials.map((social) => (
            <a key={social.link_to} href={social.link_to} target='_blank' rel='noopener noreferrer'>
              {social.icon}
            </a>
          ))}
        </Space>
      </FooterLayout>
    </>
  );
};
export default Footer;
