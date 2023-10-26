import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  let user = localStorage.getItem("notAuthenticated");
  if (user) {
    user = Boolean(user)
  }
  return user;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth !== null || isAuth === false ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;