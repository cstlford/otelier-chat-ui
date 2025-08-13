import { ToolCallContentPartComponent } from "@assistant-ui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  argsText,
  result,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className="mb-4 flex w-full flex-col gap-3 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 py-3 shadow-sm">
      <div className="flex items-center gap-2 px-4">
        <CheckIcon className="size-4 text-purple-600" />
        <p className="text-purple-800 font-medium">
          Used tool:{" "}
          <span className="font-semibold text-purple-900">{toolName}</span>
        </p>
        <div className="flex-grow" />
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-lg p-2 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-2 border-t border-purple-200 pt-2">
          <div className="px-4">
            <pre className="whitespace-pre-wrap text-sm text-purple-700 bg-white/50 rounded-lg p-3 border border-purple-100">
              {argsText}
            </pre>
          </div>
          {result !== undefined && (
            <div className="border-t border-dashed border-purple-200 px-4 pt-2">
              <p className="font-semibold text-purple-800 mb-2">Result:</p>
              <pre className="whitespace-pre-wrap text-sm text-purple-700 bg-white/50 rounded-lg p-3 border border-purple-100">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
