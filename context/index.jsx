"use client";
import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

import { toast } from "react-hot-toast";

const AppContext = createContext();

export function AppWrapper({ children }) {
    const [location, setLocation] = useState(null);


    return (
        <AppContext.Provider value={{ location,setLocation }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
