import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader';
import { useSelector } from 'react-redux';


const UserConversation = () => {
    const { token } = useSelector((state) => state.auth);
    const { userData } = useSelector((state) => state.user);
    const location = useLocation();
    const receiverInformation = location.state;
    const [loading, setLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageLoading, setMessageLoading] = useState(false);
    const { allOnlineUsers } = useSelector((state) => state.socketIo);
    const { socket } = useSelector((state) => state.socketIo);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom jab bhi naya message aaye
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    useEffect(()=>{
        if(socket){
            const handleMessage = (data)=>{
                if(data?.senderId === receiverInformation?._id){
                    setAllMessages(prev=>{
                        return [
                            ...prev,
                            data
                        ]
                    })
                }
            }
            socket.on("new-message",handleMessage);

            return ()=>{
                socket.off("new-message");
            }
        }
    },[socket])

    const getConversation = async () => {
        if (!receiverInformation) return;
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/find-conversation/${receiverInformation?._id}`,
                { headers: { Authorization: 'Bearer ' + token } }
            );
            if (!response?.data?.success) {
                throw new Error("Couldn't fetch conversations. Please try again");
            }
            setAllMessages(response?.data?.conversation?.[0]?.allMessages || []);
        } catch (error) {
            console.log(error);
            console.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim().length < 1) return;

        try {
            setMessageLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/send-message`,
                { message, receiverId: receiverInformation?._id },
                { headers: { Authorization: 'Bearer ' + token } }
            );
            if (!response?.data?.success) {
                throw new Error("Couldn't send message. Please try again");
            }
            // Naya message list mein add karo
            setAllMessages((prev) => [...prev, response?.data?.newMessage]);
            setMessage("");
        } catch (error) {
            console.log(error);
            console.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setMessageLoading(false);
        }
    };

    useEffect(() => {
        getConversation();
    }, []);

    // Time format karne ka helper
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div style={styles.pageWrapper}>
            {/* ───── HEADER ───── */}
            <div style={styles.header}>
                {/* Back button */}
                <button onClick={() => navigate(-1)} style={styles.backBtn} title="Go back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </button>

                {/* Avatar + Name */}
                <div style={styles.headerInfo}>
                    <div style={styles.avatarWrapper}>
                        {receiverInformation?.profilePicture ? (
                            <img
                                src={receiverInformation.profilePicture}
                                alt={`${receiverInformation?.firstName} ${receiverInformation?.lastName}`}
                                style={styles.avatar}
                            />
                        ) : (
                            <div style={styles.avatarFallback}>
                                {receiverInformation?.firstName?.[0]?.toUpperCase()}
                            </div>
                        )}
                        {/* Online dot (UI only — real logic baad mein connect karna) */}
                        <span style={{
                            ...styles.onlineDot,
                            backgroundColor: allOnlineUsers.includes(receiverInformation?._id) ? '#25D366' : '#8b949e'
                        }} />
                    </div>
                    <div>
                        <p style={styles.receiverName}>
                            {receiverInformation?.firstName} {receiverInformation?.lastName}
                        </p>
                        <p style={{
                            ...styles.onlineStatus,
                            color: allOnlineUsers.includes(receiverInformation?._id) ? '#25D366' : '#8b949e'
                        }}>
                            {allOnlineUsers.includes(receiverInformation?._id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ───── MESSAGES AREA ───── */}
            <div style={styles.messagesArea}>
                {loading ? (
                    <div style={styles.loaderWrapper}>
                        <Loader />
                        <p style={styles.loaderText}>Loading messages...</p>
                    </div>
                ) : allMessages?.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>💬</div>
                        <p style={styles.emptyText}>No messages yet</p>
                        <p style={styles.emptySubText}>Say hello to {receiverInformation?.firstName}!</p>
                    </div>
                ) : (
                    <div style={styles.messagesList}>
                        {allMessages.map((msg, index) => {
                            const isSender = userData?._id === msg?.senderId;
                            return (
                                <div
                                    key={msg?._id || index}
                                    style={{
                                        ...styles.messageBubbleWrapper,
                                        justifyContent: isSender ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {/* Receiver ka avatar bubble ke saath */}
                                    {!isSender && (
                                        <div style={styles.smallAvatar}>
                                            {receiverInformation?.profilePicture ? (
                                                <img src={receiverInformation.profilePicture} alt="" style={styles.smallAvatarImg} />
                                            ) : (
                                                <div style={styles.smallAvatarFallback}>
                                                    {receiverInformation?.firstName?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ maxWidth: '68%' }}>
                                        <div
                                            style={{
                                                ...styles.bubble,
                                                ...(isSender ? styles.senderBubble : styles.receiverBubble),
                                            }}
                                        >
                                            <p style={styles.bubbleText}>{msg?.message}</p>
                                        </div>
                                        <p style={{
                                            ...styles.timestamp,
                                            textAlign: isSender ? 'right' : 'left'
                                        }}>
                                            {formatTime(msg?.createdAt)}
                                            {/* Sent tick (sender ke liye) */}
                                            {isSender && (
                                                <span style={styles.tick}>✓✓</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* ───── INPUT BAR ───── */}
            <div style={styles.inputBar}>
                <form onSubmit={sendMessage} style={styles.inputForm}>
                    {/* Emoji button (UI only placeholder) */}
                    <button type="button" style={styles.emojiBtn} title="Emoji">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={styles.input}
                        disabled={messageLoading}
                        autoComplete="off"
                    />

                    {/* Send button — message ho tो colored, warna grey */}
                    <button
                        type="submit"
                        disabled={messageLoading || message.trim().length < 1}
                        style={{
                            ...styles.sendBtn,
                            backgroundColor: message.trim().length > 0 ? '#25D366' : '#2a2f3b',
                            cursor: message.trim().length > 0 ? 'pointer' : 'not-allowed',
                        }}
                        title="Send message"
                    >
                        {messageLoading ? (
                            <div style={styles.sendLoader} />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ───── STYLES ─────
const styles = {
    pageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '89vh',
        backgroundColor: '#0d1117',
        fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        color: '#e8eaf0',
        overflow: 'hidden',
    },

    // Header
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#161b22',
        borderBottom: '1px solid #21262d',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        flexShrink: 0,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#8b949e',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.15s',
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
        flexShrink: 0,
    },
    avatar: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #30363d',
    },
    avatarFallback: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: '#21262d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '600',
        color: '#58a6ff',
        border: '2px solid #30363d',
    },
    onlineDot: {
        position: 'absolute',
        bottom: '1px',
        right: '1px',
        width: '10px',
        height: '10px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        border: '2px solid #161b22',
    },
    receiverName: {
        margin: 0,
        fontSize: '15px',
        fontWeight: '600',
        color: '#e8eaf0',
        lineHeight: 1.2,
    },
    onlineStatus: {
        margin: 0,
        fontSize: '12px',
        color: '#25D366',
        lineHeight: 1.2,
    },
    headerActions: {
        display: 'flex',
        gap: '4px',
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        color: '#8b949e',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
    },

    // Messages Area
    messagesArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        scrollbarWidth: 'thin',
        scrollbarColor: '#30363d transparent',
    },
    loaderWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: '12px',
    },
    loaderText: {
        color: '#8b949e',
        fontSize: '14px',
        margin: 0,
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: '8px',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '8px',
    },
    emptyText: {
        color: '#8b949e',
        fontSize: '16px',
        fontWeight: '600',
        margin: 0,
    },
    emptySubText: {
        color: '#484f58',
        fontSize: '13px',
        margin: 0,
    },
    messagesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    messageBubbleWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '4px',
    },
    smallAvatar: {
        flexShrink: 0,
        marginBottom: '18px',
    },
    smallAvatarImg: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    smallAvatarFallback: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#21262d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '600',
        color: '#58a6ff',
    },
    bubble: {
        padding: '9px 14px',
        borderRadius: '18px',
        wordBreak: 'break-word',
    },
    senderBubble: {
        backgroundColor: '#1a4731',
        borderBottomRightRadius: '4px',
    },
    receiverBubble: {
        backgroundColor: '#21262d',
        borderBottomLeftRadius: '4px',
    },
    bubbleText: {
        margin: 0,
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#e8eaf0',
    },
    timestamp: {
        fontSize: '11px',
        color: '#484f58',
        marginTop: '3px',
        marginLeft: '4px',
        marginRight: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
    },
    tick: {
        color: '#25D366',
        fontSize: '11px',
    },

    // Input Bar
    inputBar: {
        padding: '12px 16px',
        backgroundColor: '#161b22',
        borderTop: '1px solid #21262d',
        flexShrink: 0,
    },
    inputForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#21262d',
        borderRadius: '24px',
        padding: '6px 6px 6px 14px',
        border: '1px solid #30363d',
    },
    emojiBtn: {
        background: 'none',
        border: 'none',
        color: '#8b949e',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        background: 'none',
        border: 'none',
        outline: 'none',
        color: '#e8eaf0',
        fontSize: '14px',
        caretColor: '#58a6ff',
        minWidth: 0,
    },
    sendBtn: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background-color 0.2s',
    },
    sendLoader: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
};

export default UserConversation;