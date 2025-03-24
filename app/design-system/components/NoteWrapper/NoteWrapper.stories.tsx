import type { Meta, StoryObj } from "@storybook/react";
import { NoteWrapper } from "./NoteWrapper";

const meta = {
  title: "NoteWrapper",
  component: NoteWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { children: "NoteWrapper" },
} satisfies Meta<typeof NoteWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <p>NoteWrapper</p>,
  },
};
