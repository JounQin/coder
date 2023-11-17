import { useTheme, type Interpolation, type Theme } from "@emotion/react";
import { BuildAvatar } from "components/BuildAvatar/BuildAvatar";
import { type FC } from "react";
import { ProvisionerJobLog, WorkspaceBuild } from "api/typesGenerated";
import { Loader } from "components/Loader/Loader";
import { Stack } from "components/Stack/Stack";
import { WorkspaceBuildLogs } from "components/WorkspaceBuildLogs/WorkspaceBuildLogs";
import {
  FullWidthPageHeader,
  PageHeaderTitle,
  PageHeaderSubtitle,
} from "components/PageHeader/FullWidthPageHeader";
import { Link } from "react-router-dom";
import { Stats, StatsItem } from "components/Stats/Stats";
import {
  displayWorkspaceBuildDuration,
  getDisplayWorkspaceBuildInitiatedBy,
  getDisplayWorkspaceBuildStatus,
} from "utils/workspace";
import { Sidebar, SidebarCaption, SidebarItem } from "./Sidebar";
import { BuildIcon } from "components/BuildIcon/BuildIcon";
import Skeleton from "@mui/material/Skeleton";
import { Alert } from "components/Alert/Alert";
import { DashboardFullPage } from "components/Dashboard/DashboardLayout";

const sortLogsByCreatedAt = (logs: ProvisionerJobLog[]) => {
  return [...logs].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
};

export interface WorkspaceBuildPageViewProps {
  logs: ProvisionerJobLog[] | undefined;
  build: WorkspaceBuild | undefined;
  builds: WorkspaceBuild[] | undefined;
  activeBuildNumber: number;
}

export const WorkspaceBuildPageView: FC<WorkspaceBuildPageViewProps> = ({
  logs,
  build,
  builds,
  activeBuildNumber,
}) => {
  const theme = useTheme();

  if (!build) {
    return <Loader />;
  }

  return (
    <DashboardFullPage>
      <FullWidthPageHeader sticky={false}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <BuildAvatar build={build} />
          <div>
            <PageHeaderTitle>Build #{build.build_number}</PageHeaderTitle>
            <PageHeaderSubtitle>{build.initiator_name}</PageHeaderSubtitle>
          </div>
        </Stack>

        <Stats aria-label="Build details" css={styles.stats}>
          <StatsItem
            css={styles.statsItem}
            label="Workspace"
            value={
              <Link
                to={`/@${build.workspace_owner_name}/${build.workspace_name}`}
              >
                {build.workspace_name}
              </Link>
            }
          />
          <StatsItem
            css={styles.statsItem}
            label="Template version"
            value={build.template_version_name}
          />
          <StatsItem
            css={styles.statsItem}
            label="Duration"
            value={displayWorkspaceBuildDuration(build)}
          />
          <StatsItem
            css={styles.statsItem}
            label="Started at"
            value={new Date(build.created_at).toLocaleString()}
          />
          <StatsItem
            css={styles.statsItem}
            label="Action"
            value={
              <span css={{ textTransform: "capitalize" }}>
                {build.transition}
              </span>
            }
          />
        </Stats>
      </FullWidthPageHeader>

      <div
        css={{
          display: "flex",
          alignItems: "start",
          overflow: "hidden",
          flex: 1,
          flexBasis: 0,
        }}
      >
        <Sidebar>
          <SidebarCaption>Builds</SidebarCaption>
          {!builds &&
            Array.from({ length: 15 }, (_, i) => (
              <BuildSidebarItemSkeleton key={i} />
            ))}

          {builds?.map((build) => (
            <BuildSidebarItem
              key={build.id}
              build={build}
              active={build.build_number === activeBuildNumber}
            />
          ))}
        </Sidebar>

        <div css={{ height: "100%", overflowY: "auto", width: "100%" }}>
          {build.transition === "delete" && build.job.status === "failed" && (
            <Alert
              severity="error"
              css={{
                borderRadius: 0,
                border: 0,
                background: theme.palette.error.dark,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <div>
                The workspace may have failed to delete due to a Terraform state
                mismatch. A template admin may run{" "}
                <code
                  css={{
                    display: "inline-block",
                    width: "fit-content",
                    fontWeight: 600,
                  }}
                >
                  {`coder rm ${
                    build.workspace_owner_name + "/" + build.workspace_name
                  } --orphan`}
                </code>{" "}
                to delete the workspace skipping resource destruction.
              </div>
            </Alert>
          )}
          {logs ? (
            <WorkspaceBuildLogs
              css={{ border: 0 }}
              logs={sortLogsByCreatedAt(logs)}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </DashboardFullPage>
  );
};

interface BuildSidebarItemProps {
  build: WorkspaceBuild;
  active: boolean;
}

const BuildSidebarItem: FC<BuildSidebarItemProps> = ({ build, active }) => {
  const theme = useTheme();

  return (
    <Link
      key={build.id}
      to={`/@${build.workspace_owner_name}/${build.workspace_name}/builds/${build.build_number}`}
    >
      <SidebarItem active={active}>
        <div css={{ display: "flex", alignItems: "start", gap: 8 }}>
          <BuildIcon
            transition={build.transition}
            css={{
              width: 16,
              height: 16,
              color:
                theme.palette[getDisplayWorkspaceBuildStatus(theme, build).type]
                  .light,
            }}
          />
          <div css={{ overflow: "hidden" }}>
            <div
              css={{
                textTransform: "capitalize",
                color: theme.palette.text.primary,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {build.transition} by{" "}
              <strong>{getDisplayWorkspaceBuildInitiatedBy(build)}</strong>
            </div>
            <div
              css={{
                fontSize: 12,
                color: theme.palette.text.secondary,
                marginTop: 2,
              }}
            >
              {displayWorkspaceBuildDuration(build)}
            </div>
          </div>
        </div>
      </SidebarItem>
    </Link>
  );
};

const BuildSidebarItemSkeleton: FC = () => {
  return (
    <SidebarItem>
      <div css={{ display: "flex", alignItems: "start", gap: 8 }}>
        <Skeleton variant="circular" width={16} height={16} />
        <div>
          <Skeleton variant="text" width={94} height={16} />
          <Skeleton
            variant="text"
            width={60}
            height={14}
            css={{ marginTop: 2 }}
          />
        </div>
      </div>
    </SidebarItem>
  );
};

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
