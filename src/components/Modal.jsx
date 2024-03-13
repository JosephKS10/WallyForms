import React from 'react'
import './Modal.css'
const Modal = (props) => {

    const handleOkClick = () => {
        props.close(false);
        window.location.reload(); // Reload the page
        props.refresh();
      };

    return (
      <div className="modal">
        <div className="modal-content">
          <div>{props.heading}</div>
          <div>{props.subHeading}</div>
          {props.buttonPresent == "true" && (<button type="button" onClick={handleOkClick}>Ok</button>
)}
        </div>
      </div>
    );
  };

export default Modal
