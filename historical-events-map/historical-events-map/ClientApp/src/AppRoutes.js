import { Home } from "./components/Home";
import { HistoricalEventsMap } from "./components/historical-events-map/historical-events-map";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/map-event', // Your new route's path
    element: <HistoricalEventsMap /> // The component to render for this route
  }
];

export default AppRoutes;
