import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Rectangle = ({
  x,
  y,
  width,
  height,
  onNextClick,
  onReturnClick,
  onCheckboxChange,
  isChecked,
  currentWord
}) => {
  const rectangleStyle = {
    position: "absolute",
    left: x,
    top: y - height - 50,
    width: 200,
    height: 100,
    backgroundColor: "yellow",
    padding: 20,
    display: "flex",
    flexDirection: "column"
  };

  const [showDescription, setShowDescription] = useState(false);

  //the description button
  const CircleButton = styled.button`
    width: 25px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid black;
    background-color: transparent;
    color: black;
    font-size: 15px;
    font-weight: bold;
  `;

  /* A way to disappear the rectangle when the users needs to highlight
  where the info is
  const [isHidden, setIsHidden] = useState(false);

  const handleHideButtonClick = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }
*/

  const handleHelpButtonHover = () => {
    setShowDescription(true);
  };

  const handleHelpButtonLeave = () => {
    setShowDescription(false);
  };

  return (
    <div className="rectangle-with-buttons" style={rectangleStyle}>
      <div className="line1" style={{ display: "flex", flexWrap: "nowrap" }}>
        <div className="target-name" style={{ margin: "0 10px" }}>
          {currentWord}
        </div>
        <div
          className="help-button"
          onMouseEnter={handleHelpButtonHover}
          onMouseLeave={handleHelpButtonLeave}
        >
          <CircleButton>?</CircleButton>
        </div>

        {showDescription && (
          <div className="description-box">
            <p>This is a brief description about the component.</p>
          </div>
        )}
      </div>

      <style>
        {`.checkbox-container {
                margin-top:20px;
                margin-bottom:20px;

            }`}
      </style>
      <div className="checkbox-container">
        <input
          type="checkbox"
          onChange={onCheckboxChange}
          checked={isChecked}
        />
        <label>Validate or </label>
        <button /*onClick={handleHideButtonClick}*/>Select</button>
      </div>

      <style>
        {`.bottom-buttons-container {
                 display: flex;
                 justify-content: space-between;           
                 margin-top:10px;                
            }`}
      </style>
      <div className="bottom-buttons-container">
        <button onClick={onReturnClick}>Return</button>
        <button onClick={onNextClick}>Next</button>
      </div>
    </div>
  );
};

export default Rectangle;
