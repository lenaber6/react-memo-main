import { useContext } from "react";
import { CheckboxContext } from "../contexts/checkbox";

export function useCheckbox() {
  return useContext(CheckboxContext);
}
