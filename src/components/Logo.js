import React from 'react';
import useSettings from '../hooks/useSettings';
const Logo = props => {
  const { settings } = useSettings();
  return <h2>STAKERS</h2>;
};

export default Logo;
