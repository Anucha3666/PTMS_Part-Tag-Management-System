/**
 * The function `requestFullscreen` enables full-screen mode for the document's root element in a
 * TypeScript React application.
 */
export const requestFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  }
};

/**
 * The function `exitFullscreen` checks if the document is in full-screen mode and exits it if so,
 * handling any errors that may occur.
 */
export const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.error(
        `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
      );
    });
  }
};

/**
 * The function `toggleFullScreen` checks if the document is in fullscreen mode and either requests
 * fullscreen if not, or exits fullscreen if already in fullscreen mode.
 */
export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    requestFullscreen();
  } else {
    exitFullscreen();
  }
};

/**
 * This function determines the screen size based on the width and returns a size category from "3xl"
 * to "base".
 * @returns The function `screenSize` returns an object with properties `width`, `height`, and `size`.
 * The `width` and `height` properties are numbers representing the screen dimensions, and the `size`
 * property is a string indicating the screen size category based on the width. The possible values for
 * `size` are "3xl", "2xl", "xl", "lg", "md
 */
export const screenSize = (): {
  width: number;
  height: number;
  size: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "base";
} => {
  const screenWidth = window.innerWidth ?? 0;
  const screenHeight = window.innerHeight ?? 0;

  const Size = {
    width: screenWidth,
    height: screenHeight,
    size:
      screenWidth >= 1920
        ? "3xl"
        : screenWidth >= 1536
        ? "2xl"
        : screenWidth >= 1280
        ? "xl"
        : screenWidth >= 1024
        ? "lg"
        : screenWidth >= 768
        ? "md"
        : screenWidth >= 640
        ? "sm"
        : "base",
  };

  return Size as {
    width: number;
    height: number;
    size: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "base";
  };
};

/* The `export const screenUtils` object is creating a module-level export in the TypeScript React
application. It is essentially exporting an object that contains references to the
`requestFullscreen`, `exitFullscreen`, and `toggleFullScreen` functions defined earlier in the code. */
export const screenUtils = {
  request: requestFullscreen,
  exit: exitFullscreen,
  toggle: toggleFullScreen,
  size: screenSize,
};
