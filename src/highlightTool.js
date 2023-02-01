import React, { useState } from "react";

function App() {
const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
const [showRect, setShowRect] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [isMouseOverConfirmButton, setIsMouseOverConfirmButton] = useState(false);

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
console.log("Rectangle coordinates:", rect);
setShowRect(false);
setShowConfirm(false);
};

return (
<div
onMouseDown={handleMouseDown}
onMouseUp={handleMouseUp}
style={{ position: "relative", height: "100vh" }}
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
border: "2px solid yellow",
opacity: 0.5
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
