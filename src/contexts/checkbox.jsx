import { createContext, useState } from "react";

function getEasyModeFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem("mode"));
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const CheckboxContext = createContext(null);

export const CheckboxProvider = ({ children }) => {
  const [isEasyMode, setIsEasyMode] = useState(getEasyModeFromLocalStorage());

  return (
    <CheckboxContext.Provider
      value={{
        isEasyMode,
        setIsEasyMode,
      }}
    >
      {children}
    </CheckboxContext.Provider>
  );
};
