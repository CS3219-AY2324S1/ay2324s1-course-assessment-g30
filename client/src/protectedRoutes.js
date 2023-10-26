import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = localStorage.getItem("notAuthenticated");
  console.log(user)
  return user;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth !== null || isAuth === false ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;