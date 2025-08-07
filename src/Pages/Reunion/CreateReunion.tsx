import React, { useState } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { ActionMeta, MultiValue } from 'react-select';

// Import de vos composants UI personnalisés
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";

// Définition des types pour plus de clarté et de sécurité
interface ReunionFormState {
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    etat: string;
}

interface UserOption {
    value: string; // email de l'utilisateur
    label: string; // "Nom (email)"
}

const CreateReunion: React.FC = () => {
    const [formData, setFormData] = useState<ReunionFormState>({
        titre: '',
        description: 'Réunion planifiée via AeroMemo.', // Valeur par défaut
        dateDebut: '',
        dateFin: '',
        heureDebut: '',
        heureFin: '',
        etat: 'Planifiée', // Valeur par défaut
    });

    const [participantsObligatoires, setParticipantsObligatoires] = useState<MultiValue<UserOption>>([]);
    const [participantsFacultatifs, setParticipantsFacultatifs] = useState<MultiValue<UserOption>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Gère les changements dans les inputs classiques
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fonction pour charger les utilisateurs depuis votre API
    const loadUserOptions = async (inputValue: string): Promise<UserOption[]> => {
        // Ne pas lancer de recherche si l'utilisateur n'a pas tapé au moins 2 caractères
        if (inputValue.length < 2) {
            return [];
        }
        try {
            const response = await axios.get(`/api/user/all?NameOrMail=${inputValue}`);
            // Mapper la réponse de l'API au format attendu par react-select
            return response.data.map((user: any) => ({
                value: user.email,
                label: `${user.name} (${user.email})`,
            }));
        } catch (err) {
            console.error("Erreur lors de la recherche d'utilisateurs:", err);
            return []; // Retourner un tableau vide en cas d'erreur
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const payload = {
            ...formData,
            participantsObligatoires: participantsObligatoires.map(p => p.value),
            participantsFacultatifs: participantsFacultatifs.map(p => p.value),
        };

        try {
            const response = await axios.post('/api/reunion', payload);

            if (response.status === 200 && response.data.webLink) {
                alert('Réunion créée avec succès ! Vous allez être redirigé vers Outlook.');
                // Ouvre l'événement Outlook dans un nouvel onglet
                window.open(response.data.webLink, '_blank');
                // Optionnel : réinitialiser le formulaire ou rediriger l'utilisateur
            } else {
                setError(response.data.message || "Une erreur inattendue est survenue.");
            }
        } catch (err: any) {
            console.error("Erreur lors de la soumission du formulaire:", err);
            setError(err.response?.data || "Impossible de contacter le serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="text-sm mx-2 p-4 md:mx-5">
                <Breadcrumb
                    paths={[
                        { name: "Réunion", to: "/gmp/project/list" },
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
                                <CustomInput type="date" name="dateDebut" label="Date de début" value={formData.dateDebut} onChange={handleInputChange} rounded="medium" required />
                                <CustomInput type="date" name="dateFin" label="Date de fin" value={formData.dateFin} onChange={handleInputChange} rounded="medium" required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <CustomInput type="time" name="heureDebut" label="Heure de début" value={formData.heureDebut} onChange={handleInputChange} rounded="medium" required />
                                <CustomInput type="time" name="heureFin" label="Heure de fin" value={formData.heureFin} onChange={handleInputChange} rounded="medium" required />
                            </div>
                            
                            {/* Champ pour la description */}
                            <div>
                                <label htmlFor="description" className="mb-1 block font-semibold text-sm text-black dark:text-white">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    placeholder="Ajoutez une description ou un ordre du jour pour la réunion."
                                ></textarea>
                            </div>

                            {/* Sélecteurs de participants */}
                            <div>
                                <label className="mb-1 block font-semibold text-sm text-black dark:text-white">Participants obligatoires</label>
                                <AsyncSelect<UserOption, true>
                                    isMulti
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadUserOptions}
                                    onChange={(options) => setParticipantsObligatoires(options as MultiValue<UserOption>)}
                                    placeholder="Rechercher par nom ou email..."
                                    noOptionsMessage={({ inputValue }) => inputValue.length < 2 ? "Tapez au moins 2 caractères" : "Aucun utilisateur trouvé"}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-semibold text-sm text-black dark:text-white">Participants facultatifs</label>
                                <AsyncSelect<UserOption, true>
                                    isMulti
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadUserOptions}
                                    onChange={(options) => setParticipantsFacultatifs(options as MultiValue<UserOption>)}
                                    placeholder="Rechercher par nom ou email..."
                                    noOptionsMessage={({ inputValue }) => inputValue.length < 2 ? "Tapez au moins 2 caractères" : "Aucun utilisateur trouvé"}
                                />
                            </div>

                            {error && <div className="text-red-500 text-center p-2 bg-red-100 rounded-md">{error}</div>}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 border border-zinc-300 rounded-lg dark:bg-transparent dark:hover:bg-boxdark2">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen disabled:opacity-50 disabled:cursor-not-allowed">
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
