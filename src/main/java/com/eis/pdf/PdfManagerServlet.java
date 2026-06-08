package com.eis.pdf;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.*;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.*;

@WebServlet(urlPatterns = {"/pdf/*"})
@MultipartConfig
public class PdfManagerServlet extends HttpServlet {

    // ตรวจสอบให้แน่ใจว่าพาธลงท้ายด้วยสแลช (/) เพื่อป้องกันชื่อไฟล์เพี้ยน
    private static final String UPLOAD_DIR = "D:/Documents/Sys/2025/procure/supplies/uploads/"; 
    private static final String TEMPLATE_NAME = "currentTemplate.pdf";

    @Override
    public void init() throws ServletException {
        new File(UPLOAD_DIR).mkdirs();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String path = req.getPathInfo();
        if (path == null) path = "";
        switch (path) {
            case "/bookmarks": handleListBookmarks(resp); break;
            case "/serverFiles": handleServerFiles(resp); break;
            case "/template": handleServeTemplate(resp); break;
            default: resp.sendError(404, "Not Found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        String path = req.getPathInfo();
        if (path == null) path = "";
        switch (path) {
            case "/uploadTemplate": handleUploadTemplate(req, resp); break;
            case "/edit":           handleEdit(req, resp); break;
            case "/deletePages":    deletePages(req, resp); break;
            default: resp.sendError(404, "Not Found");
        }
    }

    // ---------- Serve current template ----------
    private void handleServeTemplate(HttpServletResponse resp) throws IOException {
        File f = new File(UPLOAD_DIR + TEMPLATE_NAME);
        if (!f.exists()) { resp.sendError(404, "ยังไม่มี template"); return; }
        resp.setContentType("application/pdf");
        resp.setHeader("Cache-Control", "no-store");
        try (OutputStream os = resp.getOutputStream(); InputStream is = new FileInputStream(f)) {
            byte[] buf = new byte[8192]; int r;
            while ((r = is.read(buf)) != -1) os.write(buf, 0, r);
        }
    }

    // ---------- Delete pages from template ----------
    private void deletePages(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pagesParam = req.getParameter("pages"); // รับค่า เช่น "1,2,5"
        if (pagesParam == null || pagesParam.trim().isEmpty()) {
            writeJsonError(resp, 400, "ไม่ได้ระบุหน้าที่จะลบ");
            return;
        }

        // แปลงอินพุตจาก 1-based (หน้า 1) เป็น 0-based (ดัชนี 0)
        Set<Integer> toDelete = new HashSet<>();
        try {
            for (String s : pagesParam.split(",")) {
                int page = Integer.parseInt(s.trim());
                if (page > 0) {
                    toDelete.add(page - 1);
                }
            }
        } catch (NumberFormatException e) {
            writeJsonError(resp, 400, "รูปแบบหมายเลขหน้าไม่ถูกต้อง");
            return;
        }

        File f = new File(UPLOAD_DIR + TEMPLATE_NAME);
        if (!f.exists()) {
            writeJsonError(resp, 404, "ยังไม่มี template ในระบบ");
            return;
        }

        // โหลดและดำเนินการลบหน้าในหน่วยความจำ
        byte[] updatedPdfBytes;
        int remainingPages;
        try (PDDocument doc = PDDocument.load(f)) {
            int totalPages = doc.getNumberOfPages();

            // ตรวจสอบความถูกต้องของช่วงหน้า
            for (int idx : toDelete) {
                if (idx < 0 || idx >= totalPages) {
                    writeJsonError(resp, 400, "หน้าที่ " + (idx + 1) + " ไม่มีอยู่จริงในเอกสาร (มีทั้งหมด " + totalPages + " หน้า)");
                    return;
                }
            }

            if (totalPages - toDelete.size() < 1) {
                writeJsonError(resp, 400, "ไม่สามารถลบหน้าทั้งหมดออกได้ เอกสารต้องมีอย่างน้อย 1 หน้า");
                return;
            }

            // เรียงลำดับจากหน้าท้ายสุดมาข้างหน้า เพื่อป้องกันปัญหาตำแหน่งดัชนีขยับขณะลบ
            List<Integer> sortedDesc = toDelete.stream()
                    .sorted(Comparator.reverseOrder())
                    .collect(Collectors.toList());

            for (int idx : sortedDesc) {
                doc.removePage(idx);
                // ขยับบุ๊กมาร์กสำหรับหน้าหลังจากจุดที่โดนลบ
                updateBookmarksAfterDelete(doc, idx);
            }

            remainingPages = doc.getNumberOfPages();

            // บันทึกลง Byte Array ก่อนเขียนทับดิสก์
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                doc.save(baos);
                updatedPdfBytes = baos.toByteArray();
            }

        } catch (Exception e) {
            writeJsonError(resp, 500, "เกิดข้อผิดพลาดในการประมวลผล PDF: " + e.getMessage());
            return;
        }

        // เขียนไฟล์ที่แก้ไขแล้วทับลงตำแหน่งเดิมอย่างปลอดภัย
        try (FileOutputStream fos = new FileOutputStream(f)) {
            fos.write(updatedPdfBytes);
        } catch (IOException e) {
            writeJsonError(resp, 500, "เกิดข้อผิดพลาดในการบันทึกไฟล์ทับ: " + e.getMessage());
            return;
        }

        // ตอบกลับ JSON พร้อมข้อมูลครบถ้วน
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "ลบหน้า " + pagesParam + " สำเร็จ");
        result.put("deletedPages", pagesParam);
        result.put("deletedCount", toDelete.size());
        result.put("remainingPages", remainingPages);
        writeJson(resp, 200, result);
    }

    // ---------- ฟังก์ชันจัดการ Bookmark หลังลบหน้า ----------
    private void updateBookmarksAfterDelete(PDDocument doc, int deletedIndex) throws IOException {
        PDDocumentOutline outline = doc.getDocumentCatalog().getDocumentOutline();
        if (outline == null) return;

        traverseAndAdjust(outline, item -> {
            PDPageDestination dest = resolveDestination(item);
            if (dest == null) return;

            // หากบุ๊กมาร์กอ้างอิงเป็น Object หน้าตรง ๆ (ไม่ระบุเป็นเลขหน้า) ข้ามไปได้เพราะระบบจัดการอ้างอิงให้แล้ว
            if (dest.getPage() != null) return; 

            int pn = dest.getPageNumber();
            if (pn < 0) return;

            if (pn == deletedIndex) {
                // หากหน้าปลายทางถูกลบ ให้ชี้ไปที่หน้าก่อนหน้า หรือหน้าแรกสุดแทน
                dest.setPageNumber(Math.max(0, deletedIndex - 1));
                item.setDestination(dest);
            } else if (pn > deletedIndex) {
                // ขยับหมายเลขหน้าลดลง 1 ตำแหน่งสำหรับหน้าที่มีดัชนีอยู่หลังจุดที่ลบ
                dest.setPageNumber(pn - 1);
                item.setDestination(dest);
            }
        });
    }

    // ---------- Upload template ----------
    private void handleUploadTemplate(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        Part filePart = req.getPart("templatePdf");
        if (filePart == null || filePart.getSize() == 0) { resp.sendError(400, "ไม่พบไฟล์ templatePdf"); return; }
        File dest = new File(UPLOAD_DIR + TEMPLATE_NAME);
        try (InputStream in = filePart.getInputStream(); OutputStream out = new FileOutputStream(dest)) {
            byte[] buf = new byte[8192]; int r;
            while ((r = in.read(buf)) != -1) out.write(buf, 0, r);
        }
        resp.setContentType("text/plain; charset=UTF-8");
        resp.getWriter().write("OK");
    }

    // ---------- List bookmarks ----------
    private void handleListBookmarks(HttpServletResponse resp) throws IOException {
        File f = new File(UPLOAD_DIR + TEMPLATE_NAME);
        List<Map<String,Object>> results = new ArrayList<>();
        if (f.exists()) {
            try (PDDocument doc = PDDocument.load(f)) {
                PDDocumentOutline outline = doc.getDocumentCatalog().getDocumentOutline();
                if (outline != null) iterateBookmarks(doc, outline, results, 0);
            } catch (Exception ignored) {}
        }
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(toJson(results));
    }

    private void iterateBookmarks(PDDocument doc, PDOutlineNode node,
                                  List<Map<String,Object>> results, int level) throws IOException {
        PDOutlineItem item = node.getFirstChild();
        while (item != null) {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("title", item.getTitle());
            m.put("level", level);
            int pageIndex = resolvePageIndex(doc, item.getDestination());
            if (pageIndex < 0 && item.getAction() != null) {
                PDPageDestination d = resolveActionDestination(item.getAction());
                pageIndex = resolvePageIndex(doc, d);
            }
            m.put("pageIndex", pageIndex);
            results.add(m);

            if (item.hasChildren()) iterateBookmarks(doc, item, results, level + 1);
            item = item.getNextSibling();
        }
    }

    private int resolvePageIndex(PDDocument doc, PDDestination dest) throws IOException {
        if (dest instanceof PDPageDestination) {
            PDPageDestination d = (PDPageDestination) dest;
            PDPage page = d.getPage();
            if (page != null) return doc.getPages().indexOf(page);
            int pn = d.getPageNumber();
            if (pn >= 0) return pn;
        }
        return -1;
    }

    private PDPageDestination resolveActionDestination(org.apache.pdfbox.pdmodel.interactive.action.PDAction action) throws IOException {
        if (action instanceof org.apache.pdfbox.pdmodel.interactive.action.PDActionGoTo) {
            PDDestination d = ((org.apache.pdfbox.pdmodel.interactive.action.PDActionGoTo) action).getDestination();
            if (d instanceof PDPageDestination) return (PDPageDestination) d;
        }
        return null;
    }

    // ---------- List server files ----------
    private void handleServerFiles(HttpServletResponse resp) throws IOException {
        File dir = new File(UPLOAD_DIR);
        String[] list = dir.list((d, name) ->
                name.toLowerCase().endsWith(".pdf") && !name.equals(TEMPLATE_NAME));
        List<String> files = list == null ? Collections.emptyList()
                                          : Arrays.stream(list).sorted().collect(Collectors.toList());
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(toJson(files));
    }

    // ---------- Edit (insert / replace one / replace range) ----------
    private void handleEdit(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        String actionType = req.getParameter("actionType");
        int pageNumber;
        try { pageNumber = Integer.parseInt(req.getParameter("pageNumber")); }
        catch (Exception e) { writeJsonError(resp, 400, "pageNumber ไม่ถูกต้อง"); return; }

        int replaceCount = 1;
        if ("replaceRange".equals(actionType)) {
            try { replaceCount = Math.max(1, Integer.parseInt(req.getParameter("replaceCount"))); }
            catch (Exception ignore) { replaceCount = 1; }
        }

        if (!( "insert".equals(actionType) || "replace".equals(actionType) || "replaceRange".equals(actionType) )) {
            writeJsonError(resp, 400, "actionType ต้องเป็น insert/replace/replaceRange"); return;
        }

        File templateFile = new File(UPLOAD_DIR + TEMPLATE_NAME);
        if (!templateFile.exists()) { writeJsonError(resp, 400, "ยังไม่มี template"); return; }

        Part newPdfPart = null;
        try { newPdfPart = req.getPart("newPdf"); } catch (IllegalStateException ignore) {}
        String serverFile = req.getParameter("serverFile");
        File newPdfFile = resolveNewPdfFile(newPdfPart, serverFile);
        if (newPdfFile == null || !newPdfFile.exists()) {
            writeJsonError(resp, 400, "ไม่พบไฟล์สำหรับแทรก/แทนที่"); return;
        }

        try (PDDocument templateDoc = PDDocument.load(templateFile);
             PDDocument sourceDoc = PDDocument.load(newPdfFile)) {

            PDPageTree pages = templateDoc.getPages();
            int pageCount = pages.getCount();

            if ("insert".equals(actionType)) {
                if (pageNumber < 1 || pageNumber > pageCount + 1) {
                    writeJsonError(resp, 400, "หมายเลขหน้าต้องอยู่ในช่วง 1.." + (pageCount + 1)); return;
                }
                int targetIndex = pageNumber - 1;
                int insertedCount = sourceDoc.getNumberOfPages();
                PDPage firstInserted = insertPages(templateDoc, sourceDoc, targetIndex);
                updateBookmarksAfterInsert(templateDoc, targetIndex, insertedCount);

            } else if ("replace".equals(actionType)) {
                if (pageNumber < 1 || pageNumber > pageCount) {
                    writeJsonError(resp, 400, "หมายเลขหน้าต้องอยู่ในช่วง 1.." + pageCount); return;
                }
                int targetIndex = pageNumber - 1;
                int insertedCount = sourceDoc.getNumberOfPages();

                PDPage[] removedHolder = new PDPage[1];
                PDPage firstInserted = replaceOnePage(templateDoc, sourceDoc, targetIndex, removedHolder);
                PDPage removedPage = removedHolder[0];

                updateBookmarksAfterReplaceOne(templateDoc, targetIndex, removedPage, firstInserted, insertedCount);

            } else { // replaceRange
                if (pageNumber < 1 || pageNumber > pageCount) {
                    writeJsonError(resp, 400, "หมายเลขหน้าเริ่มต้นต้องอยู่ในช่วง 1.." + pageCount); return;
                }
                if (replaceCount < 1 || pageNumber - 1 + replaceCount > pageCount) {
                    writeJsonError(resp, 400, "ช่วงหน้าที่จะแทนที่เกินขอบเขตเอกสาร"); return;
                }
                int startIndex = pageNumber - 1;
                int insertedCount = sourceDoc.getNumberOfPages();

                ReplaceRangeResult res = replaceRange(templateDoc, sourceDoc, startIndex, replaceCount);
                updateBookmarksAfterReplaceRange(templateDoc, startIndex, replaceCount, res.firstInserted, insertedCount);
            }

            templateDoc.save(templateFile);
        } catch (Exception e) {
            e.printStackTrace();
            writeJsonError(resp, 500, "ผิดพลาด: " + e.getMessage()); return;
        }

        writeJson(resp, 200, Collections.singletonMap("message", "อัปเดตสำเร็จ"));
    }

    // ---------- Insert / Replace helpers ----------

    private PDPage insertPages(PDDocument target, PDDocument source, int targetIndex) throws IOException {
        PDPageTree pages = target.getPages();
        int pageCount = pages.getCount();
        PDPage firstInserted = null;

        if (targetIndex >= pageCount) {
            for (int i = 0; i < source.getNumberOfPages(); i++) {
                PDPage imported = target.importPage(source.getPage(i));
                if (firstInserted == null) firstInserted = imported;
            }
            return firstInserted;
        }

        PDPage ref = pages.get(targetIndex);
        for (int i = 0; i < source.getNumberOfPages(); i++) {
            PDPage imported = target.importPage(source.getPage(i));
            pages.insertBefore(imported, ref);
            if (firstInserted == null) firstInserted = imported;
        }
        return firstInserted;
    }

    private PDPage replaceOnePage(PDDocument target, PDDocument source, int targetIndex, PDPage[] removedOut) throws IOException {
        PDPageTree pages = target.getPages();
        PDPage ref = pages.get(targetIndex);
        removedOut[0] = ref;
        PDPage firstInserted = null;
        for (int i = 0; i < source.getNumberOfPages(); i++) {
            PDPage imported = target.importPage(source.getPage(i));
            pages.insertBefore(imported, ref);
            if (firstInserted == null) firstInserted = imported;
        }
        pages.remove(ref);
        return firstInserted;
    }

    private static class ReplaceRangeResult { PDPage firstInserted; List<PDPage> removedPages; }
    private ReplaceRangeResult replaceRange(PDDocument target, PDDocument source, int startIndex, int replaceCount) throws IOException {
        ReplaceRangeResult res = new ReplaceRangeResult();
        res.removedPages = new ArrayList<>();

        PDPageTree pages = target.getPages();
        for (int i = 0; i < replaceCount; i++) {
            res.removedPages.add(pages.get(startIndex + i));
        }

        PDPage ref = pages.get(startIndex);
        for (int i = 0; i < source.getNumberOfPages(); i++) {
            PDPage imported = target.importPage(source.getPage(i));
            pages.insertBefore(imported, ref);
            if (res.firstInserted == null) res.firstInserted = imported;
        }

        for (PDPage p : res.removedPages) pages.remove(p);
        return res;
    }

    // ---------- Bookmark updates (Insert/Replace) ----------

    private void updateBookmarksAfterInsert(PDDocument doc, int targetIndex, int insertedCount) throws IOException {
        PDDocumentOutline outline = doc.getDocumentCatalog().getDocumentOutline();
        if (outline == null || insertedCount == 0) return;
        traverseAndAdjust(outline, item -> {
            PDPageDestination dest = resolveDestination(item);
            if (dest == null) return;
            if (dest.getPage() != null) return;
            int pn = dest.getPageNumber();
            if (pn >= 0 && pn >= targetIndex) {
                dest.setPageNumber(pn + insertedCount);
                item.setDestination(dest);
            }
        });
    }

    private void updateBookmarksAfterReplaceOne(PDDocument doc, int targetIndex, PDPage removedPage, PDPage firstInserted, int insertedCount) throws IOException {
        PDDocumentOutline outline = doc.getDocumentCatalog().getDocumentOutline();
        if (outline == null) return;
        final int delta = insertedCount - 1;

        traverseAndAdjust(outline, item -> {
            PDPageDestination dest = resolveDestination(item);
            if (dest == null) return;

            PDPage pageRef = dest.getPage();
            if (pageRef != null) {
                if (pageRef == removedPage && firstInserted != null) {
                    dest.setPage(firstInserted);
                    item.setDestination(dest);
                }
                return;
            }

            int pn = dest.getPageNumber();
            if (pn < 0) return;

            if (pn == targetIndex) {
                if (firstInserted != null) dest.setPage(firstInserted);
                else dest.setPageNumber(targetIndex);
                item.setDestination(dest);
            } else if (pn > targetIndex && delta != 0) {
                dest.setPageNumber(pn + delta);
                item.setDestination(dest);
            }
        });
    }

    private void updateBookmarksAfterReplaceRange(PDDocument doc, int startIndex, int replaceCount, PDPage firstInserted, int insertedCount) throws IOException {
        PDDocumentOutline outline = doc.getDocumentCatalog().getDocumentOutline();
        if (outline == null) return;
        final int endIndex = startIndex + replaceCount - 1;
        final int delta = insertedCount - replaceCount;

        traverseAndAdjust(outline, item -> {
            PDPageDestination dest = resolveDestination(item);
            if (dest == null) return;
            if (dest.getPage() != null) return;

            int pn = dest.getPageNumber();
            if (pn < 0) return;

            if (pn >= startIndex && pn <= endIndex) {
                if (firstInserted != null) dest.setPage(firstInserted);
                else dest.setPageNumber(startIndex);
                item.setDestination(dest);
            } else if (pn > endIndex && delta != 0) {
                dest.setPageNumber(pn + delta);
                item.setDestination(dest);
            }
        });
    }

    // ---------- Bookmark traversal utils ----------

    private interface ItemVisitor { void visit(PDOutlineItem item) throws IOException; }

    private void traverseAndAdjust(PDOutlineNode node, ItemVisitor visitor) throws IOException {
        PDOutlineItem it = node.getFirstChild();
        while (it != null) {
            visitor.visit(it);
            if (it.hasChildren()) traverseAndAdjust(it, visitor);
            it = it.getNextSibling();
        }
    }

    private PDPageDestination resolveDestination(PDOutlineItem item) throws IOException {
        PDDestination d = item.getDestination();
        if (d instanceof PDPageDestination) return (PDPageDestination) d;
        if (item.getAction() instanceof org.apache.pdfbox.pdmodel.interactive.action.PDActionGoTo) {
            PDDestination d2 = ((org.apache.pdfbox.pdmodel.interactive.action.PDActionGoTo) item.getAction()).getDestination();
            if (d2 instanceof PDPageDestination) return (PDPageDestination) d2;
        }
        return null;
    }

    // ---------- Helpers ----------

    private File resolveNewPdfFile(Part uploadPart, String serverFileName) throws IOException {
        if (uploadPart != null && uploadPart.getSize() > 0) {
            File tmp = new File(UPLOAD_DIR, "incoming_" + System.currentTimeMillis() + ".pdf");
            try (InputStream in = uploadPart.getInputStream(); OutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[8192]; int r;
                while ((r = in.read(buf)) != -1) out.write(buf, 0, r);
            }
            return tmp;
        }
        if (serverFileName != null && !serverFileName.isEmpty()) {
            String safe = serverFileName.replaceAll("[\\\\/]+", "");
            File f = new File(UPLOAD_DIR, safe);
            if (f.exists() && f.getName().toLowerCase().endsWith(".pdf")) return f;
        }
        return null;
    }

    private void writeJson(HttpServletResponse resp, int code, Map<String, ?> obj) throws IOException {
        resp.setStatus(code);
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(toJson(obj));
    }

    private void writeJsonError(HttpServletResponse resp, int code, String msg) throws IOException {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("error", true);
        m.put("message", msg);
        writeJson(resp, code, m);
    }

    private String toJson(Object o) {
        if (o == null) return "null";
        if (o instanceof String) return "\"" + escape((String) o) + "\"";
        if (o instanceof Number || o instanceof Boolean) return String.valueOf(o);
        if (o instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) o;
            return "{" + m.entrySet().stream()
                    .map(e -> "\"" + escape(e.getKey()) + "\":" + toJson(e.getValue()))
                    .collect(Collectors.joining(",")) + "}";
        }
        if (o instanceof Collection) {
            Collection<?> c = (Collection<?>) o;
            return "[" + c.stream().map(this::toJson).collect(Collectors.joining(",")) + "]";
        }
        return "\"" + escape(String.valueOf(o)) + "\"";
    }

    private String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}