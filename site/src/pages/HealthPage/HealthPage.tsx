import { type Interpolation, type Theme, useTheme } from "@emotion/react";
import { useQuery } from "react-query";
import { getHealth } from "api/api";
import { Loader } from "components/Loader/Loader";
import { useTab } from "hooks";
import { Helmet } from "react-helmet-async";
import { pageTitle } from "utils/page";
import { colors } from "theme/colors";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { SyntaxHighlighter } from "components/SyntaxHighlighter/SyntaxHighlighter";
import { Stack } from "components/Stack/Stack";
import {
  FullWidthPageHeader,
  PageHeaderTitle,
  PageHeaderSubtitle,
} from "components/PageHeader/FullWidthPageHeader";
import { Stats, StatsItem } from "components/Stats/Stats";
import { createDayString } from "utils/createDayString";
import { DashboardFullPage } from "components/Dashboard/DashboardLayout";

const sections = {
  derp: "DERP",
  access_url: "Access URL",
  websocket: "Websocket",
  database: "Database",
} as const;

export default function HealthPage() {
  const tab = useTab("tab", "derp");
  const { data: healthStatus } = useQuery({
    queryKey: ["health"],
    queryFn: () => getHealth(),
    refetchInterval: 120_000,
  });

  return (
    <>
      <Helmet>
        <title>{pageTitle("Health")}</title>
      </Helmet>

      {healthStatus ? (
        <HealthPageView healthStatus={healthStatus} tab={tab} />
      ) : (
        <Loader />
      )}
    </>
  );
}

export function HealthPageView({
  healthStatus,
  tab,
}: {
  healthStatus: Awaited<ReturnType<typeof getHealth>>;
  tab: ReturnType<typeof useTab>;
}) {
  const theme = useTheme();

  return (
    <DashboardFullPage>
      <FullWidthPageHeader sticky={false}>
        <Stack direction="row" spacing={2} alignItems="center">
          {healthStatus.healthy ? (
            <CheckCircleOutlined
              css={{
                width: 32,
                height: 32,
                color: theme.palette.success.light,
              }}
            />
          ) : (
            <ErrorOutline
              css={{
                width: 32,
                height: 32,
                color: theme.palette.error.main,
              }}
            />
          )}

          <div>
            <PageHeaderTitle>
              {healthStatus.healthy ? "Healthy" : "Unhealthy"}
            </PageHeaderTitle>
            <PageHeaderSubtitle>
              {healthStatus.healthy
                ? "All systems operational"
                : "Some issues have been detected"}
            </PageHeaderSubtitle>
          </div>
        </Stack>

        <Stats aria-label="Deployment details" css={styles.stats}>
          <StatsItem
            css={styles.statsItem}
            label="Last check"
            value={createDayString(healthStatus.time)}
          />
          <StatsItem
            css={styles.statsItem}
            label="Coder version"
            value={healthStatus.coder_version}
          />
        </Stats>
      </FullWidthPageHeader>
      <div
        css={{
          display: "flex",
          flexBasis: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          css={{
            width: 256,
            flexShrink: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <div
            css={{
              fontSize: 10,
              textTransform: "uppercase",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              padding: "12px 24px",
              letterSpacing: "0.5px",
            }}
          >
            Health
          </div>
          <nav>
            {Object.keys(sections)
              .sort()
              .map((key) => {
                const label = sections[key as keyof typeof sections];
                const isActive = tab.value === key;
                const isHealthy =
                  healthStatus[key as keyof typeof sections].healthy;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      tab.set(key);
                    }}
                    css={{
                      background: isActive ? colors.gray[13] : "none",
                      border: "none",
                      fontSize: 14,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                      height: 36,
                      padding: "0 24px",
                      cursor: "pointer",
                      pointerEvents: isActive ? "none" : "auto",
                      color: isActive
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                      "&:hover": {
                        background: theme.palette.action.hover,
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    {isHealthy ? (
                      <CheckCircleOutlined
                        css={{
                          width: 16,
                          height: 16,
                          color: theme.palette.success.light,
                        }}
                      />
                    ) : (
                      <ErrorOutline
                        css={{
                          width: 16,
                          height: 16,
                          color: theme.palette.error.main,
                        }}
                      />
                    )}
                    {label}
                  </button>
                );
              })}
          </nav>
        </div>
        <div css={{ overflowY: "auto", width: "100%" }} data-chromatic="ignore">
          <SyntaxHighlighter
            language="json"
            editorProps={{ height: "100%" }}
            value={JSON.stringify(
              healthStatus[tab.value as keyof typeof healthStatus],
              null,
              2,
            )}
          />
        </div>
      </div>
    </DashboardFullPage>
  );
}

const styles = {
  stats: (theme) => ({
    padding: 0,
    border: 0,
    gap: 48,
    rowGap: 24,
    flex: 1,

    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 8,
    },
  }),

  statsItem: {
    flexDirection: "column",
    gap: 0,
    padding: 0,

    "& > span:first-of-type": {
      fontSize: 12,
      fontWeight: 500,
    },
  },
} satisfies Record<string, Interpolation<Theme>>;
