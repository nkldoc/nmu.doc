package com.eis.esign;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ESignDatabase {
    private final DatabaseConfig config;

    public ESignDatabase(DatabaseConfig config) {
        this.config = config;
    }

    public String databaseUrl() {
        return config.safeUrl();
    }

    public boolean ping() throws SQLException {
        try (Connection connection = config.openConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT 1")) {
            return resultSet.next();
        }
    }

    public void ensureSchema() throws SQLException {
        try (Connection connection = config.openConnection();
             Statement statement = connection.createStatement()) {
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_role', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_role (" +
                    "role_id NVARCHAR(100) NOT NULL PRIMARY KEY, " +
                    "role_name NVARCHAR(120) NOT NULL, " +
                    "default_email NVARCHAR(255) NULL, " +
                    "signing_order INT NOT NULL DEFAULT 1, " +
                    "active_flag BIT NOT NULL DEFAULT 1, " +
                    "created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(), " +
                    "updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME())"
            );
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_template', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_template (" +
                    "template_code NVARCHAR(80) NOT NULL PRIMARY KEY, " +
                    "sign_group_name NVARCHAR(200) NOT NULL, " +
                    "sample_pdf_name NVARCHAR(255) NULL, " +
                    "page_count INT NOT NULL DEFAULT 1, " +
                    "workflow_process NVARCHAR(120) NULL, " +
                    "legacy_callback_url NVARCHAR(500) NULL, " +
                    "template_json NVARCHAR(MAX) NOT NULL, " +
                    "active_flag BIT NOT NULL DEFAULT 1, " +
                    "created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(), " +
                    "updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME())"
            );
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_template_role', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_template_role (" +
                    "role_id NVARCHAR(100) NOT NULL, " +
                    "template_code NVARCHAR(80) NOT NULL, " +
                    "role_name NVARCHAR(120) NOT NULL, " +
                    "default_email NVARCHAR(255) NULL, " +
                    "signing_order INT NOT NULL, " +
                    "CONSTRAINT pk_esign_template_role PRIMARY KEY (template_code, role_id))"
            );
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_signature_field', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_signature_field (" +
                    "field_id NVARCHAR(100) NOT NULL, " +
                    "template_code NVARCHAR(80) NOT NULL, " +
                    "role_id NVARCHAR(100) NOT NULL, " +
                    "role_name NVARCHAR(120) NOT NULL, " +
                    "page_no INT NOT NULL, " +
                    "x_ratio DECIMAL(10, 6) NOT NULL, " +
                    "y_ratio DECIMAL(10, 6) NOT NULL, " +
                    "width_ratio DECIMAL(10, 6) NOT NULL, " +
                    "height_ratio DECIMAL(10, 6) NOT NULL, " +
                    "pdfbox_anchor NVARCHAR(40) NOT NULL DEFAULT 'top-left', " +
                    "CONSTRAINT pk_esign_signature_field PRIMARY KEY (template_code, field_id))"
            );
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_request', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_request (" +
                    "request_id NVARCHAR(80) NOT NULL PRIMARY KEY, " +
                    "template_code NVARCHAR(80) NOT NULL, " +
                    "document_no NVARCHAR(100) NULL, " +
                    "created_by NVARCHAR(100) NULL, " +
                    "status NVARCHAR(40) NOT NULL, " +
                    "legacy_payload NVARCHAR(MAX) NULL, " +
                    "request_json NVARCHAR(MAX) NOT NULL, " +
                    "signed_pdf_path NVARCHAR(1000) NULL, " +
                    "created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(), " +
                    "signed_at DATETIME2 NULL)"
            );
            statement.executeUpdate(
                    "IF OBJECT_ID('dbo.esign_audit', 'U') IS NULL " +
                    "CREATE TABLE dbo.esign_audit (" +
                    "audit_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY, " +
                    "request_id NVARCHAR(80) NULL, " +
                    "action_name NVARCHAR(80) NOT NULL, " +
                    "actor_name NVARCHAR(200) NULL, " +
                    "role_name NVARCHAR(120) NULL, " +
                    "message NVARCHAR(1000) NULL, " +
                    "created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME())"
            );
            statement.executeUpdate(
                    "IF COL_LENGTH('dbo.esign_audit', 'request_id') IS NOT NULL " +
                    "AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.esign_audit') AND name = 'request_id' AND is_nullable = 0) " +
                    "ALTER TABLE dbo.esign_audit ALTER COLUMN request_id NVARCHAR(80) NULL"
            );
            statement.executeUpdate(
                    "IF COL_LENGTH('dbo.esign_request', 'request_json') IS NULL " +
                    "ALTER TABLE dbo.esign_request ADD request_json NVARCHAR(MAX) NULL"
            );
            statement.executeUpdate(
                    "IF COL_LENGTH('dbo.esign_request', 'request_json') IS NOT NULL " +
                    "UPDATE dbo.esign_request SET request_json = '{}' WHERE request_json IS NULL"
            );
        }
    }

    public void saveRole(SignerRole role) throws SQLException {
        String sql =
                "MERGE dbo.esign_role AS target " +
                "USING (SELECT ? AS role_id) AS source " +
                "ON target.role_id = source.role_id " +
                "WHEN MATCHED THEN UPDATE SET role_name=?, default_email=?, signing_order=?, active_flag=?, updated_at=SYSDATETIME() " +
                "WHEN NOT MATCHED THEN INSERT (role_id, role_name, default_email, signing_order, active_flag) VALUES (?, ?, ?, ?, ?);";
        try (Connection connection = config.openConnection()) {
            connection.setAutoCommit(false);
            try {
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    ps.setString(1, role.id);
                    ps.setString(2, role.name);
                    ps.setString(3, role.defaultEmail);
                    ps.setInt(4, role.signingOrder < 1 ? 1 : role.signingOrder);
                    ps.setBoolean(5, role.active);
                    ps.setString(6, role.id);
                    ps.setString(7, role.name);
                    ps.setString(8, role.defaultEmail);
                    ps.setInt(9, role.signingOrder < 1 ? 1 : role.signingOrder);
                    ps.setBoolean(10, role.active);
                    ps.executeUpdate();
                }
                insertAudit(connection, null, "SAVE_ROLE", null, role.name, "Role " + role.id + " saved");
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        }
    }

    public List<SignerRole> listRoles() throws SQLException {
        List<SignerRole> roles = new ArrayList<>();
        String sql = "SELECT role_id, role_name, default_email, signing_order, active_flag FROM dbo.esign_role ORDER BY signing_order, role_name";
        try (Connection connection = config.openConnection();
             PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                SignerRole role = new SignerRole();
                role.id = rs.getString("role_id");
                role.name = rs.getString("role_name");
                role.defaultEmail = rs.getString("default_email");
                role.signingOrder = rs.getInt("signing_order");
                role.active = rs.getBoolean("active_flag");
                roles.add(role);
            }
        }
        return roles;
    }

    public void saveTemplate(ESignTemplate template, String templateJson) throws SQLException {
        String templateCode = template.signGroup.templateCode;
        String sql =
                "MERGE dbo.esign_template AS target " +
                "USING (SELECT ? AS template_code) AS source " +
                "ON target.template_code = source.template_code " +
                "WHEN MATCHED THEN UPDATE SET sign_group_name=?, sample_pdf_name=?, page_count=?, workflow_process=?, legacy_callback_url=?, template_json=?, updated_at=SYSDATETIME() " +
                "WHEN NOT MATCHED THEN INSERT (template_code, sign_group_name, sample_pdf_name, page_count, workflow_process, legacy_callback_url, template_json) VALUES (?, ?, ?, ?, ?, ?, ?);";

        try (Connection connection = config.openConnection()) {
            connection.setAutoCommit(false);
            try {
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    bindTemplate(ps, template, templateJson);
                    ps.executeUpdate();
                }

                deleteTemplateChildren(connection, templateCode);
                insertRoles(connection, template);
                insertFields(connection, template);
                insertAudit(connection, null, "SAVE_TEMPLATE", null, null, "Template " + templateCode + " saved");
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        }
    }

    public String findTemplateJson(String templateCode) throws SQLException {
        try (Connection connection = config.openConnection();
             PreparedStatement ps = connection.prepareStatement("SELECT template_json FROM dbo.esign_template WHERE template_code=? AND active_flag=1")) {
            ps.setString(1, templateCode);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString(1) : null;
            }
        }
    }

    public void saveRequest(SigningRequest request, String requestJson) throws SQLException {
        String sql =
                "INSERT INTO dbo.esign_request (request_id, template_code, document_no, created_by, status, legacy_payload, request_json) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection connection = config.openConnection()) {
            connection.setAutoCommit(false);
            try {
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    ps.setString(1, request.requestId);
                    ps.setString(2, request.templateCode);
                    ps.setString(3, request.documentNo);
                    ps.setString(4, request.createdBy);
                    ps.setString(5, request.status);
                    ps.setString(6, request.legacyPayload == null ? null : String.valueOf(request.legacyPayload));
                    ps.setString(7, requestJson);
                    ps.executeUpdate();
                }
                insertAudit(connection, request.requestId, "CREATE_REQUEST", request.createdBy, null, "Signing request created");
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        }
    }

    public String findRequestJson(String requestId) throws SQLException {
        try (Connection connection = config.openConnection();
             PreparedStatement ps = connection.prepareStatement("SELECT request_json FROM dbo.esign_request WHERE request_id=?")) {
            ps.setString(1, requestId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString(1) : null;
            }
        }
    }

    public void markRequestSigned(SigningRequest request, String requestJson, String roleName, String signerName) throws SQLException {
        String sql =
                "UPDATE dbo.esign_request SET status=?, signed_pdf_path=?, signed_at=SYSDATETIME(), request_json=? WHERE request_id=?";
        try (Connection connection = config.openConnection()) {
            connection.setAutoCommit(false);
            try {
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    ps.setString(1, request.status);
                    ps.setString(2, request.signedPdfPath);
                    ps.setString(3, requestJson);
                    ps.setString(4, request.requestId);
                    ps.executeUpdate();
                }
                insertAudit(connection, request.requestId, "SIGN", signerName, roleName, "PDF signed by " + signerName);
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        }
    }

    private void bindTemplate(PreparedStatement ps, ESignTemplate template, String templateJson) throws SQLException {
        String templateCode = template.signGroup.templateCode;
        String groupName = template.signGroup.name;
        String sampleName = template.samplePdf == null ? null : template.samplePdf.fileName;
        int pageCount = template.samplePdf == null || template.samplePdf.pageCount < 1 ? 1 : template.samplePdf.pageCount;
        String process = template.workflow == null ? null : template.workflow.engineProcess;
        String callback = template.workflow == null ? null : template.workflow.legacyCallbackUrl;

        ps.setString(1, templateCode);
        ps.setString(2, groupName);
        ps.setString(3, sampleName);
        ps.setInt(4, pageCount);
        ps.setString(5, process);
        ps.setString(6, callback);
        ps.setString(7, templateJson);
        ps.setString(8, templateCode);
        ps.setString(9, groupName);
        ps.setString(10, sampleName);
        ps.setInt(11, pageCount);
        ps.setString(12, process);
        ps.setString(13, callback);
        ps.setString(14, templateJson);
    }

    private void deleteTemplateChildren(Connection connection, String templateCode) throws SQLException {
        try (PreparedStatement ps = connection.prepareStatement("DELETE FROM dbo.esign_signature_field WHERE template_code=?")) {
            ps.setString(1, templateCode);
            ps.executeUpdate();
        }
        try (PreparedStatement ps = connection.prepareStatement("DELETE FROM dbo.esign_template_role WHERE template_code=?")) {
            ps.setString(1, templateCode);
            ps.executeUpdate();
        }
    }

    private void insertRoles(Connection connection, ESignTemplate template) throws SQLException {
        if (template.roles == null) return;
        String sql = "INSERT INTO dbo.esign_template_role (role_id, template_code, role_name, default_email, signing_order) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            for (SignerRole role : template.roles) {
                ps.setString(1, role.id);
                ps.setString(2, template.signGroup.templateCode);
                ps.setString(3, role.name);
                ps.setString(4, role.defaultEmail);
                ps.setInt(5, role.signingOrder);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    private void insertFields(Connection connection, ESignTemplate template) throws SQLException {
        if (template.signatureFields == null) return;
        String sql = "INSERT INTO dbo.esign_signature_field (field_id, template_code, role_id, role_name, page_no, x_ratio, y_ratio, width_ratio, height_ratio, pdfbox_anchor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            for (SignatureField field : template.signatureFields) {
                ps.setString(1, field.id);
                ps.setString(2, template.signGroup.templateCode);
                ps.setString(3, field.roleId);
                ps.setString(4, field.roleName);
                ps.setInt(5, field.page);
                ps.setDouble(6, field.xRatio);
                ps.setDouble(7, field.yRatio);
                ps.setDouble(8, field.widthRatio);
                ps.setDouble(9, field.heightRatio);
                ps.setString(10, field.pdfBoxAnchor == null ? "top-left" : field.pdfBoxAnchor);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    private void insertAudit(Connection connection, String requestId, String action, String actor, String role, String message) throws SQLException {
        String sql = "INSERT INTO dbo.esign_audit (request_id, action_name, actor_name, role_name, message) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, requestId);
            ps.setString(2, action);
            ps.setString(3, actor);
            ps.setString(4, role);
            ps.setString(5, message);
            ps.executeUpdate();
        }
    }
}
