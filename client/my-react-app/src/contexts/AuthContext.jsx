import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/check-user', { withCredentials: true });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('User is not logged in:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        withCredentials: true,
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

 const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
  
      setUser(null); // Clear user state
      window.location.href = "/"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);