import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/CustomInput";

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
                                value={""}
                                label="Type"
                                rounded="medium"
                            />

                            
                        </div> 

                    </div>
                </div>
                {/* ============ FILTER END ============= */}
            </div>
       </DefaultLayout>
            
    );
};

export default Accueil;