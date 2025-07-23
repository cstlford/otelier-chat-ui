import ChatInterface from "./ChatInterface";
import { useState } from "react";
import bot from "@/assets/bot.svg";

export function ChatToggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <div
          className="rounded-full w-14 h-14 z-[999] shadow-xl hover:shadow-2xl flex justify-center items-center cursor-pointer bg-[linear-gradient(45deg,#397FA0,#985db5)]"
          onClick={() => setOpen(true)}
        >
          <img src={bot} alt="" className="w-10" />
        </div>
      )}
      {open && (
        <div className="w-110 h-[550px] z-[998]">
          <ChatInterface onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
