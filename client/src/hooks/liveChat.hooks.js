import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { ipAddressComputer } from "../data/ipaddresses.data";
import { UserProfileContext } from "../store/userProfile-context";

let socket;

export function useLiveChat() {
    const [text, setText] = useState("");
    const SOCKET_SERVER_URL = ipAddressComputer + '/api/v1/liveChat';
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const groupId = `school-${school_id}-class-${class_id}-group-${group_id}`

    useEffect(() => {
        // Connect to the server
        socket = io(SOCKET_SERVER_URL);

        // Join the group
        socket.emit('join', groupId);

        // Listen to the "text" event from the server
        socket.on("text", (newText) => {
            setText(newText);
        });

        // // Fetch the latest text when the component mounts
        // fetchLatestText(groupId).then(setText);

        return () => {
            // Disconnect from the server
            socket.disconnect();
        };
    }, [groupId]);

    function handleTextChange(newText) {
        // Update the text locally
        setText(newText);

        // Send the new text to the server
        socket.emit("text", groupId, newText);
    }

    return [text, handleTextChange];
}