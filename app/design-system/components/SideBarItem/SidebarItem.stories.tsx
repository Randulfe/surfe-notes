import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItem } from "./SidebarItem";

const meta = {
  title: "SidebarItem",
  component: SidebarItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { content: "Note 1" },
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
};
