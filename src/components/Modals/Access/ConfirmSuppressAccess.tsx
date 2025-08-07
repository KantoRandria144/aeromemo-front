import React,{ FormEvent, useRef } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { deleteHabilitation } from "../../../services/User/HabilitationService";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ConfirmSuppressAccess = ({
  setIsDeleteAccess,
  accessSelectedId,
  setIsDeleteFinished
}: {
  setIsDeleteAccess: Function;
  accessSelectedId: string[];
  setIsDeleteFinished: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const trigger = useRef<any>(null);

  const handleDeleteHabilitation = (e: FormEvent) => {
    e.preventDefault();
    try {
      deleteHabilitation(accessSelectedId).then(() => {
        notyf.success("Accès supprimer avec succès");
        setIsDeleteAccess(false);
        setIsDeleteFinished(true)
      });
    } catch (error) {
      console.log(`Unable to delete habilitations: ${error}`);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className="bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"
      >
        {/* ===== HEADER START ===== */}
        <form action="" onSubmit={handleDeleteHabilitation}>
          <header className="flex justify-between w-full  h-12">
            <div className="font-bold">Suppression d'accès</div>
            <div
              className="cursor-pointer"
              onClick={() => setIsDeleteAccess(false)}
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
          {/* ===== HEADER END ===== */}
          {/* ===== BODY START ===== */}
          <div>
            <p>Voulez vous vraiment supprimer cet accès ?</p>
          </div>
          {/* ===== BODY END ===== */}
          {/* ===== FOOTER START ===== */}
          <div>
            <button
              type="submit"
              className="w-full cursor-pointer mt-5 py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-redButton bg-redButton rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            >
              Supprimer
            </button>
          </div>
        </form>
        {/* ===== FOOTER END ===== */}
      </div>
    </div>
  );
};

export default ConfirmSuppressAccess;
