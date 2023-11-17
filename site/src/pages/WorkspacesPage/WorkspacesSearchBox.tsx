/* eslint-disable eslint-comments/no-unlimited-disable -- no u */
/* eslint-disable -- no u */

/**
 * @file Defines a controlled searchbox component for processing form state.
 *
 * Not defined as a top-level component just yet, because it's not clear how
 * reusable this is outside of workspace dropdowns.
 */
import {
  type ForwardedRef,
  type KeyboardEvent,
  type InputHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { visuallyHidden } from "@mui/utils";
import { useTheme } from "@emotion/react";

interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  onValueChange: (newValue: string) => void;
}

export const SearchBox = forwardRef(function SearchBox(
  props: SearchBoxProps,
  ref?: ForwardedRef<HTMLInputElement>,
) {
  const {
    onValueChange,
    onKeyDown,
    label = "Search",
    placeholder = "Search...",
    ...attrs
  } = props;

  const hookId = useId();
  const theme = useTheme();

  const inputId = `${hookId}-${SearchBox.name}-input`;

  return (
    <div
      css={{
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        padding: "0 8px",
        height: "40px",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- try to figure out if we actually need this
      onKeyDown={onKeyDown}
    >
      <div css={{ width: 18 }}>
        <SearchIcon
          css={{
            display: "block",
            fontSize: "14px",
            margin: "auto 0",
            color: theme.palette.text.secondary,
          }}
        />
      </div>

      <label css={{ ...visuallyHidden }} htmlFor={inputId}>
        {label}
      </label>

      <input
        type="text"
        ref={ref}
        id={inputId}
        autoFocus
        tabIndex={0}
        placeholder={placeholder}
        {...attrs}
        onChange={(e) => onValueChange(e.target.value)}
        css={{
          height: "100%",
          border: 0,
          background: "none",
          width: "100%",
          outline: 0,
          "&::placeholder": {
            color: theme.palette.text.secondary,
          },
        }}
      />
    </div>
  );
});
