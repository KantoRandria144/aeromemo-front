// src/services/TranscriptionService.ts
// Service d’intégration avec l’API C# locale : http://localhost:5000/api/transcription/upload

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

export async function uploadTranscriptionFile(file: File, language: string = "fr"): Promise<TranscriptionApiResponse> {
  const form = new FormData();
  // ⚠️ Ton API .NET accepte des champs nommés "File" et "Language" (cf. contrôleur fourni)
  form.append("File", file);
  form.append("Language", language);

  const res = await fetch(API_TRANSCRIPTION, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erreur API (${res.status} ${res.statusText}) ${txt ? `→ ${txt}` : ""}`);
  }

  return (await res.json()) as TranscriptionApiResponse;
}
// src/services/TranscriptionService.ts

export async function getTranscriptionByReunionId(reunionId: string) {
  const res = await fetch(`http://localhost:5000/api/transcription/${reunionId}`);
  if (!res.ok) {
    throw new Error(`Erreur API transcription GET (${res.status})`);
  }
  return (await res.json()) as any[]; // ton API retourne un tableau
}
