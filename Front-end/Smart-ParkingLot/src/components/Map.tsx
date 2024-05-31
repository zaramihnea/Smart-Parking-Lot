import { useState, useEffect, useMemo, useRef } from 'react';
import { ParkingLot } from '../types/ParkingLot';
import useParkingLots from '../hooks/useParkingLots';
import { ConfirmationModal } from './ReservationModal';
import useReservations from '../hooks/useReservations';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';
import { getPointAtDistance, calculateBearing } from './helperFunctions';
import { LatLngExpression } from '../types/LatLngExpression';

function Map() {
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const googleMapElementRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const userLocationLastMarkerRef = useRef<google.maps.Marker | null>(null);
  const userLocationRef = useRef<google.maps.LatLng | null>(userLocation);

  // const [userPosition, setUserPosition] = useState<L.LatLngExpression | null>(null);
  // const [shouldCenter, setShouldCenter] = useState(true); // Controls whether the map should re-center
  // const [hasUserConsented, setHasUserConsented] = useState(false);


  const baseUrl = process.env.API_BASE_URL;
  const [baseUrlString] = useState<string>(baseUrl || 'http://localhost:8081');

  // center of the map, currently set on Iasi
  // wrap the centerOfIasi in a useMemo hook to avoid recalculating it on every render
  const centerOfIasi = useMemo(() => [47.169765, 27.576554], []);
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

        const data = await getAvailableParkingLotsAndClosestLot(baseUrlString, radius, 47.169765, centerOfIasi[1], startTime, stopTime);
        setAvailableParkingLots(data.parkingLots);
        availableParkingLotsRef.current = data.parkingLots;
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchData();
  }, [baseUrlString, getAvailableParkingLotsAndClosestLot, centerOfIasi]);

  const handleReserveClick = async (lotId: number) => {
    console.log("Reserving spot at lot", lotId);
    setLotToReserve(lotId);
    setModalTitle('Confirmation');
    setModalMessage(`Reserve parking spot at this parking lot?`);
    setModalIsOpen(true);
  };



  useEffect(() => {
    getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
      setCars(fetchedCars);
    });
  }, [baseUrlString, getUserCars]);

  const confirmReservation = async (hoursToReserve: number, carId: number) => {
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
  };

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // do not fix this error, this error good error
      await import('https://maps.googleapis.com/maps/api/js?key=AIzaSyC0c45KPuqZ2kVQcNWU89SLAj0m7DhKQ-A&libraries=places');
      if (googleMapElementRef.current) {
        const map = new window.google.maps.Map(googleMapElementRef.current, {
          center: { lat: centerOfIasi[0], lng: centerOfIasi[1] },
          zoom: 14,
          mapId: '3f8a6f95f7f9e84e', // Add your mapId here
          mapTypeId: 'terrain',
        });

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

        setGoogleMap(map);
        googleMapRef.current = map;

        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: map,
        });
      }
    };

    loadGoogleMaps();
  }, []);

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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          },
          (err) => {
            console.log('Error getting location:', err);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
      googleMapRef.current.panTo(new google.maps.LatLng(availableParkingLotsRef.current[0].latitude, availableParkingLotsRef.current[0].longitude));

      // Delay setting heading, tilt, and zoom by 1 second
      setTimeout(() => {
        googleMapRef.current!.setHeading(80);
        googleMapRef.current!.setTilt(60);
        googleMapRef.current!.setZoom(17);
      }, 1000);

      if(!userLocationRef.current) {
        console.log("No user location");
        return;
      }

      //show the user location on the map

      if(userLocationLastMarkerRef.current) {
        userLocationLastMarkerRef.current.setMap(null);
      }

      const customSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#03cafc',
        fillOpacity: 1,
        strokeWeight: 1,
      };

      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: googleMapRef.current,
        icon: customSymbol,
      });

      userLocationLastMarkerRef.current = userMarker;
      // googleMapRef.current.setCenter(userLocation);

      calculateAndDisplayRoute(userLocationRef.current, new google.maps.LatLng(availableParkingLots[0].latitude, availableParkingLots[0].longitude));
      // center the map on the user location


      
      const bearing = calculateBearing({ lat: userLocationRef.current.lat(), lng: userLocationRef.current.lng() }, { lat: availableParkingLots[0].latitude, lng: availableParkingLots[0].longitude });

      

    };

    // Update location immediately and then every 2.5 seconds
    updateLocation();
    const intervalId = setInterval(updateLocation, 2500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Define custom symbol
      const customSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10, // Adjust scale as needed
        fillColor: '#9333EA',
        fillOpacity: 1,
        strokeWeight: 1,
      };

      if (userLocationLastMarkerRef.current) {
        // Update existing marker position
        userLocationLastMarkerRef.current.setPosition(userLocation);
      } else {
        // Create new marker
        const userMarker = new google.maps.Marker({
          position: userLocation,
          map: googleMapRef.current,
          icon: customSymbol,
        });

        userLocationLastMarkerRef.current = userMarker;
      }
    }
  }, [userLocation]);

  const calculateAndDisplayRoute = (start: google.maps.LatLng, end: google.maps.LatLng) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) {
      return;
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
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    const updateMarkers = (parkingLots: ParkingLot[]) => {
      if (!googleMap || !parkingLots.length) {
        return;
      }
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));



      const newMarkers = parkingLots.map(lot => {
        const customSymbol = {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z",
          fillColor: '#9333EA', // Choose the color of the symbol
          fillOpacity: 1,
          strokeColor: 'black', // Choose the color of the stroke
          strokeWeight: 2,
          scale: 1.5, // Adjust the size of the symbol
          anchor: new google.maps.Point(12, 22),
        };

        const marker = new window.google.maps.Marker({
          position: { lat: lot.latitude, lng: lot.longitude },
          map: googleMapRef.current,
          title: lot.name,
          icon: customSymbol,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
                    <div class="p-4 text-black bg-white rounded-lg shadow-lg">
                        <p class="text-lg font-bold">${lot.name}</p>
                        <p class="mt-2 text-sm">Spots available: ${lot.parkingSpotsIds.length} / ${lot.nrSpots}</p>
                        <p class="mt-2 text-sm">Price per hour: ${lot.price} RON</p>
                        <button id="reserve-button-${lot.id}" class="mt-2 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">Reserve</button>
                    </div>`,
        });

        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }

          infoWindow.open(googleMapRef.current, marker);
          infoWindowRef.current = infoWindow;

          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById(`reserve-button-${lot.id}`)?.addEventListener('click', () => handleReserveClick(lot.id));
          });
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



    };

    if (googleMap) {
      updateMarkers(availableParkingLots);
    }
  }, [googleMap, availableParkingLots, markersRef, centerOfIasi]);

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