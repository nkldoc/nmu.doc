package com.eis.esign;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConfig {
    private final String url;
    private final String user;
    private final String password;

    private DatabaseConfig(String url, String user, String password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    public static DatabaseConfig load() throws IOException {
        Properties properties = new Properties();
        try (InputStream in = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in == null) {
                throw new IOException("db.properties not found in classpath");
            }
            properties.load(in);
        }

        return new DatabaseConfig(
                require(properties, "db.url"),
                require(properties, "db.user"),
                require(properties, "db.pass")
        );
    }

    public Connection openConnection() throws SQLException {
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        } catch (ClassNotFoundException ignored) {
            // JDBC 4 drivers can still be discovered by DriverManager.
        }
        return DriverManager.getConnection(url, user, password);
    }

    public String safeUrl() {
        return url.replaceAll("(?i)(password|pwd)=([^;]+)", "$1=***");
    }

    private static String require(Properties properties, String key) throws IOException {
        String value = properties.getProperty(key);
        if (value == null || value.trim().isEmpty()) {
            throw new IOException(key + " is required in db.properties");
        }
        return value.trim();
    }
}
