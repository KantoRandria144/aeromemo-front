import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import CustomSelect from "../../../components/UIElements/Select/CustomSelect";
import CustomInputUserSpecifiedSearch from "../../../components/UIElements/Input/CustomInputUserSpecifiedSearch";
import CustomInput from "../../../components/UIElements/Input/CustomInput";
import DefaultLayout from "../../../components/layout/DefaultLayout";

const Planification = ({
    search,
    availableUser,
    selectedUserInput,
    setSelecteduserInput,
    setSearch,
}: {
    search: {
        title: string;
        member: string;
        priority: string;
        criticity: string;
        completionPercentage: string;
        startDate: string | undefined;
        endDate: string | undefined;
    };
    availableUser: {
        id: string;
        name: string;
        email: string;
    }[];
    selectedUserInput: Array<{
        id: string;
        name: string;
        email: string;
    }>;
    setSelecteduserInput: React.Dispatch<
        React.SetStateAction<
            Array<{
                id: string;
                name: string;
                email: string;
            }>
        >
    >;
    setSearch: React.Dispatch<
        React.SetStateAction<{
            title: string;
            member: string;
            priority: string;
            criticity: string;
            completionPercentage: string;
            startDate: string | undefined;
            endDate: string | undefined;
        }>
    >;
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

    return (
        <DefaultLayout>
            <div className="mx-2 py-4 md:mx-10">
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
    <Breadcrumb
        paths={[{ name: "Liste des Projets", to: "/aeromemo/planification" }]}
    />

    <button
        onClick={() => navigate("/aeromemo/créer-réunion")}
        className="md:w-fit mb-2 gap-2 flex justify-center w-full md:w-auto cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform"
    >
        <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 12H18M12 6V18"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
        Ajouter un nouveau Projet
    </button>
</div>

                    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                        <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full">
                                <CustomSelect 
                                    label="Type reunion"
                                    data={["Réunion Transverse", "Réunion Projet"]}
                                    value=""
                                    onValueChange={()=>{}}
                                />
                                <CustomInputUserSpecifiedSearch
                                    label="Membre"
                                    rounded="medium"
                                    placeholder="Rechercher"
                                    user={availableUser}
                                    userSelected={selectedUserInput}
                                    setUserSelected={setSelecteduserInput}
                                />
                                <CustomInput
                                    type="date"
                                    value={search.startDate}
                                    label="Date début"
                                    rounded="medium"
                                    onChange={(e) => {
                                        setSearch({
                                            ...search,
                                            startDate: e.target.value,
                                        });
                                    }}
                                />
                                <CustomInput
                                    type="date"
                                    value={search.endDate}
                                    label="Date de fin"
                                    rounded="medium"
                                    onChange={(e) => {
                                        setSearch({
                                            ...search,
                                            endDate: e.target.value,
                                        });
                                    }}
                                />
                                <div className="flex items-end gap-2 mx-3">
                                    <div className="pb-2">
                                        <button className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit">
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
                                    <div>
                                        <button type="button" className="px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform">
                                            Rechercher
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-8 gap-2 hidden">
                                <div>
                                    <div className="flex mt-2.5 justify-between items-center text-sm border rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 transition hover:shadow-md">
                                        <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium"></span>
                                        <button className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <nav className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
                                <button
                                    role="tab"
                                    type="button"
                                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:green-600 focus:ring-inset ${
                                        activeTab === "all"
                                            ? "text-green-600 shadow bg-white dark:text-white dark:bg-green-600"
                                            : "hover:text-gray-800 focus:text-green-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                    }`}
                                    onClick={() => setActiveTab("all")}
                                >
                                    Tous
                                </button>
                                <button
                                    role="tab"
                                    type="button"
                                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-green-600 focus:ring-inset ${
                                        activeTab === "mine"
                                            ? "text-green-600 shadow bg-white dark:text-white dark:bg-green-600"
                                            : "hover:text-gray-800 focus:text-green-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                    }`}
                                    onClick={() => setActiveTab("mine")}
                                >
                                    Mes réunions
                                </button>
                            </nav>
                        </div>

                        <div className="pb-4 items-center flex justify-between px-3 transition-opacity">
                            <button className="rotate-180">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 12H18M18 12L13 7M18 12L13 17"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <div className="text-xl text-center text-title font-semibold dark:text-whiten">
                                {activeTab === "all" ? "Liste de tous les réunions" : "Liste de mes réunions"}
                            </div>
                            <button>
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 12H18M18 12L13 7M18 12L13 17"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="max-w-full mb-4 overflow-x-auto">
                            <table className="w-full text-sm hidden md:table table-auto">
                                <thead className="pt-5 rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
                                    <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
                                        <th className="pl-2">
                                            <button className="cursor-pointer border w-5 h-5">
                                                <svg
                                                    width="18"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
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
                                        {activeTab === "all" ? (
                                            <>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Date</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Titre</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Organisateur</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Participants</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Statuts</span>
                                                    </div>
                                                </th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Date</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Titre</span>
                                                    </div>
                                                </th>
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Participant</span>
                                                    </div>
                                                </th>
                                               
                                                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Statut</span>
                                                    </div>
                                                </th>
                                            </>
                                        )}
                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                            <div className="flex items-center gap-1">
                                                <span>Actions</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === "all" ? (
                                        // Contenu pour "Tous"
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Aucune réunion trouvée
                                            </td>
                                        </tr>
                                    ) : (
                                        // Contenu pour "Mes réunions"
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Aucune de vos réunions trouvée
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            </div>
        </DefaultLayout>
    );
};

export default Planification;