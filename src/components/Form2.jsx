import React, {useState, useRef} from 'react'
import "./Form2.css"
import Canvas from './SignatureDrawComponent';
import { useNavigate } from 'react-router-dom'; 
import companyLogo from '../assets/images/logo.svg'
import sign from "/sign.svg"
import Modal from './Modal';
import Header from './Header';
import emailjs from 'emailjs-com';


function Form2() {
  const navigate = useNavigate(); 
  const pdfRef = useRef();
  const PUBLIC_KEY = 'KXRncuNTnshAREN68';
  
  

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  if (!isMobile()){
    return(
      <div className="error-message">
      <h1>Error: Access from desktop not allowed</h1>
      <p>Please access this website from a mobile device.</p>
    </div>
    )
  }




  const currentDate = new Date().toISOString().split('T')[0]; 
  
  const [form2Data, setForm2Data] = React.useState({
    fullName: '',
    ABN: '',
    date: currentDate,
    address: '',
    authorisedOfficerName: 'Wally Bayat',
    contractorSignature: '',
    contractorName: '',
    commencementDate: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm2Data({ ...form2Data, [name]: value })
  }

  const [form2Errors, setForm2Errors] = useState({});

  const validateForm2 = () => {
    const errors = {};

    if (!form2Data.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!form2Data.ABN.trim()) {
      errors.ABN = 'ABN is required';
    }

    if (!form2Data.date.trim()) {
      errors.date = 'Date is required';
    }

    if (!form2Data.address.trim()) {
      errors.address = 'Address is required';
    }


    if (!form2Data.authorisedOfficerName.trim()) {
      errors.authorisedOfficerName = 'Authorised officer name is required';
    }

    if (!form2Data.contractorSignature.trim()) {
      errors.contractorSignature = 'Contractor signature is required';
    }

    if (!form2Data.contractorName.trim()) {
      errors.contractorName = 'Contractor name is required';
    }

    if (!form2Data.commencementDate.trim()) {
      errors.commencementDate = 'Commencement date is required';
    }

    setForm2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const scriptUrl = "https://script.google.com/macros/s/AKfycbyzaUu3sIEIUJNdl7IibOVhQCvgq5GlEG1JQktV4hXu8K5cy4FlaCr8w2aMqdawDrVc/exec"

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(true);

  const formattedMessage = `
  Site Information:
  - Full Name: ${form2Data.fullName}
  - ABN: ${form2Data.ABN}
  - Date: ${form2Data.date}
  - Address: ${form2Data.address}
  - Authorized Officer Name: ${form2Data.authorisedOfficerName}
  - Contractor Name: ${form2Data.contractorName}
  - Commencement Date: ${form2Data.commencementDate}
`;

  const handleSubmitForm2 = (e) => {
    e.preventDefault();
    console.log("submitting form 2")
    if (validateForm2()) {
      setIsSubmitting(true); 
      const formData = { ...form2Data }; 
  
      const formDataToSubmit = new FormData();
  
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }
  
      fetch(scriptUrl, {
        method: 'POST',
        body: formDataToSubmit
      })
      .then(response => {
        setIsSubmitting(false); 
        if (response.ok) {
          emailjs.send("service_nllln5l", "template_hf524b4", {
            from_name: "Wally Cleaning",
            to_name: "Admin",
            message: formattedMessage, 
        }, PUBLIC_KEY).then((response) => {
            console.log("Email sent successfully:", response);
        }).catch((error) => {
            console.error("Error sending email:", error);
        });
          setSubmittedSuccessfully(true);
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      
      const firstErrorKey = Object.keys(form2Errors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const handleExportedImage = (data, canvasType) => {
    if (canvasType === 'contractor') {
      setForm2Data(prevState => ({
        ...prevState,
        contractorSignature: data
      }));
    }
  };

  const [fileInputsSubmission, setFileInputsSubmission] = useState(false)

  const [fileInputs, setFileInputs] = useState({
    contract: "null",
  });

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    
    // Read the file data
    const reader = new FileReader();
    reader.onload = () => {
        // Encode the file data in base64
        const base64Data = reader.result.split(',')[1]; // Extracting base64 data from Data URL
        setFileInputs({ ...fileInputs, [name]: base64Data });
    };
    reader.readAsDataURL(file);
};

const validateFile2 = () => {
  const errors = {};

  if (fileInputs.contract.trim() === "null") {
    errors.contract = 'Contract PDF is required';
  }

  setForm2Errors(errors);
  return Object.keys(errors).length === 0;
};

  console.log(fileInputs)
  const handleSubmitContractFile = (e) => {
    e.preventDefault();
    if(validateFile2()){
      setIsSubmitting(true); 
      setFileInputsSubmission(true)
      console.log("Uploading Files")
      const scriptUrl2 = "https://script.google.com/macros/s/AKfycbwj9QDRhAmRfI8a024DXYkATA1hFFztp8C39oyUpsU37rQsz_ELHyZkpoDKPBEQ_qY2/exec"
      const formData = new FormData();
  
  
      formData.append("fullName", form2Data.fullName);
      formData.append("contract", fileInputs.contract);
  
  
      fetch(scriptUrl2, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          setIsSubmitting(false); 
         setSubmittedSuccessfully(true);
         console.log(response)
        })
        .catch((error) => {
          // Handle errors
          setIsSubmitting(false); 
          console.error("Error during file upload:", error);
        });
    }
  }

  return (
    <React.Fragment>
      <Header heading="Independent Contract Agreement" companyLogoVisibility={true}/>
      <form onSubmit={handleSubmitForm2}>
      <div className="boxContent" ref={pdfRef}>
      <div className="subHeading"><h3>Wally Cleaning Company <br />(ACN 148 856 580)</h3></div>
      <div className="subHeading"><h3>and</h3></div>
      <div className="lineContainer">
          <div className="QuestionLine">Full Name</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="fullName"
              value={form2Data.fullName}
              onChange={handleInputChange}
              className='inputLine'
            />
          </div>
          <div>
        {form2Errors.fullName && <div className="error-message">{form2Errors.fullName}</div>}
        </div>
        </div>
        </div>

        <div className="lineContainer">
          <div className="QuestionLine">ABN</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="ABN"
              value={form2Data.ABN}
              onChange={handleInputChange}
              className='inputLine'
            />
          </div>
          <div>
        {form2Errors.ABN && <div className="error-message">{form2Errors.ABN}</div>}
        </div>
        </div>
        </div>
        <div className="lineContainer">
          <div className="QuestionLine small">This agreement is made on</div>
          <div className="answerLine">
            <input
              type="date"
              name="ABN"
              value={form2Data.date}
              onChange={handleInputChange}
              disabled
              className='dateLine'
            />
          </div>
        </div>
        <div>
          <div className="small">BETWEEN</div>
          <div className="line">
            <div className='small'>1 </div>
            <div className="small right">Wally Cleaning Company (ACN 148 856 580) of 45 Atkinson Street, Chadstone VIC 3148 (“Principal”); and</div>
          </div>
          <div className="line">
            <div className='small'>2 </div>
            <div className="partyDetail">
            <div className="lineContainer partyDetailContainer">
                <div className="partyDetailQuestion">Full Name</div>
                <div className="partyDetailAnswer">
                  <input
                    type="text"
                    name="fullName"
                    value={form2Data.fullName}
                    onChange={handleInputChange}
                    className='partyDetailInputLine'
                  />
                </div>
             </div>  
             <div className="lineContainer partyDetailContainer">
                <div className="partyDetailQuestion">ABN</div>
                <div className="partyDetailAnswer">
                  <input
                    type="text"
                    name="ABN"
                    value={form2Data.ABN}
                    onChange={handleInputChange}
                    className='partyDetailInputLine'
                  />
                </div>
             </div>      
            </div>

            </div>
           <div className="small center"> (“<b>Contractor</b>”), collectively the (“<b>Parties</b>”).</div>
        </div>
<br /><br />
        <div className="recitals">
          <div className="recitalsHeading">RECITALS</div>
      <div className="recitals-content">
        <p>(A) The Principal is in the Business of providing commercial cleaning services.</p>
        <p>(B) The Principal wishes to engage a contractor to provide these services, in particular the services as described in Item 3 of Schedule 1 (“The Services”).</p>
        <p>(C) The Contractor is engaged in the business of providing services including in the nature of the Services.</p>
        <p>(D) The Contractor has the required skills and knowledge and is available to the Principal for the purpose of providing the Services.</p>
      </div>
    </div>

<br />
    <div>
      <div className="agreement-heading">THE PARTIES AGREE AS FOLLOWS: <br /><br />DEFINITIONS</div>
      <div className="definitions">
        <p>In this Agreement, unless expressed to the contrary:</p>
        <p><b>‘Agreement’</b> means this Agreement, including its schedules.</p>
        <p><b>“Approved Person”</b> means a person or persons, other than the Contractor, approved by the Principal to provide the Services on behalf of the Contractor.</p>
        <p><b>‘Business’</b> means the Principal’s business described in recital (A).</p>
        <p><b>‘Client’</b> means a person or persons, partnership, corporation or entity that has engaged the Principal to provide services in the nature described at paragraph 1.3.</p>
        <p><b>‘Commencement Date’</b> means the commencement date of this Agreement specified in Item 1 of Schedule 1.</p>
        <p><b>‘Confidential Information’</b> includes, without limitation, all information regarding the Business, trade secrets and commercially sensitive information of the Principal, including:</p>
        <ul style={{listStyle: "none"}}>
          <li><b>(a)</b> &nbsp;&nbsp;client details, lists, internal memoranda, proposals or agreements and information relating to client practices, business dealings, trade secrets and affairs;</li>
          <li><b>(b)</b> &nbsp;&nbsp;commercial and business plans, pricing and financial information, data and strategies;</li>
          <li><b>(c)</b> &nbsp;&nbsp;operational information, systems, processes, designs, methods, electronic and documented databases, computer programs, hardware and software and multi-media;</li>
          <li><b>(d)</b> &nbsp;&nbsp;techniques and methods created by the Principal;</li>
          <li><b>(e)</b> &nbsp;&nbsp;information relating to personnel and polices;</li>
          <li><b>(f)</b> &nbsp;&nbsp;any information or document which has been provided and/or made available to the Contractor or which has come to the Contractor’s attention during its engagement with the Principal which, from its nature and content, is or would reasonably be expected to be confidential.</li>
        </ul>
        <p><b>‘Contractor’</b> means...</p>
        <div className="line">
            <div className='small'> </div>
            <div className="partyDetail">
            <div className="lineContainer partyDetailContainer">
                <div className="partyDetailQuestion">Full Name:</div>
                <div className="partyDetailAnswer">
                  <input
                    type="text"
                    name="fullName"
                    value={form2Data.fullName}
                    onChange={handleInputChange}
                    className='partyDetailInputLine'
                  />
                </div>
             </div>  
             <div className="lineContainer partyDetailContainer">
                <div className="partyDetailQuestion">Address:</div>
                <div>
                <div className="partyDetailAnswer">
                  <textarea
                    type="text"
                    name="address"
                    value={form2Data.address}
                    onChange={handleInputChange}
                    className='partyDetailInputLine'
                    rows={5}
                    cols={50}
                  />
                </div>
                <div>
        {form2Errors.address && <div className="error-message">{form2Errors.address}</div>}
        </div>
        </div>
             </div>      
            </div>

            </div>

            <p><b>‘Materials’</b> means the necessary materials required to complete the Services including, but not
limited to, vehicles, tools, equipment, cleaning products, machinery and the like. </p>
        <p><b>‘Principal’</b> means Wally Cleaning Company (ACN 148 856 580) of 45 Atkinson Street,Chadstone VIC 3148</p>
        <p><b>‘Schedule’</b> means a schedule attached to this Agreement.</p>
        <p><b>‘Services’</b> means the services described in Item 3 of Schedule 1.</p>
        <p><b>‘Tax Invoice’</b> means a tax invoice as defined under GST Law</p>
      </div>
<br />
      <div className="operations">
      <h2>OPERATIVE PROVISIONS</h2>
      <br />
      <div className='listLine'>
        <p className='listPoint'><strong>2</strong></p>
        <p className='listHeading'><strong>ENGAGEMENT</strong></p>
      </div>

  <div className='listLine'>
    <p className='listPoint'>2.1 </p>
    <p className='listText'>The Principal engages the Contractor, on a non-exclusive basis, to provide the Services on the terms and conditions contained in this Agreement, and the Contractor accepts such engagement.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>2.2</p>
    <p className='listText'>The Contractor (or, with the consent of the Principal, some other Approved Person) will perform the Services to the best of his/her abilities.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>2.3</p>
    <p className='listText'>Without limiting the rights of the Principal, where the Contractor is for any reason unable to
perform the Services on a particular occasion or for a particular period, the Contractor may
nominate another person to perform the Services as an Approved Person. The Principal may
consent to an Approved Person on any conditions the Principal thinks fit or may refuse
consent for any reason it sees fit. </p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>2.4</p>
    <p className='listText'>The Contractor shall not represent himself or herself, and any Approved Person shall not
represent themselves, as being employees or agents of the Principal.</p>
  </div>
      </div>

<br />
      <div className="service">
      <div className='listLine'>
        <p className='listPoint'><strong>3</strong></p>
        <p className='listHeading'><strong>ACCEPTANCE OF SERVICES</strong></p>
      </div>

  <div className='listLine'>
    <p className='listPoint'>3.1 </p>
    <p className='listText'>The Contractor agrees to make himself/herself available for the performance of the Services
at the times that the Principal schedules him/her to perform the Services</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>3.2</p>
    <p className='listText'>The Contractor may decline to undertake the Services that he/she is scheduled to perform,
however, 14 days’ notice must be provided to the Principal of the Contractor’s unavailability
to perform the Services at the times that he/she is scheduled to perform.</p>
  </div>
      </div>
<br />
      <div className="terms">
      <div className='listLine'>
        <p className='listPoint'><strong>4</strong></p>
        <p className='listHeading'><strong>TERM OF AGREEMENT</strong></p>
      </div>

  <div className='listLine'>
    <p className='listPoint'>4.1 </p>
    <p className='listText'>This Agreement commences on the Commencement Date and continues unless terminated in
accordance with clauses 11.3, 12.4 and/or 17 of this Agreement.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>4.2</p>
    <p className='listText'>The Principal shall be responsible for initiating the provision of Services. In the event that a
Client seeks to initiate Services, or the provision of additional Services, directly with the
Contractor or an Approved Person, the Contractor or Approved Person shall immediately
notify the Principal.</p>
  </div>
      </div>
<br />
      <div className="engagement">
      <div className='listLine'>
        <p className='listPoint'><strong>5</strong></p>
        <p className='listHeading'><strong>NATURE OF ENGAGEMENT</strong></p>
      </div>

  <div className='listLine'>
    <p className='listPoint'>5.1 </p>
    <p className='listText'>The Contractor will be engaged by the Principal as an independent contractor.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>5.2</p>
    <p className='listText'>The Contractor understands and acknowledges that he or she is not an employee, legal
representative, agent, joint venturer or partner of the Principal for any reason.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>5.3</p>
    <p className='listText'>Other than as expressly set out in this Agreement, the Principal has no responsibility to the
Contractor, or other Approved Person, in respect of entitlements that normally arise in
employer/employee relationships</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>5.4</p>
    <p className='listText'>The Contractor agrees to provide the Services under this Agreement.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>5.5</p>
    <p className='listText'>The Contractor acknowledges that there is no guarantee of ongoing Services to be performed
under this Agreement.</p>
  </div>
  <div className='listLine'>
    <p className='listPoint'>5.6</p>
    <p className='listText'>The Contractor (and any Approved Person) shall:</p>
  </div>
  <div className="content right">
        <p><b>(a)</b> perform the Services with due skill and care to the best of their knowledge, expertise
and ability;</p>
        <p><b>(b)</b> comply with the reasonable requirements of the Principal, as advised from time to time
in connection with the performance of the Services;</p>
        <p><b>(c)</b> provide the Services to the satisfaction of the Principal;</p>
        <p><b>(d)</b>  comply with all policies and practices of the Principal, treating all references to
‘employees’ as a reference to the Contractor, unless the context otherwise requires; and</p>
        <p><b>(e)</b> comply with any and all applicable standards, guidelines, laws and regulations
regarding work health and safety.</p>
      </div>
      </div>
<br />

      <div className="relationship">
      <div className='listLine'>
        <p className='listPoint'><strong>6</strong></p>
        <p className='listHeading'><strong>NATURE OF RELATIONSHIP</strong></p>
      </div>
  <div className='listLine'>
    <p className='listPoint'>6.1</p>
    <p className='listText'>The Contractor acknowledges that:</p>
  </div>
  <div className="content right">
        <p><b>(a)</b> this Agreement does not give the Contractor authority to bind the Principal, unless
otherwise authorised in writing to do so;</p>
        <p><b>(b)</b> the Contractor must not assume or create or attempt to create any obligation on behalf
of or in the name of the Principal, unless otherwise authorised in writing to do so;</p>
        <p><b>(c)</b> the Contractor is not authorised by the Principal and must not represent that he or she is
authorised by the Principal, to exercise any responsibilities, other than those set out in
this Agreement; and</p>
        <p><b>(d)</b>  the Contractor is solely responsible for controlling the manner in which the Services
are performed, subject to the provisions set out in this Agreement.</p>
      </div>
      </div>
<br />

      <div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>7</strong></p>
    <p className='listHeading'><strong>INDEPENDENT CONTRACTOR FEE</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>7.1 </p>
    <p className='listText'>The Contractor will issue an invoice to the Principal within seven days from when the Services are rendered under this Agreement and each invoice must specify the dates and times the Contractor performed the Services. If the Contractor is registered for GST, they must issue the Principal with a Tax Invoice.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>7.2</p>
    <p className='listText'>The Principal will pay the Contractor Fee by electronic funds transfer as specified in Item 4 of Schedule 1 to the Contractor’s nominated bank account within seven days of the receipt of a valid invoice or Tax Invoice as applicable.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>7.3</p>
    <p className='listText'>The Contractor warrants that it has obtained any necessary registrations for trading and tax purposes and will notify the Principal immediately in the event that it ceases to be registered for any reason.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>7.4</p>
    <p className='listText'>The Contractor will not disclose the quantum of the Contractor Fee to any person (including any employee or other Contractor of the Principal), other than to their own financial or legal advisor.</p>
  </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>8</strong></p>
    <p className='listHeading'><strong>EXPENSES</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>8.1</p>
    <p className='listText'>The Contractor is responsible for all associated expenses incurred by or in connection with providing the Services, except where specifically authorised by the Principal in writing.</p>
  </div>
</div>

<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>9</strong></p>
    <p className='listHeading'><strong>GST</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>9.1</p>
    <p className='listText'>To the extent that a party makes a taxable supply under or in connection with this Agreement, except where an express provision is made to the contrary, the consideration payable by a party under or in connection with this Agreement represents the value of the taxable supply for which payment is to be made and on which GST is to be calculated.</p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>9.2</p>
    <p className='listText'>On request, the Parties must provide each other with all documentation required to claim any input tax credit, set off, rebate, roll-over or refund in relation to any GST including in any payment made under this Agreement including, without limitation, a Tax Invoice.</p>
  </div>
</div>
<br />


<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>10</strong></p>
    <p className='listHeading'><strong>TAXES</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>10.1</p>
    <p className='listText'>The Contractor is solely responsible for all tax liabilities arising from or relating to any payment made by the Principal pursuant to this Agreement. If any such taxes are recovered or sought to be recovered by relevant authorities (including the Australian Taxation Office) from the Principal, the Contractor will reimburse the Principal the amount paid or required to be paid to such authorities. In this Agreement, taxes include without limitation, GST, corporate tax, personal income tax, sales tax, fringe benefit tax, excise duties and similar imposts.</p>
  </div>
  <div className='listLine'>
  <p className='listPoint'>10.2</p>
  <p className='listText'>In this regard, the Contractor warrants that it understands that:</p>
</div>
<div className="content right">
  <p><b>(a)</b> the Principal will not withhold and pay to the Australian Taxation Office tax payable on the Contractor Fee;</p>
  <p><b>(b)</b> that it is responsible for its own tax liabilities; and</p>
  <p><b>(c)</b> that it has an obligation to record its earnings and to pay tax on such earnings to the Australian Taxation Office.</p>
</div>

</div>

<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>11</strong></p>
    <p className='listHeading'><strong>REGISTRATION OF AN AUSTRALIAN BUSINESS NAME</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>11.1 </p>
    <p className='listText'>This Agreement is subject to the Contractor holding and maintaining an Australian Business Name that is properly registered with the Australian Securities and Investments Commission (“ABN”), and the Contractor providing its ABN to the Principal.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>11.2</p>
    <p className='listText'>If, upon entering into the Agreement, the Contractor does not have an ABN, the Contractor must obtain an ABN within two weeks of the Commencement Date and provide the details of that ABN to the Principal.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>11.3</p>
    <p className='listText'>If, within two weeks of the Commencement Date, or at any time after the two weeks following the Commencement Date, the Contractor does not hold an ABN, the Agreement will automatically cease without notice, unless otherwise decided by the Principal.</p>
  </div>
</div>

<br />
<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>12</strong></p>
    <p className='listHeading'><strong>APPROVALS</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>12.1 </p>
    <p className='listText'>The Contractor (and any Approved Person) must possess and maintain all approvals detailed in Item 5 of Schedule 1.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>12.2</p>
    <p className='listText'>All relevant approval documentation must be produced to the Principal, upon request.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>12.3</p>
    <p className='listText'>The Contractor (and any Approved Person) agree to provide the Principal with a copy of all relevant approval documentation upon request.</p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>12.4</p>
    <p className='listText'>This Agreement is subject to the Contractor (and any Approved Person) holding and maintaining the approvals detailed in Item 5 of Schedule 1. If the Contractor loses his/her right to hold any of the approvals in Item 5 of Schedule 1, the Agreement will automatically cease without notice, unless otherwise decided by the Principal.</p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>12.5</p>
    <p className='listText'>The Contractor warrants that it is legally entitled to perform work in Australia and, if relevant, will provide a copy of any valid work Visa to the Principal upon request.</p>
  </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>13</strong></p>
    <p className='listHeading'><strong>MATERIALS</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>13.1 </p>
    <p className='listText'>The Contractor (and any Approved Person) is required to hold and maintain all Materials necessary for the performance of the Services. Further, this Agreement is subject to the Contractor (and any Approved Person) holding and maintaining all such Materials. If the Contractor loses possession of any such Materials, the Agreement will automatically cease without notice, unless otherwise decided by the Principal.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>13.2</p>
    <p className='listText'>Notwithstanding the above, where the Principal agrees to provide the Materials to the Contractor for the performance of the Services, the Contractor agrees to immediately return all Materials provided to it, upon request by the Principal or termination of this Agreement, whichever occurs first.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>13.3</p>
    <p className='listText'>Where the Principal agrees to provide the Materials to the Contractor for the performance of the Services, the Materials are to be utilised for the direct benefit of the Principal at all times. Any damage to the Materials by using it in an unauthorised manner is and will be considered to be a serious breach of the Contractor’s responsibilities, which the Contractor may be liable for. The Contractor may otherwise be held liable for any damage to the Materials whilst the Materials are in the Contractor’s possession.</p>
  </div>
</div>

<br />
<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>14</strong></p>
    <p className='listHeading'><strong>INSURANCE</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>14.1 </p>
    <p className='listText'>The Contractor must obtain and maintain the insurances specified in Item 6 of Schedule 1 and shall provide evidence of such insurance to the Principal upon request.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>14.2</p>
    <p className='listText'>Should the Principal require the Contractor to obtain insurance other than set out in Item 6 of Schedule 1, the Contractor shall take out the necessary insurance policy, without delay, which must provide a level of coverage as determined by the Principal.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>14.3</p>
    <p className='listText'>The Contractor shall bear all responsibilities arising out of any insurance policies and shall take all steps necessary to ensure that any insurance policies remain valid at all times.</p>
  </div>
</div>

<br />
<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>15</strong></p>
    <p className='listHeading'><strong>LIABILITY</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>15.1 </p>
    <p className='listText'>The Contractor is liable for all acts and omissions that are committed in the course of or as a direct or indirect result of providing the Services.</p>
  </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>16</strong></p>
    <p className='listHeading'><strong>ACKNOWLEDGEMENT AND INDEMNITY</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>16.1 </p>
    <p className='listText'>The Contractor acknowledges that time is of the essence in relation to the performance of the Services under this Agreement.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>16.2</p>
    <p className='listText'>The Contractor acknowledges that a breach of this Agreement by the Contractor (and any Approved Person) may result in substantial loss or damage to the Principal.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>16.3</p>
    <p className='listText'>The Contractor agrees to indemnify the Principal, and its directors, officers, employee and agents against all expenses, losses, damages, costs and liabilities connected with, incidental to, or arising out of:</p>
  </div>
  <div className="content right">
  <p><b>(a)</b> any breach of this Agreement or any express or implied warranty by the Contractor (and
any Approved Person) including, but not limited to, a breach in respect of which the
Principal exercises an express right to terminate this Agreement; </p>
  <p><b>(b)</b>  any negligence, non-performance, breach of duty or breach of statute, fraud or wilful
misconduct by the Contractor (and any Approved Person) and any claim made by a third
party or Client or former client of the Principal in respect of the provision of the Services
under this Agreement and/or as a result; or</p>
  <p><b>(c)</b> any claim of liability to pay entitlements to the Contractor (and any Approved Person) in
accordance with legislation, including the Fair Work Act 2009 (Cth), superannuation
legislation, the National Employment Standards, awards and other industrial instruments. </p>
</div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>17</strong></p>
    <p className='listHeading'><strong>TERMINATION</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>17.1 </p>
    <p className='listText'>Notwithstanding clauses 11.3 and 12.4, this Agreement may be terminated by either the Principal or Contractor at any time on the provision of written notice as specified in Item 7 of Schedule 1.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>17.2</p>
    <p className='listText'>Notwithstanding clause 17.1, this Agreement may be terminated at any time by the Principal immediately by written notice to the Contractor and without payment, other than for Services already provided, if:</p>
  </div>
  
  <div className="content right">
    <p><b>(a)</b> the Contractor (or any Approved Person) fails to perform any of the Services;</p>
    <p><b>(b)</b> the Contractor (or any Approved Person) fails or refuses to perform the Services in a competent, professional and timely manner;</p>
    <p><b>(c)</b> the Contractor (or any Approved Person) breaches or acts in a manner that is contrary to any term of this Agreement;</p>
    <p><b>(d)</b> the Contractor (or any Approved Person) wilfully or intentionally commits an act or omission which could reasonably be expected to have or does have a material adverse effect on the Business;</p>
    <p><b>(e)</b> the Contractor (or any Approved Person) acts, behaves or performs in a manner that is inappropriate, unsatisfactory, or otherwise not in the best interests of the Principal;</p>
    <p><b>(f)</b> the Contractor becomes subject to any of the following events:</p>
    <ul style={{listStyle: "none", }}>
      <li><b>(i)</b> the Contractor resolves to enter into or enters into a scheme of arrangement or composition with, or assignment for the benefit of all or any class of, its creditors or proposes a reorganisation, moratorium or other administration or insolvency process; or</li>
      <li><b>(ii)</b> the Contractor becomes unable to pay his or her debts when they fall due, or decides to declare bankruptcy, or is made bankrupt on a creditors petition or otherwise.</li>
    </ul>
  </div>
</div>

<br />
<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>18</strong></p>
    <p className='listHeading'><strong>ASSIGNMENT</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>18.1 </p>
    <p className='listText'>The Contractor (and any Approved Person) must not subcontract any part of the Services without the prior written consent of the Principal, which shall be given at the absolute discretion of the Principal and on such terms and conditions as it deems fit.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>18.2</p>
    <p className='listText'>In the event that the Principal consents to the subcontracting of the Services by the Contractor, the subcontractor must amongst other things, agree to comply with such terms and conditions as are contained in this Agreement.</p>
  </div>
</div>

<br />
<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>19</strong></p>
    <p className='listHeading'><strong>CONFLICT OF INTEREST</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>19.1 </p>
    <p className='listText'>If the performance of the Services by the Contractor or Approved Person results in, or is reasonably likely to result in, a conflict of interest in duty with any other work the Contractor or Approved Person performing or has agreed to perform for any external party, the Contractor or Approved Person shall:</p>
  </div>
  <div className="content right">
      <p><b>(a)</b> notify the Principal of the conflict of interest in duty; and</p>
      <p><b>(b)</b> stop performing the other work which has or will give rise to the conflict immediately upon becoming aware of the conflict or reasonable likelihood of the conflict.</p>
    </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>20</strong></p>
    <p className='listHeading'><strong>TERMS REASONABLE</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>20.1 </p>
    <p className='listText'>The Contractor warrants that:</p>
   
  </div>
  <div className="content right">
      <p><b>(a)</b> it has voluntarily entered into this Agreement without any duress from the Principal;</p>
      <p><b>(b)</b> other than as set out in this Agreement, the Principal has not made any promises, representation or inducements to enter into this Agreement;</p>
      <p><b>(c)</b> before signing this Agreement, the Contractor was given a reasonable opportunity to consider their position and understand the legal effect of this Agreement; and</p>
      <p><b>(d)</b> the terms of this Agreement are reasonable.</p>
    </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>21</strong></p>
    <p className='listHeading'><strong>ENTIRE AGREEMENT</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>21.1 </p>
    <p className='listText'>This Agreement represents the entire arrangement and supersedes all prior oral and/or written agreements, understandings, obligations or commitments between the Parties.</p>
  </div>
  
  <div className='listLine'>
    <p className='listPoint'>21.2</p>
    <p className='listText'>The Parties acknowledge that the obligations under this Agreement will continue to apply after termination or assignment of this Agreement.</p>
  </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>22</strong></p>
    <p className='listHeading'><strong>VARIATION</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>22.1 </p>
    <p className='listText'>This Agreement may be extended, added to or varied in writing by the Principal and Contractor.</p>
  </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>23</strong></p>
    <p className='listHeading'><strong>WAIVER</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>23.1 </p>
    <p className='listText'>The failure of a party at any time on the performance of an obligation under this Agreement of the other party is not a waiver of its right:</p>
    
  </div>
  <div className="content right">
      <p><b>(a)</b> to insist on performance of that obligation or to claim damages unless the party acknowledges in writing the failure or waiver; and</p>
      <p><b>(b)</b> at any other time to insist on performance of that or any other obligation under this Agreement of the other party.</p>
    </div>
</div>
<br />

<div className="terms">
  <div className='listLine'>
    <p className='listPoint'><strong>24</strong></p>
    <p className='listHeading'><strong>GOVERNING LAW</strong></p>
  </div>

  <div className='listLine'>
    <p className='listPoint'>24.1 </p>
    <p className='listText'>This Agreement is governed by and construed in accordance with the laws in force in the State of Victoria. Each party irrevocably and unconditionally submits to the exclusive jurisdiction of the courts of Victoria.</p>
  </div>
</div>

<br /><br /><br />

<div className="terms">
  <p className='center'><b>EXECUTED AS AN INDEPENDENT CONTRACTOR AGREEMENT</b></p><br />
  <p><b>EXECUTED</b> for and on behalf of <b>THE PRINCIPAL</b> by its duly Authorized Officer</p><br />
  <div className="signature">
    <p className='small'>Signature of the Principal</p>
    <img className='signatureContainer' src={sign}></img><br /><br />
    <div className="lineContainer">
          <div className="QuestionLine small">Name of the Principal</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="authorisedOfficerName"
              value={form2Data.authorisedOfficerName}
              onChange={handleInputChange}
              className='inputLine'
              disabled
            />
          </div>
          <div>
        {form2Errors.authorisedOfficerName && <div className="error-message">{form2Errors.authorisedOfficerName}</div>}
        </div>
        </div>
        </div>


  </div>
  <div className="subHeading highlighted">
        I also understand that when vacating/leaving my position I am required to provide a minimum of 14 days’ notice in writing and failure to do so will forfeit payment of my last invoice.
      </div><br />
  <p><b>EXECUTED</b> by <b>THE CONTRACTOR</b> in the presence of</p><br />
  <div className="signature">
    <p className='small'>Signature of Contractor</p>
    <Canvas  onExport={(data) => handleExportedImage(data, 'contractor')} /><br />
    <div className="lineContainer">
          <div className="QuestionLine small">Name of Contractor</div>
          <div>
          <div className="answerLine">
            <input
              type="text"
              name="contractorName"
              value={form2Data.contractorName}
              onChange={handleInputChange}
              className='inputLine'
            />
          </div>
          <div>
        {form2Errors.contractorName && <div className="error-message">{form2Errors.contractorName}</div>}
        </div>
        </div>
        </div>
  </div>
</div>
<br /><br />
<div>
  <div className="heading">SCHEDULE 1</div><br /><br />
  <table className='schedule-table'>
  <tbody>
    <tr>
      <td>1</td>
      <td>Commencement Date</td>
      <td><input
              type="date"
              name="commencementDate"
              value={form2Data.commencementDate}
              onChange={handleInputChange}
              className='dateLine'
            />
            <div>
        {form2Errors.commencementDate && <div className="error-message">{form2Errors.commencementDate}</div>}
        </div>
            </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Method of Payment</td>
      <td>Paid by Electronic Funds Transfer within seven days of receipt of an invoice or Tax Invoice (as applicable).</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Licenses</td>
      <td>
        <ul>
          <li className='right'>National Police Check Certificate (compulsory); and</li>
          <li className='right'>Working with Children Check (if requested).</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>Insurances</td>
      <td>Public Liability Insurance (minimum $5 mil)</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Notice of Termination of Agreement</td>
      <td>14 days</td>
    </tr>
  </tbody>
</table>
<br />
</div>

</div>

    
      </div>
      <div style={{display:"flex"}}>
     { generatePDF && <button  type='button' className="nextButton" disabled={isSubmitting} onClick={()=>{window.print()}} style={{width:"70vw"}}>Download PDF</button>}
      {submitBtn && <button  type='submit' className="nextButton" disabled={isSubmitting}>Submit</button>}
      </div>
    {isSubmitting && <Modal heading="Loading" subHeading="Please wait while your form is being submitted" buttonPresent="false" />}
    {submittedSuccessfully && <Modal heading="Success" subHeading="Your form details have been submitted successfully. However, one final step remains. Please generate the Contract PDF and submit it to complete the process." subHeading1="Thank you for your cooperation." buttonPresent="true" close={setSubmittedSuccessfully} pdfbutton={setGeneratePDF} refresh={()=>{}} submitDisable={setSubmitBtn}/>}
      </form><br /><br /><br />
      {generatePDF && (<div className='boxContent block'>
      <form onSubmit={handleSubmitContractFile}>
      <label htmlFor="contractPDF" className='QuestionLine block'>Upload Contract PDF</label>
      <input type="file" name="contract" id="contract" className='answerline top block' onChange={(e)=>{handleFileChange(e, "contract")}}/>
      {form2Errors.contract && <div className="error-message">{form2Errors.contract}</div>}
      <button  type='submit' className='fileUploadBtn block'>Final Submission</button>
      </form>
      {isSubmitting && fileInputsSubmission && <Modal heading="Loading" subHeading="Please wait while your form is being submitted" buttonPresent="false" />}
      {submittedSuccessfully && fileInputsSubmission && <Modal heading="Success" subHeading="Your form details have been submitted successfully finally." subHeading1="Have a good day." buttonPresent="true" close={setSubmittedSuccessfully} pdfbutton={()=>{}} refresh={()=>{window.location.reload()}} submitDisable={setSubmitBtn}/>}
      </div>)}
    </React.Fragment>
  )
}

export default Form2
