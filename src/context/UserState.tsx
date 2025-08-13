import { Action, Hotel, UserState } from "@/types/BITypes";
import { createContext, useContext, useReducer } from "react";

const UserStateContext = createContext<
  (UserState & { dispatch: React.Dispatch<Action> }) | undefined
>(undefined);

const reducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case "SET_ORGANIZATION_ID":
      return { ...state, organizationId: action.payload };
    case "SET_HOTELS":
      return { ...state, hotels: action.payload };
    case "SET_SELECTED_HOTEL_IDS":
      return { ...state, selectedHotelIds: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};

export const UserStateProvider = ({
  children,
  initialOrganizationId = null,
  initialHotels = [],
  initialSelectedHotelIds = [],
}: {
  children: React.ReactNode;
  initialOrganizationId?: string | null;
  initialHotels?: Hotel[];
  initialSelectedHotelIds?: number[];
}) => {
  const [state, dispatch] = useReducer(reducer, {
    organizationId: initialOrganizationId,
    hotels: initialHotels,
    selectedHotelIds: initialSelectedHotelIds,
  });

  return (
    <UserStateContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserStateContext.Provider>
  );
};

export const useUserState = () => {
  const ctx = useContext(UserStateContext);
  if (!ctx)
    throw new Error("useUserState must be used within UserStateProvider");
  return ctx;
};
