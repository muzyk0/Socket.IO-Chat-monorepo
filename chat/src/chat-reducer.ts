import { Dispatch } from "redux";
import { api } from "./api";
import { Message } from "./App";

const initState = {
    messages: [] as Message[],
    typingUsers: [] as string[],
};

type InitStateType = typeof initState;

export const chatReducer = (
    state: InitStateType = initState,
    action: Actions
) => {
    switch (action.type) {
        case "messages-received": {
            return { ...state, messages: action.messages };
        }
        case "new-message-received": {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter(
                    (u: any) => u.id !== action.message.user.id
                ),
            };
        }

        case "typing-user-added": {
            return {
                ...state,
                typingUsers: [
                    ...state.typingUsers.filter(
                        (u: any) => u.id !== action.user.id
                    ),
                    action.user,
                ],
            };
        }
        default:
            return state;
    }
};

const messageReceived = (messages: Message[]) =>
    ({
        type: "messages-received",
        messages,
    } as const);
const newMessageReceived = (message: Message) =>
    ({
        type: "new-message-received",
        message,
    } as const);
const typingUserAdded = (user: any) =>
    ({
        type: "typing-user-added",
        user,
    } as const);

type Actions =
    | ReturnType<typeof messageReceived>
    | ReturnType<typeof newMessageReceived>
    | ReturnType<typeof typingUserAdded>;

export const createConnection = () => (dispatch: Dispatch) => {
    api.createConnection();
    api.on(
        (messages: Message[], fn: (data: string) => void) => {
            dispatch(messageReceived(messages));
            fn("data from front");
        },
        (message: Message) => {
            dispatch(newMessageReceived(message));
        },
        (user: any) => {
            dispatch(typingUserAdded(user));
        }
    );
};

export const destroyConnection = () => (dispatch: Dispatch) => {
    api.destroyConnection();
};

export const setClientName = (name: string) => (dispatch: Dispatch) => {
    api.sendClientName(name);
};

export const sendMessageTC = (message: string) => (dispatch: Dispatch) => {
    api.sendMessage(message);
};

export const typeMessage = () => (dispatch: Dispatch) => {
    api.typeMessage();
};
