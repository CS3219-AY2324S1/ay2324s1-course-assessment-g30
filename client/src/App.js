import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AddQuestionForm from "./pages/AddQuestionForm/AddQuestionForm";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import IndividualQuestionPage from "./pages/IndividualQuestion/IndividualQuestionPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import UpdateQuestionPage from "./pages/UpdateQuestion/UpdateQuestionPage";
import ProtectedRoutes from "./protectedRoutes";
import { ScrollToTop } from "./utils/ScrollToTop";
import EditProfile from "./pages/Authentication/EditProfile";
import ViewProfile from "./pages/Authentication/ViewProfile";
import RoomPage from "./pages/RoomPage/RoomPage";
import { useEffect } from "react";
import { deleteToken } from "./api/Auth";

function App() {
  // useEffect(() => {
  //   if (getTableStorage() == null) {
  //     setTableStorage("tableData", table1);

  //     console.log('invoked')
  //   }
  //   if (getQuestionStorage() == null) {
  //     setTableStorage("questions", table2);
  //   }

  // }, [])


  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add_question" element={<AddQuestionForm />} />
            <Route
              path="/question/:questionId"
              element={<IndividualQuestionPage />}
            />
            <Route
              path="/edit_question/:questionId"
              element={<UpdateQuestionPage />}
            />
            <Route path="/edit_profile" element={<EditProfile />} />
            <Route path="/view_profile" element={<ViewProfile />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            {/* <Route path="/forgot_password" element={<LoginForm />} /> */}
          </Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
