import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ParkingLot } from '../types/ParkingLot';
import useParkingLots from '../hooks/useParkingLots';
import { ConfirmationModal } from './ReservationModal';
import useReservations from '../hooks/useReservations';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';
import { calculateBearing } from './helperFunctions';
import { LatLngExpression } from '../types/LatLngExpression';
import { LatLng } from 'leaflet';
import '../styles/googlemap.css';

function Map() {
  const googleMapElementRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const userLocationLastMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const userLocationRef = useRef<google.maps.LatLng | null>(null);
  const destinationLocationRef = useRef<google.maps.LatLng | null>(null);
    const oldRoutePointRef = useRef<LatLngExpression | null>(null);
  const newRoutePointRef = useRef<LatLngExpression | null>(null);
  const isDrivingBoolRef: React.MutableRefObject<boolean> = useRef(false);

  // const [userPosition, setUserPosition] = useState<L.LatLngExpression | null>(null);
  // const [shouldCenter, setShouldCenter] = useState(true); // Controls whether the map should re-center
  // const [hasUserConsented, setHasUserConsented] = useState(false);


  const baseUrl = process.env.API_BASE_URL;
  const [baseUrlString] = useState<string>(baseUrl || 'http://localhost:8081');

  // center of the map, currently set on Iasi
  // wrap the centerOfIasi in a useMemo hook to avoid recalculating it on every render
  const centerOfIasi = useMemo(() => new LatLng(47.169765, 27.576554), []);
  // const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [availableParkingLots, setAvailableParkingLots] = useState<ParkingLot[]>([]);
  const availableParkingLotsRef = useRef<ParkingLot[]>([]);
  const { getAvailableParkingLotsAndClosestLot } = useParkingLots();


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const [lotToReserve, setLotToReserve] = useState<number>(-1);


  const [cars, setCars] = useState<Car[]>([]);
  const { getUserCars } = useSavedCars();
  const { reserveParkingSpot } = useReservations();

  // fetching availableParkingLots (backend documentation item nr.7)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const radius = 3000;
        const startTime = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
        const stopTime = new Date(new Date().getTime() + 15 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';

        const data = await getAvailableParkingLotsAndClosestLot(baseUrlString, radius, centerOfIasi.lat, centerOfIasi.lng, startTime, stopTime);
        setAvailableParkingLots(data.parkingLots);
        availableParkingLotsRef.current = data.parkingLots;
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchData();
  }, []);

  const handleReserveClick = useCallback(async (lotId: number) => {
    console.log("Reserving spot at lot", lotId);
    setLotToReserve(lotId);
    setModalTitle('Confirmation');
    setModalMessage(`Reserve parking spot at this parking lot?`);
    setModalIsOpen(true);
  }, []);

  useEffect(() => {
    getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
      setCars(fetchedCars);
    });
  }, [baseUrlString, getUserCars]);

  const confirmReservation = useCallback(async (hoursToReserve: number, carId: number) => {
    setModalIsOpen(false);

    const now = new Date();

    const startTime = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
    const stopTime = new Date(new Date().getTime() + (hoursToReserve + 3) * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';

    const car = cars.find(car => car.id === carId);

    if (!car) {
      alert('Car not found');
      return;
    }

    const parkingLot: ParkingLot | undefined = availableParkingLots.find(lot => lot.id === lotToReserve);

    if (!parkingLot) {
      alert('Parking lot not found');
      return;
    }

    const parkingSpotIdToReserve = parkingLot.parkingSpotsIds[0];

    const result = await reserveParkingSpot(baseUrlString, parkingSpotIdToReserve, startTime, stopTime, car.plate, car.capacity, car.model);

    if (result === 'Spot reserved successfully') {
      if (window.location.pathname !== '/home') {
        window.location.href = '/home';
      }
      else {
        window.location.reload()
      }
    } else {
      alert('Reservation failed: ' + result);
    }
  }, [cars, availableParkingLots, lotToReserve, baseUrlString]);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // do not fix this error, this error good error
      await import('https://maps.googleapis.com/maps/api/js?key=AIzaSyC0c45KPuqZ2kVQcNWU89SLAj0m7DhKQ-A&libraries=places');
      const {AdvancedMarkerElement} = await google.maps.importLibrary("marker")

      if (googleMapElementRef.current) {
        const map = new window.google.maps.Map(googleMapElementRef.current, {
          center: centerOfIasi,
          zoom: 14,
          mapId: '3f8a6f95f7f9e84e', // Add your mapId here
          mapTypeId: 'terrain',
        });

        setGoogleMap(map);

        map.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });

        map.addListener('drag', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });

        googleMapRef.current = map;

        directionsServiceRef.current = new google.maps.DirectionsService();

        googleMapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          userLocationRef.current = e.latLng;   
          setUserLocation(e.latLng);       
        })

        
      
      }
      
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if(!googleMap) {
      return;
    }
    const buttons: [string, string, google.maps.ControlPosition][] = [
      ["Center", "centerOnDriver", google.maps.ControlPosition.BOTTOM_LEFT],
      ["Auto Reserve on Arrival", "autoReserve", google.maps.ControlPosition.BOTTOM_LEFT],
      ["⬆", "resetPosition", google.maps.ControlPosition.RIGHT_TOP],
      ["✖", "cancelDrive", google.maps.ControlPosition.BOTTOM_LEFT],
    ];
  
    buttons.forEach(([text, mode, position]) => {
      const controlDiv = document.createElement("div");
      const controlUI = document.createElement("button");
  
      controlUI.classList.add("ui-button");
      controlUI.innerText = `${text}`;
      controlUI.addEventListener("click", () => {
        adjustMap(mode);
      });
      controlDiv.appendChild(controlUI);
      googleMap.controls[position].push(controlDiv);
    });
  
    const adjustMap = function (mode: string) {
      switch (mode) {
        case "autoReserve":
          console.log("Auto reserve");
          break;
        case "resetPosition":
          googleMap.setTilt(0);
          googleMap.setHeading(0);
          break;
        case "centerOnDriver":
          if(newRoutePointRef.current) {
            // used to trigger re-centering
            newRoutePointRef.current.lat += 0.00001;
            if(userLocationRef.current) {
              setTimeout(() => googleMapRef.current?.setZoom(18), 1000);
            }
          } 
          break;
        case "cancelDrive":
          if(userLocationRef.current) {
            googleMap.setHeading(0);
            googleMap.setTilt(0);
            googleMap.setZoom(14);
          }
          isDrivingBoolRef.current = false;
          directionsRendererRef.current?.setMap(null);
          directionsRendererRef.current = null;
          
          break;
        default:
          break;
      }
    };
  }, [googleMap]);

  const calculateAndDisplayRoute = useCallback((start: google.maps.LatLng, end: google.maps.LatLng) => {
    if (directionsRendererRef.current == null) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer(
        {
          map: googleMapRef.current,
        
        });
        console.log("Creating new renderer");
    }
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
    directionsServiceRef.current.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRendererRef.current!.setDirections(response);

          directionsRendererRef.current!.setOptions({
            suppressMarkers: true,
            preserveViewport: true,
          });
          if(response == null) return;

          const route = response.routes[0];
          const points: LatLngExpression[] = [];

          route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              const path = step.path;
              path.forEach((point) => {
                points.push({ lat: point.lat(), lng: point.lng() });
                if(points.length > 2) return;
              });
              if(points.length > 2) return;
            });
            if(points.length > 2) return;
          });
          if(points[2]) {
            newRoutePointRef.current = points[2];
          }

        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  }, [directionsServiceRef, directionsRendererRef, newRoutePointRef]);

  useEffect(() => {
    const updateMarkers = (parkingLots: ParkingLot[]) => {
      if (!googleMap || !parkingLots.length) {
        return;
      }
      // Clear existing markers
      markersRef.current.forEach(marker => marker.map = null);



      const newMarkers = parkingLots.map(lot => {
        const customSymbolSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" fill="#9333EA" stroke="black" stroke-width="2"/>
        </svg>`;

        // Create the icon as a custom HTML element
        const customIcon = document.createElement('div');
        customIcon.innerHTML = customSymbolSVG;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: new google.maps.LatLng(lot.latitude, lot.longitude),
          map: googleMap,
          title: lot.name,
          content: customIcon
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
                    <div class="p-4 text-black bg-white rounded-lg shadow-lg">
                        <p class="text-lg font-bold -mt-5">${lot.name}</p>
                        <p class="mt-1 text-sm">Spots available: ${lot.parkingSpotsIds.length} / ${lot.nrSpots}</p>
                        <p class="mt-1 text-sm">Price per hour: ${lot.price} RON</p>
                        <div class="flex justify-evenly">
                          <button id="reserve-button-${lot.id}" class="mt-1 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">Reserve</button>
                          <button id="drive-button-${lot.id}" class="mt-1 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">Drive To</button>
                        </div>
                    </div>`,
        });

        infoWindow.key = `${lot.id}`;

        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }

          infoWindow.open(googleMap, marker);
          infoWindowRef.current = infoWindow;

          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById(`reserve-button-${lot.id}`)?.addEventListener('click', () => handleReserveClick(lot.id));
          });

          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById(`drive-button-${lot.id}`)?.addEventListener('click', () => 
              {
                handleDrive(lot.id);
                if (infoWindowRef.current) {
                  infoWindowRef.current.close();
                }
              }
            );
            
          })


        });

        return marker;
      });

      markersRef.current = newMarkers;

      if (googleMap) {
        googleMap.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });

        googleMap.addListener('drag', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });
      }



    };

    if (googleMap) {
      updateMarkers(availableParkingLots);
    }
  }, [availableParkingLots, markersRef, centerOfIasi, googleMap]);

  useEffect(() => {
    if(!googleMapRef.current) {
      return;
    }

    if(userLocationLastMarkerRef.current) {
      console.log("Removing user marker");
      userLocationLastMarkerRef.current.map = null;
    }
    
    
    const glyphImg = document.createElement('img');
    glyphImg.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg';
    
    // Create the outer circle
    const outerCircle = document.createElement('div');
    outerCircle.style.display = 'flex';
    outerCircle.style.justifyContent = 'center';
    outerCircle.style.alignItems = 'center';
    outerCircle.style.width = '1.5rem';
    outerCircle.style.height = '1.5rem';
    outerCircle.style.backgroundColor = 'rgba(0, 123, 255, 0.2)'; // Light blue with some transparency
    outerCircle.style.borderRadius = '50%';
    outerCircle.style.transform = 'translateY(50%)';
    
    // Create the middle circle
    const middleCircle = document.createElement('div');
    middleCircle.style.display = 'flex';
    middleCircle.style.justifyContent = 'center';
    middleCircle.style.alignItems = 'center';
    middleCircle.style.width = '1rem';
    middleCircle.style.height = '1rem';
    middleCircle.style.backgroundColor = 'rgba(0, 123, 255, 0.5)'; // Slightly darker blue
    middleCircle.style.borderRadius = '50%';
    
    // Create the inner circle
    const innerCircle = document.createElement('div');
    innerCircle.style.width = '0.5rem';
    innerCircle.style.height = '0.5rem';
    innerCircle.style.backgroundColor = '#007bff'; // Solid blue
    innerCircle.style.borderRadius = '50%';
    
    // Append the circles to create the desired structure
    middleCircle.appendChild(innerCircle);
    outerCircle.appendChild(middleCircle);
    
    console.log("Generating user marker");

    const userMarker = new google.maps.marker.AdvancedMarkerElement({
      position: userLocationRef.current,
      map: googleMapRef.current,
      content: outerCircle,
      // content: customPinElement,
      // icon: customSymbol,
    });

    userLocationLastMarkerRef.current = userMarker;

  }, [userLocation, googleMapRef, googleMap]);

  useEffect(() => {
    const updateLocation = () => {
      if(!availableParkingLotsRef.current.length) {
        console.log("No available parking lots");
        return;
      }
      if(!googleMapRef.current) {
        console.log("No google map");
        return;
      }
      if(isDrivingBoolRef.current == false) {
        console.log("Not driving");
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            userLocationRef.current = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            setUserLocation(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            
          },
          (err) => {
            console.log('Error getting location:', err);
          },
          {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0,
          }
        );
      } else {
          console.log('Geolocation is not supported by this browser.')
        }

      if(!userLocationRef.current) {
        console.log("No user location");
        return;
      }
      
      if(!destinationLocationRef.current) {
        console.log("No destination lcation");
        return;
      }
      calculateAndDisplayRoute(userLocationRef.current, destinationLocationRef.current);
      
      if(oldRoutePointRef.current?.lat == newRoutePointRef.current?.lat
        && oldRoutePointRef.current?.lng == newRoutePointRef.current?.lng
      ) {
        return;
      }
      if(newRoutePointRef == null) {
        return;
      }

      const bearing = calculateBearing({ lat: userLocationRef.current.lat(), lng: userLocationRef.current.lng() }, newRoutePointRef.current!);

        
      googleMapRef.current.panTo(new google.maps.LatLng(userLocationRef.current.lat(), userLocationRef.current.lng()));
        
      googleMapRef.current!.setHeading(bearing);
      googleMapRef.current!.setTilt(60);
      console.log("Centering");
      // Delay setting heading, tilt, and zoom by 1 second
      // setTimeout(() => {
      //   // googleMapRef.current!.setZoom(17);
      // }, 1000);
        

      //show the user location on the map

      // if(userLocationLastMarkerRef.current) {
      //   console.log("Removing marker");
      //   userLocationLastMarkerRef.current.map = null;
      // }
      
      // console.log("Generating marker");

      // const glyphImg = document.createElement('img');
      // glyphImg.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg';

      // // Create the outer circle
      // const outerCircle = document.createElement('div');
      // outerCircle.style.display = 'flex';
      // outerCircle.style.justifyContent = 'center';
      // outerCircle.style.alignItems = 'center';
      // outerCircle.style.width = '1.5rem';
      // outerCircle.style.height = '1.5rem';
      // outerCircle.style.backgroundColor = 'rgba(0, 123, 255, 0.2)'; // Light blue with some transparency
      // outerCircle.style.borderRadius = '50%';
      // outerCircle.style.transform = 'translateY(50%)';

      // // Create the middle circle
      // const middleCircle = document.createElement('div');
      // middleCircle.style.display = 'flex';
      // middleCircle.style.justifyContent = 'center';
      // middleCircle.style.alignItems = 'center';
      // middleCircle.style.width = '1rem';
      // middleCircle.style.height = '1rem';
      // middleCircle.style.backgroundColor = 'rgba(0, 123, 255, 0.5)'; // Slightly darker blue
      // middleCircle.style.borderRadius = '50%';

      // // Create the inner circle
      // const innerCircle = document.createElement('div');
      // innerCircle.style.width = '0.5rem';
      // innerCircle.style.height = '0.5rem';
      // innerCircle.style.backgroundColor = '#007bff'; // Solid blue
      // innerCircle.style.borderRadius = '50%';

      // // Append the circles to create the desired structure
      // middleCircle.appendChild(innerCircle);
      // outerCircle.appendChild(middleCircle);
      

      // const userMarker = new google.maps.marker.AdvancedMarkerElement({
      //   position: userLocationRef.current,
      //   map: googleMapRef.current,
      //   content: outerCircle,
      //   // content: customPinElement,
      //   // icon: customSymbol,
      // });

      // userLocationLastMarkerRef.current = userMarker;


      

      
      oldRoutePointRef.current = newRoutePointRef.current;
    };

    // Update location immediately and then every 2.5 seconds
    updateLocation();
    const intervalId = setInterval(updateLocation, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDrive = useCallback((key: number) => {
    if(userLocationRef.current == null) {
      console.log("No user location");
      return;
    }
    isDrivingBoolRef.current = true;
    console.log("Driving");
    const parkingLot = availableParkingLots.find((parkingLot) => parkingLot.id == key)
    if(!parkingLot) {
      console.log("Cant drive to non existent parking lot");
      return;
    }
    destinationLocationRef.current = new google.maps.LatLng(parkingLot.latitude, parkingLot.longitude);
    if(oldRoutePointRef.current) {
      // used to trigger re-centering
      oldRoutePointRef.current.lat += 0.000001;
    }
    if(userLocationRef.current) {
      setTimeout(() => googleMapRef.current?.setZoom(18), 1000);
    }
    
  }, [availableParkingLots])

  

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div ref={googleMapElementRef} style={{ height: '100%', width: '100%' }} />
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onConfirm={confirmReservation}
        title={modalTitle}
        message={modalMessage}
      />
    </div>

  );
}

export default Map;