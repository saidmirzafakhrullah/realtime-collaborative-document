import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

export default function Edit({ document }) {
    const { auth } = usePage().props;

    const [content, setContent] = useState(document.content || "");
    const [saving, setSaving] = useState(false);
    const [remoteMouse, setRemoteMouse] = useState(null);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});

    const channelRef = useRef(null);
    const remoteUpdate = useRef(false);
    const saveTimer = useRef(null);

    useEffect(() => {
        const channel = window.Echo.join(`document.${document.id}`);

        channelRef.current = channel;
        channel
            .here((users) => {
                setOnlineUsers(users);
            })
            .joining((user) => {
                setOnlineUsers((prev) => [...prev, user]);
            })
            .leaving((user) => {
                setOnlineUsers((prev) =>
                    prev.filter((u) => u.id !== user.id)
                );
            });

        channel.listenForWhisper("typing", (event) => {
         remoteUpdate.current = true;
            setContent(event.content || "");

            setTypingUsers((prev) => ({
                ...prev,
                [event.id]: event.name,
            }));

            setTimeout(() => {
                setTypingUsers((prev) => {
                    const users = { ...prev };
                    delete users[event.id];
                    return users;
                });
            }, 5000);
        });

        channel.listenForWhisper("mouse", (event) => {
        setRemoteMouse(event);
    });

        return () => {
            window.Echo.leave(`document.${document.id}`);
        };
    }, [document.id]);

    const sendMousePosition = (e) => {
        channelRef.current?.whisper("mouse", {
            id: auth.user.id,
            x: e.clientX,
            y: e.clientY,
            name: auth.user.name,
        });
    };

    const handleChange = (value, delta, source) => {
        setContent(value);

        if (remoteUpdate.current) {
            remoteUpdate.current = false;
            return;
        }

        if (source !== "user") return;

        channelRef.current?.whisper("typing", {
            content: value,
            id: auth.user.id,
            name: auth.user.name,
        });

        clearTimeout(saveTimer.current);

        saveTimer.current = setTimeout(() => {
            saveDocument(value);
        }, 2000);
    };

    const saveDocument = async (latestContent) => {
        setSaving(true);

        await axios.put(`/documents/${document.id}`, {
            content: latestContent,
        });

        setSaving(false);
    };

    return (
        <>
            <Head title={document.title} />

            <div className="editor-page" onMouseMove={sendMousePosition}>
                <div className="editor-header">
                    <div>
                        <button
                            className="back-btn"
                            onClick={() => router.visit("/documents")}
                        >
                            ← Back
                        </button>

                        <h1>{document.title}</h1>
                    </div>

                    <div>
                        <button
                            className="history-btn"
                            onClick={() =>
                                router.visit(
                                    `/documents/${document.id}/versions`,
                                )
                            }
                        >
                            Version History
                        </button>

                        <span className="save-status">
                            {saving ? "Saving..." : "Saved"}
                        </span>
                    </div>
                </div>
                <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "20px",
    }}
>
                <div>
                    <h3>🟢 Online ({onlineUsers.length})</h3>

                    {onlineUsers.map((user) => (
                        <div key={user.id}>
                            🟢 {user.name}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "right" }}>
                        {Object.values(typingUsers).map((name) => (
                            <p
                                key={name}
                                style={{
                                    color: "#16a34a",
                                    fontWeight: "bold",
                                }}
                            >
                                ⌨️ {name} sedang mengetik...
                            </p>
                        ))}
                    </div>
                </div>
                <div className="editor-wrapper">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleChange}
                    />
                </div>

                {remoteMouse && (
                    <div
                        className="remote-mouse"
                        style={{
                            left: remoteMouse.x,
                            top: remoteMouse.y,
                        }}
                    >
                        <span>{remoteMouse.name}</span>
                    </div>
                )}
            </div>
        </>
    );
}
