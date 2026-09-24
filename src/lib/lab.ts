import { getCollection, type CollectionEntry } from 'astro:content';

export type LabEntry = CollectionEntry<'lab'>;

export const groups = [
  {
    key: 'production',
    title: 'Production & Pipeline',
    intro: 'Systems built for a real in-house team: boards, concepts, generative footage and the archive underneath it all.',
  },
  {
    key: 'midjourney',
    title: 'Look Development',
    intro:
      'Four years of look development in Midjourney: format emulation, lighting studies and motion tests. I prompt like a DP — pick a lens, a stock, a light, a format — and see what holds up.',
  },
  {
    key: 'methods',
    title: 'Methods',
    intro: 'How I work with AI in production. These are the habits that connect everything above.',
  },
] as const;

export const statusLabels = { 'in-use': 'In use', shipped: 'Shipped', experiment: 'Experiment', ongoing: 'Ongoing' } as const;

/** Published entries only in production; everything (flagged) in `npm run dev`. */
export async function getLabEntries(): Promise<LabEntry[]> {
  const all = await getCollection('lab', ({ data }) => (import.meta.env.PROD ? data.pending.length === 0 : true));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const labAnchor = (code: string) => code.toLowerCase();
