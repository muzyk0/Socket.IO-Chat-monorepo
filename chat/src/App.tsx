import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./App.module.css";
import {
    createConnection,
    destroyConnection,
    sendMessageTC,
    setClientName,
    typeMessage,
} from "./chat-reducer";

export interface Message {
    message: string;
    id: string;
    user: { id: string; name: string };
}

function App() {
    // const [messages, setMessages] = React.useState<Message[]>([]);
    const [message, setMessage] = React.useState("");
    const [name, setName] = React.useState("");
    const [isAutoScrollActive, setIsAutoScrollActive] = React.useState(true);
    const [lastScrollTop, setLastScrollTop] = React.useState<number>(0);

    const messages = useSelector<any, Message[]>(
        (state) => state.chat.messages
    );
    const typingUsers = useSelector<any, any>(
        (state) => state.chat.typingUsers
    );

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(createConnection());

        return () => {
            dispatch(destroyConnection());
        };
    }, [dispatch]);

    React.useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAutoScrollActive]);

    const messagesAnchorRef = React.useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        dispatch(sendMessageTC(message));
        setMessage("");
    };
    const sendClientName = () => {
        dispatch(setClientName(name));
    };

    return (
        <div className={classes.app}>
            <div>
                <div
                    className={classes.chat}
                    onScroll={(e) => {
                        const element = e.currentTarget;

                        const maxScrollPosition =
                            element.scrollHeight - element.clientHeight;

                        if (
                            element.scrollTop > lastScrollTop &&
                            Math.abs(maxScrollPosition - element.scrollTop) < 5
                        ) {
                            setIsAutoScrollActive(true);
                        } else {
                            setIsAutoScrollActive(false);
                        }
                        setLastScrollTop(element.scrollTop);
                    }}
                >
                    {messages.map((m, i) => (
                        <div ref={messagesAnchorRef} key={i}>
                            <b>{m.user.name}</b>: {m.message}
                        </div>
                    ))}
                    {typingUsers.map((m: any, i: number) => (
                        <div ref={messagesAnchorRef} key={i}>
                            <b>{m.name}</b>: ...
                        </div>
                    ))}
                    <div ref={messagesAnchorRef} />
                </div>
                <input
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    onClick={() => {}}
                />{" "}
                <button onClick={sendClientName}>Save</button>
                <textarea
                    value={message}
                    onKeyPress={() => {
                        dispatch(typeMessage());
                    }}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
