'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Plant, CareTask, CareLogEntry } from '@/lib/types';
import { initialPlants } from '@/lib/data';

const STORAGE_KEY = 'verdant-minder-plants';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedPlantsJson = localStorage.getItem(STORAGE_KEY);
      if (storedPlantsJson) {
        const storedPlants: Plant[] = JSON.parse(storedPlantsJson);
        const storedPlantIds = new Set(storedPlants.map(p => p.id));
        
        // Find any initial plants that are not in storage and add them
        const newPlantsToAdd = initialPlants.filter(p => !storedPlantIds.has(p.id));
        
        if (newPlantsToAdd.length > 0) {
          const combinedPlants = [...storedPlants, ...newPlantsToAdd];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedPlants));
          setPlants(combinedPlants);
        } else {
          setPlants(storedPlants);
        }
      } else {
        // First time load, initialize with default data and save it.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlants));
        setPlants(initialPlants);
      }
    } catch (error) {
      console.error('Failed to load plants from localStorage:', error);
      // Fallback to initial data if there's an error
      setPlants(initialPlants);
    }
    setIsInitialized(true);
  }, []);

  const persistPlants = useCallback((updatedPlants: Plant[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
    } catch (error) {
      console.error('Failed to save plants to localStorage:', error);
    }
  }, []);

  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'schedule' | 'log'>) => {
    const newPlant: Plant = {
      ...plant,
      id: new Date().toISOString(),
      schedule: [],
      log: [],
    };
    
    let newPlants: Plant[] = [];
    setPlants((prevPlants) => {
      newPlants = [...prevPlants, newPlant];
      persistPlants(newPlants);
      return newPlants
    });
    return newPlant;
  }, [persistPlants]);
  
  const getPlantById = useCallback((id: string) => {
    return plants.find(p => p.id === id);
  }, [plants]);

  const updatePlant = useCallback((updatedPlant: Plant) => {
    setPlants(prevPlants => {
      const updatedPlants = prevPlants.map(p => p.id === updatedPlant.id ? { ...updatedPlant } : p);
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);
  
  const removePlant = useCallback((plantId: string) => {
    setPlants((prevPlants) => {
      const updatedPlants = prevPlants.filter(p => p.id !== plantId);
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);

  const addCareTask = useCallback((plantId: string, task: Omit<CareTask, 'id' | 'lastCompleted'>) => {
    const newId = `task-${new Date().toISOString()}`;
    const newTask: CareTask = { ...task, id: newId, lastCompleted: new Date().toISOString() };
    setPlants(prevPlants => {
      const updatedPlants = prevPlants.map(p => p.id === plantId ? { ...p, schedule: [...p.schedule, newTask] } : p);
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);

  const removeCareTask = useCallback((plantId: string, taskId: string) => {
    setPlants(prevPlants => {
      const updatedPlants = prevPlants.map(p => {
        if (p.id === plantId) {
          return {
            ...p,
            schedule: p.schedule.filter(t => t.id !== taskId)
          };
        }
        return p;
      });
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);

  const completeCareTask = useCallback((plantId: string, taskId: string, notes?: string, photoUrl?: string | null) => {
    const date = new Date().toISOString();
    const newLogEntryId = `log-${date}`;
    
    setPlants(prevPlants => {
      const updatedPlants = prevPlants.map(p => {
        if (p.id === plantId) {
          const taskToComplete = p.schedule.find(t => t.id === taskId);
          if (!taskToComplete) return p;

          const newLogEntry: CareLogEntry = {
            id: newLogEntryId,
            taskType: taskToComplete.type,
            date,
            notes: notes || `Completed '${taskToComplete.type}' task.`,
            photoUrl: photoUrl || undefined,
          };

          const updatedSchedule = p.schedule.map(t => t.id === taskId ? { ...t, lastCompleted: date } : t);
          
          const updatedPlant = {
            ...p,
            schedule: updatedSchedule,
            log: [newLogEntry, ...p.log],
          }
          return updatedPlant;
        }
        return p;
      });
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);

  const clearCareLog = useCallback((plantId: string) => {
    setPlants(prevPlants => {
      const updatedPlants = prevPlants.map(p => {
        if (p.id === plantId) {
          return { ...p, log: [] };
        }
        return p;
      });
      persistPlants(updatedPlants);
      return updatedPlants;
    });
  }, [persistPlants]);

  return { 
    plants, 
    addPlant, 
    getPlantById, 
    updatePlant, 
    removePlant,
    addCareTask,
    removeCareTask,
    completeCareTask,
    clearCareLog,
    isInitialized 
  };
}
