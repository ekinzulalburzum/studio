
export interface Vaccine {
  id: string;
  name: string;
  dueDate: string; // ISO string
  isCompleted: boolean;
}

export interface Lamb {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // ISO string
  birthTime: string; // HH:mm
  photoUrl: string;
  vaccines: Vaccine[];
}

export type AppTab = 'list' | 'add' | 'health-assistant' | 'profile';
