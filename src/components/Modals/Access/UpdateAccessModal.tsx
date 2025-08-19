import React, { useEffect, useRef, useState } from "react";

// import { v4 as uuid4 } from "uuid";

import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { updateHabilitation } from "../../../services/User/HabilitationService";
import CustomInput from "../../UIElements/Input/CustomInput";
import Checkbox from "../../UIElements/Select/CheckBox";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateAccessModal = ({
  setIsModalOpen,
  habilitationToModifData,
  setHabilitationToModifData,
  habilitationId,
  setIsUpdateFinished,
}: {
  habilitationToModifData: any;
  setIsModalOpen: Function;
  setHabilitationToModifData: Function;
  habilitationId: string;
  setIsUpdateFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [access, setAccess] = useState<string[]>([]);
  const trigger = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [labelError, setLabelError] = useState("");
  const [accessLabel, setAccessLabel] = useState(
    habilitationToModifData?.label ?? ""
  );

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
  const [reunionAccess, setReunionAccess] = useState({
    id:"",
    assign: 0,
    create: 0,
    update: 0,
    updateMySubordinatesReunion: 0,
    updateAllReunion: 0,
    delete: 0,
    deleteMySubordinatesReunion: 0,
    deleteAllReunion: 0,
    watchMyReunion: 0,
    watchMySubordinatesReunion: 0,
    watchAllReunion: 0,
    manage: 0,
    manageMySubordinatesReunion: 0,
  });

  useEffect(() => {
    console.log(habilitationToModifData);
  }, [habilitationToModifData]);

  useEffect(() => {
    if (habilitationToModifData) {
      setAccessLabel(habilitationToModifData?.label);
      setAdminAccess({
        ...adminAccess,
        modifyHierarchy:
          habilitationToModifData?.habilitationAdmins?.[0]?.modifyHierarchy,
        createHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.createHabilitation,
        updateHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.updateHabilitation,
        deleteHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.deleteHabilitation,
        restoreHierarchy:
          habilitationToModifData?.habilitationAdmins?.[0]?.restoreHierarchy,
        actualizeUserData:
          habilitationToModifData?.habilitationAdmins?.[0]?.actualizeUserData,
        assignAccess:
          habilitationToModifData?.habilitationAdmins?.[0]?.assignAccess,
        watchAllActivity:
          habilitationToModifData?.habilitationAdmins?.[0]?.watchAllActivity,
      });
      setReunionAccess({
        ...reunionAccess,
        assign : habilitationToModifData?.habilitationReunion?.[0]?.assign,
        create : habilitationToModifData?.habilitationReunion?.[0]?.create,
        update : habilitationToModifData?.habilitationReunion?.[0]?.update,
        updateMySubordinatesReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.updateMySubordinatesReunion,
        updateAllReunion : 
          habilitationToModifData?.habilitationReunion?.[0]?.updateAllReunion,
        delete: habilitationToModifData?.habilitationReunion?.[0]?.delete,
        deleteMySubordinatesReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.deleteMySubordinatesReunion,
        deleteAllReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.deleteAllReunion,
        watchMyReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.watchMyReunion,
        watchMySubordinatesReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.watchMySubordinatesReunion,
        watchAllReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.watchAllReunion,
        manage : habilitationToModifData?.habilitationReunion?.[0]?.manage,
        manageMySubordinatesReunion : 
          habilitationToModifData?.habilitationReunion?.[0]
          ?.manageMySubordinatesReunion,
      })
    }
  }, [habilitationToModifData]);

  const handleModif = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setLabelError("");
    // const id = uuid4();
    if (accessLabel.trim() === "") {
      setLabelError("Veuiller remplir ce champ");
      setIsLoading(false);
      return;
    }

    const habilitationData = {
      label: accessLabel.trim(),
      habilitationAdmins: [{ ...adminAccess }],
      habilitationReunions: [{...reunionAccess}],
    };
    console.log(habilitationData);

    try {
      await updateHabilitation(habilitationData, habilitationId);
      notyf.success("Modification réuissie");
      setIsUpdateFinished(true);
    } catch (error) {
      console.error(`error at impl create habilitation: ${error}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setHabilitationToModifData([]);
    }
    return;
  };

  const handleCheckBoxChange = (
    category: string,
    key: string,
    value: number
  ) => {
    // const value = isChe
    switch (category) {
      case "admin":
        setAdminAccess((prev) => ({ ...prev, [key]: value }));
        break;
      case "reunion":
        setReunionAccess((prev) => ({ ...prev, [key]: value}));
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
          "bg-white dark:bg-[#24303F] max-h-[80%] overflow-auto hide-scrollbar rounded-md w-11/12 md:w-1/3 "
        }
      >
        {/* =====HEADER START===== */}
        <header
          className={
            "fixed flex rounded-t-md shadow-md z-99 bg-white dark:bg-[#24303F] w-11/12 md:w-1/3 justify-between  p-2 h-12"
          }
        >
          <div className={"font-bold text-center text-base w-full"}>
            Modifier ce rôle
          </div>
          <div
            className={"cursor-pointer"}
            onClick={() => {
              setIsModalOpen(false);
              setHabilitationToModifData([]);
            }}
          >
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
              value={accessLabel ?? ""}
              onChange={(e) => {
                setAccessLabel(e.target.value);
                setLabelError("");
              }}
              error={labelError}
            />
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Admin
              </label>
              <div className="pl-3 space-y-1">
                <Checkbox
                  label="Modifier la hiérarchie"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.modifyHierarchy
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "modifyHierarchy", 1)
                      : handleCheckBoxChange("admin", "modifyHierarchy", 0)
                  }
                />
                <Checkbox
                  label="Créer un nouvel accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.createHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "createHabilitation", 1)
                      : handleCheckBoxChange("admin", "createHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Modifier un accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.updateHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "updateHabilitation", 1)
                      : handleCheckBoxChange("admin", "updateHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Supprimer un accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.deleteHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "deleteHabilitation", 1)
                      : handleCheckBoxChange("admin", "deleteHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Restaurer la hiérarchie à la valeur d'Active directory"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.restoreHierarchy
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "restoreHierarchy", 1)
                      : handleCheckBoxChange("admin", "restoreHierarchy", 0)
                  }
                />
                <Checkbox
                  label="Actualiser les valeurs des utilisateurs"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.actualizeUserData
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "actualizeUserData", 1)
                      : handleCheckBoxChange("admin", "actualizeUserData", 0)
                  }
                />
                <Checkbox
                  label="Assigner des accès aux utilisateurs"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.assignAccess
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "assignAccess", 1)
                      : handleCheckBoxChange("admin", "assignAccess", 0)
                  }
                />
              </div>
            </div>
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Réunion
              </label>
              <div className="pl-3 space-y-1">
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.watchMyReunion
                  }
                  label="Voir mes réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "watchMyReunion", 1)
                      : handleCheckBoxChange("reunion", "watchMyReunion", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.watchMySubordinatesReunion
                  }
                  label="Voir les réunions de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "reunion",
                          "watchMySubordinatesReunion",
                          1
                        )
                      : handleCheckBoxChange(
                          "reunion",
                          "watchMySubordinatesReunion",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.watchAllReunion
                  }
                  label="Voir tous les réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "watchAllReunion", 1)
                      : handleCheckBoxChange("reunion", "watchAllReunion", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]?.create
                  }
                  label="Créer un nouveau réunion"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "create", 1)
                      : handleCheckBoxChange("reunion", "create", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]?.update
                  }
                  label="Modifier mes réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "update", 1)
                      : handleCheckBoxChange("reunion", "update", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.updateMySubordinatesReunion
                  }
                  label="Modifier les réunions de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "reunion",
                          "updateMySubordinatesReunion",
                          1
                        )
                      : handleCheckBoxChange(
                          "reunion",
                          "updateMySubordinatesReunion",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.updateAllReunion
                  }
                  label="Modifier tous les réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "updateAllReunion", 1)
                      : handleCheckBoxChange("reunion", "updateAllReunion", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]?.manage
                  }
                  label="Gérer mes projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "manage", 1)
                      : handleCheckBoxChange("reunion", "manage", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.manageMySubordinatesReunion
                  }
                  label="Gérer les réunions de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "reunion",
                          "manageMySubordinatesReunion",
                          1
                        )
                      : handleCheckBoxChange(
                          "reunion",
                          "manageMySubordinatesReunion",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]?.delete
                  }
                  label="Archiver mes réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "delete", 1)
                      : handleCheckBoxChange("reunion", "delete", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.deleteMySubordinatesReunion
                  }
                  label="Archiver les réunions de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "reunion",
                          "deleteMySubordinatesReunion",
                          1
                        )
                      : handleCheckBoxChange(
                          "reunion",
                          "deleteMySubordinatesReunion",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]
                      ?.deleteAllReunion
                  }
                  label="Archiver tous les réunions"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "deleteAllReunion", 1)
                      : handleCheckBoxChange("reunion", "deleteAllReunion", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationReunion?.[0]?.assign
                  }
                  label="Assigner un reunion"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("reunion", "assign", 1)
                      : handleCheckBoxChange("reunion", "assign", 0)
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer py-2 flex justify-center items-center text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
            >
              {isLoading ? <BeatLoader size={8} color={"#fff"} /> : null}
              Enregistrer les modifications
            </button>
          </form>
        </div>
        {/* ===== BODY START ===== */}
      </div>
    </div>
  );
};

export default UpdateAccessModal;
