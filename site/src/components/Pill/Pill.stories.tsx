import { Pill } from "./Pill";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Pill> = {
  title: "components/Pill",
  component: Pill,
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Danger: Story = {
  args: {
    text: "Danger",
    type: "danger",
  },
};

export const Error: Story = {
  args: {
    text: "Error",
    type: "error",
  },
};

export const Warning: Story = {
  args: {
    text: "Warning",
    type: "warning",
  },
};

export const Notice: Story = {
  args: {
    text: "Notice",
    type: "notice",
  },
};

export const Info: Story = {
  args: {
    text: "Information",
    type: "info",
  },
};

export const Success: Story = {
  args: {
    text: "Success",
    type: "success",
  },
};

export const Active: Story = {
  args: {
    text: "Active",
    type: "active",
  },
};

// export const InfoLight: Story = {
//   args: {
//     text: "Information",
//     type: "info",
//     lightBorder: true,
//   },
// };

export const Default: Story = {
  args: {
    text: "Neutral/default",
  },
};

export const DefaultLight: Story = {
  args: {
    text: "Neutral/default",
    lightBorder: true,
  },
};

// export const WarningLight: Story = {
//   args: {
//     text: "Warning",
//     type: "warning",
//     lightBorder: true,
//   },
// };
