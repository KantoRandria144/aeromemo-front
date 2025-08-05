import { useEffect, useState, useRef } from "react";
import { InputSelectprops } from "../../../types/input";

const CustomSelect = ({
  data,
  placeholder,
  onValueChange,
  value,
  label,
  className,
  required = false,
  disabled = false,
}: InputSelectprops) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNearLeft, setIsNearLeft] = useState(false);
  // const [isNearRight, setIsNearRight] = useState(false);
  // const [selected, setSelected] = useState(value);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // click on the outside of the select
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !isOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setIsOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [isOpen]);

  useEffect(() => {
    const checkProximity = () => {
      if (dropdown.current) {
        const rect = dropdown.current.getBoundingClientRect();
        const threshold = 50; // distance à laquelle tu considères l'élément comme proche du bord

        setIsNearLeft(rect.left < threshold);
        // setIsNearRight(window.innerWidth - rect.right < threshold);
      }
    };

    checkProximity(); // Vérifie la position au chargement

    window.addEventListener("resize", checkProximity); // Vérifie la position lors du redimensionnement
    return () => {
      window.removeEventListener("resize", checkProximity);
    };
  }, []);

  const handleSelect = (option: any) => {
    // setSelected(option);
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className} `}>
      <label className="mb-1 min-w-20 leading-relaxed block font-semibold font-poppins text-sm text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full text-sm py-2.5 px-3 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-lg  text-left ${
          value ? "dark:text-gray text-black" : "text-bodydark2"
        } ${disabled ? "bg-slate-200 cursor-default dark:bg-slate-800":"bg-transparent"}`}
      >
        {value || placeholder}

        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </button>
      <div
        ref={dropdown}
        className={`absolute right-0 z-999999  min-w-full bg-white dark:bg-black border border-stroke max-h-52 overflow-y-scroll rounded-lg mt-1 transition-transform duration-200 ease-in-out transform ${
          isOpen
            ? "scale-y-100 scale-x-100 opacity-100 "
            : " scale-y-0 scale-x-0 opacity-0 "
        } ${isNearLeft ? "left-0" : "0"}  `}
        style={{ transformOrigin: "top" }}
      >
        {data?.map((option, index) => (
          <div
            key={index}
            onClick={() => handleSelect(option)}
            className={`py-2 px-4 cursor-pointer text-sm  dark:text-bodydark hover:bg-gray-3 dark:hover:bg-boxdark2 rounded-md ${
              value === option ? "bg-gray-3 dark:bg-boxdark2" : ""
            }`}
            style={{
              height: "40px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
