package com.eis.esign;

import java.util.List;

public class ESignTemplate {
    public SignGroup signGroup;
    public SamplePdf samplePdf;
    public List<SignerRole> roles;
    public List<SignatureField> signatureFields;
    public WorkflowMapping workflow;
}
