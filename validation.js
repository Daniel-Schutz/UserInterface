import React, { useState, useEffect } from "react";
import image1 from "./Images/Slip1.jpg";
import image2 from "./Images/Slip 1-2.jpg";
import image3 from "./Images/Slip 1-3.jpg";
import image4 from "./Images/Slip 1-4.jpg";
import image5 from "./Images/Slip 1-5.jpg";
import image6 from "./Images/Slip 1-6.jpg";
import image7 from "./Images/Slip 1-7.jpg";
import image8 from "./Images/Slip 1-8.jpg";
import image9 from "./Images/Slip 1-9.jpg";
import image10 from "./Images/Slip 1-10.jpg";
import image11 from "./Images/Slip 1-11.jpg";
import image12 from "./Images/Slip 1-12.jpg";

function App() {
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showRect, setShowRect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMouseOverConfirmButton, setIsMouseOverConfirmButton] = useState(
    false
  );
  const [blocks, setBlocks] = useState([]);

  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12
  ];

  const targetNames = ["name1", "name2", "name3"];

  const [targetIndex, setTargetIndex] = useState(0);

  const handleNextTarget = () => {
    if (targetIndex < targetNames.length - 1) {
      setTargetIndex(targetIndex + 1);
    }
  };

  const [imageIndex, setimageIndex] = useState(0);

  const handlePrev = () => {
    setimageIndex(imageIndex - 1);
  };

  const handleNext = () => {
    setimageIndex(imageIndex + 1);
  };

  useEffect(() => {
    console.log(imageIndex + 1);
    fetch(`./mock_datas/pg${imageIndex + 1}_mock_data.json`)
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
    console.log(
      `Target_name: ${targetNames[targetIndex]}\n Text: ${filtered.join(
        " "
      )}\n\n Excercpt: ${excerpt}`
    );
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
        backgroundImage: `url(${images[imageIndex]})`,
        backgroundSize: "cover",
        width: 600,
        height: 800,
        margin: 0,
        padding: 0,
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        MsUserSelect: "none",
        userSelect: "none"
      }}
    >
      <button onClick={handleSelect}>Select</button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "10px"
        }}
      >
        <div> {imageIndex + 1}/12</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0 auto",
            fontSize: "25px",
            width: "300px",
            height: "50px",
            backgroundColor: "white"
          }}
        >
          Target Name: {targetNames[targetIndex]}
        </div>
      </div>

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
          onClick={() => {
            handleConfirm(true);
            setRect({ x: 0, y: 0, width: 0, height: 0 });
            setShowRect(false);
            setShowConfirm(false);
            setIsMouseOverConfirmButton(false);
            handleNextTarget(true);
          }}
          onMouseEnter={() => setIsMouseOverConfirmButton(true)}
          onMouseLeave={() => setIsMouseOverConfirmButton(false)}
        >
          Confirm
        </button>
      )}
      <button
        style={{ position: "absolute", top: "730px", left: "10px" }}
        onClick={() => {
          handlePrev(true);
          setShowConfirm(false);
        }}
        disabled={imageIndex === 0}
      >
        Previous Page
      </button>

      <button
        style={{ position: "absolute", top: "730px", left: "450px" }}
        onClick={() => {
          handleNext(true);
          setShowConfirm(false);
        }}
        disabled={imageIndex === images.length - 1}
      >
        Next Page
      </button>
    </div>
  );
}

export default App;
