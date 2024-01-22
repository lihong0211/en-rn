/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

function AnimatedImage(props: {source: any}) {
  const {source} = props;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    Animated.loop(animation).start();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      style={{
        width: 18,
        height: 18,
        transform: [{rotate: rotate}],
      }}
      source={source}
    />
  );
}
export default AnimatedImage;
