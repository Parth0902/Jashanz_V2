import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "expo-router";
// Define JWT_TOKEN and TOKEN_KEY or replace them with actual values

const TOKEN_KEY = "your_token_key";
const User="userName" // Replace with your actual value
const { url } = process.env;
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [IsAdmin,setIsAdmin]=useState(false);
  const [Token,setToken]=useState(null);


  const UserRegister = async (payload, input) => {
    try {
      const ack = await axios.post(
        `${url}/api/customers/register/${input}`,
        payload
      );
      console.log(ack.data);
      return ack;
    } catch (err) {
      return { error: true, msg: err.response.data.msg };
    }
  };
  

  const UserLogin = async (payload) => {
    try {
      console.log(url);
      const ack = await axios.post(`${url}/api/customers/login`, payload);
      // Additional check to ensure ack and ack.data are defined
      if (ack && ack.data) {
        setCurrentUser(ack.data.username);
        setToken(ack.data.jwtToken);
        await SecureStore.setItemAsync(TOKEN_KEY, ack.data.jwtToken);
        await SecureStore.setItemAsync(User, ack.data.username); // Assuming 'User' is a key
        setIsAdmin(false);
        return ack;
      } else {
        // Handle undefined ack or ack.data
        return { error: true, msg: 'Invalid response from server' };
      }
    } catch (err) {
      console.log(err);
      // More detailed error handling based on err object
      if (err.response) {
        // Server responded with a status code outside the 2xx range
        return { error: true, msg: err.response.data.msg || 'Error logging in' };
      } else if (err.request) {
        // The request was made but no response was received
        return { error: true, msg: 'No response from server' };
      } else {
        // Something happened in setting up the request
        return { error: true, msg: err.message };
      }
    }
  };
  

  const logout = async () => {
    console.log("logout Pressed");
    setToken(null);
    setIsAdmin(false);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(User);
    axios.defaults.headers.common["Authorization"] = "";
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    setCurrentUser(null);
  };

  const AdminLogin = async (payload) => {
    try {
      const ack = await axios.post(`${url}/api/admin/login`, payload);
      // console.log(ack);
      await SecureStore.setItemAsync(TOKEN_KEY,ack.data.jwtToken);
      setCurrentAdmin(ack.data.username);
      setToken(ack.data.jwtToken);
      setIsAdmin(true);
      return ack;
    } catch (err) {
      if (err.response) {
        // If there's a response object, it means there was a response from the server
        return { error: true, msg: err.response.data.msg };
      } else if (err.request) {
        // If there's a request object, it means the request was made but no response was received
        return { error: true, msg: 'No response received' };
      } else {
        // If there's neither response nor request, there might be a different issue
        return { error: true, msg: 'Error in request', fullError: err.message };
      }
    }
  };
  


  useEffect(() => {
    const loadToken = async () => {
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      const u= await SecureStore.getItemAsync(User);
      if(u && t){
        setCurrentUser(u);
        setToken(t);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, UserLogin, logout, UserRegister ,Token,AdminLogin,IsAdmin,currentAdmin}}
    >
      {children}
    </AuthContext.Provider>
  );
};
