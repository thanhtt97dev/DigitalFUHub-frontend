import * as signalR from '@microsoft/signalr';

import { getTokenInCookies } from "~/utils/index"

const baseURL = process.env.REACT_APP_API_BASE_URL;

const connectionHub = (hubName) => {
    return new signalR.HubConnectionBuilder()
        .withUrl(`${baseURL}${hubName}`, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => getTokenInCookies()
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
};

export default connectionHub;
