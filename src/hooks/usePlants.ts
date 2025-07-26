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
      const storedPlants = localStorage.getItem(STORAGE_KEY);
      if (storedPlants) {
        setPlants(JSON.parse(storedPlants));
      } else {
        setPlants(initialPlants);
      }
    } catch (error) {
      console.error('Failed to load plants from localStorage:', error);
      setPlants(initialPlants);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
      } catch (error) {
        console.error('Failed to save plants to localStorage:', error);
      }
    }
  }, [plants, isInitialized]);

  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'schedule' | 'log'>) => {
    const newPlant: Plant = {
      ...plant,
      id: new Date().toISOString(),
      schedule: [],
      log: [],
    };
    setPlants((prevPlants) => [...prevPlants, newPlant]);
    return newPlant;
  }, []);
  
  const getPlantById = useCallback((id: string) => {
    return plants.find(p => p.id === id);
  }, [plants]);

  const updatePlant = useCallback((updatedPlant: Plant) => {
    setPlants(prevPlants => prevPlants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
  }, []);

  const addCareTask = useCallback((plantId: string, task: Omit<CareTask, 'id' | 'lastCompleted'>) => {
    const newId = `task-${new Date().toISOString()}`;
    const newTask: CareTask = { ...task, id: newId, lastCompleted: new Date().toISOString() };
    setPlants(prevPlants => prevPlants.map(p => p.id === plantId ? { ...p, schedule: [...p.schedule, newTask] } : p));
  }, []);

  const completeCareTask = useCallback((plantId: string, taskId: string, notes?: string) => {
    const date = new Date().toISOString();
    const newLogEntryId = `log-${date}`;
    
    setPlants(prevPlants => prevPlants.map(p => {
      if (p.id === plantId) {
        const taskToComplete = p.schedule.find(t => t.id === taskId);
        if (!taskToComplete) return p;

        const newLogEntry: CareLogEntry = {
          id: newLogEntryId,
          taskType: taskToComplete.type,
          date,
          notes: notes || `Completed '${taskToComplete.type}' task.`,
        };

        const updatedSchedule = p.schedule.map(t => t.id === taskId ? { ...t, lastCompleted: date } : t);
        
        return {
          ...p,
          schedule: updatedSchedule,
          log: [newLogEntry, ...p.log],
        }
      }
      return p;
    }));
  }, []);

  return { 
    plants, 
    addPlant, 
    getPlantById, 
    updatePlant, 
    addCareTask, 
    completeCareTask,
    isInitialized 
  };
}
