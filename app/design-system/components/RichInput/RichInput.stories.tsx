import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { RichInput } from "./RichInput";

const meta = {
  title: "Rich Input",
  component: RichInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof RichInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
