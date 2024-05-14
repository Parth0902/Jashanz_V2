// EventContext.js
import React, { createContext, useState } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventDataContext, setEventDataContext] = useState(null);

  return (
    <EventContext.Provider value={{ eventDataContext, setEventDataContext }}>
      {children}
    </EventContext.Provider>
  );
};
