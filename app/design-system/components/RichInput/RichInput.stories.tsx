import type { Meta, StoryObj } from "@storybook/react";
import { RichInput } from "./RichInput";
import type { User } from "~/entities/user";

const meta = {
  title: "Rich Input",
  component: RichInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RichInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const users: User[] = [
  {
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
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    username: "janedoe",
    email: "jane.doe@example.com",
    phone: "1234567890",
    location: {
      city: "New York",
      postcode: 10001,
      state: "NY",
      street: "123 Main St",
    },
  },
  {
    firstName: "John",
    lastName: "Smith",
    username: "johnsmith",
    email: "john.smith@example.com",
    phone: "1234567890",
    location: {
      city: "New York",
      postcode: 10001,
      state: "NY",
      street: "123 Main St",
    },
  },
];

export const Basic: Story = {
  args: { users },
};
