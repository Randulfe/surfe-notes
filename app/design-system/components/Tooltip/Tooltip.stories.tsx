import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import type { User } from "~/entities/user";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const user: User = {
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  phone: "1234567890",
  location: {
    city: "New York",
    postcode: 10001,
    state: "NY",
    street: "123 Main St",
  },
};

export const Basic: Story = {
  args: {
    user,
  },
};
