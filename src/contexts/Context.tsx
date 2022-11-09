import React from "react";
import { MeditationInitialState, MeditationReducer, State } from "../reducers/MeditationReducer";

export const DispatchContext = React.createContext<{
    state: State;
    dispatch: React.Dispatch<any>;
}>({
    state: MeditationInitialState,
    dispatch: () => null,
});
