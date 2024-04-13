-- CREATE OR REPLACE PROCEDURE AddNewUser(
--     p_username IN users.username%TYPE,
--     p_password IN users.password%TYPE,
--     p_type IN users.type%TYPE,
--     p_email IN users.email%TYPE,
--     p_dob IN users.dob%TYPE,
--     p_country IN users.country%TYPE,
--     p_city IN users.city%TYPE,
--     p_balance IN users.balance%TYPE DEFAULT 0
-- ) AS
-- BEGIN
--     IF (SELECT COUNT(*) FROM users WHERE username = p_username) > 0 THEN
--         RAISE_APPLICATION_ERROR(-20001, 'Username already exists');
-- END IF;
--
-- INSERT INTO users (username, password, type, email, dob, country, city, balance)
-- VALUES (p_username, p_password, p_type, p_email, p_dob, p_country, p_city, p_balance);
--
-- COMMIT;
-- END;
-- /
--
-- -- calculul pretului se face presupunand ca pretul stocat in db al locului este pe ora iar costul
-- -- final este calculat la minut. input-ul trebuie restrictionat in functie de regulile parcarii,
-- -- daca se poate rezerva la sfert, jumatate, ora intreaga sau la minut.
-- CREATE OR REPLACE FUNCTION CalculateReservationCost(
--     p_start_time IN reservations.start_time%TYPE,
--     p_stop_time IN reservations.stop_time%TYPE,
--     p_price IN parking_lots.price%TYPE
-- ) RETURN NUMBER AS
--     l_cost NUMBER;
--     l_start_hours NUMBER;
--     l_start_minutes NUMBER;
--     l_stop_hours NUMBER;
--     l_stop_minutes NUMBER;
-- BEGIN
--     l_start_minutes := EXTRACT(MINUTE FROM (p_start_time));
--     l_start_hours := EXTRACT(HOUR FROM (p_start_time));
--     l_stop_minutes := EXTRACT(MINUTE FROM (p_stop_time));
--     l_stop_hours := EXTRACT(HOUR FROM (p_stop_time));
--
--     l_cost := ((l_stop_minutes + l_stop_hours * 60) - (l_start_minutes + l_start_hours * 60)) * (p_price / 60);
-- RETURN l_cost;
-- END;
-- /
--
-- CREATE OR REPLACE FUNCTION CheckParkingSpotAvailability(
--     p_parking_spot_id IN parking_spots.id%TYPE,
--     p_start_time IN TIMESTAMP,
--     p_stop_time IN TIMESTAMP
-- ) RETURN BOOLEAN AS
--     l_available BOOLEAN := TRUE;
-- BEGIN
--     -- verificam daca exista un start/stop time in interiorul intervalului rezervarii curente
--     -- sau daca exista o rezervare care cuprinde cu totul rezervarea curenta
--     IF (SELECT COUNT(*) FROM reservations WHERE parking_spot_id = p_parking_spot_id AND
--     ((start_time >= p_start_time AND start_time < p_stop_time) OR
--      (stop_time >= p_start_time AND stop_time < p_stop_time) OR
--      (start_time < p_start_time AND stop_time > p_stop_time))) > 0 THEN
--     l_available := FALSE;
-- END IF;
--
-- RETURN l_available;
-- END;
-- /


DELIMITER //

CREATE PROCEDURE AddNewUser(
    IN p_username VARCHAR(35),
    IN p_password VARCHAR(35),
    IN p_type VARCHAR(11),
    IN p_email VARCHAR(35),
    IN p_dob DATE,
    IN p_country VARCHAR(35),
    IN p_city VARCHAR(35),
    IN p_balance DECIMAL(5, 2) -- DEFAULT keyword removed from here
)
BEGIN
    DECLARE user_count INT; -- DEFAULT 0 is not necessary as COUNT(*) will always return a value

SELECT COUNT(*) INTO user_count FROM users WHERE username = p_username;

IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists';
ELSE
        INSERT INTO users (username, password, type, email, dob, country, city, balance)
        VALUES (p_username, p_password, p_type, p_email, p_dob, p_country, p_city, p_balance);
END IF;
END //

DELIMITER ;


DELIMITER //

CREATE FUNCTION CalculateReservationCost(
    p_start_time TIMESTAMP,
    p_stop_time TIMESTAMP,
    p_price DECIMAL(10, 2)
) RETURNS DECIMAL(10, 2)
    DETERMINISTIC
BEGIN
    DECLARE l_duration_minutes INT;
    DECLARE l_cost DECIMAL(10, 2);

    -- Calculate the duration in minutes
    SET l_duration_minutes = TIMESTAMPDIFF(MINUTE, p_start_time, p_stop_time);

    -- Calculate the cost
    SET l_cost = l_duration_minutes * (p_price / 60);

RETURN l_cost;
END //

DELIMITER ;

DELIMITER //

CREATE FUNCTION CheckParkingSpotAvailability(
    p_parking_spot_id VARCHAR(11),
    p_start_time TIMESTAMP,
    p_stop_time TIMESTAMP
) RETURNS TINYINT(1)  -- Equivalent to BOOLEAN
                 DETERMINISTIC
BEGIN
    DECLARE l_count INT;

    -- Count existing reservations that overlap with the provided timeframe
SELECT COUNT(*) INTO l_count FROM reservations
WHERE parking_spot_id = p_parking_spot_id
  AND NOT (
    start_time >= p_stop_time OR
    stop_time <= p_start_time
    );

-- Return 0 (false) if there is an overlapping reservation, 1 (true) otherwise
IF l_count > 0 THEN
        RETURN 0;
ELSE
        RETURN 1;
END IF;
END //

DELIMITER ;

