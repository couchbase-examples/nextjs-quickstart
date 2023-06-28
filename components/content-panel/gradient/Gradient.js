import React, { useRef, useEffect } from 'react';

const Gradient = ({ firstName, lastName }) => {
  const parentRef = useRef(null);

  useEffect(() => {
    const parentElement = parentRef.current;
    const colors = generateGradientColors(firstName, lastName);

    const gradient = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`;
    parentElement.style.background = gradient;

    return () => {
      // Clean up the gradient when the component is unmounted
      parentElement.style.background = '';
    };
  }, [firstName, lastName]);

  const generateGradientColors = (firstName, lastName) => {
    // Convert the name strings to numerical values
    const firstNameValue = stringToValue(firstName);
    const lastNameValue = stringToValue(lastName);

    // Use the name values to generate the RGB values for the colors
    const color1 = generateColor(firstNameValue, 0.9);
    const color2 = generateColor(lastNameValue, 0.8);

    return [color1, color2];
  };

  const stringToValue = (str) => {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
      value += str.charCodeAt(i);
    }
    return value;
  };

  const generateColor = (value, alpha) => {
    // Generate random HSL values based on the provided value
    const hue = (value % 360) || 0;
    const saturation = 80 + (value % 21); // 80-100
    const lightness = 50 + (value % 11); // 50-60

    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  return <div ref={parentRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default Gradient;
