import React, { useState, useEffect } from "react";
/*import saveAs is is needed to generate the output JSON.  
To use it, you need to download the "file-saver" dependency*/
import { saveAs } from "file-saver";
import json from "/public/pg1_mock_data.json";

/*this part is to get the images. 
Later we will get the images by reading a JSON*/
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
  const [data, setData] = useState([]);

  /*this part is to get the images as well. 
Later we will get the images by reading a JSON*/
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

  //We will get the target names by reading a JSON too
  const targetNames = json.extraction.map((item) => item.target_name);
  const extractionTexts = json.extraction.map((item) => item.text);
  const extractionExcerpts = json.extraction.map((item) => item.excerpt);

  const [targetIndex, setTargetIndex] = useState(0);

  const handleNextTarget = () => {
    if (targetIndex < targetNames.length - 1) {
      setTargetIndex(targetIndex + 1);
    }
  };

  //This is the number of the page
  const [imageIndex, setimageIndex] = useState(0);

  const handlePrev = () => {
    setimageIndex(imageIndex - 1);
  };

  const handleNext = () => {
    setimageIndex(imageIndex + 1);
  };

  //text area that appears after finishing the selection
  const [showTextArea, setShowTextArea] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (showTextArea) {
      document.getElementById("textarea").focus();
    }
  }, [showTextArea]);

  const handleConfirmTextAreaClick = () => {
    if (targetIndex < targetNames.length - 1) {
      if (text !== "") {
        const newData = {
          Target_name: `${targetNames[targetIndex]}`,
          WriteText: `${text}`
        };
        setData([...data, newData]);
        console.log(
          `Target_name: ${targetNames[targetIndex]}\n Write Text: ${text}`
        );
        setText("");
      }
    } else if (targetIndex === targetNames.length - 1) {
      if (text !== "") {
        const newData = {
          Target_name: `${targetNames[targetIndex]}`,
          WriteText: `${text}`
        };
        setData([...data, newData]);
        console.log(
          `Target_name: ${targetNames[targetIndex]}\n Write Text: ${text}`
        );
        setText("");
      }
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "dados.json");
      //window.close()
    }

    setShowTextArea(false);
  };

  //to read the mock data
  const blocks = json.blocks;

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
    //newData and Data are the output information
    const newData = {
      Target_name: `${targetNames[targetIndex]}`,
      Text: `${filtered.join(" ")}`,
      Excercpt: `${excerpt}`
    };
    setData([...data, newData]);

    console.log(
      `Target_name: ${targetNames[targetIndex]}\n Text: ${filtered.join(
        " "
      )}\n\n Excercpt: ${excerpt}`
    );
  };

  //handleSelect, handleMouseDown, handleMouseUp and handleConfirm
  //are to create the highlighted area
  const [isVisible, setIsVisible] = useState(true);
  const [isValidationVisible, setIsValidationVisible] = useState(true);

  const [showSelect, setShowSelect] = useState(false);
  const handleSelect = () => {
    setShowRect(false);
    setShowConfirm(false);
    setRect({ x: 0, y: 0, width: 0, height: 0 });
    setShowRect(true);
  };
  const handleStart = () => {
    setShowSelect(true);
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

  //codigo quadrado
  const [boxIndex, setBoxIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  //here is the part that is wrong
  useEffect(() => {
    let boxess = [];
    extractionExcerpts.forEach((excerpt) => {
      if (excerpt.length === 1) {
        let start = excerpt[0];
        blocks.forEach((block) => {
          if (block.Id === start) {
            const newBox = {
              x: `${block.start[0] * 600 - 3}`,
              y: `${block.start[1] * 800 - 3}`,
              width: `${block.end[0] * 600 - block.start[0] * 600 + 8}`,
              height: `${block.end[1] * 800 - block.start[1] * 800 + 8}`
            };
            boxess.push(newBox);
            return;
          }
        });
      } else if (excerpt.length !== 1) {
        let start = excerpt[0];
        let end = excerpt[excerpt.length - 1];
        let temporaryX;
        let temporaryY;
        let temporaryWidth;
        let temporaryHeight;
        blocks.forEach((block) => {
          if (block.Id === start) {
            temporaryX = `${block.start[0] * 600 - 3}`;
            temporaryY = `${block.start[1] * 800 - 3}`;
          } else if (block.Id === end) {
            temporaryWidth = `${block.end[0] * 600 - temporaryX + 10}`;
            temporaryHeight = `${
              block.end[1] * 800 - block.start[1] * 800 + 15
            }`;
          }
        });
        const newBox = {
          x: `${temporaryX}`,
          y: `${temporaryY}`,
          width: `${temporaryWidth}`,
          height: `${temporaryHeight}`
        };
        boxess.push(newBox);

        return;
      }
    });
    console.log(boxess);
  }, []);

  //this is the boxes that I'm using while the other is not working
  const boxes = [
    {
      x: 84.14322745800018,
      y: 140.11190843582153,
      width: 207.5997267961502,
      height: 22.618963718414307
    },
    { x: 65, y: 160, width: 110, height: 22 },
    { x: 335, y: 160, width: 50, height: 22 },
    { x: 120, y: 470, width: 110, height: 22 },
    { x: 10, y: 250, width: 200, height: 22 },
    { x: 160.75, y: 552.36, width: 23.79, height: 22 }
  ];

  const currentBox = boxes[boxIndex];
  const x = currentBox.x;
  const y = currentBox.y;

  const handleNextClick = () => {
    if (isChecked && targetIndex < targetNames.length - 1) {
      setBoxIndex(boxIndex + 1);
      setTargetIndex(targetIndex + 1);
      setIsChecked(false);
      console.log(
        `Target_name: ${targetNames[targetIndex]}\n Text: ${extractionTexts[targetIndex]}\n\n  
        Excercpt: ${extractionExcerpts[targetIndex]}`
      );
      const newData = {
        Target_name: `${targetNames[targetIndex]}`,
        Text: `${extractionTexts[targetIndex]}`,
        Excercpt: `${extractionExcerpts[targetIndex]}`
      };
      setData([...data, newData]);
    } else if (isChecked && targetIndex === targetNames.length - 1) {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "dados.json");
      //window.close()
    }
  };

  const handleReturnClick = () => {
    if (boxIndex > 0) {
      setBoxIndex(boxIndex - 1);
      setTargetIndex(targetIndex - 1);
      data.pop();
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  //code of the quadrado
  const rectangleStyle = {
    position: "absolute",
    left: boxes[boxIndex].x,
    top: boxes[boxIndex].y - 150,
    width: 200,
    height: 100,
    backgroundColor: "yellow",
    padding: 20,
    display: "flex",
    flexDirection: "column"
  };

  const [showDescription, setShowDescription] = useState(false);

  //the description button

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

  //code of the outline box

  const boxStyle = {
    position: "absolute",
    left: x,
    top: y,
    width: boxes[boxIndex].width,
    height: boxes[boxIndex].height,
    border: "2px solid yellow"
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
      {isVisible && (
        <div>
          <div style={boxStyle} />
          <div className="rectangle-with-buttons" style={rectangleStyle}>
            <div
              className="line1"
              style={{ display: "flex", flexWrap: "nowrap" }}
            >
              <div className="target-name" style={{ margin: "0 10px" }}>
                {targetNames[targetIndex]}
              </div>
              <div
                className="help-button"
                onMouseEnter={handleHelpButtonHover}
                onMouseLeave={handleHelpButtonLeave}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid black",
                    borderRadius: "50%",
                    color: "black",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  ?
                </button>
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
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
              <label>Validate or </label>
              <button
                onClick={() => {
                  handleStart(true);
                  setShowConfirm(false);
                  setIsVisible(false);
                  setIsValidationVisible(true);
                }}
              >
                Select
              </button>
            </div>

            <style>
              {`.bottom-buttons-container {
                 display: flex;
                 justify-content: space-between;           
                 margin-top:10px;                
            }`}
            </style>
            <div className="bottom-buttons-container">
              <button onClick={handleReturnClick}>Return</button>
              <button onClick={handleNextClick}>Next</button>
            </div>
          </div>
        </div>
      )}

      {showSelect && isValidationVisible && (
        <div>
          <button onClick={handleSelect}>Select</button>
          <button
            style={{ margin: "2px" }}
            onClick={() => {
              setShowConfirm(false);
              setShowTextArea(true);
            }}
          >
            Finish target selection
          </button>
          {showTextArea && (
            <div
              onClick={() => {
                setShowConfirm(false);
              }}
            >
              <textarea
                id="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type in the exact values if you want"
              />
              <button
                onClick={() => {
                  handleConfirmTextAreaClick(true);
                  handleNextTarget(true);
                  setIsVisible(true);
                  setIsValidationVisible(false);
                }}
              >
                Confirm
              </button>
            </div>
          )}
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
      )}
    </div>
  );
}

export default App;
