package com.smartparkinglot.backend.configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.util.List;

@Component
@Order(2)
public class FunctionsAndTriggersConfig {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        List<String> sqlStatements = List.of(
                "CREATE EXTENSION IF NOT EXISTS cube;",
                "CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;",
                "CREATE EXTENSION IF NOT EXISTS pgcrypto",

                "CREATE OR REPLACE FUNCTION TryLogin(\n" +
                        "    p_email users.email%TYPE,\n" +
                        "    p_password users.password%TYPE\n" +
                        ") RETURNS BOOLEAN AS $$\n" +
                        "DECLARE\n" +
                        "    stored_hash TEXT;\n" +
                        "    valid_user BOOLEAN;\n" +
                        "BEGIN\n" +
                        "    -- Retrieve the stored hash from the database for the given username\n" +
                        "    SELECT password INTO stored_hash\n" +
                        "    FROM users\n" +
                        "    WHERE email = p_email;\n" +
                        "\n" +
                        "    -- Check if the user exists and the password matches\n" +
                        "    IF stored_hash IS NOT NULL THEN\n" +
                        "        valid_user := (stored_hash = crypt(p_password, stored_hash));\n" +
                        "    ELSE\n" +
                        "        valid_user := FALSE;\n" +
                        "    END IF;\n" +
                        "\n" +
                        "    RETURN valid_user;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION IsBanned(\n" +
                    "    p_email users.email%TYPE\n" +
                    ") RETURNS BOOLEAN AS $$\n" +
                    "DECLARE\n" +
                    "    v_count INTEGER;\n" +
                    "BEGIN\n" +

                        "SELECT COUNT(*) INTO v_count\n" +
                        "FROM banned_users\n" +
                        "WHERE email = p_email;\n" +


                        "IF v_count = 1 THEN\n" +
                        "   return TRUE;\n" +
                        "ELSE\n" +
                        "    return FALSE;\n" +
                        "END IF;\n" +

                    "END;\n" +
                    "$$ LANGUAGE plpgsql;",


                "CREATE OR REPLACE FUNCTION EncryptPasswordFunction()\n" +
                        "RETURNS TRIGGER AS $$\n" +
                        "BEGIN\n" +
                        "    NEW.password := crypt(NEW.password, gen_salt('bf'));\n" +
                        "    RETURN NEW;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",


                "DO $$\n" +
                        "BEGIN\n" +
                        "    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'encrypt_password_trigger') THEN\n" +
                        "        CREATE TRIGGER encrypt_password_trigger\n" +
                        "        BEFORE INSERT OR UPDATE OF password ON users\n" +
                        "        FOR EACH ROW EXECUTE FUNCTION EncryptPasswordFunction();\n" +
                        "    END IF;\n" +
                        "END $$;",


                "CREATE OR REPLACE FUNCTION CalculateReservationCost(\n" +
                        "    p_start_time reservations.start_time%TYPE,\n" +
                        "    p_stop_time reservations.stop_time%TYPE,\n" +
                        "\tp_spot parking_spots.id%TYPE\n" +
                        ") RETURNS NUMERIC AS $$\n" +
                        "DECLARE\n" +
                        "    duration INTERVAL;\n" +
                        "    l_cost NUMERIC;\n" +
                        "\tv_price NUMERIC;\n" +
                        "BEGIN\n" +
                        "\n" +
                        "\tSELECT price INTO v_price FROM ( SELECT pl.price FROM parking_spots ps JOIN parking_lots pl ON ps.parking_lot_id = pl.id WHERE ps.id = p_spot);\n" +
                        "\n" +
                        "    duration := p_stop_time - p_start_time;\n" +
                        "    l_cost := EXTRACT(EPOCH FROM duration) / 3600 * v_price;\n" +
                        "    RETURN l_cost;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION GetAvailableParkingSpots(\n" +
                        "\tp_start_time TIMESTAMP, \n" +
                        "\tp_stop_time TIMESTAMP\n" +
                        ")\n" +
                        "RETURNS TABLE(id bigint, parking_lot_id bigint, plate VARCHAR, status VARCHAR, name VARCHAR) AS $$\n" +
                        "BEGIN\n" +
                        "    RETURN QUERY \n" +
                        "    SELECT ps.id, ps.parking_lot_id, ps.plate, ps.status, ps.name\n" +
                        "    FROM parking_spots ps\n" +
                        "    WHERE NOT EXISTS (\n" +
                        "        SELECT 1 FROM reservations r\n" +
                        "        WHERE r.parking_spot_id = ps.id\n" +
                        "        AND (\n" +
                        "            (r.start_time <= p_stop_time AND r.stop_time >= p_start_time)\n" +
                        "        )\n" +
                        "    );\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION CheckParkingSpotAvailability(\n" +
                        "    p_parking_spot_id parking_spots.id%TYPE,\n" +
                        "    p_start_time TIMESTAMP,\n" +
                        "    p_stop_time TIMESTAMP\n" +
                        ") RETURNS BOOLEAN AS $$\n" +
                        "DECLARE\n" +
                        "    l_count INTEGER;\n" +
                        "    l_available BOOLEAN := TRUE;\n" +
                        "BEGIN\n" +
                        "    SELECT COUNT(*) INTO l_count\n" +
                        "    FROM reservations\n" +
                        "    WHERE parking_spot_id = p_parking_spot_id\n" +
                        "    AND (\n" +
                        "        (start_time >= p_start_time AND start_time < p_stop_time) OR\n" +
                        "        (stop_time >= p_start_time AND stop_time < p_stop_time) OR\n" +
                        "        (start_time < p_start_time AND stop_time > p_stop_time)\n" +
                        "    );\n" +
                        "\n" +
                        "    IF l_count > 0 THEN\n" +
                        "        l_available := FALSE;\n" +
                        "    END IF;\n" +
                        "\n" +
                        "    RETURN l_available;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION CalculateReservationCost(\n" +
                        "    p_start_time reservations.start_time%TYPE,\n" +
                        "    p_stop_time reservations.stop_time%TYPE,\n" +
                        "\tp_spot parking_spots.id%TYPE\n" +
                        ") RETURNS NUMERIC AS $$\n" +
                        "DECLARE\n" +
                        "    duration INTERVAL;\n" +
                        "    l_cost NUMERIC;\n" +
                        "\tv_price NUMERIC;\n" +
                        "BEGIN\n" +
                        "\n" +
                        "\tSELECT price INTO v_price FROM ( SELECT pl.price FROM parking_spots ps JOIN parking_lots pl ON ps.parking_lot_id = pl.id WHERE ps.id = p_spot);\n" +
                        "\n" +
                        "    duration := p_stop_time - p_start_time;\n" +
                        "    l_cost := EXTRACT(EPOCH FROM duration) / 3600 * v_price;\n" +
                        "    RETURN l_cost;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION VerifyStatus()\n" +
                        "RETURNS TRIGGER AS $$\n" +
                        "BEGIN\n" +
                        "    IF NEW.status NOT IN ('active', 'cancelled', 'inactive') THEN\n" +
                        "        RAISE EXCEPTION 'Invalid status';\n" +
                        "    END IF;\n" +
                        "\t\n" +
                        "\tRETURN NEW;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "DO $$\n" +
                        "BEGIN\n" +
                        "    -- Check if the trigger 'verify_valid_reservation' does not exist\n" +
                        "    IF NOT EXISTS (\n" +
                        "        SELECT 1 FROM pg_trigger\n" +
                        "        WHERE tgname = 'verify_valid_reservation'\n" +
                        "    ) THEN\n" +
                        "        -- Create the trigger if it does not exist\n" +
                        "        CREATE TRIGGER verify_valid_reservation\n" +
                        "        BEFORE UPDATE OF status ON reservations\n" +
                        "        FOR EACH ROW\n" +
                        "        WHEN (NEW.status IS DISTINCT FROM OLD.status)\n" +
                        "        EXECUTE FUNCTION VerifyStatus();\n" +
                        "    END IF;\n" +
                        "END $$;",

                "CREATE OR REPLACE FUNCTION GetUsersActiveReservations(\n" +
                        "\tp_email users.email%TYPE\n" +
                        ")\n" +
                        "RETURNS TABLE(\n" +
                        "\tid BIGINT,\n" +
                        "    car_id BIGINT,\n" +
                        "    parking_spot_id BIGINT,\n" +
                        "    start_time TIMESTAMP,\n" +
                        "    stop_time TIMESTAMP,\n" +
                        "    status VARCHAR\n" +
                        ") AS $$\n" +
                        "BEGIN\n" +
                        "    RETURN QUERY \n" +
                        "    SELECT r.id, r.car_id, r.parking_spot_id, r.start_time, r.stop_time, r.status\n" +
                        "    FROM cars c\n" +
                        "\tJOIN reservations r\n" +
                        "\tON c.id = r.car_id\n" +
                        "\tAND c.email = p_email\n" +
                        "\tWHERE r.status = 'active';\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",

                "CREATE OR REPLACE FUNCTION GetUsersReservations(\n" +
                        "\tp_email users.email%TYPE\n" +
                        ")\n" +
                        "RETURNS TABLE(\n" +
                        "\tid BIGINT,\n" +
                        "    car_id BIGINT,\n" +
                        "    parking_spot_id BIGINT,\n" +
                        "    start_time TIMESTAMP,\n" +
                        "    stop_time TIMESTAMP,\n" +
                        "    status VARCHAR\n" +
                        ") AS $$\n" +
                        "BEGIN\n" +
                        "    RETURN QUERY \n" +
                        "    SELECT r.id, r.car_id, r.parking_spot_id, r.start_time, r.stop_time, r.status\n" +
                        "    FROM cars c\n" +
                        "\tJOIN reservations r\n" +
                        "\tON c.id = r.car_id\n" +
                        "\tAND c.email = p_email;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",


                "CREATE OR REPLACE FUNCTION GetUsersAvailablePlates(\n" +
                        "    p_email users.email%TYPE,\n" +
                        "    p_start_time TIMESTAMP,\n" +
                        "    p_stop_time TIMESTAMP\n" +
                        ")\n" +
                        "RETURNS TABLE(\n" +
                        "    plate VARCHAR,\n" +
                        "    id BIGINT,\n" +
                        "    capacity INTEGER,\n" +
                        "    type VARCHAR,\n" +
                        "    email VARCHAR\n" +
                        ") AS $$\n" +
                        "BEGIN\n" +
                        "    RETURN QUERY\n" +
                        "    SELECT c.plate, c.id, c.capacity, c.type, c.email\n" +
                        "    FROM cars c\n" +
                        "    WHERE c.email = p_email\n" +
                        "    AND NOT EXISTS (\n" +
                        "        SELECT 1\n" +
                        "        FROM reservations r\n" +
                        "        WHERE r.car_id = c.id\n" +
                        "        AND r.status = 'active'\n" +
                        "        AND (p_start_time < r.stop_time AND p_stop_time > r.start_time)\n" +
                        "    );\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;",


                "CREATE OR REPLACE FUNCTION GetUsersFavoriteParkingLot(\n" +
                        "    p_email users.email%TYPE\n" +
                        ")\n" +
                        "RETURNS BIGINT AS $$\n" +
                        "DECLARE\n" +
                        "    most_visited_lot BIGINT;\n" +
                        "    lot BIGINT;\n" +
                        "    max_count INT := 0;\n" +
                        "    count INT;\n" +
                        "    rec_row RECORD;\n" +
                        "    car_cursor CURSOR FOR SELECT id FROM cars WHERE email = p_email;\n" +
                        "BEGIN\n" +
                        "\n" +
                        "    OPEN car_cursor;\n" +
                        "    LOOP\n" +
                        "        FETCH car_cursor INTO rec_row;\n" +
                        "        EXIT WHEN NOT FOUND;\n" +
                        "\n" +
                        "        SELECT INTO lot, count\n" +
                        "            id, num_reservations\n" +
                        "        FROM (\n" +
                        "            SELECT\n" +
                        "                p.id,\n" +
                        "                COUNT(r.id) AS num_reservations\n" +
                        "            FROM\n" +
                        "                reservations r\n" +
                        "            JOIN\n" +
                        "                parking_spots s ON r.parking_spot_id = s.id\n" +
                        "            JOIN\n" +
                        "                parking_lots p ON s.parking_lot_id = p.id\n" +
                        "            WHERE\n" +
                        "                r.stop_time >= CURRENT_TIMESTAMP - INTERVAL '30 days'\n" +
                        "                AND\n" +
                        "                r.car_id = rec_row.id\n" +
                        "            GROUP BY\n" +
                        "                p.id\n" +
                        "            ORDER BY\n" +
                        "                num_reservations DESC\n" +
                        "            LIMIT 1\n" +
                        "        ) AS subquery;\n" +
                        "\n" +
                        "        IF count > max_count THEN\n" +
                        "            max_count := count;\n" +
                        "            most_visited_lot := lot;\n" +
                        "        END IF;\n" +
                        "    END LOOP;\n" +
                        "\n" +
                        "    CLOSE car_cursor;\n" +
                        "\n" +
                        "    RETURN most_visited_lot;\n" +
                        "END;\n" +
                        "$$ LANGUAGE plpgsql;"

        );

        sqlStatements.forEach(sql -> {
            jdbcTemplate.execute(sql);
        });
    }
}
