import React from 'react';
import Login from './Login';

const Signup = () => {
  // This component will render the Login component but start in Sign Up mode
  return <Login initialState="Sign Up" />;
};

export default Signup;