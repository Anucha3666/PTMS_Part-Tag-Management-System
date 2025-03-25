import { GET_TAG, GET_TAGS } from "@/constants";
import { TTag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { TagService } from "../tag.service";

export const useTag = () => {
  const { getTags, getTag } = new TagService();

  const useGetTags = () => {
    return useQuery({
      queryKey: [GET_TAGS],
      queryFn: async (): Promise<TTag[]> => await getTags(),
      refetchInterval: 300000,
    });
  };

  const useGetTag = (tag_id: string) => {
    return useQuery({
      queryKey: [GET_TAG, tag_id],
      queryFn: async (): Promise<TTag> => await getTag(tag_id),
    });
  };

  return {
    useGetTags,
    useGetTag,
  };
};
