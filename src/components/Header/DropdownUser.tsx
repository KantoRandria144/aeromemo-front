import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserOne from "../../assets/user.png";
const DropdownUser = (userConnected: any) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const navigate = useNavigate();

    // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
    return (
        <>
        <div className="relative">
            <Link 
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                to="#"
            >
                <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                    {userConnected?.userConnected?.name}
                </span>
                <span className="block text-xs">
                    {userConnected?.userConnected?.email}
                </span>
                </span>
                 <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
          {/* <img
            src={`${import.meta.env.VITE_PROFILE_PICTURE_LINK}${
              userConnected?.userConnected?.email?.split("@")[0]
            }%40ravinala-airports.aero`}
            alt="User"
            className="rounded-full size-12  ring-1 ring-stroke dark:ring-strokedark"
          /> */}
        </span>
        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
            </Link>
        </div>
        </>
    )
}

export default DropdownUser;