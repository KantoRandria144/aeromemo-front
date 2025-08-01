import { useEffect, useState } from "react";
import { UserInterface } from "../../types/user";

const BodyHierarchy = ({
  userData,
  setUserToModify,
  setIsModifyHierarchyOpen,
}: {
  userData: Array<any>;
  setUserToModify: Function;
  setIsModifyHierarchyOpen: Function;
}) => {
  const [superior, setSuperior] = useState<Array<UserInterface>>([]);
  const [underline, setUnderline] = useState<Array<UserInterface>>([]);
  const [userSelected, setUserSelected] = useState<UserInterface | null>(null);

  useEffect(() => {
    userData?.forEach((user) => {
      if (user.poste === "Directeur Général" && user.name.includes("Daniel")) {
        if (!superior?.find((sup) => sup?.id === user?.id)) {
          setSuperior([...superior, user]);
          setUserSelected(user);
        }
      }
    });
  }, [userData]);

  useEffect(() => {
    const underlines = userData?.filter(
      (user) => user?.superiorId === userSelected?.id
    );
    setUnderline(underlines);
  }, [superior]);

  useEffect(() => {
    if (userSelected) {
      let newSuperiors = [];

      // Ajoute la personne sélectionnée au début de l'array
      newSuperiors.push(userSelected);

      let currentUser = userSelected;

      // Ajoute les supérieurs successifs jusqu'à la personne sans supérieur
      while (currentUser?.superiorId) {
        const nextSuperior = userData?.find(
          (user) => user.id === currentUser.superiorId
        );
        if (
          nextSuperior &&
          !newSuperiors.some((sup) => sup.id === nextSuperior.id)
        ) {
          newSuperiors.push(nextSuperior);
          currentUser = nextSuperior;
        } else {
          break;
        }
      }

      // Ajoute le directeur général à la fin de l'array
      const director = superior.find(
        (user) =>
          user.poste === "Directeur Général" && user.name.includes("Daniel")
      );
      if (director && !newSuperiors.some((sup) => sup.id === director.id)) {
        newSuperiors.push(director);
      }

      const reversedSuperior = newSuperiors.reverse();
      setSuperior(reversedSuperior);
    }
  }, [userSelected]);
  return (
    <div className=" mt-4 flex flex-col justify-center gap-2 items-center">
      {/* ===== DIRECTOR START ===== */}
      <div className="flex flex-col gap-2 ">
        {superior?.map((sup) => (
          <div
            key={sup?.id}
            className="border flex justify-between items-center  border-neutral-200 min-w-80"
          >
            <div
              className="flex flex-col  w-full p-4  cursor-pointer "
              onClick={() => {
                setUserSelected(sup);
              }}
            >
              <span className="text-start">{sup?.name}</span>
              <span className="text-xs text-start text-slate-500">
                {sup?.poste}
              </span>
            </div>
            <button
              className=" h-full p-2 "
              onClick={() => {
                setUserToModify(sup);
                setIsModifyHierarchyOpen(true);
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="#006171"
                    fillRule="evenodd"
                    d="M15.198 3.52a1.612 1.612 0 012.223 2.336L6.346 16.421l-2.854.375 1.17-3.272L15.197 3.521zm3.725-1.322a3.612 3.612 0 00-5.102-.128L3.11 12.238a1 1 0 00-.253.388l-1.8 5.037a1 1 0 001.072 1.328l4.8-.63a1 1 0 00.56-.267L18.8 7.304a3.612 3.612 0 00.122-5.106zM12 17a1 1 0 100 2h6a1 1 0 100-2h-6z"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
        ))}
      </div>
      {/* ===== DIRECTOR END ===== */}
      {/* ===== UNDERLINE START ===== */}
      {underline?.length > 0 && (
        <div className="border grid grid-cols-3 gap-4 p-4 border-neutral-200 w-full bg-slate-50 ">
          {underline?.map((user) => (
            <div
              key={user?.id}
              className="border bg-white flex  justify-between items-center  border-neutral-200 min-w-80"
            >
              <div
                className="flex flex-col  w-full p-4  cursor-pointer"
                onClick={() => {
                  setUserSelected(user);
                }}
              >
                <span className=" text-start">{user?.name}</span>
                <span className="text-xs text-start text-slate-500">
                  {user?.poste}
                </span>
              </div>
              <button
                className=" h-full flex justify-center items-center p-2"
                onClick={() => {
                  setUserToModify(user);
                  setIsModifyHierarchyOpen(true);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill="#006171"
                      fillRule="evenodd"
                      d="M15.198 3.52a1.612 1.612 0 012.223 2.336L6.346 16.421l-2.854.375 1.17-3.272L15.197 3.521zm3.725-1.322a3.612 3.612 0 00-5.102-.128L3.11 12.238a1 1 0 00-.253.388l-1.8 5.037a1 1 0 001.072 1.328l4.8-.63a1 1 0 00.56-.267L18.8 7.304a3.612 3.612 0 00.122-5.106zM12 17a1 1 0 100 2h6a1 1 0 100-2h-6z"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {/* ===== UNDERLINE END ===== */}
    </div>
  );
};

export default BodyHierarchy;
