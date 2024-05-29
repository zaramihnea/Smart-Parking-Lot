/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import '../styles/RoutingMachine.css';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRoutineMachineLayer = ({ position, start, end, color , onRouteFound }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = (L as any).Routing.control({
    position,
    waypoints: [start, end],
    // addWaypoints: false,
    // draggableWaypoints: false,
    // show: false,
    createMarker: (i: number, waypoint: { latLng: L.LatLngExpression; }, n: number) => {
      // Return null for the last waypoint
      if (i === n - 1) {
        return null;
      }
      return L.marker(waypoint.latLng, {
        draggable: false,
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      });
    },
    lineOptions: {
      styles: [
        {
          color,
          weight: 6,
        },
      ],
    },
  });
  console.log("Created RoutingMachine", instance);
  instance.on("routesfound", (event: any) => {
    console.log("Route found", event);
    const route = event.routes[0].coordinates;
    onRouteFound(route);
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
