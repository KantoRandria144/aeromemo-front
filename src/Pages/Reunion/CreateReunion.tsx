import React, { useState } from 'react';
import { PuffLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { getInitials } from '../../services/Function/UserFonctionService';
import { IUserReunion } from '../../types/reunion';
import { IDecodedToken } from '../../types/user';

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const CreateReunion = () => {
   const [searchUserInput, setSearchUserInput] = useState<string>("");
   const [usersList, setUsersList] = useState<Array<any>>([]);
   const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
   const [isDropdownUserOpen, setIsDropdownUserOpen] = useState<boolean>(false);
   const [assignedPerson, setAssignedPerson] = useState<Array<IUserReunion>>([]);
   const [decodedToken, setDecodedToken] = useState<IDecodedToken>();

   const handleUserSearch = (searchTerm: string) => {
    if (searchTerm === "") {
        setFilteredUsers(usersList);
        setIsDropdownUserOpen(false);
    } else {
        const filtered = usersList.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.tolowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setIsDropdownUserOpen(true);
    }

   };

   const handleAddUser = (user: {
    id: string;
    name: string;
    email: string;
   }) => {
    if (!assignedPerson.some(u => u.userid === user.id)) {
        const formatUser = {
            userid: user.id,
            role: "collaborator",
            user: {
                name: user.name,
                email: user.email
            },
        };
        setAssignedPerson(prev => [...prev, formatUser]);
        setSearchUserInput("");
        setIsDropdownUserOpen(false);
    } else {
        notyf.error("Cet utilisateur participe déjà");
    }
   };

   const handleRemoveUser = (userId: string) => {
    if (userId === decodedToken?.jti) {
        setAssignedPerson(prev => prev.filter(user => user.userid !== userId));

        return;
    }
    setAssignedPerson(prev => prev.filter(user => user.userid !== userId));
   };
    return (
        <DefaultLayout>
            <div className="text-sm mx-2 p-4 md:mx-5">
                <Breadcrumb
                    paths={[
                        { name: "Réunion", to: "/aeromemo/planification" },
                        { name: "Créer Réunion" },
                    ]}
                />
                <div className="relative mt-2 bg-white p-4 shadow-1 rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                    <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg">
                        Créer une nouvelle réunion
                    </div>
                    <div className="pt-2 w-full px-2 md:px-20 lg:px-30 xl:px-50">
                        <form className="space-y-4 transition-all duration-1000 ease-in-out">
                            <CustomInput
                                type="text"
                                name="titre"
                                label="Titre"
                                value={""}
                                placeholder="Titre de la réunion"
                                rounded="medium"
                                required
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="date" 
                                    name="dateDebut" 
                                    label="Date de début" 
                                    value={""}
                                    rounded="medium" 
                                    required 
                                />
                                <CustomInput 
                                    type="date" 
                                    name="dateFin" 
                                    label="Date de fin" 
                                    value={""}
                                    rounded="medium" 
                                    required 
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="time" 
                                    name="heureDebut" 
                                    label="Heure de début" 
                                    value={""}
                                    rounded="medium" 
                                    required 
                                />
                                <CustomInput 
                                    type="time" 
                                    name="heureFin" 
                                    label="Heure de fin" 
                                    value={""} 
                                    rounded="medium" 
                                    required 
                                />
                            </div>

                            <CustomInput
                                type="text"
                                name="emplacement"
                                label="Emplacement"
                                value={""}
                                placeholder="Salle de réunion"
                                rounded="medium"
                                required
                            />

                            <div>
                                <label htmlFor="description" className="mb-1 block font-semibold text-sm text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={""}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    placeholder="Description de la réunion..."
                                    required
                                />
                            </div>

                            {/* Participants Obligatoires */}
                            <div>
                                
                                <div className="hide-scrollbar">
                                    <div className="">
                                    
                                        <CustomInput 
                                            type="text"
                                            label="Participant obligatoires"
                                            rounded="medium"
                                            className='text-sm'
                                            value={searchUserInput}
                                            onChange={(e) => {
                                                setSearchUserInput(e.target.value);
                                                handleUserSearch(e.target.value);
                                            }}
                                            onFocus={() => setIsDropdownUserOpen}
                                            placeholder='Rechercher un utilisateur'

                                        />
                                        {isDropdownUserOpen && filteredUsers.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-boxdark border dark:border-formStrokedark rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {filteredUsers.map((user) => (
                                                    <div 
                                                        key={user.id}
                                                        className="flew items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
                                                        onClick={() => handleAddUser(user)} 
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2">
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {assignedPerson.map((user) => (
                                            <div 
                                                key={user.userid}
                                                className="flex items-center bg-gray-100 dark:bg-boxdark rounded-full px-3 py-1"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs"> 
                                                    {getInitials(user.user?.name)}
                                                </div>
                                                <span className="text-sm mr-2">{user.user?.name}</span>
                                                <button
                                                    onClick={() => handleRemoveUser(user.userid!)}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Participants Facultatifs */}
                            <div>
                               
                                <div className="hide-scrollbar">
                                    <div className="">
                                       <CustomInput 
                                            type="text"
                                            label="Participant facultatifs"
                                            rounded="medium"
                                            className='text-sm'
                                            value={searchUserInput}
                                            onChange={(e) => {
                                                setSearchUserInput(e.target.value);
                                                handleUserSearch(e.target.value);
                                            }}
                                            onFocus={() => setIsDropdownUserOpen}
                                            placeholder='Rechercher un utilisateur'

                                        />
                                        
                                    </div>
                                    <div className="flex gap-4 mt-2 flex-wrap">
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center">
                                
                            </div>

                            
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button" 
                                    className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 border border-zinc-300 rounded-lg dark:bg-transparent dark:hover:bg-boxdark2"
                                    onClick={() => window.history.back()}
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    
                                    className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
                                >
                                    
                                    
                                       
                                     Créer la réunion
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default CreateReunion;
