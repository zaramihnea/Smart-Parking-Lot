import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ParkingLot } from '../types/ParkingLot';
import useParkingLots from '../hooks/useParkingLots';
import { ConfirmationModal } from './ReservationModal';
import useReservations from '../hooks/useReservations';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';
import { calculateBearing, calculateDistance, calculateNearestParkingLot } from './helperFunctions';
import { LatLngExpression } from '../types/LatLngExpression';
import '../styles/googlemap.css';
import useFavoriteLot from '../hooks/useFavoriteLot';

export interface GoogleMapProps {
  onReservationConfirmed: () => void;
  refreshNavigateTo: () => void;
  spotToNavigateTo: number;
}

const Map: React.FC<GoogleMapProps> = ({ onReservationConfirmed, spotToNavigateTo, refreshNavigateTo }: GoogleMapProps) => {
  const googleMapElementRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
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
  const hoursforAutoReserveRef = useRef<number>(2);
  const isAutoReserveOnRef = useRef<boolean>(false);
  const [favoriteParkingLot, setFavoriteParkingLot] = useState<number>(-1);
  const [modalForceRefresh, setModalForceRefresh] = useState<number>(0);
  const modalForceRefreshRef = useRef<number>(0);

  // const [userPosition, setUserPosition] = useState<L.LatLngExpression | null>(null);
  // const [shouldCenter, setShouldCenter] = useState(true); // Controls whether the map should re-center
  // const [hasUserConsented, setHasUserConsented] = useState(false);


  const baseUrl = process.env.API_BASE_URL;
  const [baseUrlString] = useState<string>(baseUrl || 'http://localhost:8081');

  // center of the map, currently set on Iasi
  // wrap the centerOfIasi in a useMemo hook to avoid recalculating it on every render
  const centerOfIasi = useMemo(() => ({ lat: 47.16798, lng: 27.58320 }), []);
  const availableParkingLotsRef = useRef<ParkingLot[]>([]);
  const parkingLotsRef = useRef<ParkingLot[]>([]);
  const { getAvailableParkingLotsAndClosestLot, getParkingLots } = useParkingLots();


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const lotToReserveRef = useRef<number>(-1);


  const carsRef = useRef<Car[]>([]);
  const { getUserCars } = useSavedCars();
  const { reserveParkingSpot } = useReservations();
  const { getFavoriteLot } = useFavoriteLot();

  // fetching availableParkingLots (backend documentation item nr.7)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const radius = 3000;
        const startTimeString = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
        const stopTimeString = new Date(new Date().getTime() + 15 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';

        const data = await getAvailableParkingLotsAndClosestLot(baseUrlString, radius, centerOfIasi.lat, centerOfIasi.lng, startTimeString, stopTimeString);
        availableParkingLotsRef.current = data.parkingLots;

        updateMarkers(data.parkingLots);

      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const data = await getParkingLots(baseUrlString, 3000, centerOfIasi.lat, centerOfIasi.lng);
        parkingLotsRef.current = data;
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchParkingLots();
  }
  , []);



  const handleReserveClick = useCallback(async (lotId: number) => {
    console.log("Reserving spot at lot", lotId);
    lotToReserveRef.current = lotId;
    setModalTitle('Confirmation');
    setModalMessage(`Reserve parking spot at this parking lot?`);
    setModalIsOpen(true);
    modalForceRefreshRef.current = modalForceRefreshRef.current + 1;
    setModalForceRefresh(modalForceRefreshRef.current);
    document.exitFullscreen();
  }, []);

  useEffect(() => {
    getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
      carsRef.current = fetchedCars;
    });
  }, [baseUrlString, getUserCars]);

  const confirmReservation = useCallback(async (hoursToReserve: number, carId: number, lotId: number, startTimeString: string = (new Date(new Date().getTime() + (3) * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z')) => {
    setModalIsOpen(false);

    // if the time string is not in the correct format, add the seconds
    if(startTimeString.length < 18) {
      startTimeString = startTimeString + ':00Z';
    }
    const startTime = new Date(startTimeString);
    startTime.setHours(startTime.getHours());
    startTimeString = startTime.toISOString().slice(0, 19) + 'Z';

    const stopTimeString = new Date(startTime.getTime() + hoursToReserve * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';

    console.log(startTimeString);

    const car = carsRef.current.find(car => car.id === carId);


    if (car == null) {
      alert('Car not found');
      return;
    }

    const parkingLot: ParkingLot | undefined = availableParkingLotsRef.current.find(lot => lot.id === lotId);

    if (parkingLot == null) {
      console.log('Parking lot not found');
      alert('Parking lot not found');
      return;
    }

    const parkingSpotIdToReserve = parkingLot.parkingSpotsIds[0];

    const result = await reserveParkingSpot(baseUrlString, parkingSpotIdToReserve, startTimeString, stopTimeString, car.plate, car.capacity, car.model);

    if (result === 'Spot reserved successfully') {
      if(isAutoReserveOnRef.current) {
        if(calculateDistance({lat: userLocationRef.current!.lat(), lng: userLocationRef.current!.lng()}, {lat: destinationLocationRef.current!.lat(), lng: destinationLocationRef.current!.lng()}) < 0.1) {
          const autoReserveButton = document.querySelector('.ui-button-active');
          if(autoReserveButton) {
            // set the button value to 0 if reservation was succesful
            autoReserveButton.innerHTML = "0";
            hoursforAutoReserveRef.current = 0;
          }

          isAutoReserveOnRef.current = false;
          drawButtons();
          modalForceRefreshRef.current = modalForceRefreshRef.current + 1;
          setModalForceRefresh(modalForceRefreshRef.current);
          onReservationConfirmed();
        }
      }
      else {
        modalForceRefreshRef.current = modalForceRefreshRef.current + 1;
        setModalForceRefresh(modalForceRefreshRef.current);
        onReservationConfirmed();
      }
    } else {
      window.location.reload()
    }
  }, [baseUrlString]);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // do not fix this errors, this errors good errors
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

        drawButtons();
        updateMarkers(availableParkingLotsRef.current);
        setMapLoaded(true);
      }

    };

    loadGoogleMaps();
  }, []);

  const drawButtons = useCallback(() => {
    if(googleMapRef.current == null) {
      return;
    }
    googleMapRef.current.controls[google.maps.ControlPosition.BOTTOM_LEFT].clear();
    googleMapRef.current.controls[google.maps.ControlPosition.RIGHT_TOP].clear();
    googleMapRef.current.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
    googleMapRef.current.controls[google.maps.ControlPosition.LEFT_TOP].clear();
    googleMapRef.current.controls[google.maps.ControlPosition.TOP_LEFT].clear();

    let buttons: [string, string, google.maps.ControlPosition][] = [];
    if(isDrivingBoolRef.current) {
      buttons.push(["Center", "centerOnDriver", google.maps.ControlPosition.LEFT_BOTTOM]);
      buttons.push([`${hoursforAutoReserveRef.current != 0?( `Auto Reserve for ${hoursforAutoReserveRef.current} ${hoursforAutoReserveRef.current == 1? `hour` : `hours`} on Arrival`) : `Spot reserved succesfully`}`, "autoReserve", google.maps.ControlPosition.LEFT_TOP]);
      buttons.push(["⬆", "resetPosition", google.maps.ControlPosition.RIGHT_TOP]);
      buttons.push(["✖", "cancelDrive", google.maps.ControlPosition.BOTTOM_LEFT]);
    }
    else {
      buttons = [
        ["Center", "centerOnDriver", google.maps.ControlPosition.LEFT_BOTTOM],
        ["⬆", "resetPosition", google.maps.ControlPosition.RIGHT_TOP],
        ["Go to nearest parking lot", "nearestLot", google.maps.ControlPosition.BOTTOM_LEFT]
      ];
    }


    buttons.forEach(([text, mode, position]) => {
      const controlDiv = document.createElement("div");
      const controlUI = document.createElement("button");

      if(mode == "resetPosition") {
        controlUI.classList.add("ui-button-reset");
        controlDiv.classList.add("ui-button-reset");
      }

      if(mode == "centerOnDriver") {
        controlUI.classList.add("ui-button-center");
        controlDiv.classList.add("ui-button-center");
      }

      if(mode == "cancelDrive") {
        controlUI.classList.add("ui-button-cancel-drive");
        controlDiv.classList.add("ui-button-cancel-drive");
      }
      controlUI.classList.add("ui-button");
      controlUI.innerText = `${text}`;
      controlUI.addEventListener("click", () => {
        adjustMap(mode);
      });
      controlDiv.appendChild(controlUI);
      if(mode == "autoReserve" && hoursforAutoReserveRef.current != 0) {
        // controlUI.classList.add("ui-button-auto-reserve");
        controlDiv.classList.add("ui-button-auto-reserve");

        const controlUIInput = document.createElement("input");
        controlUIInput.classList.add("hours-to-reserve");
        controlUIInput.classList.add("ui-button");
        controlUIInput.type = "number";
        controlUIInput.min = "1";
        controlUIInput.max = "72";
        controlUIInput.value = `${hoursforAutoReserveRef.current}`;
        controlUIInput.addEventListener("change", () => {
          hoursforAutoReserveRef.current = (controlUIInput as HTMLInputElement).valueAsNumber;
          drawButtons();
        });

        if(isAutoReserveOnRef.current) {
          controlUIInput.classList.add("ui-button-active");
          controlUI.classList.add("ui-button-active");

        }
        controlDiv.appendChild(controlUIInput);
      }
      googleMapRef.current?.controls[position].push(controlDiv);
    });

    const adjustMap = function (mode: string) {
      switch (mode) {
        case "resetPosition":
            googleMapRef.current?.setTilt(0);
            googleMapRef.current?.setHeading(0);
            break;
        case "autoReserve":
          if(hoursforAutoReserveRef.current == 0) {
            isAutoReserveOnRef.current = false;
            hoursforAutoReserveRef.current = 1;
            drawButtons();
            return;
          }
          if(isAutoReserveOnRef.current) {
            isAutoReserveOnRef.current = false;
            drawButtons();
            return;
          }
          isAutoReserveOnRef.current = true;
          drawButtons();
          break;
        case "centerOnDriver":
          if(newRoutePointRef.current) {
            if(isDrivingBoolRef.current == true) {
              // used to trigger re-centering
              newRoutePointRef.current.lat += 0.00001;
              if(userLocationRef.current) {
                setTimeout(() => googleMapRef.current?.setZoom(17), 1000);
              }
            }
            else {
              if(userLocationRef.current) {
                googleMapRef.current?.panTo(userLocationRef.current);
              }
              else {
                drawButtons();
              }
            }
          }
          else {
            if(userLocationRef.current) {
              googleMapRef.current?.panTo(userLocationRef.current);
            }
            else {
              drawButtons();
            }
          }
          break;
        case "cancelDrive":
          if(userLocationRef.current) {
            googleMapRef.current?.setHeading(0);
            googleMapRef.current?.setTilt(0);
          }
          isDrivingBoolRef.current = false;

          directionsRendererRef.current?.setMap(null);
          directionsRendererRef.current = null;
          refreshNavigateTo();
          drawButtons();
          break;
        case "nearestLot": {
          if(userLocationRef.current == null) {
            alert("No user location");
            return;
          }
          if(availableParkingLotsRef.current.length == 0) {
            alert("No available parking lots");
            return;
          }
          const nearestLot = calculateNearestParkingLot({lat: userLocationRef.current.lat(), lng: userLocationRef.current.lng()}, availableParkingLotsRef.current);
          destinationLocationRef.current = new google.maps.LatLng(nearestLot.latitude, nearestLot.longitude);
          lotToReserveRef.current = nearestLot.id;
          handleDrive(nearestLot.id);
          break;
        }
        default:
          break;
      }
    };
  }, []);

  const calculateAndDisplayRoute = useCallback((start: google.maps.LatLng, end: google.maps.LatLng) => {
    if (directionsRendererRef.current == null) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer(
        {
          map: googleMapRef.current,

        });
        console.log("Creating new renderer");
    }
    if(directionsRendererRef.current == null) {
      return;
    }
    if (directionsServiceRef.current == null) {
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

  const updateMarkers = useCallback((parkingLots: ParkingLot[]) => {
      if (!googleMapRef.current || !parkingLots.length) {
        console.log("No google map or parking lots");
        return;
      }
      // Clear existing markers
      markersRef.current.forEach(marker => marker.map = null);



      const newMarkers = parkingLots.map(lot => {
        let customSymbolSVG;
        if(favoriteParkingLot >= 0 && lot.id == favoriteParkingLot) {
          customSymbolSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" fill="#FFD700" stroke="black" stroke-width="2"/>
      </svg>`
        }
        else {
          customSymbolSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" fill="#9333EA" stroke="black" stroke-width="2"/>
          </svg>`;
        }

        // Create the icon as a custom HTML element
        const customIcon = document.createElement('div');
        customIcon.innerHTML = customSymbolSVG;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: new google.maps.LatLng(lot.latitude, lot.longitude),
          map: googleMapRef.current,
          title: lot.name,
          content: customIcon
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
                    <div class="p-4 text-black bg-white rounded-lg shadow-lg">
                        <p class="text-lg font-bold -mt-5">${lot.name}</p>
                        ${favoriteParkingLot >= 0 && lot.id == favoriteParkingLot ? `<p class="text-sm font-bold text-yellow-600">Favorite parking lot</p>` : ''}
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

          infoWindow.open(googleMapRef.current, marker);
          infoWindowRef.current = infoWindow;

          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById(`reserve-button-${lot.id}`)?.addEventListener('click', () => {
              handleReserveClick(lot.id)
              lotToReserveRef.current = lot.id;
          });
          });

          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById(`drive-button-${lot.id}`)?.addEventListener('click', () =>
              {
                handleDrive(lot.id);
                lotToReserveRef.current = lot.id;
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

      if (googleMapRef.current) {
        googleMapRef.current.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });

        googleMapRef.current.addListener('drag', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });
      }
  }, [favoriteParkingLot]);

  useEffect(() => {
    getFavoriteLot(baseUrlString).then((lot) => {
      setFavoriteParkingLot(lot);
      updateMarkers(availableParkingLotsRef.current);
    });
  }, [baseUrlString, mapLoaded, favoriteParkingLot]);

  useEffect(() => {

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
  }, []);

  useEffect(() => {
    if(!googleMapRef.current) {
      return;
    }

    if(userLocationLastMarkerRef.current) {
      userLocationLastMarkerRef.current.position = userLocationRef.current;
    }
    else {

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
  
  
      const userMarker = new google.maps.marker.AdvancedMarkerElement({
        position: userLocationRef.current,
        map: googleMapRef.current,
        content: outerCircle,
        // content: customPinElement,
        // icon: customSymbol,
      });
  
      userLocationLastMarkerRef.current = userMarker;
    }

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
        return;
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

      // if user is 100 meters away from destination, reserve the spot
      if(isAutoReserveOnRef.current) {
        if(calculateDistance({lat: userLocationRef.current.lat(), lng: userLocationRef.current.lng()}, {lat: destinationLocationRef.current.lat(), lng: destinationLocationRef.current.lng()}) < 0.1) {
          if(carsRef.current[0] == null) {
            alert("No cars available for auto reservation");
            isAutoReserveOnRef.current = false;
            drawButtons();
            return;
          }
          console.log(carsRef.current);
          console.log(lotToReserveRef.current);
          confirmReservation(hoursforAutoReserveRef.current, carsRef.current[0].id, lotToReserveRef.current);
        }

      }

      // used to stop re-centering if the point to look forward to didnt refresh yet
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
    drawButtons();
    console.log("Driving");
    const parkingLot = availableParkingLotsRef.current.find((parkingLot) => parkingLot.id == key)
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
      setTimeout(() => googleMapRef.current?.setZoom(17), 1000);
    }

  }, [])
  
  useEffect(() => {
    console.log("Spot to navigate to:");
    console.log(spotToNavigateTo);
    if(spotToNavigateTo == -1) {
      return;
    }
    const parkingLot = parkingLotsRef.current.find((parkingLot) => 
    {
      console.log(spotToNavigateTo);
      console.log(parkingLot);
      return parkingLot.parkingSpotsIds.includes(spotToNavigateTo);
    })
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
      setTimeout(() => googleMapRef.current?.setZoom(17), 1000);
    }
    
    lotToReserveRef.current = parkingLot.id;

    googleMapElementRef.current?.scrollIntoView({
      behavior: 'smooth', // Options: 'auto' or 'smooth'
      block: 'center',    // Options: 'start', 'center', 'end', 'nearest'
      inline: 'center'    // Options: 'start', 'center', 'end', 'nearest'
    });

    handleDrive(spotToNavigateTo);

  }, [spotToNavigateTo]);



  return (
    
    <div style={{ height: '100%', width: '100%' }}>
      <div ref={googleMapElementRef} style={{ height: '100%', width: '100%' }} />

      <div className='z-2000000'>
        <ConfirmationModal
          key={modalForceRefresh}
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          onConfirm={confirmReservation}
          lotId={lotToReserveRef.current}
          title={modalTitle}
          message={modalMessage}
        />
      </div>
    </div>

  );
}

export default Map;