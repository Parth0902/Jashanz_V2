import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "expo-router";
// Define JWT_TOKEN and TOKEN_KEY or replace them with actual values
const TOKEN_KEY = "your_token_key";
const User = "userName" // Replace with your actual value
const { url } = process.env;

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [IsAdmin, setIsAdmin] = useState(null);
  const [Token, setToken] = useState(null);
  const [userRegisterPayload, setUserRegisterPayload] = useState(null);
  const [refresh, setRefresh] = useState(false);
  

  const UserRegister = async (payload, input) => {
    try {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
      let bodyContent = JSON.stringify(payload);
       let response = await fetch(`${url}/api/customers/register/${input}`, { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });

       let data = await response.text();
      return response;
    } catch (err) {
      return { error: true, msg: err };
    }
  };

  const AdminRegister = async (payload, input) => {
    try {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
    
       let bodyContent = JSON.stringify({
       "alternateMobileNumber":payload.mobileNumber,
       "email":payload.email,
       "emailormobile":payload.mobileNumber,
       "firmName":payload.firmName,
       "mobileNumber":payload.mobileNumber,
       "password":payload.password,
       "role":"ROLE_ADMIN",
       "specialization":payload.specialization,
       });
       
       let response = await fetch(`${url}/api/admin/register/${input}`, { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
    
      return response;
    } catch (err) {
      return { error: true, msg: err };
    }
  };


  const userOtp = async (payload) => {
    try {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
      };

      let response = await fetch(`${url}/api/generateUserOtp/${payload.mobileNumber}`, {
       method: "GET",
      headers: headersList
      });
      let data = await response.text();
      if(response.status === 200){
        setUserRegisterPayload({...payload,user:true});
      }
      return response;
    } catch (err) {
      return { error: true, msg: err};
    }
  };

  const AdminOtp = async (payload) => {
    try {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
      };
      let response = await fetch(`${url}/api/generateAdminOtp/${payload.mobileNumber}`, {
       method: "GET",
      headers: headersList
      });
      let data = await response.text();
      if(response.status === 200){
        setUserRegisterPayload({...payload,user:false});
      }
      return response;
    } catch (err) {
      return { error: true, msg: err};
    }
  };

  const UserLogin = async (payload) => {
    try {
      // console.log(url);
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
    // console.log("logout Pressed");
    setToken(null);
    setIsAdmin(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(User);
    axios.defaults.headers.common["Authorization"] = "";
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    setCurrentUser(null);
  };

  const AdminLogin = async (payload) => {
    try {
      const ack = await axios.post(`${url}/api/admin/login`, payload);
   
      await SecureStore.setItemAsync(TOKEN_KEY, ack.data.jwtToken);
      setCurrentAdmin(ack.data.username);
      setToken(ack.data.jwtToken);
      setIsAdmin(true);
      return ack;
    } catch (err) {
      if (err.response) {
        return { error: true, msg: err.response.data.msg };
      } else if (err.request) {
        return { error: true, msg: 'No response received' };
      } else {
        return { error: true, msg: 'Error in request', fullError: err.message };
      }
    }
  };

  const getCurrentUser = async () => {
    let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${Token}`
    };

    try {
        let response = await fetch(`${url}/customer/current-user`, {
            method: "GET",
            headers: headersList
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;  // Re-throwing the error after logging it
    }
};


  useEffect(() => {
    const loadToken = async () => {
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      const u = await SecureStore.getItemAsync(User);
      if (u && t) {
        setCurrentUser(u);
        setToken(t);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, UserLogin, logout, UserRegister, Token,AdminRegister, AdminLogin, IsAdmin, currentAdmin, userOtp,userRegisterPayload,AdminOtp,getCurrentUser,refresh,setRefresh}}
    >
      {children}
    </AuthContext.Provider>
  );
};
