export interface CareTask {
  id: string;
  type: string;
  frequencyDays: number;
  lastCompleted: string; // ISO date string
  notes?: string;
}

export interface CareLogEntry {
  id: string;
  taskType: string;
  date: string; // ISO date string
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  description: string;
  schedule: CareTask[];
  log: CareLogEntry[];
}
