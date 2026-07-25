package com.company.procurement;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * SignatureTemplateServlet
 * 
 * Handles saving/loading PR Signature Templates.
 * 
 * Endpoints:
 *   POST /SignatureTemplateServlet  → save template (JSON body)
 *   GET  /SignatureTemplateServlet?action=load&id=xxx → load template by ID
 *   GET  /SignatureTemplateServlet?action=list        → list all templates
 *   GET  /SignatureTemplateServlet?action=delete&id=xxx → delete template
 */
@WebServlet("/SignatureTemplateServlet")
public class SignatureTemplateServlet extends HttpServlet {

    // ─── POST: Save Template ─────────────────────────────────────────────────
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");

        // Read JSON body
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        String body = sb.toString();

        if (body == null || body.isEmpty()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"success\":false,\"error\":\"Empty request body\"}");
            return;
        }

        // Parse fields from JSON (simple manual parse — use Gson/Jackson in production)
        String templateId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String savedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Extract templateName for logging
        String templateName = extractJsonString(body, "templateName");
        String docType      = extractJsonString(body, "docType");
        String status       = extractJsonString(body, "status");

        // TODO: Persist to database
        // Example:
        //   Connection conn = DataSourceUtil.getConnection();
        //   PreparedStatement ps = conn.prepareStatement(
        //       "INSERT INTO signature_templates (id, name, doc_type, status, json_config, created_at) VALUES (?,?,?,?,?,?)");
        //   ps.setString(1, templateId);
        //   ps.setString(2, templateName);
        //   ps.setString(3, docType);
        //   ps.setString(4, status);
        //   ps.setString(5, body);
        //   ps.setString(6, savedAt);
        //   ps.executeUpdate();

        // Log
        log("[SignatureTemplate] SAVE id=" + templateId
            + " name=" + templateName
            + " docType=" + docType
            + " status=" + status
            + " at=" + savedAt);

        // Response
        String json = "{"
            + "\"success\":true,"
            + "\"templateId\":\"" + templateId + "\","
            + "\"savedAt\":\"" + savedAt + "\","
            + "\"message\":\"บันทึก Template เรียบร้อยแล้ว\""
            + "}";
        resp.getWriter().write(json);
    }

    // ─── GET: Load / List / Delete ────────────────────────────────────────────
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");

        String action = req.getParameter("action");
        if (action == null) action = "list";

        switch (action) {

            case "load": {
                String id = req.getParameter("id");
                if (id == null || id.isEmpty()) {
                    resp.setStatus(400);
                    resp.getWriter().write("{\"success\":false,\"error\":\"Missing id parameter\"}");
                    return;
                }
                // TODO: Load from database
                // Example:
                //   ResultSet rs = stmt.executeQuery("SELECT json_config FROM signature_templates WHERE id='" + id + "'");
                //   if (rs.next()) { String jsonConfig = rs.getString("json_config"); ... }
                String mockData = "{"
                    + "\"success\":true,"
                    + "\"templateId\":\"" + id + "\","
                    + "\"config\":{\"docType\":\"PR - ใบขอซื้อ\",\"status\":\"Active\"},"
                    + "\"groups\":[],"
                    + "\"signatureBoxes\":[]"
                    + "}";
                resp.getWriter().write(mockData);
                break;
            }

            case "list": {
                // TODO: Query database for all templates
                // Example:
                //   ResultSet rs = stmt.executeQuery("SELECT id, name, doc_type, status, created_at FROM signature_templates ORDER BY created_at DESC");
                String mockList = "{"
                    + "\"success\":true,"
                    + "\"templates\":["
                    + "{\"id\":\"TMPL001\",\"name\":\"PR-Standard-v1\",\"docType\":\"PR - ใบขอซื้อ\",\"status\":\"Active\"},"
                    + "{\"id\":\"TMPL002\",\"name\":\"PO-IT-v1\",\"docType\":\"PO - ใบสั่งซื้อ\",\"status\":\"Draft\"}"
                    + "]"
                    + "}";
                resp.getWriter().write(mockList);
                break;
            }

            case "delete": {
                String id = req.getParameter("id");
                if (id == null || id.isEmpty()) {
                    resp.setStatus(400);
                    resp.getWriter().write("{\"success\":false,\"error\":\"Missing id parameter\"}");
                    return;
                }
                // TODO: Delete from database
                // Example:
                //   stmt.executeUpdate("DELETE FROM signature_templates WHERE id='" + id + "'");
                log("[SignatureTemplate] DELETE id=" + id);
                resp.getWriter().write("{\"success\":true,\"deleted\":\"" + id + "\"}");
                break;
            }

            default: {
                resp.setStatus(400);
                resp.getWriter().write("{\"success\":false,\"error\":\"Unknown action: " + action + "\"}");
            }
        }
    }

    // ─── OPTIONS: CORS preflight ──────────────────────────────────────────────
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(200);
    }

    // ─── Helper: Extract JSON string value ────────────────────────────────────
    private String extractJsonString(String json, String key) {
        String search = "\"" + key + "\":\"";
        int start = json.indexOf(search);
        if (start < 0) return "";
        start += search.length();
        int end = json.indexOf("\"", start);
        if (end < 0) return "";
        return json.substring(start, end);
    }
}
