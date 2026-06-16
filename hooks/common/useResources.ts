"use client";

import { useState, useEffect } from "react";
import useSnackbar from "@/store/useSnackbar";

export interface Resource {
  id: string;
  title: string;
  category: "Playbooks" | "Modules" | "Templates" | string;
  description: string;
  tags: string[];
  createdAt: string;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Startup Fundraising Pitch Playbook",
    category: "Playbooks",
    description: "A comprehensive guide on structure, slide design, storyboarding, and pitching to early-stage investors for educational startups.",
    tags: ["fundraising", "pitch deck", "investment", "guide"],
    createdAt: new Date("2026-05-10").toISOString(),
  },
  {
    id: "res-2",
    title: "Introduction to Intellectual Property and Patents",
    category: "Modules",
    description: "An interactive learning module explaining patent search methodologies, novelty checks, and filing processes for student innovators.",
    tags: ["patents", "IP", "legal", "module"],
    createdAt: new Date("2026-05-20").toISOString(),
  },
  {
    id: "res-3",
    title: "Non-Disclosure Agreement (NDA) Template",
    category: "Templates",
    description: "Standard mutual non-disclosure agreement template ready for students, researchers, and mentors when discussing new innovations.",
    tags: ["NDA", "legal", "template", "confidentiality"],
    createdAt: new Date("2026-06-01").toISOString(),
  },
  {
    id: "res-4",
    title: "Design Thinking & Prototyping Module",
    category: "Modules",
    description: "Course material and exercises for validating startup ideas through low-fidelity wireframing and user experience interviews.",
    tags: ["ux", "prototyping", "design thinking"],
    createdAt: new Date("2026-06-05").toISOString(),
  },
  {
    id: "res-5",
    title: "Patent Filing Checklist",
    category: "Templates",
    description: "Step-by-step checklist to verify documentation requirements before submitting patents to the official administrative offices.",
    tags: ["patent", "checklist", "documentation"],
    createdAt: new Date("2026-06-08").toISOString(),
  }
];

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { setSnackbar } = useSnackbar();

  // Load resources on mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("iaire_resources");
        if (stored) {
          setResources(JSON.parse(stored));
        } else {
          localStorage.setItem("iaire_resources", JSON.stringify(INITIAL_RESOURCES));
          setResources(INITIAL_RESOURCES);
        }
      }
    } catch (error) {
      console.error("Failed to fetch resources from localStorage", error);
      setSnackbar("Error loading resources", "error");
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (data: Omit<Resource, "id" | "createdAt">) => {
    setCreating(true);
    try {
      const newResource: Resource = {
        ...data,
        id: `res-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      const updated = [newResource, ...resources];
      setResources(updated);
      localStorage.setItem("iaire_resources", JSON.stringify(updated));
      setSnackbar("Resource added successfully", "success");
      return true;
    } catch (error) {
      console.error("Failed to add resource", error);
      setSnackbar("Failed to add resource", "error");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateResource = async (id: string, data: Partial<Omit<Resource, "id" | "createdAt">>) => {
    try {
      const updated = resources.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      });
      setResources(updated);
      localStorage.setItem("iaire_resources", JSON.stringify(updated));
      setSnackbar("Resource updated successfully", "success");
      return true;
    } catch (error) {
      console.error("Failed to update resource", error);
      setSnackbar("Failed to update resource", "error");
      return false;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const updated = resources.filter((item) => item.id !== id);
      setResources(updated);
      localStorage.setItem("iaire_resources", JSON.stringify(updated));
      setSnackbar("Resource deleted successfully", "success");
      return true;
    } catch (error) {
      console.error("Failed to delete resource", error);
      setSnackbar("Failed to delete resource", "error");
      return false;
    }
  };

  return {
    resources,
    loading,
    creating,
    fetchResources,
    addResource,
    updateResource,
    deleteResource,
  };
};
