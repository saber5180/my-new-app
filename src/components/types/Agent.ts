export interface Agent {
  id: number;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  image?: string;
  agencyId: number;
}

export interface AgentFormData {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  image?: string;
}