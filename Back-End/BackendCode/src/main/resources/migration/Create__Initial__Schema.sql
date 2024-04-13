-- THE VERSION IN ORACLE SYNTAX

-- DROP TABLE users;
-- /
-- DROP TABLE plates;
-- /
-- DROP TABLE reservations;
-- /
-- DROP TABLE parking_spots;
-- /
-- DROP TABLE parking_lots;
-- /
-- DROP TABLE cards;
-- /
-- DROP TABLE tokens;
-- /
--
-- CREATE TABLE users (
--                        username VARCHAR2(35) PRIMARY KEY,
--                        password VARCHAR(35) NOT NULL,
--                        type VARCHAR(11) NOT NULL,
--                        email VARCHAR(35),
--                        dob DATE,
--                        country VARCHAR2(35),
--                        city VARCHAR(35),
--                        balance NUMBER(5, 3) DEFAULT 0
-- );
--
-- CREATE TABLE plates (
--                         plate VARCHAR2(7) PRIMARY KEY,
--                         username VARCHAR2(35) REFERENCES users(username) ON DELETE CASCADE
-- );
--
-- CREATE TABLE cards (
--                        username VARCHAR2(35) REFERENCES users(username) ON DELETE CASCADE,
--                        card VARCHAR2(16)
-- );
--
-- CREATE TABLE tokens (
--                         token VARCHAR(200),
--                         username VARCHAR(35) REFERENCES users(username) ON DELETE CASCADE
-- );
--
-- CREATE TABLE parking_lots (
--                               id VARCHAR2(11) PRIMARY KEY,
--                               nr_spots NUMBER,
--                               latitude NUMBER,
--                               longitude NUMBER
-- );
--
-- CREATE TABLE parking_spots (
--                                id VARCHAR2(11) PRIMARY KEY,
--                                parking_lot_id VARCHAR2(11) REFERENCES parking_lots(id) ON DELETE CASCADE,
--                                status VARCHAR(11) DEFAULT 'undefined',
--                                latitude NUMBER,
--                                longitude NUMBER
-- );
-- /
--
-- CREATE TABLE reservations (
--                               id VARCHAR2(35) PRIMARY KEY,
--                               plate VARCHAR2(7),
--                               parking_spot_id VARCHAR(11),
--                               start_time TIMESTAMP,
--                               stop_time TIMESTAMP,
--                               payment_confirmation VARCHAR2(500),
--                               status VARCHAR2(15),
--                               CONSTRAINT fk_plate FOREIGN KEY (plate) REFERENCES plates(plate) ON DELETE SET NULL,
--                               CONSTRAINT fk_parking_spot FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id) ON DELETE SET NULL
-- );

-- THE VERSION IN MYSQL SYNTAX

DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS plates;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS parking_spots;
DROP TABLE IF EXISTS parking_lots;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       username VARCHAR(35) PRIMARY KEY,
                       password VARCHAR(35) NOT NULL,
                       type VARCHAR(11) NOT NULL,
                       email VARCHAR(35),
                       dob DATE,
                       country VARCHAR(35),
                       city VARCHAR(35),
                       balance DECIMAL(5, 3) DEFAULT 0
);

CREATE TABLE plates (
                        plate VARCHAR(7) PRIMARY KEY,
                        username VARCHAR(35) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE cards (
                       username VARCHAR(35),
                       card VARCHAR(16),
                       FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE tokens (
                        token VARCHAR(200),
                        username VARCHAR(35),
                        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE parking_lots (
                              id VARCHAR(11) PRIMARY KEY,
                              nr_spots INT,
                              latitude DECIMAL(10, 8),
                              longitude DECIMAL(11, 8)
);

CREATE TABLE parking_spots (
                               id VARCHAR(11) PRIMARY KEY,
                               parking_lot_id VARCHAR(11),
                               status VARCHAR(11) DEFAULT 'undefined',
                               latitude DECIMAL(10, 8),
                               longitude DECIMAL(11, 8),
                               FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE
);

CREATE TABLE reservations (
                              id VARCHAR(35) PRIMARY KEY,
                              plate VARCHAR(7),
                              parking_spot_id VARCHAR(11),
                              start_time TIMESTAMP,
                              stop_time TIMESTAMP,
                              payment_confirmation VARCHAR(500),
                              status VARCHAR(15),
                              CONSTRAINT fk_plate FOREIGN KEY (plate) REFERENCES plates(plate) ON DELETE SET NULL,
                              CONSTRAINT fk_parking_spot FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id) ON DELETE SET NULL
);