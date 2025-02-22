const replaceParamsTemplate = ({ template, params }) => {
  const data = Object.entries(params).reduce((acc, [key, value]) => acc.replaceAll(`\${${key}}`, value), template);
  return data;
};

export { replaceParamsTemplate };
