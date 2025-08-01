import { useEffect, useState, useRef } from "react";
import { InputUserSearchInterface } from "../../../types/input";
import { getAllUsers } from "../../../services/User/UserServices";

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const CutomInputUserSearch = ({
  placeholder,
  className,
  rounded = "none",
  label,
  userSelected,
  setUserSelected,
  role,
}: InputUserSearchInterface) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueChange, setValueChange] = useState<string>("");
  const [allUsers, setAllUsers] = useState([]);
  const [userMatched, setUserMatched] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const users = await getAllUsers();
      const filteredUser = users?.map(
        ({ id, name, email }: { id: string; name: string; email: string }) => ({
          id,
          name,
          email,
        })
      );
      setAllUsers(filteredUser);
    };
    fetchUser();
  }, []);

  const handleuserMatch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setValueChange(value);

    const filtered = allUsers.filter(
      (user: { name: string; email: string }) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );

    setUserMatched(filtered);
  };
  return (
    <div className="relative">
      <div>
        <label className="mb-1 font-poppins font-semibold leading-relaxed block text-sm text-black dark:text-white">
          {label}
        </label>
        <input
          ref={inputRef}
          type="text"
          className={`w-full border  border-stroke bg-transparent py-3 pl-6 pr-10 text-black dark:text-gray outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border-formStrokedark dark:focus:border-primaryGreen ${className} ${round[rounded]}`}
          value={valueChange}
          placeholder={placeholder}
          onChange={handleuserMatch}
        />
        <div
          className={`absolute mt-1 bg-opacity-90 max-h-45 overflow-y-scroll  z-999999 min-w-fit w-full bg-white border border-stroke rounded-sm transition-transform duration-200 ease-in-out transform ${
            valueChange.length > 1
              ? "scale-y-100 scale-x-100 opacity-100"
              : "scale-y-0 scale-x-0 opacity-0"
          }`}
        >
          {userMatched?.map((user: { id: string; name: string }) => (
            <div
              key={user?.id}
              className={`py-2 px-4 cursor-pointer   dark:text-bodydark hover:bg-gray-3 dark:bg-black dark:hover:bg-boxdark2 `}
              onClick={() => {
                const isUserAlreadySelected = userSelected?.some(
                  (selected) => selected.id === user.id
                );

                if (!isUserAlreadySelected) {
                  if (role) {
                    setUserSelected([...userSelected, { ...user, role }]);
                  } else {
                    setUserSelected([...userSelected, user]);
                  }
                }
                setValueChange("");
              }}
            >
              {user?.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CutomInputUserSearch;
