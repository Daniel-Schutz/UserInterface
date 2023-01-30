import React from "react";

const Box = ({ x, y, width, height }) => {
  const boxStyle = {
    position: "absolute",
    left: x,
    top: y,
    width: 700,
    height: 80,
    border: "2px solid yellow"
  };
  return <div style={boxStyle} />;
};

export default Box;
