drop table cards;
drop table tokens;
drop table reservations;
drop table cars;
drop table parking_spots;
drop table parking_lots;
drop table user_types;
drop table users;



CREATE TABLE users (
    email VARCHAR(35) PRIMARY KEY,
	name VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    dob DATE,
    country VARCHAR(35),
    city VARCHAR(35),
    balance NUMERIC(5, 2) DEFAULT 0
);

CREATE TABLE user_types (
	type VARCHAR(11),
	email VARCHAR(35) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE messages (
	message_id SERIAL PRIMARY KEY,
	sender_email VARCHAR(35) REFERENCES users(email) ON DELETE SET NULL, 
	receiver_email VARCHAR(35) REFERENCES users(email) ON DELETE SET NULL,
	message_content VARCHAR(256),
	timestamp DATE,
	status BOOLEAN
);

CREATE TABLE cars (
    plate VARCHAR(7) PRIMARY KEY,
	capacity NUMERIC,
	type VARCHAR(35),
    email VARCHAR(35) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE cards (
    email VARCHAR(35) REFERENCES users(email) ON DELETE CASCADE,
    card VARCHAR(16)
);

CREATE TABLE tokens (
    token VARCHAR(200),
    email VARCHAR(35) REFERENCES users(email) ON DELETE CASCADE
);


CREATE TABLE parking_lots (
    id VARCHAR(11) PRIMARY KEY,
    nr_spots INTEGER,
	price NUMERIC,
    latitude NUMERIC,
    longitude NUMERIC
);

CREATE TABLE parking_spots (
    id VARCHAR(11) PRIMARY KEY,
    parking_lot_id VARCHAR(11) REFERENCES parking_lots(id) ON DELETE CASCADE,
    latitude NUMERIC,
    longitude NUMERIC
);

CREATE TABLE reservations (
    id VARCHAR(35) PRIMARY KEY,
    plate VARCHAR(7),
    parking_spot_id VARCHAR(11),
    start_time TIMESTAMP,
    stop_time TIMESTAMP,
    payment_confirmation VARCHAR(500),
    status VARCHAR(15),
    CONSTRAINT fk_plate FOREIGN KEY (plate) REFERENCES cars(plate) ON DELETE SET NULL,
    CONSTRAINT fk_parking_spot FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id) ON DELETE SET NULL
);


-- Indexes --

CREATE INDEX idx_fk_plate ON reservations (plate);
CREATE INDEX idx_fk_parking_spot ON reservations (parking_spot_id);


-- Users table functions and triggers -- 


CREATE OR REPLACE FUNCTION AddNewUser(
    p_email users.email%TYPE,
	p_name users.name%TYPE,
    p_password users.password%TYPE,
    p_dob users.dob%TYPE,
    p_country users.country%TYPE,
    p_city users.city%TYPE,
    p_balance users.balance%TYPE DEFAULT 0
) RETURNS VOID AS $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users WHERE email = p_email;

    IF user_count > 0 THEN
        RAISE EXCEPTION 'User already exists';
    END IF;

    INSERT INTO users (email, name, password, dob, country, city, balance)
    VALUES (p_mail, p_name, p_password, p_dob, p_country, p_city, p_balance);
	
END;
			
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION TryLogin(
    p_email users.email%TYPE,
    p_password users.password%TYPE
) RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
    valid_user BOOLEAN;
BEGIN
    -- Retrieve the stored hash from the database for the given username
    SELECT password INTO stored_hash
    FROM users
    WHERE email = p_email;

    -- Check if the user exists and the password matches
    IF stored_hash IS NOT NULL THEN
        valid_user := (stored_hash = crypt(p_password, stored_hash));
    ELSE
        valid_user := FALSE;
    END IF;

    RETURN valid_user;
END;
$$ LANGUAGE plpgsql;



CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION EncryptPasswordFunction()
RETURNS TRIGGER AS $$
BEGIN
    NEW.password := crypt(NEW.password, gen_salt('bf'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_password_trigger
BEFORE INSERT users
FOR EACH ROW
EXECUTE FUNCTION EncryptPasswordFunction();


CREATE OR REPLACE FUNCTION CheckAvailableBalance(
    p_email users.email%TYPE,
    p_required_balance NUMERIC
) RETURNS BOOLEAN AS $$
DECLARE
    user_balance NUMERIC;
BEGIN
    SELECT balance INTO user_balance FROM users WHERE email = p_email;
    
    RETURN user_balance >= p_required_balance;
END;
$$ LANGUAGE plpgsql;


-- Parking spots and cost functions and triggers --


CREATE OR REPLACE FUNCTION CalculateReservationCost(
    p_start_time reservations.start_time%TYPE,
    p_stop_time reservations.stop_time%TYPE,
	p_spot parking_spots.id%TYPE
) RETURNS NUMERIC AS $$
DECLARE
    duration INTERVAL;
    l_cost NUMERIC;
	v_price NUMERIC;
BEGIN

	SELECT price INTO v_price FROM ( SELECT pl.price FROM parking_spots ps JOIN parking_lots pl ON ps.parking_lot_id = pl.id WHERE ps.id = p_spot);

    duration := p_stop_time - p_start_time;
    l_cost := EXTRACT(EPOCH FROM duration) / 3600 * v_price;
    RETURN l_cost;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION CheckParkingSpotAvailability(
    p_parking_spot_id parking_spots.id%TYPE,
    p_start_time TIMESTAMP,
    p_stop_time TIMESTAMP
) RETURNS BOOLEAN AS $$
DECLARE
    l_count INTEGER;
    l_available BOOLEAN := TRUE;
BEGIN
    SELECT COUNT(*) INTO l_count
    FROM reservations
    WHERE parking_spot_id = p_parking_spot_id
    AND (
        (start_time >= p_start_time AND start_time < p_stop_time) OR
        (stop_time >= p_start_time AND stop_time < p_stop_time) OR
        (start_time < p_start_time AND stop_time > p_stop_time)
    );

    IF l_count > 0 THEN
        l_available := FALSE;
    END IF;

    RETURN l_available;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION VerifyUniqueSpotCoordinates()
RETURNS TRIGGER AS $$
DECLARE
    spot_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO spot_count 
    FROM parking_spots 
    WHERE latitude = NEW.latitude AND longitude = NEW.longitude;
	
	IF spot_count > 0 THEN
        RAISE EXCEPTION 'Spot already exists';
    END IF;
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verify_unique_spots
BEFORE INSERT ON parking_spots
FOR EACH ROW
EXECUTE FUNCTION VerifyUniqueSpotCoordinates();



CREATE OR REPLACE FUNCTION GetAvailableParkingSpots(
	p_start_time TIMESTAMP, 
	p_stop_time TIMESTAMP
)
RETURNS TABLE(id VARCHAR, parking_lot_id VARCHAR, latitude NUMERIC, longitude NUMERIC) AS $$
BEGIN
    RETURN QUERY 
    SELECT ps.id, ps.parking_lot_id, ps.latitude, ps.longitude
    FROM parking_spots ps
    WHERE NOT EXISTS (
        SELECT 1 FROM reservations r
        WHERE r.parking_spot_id = ps.id
        AND (
            (r.start_time <= p_stop_time AND r.stop_time >= p_start_time)
        )
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetMostVisitedParkingLot()
RETURNS VARCHAR AS $$
DECLARE
    most_visited_lot VARCHAR;
BEGIN
    -- Initialize variables
    most_visited_lot := '';

    -- Query to find the most visited parking lot
    SELECT INTO most_visited_lot
        id
    FROM (
        SELECT
            p.id,
            COUNT(r.id) AS num_reservations
        FROM
            reservations r
        JOIN
            parking_spots s ON r.parking_spot_id = s.id
        JOIN
            parking_lots p ON s.parking_lot_id = p.id
        WHERE
            r.stop_time >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        GROUP BY
            p.id
        ORDER BY
            num_reservations DESC
        LIMIT 1
    ) AS subquery;

    RETURN most_visited_lot;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetUsersFavoriteParkingLot(
    p_email users.email%TYPE
)
RETURNS VARCHAR AS $$
DECLARE
    most_visited_lot VARCHAR;
    lot VARCHAR;
    max_count INT := 0;
    count INT;
    rec_row RECORD;
    car_cursor CURSOR FOR SELECT plate FROM cars WHERE email = p_email;
BEGIN
    -- Initialize variables
    most_visited_lot := '';

    OPEN car_cursor;
    LOOP
        FETCH car_cursor INTO rec_row;
        EXIT WHEN NOT FOUND;
        
        SELECT INTO lot, count
            id, num_reservations
        FROM (
            SELECT
                p.id,
                COUNT(r.id) AS num_reservations
            FROM
                reservations r
            JOIN
                parking_spots s ON r.parking_spot_id = s.id
            JOIN
                parking_lots p ON s.parking_lot_id = p.id
            WHERE
                r.stop_time >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                AND
                r.plate = rec_row.plate -- Adjusted condition for the plate
            GROUP BY
                p.id
            ORDER BY
                num_reservations DESC
            LIMIT 1
        ) AS subquery;
        
        IF count > max_count THEN
            max_count := count;
            most_visited_lot := lot;
        END IF;
    END LOOP;

    CLOSE car_cursor;

    RETURN most_visited_lot;
END;
$$ LANGUAGE plpgsql;


-- Checking the recently created triggers and functions
SELECT tgname AS trigger_name
FROM pg_trigger
ORDER BY tgname DESC
LIMIT 3;

SELECT proname AS function_name
FROM pg_proc
WHERE pronamespace = (
SELECT oid
FROM pg_namespace
WHERE nspname = 'public'
)
AND proname IN ('AddNewUser', 'CalculateReservationCost', 'CheckParkingSpotAvailability', 'CheckAvailableBalance', 'TryLogin', 'VerifyUniqueSpotCoordinates', 'EncryptPasswordFunction')
AND prokind = 'f';

