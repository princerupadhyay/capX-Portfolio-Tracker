export const isUserLoggedIn = () => {
  return !!localStorage.getItem("authToken");
};
