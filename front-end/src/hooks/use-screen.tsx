import { screenUtils } from "@/utils";
import { useEffect, useState } from "react";

export const useScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(true);
      screenUtils.request();
    } else {
      setIsFullScreen(false);
      screenUtils.exit();
    }
  };

  useEffect(() => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  }, []);

  return { toggleScreen: toggleFullScreen, isFullScreen };
};
