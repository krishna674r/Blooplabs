import { useState, useEffect } from 'react';
import { SavedProject } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('blooplabs-projects');
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored projects", e);
      }
    }
  }, []);

  const saveProject = (project: SavedProject) => {
    const newProjects = [project, ...projects.filter(p => p.id !== project.id)];
    setProjects(newProjects);
    localStorage.setItem('blooplabs-projects', JSON.stringify(newProjects));
  };
  
  const updateProject = (id: string, updates: Partial<SavedProject>) => {
    const newProjects = projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p);
    setProjects(newProjects);
    localStorage.setItem('blooplabs-projects', JSON.stringify(newProjects));
  };
  
  const deleteProject = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem('blooplabs-projects', JSON.stringify(newProjects));
  };

  return { projects, saveProject, updateProject, deleteProject };
}
