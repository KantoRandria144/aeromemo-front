// src/services/TranscriptionService.ts
// Service d’intégration avec l’API C# locale : http://localhost:5000/api/transcription/upload
import axios from "axios";

const API_TRANSCRIPTION = "http://localhost:5000/api/transcription/upload";

export type TranscriptionApiResponse = {
  fileName?: string;
  language?: string;
  text?: string;
  durationSeconds?: number;
  summary?: string;
  decisions?: string[];
  actions?: string[];
  objectives?: string[];
  pointsCles?: string[];
  participants?: string[];
};

export async function uploadTranscriptionFile(
  file: File,
  language: string = "fr",
  reunionId?: string,
  onProgress?: (progress: number) => void
): Promise<TranscriptionApiResponse> {
  const form = new FormData();
  form.append("File", file);
  form.append("Language", language);
  if (reunionId) form.append("ReunionId", reunionId);

  const res = await axios.post(API_TRANSCRIPTION, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        if (onProgress) onProgress(percent);
      }
    },
  });

  return res.data as TranscriptionApiResponse;
}
// src/services/TranscriptionService.ts

export async function getTranscriptionByReunionId(reunionId: string) {
  const res = await fetch(`http://localhost:5000/api/transcription/${reunionId}`);
  if (!res.ok) {
    throw new Error(`Erreur API transcription GET (${res.status})`);
  }
  return (await res.json()) as any[]; // ton API retourne un tableau
}
