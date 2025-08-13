import type { Meta, StoryObj } from "@storybook/react-vite";
import { BIApp } from "../BIApp";
import { BIAppConfig } from "../types/BITypes";
import "../styles/tailwind.css";

const meta = {
  title: "Otelia",
  component: BIApp,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
} satisfies Meta<typeof BIApp>;

export default meta;

type Story = StoryObj<typeof meta>;

const args: BIAppConfig = {
  url: "http://localhost:8002/api",
  token: "my-secret-token",
};
export const Default: Story = {
  args: args,

  render: (args) => (
    <div className="flex bg-[#2a2a2a] min-h-[630px] w-screen">
      <div className="bottom-8 right-8 fixed">
        <BIApp {...args} />
      </div>
    </div>
  ),
};
