import { site } from '../site.config';
import { getLabEntries } from './lab';

/** Site navigation, minus any section that has nothing published yet. */
export async function getNav() {
  const hasLab = (await getLabEntries()).length > 0;
  return site.nav.filter((item) => item.href !== '/lab' || hasLab);
}
