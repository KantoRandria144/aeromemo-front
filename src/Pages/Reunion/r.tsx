import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { MultiValue } from 'react-select';
import axios from 'axios';
import reunionService from '../../services/reunionService';
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";

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

interface ParticipantOption {
    value: string; // email
    label: string;
    isInternal: boolean;
}

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

    const [participants, setParticipants] = useState<MultiValue<ParticipantOption>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isInternalEmail = (email: string): boolean => {
        return email.toLowerCase().endsWith('@ravinala-airports.aero');
    };

    const loadUserOptions = async (inputValue: string): Promise<ParticipantOption[]> => {
        if (inputValue.length < 2) return [];
        
        try {
            const response = await axios.get(`/api/user/search?query=${inputValue}`);
            return response.data.map((user: any) => ({
                value: user.email,
                label: `${user.name} (${user.email})`,
                isInternal: isInternalEmail(user.email)
            }));
        } catch (err) {
            console.error("Erreur recherche utilisateurs:", err);
            return [];
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const participantDtos = participants.map(p => ({
                email: p.value,
                type: p.isInternal ? 'Interne' : 'Externe',
                state: p.isInternal ? 'Confirmé' : 'En attente',
                userid: p.value // ou extraire l'ID si nécessaire
            }));

            await reunionService.create({
                ...formData,
                participants: participantDtos
            });

            alert('Réunion créée avec succès !');
            // Réinitialiser le formulaire si nécessaire
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
            setParticipants([]);
        } catch (err: any) {
            setError(err.response?.data?.title || "Erreur lors de la création");
            console.error("Erreur détaillée:", err.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            color: state.data.isInternal ? '#1e40af' : '#854d0e',
            backgroundColor: state.isFocused ? (state.data.isInternal ? '#dbeafe' : '#fef9c3') : 'white',
            fontWeight: state.data.isInternal ? '500' : '400'
        }),
        multiValue: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.data.isInternal ? '#dbeafe' : '#fef9c3',
            border: `1px solid ${state.data.isInternal ? '#93c5fd' : '#fde047'}`
        })
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

                            <div>
                                <label className="mb-1 block font-semibold text-sm text-black dark:text-white">
                                    Participants
                                </label>
                                <AsyncSelect<ParticipantOption, true>
                                    isMulti
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadUserOptions}
                                    value={participants}
                                    onChange={(newValue) => setParticipants(newValue)}
                                    placeholder="Rechercher par nom ou email..."
                                    noOptionsMessage={({ inputValue }) => 
                                        inputValue.length < 2 ? "Tapez au moins 2 caractères" : "Aucun résultat"
                                    }
                                    styles={customStyles}
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center">
                                            <span 
                                                className={`mr-2 inline-block h-3 w-3 rounded-full ${
                                                    option.isInternal ? 'bg-blue-600' : 'bg-yellow-500'
                                                }`}
                                            />
                                            {option.label}
                                            <span className="ml-2 text-xs">
                                                {option.isInternal ? '(Interne)' : '(Externe)'}
                                            </span>
                                        </div>
                                    )}
                                />
                                <div className="mt-2 text-sm text-gray-500 flex items-center">
                                    <span className="flex items-center mr-3">
                                        <span className="inline-block w-3 h-3 mr-1 bg-blue-600 rounded-full"></span>
                                        Interne
                                    </span>
                                    <span className="flex items-center">
                                        <span className="inline-block w-3 h-3 mr-1 bg-yellow-500 rounded-full"></span>
                                        Externe
                                    </span>
                                </div>
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
                                    disabled={isSubmitting}
                                    className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Création en cours...' : 'Créer la réunion'}
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