const mappingValueReducer = ({ state, payload = {} }) => {
  for (const field of Object.keys(payload)) {
    state[field] = payload[field];
  }
  return state;
};

export { mappingValueReducer };
