import { useEffect, useState } from "react";
// import { initializeSpaceRanking } from "../../services/Project";
import { IMyHabilitation } from "../../types/Habilitation";
import { PulseLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { actualiseUserData, getAllUserPaginated, getAllUsers } from "../../services/User/UserServices";
import DefaultLayout from "../../components/layout/DefaultLayout";
import TableUser from "../../components/Tables/TableUser";
import { getAllMyHabilitation } from "../../services/Function/UserFonctionService";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ManageUser = () => {
  const [userData, setUserData] = useState([]);
  const [onModification, setOnModification] = useState(false);
  const [loadingActualise, setLoadingActualise] = useState(false);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 5,
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState({
    nameOrMail: "",
    department: "",
    habilitation: "",
  });
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [loadingInitializeSpaceRanking, setLoadingInitializeSpaceRanking] =
    useState<boolean>(false);

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  const fetchUserPaginate = async () => {
    const users = await getAllUserPaginated(
      page?.pageNumber,
      page?.pageSize,
      search?.nameOrMail,
      search?.department,
      search?.habilitation
    );
    setUserData(users?.users);
    setTotalCount(users?.totalCount);
  };

  useEffect(() => {
    fetchUserPaginate();
    setIsSearchButtonClicked(false);
  }, [page, isSearchButtonClicked]);

  useEffect(() => {
    getHab();
  }, []);

  const fetchUser = async () => {
    const users = await getAllUsers();
    setUserData(users);
  };

  useEffect(() => {
    setTimeout(() => {
      handleModif();
    }, 300);
  }, [onModification]);

  const handleModif = () => {
    fetchUserPaginate();
  };

  const handleActualise = async () => {
    if (!myHabilitation?.admin?.actualizeUserData) {
      return;
    }
    setLoadingActualise(true);
    try {
      await actualiseUserData();
      fetchUser();
      notyf.success("Données actualiser");
    } catch (error) {
      console.error(`Error while actualise data: ${error}`);
    } finally {
      setLoadingActualise(false);
    }
  };
  // const handleInitializeSpaceRanking = async () => {
  //   setLoadingInitializeSpaceRanking(true);
  //   try {
  //     await initializeSpaceRanking();
  //     notyf.success("space ranking initialisé");
  //   } catch (error) {
  //     notyf.error("Une erreur s'est produite lors de l'initialisation");
  //   } finally {
  //     setLoadingInitializeSpaceRanking(false);
  //   }
  // };
  return (
    <DefaultLayout>
      <div className="mx-2 p-4 md:mx-10">
        <>
          {/* ACTUALIZE START */}
          <div
            className={`w-full space-x-2 mb-2 items-center `}
          >
            <button
              type="button"
              className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              onClick={handleActualise}
            >
              {loadingActualise ? (
                <div>
                  <PulseLoader size={5} className="mr-2" color={"#fff"} />
                </div>
              ) : (
                <></>
              )}
              Actualiser
            </button>
           {/* <button
              type="button"
              className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              // onClick={handleInitializeSpaceRanking}
            >
              {loadingInitializeSpaceRanking ? (
                <div>
                  <PulseLoader size={5} className="mr-2" color={"#fff"} />
                </div>
              ) : (
                <></>
              )}
              Initialize space ranking
            </button> */ }
          </div>
          {/* ACTUALIZE END */}
        </>
        <TableUser
          setIsSearchButtonClicked={setIsSearchButtonClicked}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          myHabilitation={myHabilitation}
          data={userData}
          setOnModification={setOnModification}
          onModification={onModification}
          totalCount={totalCount}
        />
      </div>
    </DefaultLayout>
  );
};

export default ManageUser;
