import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const authAPI = "http://localhost:5001/auth";

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if(storedUser){
      setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    try{
      const response = await fetch(`${authAPI}/login`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
        credentials: "include"
      });

      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/dashboard");

      return true;
    }
    catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  const register = async (name, email, password, role) => {
    try{
      const response = await fetch(`${authAPI}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password, role}),
        credentials: "include"
      });

      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || "Registration failed");
      }

      // Call login function after successful registration
      const loginSuccess = await login(email, password);

      if (!loginSuccess) {
        navigate("/"); // Redirect to login if auto-login fails
      }

      return true;
    }
    catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  const logout = async () => {
    try {
      await fetch("http://localhost:5001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  }

  return(
    <AuthContext.Provider value={{user, register, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);