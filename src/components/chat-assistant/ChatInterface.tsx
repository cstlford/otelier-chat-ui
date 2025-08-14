import {
  AssistantRuntimeProvider,
  ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import bot from "@/assets/bot-hover.svg";
import { useBIAppConfig } from "@/context/BIAppConfig";
import { useQuery } from "@tanstack/react-query";
import { getUserContext } from "@/api/user";
import { useUserState } from "@/context/UserState";
import { createModelAdapter } from "@/api/modelAdapter";
import close from "@/assets/close.svg";
import { RouteUI } from "../tools/Route";

const ChatInterface = ({ onClose }: { onClose: () => void }) => {
  const nodeRef = useRef(null);
  const { url, token } = useBIAppConfig();
  const { dispatch } = useUserState();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserContext"],
    queryFn: () => getUserContext(url, token),
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_ORGANIZATION_ID", payload: data.organizationId });
      dispatch({
        type: "SET_HOTELS",
        payload: data.hotels,
      });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      alert("Failed to load user context. Please try again later.");
      onClose();
    }
  }, [error]);

  const { organizationId, selectedHotelIds, hotels } = useUserState();

  let hotelIdsToSend = selectedHotelIds.length > 0 ? selectedHotelIds : hotels;

  const ModelAdapter: ChatModelAdapter = createModelAdapter(
    url,
    token,
    organizationId ? organizationId : "",
    hotelIdsToSend
  );

  const runtime = useLocalRuntime(ModelAdapter);

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div
        ref={nodeRef}
        className="flex flex-col h-full rounded-2xl shadow-2xl bg-[linear-gradient(45deg,#397FA0,#985db5)]"
      >
        <div className="drag-handle text-center px-3 py-2 flex items-center justify-between bg-[rgb(255,255,255,.3)] rounded-t-2xl">
          <div className="relative w-8 h-8 p-[3px] flex items-center justify-center bg-[linear-gradient(45deg,#E71D36,#FF9F1C)] rounded-full">
            <img src={bot} alt="" />
            {isLoading ? (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#cd3232] rounded-full border-1 border-white"></div>
            ) : (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#32CD32] rounded-full border-1 border-white">
                <div className="absolute inset-0 rounded-full bg-[#32CD32] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
              </div>
            )}
          </div>
          <div>
            <p
              className="text-xl font-semibold text-[#ffffff] tracking-wide"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Otelia
            </p>
          </div>

          <div
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/20 cursor-pointer"
          >
            <img src={close} alt="Close" className="w-4 " />
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-white">
            Loading...
          </div>
        ) : (
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
            <RouteUI />
          </AssistantRuntimeProvider>
        )}
      </div>
    </Draggable>
  );
};

export default ChatInterface;
