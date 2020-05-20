import React from 'react';
import Lottie from 'react-lottie';

import logoBlack from '../assets/animations/logoBlack.json';
import logoWhite from '../assets/animations/logoWhite.json';
import useTheme from '../hooks/useTheme';

const LogoAnimation: React.FC = ({ children }) => {
  const { theme } = useTheme();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: theme.title === 'dark' ? logoWhite : logoBlack,
  };

  return (
    <>
      {children}

      <Lottie
        options={defaultOptions}
        width="80%"
        height="80%"
        style={{
          opacity: '0.1',
          padding: '10px',
        }}
      />
    </>
  );
};

export default LogoAnimation;