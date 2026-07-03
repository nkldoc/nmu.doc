CREATE TABLE esign_role (
    role_id NVARCHAR(100) NOT NULL PRIMARY KEY,
    role_name NVARCHAR(120) NOT NULL,
    default_email NVARCHAR(255) NULL,
    signing_order INT NOT NULL DEFAULT 1,
    active_flag BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE esign_template (
    template_code NVARCHAR(80) NOT NULL PRIMARY KEY,
    sign_group_name NVARCHAR(200) NOT NULL,
    sample_pdf_name NVARCHAR(255) NULL,
    page_count INT NOT NULL DEFAULT 1,
    workflow_process NVARCHAR(120) NULL,
    legacy_callback_url NVARCHAR(500) NULL,
    template_json NVARCHAR(MAX) NOT NULL,
    active_flag BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE esign_template_role (
    role_id NVARCHAR(100) NOT NULL,
    template_code NVARCHAR(80) NOT NULL,
    role_name NVARCHAR(120) NOT NULL,
    default_email NVARCHAR(255) NULL,
    signing_order INT NOT NULL,
    CONSTRAINT pk_esign_template_role PRIMARY KEY (template_code, role_id),
    CONSTRAINT fk_esign_template_role_template FOREIGN KEY (template_code)
        REFERENCES esign_template(template_code)
);

CREATE TABLE esign_signature_field (
    field_id NVARCHAR(100) NOT NULL,
    template_code NVARCHAR(80) NOT NULL,
    role_id NVARCHAR(100) NOT NULL,
    role_name NVARCHAR(120) NOT NULL,
    page_no INT NOT NULL,
    x_ratio DECIMAL(10, 6) NOT NULL,
    y_ratio DECIMAL(10, 6) NOT NULL,
    width_ratio DECIMAL(10, 6) NOT NULL,
    height_ratio DECIMAL(10, 6) NOT NULL,
    pdfbox_anchor NVARCHAR(40) NOT NULL DEFAULT 'top-left',
    CONSTRAINT pk_esign_signature_field PRIMARY KEY (template_code, field_id),
    CONSTRAINT fk_esign_signature_field_template FOREIGN KEY (template_code)
        REFERENCES esign_template(template_code)
);

CREATE TABLE esign_request (
    request_id NVARCHAR(80) NOT NULL PRIMARY KEY,
    template_code NVARCHAR(80) NOT NULL,
    document_no NVARCHAR(100) NULL,
    created_by NVARCHAR(100) NULL,
    status NVARCHAR(40) NOT NULL,
    legacy_payload NVARCHAR(MAX) NULL,
    request_json NVARCHAR(MAX) NOT NULL,
    signed_pdf_path NVARCHAR(1000) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    signed_at DATETIME2 NULL,
    CONSTRAINT fk_esign_request_template FOREIGN KEY (template_code)
        REFERENCES esign_template(template_code)
);

CREATE TABLE esign_audit (
    audit_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    request_id NVARCHAR(80) NOT NULL,
    action_name NVARCHAR(80) NOT NULL,
    actor_name NVARCHAR(200) NULL,
    role_name NVARCHAR(120) NULL,
    message NVARCHAR(1000) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_esign_audit_request FOREIGN KEY (request_id)
        REFERENCES esign_request(request_id)
);
