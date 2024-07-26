import { createContext, useState } from "react";

export const CheckboxContext = createContext(null);

export const CheckboxProvider = ({ children }) => {
  const [isEasyMode, setIsEasyMode] = useState(false);

  // function tickedCheckbox(newUser) {
  //   setIsEasyMode(prev => !prev);
  // }

  return (
    <CheckboxContext.Provider
      value={{
        isEasyMode,
        setIsEasyMode,
        // tickedCheckbox
      }}
    >
      {children}
    </CheckboxContext.Provider>
  );
};
