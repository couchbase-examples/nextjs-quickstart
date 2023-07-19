import React, { useRef, useEffect } from 'react';

const Gradient = ({ firstName, lastName }) => {
  const parentRef = useRef(null);

  const stringToValue = (str) => {
    let value = 0;
    for (let i = 0; i < str?.length; i++) {
      value += str.charCodeAt(i);
    }
    return value;
  };

  const generateColor = (value, alpha) => {
    // Generate random HSL values based on the provided value
    const hue = (value % 60) * 6; // Hues from 0 to 360 in steps of 6 (avoiding dark/brown shades)
    const saturation = 50 + (value % 31); // 50-80 for pastel colors
    const lightness = 70 + (value % 11); // 70-80 for brighter colors

    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  useEffect(() => {
    const generateGradientColors = (firstName, lastName) => {
      // Convert the name strings to numerical values
      const firstNameValue = stringToValue(firstName);
      const lastNameValue = stringToValue(lastName);

      // Use the name values to generate the RGB values for the colors
      const color1 = generateColor(firstNameValue, 0.9);
      const color2 = generateColor(lastNameValue, 0.8);

      return [color1, color2];
    };


    const parentElement = parentRef.current;
    const colors = generateGradientColors(firstName, lastName);

    const gradient = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`;
    parentElement.style.background = gradient;

    return () => {
      // Clean up the gradient when the component is unmounted
      parentElement.style.background = '';
    };
  }, [firstName, lastName]);

  return <div ref={parentRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default Gradient;
