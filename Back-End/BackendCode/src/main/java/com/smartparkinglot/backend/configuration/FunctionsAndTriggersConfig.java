package com.smartparkinglot.backend.configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class FunctionsAndTriggersConfig {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        List<String> sqlStatements = List.of(
                "CREATE EXTENSION IF NOT EXISTS pgcrypto",


                // Add your function definitions here, each as a separate string
                "CREATE OR REPLACE FUNCTION TryLogin(\n" +
                        "    p_username users.username%TYPE,\n" +
                        "    p_password users.password%TYPE\n" +
                        ") RETURNS BOOLEAN AS $$\n" +
                        "DECLARE\n" +
                        "    stored_hash TEXT;\n" +
                        "    valid_user BOOLEAN;\n" +
                        "BEGIN\n" +
                        "    -- Retrieve the stored hash from the database for the given username\n" +
                        "    SELECT password INTO stored_hash\n" +
                        "    FROM users\n" +
                        "    WHERE username = p_username;\n" +
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
                        "        BEFORE INSERT ON users\n" +
                        "        FOR EACH ROW EXECUTE FUNCTION EncryptPasswordFunction();\n" +
                        "    END IF;\n" +
                        "END $$;"
        );

        sqlStatements.forEach(sql -> {
            jdbcTemplate.execute(sql);
        });
    }
}
