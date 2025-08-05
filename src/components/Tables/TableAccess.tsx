import { useState, useEffect } from "react";


import { IMyHabilitation } from "../../types/Habilitation";
import { TableAccessProps } from "../../types/table";
import CustomInput from "../UIElements/Input/CustomInput";
import CustomSelect from "../UIElements/Select/CustomSelect";
// import { deleteHabilitation } from "../../services/User";

const TableAccess = ({
  data,
  setIsDeleteAccess,
  setAccessSelectedId,
  setIsModalModifAccessVisible,
  myHabilitation,
}: {
  data: TableAccessProps["data"];
  setIsDeleteAccess: Function;
  setAccessSelectedId: Function;
  setIsModalModifAccessVisible: Function;
  myHabilitation: IMyHabilitation | undefined;
}) => {
  const [entriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [accessSelected, setAccessSelected] = useState<string[]>([]);
  const [dataSorted, setDataSorted] = useState({
    label: true,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [search, setSearch] = useState({
    name: "",
  });

  const filteredData = data.filter((item) => {
    const lowerCaseSearchName = search.name.toLowerCase();

    return item.label.toLowerCase().includes(lowerCaseSearchName);
  });

  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };
  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };
  useEffect(() => {
    setPageNumbers(getPageNumber(filteredData.length));
  }, [entriesPerPage, filteredData.length]);

  useEffect(() => {
    setActualPage(1);
    setAccessSelected([]);
    setIsAllSelected(false);
  }, [search]);

  const handleDeleteFilter = () => {
    setSearch({
      ...search,
      name: "",
    });
  };

  const handleSelectAllAccess = () => {
    if (accessSelected.length < filteredData.length) {
      setAccessSelected([]);
      filteredData.map((u) => setAccessSelected((prev) => [...prev, u.id]));
      setIsAllSelected(true);
    } else {
      setAccessSelected([]);
      setIsAllSelected(false);
    }
  };

  const handleBulkAction = (e: string) => {
    if (e === "Supprimer") {
      console.log(accessSelected);
      setIsDeleteAccess(true);
      setAccessSelectedId(accessSelected);
      // try {
      //   deleteHabilitation(accessSelected);
      // } catch (error) {
      //   console.log(`Unable to delete habilitations: ${error}`);
      // }
    } else {
      setAccessSelectedId(accessSelected);
      setIsModalModifAccessVisible(true);
    }
  };
  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* =====FILTER START===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
          <CustomInput
            type="text"
            value={search.name}
            label="Recherche"
            placeholder="Label"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                name: e.target.value,
              });
            }}
          />

          <div className="flex items-end pb-2 mx-2">
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
        </div>
      </div>
      {/* =====FILTER END===== */}

      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 flex justify-between px-3 transition-opacity ${
          isAllSelected || accessSelected.length > 0
            ? "opacity-0"
            : "opacity-100"
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
        <div className="text-xl text-title text-center font-semibold dark:text-whiten">
          Liste de tous les accès
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
      {/* ===== BULK ACTION START ===== */}
      <div
        className={`mt-[-60px] border-primaryGreen border dark:border-formStrokedark  bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          accessSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div>
          {accessSelected.length === 1
            ? "1 élément séléctionné"
            : `${accessSelected.length} éléments séléctionnés`}{" "}
        </div>
        <div>
          <CustomSelect
            data={
              accessSelected.length > 1
                ? ["Supprimer"].filter((action) => {
                    if (
                      !myHabilitation?.admin.deleteHabilitation &&
                      action === "Supprimer"
                    ) {
                      return false;
                    }
                    return true;
                  })
                : ["Modifier", "Supprimer"].filter((action) => {
                    if (
                      !myHabilitation?.admin.deleteHabilitation &&
                      action == "Supprimer"
                    ) {
                      return false;
                    }
                    if (
                      !myHabilitation?.admin.updateHabilitation &&
                      action === "Modifier"
                    ) {
                      return false;
                    }
                    return true;
                  })
            }
            className="mb-2"
            placeholder="Actions"
            onValueChange={(e) => {
              handleBulkAction(e);
            }}
          />
        </div>
      </div>
      {/* ===== BULK ACTION END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className=" rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className=" pl-2 ">
                <button
                  onClick={handleSelectAllAccess}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      accessSelected.length === filteredData.length
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
                    ></path>{" "}
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center ">
                  <button
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        label: !dataSorted.label,
                      });
                    }}
                    className={`${
                      dataSorted.label ? "" : "rotate-180"
                    } transform transition-transform duration-200   `}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </svg>
                  </button>
                  <span>Label</span>
                </div>
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Admin
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Projet
              </th>
              <th className="py-4 px-4 max-w-40  font-bold  text-white dark:text-white xl:pl-11">
                Transverse
              </th>
              <th className="py-4 px-4 max-w-40  font-bold  text-white dark:text-white xl:pl-11">
                Inter-contrat
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              ?.filter((_access, index) => indexInPaginationRange(index))
              .filter((access) => {
                const label = access?.label?.toLowerCase();

                const searchQuery = search.name.toLowerCase();

                return label.includes(searchQuery);
              })
              .map((access) => (
                <tr
                  key={access?.id}
                  className="hover:bg-whiten dark:hover:bg-boxdark2"
                >
                  <td className="pl-2 ">
                    <button
                      className="cursor-pointer border w-5 h-5"
                      onClick={() => {
                        setAccessSelected((prev) => {
                          if (prev?.includes(access.id)) {
                            return prev.filter((id) => id !== access.id);
                          } else {
                            return [...prev, access.id];
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
                          accessSelected.includes(access.id)
                            ? "visible"
                            : "invisible"
                        }`}
                      >
                        <path
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          className="stroke-black-2 dark:stroke-whiten"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </svg>
                    </button>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">
                      {access?.label}
                    </p>
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.habilitationAdmins?.map((admin, key) => {
                      const message = [];
                      let count = 0;
                      if (admin.createHabilitation === 1) {
                        message.push("Créer une nouvelle habilitation");
                        count++;
                      }
                      if (admin.deleteHabilitation === 1) {
                        message.push("Supprimer une habilitation");
                        count++;
                      }
                      if (admin.updateHabilitation === 1) {
                        message.push("Modifier une habilitation");
                        count++;
                      }
                      if (admin.modifyHierarchy === 1) {
                        message.push("Modifier la hiérarchie des utilisateurs");
                        count++;
                      }
                      if (admin.restoreHierarchy === 1) {
                        message.push("Restaurer la hiérarchie");
                        count++;
                      }
                      if (admin.actualizeUserData === 1) {
                        message.push("Actualiser les valeurs utilisaterus");
                        count++;
                      }
                      if (admin.assignAccess === 1) {
                        message.push("Assigner des accès aux utilisateurs");
                        count++;
                      }
                      return count > 1 ? (
                        <details key={key}>
                          <summary>{message?.[0]}, </summary>
                          <p className="text-black dark:text-white">
                            {message.slice(1).join(", ")}
                          </p>
                        </details>
                      ) : count === 0 ? (
                        <p key={key} className="text-black dark:text-white">
                          --
                        </p>
                      ) : (
                        <p key={key} className="text-black dark:text-white">
                          {message[0]}
                        </p>
                      );
                    })}
                  </td>

                  {/* <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.habilitationProjects?.map((project, key) => {
                      const message = [];
                      let count = 0;
                      if (project.watchMyProject === 1) {
                        message.push("Voir la liste de mes projets");
                        count++;
                      }
                      if (project.watchMySubordinatesProject === 1) {
                        message.push(
                          "Voir la liste de mes projets et celle de mes subordonné(e)s"
                        );
                        count++;
                      }
                      if (project.watchAllProject === 1) {
                        message.push(
                          "Voir la liste de tous les projets de Ravinala"
                        );
                        count++;
                      }
                      if (project.create === 1) {
                        message.push("Créer un projet");
                        count++;
                      }
                      if (project.update === 1) {
                        message.push("Modifier les détails de mes projets");
                        count++;
                      }
                      if (project.updateMySubordinatesProject === 1) {
                        message.push(
                          "Modifier les détails des projets et celle de mes subordonnées"
                        );
                        count++;
                      }
                      if (project.updateAllProject === 1) {
                        message.push(
                          "Modifier les détails de tous les projets"
                        );
                        count++;
                      }
                      if (project.manage === 1) {
                        message.push(
                          "Gérer les avancements des phases de mes projets"
                        );
                        count++;
                      }
                      if (project.manageMySubordinatesProject === 1) {
                        message.push(
                          "Gérer les avancements des phases des projets et celle de mes subordonnées"
                        );
                        count++;
                      }
                      if (project.delete === 1) {
                        message.push("Archiver mes projets");
                        count++;
                      }
                      if (project.deleteMySubordinatesProject === 1) {
                        message.push(
                          "Archiver les projets de mes subordonné(e)s"
                        );
                        count++;
                      }
                      if (project.deleteAllProject === 1) {
                        message.push("Archiver tous projets");
                        count++;
                      }
                      if (project.assign === 1) {
                        message.push("Assigner un projet à autrui");
                        count++;
                      }

                      return count > 1 ? (
                        <details key={key}>
                          <summary>{message?.[0]}, </summary>
                          <p className="text-black dark:text-white">
                            {message.slice(1).join(", ")}
                          </p>
                        </details>
                      ) : count === 0 ? (
                        <p key={key} className="text-black dark:text-white">
                          --
                        </p>
                      ) : (
                        <p key={key} className="text-black dark:text-white">
                          {message[0]}
                        </p>
                      );
                    })}
                  </td> */}

                  {/* <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.habilitationTransverses?.map((transverse, key) => {
                      const message = [];
                      let count = 0;
                      if (transverse.create === 1) {
                        message.push("Créer un transverse");
                        count++;
                      }
                      if (transverse.update === 1) {
                        message.push("Modifier les détails d'un transverse");
                        count++;
                      }
                      if (transverse.delete === 1) {
                        message.push("Supprimer un transverse");
                        count++;
                      }

                      return count > 1 ? (
                        <details key={key}>
                          <summary>{message?.[0]}, </summary>
                          <p className="text-black dark:text-white">
                            {message.slice(1).join(", ")}
                          </p>
                        </details>
                      ) : count === 0 ? (
                        <p key={key} className="text-black dark:text-white">
                          --
                        </p>
                      ) : (
                        <p key={key} className="text-black dark:text-white">
                          {message[0]}
                        </p>
                      );
                    })}
                  </td> */}

                  {/* <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.habilitationIntercontracts?.map(
                      (intercontract, key) => {
                        const message = [];
                        let count = 0;
                        if (intercontract.create === 1) {
                          message.push("Créer un inter-contrat");
                          count++;
                        }
                        if (intercontract.update === 1) {
                          message.push(
                            "Modifier les détails d'un inter-contrat"
                          );
                          count++;
                        }
                        if (intercontract.delete === 1) {
                          message.push("Supprimer un inter-contrat");
                          count++;
                        }

                        return count > 1 ? (
                          <details key={key}>
                            <summary>{message?.[0]}, </summary>
                            <p className="text-black dark:text-white">
                              {message.slice(1).join(", ")}
                            </p>
                          </details>
                        ) : count === 0 ? (
                          <p key={key} className="text-black dark:text-white">
                            --
                          </p>
                        ) : (
                          <p key={key} className="text-black dark:text-white">
                            {message[0]}
                          </p>
                        );
                      }
                    )}
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* =====TABLE END===== */}
    </div>
  );
};

export default TableAccess;
