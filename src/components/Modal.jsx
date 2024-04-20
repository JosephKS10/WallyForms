import React from 'react'
import './Modal.css'
const Modal = (props) => {

    const handleOkClick = () => {
        props.close(false);
        props.pdfbutton(true);
        props.refresh();
        props.submitDisable(false);
      };

    return (
      <div className="modal">
        <div className="modal-content">
          <div>{props.heading}</div>
          <div>{props.subHeading}</div><br />
          <div>{props.subHeading1}</div><br />

          {props.buttonPresent == "true" && (<button type="button" onClick={handleOkClick}>Ok</button>
)}
        </div>
      </div>
    );
  };

export default Modal
