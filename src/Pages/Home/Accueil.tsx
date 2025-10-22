import { useCallback, useEffect, useState } from "react";
import MeetingCard from "../../components/card/MeetingCard";
import MeetingsList from "../../components/card/MeetingsList";
import MeetingTimeCard from "../../components/card/MeetingTimeCard";
import BarChart from "../../components/chart/BarChart";
import PieChart from "../../components/chart/PieChart";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { decodeToken } from "../../services/Function/TokenService";
import { getMySubordinatesNameAndId } from "../../services/User/UserServices";
import CustomInputUserSpecifiedSearch from "../../components/UIElements/Input/CustomInputUserSpecifiedSearch";
import { getMonthlyReunionTime, getMyReunions, MonthlyReunionTime } from "../../services/Reunion/ReunionServices";

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
const TYPE_REUNION_OPTIONS = [
  { value: 1, label: "Transverse" },
  { value: 2, label: "Projet" },
];


const Accueil = () => {
  const [chartData, setChartData] = useState<{ name: string; data: number[] }[]>([]);
  const [search, setSearch] = useState({
    ids: [] as string[],
    typeReunion: undefined as number | undefined,
    collaborateur: undefined as string | undefined,
    dateDebut: undefined as string | undefined,
    dateFin: undefined as string | undefined,
  });

  const [selectedUserInput, setSelectedUserInput] = useState<TSubordinate[]>([]);
  const [subordinates, setSubordinates] = useState<TSubordinate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [monthlyReunionData, setMonthlyReunionData] = useState<MonthlyReunionTime[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("_au_pr");
        if (!token) return;

        const decoded = decodeToken("pr");
        if (!decoded?.jti) return;

        const myId = decoded.jti;
        const subData: TSubordinate[] = await getMySubordinatesNameAndId(myId);

        const me: TSubordinate = {
          id: decoded.jti,
          name: decoded.name || "Me",
          email: decoded.sub || "",
        };

        const allUsers = [...subData, me];
        setSubordinates(allUsers);

        const allUserIds = allUsers.map((user) => user.id);
        setSearch((prev) => ({ ...prev, ids: allUserIds }));
        await fetchMonthlyReunionData(allUserIds);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    if (!isInitialized) initializeComponent();
  }, [isInitialized]);

  const fetchMonthlyReunionData = async (userIds: string[]) => {
    setIsChartLoading(true);
    try {
      const data = await getMonthlyReunionTime(userIds);
      setMonthlyReunionData(data);
    } catch (error) {
      console.error("Erreur lors du chargement des données de réunion:", error);
    } finally {
      setIsChartLoading(false);
    }
  };

  const handleRemoveUserSelectedInput = useCallback(
    (userId: string) => {
      const updatedUsers = selectedUserInput.filter((user) => user.id !== userId);
      setSelectedUserInput(updatedUsers);

      const userIds =
        updatedUsers.length > 0
          ? updatedUsers.map((user) => user.id)
          : subordinates.map((user) => user.id);
    },
    [selectedUserInput, subordinates]
  );

  // const handleResetFilters = useCallback(() => {
  //   const allUserIds = subordinates.map((user) => user.id);

  //   setSelectedUserInput([]);
  //   setSearch({
  //     ids: allUserIds,
  //     dateDebut: undefined,
  //     dateFin: undefined,
  //   });
  // }, [subordinates]);

const handleSearch = useCallback(async () => {
  const userIds =
    selectedUserInput.length > 0
      ? selectedUserInput.map((user) => user.id)
      : subordinates.map((user) => user.id);

  if (userIds.length === 0) return;

  try {
    const reunions = await getMyReunions(userIds[0], {
      typeReunion: search.typeReunion ? Number(search.typeReunion) : undefined,
      collaborateur: search.collaborateur,
      dateDebutMin: search.dateDebut,
      dateDebutMax: search.dateFin,
    });

    console.log("Résultat filtré :", reunions);
  } catch (error) {
    console.error("Erreur recherche :", error);
  }
}, [search, selectedUserInput, subordinates]);


  const formatChartData = () => {
    if (monthlyReunionData.length === 0) {
      return {
        labels: ["Aucune donnée"],
        data: [0],
        maxY: 1
      };
    }

    const labels = monthlyReunionData.map(item => {
      const [year, month] = item.month.split('-');
      const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    const data = monthlyReunionData.map(item => item.totalHours);
    
    // Trouver la valeur maximale pour l'axe Y (arrondie à l'entier supérieur)
    const maxY = Math.ceil(Math.max(...data, 0));

    return { labels, data, maxY };
  };

  const chartConfig = formatChartData();

  const availableSubordinates = subordinates.filter(
    (sub) => !selectedUserInput.some((selected) => selected.id === sub.id)
  );

  

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
  <label className="mb-1 text-sm font-medium">Type de réunion</label>
  <select
    className="w-full text-sm py-2 px-2 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-md bg-transparent text-left whitespace-nowrap overflow-hidden text-ellipsis"
    value={search.typeReunion ?? ""}
    onChange={(e) =>
      setSearch((prev) => ({
        ...prev,
        typeReunion: e.target.value ? Number(e.target.value) : undefined,
      }))
    }
  >
    <option value="">Tous</option>
    {TYPE_REUNION_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
</div>


<CustomInput
  type="text"
  placeholder="Nom collaborateur"
  label="Collaborateur"
  rounded="medium"
  value={search.collaborateur ?? ""}
  onChange={(e) => setSearch((prev) => ({ ...prev, collaborateur: e.target.value }))}
/>

<CustomInput
  type="date"
  label="Du"
  rounded="medium"
  value={search.dateDebut ?? ""}
  onChange={(e) => setSearch((prev) => ({ ...prev, dateDebut: e.target.value }))}
/>

<CustomInput
  type="date"
  label="Au"
  rounded="medium"
  value={search.dateFin ?? ""}
  onChange={(e) => setSearch((prev) => ({ ...prev, dateFin: e.target.value }))}
/>


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
              <button className="px-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform disabled:opacity-50 disabled:cursor-not-allowed">
                Rechercher
              </button>
            </div>
          </div>
        </div>
        {/* ============ FILTER END ============= */}

        {/* ============ SECTION MEETINGS + CARDS START ============= */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche : Mes réunions du mois */}
            <div>
              <MeetingsList/>
            </div>

            {/* Colonne centrale : Réunions de la journée */}
            <div>
            <MeetingCard
              filters={{
                typeReunion: search.typeReunion,
                collaborateur: search.collaborateur,
                dateDebutMin: search.dateDebut,
                dateDebutMax: search.dateFin,
              }}
            />

            </div>

            {/* Colonne droite : 3 cards verticalement */}
            <div className="flex flex-col gap-6">
              <MeetingTimeCard title="Temps passé en réunion" value="4 h" period="Aujourd'hui" colorScheme="green" icon="users" />
              <MeetingTimeCard title="CR réunion général" value="40 %" period="Juin" colorScheme="cyan" icon="trending-up" />
              <MeetingTimeCard title="Taux de participation" value="85 %" period="Cette semaine" colorScheme="blue" icon="target" />
            </div>
          </div>
        </div>
        {/* ============ SECTION MEETINGS + CARDS END ============= */}

        {/* ============ CHARTS START ========== */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Temps passé en réunion</h3>
            <BarChart 
              labels={chartConfig.labels} 
              data={chartConfig.data} 
              maxY={chartConfig.maxY} 
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Département utilisant la salle</h3>
            <div className="flex items-center justify-center">
              <PieChart
                labels={["DSI", "DT", "DAF", "DRH"]}
                data={[35.7, 16.1, 33.7, 14.5]}
                colors={["#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"]}
                legendPosition="right"
              />
            </div>
          </div>
        </div> */}
        {/* ============ CHARTS END ========== */}
      </div>
    </DefaultLayout>
  );
};

export default Accueil;
