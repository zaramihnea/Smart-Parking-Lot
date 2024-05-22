# Smart-Parking-Lot

## Project Components

1. **Software-based Solution**
    - Utilize GPS locations and heuristics to determine when a user left their car parked.
    - Process data received from sensors to clean up the data and identify if the spot is occupied or not.
    - Use this curated data in a mobile and web application to show the availability status of the parking lot to the users.
    - Suggest parking spots to users who are on their way to the parking lot based on proximity to the parking lot entrance or other factors such as shade.
    - Allow users to automatically “reserve” parking spots as they are getting close to the parking lot. Other users should see that parking space as reserved. This feature should be enabled through the mobile app based on GPS location.
    - Register multiple parking lots in the application to enable users to see parking availability in multiple locations in the city.
    - Use the Google Maps API to allow users to set a destination, search for the nearest available parking space, and reserve it as the user approaches.

2. **Optional: Prototype Hardware Solution**
    - Create prototype hardware (Arduino) for detecting occupied/free parking spots and transmitting this raw information to a centralized server. This can be a project for students in the DSFUM course.
    - Alternatively, implement a software solution using computer vision applied to cameras looking at parking lots to detect free/occupied parking spots.
