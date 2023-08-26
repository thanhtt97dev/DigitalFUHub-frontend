import * as signalR from '@microsoft/signalr';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const connectionHub = (hubName) => {
    return new signalR.HubConnectionBuilder()
        .withUrl(`${baseURL}${hubName}`, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
};

export default connectionHub;
