import { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  className?: string;
  rounded?: "full" | "medium" | "large" | "none";
  error?: string | null;
  rows?: number;
  cols?: number;
  label: string;
  help?: string;
  value?: string | number | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface InputUserSearchInterface {
  placeholder?: string;
  className?: string;
  rounded?: "full" | "medium" | "large" | "none";
  label?: string;
  userSelected: {
    id: string | undefined;
    name: string;
    email: string;
  }[];
  setUserSelected: Function;
  role?: string;
}

export interface OptionMultiSelect {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

export interface MultiSelectProps {
  label?: string;
  value?: string[];
  options?: string[] | OptionMultiSelect[]; // Ajoutez cette ligne
  setValueMulti: (value: string[]) => void;
  rounded?: "full" | "medium" | "large" | "none";
  id: string;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export interface InputSelectprops
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  data: Array<string | undefined>;
  value?: string;
  onValueChange: (selectedValue: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export type CheckBoxProp = {
  label: string;
  type?: "checkbox" | "radio";
  name?: string;
  htmlFor?: string;
  checked?: boolean;
  onStateCheckChange?: (checked: boolean) => void;
  active?: boolean | number;
  className?: string;
};
