import { useRef } from "react";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { assignHabilitations } from "../../services/User/UserServices";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ConfirmDeleteHabilitationuser = ({
  setUserDelete,
  userSelected,
}: {
  setUserDelete: Function;
  userSelected: string[];
}) => {
  const trigger = useRef<any>(null);

  const handleDelete = async () => {
    try {
      await assignHabilitations({ userIds: userSelected, habilitationIds: [] });
      notyf.success("Suppression des habilitations réussi");
    } catch (error) {
      notyf.error("Un problème est survenu lors de la suppression");
      notyf.error("Veuillez reessayer plus tard");
      console.error(`Error while delete user habilitation`);
    } finally {
      setUserDelete(false);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={"bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"}
      >
        {/* =====HEADER START===== */}
        <header className={"flex justify-between w-full  h-12"}>
          <div className={"font-bold"}>
            Supprimer les accès{" "}
            {userSelected.length > 1
              ? `des ${userSelected.length} utilisateurs`
              : ``}
          </div>
          <div
            className={"cursor-pointer"}
            onClick={() => setUserDelete(false)}
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
        {/* =====BODY START===== */}
        <div>
          <p>
            Voulez vous vraiment supprimer les accès de{" "}
            {userSelected.length > 1
              ? `ces ${userSelected.length} utilisateurs ?`
              : `cet utilisateur`}{" "}
          </p>
        </div>
        {/* =====BODY END===== */}
        {/* =====FOOTER END===== */}
        <div>
          <button
            onClick={handleDelete}
            className="w-full cursor-pointer mt-4 py-2 px-10 text-sm text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-redButton bg-redButton rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
          >
            Supprimer
          </button>
        </div>
        {/* =====FOOTER END===== */}
      </div>
    </div>
  );
};

export default ConfirmDeleteHabilitationuser;
