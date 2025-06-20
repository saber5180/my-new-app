export interface Agency {
  id: number;
  adress: string;
  motPasse: string;
  nom: string;
  localisation: string;
  image?: string;
}

export interface AgencyFormData {
  adress: string;
  motPasse: string;
  nom: string;
  localisation: string;
  image?: string;
}