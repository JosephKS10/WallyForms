import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './Pages/HomeScreen';
import PersonalInfoForm from './components/PersonalInfoForm';
import Form2 from './components/Form2';
import Form3 from './components/Form3';
import Form4 from './components/Form4';

import './App.css'

function App() {

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []); 


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/PersonalInfo" element={<PersonalInfoForm />} />
          <Route path="/Form2" element={<Form2 />} />
          <Route path="/Form3" element={<Form3 />} />
          <Route path="/Form4" element={<Form4 />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
