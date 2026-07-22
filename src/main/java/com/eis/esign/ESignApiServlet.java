package com.eis.esign;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import org.apache.pdfbox.pdmodel.PDDocument;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@WebServlet(urlPatterns = {"api/esign/*"})
@MultipartConfig(maxFileSize = 50 * 1024 * 1024, maxRequestSize = 60 * 1024 * 1024)
public class ESignApiServlet extends HttpServlet {

    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private File storageDir;
    private File templateDir;
    private File requestDir;
    private PdfBoxSigningService signingService;
    private ESignDatabase database;
    private String databaseInitError;

    @Override
    public void init() throws ServletException {
        String configured = getServletContext().getInitParameter("esign.storage.dir");
        if (configured == null || configured.trim().isEmpty()) {
            configured = System.getProperty("esign.storage.dir");
        }
        if (configured == null || configured.trim().isEmpty()) {
            configured = System.getProperty("java.io.tmpdir") + File.separator + "nmu-doc-esign";
        }

        storageDir = new File(configured);
        templateDir = new File(storageDir, "templates");
        requestDir = new File(storageDir, "requests");
        templateDir.mkdirs();
        requestDir.mkdirs();
        signingService = new PdfBoxSigningService();
        try {
            database = new ESignDatabase(DatabaseConfig.load());
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
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        addCors(resp);
        String path = normalizePath(req);

        if ("/health".equals(path)) {
            Map<String, Object> result = ok();
            result.put("service", "nmu-doc-esign");
            result.put("storageDir", storageDir.getAbsolutePath());
            result.put("databaseConfigured", database != null);
            result.put("databaseUrl", database == null ? null : database.databaseUrl());
            result.put("databaseError", databaseInitError);
            result.put("endpoints", new String[]{
                "POST /api/esign/scan",
                "GET /api/esign/db/health",
                "POST /api/esign/db/init",
                "GET /api/esign/roles",
                "POST /api/esign/roles",
                "GET /api/esign/templates",
                "POST /api/esign/templates",
                "GET /api/esign/templates/{templateCode}",
                "DELETE /api/esign/templates/{templateCode}",
                "POST /api/esign/requests",
                "POST /api/esign/requests/{requestId}/sign"
            });
            writeJson(resp, 200, result);
            return;
        }

        if ("/db/health".equals(path)) {
            databaseHealth(resp);
            return;
        }

        if ("/roles".equals(path)) {
            listRoles(resp);
            return;
        }

        if ("/templates".equals(path)) {
            listTemplates(resp);
            return;
        }

        if (path.startsWith("/templates/")) {
            String templateCode = safeName(path.substring("/templates/".length()));
            if (database != null) {
                try {
                    String templateJson = database.findTemplateJson(templateCode);
                    if (templateJson != null) {
                        resp.setContentType("application/json; charset=UTF-8");
                        resp.getWriter().write(templateJson);
                        return;
                    }
                } catch (SQLException e) {
                    writeError(resp, 500, "Database read failed: " + e.getMessage());
                    return;
                }
            }
            File json = new File(new File(templateDir, templateCode), "template.json");
            if (!json.exists()) {
                writeError(resp, 404, "Template not found: " + templateCode);
                return;
            }
            resp.setContentType("application/json; charset=UTF-8");
            Files.copy(json.toPath(), resp.getOutputStream());
            return;
        }

        writeError(resp, 404, "Unknown API path: " + path);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        addCors(resp);
        String path = normalizePath(req);

        if (path.startsWith("/templates/")) {
            deleteTemplate(path, resp);
            return;
        }

        writeError(resp, 404, "Unknown API path: " + path);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        addCors(resp);
        String path = normalizePath(req);

        if ("/scan".equals(path)) {
            scanPdf(req, resp);
            return;
        }

        if ("/db/init".equals(path)) {
            initDatabase(resp);
            return;
        }

        if ("/roles".equals(path)) {
            saveRole(req, resp);
            return;
        }

        if ("/templates".equals(path)) {
            saveTemplate(req, resp);
            return;
        }

        if ("/requests".equals(path)) {
            createRequest(req, resp);
            return;
        }

        if (path.startsWith("/requests/") && path.endsWith("/sign")) {
            signRequest(path, req, resp);
            return;
        }

        writeError(resp, 404, "Unknown API path: " + path);
    }

    private void scanPdf(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        Part pdf = req.getPart("pdf");
        if (pdf == null || pdf.getSize() == 0) {
            writeError(resp, 400, "Missing multipart field: pdf");
            return;
        }

        try (InputStream in = pdf.getInputStream(); PDDocument doc = PDDocument.load(in)) {
            Map<String, Object> result = ok();
            result.put("fileName", submittedFileName(pdf));
            result.put("pageCount", doc.getNumberOfPages());
            result.put("encrypted", doc.isEncrypted());
            writeJson(resp, 200, result);
        }
    }

    private void saveTemplate(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        String rawTemplate = readPartText(req.getPart("templateJson"));
        if (rawTemplate == null || rawTemplate.trim().isEmpty()) {
            writeError(resp, 400, "Missing multipart field: templateJson");
            return;
        }

        ESignTemplate template;
        try {
            template = GSON.fromJson(rawTemplate, ESignTemplate.class);
        } catch (JsonSyntaxException e) {
            writeError(resp, 400, "Invalid templateJson: " + e.getMessage());
            return;
        }
        if (template == null || template.signGroup == null || isBlank(template.signGroup.templateCode)) {
            writeError(resp, 400, "templateJson.signGroup.templateCode is required");
            return;
        }

        String templateCode = safeName(template.signGroup.templateCode);
        File dir = new File(templateDir, templateCode);
        dir.mkdirs();

        File jsonFile = new File(dir, "template.json");
        String normalizedTemplateJson = GSON.toJson(template);
        Files.write(jsonFile.toPath(), normalizedTemplateJson.getBytes(StandardCharsets.UTF_8));

        Part samplePdf = req.getPart("samplePdf");
        if (samplePdf != null && samplePdf.getSize() > 0) {
            copyPart(samplePdf, new File(dir, "sample.pdf"));
        }

        boolean savedToDatabase = false;
        if (database != null) {
            try {
                database.saveTemplate(template, normalizedTemplateJson);
                savedToDatabase = true;
            } catch (SQLException e) {
                writeError(resp, 500, "Template file saved, but database save failed: " + e.getMessage());
                return;
            }
        }

        Map<String, Object> result = ok();
        result.put("templateCode", templateCode);
        result.put("templatePath", jsonFile.getAbsolutePath());
        result.put("hasSamplePdf", new File(dir, "sample.pdf").exists());
        result.put("mssqlTable", template.workflow == null ? null : template.workflow.mssqlTable);
        result.put("savedToDatabase", savedToDatabase);
        writeJson(resp, 201, result);
    }

    private void createRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SigningRequest request = GSON.fromJson(reader(req), SigningRequest.class);
        if (request == null || isBlank(request.templateCode)) {
            writeError(resp, 400, "templateCode is required");
            return;
        }

        String templateCode = safeName(request.templateCode);
        String dbTemplateJson = null;
        if (database != null) {
            try {
                dbTemplateJson = database.findTemplateJson(templateCode);
            } catch (SQLException e) {
                writeError(resp, 500, "Database read failed: " + e.getMessage());
                return;
            }
        }

        File templateJsonFile = new File(new File(templateDir, templateCode), "template.json");
        if (dbTemplateJson == null && !templateJsonFile.exists()) {
            writeError(resp, 404, "Template not found: " + templateCode);
            return;
        }

        String requestId = "REQ-" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + "-" + UUID.randomUUID().toString().substring(0, 8);
        request.requestId = requestId;
        request.status = "WAITING_SIGNATURE";
        request.createdAt = isoNow();

        File dir = new File(requestDir, safeName(requestId));
        dir.mkdirs();
        String requestJson = GSON.toJson(request);
        Files.write(new File(dir, "request.json").toPath(), requestJson.getBytes(StandardCharsets.UTF_8));

        boolean savedToDatabase = false;
        if (database != null) {
            try {
                database.saveRequest(request, requestJson);
                savedToDatabase = true;
            } catch (SQLException e) {
                writeError(resp, 500, "Request file saved, but database save failed: " + e.getMessage());
                return;
            }
        }

        Map<String, Object> result = ok();
        result.put("requestId", requestId);
        result.put("status", request.status);
        result.put("workflow", "STARTED");
        result.put("legacyCallback", "QUEUED");
        result.put("savedToDatabase", savedToDatabase);
        writeJson(resp, 201, result);
    }

    private void signRequest(String path, HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        String requestId = path.substring("/requests/".length(), path.length() - "/sign".length());
        File requestJson = new File(new File(requestDir, safeName(requestId)), "request.json");
        String requestJsonText = null;
        if (database != null) {
            try {
                requestJsonText = database.findRequestJson(requestId);
            } catch (SQLException e) {
                writeError(resp, 500, "Database read failed: " + e.getMessage());
                return;
            }
        }
        if (requestJsonText == null && !requestJson.exists()) {
            writeError(resp, 404, "Request not found: " + requestId);
            return;
        }

        if (requestJsonText == null) {
            requestJsonText = new String(Files.readAllBytes(requestJson.toPath()), StandardCharsets.UTF_8);
        }
        SigningRequest signingRequest = GSON.fromJson(requestJsonText, SigningRequest.class);
        File templateJson = new File(new File(templateDir, safeName(signingRequest.templateCode)), "template.json");
        String templateJsonText = null;
        if (database != null) {
            try {
                templateJsonText = database.findTemplateJson(safeName(signingRequest.templateCode));
            } catch (SQLException e) {
                writeError(resp, 500, "Database read failed: " + e.getMessage());
                return;
            }
        }
        if (templateJsonText == null && !templateJson.exists()) {
            writeError(resp, 404, "Template not found for request: " + signingRequest.templateCode);
            return;
        }

        if (templateJsonText == null) {
            templateJsonText = new String(Files.readAllBytes(templateJson.toPath()), StandardCharsets.UTF_8);
        }
        ESignTemplate template = GSON.fromJson(templateJsonText, ESignTemplate.class);
        Part documentPart = req.getPart("documentPdf");
        File inputPdf;
        if (documentPart != null && documentPart.getSize() > 0) {
            inputPdf = new File(new File(requestDir, safeName(requestId)), "input.pdf");
            copyPart(documentPart, inputPdf);
        } else {
            inputPdf = new File(new File(templateDir, safeName(signingRequest.templateCode)), "sample.pdf");
        }

        if (!inputPdf.exists()) {
            writeError(resp, 400, "Missing documentPdf and template has no sample.pdf");
            return;
        }

        String roleName = valueOrDefault(req.getParameter("roleName"), "Signer");
        String signerName = valueOrDefault(req.getParameter("signerName"), roleName);
        File signedPdf = new File(new File(requestDir, safeName(requestId)), "signed-" + safeName(roleName) + ".pdf");

        PdfBoxSigningService.SigningResult signingResult = signingService.applyVisibleSignature(inputPdf, signedPdf, template, roleName, signerName);

        signingRequest.status = "SIGNED";
        signingRequest.signedAt = isoNow();
        signingRequest.signedPdfPath = signedPdf.getAbsolutePath();
        String updatedRequestJson = GSON.toJson(signingRequest);
        requestJson.getParentFile().mkdirs();
        Files.write(requestJson.toPath(), updatedRequestJson.getBytes(StandardCharsets.UTF_8));

        boolean updatedDatabase = false;
        if (database != null) {
            try {
                database.markRequestSigned(signingRequest, updatedRequestJson, roleName, signerName);
                updatedDatabase = true;
            } catch (SQLException e) {
                writeError(resp, 500, "PDF signed, but database update failed: " + e.getMessage());
                return;
            }
        }

        String accept = req.getHeader("Accept");
        if (accept != null && accept.contains("application/pdf")) {
            resp.setContentType("application/pdf");
            resp.setHeader("Content-Disposition", "attachment; filename=\"" + signedPdf.getName() + "\"");
            Files.copy(signedPdf.toPath(), resp.getOutputStream());
            return;
        }

        Map<String, Object> result = ok();
        result.put("requestId", requestId);
        result.put("status", signingRequest.status);
        result.put("signedPdfPath", signedPdf.getAbsolutePath());
        result.put("appliedFields", signingResult.appliedFields);
        result.put("updatedDatabase", updatedDatabase);
        result.put("note", "PDFBox visible signature stamp applied. Add certificate config for cryptographic signing.");
        writeJson(resp, 200, result);
    }

    private void databaseHealth(HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        try {
            Map<String, Object> result = ok();
            result.put("databaseUrl", database.databaseUrl());
            result.put("connected", database.ping());
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Database connection failed: " + e.getMessage());
        }
    }

    private void initDatabase(HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        try {
            database.ensureSchema();
            Map<String, Object> result = ok();
            result.put("databaseUrl", database.databaseUrl());
            result.put("message", "EIS-SIGN tables are ready");
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Database init failed: " + e.getMessage());
        }
    }

    private void listRoles(HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        try {
            List<SignerRole> roles = database.listRoles();
            Map<String, Object> result = ok();
            result.put("roles", roles);
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Role list failed: " + e.getMessage());
        }
    }

    private void listTemplates(HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        try {
            Map<String, Object> result = ok();
            result.put("templates", database.listTemplates());
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Template list failed: " + e.getMessage());
        }
    }

    private void deleteTemplate(String path, HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        String templateCode = safeName(path.substring("/templates/".length()));
        try {
            boolean deleted = database.deleteTemplate(templateCode);
            if (!deleted) {
                writeError(resp, 404, "Template not found: " + templateCode);
                return;
            }

            Map<String, Object> result = ok();
            result.put("templateCode", templateCode);
            result.put("deleted", true);
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Template delete failed: " + e.getMessage());
        }
    }

    private void saveRole(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (database == null) {
            writeError(resp, 500, "Database is not configured: " + databaseInitError);
            return;
        }

        SignerRole role = GSON.fromJson(reader(req), SignerRole.class);
        if (role == null || isBlank(role.name)) {
            writeError(resp, 400, "role.name is required");
            return;
        }
        if (isBlank(role.id)) {
            role.id = "role-" + safeName(role.name).toLowerCase();
        } else {
            role.id = safeName(role.id);
        }
        if (role.signingOrder < 1) {
            role.signingOrder = 1;
        }

        try {
            database.saveRole(role);
            Map<String, Object> result = ok();
            result.put("role", role);
            result.put("message", "Role saved to EIS_ERP");
            writeJson(resp, 200, result);
        } catch (SQLException e) {
            writeError(resp, 500, "Role save failed: " + e.getMessage());
        }
    }

    private Reader reader(HttpServletRequest req) throws IOException {
        return new InputStreamReader(req.getInputStream(), StandardCharsets.UTF_8);
    }

    private String normalizePath(HttpServletRequest req) {
        String path = req.getPathInfo();
        return path == null || path.trim().isEmpty() ? "/" : path;
    }

    private String readPartText(Part part) throws IOException {
        if (part == null) {
            return null;
        }
        byte[] bytes = readAll(part.getInputStream());
        return new String(bytes, StandardCharsets.UTF_8);
    }

    private byte[] readAll(InputStream in) throws IOException {
        try (InputStream source = in) {
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = source.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return out.toByteArray();
        }
    }

    private void copyPart(Part part, File target) throws IOException {
        target.getParentFile().mkdirs();
        try (InputStream in = part.getInputStream(); OutputStream out = new FileOutputStream(target)) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
        }
    }

    private String submittedFileName(Part part) {
        String header = part.getHeader("content-disposition");
        if (header == null) {
            return null;
        }
        for (String item : header.split(";")) {
            String trimmed = item.trim();
            if (trimmed.startsWith("filename=")) {
                return trimmed.substring(trimmed.indexOf('=') + 1).replace("\"", "");
            }
        }
        return null;
    }

    private String safeName(String value) {
        if (value == null) {
            return "unknown";
        }
        String safe = value.replaceAll("[^A-Za-z0-9._-]+", "-");
        return safe.isEmpty() ? "unknown" : safe;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String valueOrDefault(String value, String fallback) {
        return isBlank(value) ? fallback : value.trim();
    }

    private String isoNow() {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").format(new Date());
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
        resp.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
    }
}
