export type Epigraph = {
  text: string;
  attribution: string;
};

export type Chapter = {
  number: number;
  title: string;
  paragraphs: string[];
};

export type BookContent = {
  id: string;
  volume: number;
  title: string;
  series: string;
  subtitle: string;
  dedication: string;
  epigraph: Epigraph;
  chapters: Chapter[];
  wordCount: number;
};

export type BookMeta = {
  id: string;
  volume: number;
  roman: string;
  title: string;
  series: string;
  subtitle: string;
  cover: string;
  docx: string;
  filename: string;
  dedication: string;
  epigraph: Epigraph;
  synopsis: string;
};
