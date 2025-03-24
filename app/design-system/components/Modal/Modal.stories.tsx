import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta = {
  title: "Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { children: "Modal" },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Modal",
    isOpen: true,
    onClose: () => undefined,
  },
};
