package com.eis.esign;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

public class AuthApiServlet extends HttpServlet {

    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private DatabaseConfig databaseConfig;
    private String databaseInitError;

    @Override
    public void init() throws ServletException {
        try {
            databaseConfig = DatabaseConfig.load();
        } catch (IOException e) {
            databaseInitError = e.getMessage();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        addCors(resp);
        resp.setStatus(204);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        addCors(resp);
        String path = normalizePath(req);

        if ("/login".equals(path)) {
            login(req, resp);
            return;
        }

        writeError(resp, 404, "Unknown auth API path: " + path);
    }

    private void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (databaseConfig == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        LoginRequest loginRequest = GSON.fromJson(reader(req), LoginRequest.class);
        if (loginRequest == null || isBlank(loginRequest.usernameOrEmail) || isBlank(loginRequest.password)) {
            writeError(resp, 400, "usernameOrEmail and password are required");
            return;
        }

        try (Connection connection = databaseConfig.openConnection()) {
            UserAccount user = findUser(connection, loginRequest.usernameOrEmail.trim());
            if (user == null) {
                writeError(resp, 401, "Invalid username/email or password");
                return;
            }

            if (!user.active) {
                writeError(resp, 403, "User is inactive");
                return;
            }

            if (user.locked) {
                writeError(resp, 423, "User is locked");
                return;
            }

            if (!verifyPassword(loginRequest.password, user.passwordHash)) {
                incrementFailCount(connection, user.userId);
                writeError(resp, 401, "Invalid username/email or password");
                return;
            }

            resetFailCount(connection, user.userId);

            HttpSession session = req.getSession(true);
            String token = UUID.randomUUID().toString();
            session.setAttribute("authToken", token);
            session.setAttribute("userId", user.userId);
            session.setAttribute("username", user.username);

            Map<String, Object> result = ok();
            result.put("token", token);
            result.put("sessionId", session.getId());
            result.put("user_id", user.userId);
            result.put("username", user.username);
            result.put("email", user.email);
            result.put("full_name", user.fullName);
            result.put("active", user.active);
            result.put("locked", user.locked);
            result.put("login_fail_count", 0);
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Login database error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            writeError(resp, 500, "Password hash is not supported: " + e.getMessage());
        }
    }

    private UserAccount findUser(Connection connection, String usernameOrEmail) throws SQLException {
        String sql =
                "SELECT TOP (1) user_id, username, email, password_hash, full_name, active, locked, login_fail_count " +
                "FROM [EIS_ERP].[dbo].[users] " +
                "WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, usernameOrEmail);
            ps.setString(2, usernameOrEmail);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }

                UserAccount user = new UserAccount();
                user.userId = rs.getLong("user_id");
                user.username = rs.getString("username");
                user.email = rs.getString("email");
                user.passwordHash = rs.getString("password_hash");
                user.fullName = rs.getString("full_name");
                user.active = rs.getBoolean("active");
                user.locked = rs.getBoolean("locked");
                user.loginFailCount = rs.getInt("login_fail_count");
                return user;
            }
        }
    }

    private boolean verifyPassword(String password, String passwordHash) {
        if (isBlank(passwordHash)) {
            return false;
        }

        String normalizedHash = passwordHash.trim();
        if (normalizedHash.startsWith("$2y$") || normalizedHash.startsWith("$2b$")) {
            normalizedHash = "$2a$" + normalizedHash.substring(4);
        }
        return BCrypt.checkpw(password, normalizedHash);
    }

    private void incrementFailCount(Connection connection, long userId) throws SQLException {
        String sql =
                "UPDATE [EIS_ERP].[dbo].[users] " +
                "SET login_fail_count = ISNULL(login_fail_count, 0) + 1, updated_date = GETDATE() " +
                "WHERE user_id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
        }
    }

    private void resetFailCount(Connection connection, long userId) throws SQLException {
        String sql =
                "UPDATE [EIS_ERP].[dbo].[users] " +
                "SET login_fail_count = 0, updated_date = GETDATE() " +
                "WHERE user_id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
        }
    }

    private Reader reader(HttpServletRequest req) throws IOException {
        return new InputStreamReader(req.getInputStream(), StandardCharsets.UTF_8);
    }

    private String normalizePath(HttpServletRequest req) {
        String path = req.getPathInfo();
        return path == null || path.trim().isEmpty() ? "/" : path;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Map<String, Object> ok() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("success", true);
        return map;
    }

    private void writeJson(HttpServletResponse resp, int status, Object value) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(GSON.toJson(value));
    }

    private void writeError(HttpServletResponse resp, int status, String message) throws IOException {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("success", false);
        error.put("message", message);
        writeJson(resp, status, error);
    }

    private void addCors(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
    }

    private static class LoginRequest {
        String usernameOrEmail;
        String password;
    }

    private static class UserAccount {
        long userId;
        String username;
        String email;
        String passwordHash;
        String fullName;
        boolean active;
        boolean locked;
        int loginFailCount;
    }
}
