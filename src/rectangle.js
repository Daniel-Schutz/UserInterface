import React, { useState } from "react";

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
  const [showEditArea, setShowEditArea] = useState(false);
  const [text, setText] = useState("");

  const handleEditButtonClick = () => {
    setShowEditArea(true);
  };

  const handleConfirmButtonClick = () => {
    setShowEditArea(false);
  };

  const [showDescription, setShowDescription] = useState(false);

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
        <button onClick={handleEditButtonClick}>Edit</button>
      </div>
      {showEditArea && (
        <div className="edit-area">
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
          <div className="bottom-buttons-container">
            <button onClick={handleConfirmButtonClick}>Confirm</button>
          </div>
        </div>
      )}
      <div className="bottom-buttons-container">
        <button onClick={onReturnClick}>Return</button>
        <button onClick={onNextClick}>Next</button>
      </div>
    </div>
  );
};

export default Rectangle;
