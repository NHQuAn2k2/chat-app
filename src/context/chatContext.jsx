import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "../context/authContext";
export const ChatContext = createContext();
export default function ChatProvider({ children }) {
  const { currentUser } = useContext(AuthContext);
  const initialState = { user: null, chatId: "" };
  const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE-USER":
        return {
          user: action.payload,
          chatId:
            currentUser?.uid > action.payload.uid
              ? currentUser?.uid + action.payload.uid
              : action.payload.uid + currentUser?.uid,
        };

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
