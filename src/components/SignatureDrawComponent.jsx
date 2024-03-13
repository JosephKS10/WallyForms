import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import "./SignatureDrawComponent.css";
const Canvas = (props) => {
  const canvasRef = useRef(null);

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const exportImage = () => {
    if (canvasRef.current) {
      canvasRef.current.exportImage("png")
        .then(data => {

          props.onExport(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={4}
        strokeColor="black"
        onChange={exportImage}
      />
      <button onClick={handleClearCanvas} className='clearButton'  type="button">
        Clear Signature
      </button>
    </div>
  );
};

export default Canvas;
