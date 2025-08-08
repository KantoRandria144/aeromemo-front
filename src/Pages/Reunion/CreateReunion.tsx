import React, { useState } from 'react';
import { PuffLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from 'axios';
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { reunionService } from '../../services/Reunion/reunionService';
import { getInitials } from "../../services/Function/UserFunctionService";

interface ReunionFormState {
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    etat: number;
    emplacement: string;
}

interface Participant {
    id?: string;
    email: string;
    name: string;
    type: 'Interne' | 'Externe';
    role: 'Obligatoire' | 'Facultatif';
}

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const CreateReunion: React.FC = () => {
    const [formData, setFormData] = useState<ReunionFormState>({
        titre: '',
        description: 'Réunion planifiée via AeroMemo.',
        dateDebut: '',
        dateFin: '',
        heureDebut: '',
        heureFin: '',
        etat: 1,
        emplacement: ''
    });

    const [obligatoryParticipants, setObligatoryParticipants] = useState<Participant[]>([]);
    const [optionalParticipants, setOptionalParticipants] = useState<Participant[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const isInternalEmail = (email: string): boolean => {
        return email.toLowerCase().endsWith('@ravinala-airports.aero');
    };

    const searchUsers = async (query: string): Promise<Participant[]> => {
        if (query.length < 2) return [];
        
        setSearchLoading(true);
        try {
            const response = await axios.get(`/api/user/search?query=${query}`);
            
            if (!Array.isArray(response?.data)) {
                console.error("Format de réponse inattendu:", response.data);
                return [];
            }

            return response.data
                .filter(user => user?.email && user?.name)
                .map((user) => ({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    type: isInternalEmail(user.email) ? 'Interne' : 'Externe',
                    role: isInternalEmail(user.email) ? 'Obligatoire' : 'Facultatif'
                }));
        } catch (err) {
            console.error("Erreur API:", err);
            return [];
        } finally {
            setSearchLoading(false);
        }
    };

    const handleRemoveParticipant = (id: string | undefined, isObligatory: boolean) => {
        if (isObligatory) {
            setObligatoryParticipants(prev => prev.filter(p => p.id !== id));
        } else {
            setOptionalParticipants(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const allParticipants = [...obligatoryParticipants, ...optionalParticipants];
            
            if (allParticipants.length === 0) {
                notyf.error("Vous devez ajouter au moins un participant obligatoire.");
                return;
            }

            const participantDtos = allParticipants.map(p => ({
                id: '',
                type: p.type,
                role: p.role,
                state: p.type === 'Interne' ? 'Confirmé' : 'En attente',
                userid: p.id || p.email.split('@')[0],
                email: p.email,
                reunionid: ''
            }));

            await reunionService.create({
                ...formData,
                participants: participantDtos
            });

            notyf.success('Réunion créée avec succès !');
            setFormData({
                titre: '',
                description: 'Réunion planifiée via AeroMemo.',
                dateDebut: '',
                dateFin: '',
                heureDebut: '',
                heureFin: '',
                etat: 1,
                emplacement: ''
            });
            setObligatoryParticipants([]);
            setOptionalParticipants([]);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la création");
            notyf.error(err.response?.data?.message || "Erreur lors de la création");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ParticipantItem = ({ participant, isObligatory }: { participant: Participant, isObligatory: boolean }) => {
        const initials = getInitials(participant.name);
        const bgColor = participant.type === 'Interne' ? 'bg-blue-100' : 'bg-yellow-100';
        const textColor = participant.type === 'Interne' ? 'text-blue-800' : 'text-yellow-800';

        return (
            <div
                key={participant.id}
                className="relative group -ml-2 first:ml-0 hover:z-50"
                onClick={() => handleRemoveParticipant(participant.id, isObligatory)}
            >
                <div className={`cursor-pointer border relative ${bgColor} p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full`}>
                    <span className={textColor}>{initials}</span>
                </div>
                <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-gray-200 shadow-md rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                    <p>{participant.name}</p>
                    <p className="text-xs">{participant.email}</p>
                </div>
            </div>
        );
    };

    return (
        <DefaultLayout>
            <div className="text-sm mx-2 p-4 md:mx-5">
                <Breadcrumb
                    paths={[
                        { name: "Réunion", to: "/reunions" },
                        { name: "Créer Réunion" },
                    ]}
                />
                <div className="relative mt-2 bg-white p-4 shadow-1 rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                    <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg">
                        Créer une nouvelle réunion
                    </div>
                    <div className="pt-2 w-full px-2 md:px-20 lg:px-30 xl:px-50">
                        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-1000 ease-in-out">
                            <CustomInput
                                type="text"
                                name="titre"
                                label="Titre"
                                value={formData.titre}
                                onChange={handleInputChange}
                                placeholder="Titre de la réunion"
                                rounded="medium"
                                required
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="date" 
                                    name="dateDebut" 
                                    label="Date de début" 
                                    value={formData.dateDebut} 
                                    onChange={handleInputChange} 
                                    rounded="medium" 
                                    required 
                                />
                                <CustomInput 
                                    type="date" 
                                    name="dateFin" 
                                    label="Date de fin" 
                                    value={formData.dateFin} 
                                    onChange={handleInputChange} 
                                    rounded="medium" 
                                    required 
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CustomInput 
                                    type="time" 
                                    name="heureDebut" 
                                    label="Heure de début" 
                                    value={formData.heureDebut} 
                                    onChange={handleInputChange} 
                                    rounded="medium" 
                                    required 
                                />
                                <CustomInput 
                                    type="time" 
                                    name="heureFin" 
                                    label="Heure de fin" 
                                    value={formData.heureFin} 
                                    onChange={handleInputChange} 
                                    rounded="medium" 
                                    required 
                                />
                            </div>

                            <CustomInput
                                type="text"
                                name="emplacement"
                                label="Emplacement"
                                value={formData.emplacement}
                                onChange={handleInputChange}
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
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    placeholder="Description de la réunion..."
                                    required
                                />
                            </div>

                            {/* Participants Obligatoires */}
                            <div>
                                <label className="mb-1 block font-semibold text-sm text-black dark:text-white">
                                    Participants Obligatoires
                                </label>
                                <div className="hide-scrollbar">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom ou email..."
                                            className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary"
                                            onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const query = e.currentTarget.value.trim();
                                                    if (query.length < 2) return;
                                                    
                                                    const users = await searchUsers(query);
                                                    const internalUsers = users.filter(u => u.type === 'Interne');
                                                    
                                                    if (internalUsers.length > 0) {
                                                        setObligatoryParticipants(prev => [
                                                            ...prev,
                                                            ...internalUsers.filter(newUser => 
                                                                !prev.some(existing => existing.email === newUser.email)
                                                            )
                                                        ]);
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        {searchLoading && <PuffLoader size={20} />}
                                    </div>
                                    <div className="flex gap-4 mt-2 flex-wrap">
                                        {obligatoryParticipants.map(participant => (
                                            <ParticipantItem 
                                                key={participant.id} 
                                                participant={participant} 
                                                isObligatory={true} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Participants Facultatifs */}
                            <div>
                                <label className="mb-1 block font-semibold text-sm text-black dark:text-white">
                                    Participants Facultatifs
                                </label>
                                <div className="hide-scrollbar">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom ou email..."
                                            className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary"
                                            onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const query = e.currentTarget.value.trim();
                                                    if (query.length < 2) return;
                                                    
                                                    const users = await searchUsers(query);
                                                    const externalUsers = users.filter(u => u.type === 'Externe');
                                                    
                                                    if (externalUsers.length > 0) {
                                                        setOptionalParticipants(prev => [
                                                            ...prev,
                                                            ...externalUsers.filter(newUser => 
                                                                !prev.some(existing => existing.email === newUser.email)
                                                            )
                                                        ]);
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        {searchLoading && <PuffLoader size={20} />}
                                    </div>
                                    <div className="flex gap-4 mt-2 flex-wrap">
                                        {optionalParticipants.map(participant => (
                                            <ParticipantItem 
                                                key={participant.id} 
                                                participant={participant} 
                                                isObligatory={false} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center">
                                <span className="flex items-center mr-3">
                                    <span className="inline-block w-3 h-3 mr-1 bg-blue-600 rounded-full"></span>
                                    Interne (Obligatoire)
                                </span>
                                <span className="flex items-center">
                                    <span className="inline-block w-3 h-3 mr-1 bg-yellow-500 rounded-full"></span>
                                    Externe (Facultatif)
                                </span>
                            </div>

                            {error && (
                                <div className="text-red-500 text-center p-2 bg-red-100 rounded-md">
                                    {error}
                                </div>
                            )}

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
                                    disabled={isSubmitting || obligatoryParticipants.length === 0}
                                    className={`md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 border rounded-lg ${
                                        isSubmitting || obligatoryParticipants.length === 0
                                            ? "border-slate-400 bg-slate-300 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed"
                                            : "border-primaryGreen bg-primaryGreen dark:border-darkgreen dark:bg-darkgreen"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <PuffLoader size={20} color="#fff" /> Création en cours...
                                        </span>
                                    ) : 'Créer la réunion'}
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