import { GET_TAG, GET_TAGS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TTag, TTagView, TValidationTag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { TagService } from "../tag.service";

export const useTag = () => {
  const { getTags, getTag, validationTag } = new TagService();

  const useGetTag = (tag_no: string, tag_id: string) => {
    return useQuery({
      queryKey: [GET_TAG, tag_no, tag_id],
      queryFn: async (): Promise<TTagView> => await getTag(tag_no, tag_id),
    });
  };

  const useGetTags = () => {
    return useQuery({
      queryKey: [GET_TAGS],
      queryFn: async (): Promise<TTag[]> => await getTags(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutateValidationTag } = useMutationWithNotification(
    async (req: TValidationTag) => await validationTag(req),
    "Printing...",
    [GET_TAGS]
  );

  return {
    useGetTag,
    useGetTags,
    mutateValidationTag,
  };
};
