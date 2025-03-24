import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { label: "Input label" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Input",
  },
};
