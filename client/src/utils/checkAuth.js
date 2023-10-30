export default function useAuth() {
    let user = localStorage.getItem("notAuthenticated");
    if (user) {
      user = Boolean(user)
    }
    console.log(user)
    return user;
  };