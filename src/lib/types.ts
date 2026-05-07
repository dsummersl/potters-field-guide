export interface SiteItem {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  extras: Record<string, string>;
}
