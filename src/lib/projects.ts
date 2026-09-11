import { supabase } from "./supabase";
import { Project, MainCategory } from "../types";

interface ProjectRow {
  id: string;
  title: string;
  main_category: MainCategory;
  subcategory: string;
  youtube_id: string;
  thumbnail_url: string | null;
  description: string;
  featured: boolean;
  work_items: string[];
  created_at: string;
}

function fromRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    mainCategory: row.main_category,
    subcategory: row.subcategory,
    youtubeId: row.youtube_id,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    description: row.description,
    featured: row.featured,
    workItems: row.work_items,
    createdAt: row.created_at,
  };
}

function toRow(project: Project) {
  return {
    id: project.id,
    title: project.title,
    main_category: project.mainCategory,
    subcategory: project.subcategory,
    youtube_id: project.youtubeId,
    thumbnail_url: project.thumbnailUrl ?? null,
    description: project.description,
    featured: project.featured,
    work_items: project.workItems,
    created_at: project.createdAt,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(fromRow);
}

export async function insertProject(project: Project): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert(toRow(project))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as ProjectRow);
}

export async function updateProject(project: Project): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(toRow(project))
    .eq("id", project.id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as ProjectRow);
}

export async function deleteProjectById(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}