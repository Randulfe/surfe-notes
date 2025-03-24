import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import type { User } from "~/entities/user";
import { useRef, useState, useEffect } from "react";

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

const meta = {
  title: "Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [query, setQuery] = useState("");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const inputRef = useRef<HTMLInputElement>(null);
    const dropDownRef = useRef(null);

    const onChange = (user: User) => {
      setQuery(user.username);
    };

    useEffect(() => {
      const updatePosition = () => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.bottom });
      };

      updatePosition();
    }, []);

    return (
      <>
        <input
          ref={inputRef}
          type="text"
          className="mb-2 rounded-sm border-2 border-solid border-gray-300"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <Dropdown
          ref={dropDownRef}
          {...args}
          query={query}
          // @ts-expect-error - TS doesn't infer well forwardRefs with generics
          onSelect={onChange}
          position={position}
        />
      </>
    );
  },
  args: {
    data: users,
    labelKey: "username",
    displayKeys: ["firstName", "lastName"],
    prefix: "@",
    query: "",
    onSelect: () => undefined,
  },
};
