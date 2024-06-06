# Smart-Parking-Lot

A smart parking solution is needed which can detect occupied/free parking spots in a parking lot. The users can access this information through a web and mobile application. Heuristically making multiple rounds around a location to find a free parking spot is a time, fuel, and energy waste for each driver when looking for a parking spot, this also causes additional traffic congestion to every traffic participant which reduces the effectiveness of the city and increases pollution.


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

## HomePage

<img src="https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/2dabd2be-152c-4010-855f-4c678a3d5869" alt="Alt text" width="400"/>





   - Alternate between map styles <br/>
   ![Screenshot_172](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/c9d3bd58-91ac-424e-9aea-49682418d9b3)
   ![Screenshot_171](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/581dcd3d-c8f7-407c-8e8a-8f2b640575ed)
   ![Screenshot_173](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/1b740472-99e9-45d1-8816-9a340e465e65)

   - Drive to the nearest parking spot that has atleast one parking spot available
# ![Screenshot_174](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/9c46df37-a02c-4044-b5db-65c4a1545379) ➡ ![Screenshot_175](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/dc8b19cb-6894-4518-8ff5-3e8cc787d354)

   - Map markers for each parking lot, with a golden marker for the user's favorite parking lot
     
   ![Screenshot_178](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/b2285fa2-5cd9-43c1-a36a-c058d59856ca)

   - Drive to any parking lot after pressing the Drive To button on the desired parking lot marker, with the screen constantly following the road ahead to improve the driving experience
     
     ![Screenshot_179](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/1fd5a8ed-8967-48bd-b0c2-37cddf689868)

   - Reserve a parking lot after pressing the Reserve button on the desired parking lot marker

     
   ![Screenshot_185](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/a5548aa6-31f4-4991-9bc1-7826dee1d241)


   - View, drive to, cancel, navigate to the current reservations in the homepage <br/>
    ![Screenshot_180](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/a4d110ac-e3f5-4615-82c5-9a7a25a34332)

   - Auto reserve a parking spot on arrival to the parking lot
     
     ![Screenshot_183](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/07e87034-4229-4e54-a723-2fa5ee7f7858)

## Profile ( Parking Lot Admin Account Version )

<img src="https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/7e74964a-22fa-4b11-b220-a5da974de416" alt="Alt text" width="400"/>

   - Account Details

![Screenshot_188](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/06215b94-bcbd-473b-a85a-2c96944affc1)


   - View, Delete, Add car information

   ![Screenshot_189](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/42778e91-5faf-46ef-9ad6-4b10c965136a)

   - Add, edit parking lot, view parking lot notifications(Notifications are sent when a user without a reservation enters a parking lot reserved by other user, or a empty spot he didn't reserve)

   ![Screenshot_193](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/3f7e0308-2a7a-4cd1-995b-ecdd37dcab99)


   - Add new parking lot
   
     ![Screenshot_192](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/c2b8340a-2e9b-4ccb-a70e-7899fe45b1ae)

   - Edit parking lot data

     ![Screenshot_194](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/d171cdea-a736-4363-ba96-9d24c747df87)

   - Pay for a reservation

# ![Screenshot_201](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/bbafcbcf-0c5f-46cb-a5b7-15c0ef44cdd8) ➡ ![Screenshot_202](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/28bf492b-5e8b-4b5a-9e57-4aef8bc54e57) ➡ ![Screenshot_203](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/4555865e-3d76-401f-a578-5f188ddc8019) ➡ ![Screenshot_204](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/1fe9d781-47ea-4b61-8782-770e539c6088) ➡ ![Screenshot_205](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/c98dc59f-0bce-4a3d-aca3-b33cc44664a1) ➡ ![Screenshot_206](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/f0822e67-72fb-4508-a957-d6de38514836)

## Talk to a Helper Agent

   - If you have a issue with the app, you can contact a agent and speak with him in real time to solve your issue

   ![Screenshot_207](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/dea86d38-c3d1-4f6d-9def-9a311cd8c6d2)

## Profile ( Application Admin Account Version )

   ![Screenshot_208](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/7ecffbb5-d058-4130-83b2-698f0ce3eff3)

   - Receive questions, tickets through LiveChat and HelpDesk, and see all users

   ![Screenshot_209](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/db66a76c-7366-4cf2-af4c-3027aaf5e5b7)

   - Search and ban a user
   
   ![Screenshot_210](https://github.com/zaramihnea/Smart-Parking-Lot/assets/108344766/9dc513aa-1bfb-4088-8149-7b7e99979bfd)
