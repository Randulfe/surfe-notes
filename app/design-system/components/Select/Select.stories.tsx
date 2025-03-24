import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { type Option, Select } from "./Select";

const options: Option[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const meta = {
  title: "Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { options, selectedOption: options[0], onChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    options,
    selectedOption: options[0],
    onChange: fn(),
  },
};
