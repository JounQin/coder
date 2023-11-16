import Typography from "@mui/material/Typography";
import { type FC, type ReactNode } from "react";
import { type Interpolation, type Theme } from "@emotion/react";
import { EnterpriseBadge } from "components/Badges/Badges";
import { Stack } from "components/Stack/Stack";

export interface PaywallProps {
  children?: ReactNode;
  message: string;
  description?: string | ReactNode;
  cta?: ReactNode;
}

export const Paywall: FC<PaywallProps> = ({ message, description, cta }) => {
  return (
    <div css={styles.root}>
      <div css={{ marginBottom: 24 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography variant="h5" css={styles.title}>
            {message}
          </Typography>
          <EnterpriseBadge />
        </Stack>

        {description && (
          <Typography
            variant="body2"
            color="textSecondary"
            css={styles.description}
          >
            {description}
          </Typography>
        )}
      </div>
      {cta}
    </div>
  );
};

const styles = {
  root: (theme) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: 300,
    padding: 24,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
  }),
  title: {
    fontWeight: 600,
    fontFamily: "inherit",
  },
  description: {
    marginTop: 8,
    fontFamily: "inherit",
    maxWidth: 420,
    lineHeight: "160%",
  },
} satisfies Record<string, Interpolation<Theme>>;
