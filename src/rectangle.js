import React, { useState, useEffect } from "react";

const Rectangle = ({
  x,
  y,
  width,
  height,
  onNextClick,
  onReturnClick,
  onCheckboxChange,
  isChecked
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
  //codigo
  const [isHidden, setIsHidden] = useState(false);

  const handleHideButtonClick = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  //codigo

  const handleHelpButtonHover = () => {
    setShowDescription(true);
  };

  const handleHelpButtonLeave = () => {
    setShowDescription(false);
  };

  return (
    <div className="rectangle-with-buttons" style={rectangleStyle}>
      <div className="example-text">Example</div>
      <div
        className="help-button"
        onMouseEnter={handleHelpButtonHover}
        onMouseLeave={handleHelpButtonLeave}
      >
        ?
      </div>
      {showDescription && (
        <div className="description-box">
          <p>This is a brief description about the component.</p>
        </div>
      )}
      <div className="checkbox-container">
        <input
          type="checkbox"
          onChange={onCheckboxChange}
          checked={isChecked}
        />
        <label>Validate or </label>
        <button onClick={handleHideButtonClick}>Select</button>
      </div>

      <div className="bottom-buttons-container">
        <button onClick={onReturnClick}>Return</button>
        <button onClick={onNextClick}>Next</button>
      </div>
    </div>
  );
};

export default Rectangle;
