import type { Meta, StoryObj } from "@storybook/react";
import { Mention } from "./Mention";
import type { User } from "~/entities/user";

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

const meta = {
  title: "Mention",
  component: Mention,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Mention>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    user,
  },
};
