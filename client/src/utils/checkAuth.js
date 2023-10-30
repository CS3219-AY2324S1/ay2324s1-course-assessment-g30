export default function useAuth() {
    const user = localStorage.getItem("notAuthenticated");
    console.log(user)
    return user;
  };