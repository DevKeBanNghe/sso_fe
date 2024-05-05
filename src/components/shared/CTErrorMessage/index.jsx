import { forwardRef } from 'react';

const CTErrorMessage = (WrappedComponent) => {
  return forwardRef(function wrappedComponent({ errorMessage, formStateErrors, ...props }, ref) {
    if (formStateErrors) errorMessage = errorMessage ?? formStateErrors[props.name]?.message;
    return (
      <>
        <WrappedComponent ref={ref} status={errorMessage ? 'error' : ''} {...props} />
        {errorMessage ? <span style={{ color: 'red' }}>{errorMessage}</span> : <></>}
      </>
    );
  });
};

export default CTErrorMessage;
