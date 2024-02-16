import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      const decoded_token = jwtDecode(access_token);
      const {
        user_id,
        first_name,
        email,
      } = decoded_token;
      const user = {
        user_id: user_id,
        first_name: first_name,
        email: email,
      };
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;