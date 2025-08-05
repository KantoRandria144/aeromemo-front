import { useState, useRef } from "react";

type TUser = { id: string; name: string; email: string };
type TUserSearch = {
  placeholder?: string;
  className?: string;
  label: string;
  rounded?: "full" | "medium" | "large" | "none";
  user: TUser[];
  userSelected?: TUser[];
  setUserSelected?: React.Dispatch<React.SetStateAction<TUser[]>>;
};

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const CustomInputUserSpecifiedSearch = ({
  placeholder,
  className,
  rounded = "none",
  label,
  user,
  userSelected,
  setUserSelected,
}: TUserSearch) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueChange, setValueChange] = useState<string>("");
  const [userMatched, setUserMatched] = useState<TUser[]>([]);

  const handleuserMatch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setValueChange(value);

    const filtered = user.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );

    setUserMatched(filtered);
  };

  return (
    <div className="relative text-sm">
      <div>
        <label className="mb-1 font-poppins font-semibold leading-relaxed block text-sm text-black dark:text-white">
          {label}
        </label>
        <input
          ref={inputRef}
          type="text"
          className={`w-full border md:h-10 bg-transparent py-3 px-3 text-black dark:text-gray outline-none border-stroke focus:border-primaryGreen focus-visible:shadow-none dark:border-formStrokedark dark:focus:border-primaryGreen ${className} ${round[rounded]}`}
          value={valueChange}
          placeholder={placeholder}
          onChange={handleuserMatch}
        />
        <div
          className={`absolute mt-1 bg-white whitespace-nowrap bg-opacity-90 max-h-45 overflow-y-scroll z-999999 min-w-fit w-full  border border-stroke rounded-sm transition-transform duration-200 ease-in-out transform ${
            valueChange.length > 0
              ? "scale-y-100 scale-x-100 opacity-100"
              : "scale-y-0 scale-x-0 opacity-0"
          }`}
        >
          {userMatched.map((user) => (
            <div
              key={user.id}
              className="py-2 px-4 cursor-pointer dark:text-bodydark hover:bg-gray-3 dark:bg-black dark:hover:bg-boxdark2"
              onClick={() => {
                const isUserAlreadySelected = userSelected?.some(
                  (selected) => selected.id === user.id
                );

                if (!isUserAlreadySelected && setUserSelected) {
                  setUserSelected((prev) => [...(prev || []), user]);
                }
                setValueChange("");
              }}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomInputUserSpecifiedSearch;
