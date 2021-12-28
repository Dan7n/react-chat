import React, { useReducer, useContext } from "react";

import { SidePanel } from "./children/SidePanel";
import { MessagesPanel } from "./children/MessagesPanel";
import "./styles.scss";
import { Header } from "./children/Header";

import { reducer } from "./state/reducer";
import { initialState } from "./state/initialState";
import { GlobalContext } from "../../context/GlobalContext";

export const ChatComponent = React.memo(() => {
  const [chatState, chatDispatch] = useReducer(reducer, initialState);
  const { state } = useContext<any>(GlobalContext);

  const sidePanelProps = {
    dispatch: chatDispatch,
    searchValue: chatState.searchValue,
    isAutocompleteOpen: chatState.isAutocompleteOpen,
    isSearchLoading: chatState.isSearchLoading,
    searchUserFound: chatState.searchUserFound,
    loggedInUser: state.user,
  };

  return (
    <main className="chat-container">
      <Header />
      <section className="chat-container__body">
        <SidePanel {...sidePanelProps} />
        <MessagesPanel />
      </section>
    </main>
  );
});
