// EventContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
// import { AuthContext } from "./AuthContext";
// const {url}=process.env;
// import axios from "axios";
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [countR, setCountR] = useState(0);
  // const { Token,currentAdmin } = useContext(AuthContext);
 
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
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
