export type BIAppConfig = {
  url: string;
  token: string;
};

export type Hotel = { id: number; name: string };

export type UserState = {
  organizationId: string | null;
  hotels: Hotel[];
  selectedHotelIds: Hotel[];
};

export type ToolCall = {
  name: string;
  args: Object;
  id: string;
  type: string;
};

export type Action =
  | { type: "SET_ORGANIZATION_ID"; payload: string | null }
  | { type: "SET_HOTELS"; payload: Hotel[] }
  | { type: "SET_SELECTED_HOTEL_IDS"; payload: Hotel[] };
