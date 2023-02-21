import React, { useState, useEffect } from "react";
import image from "./Slip1.jpg";

function App() {
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showRect, setShowRect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMouseOverConfirmButton, setIsMouseOverConfirmButton] = useState(
    false
  );
  const [blocks, setBlocks] = useState([]);
  const [filteredText, setFilteredText] = useState([]);

  useEffect(() => {
    fetch("./pg1_mock_data.json")
      .then((res) => res.json())
      .then((json) => {
        setBlocks(json.blocks);
      });
  }, []);

  const filterText = (firstCoordinatePair, secondCoordinatePair) => {
    let filtered = [];
    let excerpt = [];
    blocks.forEach((block) => {
      let start = block.start;
      let end = block.end;
      if (
        start[0] >= firstCoordinatePair[0] &&
        start[1] >= firstCoordinatePair[1] &&
        end[0] <= secondCoordinatePair[0] &&
        end[1] <= secondCoordinatePair[1]
      ) {
        filtered.push(block.text);
        excerpt.push(block.Id);
      }
    });
    setFilteredText(filtered);
    console.log(`Text: ${filtered.join(" ")}\n\n Excercpt: ${excerpt}`);
  };

  const handleSelect = () => {
    setShowRect(false);
    setShowConfirm(false);
    setRect({ x: 0, y: 0, width: 0, height: 0 });
    setShowRect(true);
  };

  const handleMouseDown = (e) => {
    if (!isMouseOverConfirmButton) {
      setRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    }
  };

  const handleMouseUp = (e) => {
    if (!isMouseOverConfirmButton) {
      let width = e.clientX - rect.x;
      let height = e.clientY - rect.y;
      if (width < 0) {
        width = -width;
        setRect({
          x: rect.x - width,
          y: rect.y,
          width,
          height
        });
      } else {
        setRect({
          x: rect.x,
          y: rect.y,
          width,
          height
        });
      }
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    console.log(
      `Rectangle coordinates:\n start:[${(rect.x / 600).toFixed(14)}, ${(
        rect.y / 800
      ).toFixed(14)}]\n end:[${((rect.x + rect.width) / 600).toFixed(14)}, ${(
        (rect.y + rect.height) /
        800
      ).toFixed(14)}]`
    );
    filterText(
      [(rect.x / 600).toFixed(14), (rect.y / 800).toFixed(14)],
      [
        ((rect.x + rect.width) / 600).toFixed(14),
        ((rect.y + rect.height) / 800).toFixed(14)
      ]
    );
    setShowRect(false);
    setShowConfirm(false);
  };

  return (
    <div
      className="image"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        position: "relative",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        width: 600,
        height: 800,
        margin: 0,
        padding: 0
      }}
    >
      <button onClick={handleSelect}>Select</button>
      {showRect && (
        <div
          style={{
            position: "absolute",
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            border: "2px solid #ffb515",
            opacity: 0.5,
            backgroundColor: "yellow"
          }}
        ></div>
      )}
      {showConfirm && (
        <button
          style={{
            position: "absolute",
            left: rect.x + rect.width - 70,
            top: rect.y + rect.height + 10
          }}
          onClick={handleConfirm}
          onMouseEnter={() => setIsMouseOverConfirmButton(true)}
          onMouseLeave={() => setIsMouseOverConfirmButton(false)}
        >
          Confirm
        </button>
      )}
    </div>
  );
}

export default App;
