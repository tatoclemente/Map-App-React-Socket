import { MapPage } from "./pages/MapPage";
import SocketProvider from './context/SocketContext';

function MapsApp() {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  );
}

export default MapsApp;
