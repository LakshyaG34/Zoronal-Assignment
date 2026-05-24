const USER_KEY = "userInfo";



// SAVE USER
export const setUser = (userData) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(userData)
  );
};



// GET USER
export const getUser = () => {
  const user =
    localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};



// REMOVE USER
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};



// GET TOKEN
export const getToken = () => {
  const user = getUser();

  return user?.token || null;
};