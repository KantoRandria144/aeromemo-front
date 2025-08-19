import { useState, useEffect } from "react";
import { IMyHabilitation } from "../../types/Habilitation";
import { TableAccessProps } from "../../types/table";
import CustomInput from "../UIElements/Input/CustomInput";
import CustomSelect from "../UIElements/Select/CustomSelect";

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
      setIsDeleteAccess(true);
      setAccessSelectedId(accessSelected);
    } else {
      setAccessSelectedId(accessSelected);
      setIsModalModifAccessVisible(true);
    }
  };

  const renderHabilitationDetails = (habilitation: any, type: string) => {
    if (!habilitation || habilitation.length === 0) {
      return <p className="text-black dark:text-white">--</p>;
    }

    return habilitation.map((item: any, key: number) => {
      const messages = [];
      let count = 0;

      // Common conditions for all types
      if (item.create === 1) {
        messages.push(`Créer ${type === 'admin' ? 'une nouvelle habilitation' : `un nouveau ${type}`}`);
        count++;
      }
      if (item.update === 1) {
        messages.push(`Modifier les détails ${type === 'admin' ? 'd\'une habilitation' : `d'un ${type}`}`);
        count++;
      }
      if (item.delete === 1) {
        messages.push(type === 'admin' ? 'Supprimer une habilitation' : `Supprimer un ${type}`);
        count++;
      }

      // Specific conditions for reunion
      if (type === 'reunion') {
        if (item.watchMyReunion === 1) {
          messages.push("Voir la liste de mes réunions");
          count++;
        }
        if (item.watchMySubordinatesReunion === 1) {
          messages.push("Voir la liste de mes réunions et celle de mes subordonné(e)s");
          count++;
        }
        if (item.watchAllReunion === 1) {
          messages.push("Voir la liste de tous les réunions de Ravinala");
          count++;
        }
        if (item.manage === 1) {
          messages.push("Gérer les avancements des phases de mes réunions");
          count++;
        }
        if (item.assign === 1) {
          messages.push("Assigner un réunion à autrui");
          count++;
        }
      }

      // Specific conditions for admin
      if (type === 'admin') {
        if (item.modifyHierarchy === 1) {
          messages.push("Modifier la hiérarchie des utilisateurs");
          count++;
        }
        if (item.restoreHierarchy === 1) {
          messages.push("Restaurer la hiérarchie");
          count++;
        }
        if (item.actualizeUserData === 1) {
          messages.push("Actualiser les valeurs utilisateurs");
          count++;
        }
        if (item.assignAccess === 1) {
          messages.push("Assigner des accès aux utilisateurs");
          count++;
        }
      }

      if (count === 0) {
        return <p key={key} className="text-black dark:text-white">Aucun accès</p>;
      }

      return count > 1 ? (
        <details key={key}>
          <summary>{messages[0]}</summary>
          <p className="text-black dark:text-white">
            {messages.slice(1).join(", ")}
          </p>
        </details>
      ) : (
        <p key={key} className="text-black dark:text-white">
          {messages[0]}
        </p>
      );
    });
  };

  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* Filter Section */}
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

      {/* Pagination and Title */}
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

      {/* Bulk Action Section */}
      <div
        className={`mt-[-60px] border-primaryGreen border dark:border-formStrokedark bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          accessSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div>
          {accessSelected.length === 1
            ? "1 élément sélectionné"
            : `${accessSelected.length} éléments sélectionnés`}{" "}
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

      {/* Table Section */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className="rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className="pl-2">
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
                    />
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        label: !dataSorted.label,
                      });
                    }}
                    className={`${
                      dataSorted.label ? "" : "rotate-180"
                    } transform transition-transform duration-200`}
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
                      />
                    </svg>
                  </button>
                  <span>Label</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                Admin
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                Réunion
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              ?.filter((_, index) => indexInPaginationRange(index))
              .map((access) => (
                <tr
                  key={access?.id}
                  className="hover:bg-whiten dark:hover:bg-boxdark2"
                >
                  <td className="pl-2">
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
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">
                      {access?.label}
                    </p>
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {renderHabilitationDetails(access?.habilitationAdmins, 'admin')}
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {renderHabilitationDetails(access?.habilitationReunion, 'reunion')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableAccess;