import { useEffect, useState } from "react";
import MeetingCard from "../../components/card/MeetingCard";
import MeetingsList from "../../components/card/MeetingsList";
import MeetingTimeCard from "../../components/card/MeetingTimeCard";
import BarChart from "../../components/chart/BarChart";
import PieChart from "../../components/chart/PieChart";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { decodeToken } from "../../services/Function/TokenService";
import { getMySubordinatesNameAndId } from "../../services/User/UserServices";


type TSubordinate = {
    id: string;
    name: string;
    email: string;
};

type Reunion = {
    id: string;
    title: string;
    dateDebut: string;
    dateFin: string;
};

const Accueil = () => {
const [chartData, setChartData] = useState<{ name: string; data: number[]}[]>([]);

const [search, setSearch] = useState({
    ids: [] as string [],
    dateDebut: undefined as string | undefined ,
    dateFin: undefined as string | undefined,
});

const [selectedUserInput, setSelectUserInput] = useState<TSubordinate[]>([]);

const [subordinates, setSuborinates] = useState<TSubordinate[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isInitialized, setIsInitialized] = useState(false);

const categories = ["Projets", "Transverses"];

useEffect(() => {
    const initializeComponent = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("_au_pr");
            if(!token) {
                console.error("No token found");
                return;
            }

            const decoded = decodeToken("pr")

            if(!decoded?.jti) {
                console.error("Invalid token: no JTI found");
                return;
            }

            const myId = decoded.jti;
            const subData: TSubordinate[] = await getMySubordinatesNameAndId(myId);

            const me: TSubordinate = {
                id: decoded.jti,
                name: decoded.name || "Me",
                email: decoded.sub || "",
            };
        }
    }
})
    return (
       <DefaultLayout>
            <div className="mx-2 py-4 md:mx-10 space-y-10"> 
                {/* =========== TITLE START ============ */}
                <div className="mb-2">
                    <h1 className="font-semibold text-lg">Dashboard</h1>
                    <p className="text-sm text-zinc-600">Bonjour, Bienvenue sur AeroMemo</p>
                </div>
                {/* =========== TITLE END ============ */}
                {/* ============ FILTER START =========== */}
                <div className="filter-section">
                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-5">
                        <div>
                            <CustomInput 
                                type="text"
                                placeholder="Tous"
                                value={""}
                                label="Type de réunion"
                                rounded="medium"
                            />
                        </div> 
                        {/* ======seul le manager ====== */}
                        <CustomInput
                            type="text"
                            value={""}
                            placeholder="Nom"
                            label="Collaborateur"
                            rounded="medium"
                        />
                        {/* ======seul le manager ====== */}
                        <CustomInput
                            type="date"
                            value={""}
                            label="Du"
                            rounded="medium"
                        />
                        <CustomInput
                            type="date"
                            value={""}
                            label="Au"
                            rounded="medium"
                        />

                        {/* ========= DELETE FILTER START ============ */}
                        <div className="flex items-end gap-2 mb-0.5">
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
                        {/* ========= DELETE FILTER END ============ */}
                        {/* ========= SEARCH FILTER START ============ */}
                        <button className="px-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform disabled:opacity-50 disabled:cursor-not-allowed">
                            Rechercher
                        </button>
                        {/* ========= SEARCH FILTER END ============ */}
                        </div>      
                    </div>
                    
                {/* ======== CARDs  START ========= */}
                    
                {/* ======== CARDs  END ========= */}
                </div>
                {/* ============ FILTER END ============= */}
                {/* ============ CARD START ============= */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <MeetingCard 
                            title="Réunions de la journée"
                            meetings={[
                            {
                                dateDebut: "08:30",
                                dateFin: "09:30",
                                emplacement: "Salle A1",
                                title: "Bâtiment Principal"
                            },
                            {
                                dateDebut: "14:00",
                                dateFin: "16:00",
                                emplacement: "Salle B2"
                            }
                            ]}
                        />    
                         <MeetingTimeCard 
                            title="Temps passée en réunion"
                            value="4 h"
                            period="Aujourd'hui"
                            colorScheme="green"
                            icon="users"
                        />
                        <MeetingTimeCard 
                            title="CR réunion généra"
                            value="40 %"
                            period="Juin"
                            colorScheme="cyan"
                            icon="trending-up"
                        />
                        <MeetingTimeCard 
                            title="Taux de participation"
                            value="85 %"
                            period="Cette semaine"
                            colorScheme="blue"
                            icon="target"
                        />
                    </div>
                {/* ============ CARD END ============= */}
                {/* ============ CHART START ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Temps passée en réunion</h3>
                        <BarChart
                            labels={["04 Juin", "17 Juin", "22 Juin", "24 Juin"]}
                            data={[2.5, 4, 2.5, 2.5]}
                            maxY={5}
                        />
                    </div>
                    <MeetingsList 
                        meetings={
                            [
                                {
                                    title: "Réunion Transverse",
                                    dateDebut: "24 Juin",
                                    heureDebut: "9h" ,
                                    heureFin: "10h",
                                    role: "Organisateur" as const,
                                },
                                {
                                    title: "Réunion Transverse",
                                    dateDebut: "27 Juin",
                                    heureDebut: "8h",
                                    heureFin:"10h",
                                    role: "Organisateur" as const,
                                },
                                {
                                    title: "Réunion Projet",
                                    dateDebut: "27 Juin",
                                    heureDebut: "14h",
                                    heureFin:"16h",
                                    role: "Participant" as const,
                                },
                                {
                                    title: "Réunion Transverse",
                                    dateDebut: "30 Juin",
                                    heureDebut: "9h",
                                    heureFin:"10h",
                                    role: "Participant" as const,
                                },
                            ]
                        }
                    />
                </div>
                {/* ============ BAR CHART END ============ */}
                {/* ++++++++++++ PIE CHART START ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 w-427 h-427">Département utilisant la salle</h3>
                        <div className="flex items-center justify-center">
                            <PieChart
                                labels={["DSI", "DT", "DAF", "DRH"]}
                                data={[35.7, 16.1, 33.7, 14.5]}
                                colors={["#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"]}
                                legendPosition="right"
                            />
                        </div>
                    </div>
                </div>
                {/* ============ PIE CHART END ============ */}

            </div>
       </DefaultLayout>
            
    );
};

export default Accueil;