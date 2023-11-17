/* eslint-disable react-hooks/exhaustive-deps -- false positives */

import { css } from "@emotion/css";
import { type DependencyList, useMemo } from "react";
import { type Theme, useTheme } from "@emotion/react";

/**
 * An escape hatch for when you really need to manually pass around a
 * `className`. Prefer using the `css` prop whenever possible. If you
 * can't use that, then this might be helpful for you.
 */
export function useClassName(
  styles: (cssFn: typeof css, theme: Theme) => string,
  deps: DependencyList,
): string {
  const theme = useTheme();
  const className = useMemo(() => {
    return styles(css, theme);
  }, [...deps, theme]);

  return className;
}
