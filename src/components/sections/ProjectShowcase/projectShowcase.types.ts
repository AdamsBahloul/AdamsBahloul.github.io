import type { Project } from '../../../types/project';

export type ProjectSlideProps = {
  project: Project;
  index: number;
  total: number;
};

export type ProjectImageProps = {
  src: string;
  alt: string;
  priority: boolean;
  index: number;
};
