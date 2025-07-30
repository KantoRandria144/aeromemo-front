import axios from "axios";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { HabilitationDataProps } from "../../types/Habilitation";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ========= GET ========= */
// GET ALL HABILITATION
export const getAllHabilitation = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Habilitation/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at service fetching habilitation`);
  }
};

// get all habilitation labels
export const getAllHabilitationLabels = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Habilitation/labels`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at service fetching habilitation labels`);
  }
};
// get habilitations by his id
export const getHabilitationById = async (habilitationId: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Habilitation/${habilitationId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at service fetching habilitation by id ${error}`);
  }
};

/* ========= POST ========= */
// CREATE HABILITATION
export const createHabilitation = async (
  habilitationdata: HabilitationDataProps
) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Habilitation/create`,
      habilitationdata
    );
    console.log(`Hablilitation created: ${response.data}`);
  } catch (error) {
    console.error(`Error service creating habilitation: ${error}`);
  }
};

/* ========= PUT ========= */
export const updateHabilitation = async (
  habilitationData: HabilitationDataProps,
  habilitationId: string
) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Habilitation/update/${habilitationId}`,
      habilitationData
    );
    return response.data
  } catch (error) {
    console.error(`Error service update habilitation service: ${error}`);
  }
};
/* ========= DELETE ========= */
// DELETE HABILITATION
export const deleteHabilitation = async (ids: string[]) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/Habilitation/deletes`,
      {
        data: ids,
      }
    );

    if (response.status === 200) {
      console.log(`Habilitations was been deleted successfully`);
    } else {
      console.log(`Failed to delete the habilitation`);
    }
  } catch (error) {
    // notyf.error("Impossible de supprimer cet accès");
    // notyf.error("Des utilisateurs sont encore relié à cet accès");
    notyf.error("Impossible de supprimer cet accès car des utilisateurs y sont encore rattachés");
    console.error(`An error occured while deleting the habilitation: ${error}`);
    throw error;
  }
};
