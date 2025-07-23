import type { Meta, StoryObj } from "@storybook/react-vite";
import { BIApp } from "../BIApp";
import { BIAppConfig } from "../types/BITypes";
import "../styles/tailwind.css";

const meta = {
  title: "Charms",
  component: BIApp,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `BIApp` component renders the full Charms assistant interface. It requires two props:\n`url` – the backend endpoint for the assistant API, and \n`token` – a JWT used for authenticating API requests. The assistant will appear as a floating toggle button, styled for embedding into dashboards or apps.",
      },
    },
  },
} satisfies Meta<typeof BIApp>;

export default meta;

type Story = StoryObj<typeof meta>;

const args: BIAppConfig = {
  url: "http://localhost:8000/api",
  token: "my-secret-token",
};
export const Default: Story = {
  args: args,

  render: (args) => (
    <div className="flex bg-gray-800 min-h-[600px] w-screen">
      <div className="bottom-8 right-8 fixed">
        <BIApp {...args} />
      </div>
    </div>
  ),
};
