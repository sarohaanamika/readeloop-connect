
import { useState, useEffect } from "react";
import { Book } from "@/lib/types";
import { getRecommendations } from "@/lib/data";

export const useRecommendations = (userId: string) => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);

  useEffect(() => {
    if (userId) {
      // In a real app, this would be an API call
      const userRecommendations = getRecommendations(userId);
      setRecommendations(userRecommendations);
    }
  }, [userId]);

  return { recommendations };
};
