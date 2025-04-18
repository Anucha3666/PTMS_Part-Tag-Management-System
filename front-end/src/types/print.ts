export type TPrintTag = {
  process: string;
  parts: TPrintTagPart[];
};

export type TPrintTagPart = {
  part_id: string;
  number_of_tags: number;
};
