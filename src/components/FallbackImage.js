import React, { useState } from 'react';
import { Image } from 'react-native';

const fallbackIcon = require('../../assets/icon.png');

const FallbackImage = ({ source, style, ...props }) => {
  const [failed, setFailed] = useState(false);
  const imageSource = failed ? fallbackIcon : source;

  return (
    <Image
      source={imageSource}
      style={style}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default FallbackImage;
