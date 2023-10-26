import './App.css';
import Layout from './components/layout/Layout'
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import LandingPage from './pages/LandingPage/LandingPage';
import AddQuestionForm from './pages/AddQuestionForm/AddQuestionForm';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setTableStorage, getTableStorage, getQuestionStorage } from './utils/localStorage/localStorage';
import { table1, table2 } from './data/data';
import IndividualQuestionPage from './pages/IndividualQuestion/IndividualQuestionPage';
import { ScrollToTop } from './utils/ScrollToTop';

function App() {

  useEffect(() => {
    if (getTableStorage() == null) {
      setTableStorage("tableData", table1);
      
      console.log('invoked')
    }
    if (getQuestionStorage() == null) {
      setTableStorage("questions", table2);
    }

  }, [])

  return (
    <>
    <ScrollToTop />
    <Layout>
      <Routes>
        
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add_question" element={<AddQuestionForm />} />
        <Route path='/question/:questionId' element={<IndividualQuestionPage />} />
        {/* <Route path="/forgot_password" element={<LoginForm />} /> */}
      </Routes>
    </Layout>
    </>
  );
}

export default App;
