import { useEffect, useState } from "react";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getAllHabilitation, getHabilitationById } from "../../services/User/HabilitationService";
import { getAllMyHabilitation } from "../../services/Function/UserFonctionService";
import { IMyHabilitation } from "../../types/Habilitation";
import TableAccess from "../../components/Tables/TableAccess";

const ManageAccess = () => {
      const [isAddModalAccessVisible, setIsModalAccessVisible] = useState(false);
  const [isAddModalModifAccessVisible, setIsModalModifAccessVisible] =
    useState(false);
  const [habilitationData, setHabilitationData] = useState([]);
  const [habilitationToModifData, setHabilitationToModifData] = useState([]);
  const [isDeleteAccess, setIsDeleteAccess] = useState(false);
  const [accessSelectedId, setAccessSelectedId] = useState([]);
  const [isAddFinished, setIsAddFinished] = useState<boolean>(false);
  const [isDeleteFinished, setIsDeleteFinished] = useState<boolean>(false);
  const [isUpdateFinished, setIsUpdateFinished] = useState<boolean>(false);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getHab();
  }, []);

  const fetchHabilitationById = async () => {
    if (accessSelectedId.length > 0) {
      const habilitation = await getHabilitationById(accessSelectedId?.[0]);
      setHabilitationToModifData(habilitation);
    }
  };

  useEffect(() => {
    if (isAddModalModifAccessVisible) {
      fetchHabilitationById();
    }
  }, [isAddModalModifAccessVisible, accessSelectedId]);

  // fetch all habilitations
  const fetchHabilitation = async () => {
    const habilitation = await getAllHabilitation();
    setHabilitationData(habilitation);
  };
  useEffect(() => {
    fetchHabilitation();
    setIsAddFinished(false);
    setIsDeleteFinished(false);
    setIsUpdateFinished(false);
  }, [isAddFinished, isDeleteFinished, isUpdateFinished]);

  useEffect(() => {
    handleChange();
  }, [isAddModalAccessVisible]);

  const handleChange = () => {
    fetchHabilitation();
  };
    return (
        <>
        <DefaultLayout>
           <div className="mx-2 p-4 md:mx-10">
        {/* ===== ADD ACCESS START ===== */}
        <div
          className={`w-full mb-2  justify-end items-center ${
            myHabilitation?.admin?.createHabilitation ? "flex" : "hidden"
          }`}
        >
          <button
            onClick={() => {
              if (myHabilitation?.admin?.createHabilitation) {
                setIsModalAccessVisible(true);
              }
            }}
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
            Ajouter un rôle
          </button>
        </div>
        {/* ===== ADD ACCESS END ===== */}
        <TableAccess
          myHabilitation={myHabilitation}
          data={habilitationData}
          setIsDeleteAccess={setIsDeleteAccess}
          setAccessSelectedId={setAccessSelectedId}
          setIsModalModifAccessVisible={setIsModalModifAccessVisible}
        />
        {/* ===== MODAL ADD ACCESS START ===== */}
        {isAddModalAccessVisible && (
          <AddAccessModal
            // accessAdd={isAddModalAccessVisible}
            setAccessAdd={setIsModalAccessVisible}
            setIsAddFinished={setIsAddFinished}
          />
        )}
        {/* ===== MODAL ADD ACCESS END ===== */}
        {/* ===== MODAL UPDATE ACCESS END ===== */}
        {isAddModalModifAccessVisible && (
          <UpdateAccessModal
            setIsModalOpen={setIsModalModifAccessVisible}
            setHabilitationToModifData={setHabilitationToModifData}
            habilitationToModifData={habilitationToModifData}
            habilitationId={accessSelectedId?.[0]}
            setIsUpdateFinished={setIsUpdateFinished}
          />
        )}
        {/* ===== MODAL UPDATE ACCESS END ===== */}
        {/* ===== MODAL CONFIRM DELETE ACCESS START ===== */}
        {isDeleteAccess && (
          <ConfirmSuppressAccess
            setIsDeleteFinished={setIsDeleteFinished}
            setIsDeleteAccess={setIsDeleteAccess}
            accessSelectedId={accessSelectedId}
          />
        )}
        {/* ===== MODAL CONFIRM DELETE ACCESS END ===== */}
      </div>
        </DefaultLayout>
        </>
    );
}

export default ManageAccess;