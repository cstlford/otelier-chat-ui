import { createContext, useContext, useReducer, ReactNode } from "react";

export type Hotel = {
  id: number;
  name: string;
};

export type HotelState = {
  hotels: Hotel[];
  selectedHotels: Hotel[];
};

export type HotelAction =
  | { type: "SET_HOTELS"; payload: Hotel[] }
  | { type: "SET_SELECTED_HOTELS"; payload: Hotel[] }
  | { type: "TOGGLE_HOTEL"; payload: Hotel }
  | { type: "CLEAR_SELECTED_HOTELS" }
  | { type: "SELECT_ALL_HOTELS" };

interface HotelContextType {
  state: HotelState;
  dispatch: React.Dispatch<HotelAction>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const hotelReducer = (state: HotelState, action: HotelAction): HotelState => {
  switch (action.type) {
    case "SET_HOTELS":
      return { ...state, hotels: action.payload };
    case "SET_SELECTED_HOTELS":
      return { ...state, selectedHotels: action.payload };
    case "TOGGLE_HOTEL":
      const hotel = action.payload;
      const isSelected = state.selectedHotels.some((h) => h.id === hotel.id);
      if (isSelected) {
        return {
          ...state,
          selectedHotels: state.selectedHotels.filter((h) => h.id !== hotel.id),
        };
      } else {
        return {
          ...state,
          selectedHotels: [...state.selectedHotels, hotel],
        };
      }
    case "CLEAR_SELECTED_HOTELS":
      return { ...state, selectedHotels: [] };
    case "SELECT_ALL_HOTELS":
      const allSelected = state.selectedHotels.length === state.hotels.length;
      return {
        ...state,
        selectedHotels: allSelected ? [] : [...state.hotels],
      };
    default:
      throw new Error(`Unhandled hotel action type: ${(action as any).type}`);
  }
};

export const HotelProvider = ({
  children,
  initialHotels = [],
  initialSelectedHotels = [],
}: {
  children: ReactNode;
  initialHotels?: Hotel[];
  initialSelectedHotels?: Hotel[];
}) => {
  const [state, dispatch] = useReducer(hotelReducer, {
    hotels: initialHotels,
    selectedHotels: initialSelectedHotels,
  });

  return (
    <HotelContext.Provider value={{ state, dispatch }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotels = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) {
    throw new Error("useHotels must be used within HotelProvider");
  }
  return ctx;
};
