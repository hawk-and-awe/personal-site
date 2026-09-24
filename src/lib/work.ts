import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'work'>;

export const typeLabels = {
  motion: 'Motion',
  'live-action': 'Live Action',
} as const;

/** All published projects, in display order. Drafts show up in `npm run dev` only. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('work', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return all.sort((a, b) => a.data.order - b.data.order || (b.data.year ?? 0) - (a.data.year ?? 0));
}

export const projectUrl = (p: Project) => `/work/${p.id}/`;
export const mediaName = (p: Project) => `media-${p.id}`;
export const typesText = (p: Project) => p.data.types.map((t) => typeLabels[t]).join(' + ');
