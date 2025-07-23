import { makeAssistantToolUI, AssistantToolUI } from "@assistant-ui/react";

export const MultiplyUI = makeAssistantToolUI({
  toolName: "multiply",
  render: ({ args, result, status }) => {
    return (
      <div className="bg-neutral-900 p-1 rounded-lg">
        <p className="text-white">Multiplying stuff</p>
      </div>
    );
  },
});
