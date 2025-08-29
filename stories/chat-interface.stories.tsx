import type { Meta, StoryObj } from "@storybook/react-vite";
import Otelia from "../src/otelia";

const meta = {
  title: "Example/Othelia Interface",
  component: Otelia,
  tags: ["autodocs"],
} satisfies Meta<typeof Otelia>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    url: "http://localhost:8000/api",
    application: {
      name: "IntelliSight",
      description:
        "Centralize data across your hospitality enterprise and rely on automated reports and dynamic visualizations to help you run a smarter hospitality business.",
    },
    organizationId: 38,
    jwt: "example-jwt-token",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        height: "700px",
        background: "#232323ff",
        padding: "1rem",
      }}
    >
      <Otelia {...args} />
    </div>
  ),
};
