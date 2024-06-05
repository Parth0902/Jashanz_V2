// EventContext.js
import React, { createContext, useState, useContext } from "react";
// import { AuthContext } from "./AuthContext";
// const {url}=process.env;
// import axios from "axios";
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(null);
  const [AdminInfo, setAdminInfo] = useState(null);
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [countR, setCountR] = useState(0);
  
 
  return (
    <AdminContext.Provider
      value={{
        setAdminId,
        adminId,
        allRequests,
        setAllRequests,
        requests,
        setRequests,
        countR,
        setCountR,
        AdminInfo,
        setAdminInfo,
        refresh,
        setRefresh
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
