import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn(), size: "m", children: "Button", variant: "primary" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
    type: "submit",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "l",
    children: "Button",
  },
};
