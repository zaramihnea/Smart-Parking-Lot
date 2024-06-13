package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.customexceptions.EmailExistsException;
import com.smartparkinglot.backend.customexceptions.UserIsBannedException;
import com.smartparkinglot.backend.customexceptions.UsernameExistsException;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.Token;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.ReservationRepository;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.access.InvalidInvocationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CarService carService;
    private final TokenService tokenService;
    private final ReservationRepository reservationRepository;

    @Autowired
    public UserService(UserRepository userRepository, CarService carService, TokenService tokenService, ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.carService = carService;
        this.tokenService = tokenService;
        this.reservationRepository = reservationRepository;
    }

    public User getUserById(String id){
        return userRepository.findById(id).orElse(null);
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteUserById(String id){
        userRepository.deleteById(id);
    }
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void register(User user) throws UsernameExistsException, EmailExistsException, UserIsBannedException {

        if( userRepository.isBanned(user.getEmail()) ){
            throw new UserIsBannedException("User is banned");
        }

        boolean emailExists = userRepository.existsByEmail(user.getEmail());

        if(emailExists) {
            throw new EmailExistsException("Email taken");
        }

        userRepository.save(user);
    }
    // Method to authenticate user using the TryLogin function
    public boolean authenticateUser(String email, String password) {
        return userRepository.tryLogin(email, password);
    }


    public void changePassword(User user, String password){
        userRepository.updatePassword(user.getEmail(), password);
    }

    @Transactional
    public void banUser(User user) {
        userRepository.deleteFromUsersTable(user.getEmail());
        userRepository.addToBannedUsers(user.getEmail());
    }

    public void createUser(User user) {
        if(userRepository.existsByEmail(user.getEmail())){
            throw new InvalidInvocationException("User already exists");
        }
        userRepository.save(user);
    }

    @Transactional
    public void updateStripeAccountId(String email, String stripeAccountId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            userRepository.updateStripeAccountId(email, stripeAccountId);
        }
    }

    public String getUserInfoByEmail(String email) {
        User user = userRepository.findById(email).orElse(null);
        if (user != null) {
            return user.toString();
        } else {
            return "No user found with email: " + email;
        }
    }

    public Long getFavoriteLot(User user){
        return userRepository.getFavoriteLot(user.getEmail());
    }

    @Transactional
    public void deleteUser(User userAuthorized) {
        reservationRepository.deleteUserReservations(userAuthorized.getEmail());
        carService.deleteUserCars(userAuthorized);
        tokenService.deleteUserTokens(userAuthorized);
        userRepository.deleteUserByEmail(userAuthorized.getEmail());
    }
}
