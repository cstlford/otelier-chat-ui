import type { Meta, StoryObj } from "@storybook/react-vite";
import { BIApp } from "../BIApp";
import { BIAppConfig } from "../types/BITypes";
import "../styles/tailwind.css";
import { ToolFallback } from "@/components/tools/ToolFallback";

const meta = {
  title: "Tool Fallback",
  component: ToolFallback,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const args = {
  status: { type: "running" } as const,
  addResult: () => {},
  toolCallId: "12345",
  toolName: "hehe",
  args: {},
  argsText: "<argsText>",
  type: "tool-call" as const,
};
export const Default: Story = {
  args: args,
  render: (args) => (
    <div className="bg-[#ffffff]">
      <ToolFallback {...args} />
    </div>
  ),
};
