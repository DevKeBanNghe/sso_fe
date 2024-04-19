export default function CTIcon({ icon: Icon, fontSize = '40px', color, style, ...configs }) {
  return <Icon style={{ color, fontSize, cursor: 'pointer', ...style }} {...configs} />;
}
