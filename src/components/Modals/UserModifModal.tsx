import { useEffect, useRef, useState } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { getAllHabilitation } from "../../services/User/HabilitationService";
import { assignHabilitations } from "../../services/User/UserServices";
import CustomInput from "../UIElements/Input/CustomInput";
import MultiSelect from "../UIElements/Select/MultiSelect";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UserModifModal = ({
  setUserModifs,
  userSelected,
  userForModif
}: {
  setUserModifs: Function;
  userSelected: string[];
  userForModif: {
    name: string;
    email: string;
    habilitations?: string[]; // Ajout des habilitations existantes
  }
}) => {
  const [habilitations, setHabilitations] = useState<string[]>([]);
  const [habilitationsIdLabel, setHabilitationsIdLabel] = useState<
    { label: string; id: string }[]
  >([]);
  const [valueMulti, setValueMulti] = useState<any>(userForModif.habilitations || []);
  const trigger = useRef<any>(null);

  useEffect(() => {
    const fetchHabilitation = async () => {
      const habilit = await getAllHabilitation();
      const habilitIdLabel = habilit.map(
        ({ label, id }: { label: string; id: string }) => ({ label, id })
      );
      const habilitLabel = habilit.map(({ label }: { label: string }) => label);
      setHabilitationsIdLabel(habilitIdLabel);
      setHabilitations(habilitLabel);
    };
    fetchHabilitation();
  }, []);

  const handleModif = async (e: any) => {
    e.preventDefault();
    const habIds: string[] = [];

    const valueMultiSet = new Set(valueMulti);

    habilitationsIdLabel.forEach(({ label, id }) => {
      if (valueMultiSet.has(label)) {
        habIds.push(id);
      }
    });
    try {
      await assignHabilitations({ userIds: userSelected, habilitationIds: habIds });
      notyf.success("Assignement réussi");
    } catch (error) {
      notyf.error("Un problème est survenu lors de l'assignement");
      console.error(`Error while assign habilitation to user`, error);
    } finally {
      setUserModifs(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={"bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"}
      >
        <header className={"flex justify-between w-full h-12"}>
          <div className={"font-bold"}>
            Modifier les accès{" "}
            {userSelected.length > 1
              ? `des ${userSelected.length} utilisateurs`
              : ``}
          </div>
          <div className={"cursor-pointer"} onClick={() => setUserModifs(false)}>
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
        <div>
          <form onSubmit={handleModif}>
            {userSelected.length > 1 ? (
              <div></div>
            ) : (
              <>
                <CustomInput
                  label="Nom"
                  type="text"
                  rounded="medium"
                  className="p-4 w-full"
                  value={userForModif.name}
                  disabled
                />
                <CustomInput
                  label="Email"
                  type="text"
                  rounded="medium"
                  className="p-4 w-full"
                  value={userForModif.email}
                  disabled
                />
              </>
            )}
            <MultiSelect
              id="user-habilitations"
              label={"Accès"}
              placeholder="Accès disponible"
              value={habilitations}
              setValueMulti={setValueMulti}
              initialValue={userForModif.habilitations?.join(",")}
            />

            <input
              type="submit"
              value={"Modifier les accès"}
              className="w-full cursor-pointer mt-2 py-2 text-sm px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModifModal;