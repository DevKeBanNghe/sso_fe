export default function CTIcon({ icon: Icon, color, style, ...configs }) {
  return <Icon style={{ color, cursor: 'pointer', ...style }} {...configs} />;
}
