import { io } from "socket.io-client";
import { serverUrl } from "./constants";

export const socket = io(serverUrl, {
	autoConnect: false,
	withCredentials: true,
});
