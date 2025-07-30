import React from "react";

const PerPageInput = ({
  entriesPerPage,
  setEntriesPerPage,
  setPage,
}: {
  entriesPerPage: number;
  setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<
    React.SetStateAction<{
      pageNumber: number;
      pageSize: number;
    }>
  >;
}) => {
  return (
    <div className="flex justify-center items-center gap-2 ">
      <div className=" justify-center items-center ">
        <label className="mb-2.5   font-poppins font-semibold leading-relaxed  text-sm text-black dark:text-white ">
          <span>Par page : </span>
        </label>
      </div>
      <div>
        <input
          type="number"
          min={1}
          className="w-18 rounded-md  border h-8 md:h-8 flex justify-center items-center text-center md:text-xs  bg-transparent   text-black dark:text-gray  outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border dark:border-formStrokedark dark:focus:border-primaryGreen"
          value={`${entriesPerPage.toString()}`}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              setEntriesPerPage(value);
              setPage((prev) => ({
                ...prev,
                pageSize: value,
              }));
            } else {
              setEntriesPerPage(1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default PerPageInput;
