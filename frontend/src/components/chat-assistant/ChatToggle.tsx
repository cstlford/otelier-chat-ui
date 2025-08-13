import ChatInterface from "./ChatInterface";
import { useState } from "react";
import bot from "@/assets/bot.svg";
import hoverBot from "@/assets/bot-hover.svg";

export function ChatToggle() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };
  return (
    <>
      {!open && (
        <div
          className=""
          onClick={() => setOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={isHovered ? hoverBot : bot}
            alt=""
            className="w-14 cursor-pointer rounded-full shadow-[0_0_3px_1px_rgba(255,255,255,0.1),0_0_3px_1px_rgba(255,0,255,0.1),0_0_3px_1px_rgba(0,255,255,0.1)] hover:shadow-[0_0_6px_3px_rgba(255,255,255,0.1),0_0_6px_2px_rgba(255,0,255,0.3),0_0_6px_3px_rgba(0,255,255,0.2)] transition-all duration-300"
          />
        </div>
      )}
      {open && (
        <div
          className={`w-120 h-[580px] z-[998] origin-bottom-right ${
            isClosing
              ? "animate-out zoom-out-95 slide-out-to-bottom-2 duration-300"
              : "animate-in zoom-in-95 slide-in-from-bottom-2 duration-300"
          }`}
        >
          <ChatInterface onClose={handleClose} />
        </div>
      )}
    </>
  );
}
