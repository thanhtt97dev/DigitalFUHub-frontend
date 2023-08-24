import * as signalR from '@microsoft/signalr';
import { API_BASE_URL_SIGNAL_R } from '../config';
import { getTokenInCookies } from '~/utils';

const connection = new signalR.HubConnectionBuilder()
    .withUrl(API_BASE_URL_SIGNAL_R, {
        accessTokenFactory: getTokenInCookies(),
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

export default connection;

/**
How to use
useEffect(() => {
    // Function to get the authentication token from your backend (e.g., using cookies, local storage, etc.)
    const getAuthToken = () => {
      // Replace this with your logic to obtain the token from the backend
      // Example: return localStorage.getItem('token');
    };

    // Create a new SignalR connection with the token
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://your-server-url/notificationHub', {
        accessTokenFactory: () => getAuthToken(), // Pass the token to the connection
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Start the connection
    connection.start().catch((err) => console.error(err));

    // Receive notifications from the server
    connection.on('ReceiveNotification', (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    });

    return () => {
      // Clean up the connection when the component unmounts
      connection.stop();
    };
  }, []);

 */
