import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import CustomSelect from "../../components/UIElements/Select/CustomSelect";

const CreateReunion = () => {
    return (
        <>
        <DefaultLayout>
            <div className="text-sm mx-2 p-4 md:mx-5">
                <div className={`w-full mb-2 flex text-base items-center`}>
                     <Breadcrumb
                        paths={[
                        { name: "Réunion", to: "/gmp/project/list" },
                        { name: "Créer Réunion" },
                        ]}
                    />
                </div>
                <div className="relative bg-white place-items-center overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-1 rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
                    <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg">
                        Créer une nouvelle réunion
                    </div>
                    <div className="pt-2 w-full px-2 md:px-20 lg:px-30 xl:px-50">
                        <form className="space-y-2 transition-all min-w-[50vw]  duration-1000 ease-in-out">
                            <CustomInput 
                                type="text"
                                label="Titre"
                                rounded="medium"
                                placeholder="Titre du réunion"
                            />
                            <div className="grid  md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="date"
                                    label="Date début"
                                    rounded="medium"
                                />
                                <CustomInput 
                                    type="date"
                                    label="Date fin"
                                    rounded="medium"
                                />
                            </div>
                             <div className="grid  md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="time"
                                    label="Heure début"
                                    rounded="medium"
                                />
                                <CustomInput 
                                    type="time"
                                    label="Heure fin"
                                    rounded="medium"
                                />
                            </div>
                                <CustomSelect 
                                    label="Emplacement"
                                    placeholder="Emplacement"
                                    data={[]}
                                    value=""
                                    onValueChange={() => {}}

                                />
                                <div>
                                    <p className="mb-1 min-w-20 leading-relaxed block font-semibold font-poppins text-sm text-black dark:text-white">Participant</p>
                                     <CustomSelect 
                                    label="Obligatoire"
                                    placeholder="Emplacement"
                                    data={[]}
                                    value=""
                                    onValueChange={() => {}}

                                />
                                 <CustomSelect 
                                    label="Facultatif"
                                    placeholder="Emplacement"
                                    data={[]}
                                    value=""
                                    onValueChange={() => {}}

                                />
                                </div>
                               
                             <div className="flex justify-end gap-3">
          <button
            onClick={() => {}}
            type="button"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg  dark:bg-transparent dark:hover:bg-boxdark2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
        </>
    );
};

export default CreateReunion;