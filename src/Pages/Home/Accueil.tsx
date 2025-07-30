import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";


const Accueil = () => {
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
                    

                </div>
                {/* ============ FILTER END ============= */}
                {/* ============ CARD START ============= */}
                {/* ============ CARD END ============= */}
            </div>
       </DefaultLayout>
            
    );
};

export default Accueil;