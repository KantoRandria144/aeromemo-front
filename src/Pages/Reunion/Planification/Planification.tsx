import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import CustomSelect from "../../../components/UIElements/Select/CustomSelect";
import CustomInputUserSpecifiedSearch from "../../../components/UIElements/Input/CustomInputUserSpecifiedSearch";
import CustomInput from "../../../components/UIElements/Input/CustomInput";
import DefaultLayout from "../../../components/layout/DefaultLayout";
import { Reunion } from "../../../types/reunion";
import { getAllReunions, listAllReunion } from "../../../services/Reunion/ReunionServices";

const Planification = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
    const [reunions, setReunions] = useState<Reunion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedReunions, setSelectedReunions] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    useEffect(() => {
        const fetchReunions = async () => {
            try {
                setLoading(true);
                const data = await listAllReunion();
                setReunions(data);
            } catch (error) {
                console.error("Erreur lors du chargement des réunions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReunions();
    }, []);

    const handleSelectAllReunions = () => {
        if (reunions) {
            if (selectedReunions.length < reunions.length) {
                setSelectedReunions([]);
                reunions.map((r) => setSelectedReunions((prev) => [...prev, r.id]));
                setIsAllSelected(true);
            } else {
                setSelectedReunions([]);
                setIsAllSelected(false);
            }
        }
    };

    const handleSelectReunion = (reunionId: string) => {
        setSelectedReunions((prev) => {
            if (prev.includes(reunionId)) {
                return prev.filter((id) => id !== reunionId);
            } else {
                return [...prev, reunionId];
            }
        });
    };

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
                            Créer un nouveau réunion
                        </button>
                    </div>

                    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                        <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full">
                                <CustomSelect
                                    label="Type reunion"
                                    data={["Réunion Transverse", "Réunion Projet"]}
                                    value=""
                                    onValueChange={() => { }}
                                />
                                <CustomInput
                                    type="date"
                                    value={""}
                                    label="Date début"
                                    rounded="medium"
                                />
                                <CustomInput
                                    type="date"
                                    value={""}
                                    label="Date de fin"
                                    rounded="medium"
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
                                        <button
                                            type="button"
                                            className="px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform"
                                        >
                                            Rechercher
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
                                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:green-600 focus:ring-inset ${activeTab === "all"
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
                                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-green-600 focus:ring-inset ${activeTab === "mine"
                                        ? "text-green-600 shadow bg-white dark:text-white dark:bg-green-600"
                                        : "hover:text-gray-800 focus:text-green-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                        }`}
                                    onClick={() => setActiveTab("mine")}
                                >
                                    Mes réunions
                                </button>
                            </nav>
                        </div>

                        {/* Bulk actions when items are selected */}
                        <div
                            className={`mt-2 border-primaryGreen border dark:border-formStrokedark bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
                                selectedReunions.length > 0
                                    ? "scale-y-100 opacity-100"
                                    : "scale-y-0 opacity-0"
                            }`}
                        >
                            <div>
                                {selectedReunions.length === 1
                                    ? "1 élément sélectionné"
                                    : `${selectedReunions.length} éléments sélectionnés`}
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        // Handle bulk actions here
                                    }}
                                    className="mb-1 mt-1 min-w-20 w-full text-sm py-2.5 px-3 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-lg text-left text-black"
                                >
                                    Actions
                                </button>
                            </div>
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
                                            <button
                                                onClick={handleSelectAllReunions}
                                                className="cursor-pointer border w-5 h-5"
                                            >
                                                <svg
                                                    width="18"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`${
                                                        selectedReunions.length === reunions.length
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
                                       reunions && reunions.length > 0 ? (
                                            reunions.map((reunion) => (
                                                <tr key={reunion.id} className="border-b hover:bg-gray-50 dark:hover:bg-boxdark2">
                                                    <td className="pl-2 border-b border-[#eee] dark:border-strokedark">
                                                        <button
                                                            className="cursor-pointer border w-5 h-5"
                                                            onClick={() => handleSelectReunion(reunion.id)}
                                                        >
                                                            <svg
                                                                width="18"
                                                                height="17"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className={`${
                                                                    selectedReunions.includes(reunion.id)
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
                                                        {new Date(reunion.dateDebut).toLocaleDateString()}
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        <p className="text-black text-justify dark:text-white font-bold">
                                                            {reunion.titre}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        {/* Organisateur */}
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        {/* Participants */}
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        <p
                                                            className={`font-semibold rounded-md text-center py-1 px-2 text-xs w-fit ${
                                                                reunion.etat === "Planifié"
                                                                    ? "bg-green-100 border text-green-600 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                                                    : reunion.etat === "Annulé"
                                                                    ? "bg-red-100 border text-red-600 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                                                    : "bg-gray-100 border text-gray-600 border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                                            }`}
                                                        >
                                                            {reunion.etat}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/aeromemo/reunion/${reunion.id}`)
                                                            }
                                                            className="text-primaryGreen hover:underline dark:text-darkgreen"
                                                        >
                                                            Voir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="text-center py-4 border-b border-[#eee] dark:border-strokedark">
                                                    Aucune réunion trouvée
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 border-b border-[#eee] dark:border-strokedark">
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