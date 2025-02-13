import { type ComponentProps, type FC } from "react";
import type * as TypesGen from "api/typesGenerated";
import { type GroupsByUserId } from "api/queries/groups";

import { UsersTable } from "./UsersTable/UsersTable";
import { UsersFilter } from "./UsersFilter";
import {
  PaginationStatus,
  TableToolbar,
} from "components/TableToolbar/TableToolbar";
import { PaginationWidgetBase } from "components/PaginationWidget/PaginationWidgetBase";

export interface UsersPageViewProps {
  users?: TypesGen.User[];
  roles?: TypesGen.AssignableRoles[];
  isUpdatingUserRoles?: boolean;
  canEditUsers: boolean;
  oidcRoleSyncEnabled: boolean;
  canViewActivity?: boolean;
  isLoading: boolean;
  authMethods?: TypesGen.AuthMethods;
  onSuspendUser: (user: TypesGen.User) => void;
  onDeleteUser: (user: TypesGen.User) => void;
  onListWorkspaces: (user: TypesGen.User) => void;
  onViewActivity: (user: TypesGen.User) => void;
  onActivateUser: (user: TypesGen.User) => void;
  onResetUserPassword: (user: TypesGen.User) => void;
  onUpdateUserRoles: (
    user: TypesGen.User,
    roles: TypesGen.Role["name"][],
  ) => void;
  filterProps: ComponentProps<typeof UsersFilter>;
  isNonInitialPage: boolean;
  actorID: string;
  groupsByUserId: GroupsByUserId | undefined;

  // Pagination
  count?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const UsersPageView: FC<React.PropsWithChildren<UsersPageViewProps>> = ({
  users,
  roles,
  onSuspendUser,
  onDeleteUser,
  onListWorkspaces,
  onViewActivity,
  onActivateUser,
  onResetUserPassword,
  onUpdateUserRoles,
  isUpdatingUserRoles,
  canEditUsers,
  oidcRoleSyncEnabled,
  canViewActivity,
  isLoading,
  filterProps,
  isNonInitialPage,
  actorID,
  authMethods,
  count,
  limit,
  onPageChange,
  page,
  groupsByUserId,
}) => {
  return (
    <>
      <UsersFilter {...filterProps} />

      <TableToolbar>
        <PaginationStatus
          isLoading={Boolean(isLoading)}
          showing={users?.length ?? 0}
          total={count ?? 0}
          label="users"
        />
      </TableToolbar>

      <UsersTable
        users={users}
        roles={roles}
        groupsByUserId={groupsByUserId}
        onSuspendUser={onSuspendUser}
        onDeleteUser={onDeleteUser}
        onListWorkspaces={onListWorkspaces}
        onViewActivity={onViewActivity}
        onActivateUser={onActivateUser}
        onResetUserPassword={onResetUserPassword}
        onUpdateUserRoles={onUpdateUserRoles}
        isUpdatingUserRoles={isUpdatingUserRoles}
        canEditUsers={canEditUsers}
        oidcRoleSyncEnabled={oidcRoleSyncEnabled}
        canViewActivity={canViewActivity}
        isLoading={isLoading}
        isNonInitialPage={isNonInitialPage}
        actorID={actorID}
        authMethods={authMethods}
      />

      {count !== undefined && (
        <PaginationWidgetBase
          totalRecords={count}
          pageSize={limit}
          onPageChange={onPageChange}
          currentPage={page}
        />
      )}
    </>
  );
};
