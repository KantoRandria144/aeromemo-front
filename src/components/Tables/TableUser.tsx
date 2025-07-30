import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { getAllDepartments} from "../../services/User/UserServices";
import { getAllHabilitationLabels } from "../../services/User/HabilitationService";
import PerPageInput from "../UIElements/PerPageInput";
import Pagination from "./Pagination";
import CustomInput from "../UIElements/Input/CustomInput";
import CustomSelect from "../UIElements/Select/CustomSelect";
import { IMyHabilitation } from "../../types/Habilitation";
import ConfirmDeleteHabilitationuser from "../Modals/ConfirmDeleteHabilitationuser";
import UserModifModal from "../Modals/UserModifModal";

const TableUser = ({
  data,
  onModification,
  setOnModification,
  myHabilitation,
  totalCount,
  search,
  setPage,
  setSearch,
  setIsSearchButtonClicked,
}: {
  data: Array<any>;
  onModification: boolean;
  setOnModification: Function;
  myHabilitation: IMyHabilitation | undefined;
  totalCount: number;
  search: {
    nameOrMail: string;
    department: string;
    habilitation: string;
  };
  setPage: React.Dispatch<
    React.SetStateAction<{
      pageNumber: number;
      pageSize: number;
    }>
  >;
  setSearch: React.Dispatch<
    React.SetStateAction<{
      nameOrMail: string;
      department: string;
      habilitation: string;
    }>
  >;
  setIsSearchButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [userModif, setUserModif] = useState(false);
  const [userDelete, setUserDelete] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [habilitation, setHabilitations] = useState<string[]>([]);
  const [dataSorted, setDataSorted] = useState({
    name: 0,
    email: 0,
    department: 0,
  });

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [userSelected, setUserSelected] = useState<string[]>([]);
  const [userSelectedForModif, setUserSelectedForModif] = useState({
    name: "",
    email: "",
  });
  // TO GET THE NUMBER OF PAGE DEPENDING OF THE ENTRIES PER PAGE
  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };

  useEffect(() => {
    setPageNumbers(getPageNumber(totalCount));
  }, [totalCount, entriesPerPage]);

  // sort the data by name z-a
  const sortedData = data?.slice()?.sort((a, b) => {
    // sort by name
    if (dataSorted.name === 1) {
      return a.name.localeCompare(b.name);
    } else if (dataSorted.name === 2) {
      return b.name.localeCompare(a.name);
    }

    // sort by mail
    if (dataSorted.email === 1) {
      return a.email.localeCompare(b.email);
    } else if (dataSorted.email === 2) {
      return b.email.localeCompare(a.email);
    }

    // sort by department
    if (dataSorted.department === 1) {
      return a.department.localeCompare(b.department);
    } else if (dataSorted.email === 2) {
      return b.department.localeCompare(a.department);
    }

    return 0;
  });

  useEffect(() => {
    setPage((prev) => ({
      ...prev,
      pageNumber: actualPage,
    }));
  }, [actualPage]);

  // ALWAYS IN THE FIRST PAGE WHEN SEARCH, DESELECT ALL
  useEffect(() => {
    setActualPage(1);
    setUserSelected([]);
    setIsAllSelected(false);
  }, [search]);

  // GET ALL HABILITATION AND DEPARTMENTS FROM DB
  useEffect(() => {
    const fetchDepartmentAndHabilitation = async () => {
      const depart = await getAllDepartments();
      const habilit = await getAllHabilitationLabels();
      const updatedHabilit = [...habilit, "Vide"];
      setDepartments(depart);
      setHabilitations(updatedHabilit);
    };

    fetchDepartmentAndHabilitation();
  }, []);

  // IF SELECT ONE USER STORE HIS NAME AND EMAIL
  useEffect(() => {
    if (userSelected?.length === 1) {
      const user = data?.filter((u) => {
        return u.id === userSelected?.[0];
      });
      setUserSelectedForModif({
        name: user?.[0]?.name,
        email: user?.[0]?.email,
      });
    }
  }, [userSelected]);

  useEffect(() => {
    setOnModification(!onModification);
  }, [userModif, userDelete]);

  // DELETE FILTER
  const handleDeleteFilter = () => {
    setSearch((prev) => ({
      ...prev,
      nameOrMail: "",
      department: "",
      habilitation: "",
    }));
    setIsSearchButtonClicked(true);
  };

  // SELECT ALL USER
  const handleSelectAllUser = () => {
    // IF THERE IS ALREADY USER SELECTED SO SELECT ALL USER ELSE DESELECT ALL
    if (userSelected.length < data.length) {
      setUserSelected([]);
      data.map((u) => setUserSelected((prev) => [...prev, u.id]));
      setIsAllSelected(true);
    } else {
      setUserSelected([]);
      setIsAllSelected(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearchButtonClicked(true);
    }
  };

  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* ==== FILTER START ===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div
          onKeyDown={handleKeyDown}
          className=" grid md:grid-cols-4 grid-cols-1 gap-3 w-full"
        >
          <CustomInput
            type="text"
            value={search.nameOrMail}
            label="Recherche"
            placeholder="Nom ou mail"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                nameOrMail: e.target.value,
              });
            }}
          />
          <p></p>
          <CustomSelect
            label="Département"
            placeholder="Département"
            data={departments}
            value={search.department}
            onValueChange={(e) => {
              setSearch({
                ...search,
                department: e,
              });
            }}
          />
          <CustomSelect
            label="Accès"
            placeholder="Accès"
            data={habilitation}
            value={search.habilitation}
            onValueChange={(e) => {
              setSearch({
                ...search,
                habilitation: e,
              });
            }}
          />
          <div className="flex items-end gap-2  mx-3">
            <div className="pb-2">
              <button
                onClick={handleDeleteFilter}
                className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit"
              >
                Effacer les filtres
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#00AE5D"
                >
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="">
              <button
                type="button"
                onClick={() => {
                  setIsSearchButtonClicked(true);
                }}
                className=" px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  "
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ==== FILTER END ===== */}
      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 flex justify-between px-3 transition-opacity ${
          isAllSelected || userSelected.length > 0 ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          disabled={actualPage === 1}
          className="rotate-180"
          onClick={() => setActualPage((prev) => Math.max(prev - 1, 1))}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === 1 ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="text-xl text-center text-title font-semibold dark:text-whiten">
          Liste de tous les utilisateurs
        </div>
        <button
          disabled={actualPage === pageNumbers}
          onClick={() =>
            setActualPage((prev) => Math.min(prev + 1, pageNumbers))
          }
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === pageNumbers ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* =====PAGINATE AND TITLE END===== */}
      {/* ===== BULK START ===== */}
      <div
        className={` mt-[-60px] border-primaryGreen border dark:border-formStrokedark  bg-white z-40 dark:bg-boxdark relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          userSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div>
          {userSelected.length === 1
            ? "1 élément séléctionné"
            : `${userSelected.length} éléments séléctionnés`}{" "}
        </div>
        <div
          className={`${
            myHabilitation?.admin?.assignAccess ? "opacity-100" : "right-0"
          }`}
        >
          <CustomSelect
            data={["Modifier habilitation(s)", "Supprimer habilitation(s)"]}
            className="mb-2  "
            placeholder="Actions"
            onValueChange={(e) => {
              if (e.includes("Modifier")) {
                setUserModif(true);
              } else {
                setUserDelete(true);
              }
            }}
          />
        </div>
      </div>
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full mb-4 overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className="pl-2">
                <button
                  onClick={handleSelectAllUser}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      userSelected.length === data.length
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center gap-1">
                  <span>Nom</span>
                  <button
                    className={`
                     transform transition-transform duration-200`}
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        department: 0,
                        email: 0,
                        name: dataSorted.name < 2 ? dataSorted.name + 1 : 0,
                      });
                    }}
                  >
                    <svg
                      className="fill-white"
                      height="15"
                      width="15"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 425 425"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <polygon
                            className={`${
                              dataSorted.name === 0
                                ? "fill-white"
                                : dataSorted.name === 1
                                ? "fill-black"
                                : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5 "
                          ></polygon>{" "}
                          <polygon
                            className={`${
                              dataSorted.name === 0
                                ? "fill-white"
                                : dataSorted.name === 1
                                ? "fill-primaryGreen dark:fill-darkgreen"
                                : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5 "
                          ></polygon>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </button>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center gap-1">
                  <span>Email</span>
                  <button
                    className={`
                     transform transition-transform duration-200`}
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        department: 0,
                        name: 0,
                        email: dataSorted.email < 2 ? dataSorted.email + 1 : 0,
                      });
                    }}
                  >
                    <svg
                      className="fill-white"
                      height="15"
                      width="15"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 425 425"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <polygon
                            className={`${
                              dataSorted.email === 0
                                ? "fill-white"
                                : dataSorted.email === 1
                                ? "fill-black"
                                : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5 "
                          ></polygon>{" "}
                          <polygon
                            className={`${
                              dataSorted.email === 0
                                ? "fill-white"
                                : dataSorted.email === 1
                                ? "fill-primaryGreen dark:fill-darkgreen"
                                : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5 "
                          ></polygon>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </button>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center gap-1">
                  <span>Département</span>
                  <button
                    className={`
                     transform transition-transform duration-200`}
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        email: 0,
                        name: 0,
                        department:
                          dataSorted.department < 2
                            ? dataSorted.department + 1
                            : 0,
                      });
                    }}
                  >
                    <svg
                      className="fill-white"
                      height="15"
                      width="15"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 425 425"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <polygon
                            className={`${
                              dataSorted.department === 0
                                ? "fill-white"
                                : dataSorted.department === 1
                                ? "fill-black"
                                : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5 "
                          ></polygon>{" "}
                          <polygon
                            className={`${
                              dataSorted.department === 0
                                ? "fill-white"
                                : dataSorted.department === 1
                                ? "fill-primaryGreen dark:fill-darkgreen"
                                : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5 "
                          ></polygon>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </button>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <span>Supérieur direct</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                Accès
              </th>
            </tr>
          </thead>
          <tbody>
            {!data ? (
              <tr>
                <td colSpan={9} className="py-9 content-center">
                  <div className="flex justify-center items-center">
                    <SyncLoader size={18} color={"teal"} />
                  </div>
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr className="hover:bg-whiten dark:hover:bg-boxdark2">
                <td colSpan={9} className="py-9 content-center ">
                  <div className="flex justify-center items-center">
                    Pas d'utilisateur
                  </div>
                </td>
              </tr>
            ) : (
              sortedData
                // ?.filter((_user, index) => indexInPaginationRange(index))
                .map((user) => (
                  <tr
                    key={user?.id}
                    className="hover:bg-whiten dark:hover:bg-boxdark2"
                  >
                    <td className="pl-2">
                      <button
                        className="cursor-pointer border w-5 h-5"
                        onClick={() => {
                          setUserSelected((prev) => {
                            if (prev?.includes(user.id)) {
                              return prev.filter((id) => id !== user.id);
                            } else {
                              return [...prev, user.id];
                            }
                          });
                        }}
                      >
                        <svg
                          width="18"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${
                            userSelected.includes(user.id)
                              ? "visible"
                              : "invisible"
                          }`}
                        >
                          <path
                            d="M4 12.6111L8.92308 17.5L20 6.5"
                            className="stroke-black-2 dark:stroke-whiten"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {user?.name?.split("(")?.[0]}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {user?.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {user?.department}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {user?.superiorName?.split("(")?.[0]}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] space-x-1 py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {user?.habilitations?.map(
                        (hab: { id: string; label: string }) => (
                          <span
                            key={hab.id}
                            className="text-white border  border-orange bg-orange py-1 px-2 rounded-2xl dark:text-white whitespace-nowrap"
                          >
                            {hab?.label}
                          </span>
                        )
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      {/* ===== PAGINATE BEGIN ===== */}

      <div className="flex  flex-col flex-wrap md:flex-row justify-end px-4 items-center">
        <PerPageInput
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          setPage={setPage}
        />
        <Pagination
          actualPage={actualPage}
          setActualPage={setActualPage}
          pageNumbers={pageNumbers}
        />
      </div>
      {/* ===== PAGINATE END ===== */}
      {/* =====TABLE END===== */}
      {/* =====MODAL USER MODIF START===== */}
     {userModif && (
  <UserModifModal
    userForModif={{
      ...userSelectedForModif,
      habilitations: userSelected.length === 1 
        ? data.find(u => u.id === userSelected[0])?.habilitations?.map((h: { label: any; }) => h.label) || []
        : []
    }}
    setUserModifs={setUserModif}
    userSelected={userSelected}
  />
)}
      {/* =====MODAL USER MODIF END===== */}
      {/* =====MODAL USER DELETE START===== */}
      {userDelete && (
        <ConfirmDeleteHabilitationuser
          setUserDelete={setUserDelete}
          userSelected={userSelected}
        />
      )}
      {/* =====MODAL USER DELETE END===== */}
    </div>
  );
};

export default TableUser;
