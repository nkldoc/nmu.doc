package com.eis.esign;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;

import java.awt.Color;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PdfBoxSigningService {
    public SigningResult applyVisibleSignature(File inputPdf, File outputPdf, ESignTemplate template, String roleName, String signerName) throws IOException {
        SigningResult result = new SigningResult();

        try (PDDocument document = PDDocument.load(inputPdf)) {
            if (template.signatureFields == null) {
                template.signatureFields = new ArrayList<>();
            }

            for (SignatureField field : template.signatureFields) {
                if (!roleMatches(field, roleName)) {
                    continue;
                }
                if (field.page < 1 || field.page > document.getNumberOfPages()) {
                    continue;
                }

                PDPage page = document.getPage(field.page - 1);
                drawVisibleSignature(document, page, field, roleName, signerName);
                result.appliedFields++;
            }

            outputPdf.getParentFile().mkdirs();
            document.save(outputPdf);
        }

        return result;
    }

    private boolean roleMatches(SignatureField field, String roleName) {
        if (roleName == null) return true;
        return roleName.equalsIgnoreCase(field.roleName) || roleName.equalsIgnoreCase(field.roleId);
    }

    private void drawVisibleSignature(PDDocument document, PDPage page, SignatureField field, String roleName, String signerName) throws IOException {
        PDRectangle mediaBox = page.getMediaBox();
        float pageWidth = mediaBox.getWidth();
        float pageHeight = mediaBox.getHeight();

        float x = (float) field.xRatio * pageWidth;
        float width = Math.max(80f, (float) field.widthRatio * pageWidth);
        float height = Math.max(36f, (float) field.heightRatio * pageHeight);
        float topY = (float) field.yRatio * pageHeight;
        float y = pageHeight - topY - height;

        try (PDPageContentStream content = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
            PDExtendedGraphicsState graphicsState = new PDExtendedGraphicsState();
            graphicsState.setNonStrokingAlphaConstant(0.14f);
            content.setGraphicsStateParameters(graphicsState);
            content.setNonStrokingColor(new Color(37, 99, 235));
            content.addRect(x, y, width, height);
            content.fill();

            graphicsState.setNonStrokingAlphaConstant(1f);
            content.setGraphicsStateParameters(graphicsState);
            content.setStrokingColor(new Color(37, 99, 235));
            content.setLineWidth(1.5f);
            content.addRect(x, y, width, height);
            content.stroke();

            content.beginText();
            content.setNonStrokingColor(new Color(31, 41, 55));
            content.setFont(PDType1Font.HELVETICA_BOLD, 10);
            content.newLineAtOffset(x + 8, y + height - 15);
            content.showText("Signed: " + safeText(signerName));
            content.endText();

            content.beginText();
            content.setNonStrokingColor(new Color(75, 85, 99));
            content.setFont(PDType1Font.HELVETICA, 8);
            content.newLineAtOffset(x + 8, y + height - 28);
            content.showText("Role: " + safeText(roleName));
            content.endText();

            content.beginText();
            content.setNonStrokingColor(new Color(75, 85, 99));
            content.setFont(PDType1Font.HELVETICA, 8);
            content.newLineAtOffset(x + 8, y + 8);
            content.showText("PDFBox visible signature - " + new Date());
            content.endText();
        }
    }

    private String safeText(String value) {
        if (value == null) return "";
        return value.replaceAll("[\\r\\n\\t]+", " ").replaceAll("[^\\x20-\\x7E]", "?");
    }

    public static class SigningResult {
        public int appliedFields;
        public List<String> warnings = new ArrayList<>();
    }
}
