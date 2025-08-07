import React, { useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import CustomInput from "../../UIElements/Input/CustomInput";
import Checkbox from "../../UIElements/Select/CheckBox";
import { createHabilitation } from "../../../services/User/HabilitationService";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddAccessModal = ({
  setAccessAdd,
  setIsAddFinished,
}: {
  setAccessAdd: Function;
  setIsAddFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [access, setAccess] = useState<string[]>([]);
  const trigger = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [labelError, setLabelError] = useState("");
  const [accessLabel, setAccessLabel] = useState("");
  const [adminAccess, setAdminAccess] = useState({
    id: "",
    modifyHierarchy: 0,
    createHabilitation: 0,
    updateHabilitation: 0,
    deleteHabilitation: 0,
    restoreHierarchy: 0,
    actualizeUserData: 0,
    assignAccess: 0,
    watchAllActivity: 0,
  });
 
  const handleModif = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setLabelError("");
    const id = uuid4();
    if (accessLabel.trim() === "") {
      setLabelError("Veuiller remplir ce champ");
      return;
    }
    const adminId = uuid4();
    const habilitationData = {
      id,
      label: accessLabel.trim(),
      habilitationAdmins: [{ ...adminAccess, id: adminId }],
    };

    try {
      createHabilitation(habilitationData);
      setIsAddFinished(true);
      notyf.success("Accès créé avec succès !");
    } catch (error) {
      notyf.error(
        "Erreur lors de la création de l'accès. Veuillez reessayer plus tard."
      );
      console.error(`Error at impl create habilitation: ${error}`);
    } finally {
      setIsLoading(false);
      setAccessAdd(false);
    }
    return;
  };

  const handleCheckBoxChange = (
    category: string,
    key: string,
    value: number
  ) => {
    switch (category) {
      case "admin":
        setAdminAccess((prev) => ({ ...prev, [key]: value }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed text-sm inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={
          "bg-white dark:bg-[#24303F] max-h-[80%] overflow-auto    rounded-md w-11/12 md:w-1/3 "
        }
      >
        {/* =====HEADER START===== */}
        <header
          className={
            "fixed flex rounded-t-md shadow-md z-99 bg-white dark:bg-[#24303F] w-11/12 md:w-1/3 justify-between  p-2 h-12"
          }
        >
          <div className={"font-bold text-center text-base w-full "}>
            Ajouter un nouveau rôle
          </div>
          <div className={"cursor-pointer"} onClick={() => setAccessAdd(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </header>
        {/* =====HEADER END===== */}
        {/* ===== BODY START ===== */}
        <div className="p-5 mt-10">
          <form onSubmit={handleModif}>
            <CustomInput
              required
              label="Nom de l'accès"
              type="text"
              rounded="medium"
              className="mb-2"
              value={accessLabel}
              onChange={(e) => {
                setAccessLabel(e.target.value);
                setLabelError("");
              }}
              error={labelError}
            />
            <div className="mb-4 pb-2 border-b-2  border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Admin
              </label>
              <div className="pl-3 space-y-1">
                <Checkbox
                  label="Modifier la hiérarchie"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "modifyHierarchy", 1)
                      : handleCheckBoxChange("admin", "modifyHierarchy", 0)
                  }
                />
                <Checkbox
                  label="Créer un nouvel accès"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "createHabilitation", 1)
                      : handleCheckBoxChange("admin", "createHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Modifier un accès"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "updateHabilitation", 1)
                      : handleCheckBoxChange("admin", "updateHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Supprimer un accès"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "deleteHabilitation", 1)
                      : handleCheckBoxChange("admin", "deleteHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Restaurer la hiérarchie à la valeur d'Active directory"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "restoreHierarchy", 1)
                      : handleCheckBoxChange("admin", "restoreHierarchy", 0)
                  }
                />
                <Checkbox
                  label="Actualiser les valeurs des utilisateurs"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "actualizeUserData", 1)
                      : handleCheckBoxChange("admin", "actualizeUserData", 0)
                  }
                />
                <Checkbox
                  label="Assigner des accès aux utilisateurs"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "assignAccess", 1)
                      : handleCheckBoxChange("admin", "assignAccess", 0)
                  }
                />
              </div>
            </div>
            

            <button
              type="submit"
              className="w-full cursor-pointer  py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            >
              {isLoading ? (
                <BeatLoader size={8} className="mr-2" color={"#fff"} />
              ) : null}
              Ajouter
            </button>
          </form>
        </div>
        {/* ===== BODY START ===== */}
      </div>
    </div>
  );
};

export default AddAccessModal;
