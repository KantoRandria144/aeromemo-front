import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import LDAPLayout from "../../../components/layout/LDAPLayout";
import CustomSelect from "../../../components/UIElements/Select/CustomSelect";
import CustomInputUserSpecifiedSearch from "../../../components/UIElements/Input/CustomInputUserSpecifiedSearch";
import CustomInput from "../../../components/UIElements/Input/CustomInput";

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
    return (
        <>
        <LDAPLayout>
           <div className="mx-2 py-4 md:mx-10 ">
        <>
          <div className="flex flex-col md:flex-row">
            <Breadcrumb
              paths={[{ name: "Liste des Projets", to: "/gmp/project/list" }]}
            />

            {/* ===== ADD PROJECT START =====*/}
            <div
              className={`w-full mb-2  justify-end   items-center`}
            >
              <button
                onClick={() => navigate("/gmp/project/add")}
                className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
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
            {/* ===== ADD PROJECT END =====*/}
          </div>

         <div className="bg-white  min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
            {/* ===== FILTER START ===== */}
                <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
                    <div
                    
                    className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full"
                    >
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
                    </div>
                </div>  
            {/* ===== FILTER END ===== */}
         </div>
         
        </>
      </div>
            {/* <div className="flex justify-center">
    <nav
        className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
        <button role="tab" type="button"
            className="flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset text-yellow-600 shadow bg-white dark:text-white dark:bg-yellow-600"
            >
            Addresses
        </button>

        <button role="tab" type="button"
            className="flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset hover:text-gray-800 focus:text-yellow-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400">
            Payments
        </button>
    </nav>
</div> */}
</LDAPLayout>
        </>
    );
};

export default Planification;