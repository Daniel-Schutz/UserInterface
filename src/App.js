import React, { useState } from "react";
import Box from "/src/box.js";
import Rectangle from "/src/rectangle.js";

/*const backgroundImages = [
  //here we will use the document images
];*/

const App = () => {
  const [index, setIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const boxes = [
    { x: 50, y: 250, width: 200, height: 100 },
    { x: 50, y: 400, width: 200, height: 100 }
  ];

  /* here we are going to create a function to change the image using the
  coordenates. If coordenate[next box][coordenate y] > coordenate[actual box][coordenate y]
  we change the image

  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  const changeImage = () => {
    const nextImage =
      backgroundImages[//use the function here];
    setBackgroundImage(nextImage);
  };*/

  const currentBox = boxes[index];
  const x = currentBox.x;
  const y = currentBox.y;
  const width = currentBox.width;
  const height = currentBox.height;

  const handleNextClick = () => {
    if (isChecked && index < boxes.length - 1) {
      setIndex(index + 1);
      setIsChecked(false);
    }
  };

  const handleReturnClick = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div /*className="app" style={{ backgroundImage: `url(${backgroundImage})` }}*/
    >
      <Box x={x} y={y} width={width} height={height} />
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        onNextClick={handleNextClick}
        onReturnClick={handleReturnClick}
        onCheckboxChange={handleCheckboxChange}
        isChecked={isChecked}
      />
    </div>
  );
};

export default App;
