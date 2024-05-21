// EventContext.js
import React, { createContext, useState,useEffect,useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from "axios";
const { url } = process.env;

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventDataContext, setEventDataContext] = useState(null);
  const [currentUser,setCurrentUser] = useState(null);
  const { Token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser=async()=>{
    let headersList = {
      "Accept": "*/*",
      "Authorization": `Bearer ${Token}` 
     }
     
     let reqOptions = {
       url: "https://backend.jashanz.com/customer/current-user",
       method: "GET",
       headers: headersList,
     }
     
     if(Token){
       let response = await axios.request(reqOptions);
       if(response.status === 200){
          setCurrentUser(response.data);
        }
     }
  }
  fetchUser();
  },[Token])

  
  return (
    <EventContext.Provider value={{ eventDataContext, setEventDataContext,currentUser}}>
      {children}
    </EventContext.Provider>
  );
};
