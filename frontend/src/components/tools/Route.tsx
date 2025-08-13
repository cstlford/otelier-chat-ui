import { makeAssistantToolUI, AssistantToolUI } from "@assistant-ui/react";
import { useEffect, useState } from "react";

export const RouteUI = makeAssistantToolUI({
  toolName: "route",
  render: ({ args, result, status }) => {
    return (
      <div className="mb-4 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 p-4 border border-purple-200 animate-in slide-in-from-right duration-300">
        {/* Animated routing icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200">
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 border-2 border-purple-600 border-r-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-1 bg-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Routing message */}
        <div className="flex-1">
          <p className="text-purple-800 font-medium">
            <span className="text-purple-600">Routing to:</span>{" "}
            <span className="font-semibold text-purple-900">
              {String(args?.destination || args?.route || "destination")}
            </span>
          </p>
          {args?.message && (
            <p className="text-sm text-purple-600 mt-1 opacity-80">
              {String(args.message)}
            </p>
          )}
        </div>

        {/* Animated arrow */}
        <div className="text-purple-600">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  },
});
