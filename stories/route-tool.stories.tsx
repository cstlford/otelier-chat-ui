import type { Meta, StoryObj } from "@storybook/react-vite";
import RouteTool from "../src/components/RouteTool";

const meta = {
  title: "Example/Route Tool",
  component: RouteTool,
  tags: ["autodocs"],
} satisfies Meta<typeof RouteTool>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    args: {
      destination: "Paris",
      route: "Direct",
      message: "Your route is being prepared...",
    },
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
      <RouteTool {...args} />
    </div>
  ),
};
