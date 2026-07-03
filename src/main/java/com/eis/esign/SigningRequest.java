package com.eis.esign;

import java.util.Map;

public class SigningRequest {
    public String requestId;
    public String templateCode;
    public String documentNo;
    public String createdBy;
    public String status;
    public String createdAt;
    public String signedAt;
    public String signedPdfPath;
    public Map<String, String> signerEmails;
    public Map<String, Object> legacyPayload;
}
