import React, { useState, useEffect } from "react";
/*import saveAs is is needed to generate the output JSON.  
To use it, you need to download the "file-saver" dependency*/
import { saveAs } from "file-saver";
import json from "/public/new_mock_data.json";
import "./App.css";

/*this part is to get the images. 
Later we will get the images by reading a JSON*/
import image1 from "./Images/Slip1-1.jpg";
import image2 from "./Images/Slip1-2.jpg";
import image3 from "./Images/Slip1-3.jpg";
import image4 from "./Images/Slip1-4.jpg";
import image5 from "./Images/Slip1-5.jpg";
import image6 from "./Images/Slip1-6.jpg";
import image7 from "./Images/Slip1-7.jpg";
import image8 from "./Images/Slip1-8.jpg";
import image9 from "./Images/Slip1-9.jpg";
import image10 from "./Images/Slip1-10.jpg";
import image11 from "./Images/Slip1-11.jpg";
import image12 from "./Images/Slip1-12.jpg";
import image13 from "./Images/Slip1-13.jpg";
import image14 from "./Images/Slip1-14.jpg";

function App() {
  /*useEffect(() => {
    axios
      .get("./new_mock_data.json")
      .then(function (response) {
        // handle success
        const extraction = response.data.extraction;
        const targetNames = extraction.map((item) => item.target_name);
        console.log(targetNames);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);*/
  const imagesList = [];
  const fs = require("fs");
  const path = require("path");

  const directory = "src/Images"; // substitua pelo caminho da sua directory

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const completePath = path.join(directory, file);
      const extension = path.extname(file).toLowerCase();
      if (
        extension === ".jpg" ||
        extension === ".jpeg" ||
        extension === ".png" ||
        extension === ".gif"
      ) {
        imagesList.push(completePath); // adiciona o caminho completo à lista global
      }
    });
  });
  //console.log(imagesList);

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
    image12,
    image13,
    image14
  ];

  //We will get the target names by reading a JSON too
  const targetNames = json.extraction.map((item) => item.target_name);
  const extractionTexts = json.extraction.map((item) => item.text);
  const extractionExcerpts = json.extraction.map((item) => item.excerpt);
  const targetPageNum = json.extraction.map((item) => item.page_num);

  const [targetIndex, setTargetIndex] = useState(0);

  const handleNextTarget = () => {
    if (targetIndex < targetNames.length - 1) {
      setTargetIndex(targetIndex + 1);
      setimageIndex(targetPageNum[targetIndex] - 1);
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
    blocks[imageIndex].forEach((block) => {
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

  const handleMouseDown = (e) => {
    if (!isMouseOverConfirmButton) {
      setRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
      setShowRect(false);
    }
  };

  const handleMouseUp = (e) => {
    setShowRect(true);
    if (!isMouseOverConfirmButton) {
      let width = e.clientX - rect.x;
      let height = e.clientY - rect.y;
      if (width <= 0) {
        setRect(false);
        setShowRect(false);
        setShowConfirm(false);
      } else {
        setRect({
          x: rect.x,
          y: rect.y,
          width,
          height
        });
        setShowConfirm(true);
      }
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

  const boxess = [];
  //as vezes quando atualiza some as informações desse array debaixo

  useEffect(() => {
    for (let i = 0; i < extractionExcerpts.length; i++) {
      //if is onçy one word on this target extraction
      if (extractionExcerpts[i].length === 1) {
        //console.log(extractionExcerpts[i][0]);
        let current = extractionExcerpts[i][0];

        blocks[targetPageNum[i] - 1].forEach((block) => {
          if (current === block.Id) {
            let newBox = [
              {
                Id: current,
                x: block.start[0] * 600,
                y: block.start[1] * 800 - 5,
                width: (block.end[0] - block.start[0]) * 600 + 20,
                height: (block.end[1] - block.start[1]) * 800 + 20
              }
            ];
            boxess.push(newBox);
          }
        });
      } else {
        //if is more than 1 word
        let sameLine = true;
        let current = extractionExcerpts[i];
        let firstX;
        let firstY;
        let lastX;
        let lastY;

        for (let y = 0; y < blocks[targetPageNum[i] - 1].length; y++) {
          //if the first id of the exercpt === block.Id
          if (current[0] === blocks[targetPageNum[i] - 1][y].Id) {
            //saving the coordenates of the first word
            firstX = blocks[targetPageNum[i] - 1][y].start[0] * 600 - 10;
            //console.log(firstX);
            firstY = blocks[targetPageNum[i] - 1][y].start[1] * 800 - 10;

            for (let x = 0; x < current.length - 1; x++) {
              //startX is the x coordenate of a word
              let startX = blocks[targetPageNum[i] - 1][y + x].start[0];
              //nextX is the x coordenate of the next word
              let nextX = blocks[targetPageNum[i] - 1][y + x + 1].start[0];

              //to save the final coordenates of the last word
              if (x === current.length - 2) {
                lastX =
                  blocks[targetPageNum[i] - 1][y + x + 1].end[0] * 600 + 20;

                lastY =
                  blocks[targetPageNum[i] - 1][y + x + 1].end[1] * 800 + 20;
              }

              if (nextX < startX) {
                sameLine = false;
                //function to create another box and return that this happens
              }
            }
          }
        }
        if (sameLine === true /*if it's just one box*/) {
          let newBox = [
            {
              //arrumar o width/height
              Id: current,
              x: firstX,
              y: firstY,
              width: lastX - firstX,
              height: lastY - firstY
            }
          ];
          boxess.push(newBox);
        }
      }
    }
    console.log(boxess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //this is the boxes that I'm using while the other is not working
  const boxes = [
    {
      x: 77.14322745800018,
      y: 133.11190843582153,
      width: 207.5997267961502,
      height: 40.618963718414307
    },
    { x: 60, y: 160, width: 127, height: 38 },
    { x: 330, y: 165, width: 58, height: 29 },
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
      setimageIndex(targetPageNum[targetIndex] - 1);
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
      setimageIndex(targetPageNum[targetIndex] - 1);
      while (
        data[data.length - 1].Target_name === targetNames[targetIndex - 1]
      ) {
        data.pop();
      }
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
    flexDirection: "column",
    borderRadius: "8%"
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
              <div
                className="target-name"
                style={{ margin: "0 10px", fontSize: "25px" }}
              >
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
                    fontSize: "18px",
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
                margin-bottom:10px;

            }`}
            </style>
            <div
              className="checkbox-container"
              style={{ margin: "10px 0px", fontSize: "18px" }}
            >
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
              <label>Validate or </label>
              <button
                className="select"
                onClick={() => {
                  setShowSelect(true);
                  setShowConfirm(false);
                  setIsVisible(false);
                  setIsValidationVisible(true);
                  handleSelect();
                }}
              >
                Select
              </button>
            </div>

            <style>
              {`.bottom-buttons-container {
                 display: flex;
                 justify-content: space-between;                         
            }`}
            </style>
            <div className="bottom-buttons-container">
              <button className="btn first" onClick={handleReturnClick}>
                Return
              </button>
              <button className="btn first" onClick={handleNextClick}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showSelect && isValidationVisible && (
        <div>
          <div>
            {imageIndex + 1}/{images.length}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <p
              style={{
                position: "absolute",
                top: " 0",
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "25px",
                width: "auto",
                height: "50px",
                backgroundColor: "white"
              }}
            >
              Target Name: {targetNames[targetIndex]}
            </p>
            <button
              className="finish-selection"
              onMouseDown={() => {
                setShowTextArea(true);
                handleSelect(false);
              }}
            >
              Finish target selection
            </button>
          </div>

          {showTextArea && (
            <div
              style={{
                top: " 0",
                left: "0",
                marginTop: "50px",
                fontSize: "25px",
                width: "300px",
                height: "50px",
                backgroundColor: "white"
              }}
            >
              <textarea
                style={{ height: "50px" }}
                id="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type in the exact values if you want or just confirm"
              />
              <button
                className="textarea-confirm"
                onMouseDown={() => {
                  handleConfirmTextAreaClick(true);
                  handleNextTarget(true);
                  setIsVisible(true);
                  setIsValidationVisible(false);
                  setBoxIndex(boxIndex + 1);
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
          ></div>

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
              className="textarea-confirm"
              style={{
                position: "absolute",
                left: rect.x + rect.width - 70,
                top: rect.y + rect.height + 10
              }}
              onClick={() => {
                handleConfirm(true);
                setRect({ x: 0, y: 0, width: 0, height: 0 });
                setShowRect(false);
                setIsMouseOverConfirmButton(false);
                handleSelect(true);
              }}
              onMouseEnter={() => setIsMouseOverConfirmButton(true)}
              onMouseLeave={() => setIsMouseOverConfirmButton(false)}
            >
              Confirm
            </button>
          )}
          <button
            className="btn first"
            style={{
              position: "absolute",
              top: "730px",
              left: "10px",
              backgroundColor: "white"
            }}
            onClick={() => {
              handlePrev(true);
            }}
            disabled={imageIndex === 0}
          >
            Previous Page
          </button>

          <button
            className="btn first"
            style={{
              position: "absolute",
              top: "730px",
              left: "450px",
              backgroundColor: "white"
            }}
            onClick={() => {
              handleNext(true);
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



