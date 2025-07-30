import React, { useEffect, useRef, useState } from "react";
import { MultiSelectProps, OptionMultiSelect } from "../../../types/input";

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const MultiSelect = ({
  label,
  value,
  setValueMulti,
  rounded = "none",
  id,
  initialValue,
  placeholder,
  className,
  required = false,
}: MultiSelectProps) => {
  const [options, setOptions] = useState<OptionMultiSelect[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  // New state to track if initial values have been set
  const [isInitialValueSet, setIsInitialValueSet] = useState(false);

  // Load options from hidden select element
  useEffect(() => {
    const loadOptions = () => {
      const select = document.getElementById(id) as HTMLSelectElement | null;
      if (select) {
        const newOptions: OptionMultiSelect[] = [];
        for (let i = 0; i < select.options.length; i++) {
          newOptions.push({
            value: select.options[i].value,
            text: select.options[i].innerText,
            selected: select.options[i].hasAttribute("selected"),
          });
        }
        setOptions(newOptions);
      }
    };
    loadOptions();
  }, [id, value]);

  // Initialize selected values ONLY ONCE
  useEffect(() => {
    // This effect will run when options are loaded and only if initialValue hasn't been processed yet
    if (initialValue && options.length > 0 && !isInitialValueSet) {
      const selectedValues = initialValue.split(',').map(v => v.trim());
      const selectedIndices: number[] = [];
      const newOptions = [...options];

      // Reset all selections before setting initial ones to avoid duplicates if options were reloaded
      newOptions.forEach(opt => opt.selected = false);

      // Find matching options based on initialValue
      selectedValues.forEach(val => {
        const index = newOptions.findIndex(opt => opt.value === val);
        if (index !== -1) {
          selectedIndices.push(index);
          newOptions[index].selected = true;
        }
      });

      setSelected(selectedIndices);
      setOptions(newOptions); // Update options state with selected flags
      setValueMulti(selectedValues); // Inform parent about initial selections
      setIsInitialValueSet(true); // Mark that initial values have been processed
    }
  }, [initialValue, options, isInitialValueSet, setValueMulti]); // Added setValueMulti to dependencies as it's used inside

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const select = (index: number, event: React.MouseEvent) => {
    const newOptions = [...options];
    event.stopPropagation(); // Prevent dropdown from closing immediately

    // Toggle selection
    if (!newOptions[index].selected) {
      newOptions[index].selected = true;
      setSelected(prevSelected => [...prevSelected, index]); // Use functional update for setSelected
    } else {
      newOptions[index].selected = false;
      setSelected(prevSelected => prevSelected.filter((i) => i !== index)); // Use functional update for setSelected
    }

    setOptions(newOptions); // Update options to reflect selection status
  };

  const remove = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing immediately
    const newOptions = [...options];
    const selectedIndex = selected.indexOf(index); // Find the index of the selected item within the 'selected' array

    if (selectedIndex !== -1) {
      newOptions[index].selected = false; // Mark the option as not selected
      setSelected(prevSelected => prevSelected.filter((i) => i !== index)); // Remove from selected array
      setOptions(newOptions); // Update options state
    }
  };

  const selectedValues = () => {
    // Map selected indices back to their values
    return selected.map((index) => options[index]?.value).filter(Boolean);
  };

  // Update parent component when selected items change
  // This effect will run whenever the 'selected' state changes due to user interaction
  useEffect(() => {
    // Only update parent if initial setup is done or if there are actual selections
    // This prevents sending empty array before initialValue is processed
    if (isInitialValueSet || selected.length > 0) {
      setValueMulti(selectedValues());
    }
  }, [selected, isInitialValueSet, setValueMulti]); // Include isInitialValueSet and setValueMulti in dependencies

  return (
    <div className={`relative ${className}`}>
      <label className="mb-1 min-w-20 block text-sm font-medium text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div>
        {/* Hidden select element to load options from */}
        <select className="hidden" id={id}>
          {value?.map((opt, key) => (
            <option value={opt} key={key}>
              {opt}
            </option>
          ))}
        </select>

        <div className="flex flex-col items-center">
          <input name="values" type="hidden" defaultValue={selectedValues().join(',')} /> {/* Use join for hidden input */}
          <div className="relative z-20 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div
                ref={trigger}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full cursor-pointer"
              >
                <div
                  className={`mb-2 flex ${round[rounded]} border overflow-x-auto border-stroke dark:border-formStrokedark md:py-1 px-3 outline-none transition focus:border-primary active:border-primary dark:text-gray dark:border-form-strokedark dark:bg-form-input`}
                >
                  <div className="flex flex-auto gap-3">
                    {/* Display selected items */}
                    {selected.map((index) => {
                      const option = options[index];
                      // Ensure option exists before rendering
                      if (!option) return null;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          <div className="max-w-full text-xs flex-initial">
                            {option.text}
                          </div>
                          <div className="flex flex-auto flex-row-reverse">
                            <div
                              onClick={(e) => remove(index, e)}
                              className="cursor-pointer pl-2 hover:text-danger"
                            >
                              <svg
                                className="fill-current"
                                role="button"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Placeholder input when nothing is selected */}
                    {selected.length === 0 && (
                      <div className="flex-1">
                        <input
                          required={required}
                          placeholder={placeholder}
                          className="h-full w-full appearance-none bg-transparent outline-none"
                          defaultValue="" // Set to empty string for initial load if no values.
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                  {/* Dropdown toggle button */}
                  <div className="flex w-8 items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                      }}
                      className={`h-6 w-6 cursor-pointer outline-none focus:outline-none transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
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
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* Dropdown options list */}
              <div className="w-full px-4">
                <div
                  ref={dropdownRef}
                  className={`max-h-select max-h-60 absolute top-full left-0 z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                    isOpen ? "" : "hidden"
                  }`}
                >
                  <div className="flex w-full flex-col">
                    {options.map((option, index) => (
                      <div key={index}>
                        <div
                          className="w-full cursor-pointer border-b border-stroke hover:bg-gray-3 dark:border-strokedark dark:bg-black dark:hover:bg-boxdark2"
                          onClick={(event) => select(index, event)}
                        >
                          <div
                            className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                              option.selected ? "border-primary" : ""
                            }`}
                          >
                            <div className="flex w-full items-center">
                              <div className="mx-2 text-sm leading-6">
                                {option.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;