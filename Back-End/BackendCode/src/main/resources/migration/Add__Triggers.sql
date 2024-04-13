# -- de modificat "free" si "reserved" cu valorile stabilite pentru status la parking spot
# CREATE OR REPLACE TRIGGER UpdateParkingSpotStatus
#               AFTER INSERT ON reservations
#                         FOR EACH ROW
# BEGIN
# UPDATE parking_spots SET status = 'reserved' WHERE id = :NEW.parking_spot_id;
# END;
# /


DELIMITER //

CREATE TRIGGER UpdateParkingSpotStatus
    AFTER INSERT ON reservations
    FOR EACH ROW
BEGIN
    UPDATE parking_spots SET status = 'reserved' WHERE id = NEW.parking_spot_id;
END //

DELIMITER ;
