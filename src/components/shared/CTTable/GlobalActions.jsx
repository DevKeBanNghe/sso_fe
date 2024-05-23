import CTButton from '../CTButton';

export default function GlobalActions({ actions = [] }) {
  return (
    <>
      {actions.map(({ content, ...props }, index) => (
        <CTButton key={`global_actions_${index}`} type='primary' {...props}>
          {content}
        </CTButton>
      ))}
    </>
  );
}
