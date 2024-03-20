import React from 'react'
import './ThankyouBox.css'
import { Link } from 'react-router-dom'
function ThankyouBox() {
  return (
    <div className='boxContent'>
        <div className='thank-center'>
        <div className='thank-heading'><u>Thank you</u></div>
        <br />
        <div className="thank-content">
            <p className="thank-text">Your information has been stored</p><br />
            <p className="thank-text">We will contact you shortly!</p>
            <br />
            {/* <Link to="/"><button className='btn' style={{width:"70vw"}} type='button'>Go back to home page</button></Link> */}
        </div>
        <br /><br />
        <div className="thank-bottom">
            <p>For any queries, Contact +61 416 168 092</p>
        </div>
        </div>
    </div>
  )
}

export default ThankyouBox
