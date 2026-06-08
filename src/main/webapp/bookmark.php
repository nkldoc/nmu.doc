<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>PDF Manager</title>

  <script src="./js/pdf.min.js"></script>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "./js/pdf.worker.min.js";
  </script>

  <style>
    body { font-family: Arial, sans-serif; margin: 16px; }
    #cols { display: grid; grid-template-columns: 340px 1fr; gap: 16px; }
    #bookmarkList, #serverFiles { border: 1px solid #aaa; padding: 8px; max-height: 220px; overflow-y: auto; }
    .bookmark { cursor: pointer; margin: 2px 0; }
    #pdfContainer { border: 1px solid #ccc; height: 80vh; overflow-y: scroll; padding: 8px; }
    label { display:block; margin-top: 8px; }
    .row { display:flex; gap:8px; align-items: center; flex-wrap: wrap; }
    button { padding: 6px 12px; cursor: pointer; }
    .btn-danger { background-color: #dc3545; color: white; border: 1px solid #dc3545; border-radius: 4px; }
    .btn-danger:hover { background-color: #c82333; }
    .section-block { border: 1px solid #ddd; padding: 12px; margin-top: 12px; border-radius: 4px; background: #fdfdfd; }
    small.muted { color: #777; }

    /* dynamic field groups */
    .field-group { display: none; margin-top: 6px; }
    .field-group.active { display: block; }

    /* delete preview */
    #deletePreviewSection { display:none; margin-top:12px; }
    #thumbGrid { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
  </style>
</head>
<body>
  <h2>PDF Manager</h2>

  <div class="row">
    <form id="templateForm" enctype="multipart/form-data" method="post" action="/supplies/pdf/uploadTemplate">
      <label><b>อัปโหลด Template (PDF ที่มี bookmark):</b></label>
      <input type="file" name="templatePdf" accept="application/pdf" required />
      <button type="submit">อัปโหลด</button>
      <small class="muted">ตัวอย่าง: ไม่เกินห้าแสน_bookmark.pdf</small>
    </form>
    <button id="btnReload">รีเฟรช Bookmarks/Preview</button>
  </div>

  <div id="cols">
    <div>
      <h3>Bookmarks</h3>
      <div id="bookmarkList">—</div>

      <!-- ============ FORM หลัก ============ -->
      <div class="section-block">
        <h3>จัดการหน้า</h3>
        <form id="editForm" enctype="multipart/form-data">

          <label>การทำงาน:</label>
          <select name="actionType" id="actionType">
            <option value="insert">➕ แทรกหน้าใหม่</option>  
            <option value="replace">🔄 แทนที่หน้าเดียว</option>
            <option value="replaceRange">🔄 แทนที่หลายหน้า (ช่วง)</option>
            <option value="deleteRange">🗑 ลบหน้า (ช่วง)</option>
          </select>

          <!-- ── หน้าเริ่ม (ใช้ทุก action) ── -->
          <label id="pageNumberLabel">หมายเลขหน้าเริ่ม (1-based):</label>
          <input type="number" name="pageNumber" id="pageNumber" min="1" />

          <!-- ── [deleteRange] ช่วงหน้าที่ลบ ── -->
          <div class="field-group" id="grpDeleteRange">
            <label>ระบุช่วงหน้าที่ต้องการลบ <small class="muted">(เช่น 1-2, 4-6 หรือ 3, 5, 7)</small></label>
            <div class="row">
              <input type="text" id="deleteRangeInput" placeholder="เช่น 1-2, 4-6" style="flex:1;" />
              <button type="button" id="btnPreviewDelete">ดูตัวอย่าง</button>
            </div>
            <div id="parseError" style="color:red; font-size:13px; display:none;"></div>

            <!-- preview thumbnails -->
            <div id="deletePreviewSection">
              <div style="background:#fff8e1; border:1px solid #ffc107; border-radius:4px; padding:8px 12px; margin:8px 0;">
                ⚠️ หน้าที่จะถูกลบ: <strong id="willDeleteLabel"></strong>
              </div>
              <div id="thumbGrid"></div>
              <div class="row">
                <button type="button" id="btnCancelDelete">ยกเลิก</button>
                <button type="button" id="btnConfirmDelete" class="btn-danger">🗑 ยืนยันลบ</button>
                <span id="deleteMsg"></span>
              </div>
            </div>
          </div>

          <!-- ── [replaceRange] จำนวนหน้าที่แทนที่ ── -->
          <div class="field-group" id="grpReplaceCount">
            <label>จำนวนหน้าที่จะถูกแทนที่ (replaceCount):</label>
            <input type="number" name="replaceCount" id="replaceCount" min="1" value="1" />
            <small class="muted">เช่น เริ่มที่หน้า 5 และ replaceCount=3 → แทนที่หน้า 5-7</small>
          </div>

          <!-- ── [insert / replace / replaceRange] เลือกไฟล์ PDF ── -->
          <div class="field-group" id="grpPdfSource">
            <label>เลือก PDF ใหม่ (อัปโหลด):</label>
            <input type="file" name="newPdf" id="newPdf" accept="application/pdf" />
            <div class="row" style="margin-top:6px;">
              <label style="margin:0;">หรือเลือกจากเซิร์ฟเวอร์:</label>
              <select name="serverFile" id="serverFile">
                <option value="">—</option>
              </select>
              <button type="button" id="btnReloadServerFiles">รีเฟรชไฟล์</button>
            </div>
            <small class="muted">* ถ้าไฟล์ต้นทางมีหลายหน้า ระบบจะ <b>แทรก/แทนที่ด้วยทุกหน้า</b> ตามลำดับในไฟล์นั้น</small>
          </div>

          <!-- ── ปุ่ม submit (ซ่อนเมื่อ deleteRange เพราะมีปุ่มยืนยันแยก) ── -->
          <div class="row" style="margin-top:12px;" id="grpSubmitBtn">
            <button type="submit">ยืนยัน</button>
            <span id="editMsg"></span>
          </div>

        </form>
      </div>
      <!-- ===================================== -->

      <h3>ไฟล์บนเซิร์ฟเวอร์</h3>
      <div id="serverFiles">—</div>
    </div>

    <div>
      <h3>Preview</h3>

      <div style="background:#f5f5f5;border:1px solid #ccc;padding:8px;margin-bottom:10px;display:flex;gap:15px;align-items:center;flex-wrap:wrap;">
        <b>Current Page:</b> <span id="currentPage">1</span>
        &nbsp;/&nbsp;
        <b>Total:</b> <span id="totalPagesNav">0</span>
        <button type="button" onclick="gotoPrevPage()">◀ Previous</button>
        <button type="button" onclick="gotoNextPage()">Next ▶</button>
        <button type="button" onclick="focusDeletePage()" class="btn-danger">ลบหน้าปัจจุบัน</button>
      </div>
     <div id="pdfContainer">—</div>
      <div id="pdfToolbar">
        Start Page <input type="number" id="startPage" min="1" value="1" style="width:90px;">
        Limit <input type="number" id="limitPage" min="1" value="10" style="width:90px;">
        &nbsp;|&nbsp; Go to Page <input type="number" id="gotoPage" min="1" value="1" style="width:90px;">
        / <span id="totalPages">0</span>
        <button type="button" onclick="gotoPageNumber()">Go</button>
        <button type="button" onclick="gotoPrevPage()">◀</button>
        <button type="button" onclick="gotoNextPage()">▶</button>
        <button type="button" onclick="applyPageRange()" style="margin-left:8px;">Apply Range</button>
      </div>

 
    </div>
  </div>

  <script>
    const PDF_URL = "/supplies/pdf/template";
    let pdfDoc = null;
    let currentPage = 1;
    let renderedStartPage = 1;
    let renderedEndPage   = 1;

    // ─── actionType UI toggle ────────────────────────────────────────────────
    function onActionTypeChange() {
      const action = document.getElementById('actionType').value;
      const isDelete      = action === 'deleteRange';
      const isReplaceRange= action === 'replaceRange';
      const needsPdf      = !isDelete; // insert / replace / replaceRange ต้องการไฟล์

      // pageNumber: ไม่ต้องแสดงเมื่อ deleteRange (ใช้ช่อง text ระบุเองแทน)
      document.getElementById('pageNumber').required  = !isDelete;
      document.getElementById('pageNumber').closest('label') // label ก่อน input
      document.getElementById('pageNumberLabel').style.display = isDelete ? 'none' : 'block';
      document.getElementById('pageNumber').style.display      = isDelete ? 'none' : 'block';

      // field groups
      setGroup('grpDeleteRange',  isDelete);
      setGroup('grpReplaceCount', isReplaceRange);
      setGroup('grpPdfSource',    needsPdf);
      setGroup('grpSubmitBtn',    !isDelete); // deleteRange ใช้ปุ่มยืนยันลบแทน

      // reset delete preview เมื่อเปลี่ยน action
      if (!isDelete) {
        document.getElementById('deletePreviewSection').style.display = 'none';
        document.getElementById('deleteRangeInput').value = '';
        document.getElementById('deleteMsg').textContent  = '';
      }
    }

    function setGroup(id, show) {
      document.getElementById(id).classList.toggle('active', show);
    }

    document.getElementById('actionType').addEventListener('change', onActionTypeChange);
    // init
    onActionTypeChange();

    // ─── editForm submit (insert / replace / replaceRange) ──────────────────
    document.getElementById('editForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const action = document.getElementById('actionType').value;
      if (action === 'deleteRange') return; // deleteRange มีปุ่มแยก
      const fd = new FormData(e.target);
      fetch('/supplies/pdf/edit', { method: 'POST', body: fd })
        .then(r => r.ok ? r.json() : r.text().then(t => Promise.reject(t)))
        .then(js => {
          document.getElementById('editMsg').textContent = js.message || 'สำเร็จ';
          loadBookmarks(); loadPdfPreview();
        })
        .catch(err => {
          document.getElementById('editMsg').textContent = 'ผิดพลาด: ' + err;
        });
    });

    // ─── Delete preview ──────────────────────────────────────────────────────
    document.getElementById('btnPreviewDelete').addEventListener('click', () => {
      const val   = document.getElementById('deleteRangeInput').value.trim();
      const errEl = document.getElementById('parseError');
      errEl.style.display = 'none';
      document.getElementById('deletePreviewSection').style.display = 'none';

      if (!val) { errEl.textContent = 'กรุณาระบุหน้าที่ต้องการลบ'; errEl.style.display = 'block'; return; }
      const pages = parsePages(val);
      if (!pages) { errEl.textContent = 'รูปแบบไม่ถูกต้อง เช่น 1-2, 4-6 หรือ 3, 5'; errEl.style.display = 'block'; return; }

      document.getElementById('willDeleteLabel').textContent = 'หน้า ' + formatPageList(pages);

      const grid = document.getElementById('thumbGrid');
      grid.innerHTML = '';
      pages.forEach(p => {
        const wrap   = document.createElement('div');
        wrap.style.cssText = 'border:2px solid #dc3545; border-radius:4px; overflow:hidden; text-align:center;';
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width:100px; display:block;';
        const lbl    = document.createElement('div');
        lbl.style.cssText = 'font-size:11px; background:#dc3545; color:white; padding:2px;';
        lbl.textContent = 'หน้า ' + p;
        wrap.appendChild(canvas); wrap.appendChild(lbl); grid.appendChild(wrap);
        if (pdfDoc) {
          pdfDoc.getPage(p).then(page => {
            const vp = page.getViewport({ scale: 0.4 });
            canvas.width = vp.width; canvas.height = vp.height;
            page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise.catch(() => {});
          }).catch(() => { lbl.textContent = 'ไม่พบหน้า ' + p; });
        }
      });

      document.getElementById('deletePreviewSection').style.display = 'block';
    });

    document.getElementById('btnCancelDelete').addEventListener('click', () => {
      document.getElementById('deletePreviewSection').style.display = 'none';
      document.getElementById('deleteRangeInput').value = '';
      document.getElementById('deleteMsg').textContent  = '';
    });

    document.getElementById('btnConfirmDelete').addEventListener('click', () => {
      const pages = parsePages(document.getElementById('deleteRangeInput').value.trim());
      if (!pages) return;
      const fd = new FormData();
      fd.append('pages', pages.join(','));
      document.getElementById('deleteMsg').textContent = 'กำลังลบ…';
      fetch('/supplies/pdf/deletePages', { method: 'POST', body: fd })
        .then(r => r.ok ? r.json() : r.text().then(t => Promise.reject(t)))
        .then(js => {
          const remaining = js.remainingPages != null ? ` (เหลือ ${js.remainingPages} หน้า)` : '';
          document.getElementById('deleteMsg').textContent = (js.message || 'ลบสำเร็จ') + remaining;
          document.getElementById('deletePreviewSection').style.display = 'none';
          document.getElementById('deleteRangeInput').value = '';
          if (js.remainingPages && parseInt(document.getElementById('startPage').value) > js.remainingPages) {
            document.getElementById('startPage').value = 1;
          }
          loadBookmarks(); loadPdfPreview();
        })
        .catch(err => { document.getElementById('deleteMsg').textContent = 'ผิดพลาด: ' + err; });
    });

    // ─── ปุ่ม "ลบหน้าปัจจุบัน" ใน toolbar ──────────────────────────────────
    function focusDeletePage() {
      // สลับ action ไป deleteRange แล้วใส่หน้าปัจจุบัน
      document.getElementById('actionType').value = 'deleteRange';
      onActionTypeChange();
      document.getElementById('deleteRangeInput').value = currentPage;
      document.getElementById('btnPreviewDelete').click();
    }

    // ─── PDF Preview ─────────────────────────────────────────────────────────
    function updateTotalPagesDisplay(n) {
      document.getElementById('totalPages').textContent    = n;
      document.getElementById('totalPagesNav').textContent = n;
    }

    function loadPdfPreview() {
      const container = document.getElementById('pdfContainer');
      container.innerHTML = 'กำลังโหลด…';
      pdfjsLib.getDocument(PDF_URL).promise.then(pdf => {
        pdfDoc = pdf;
        const totalReal  = pdf.numPages;
        updateTotalPagesDisplay(totalReal);

        const startInput = parseInt(document.getElementById('startPage').value) || 1;
        const limitInput = parseInt(document.getElementById('limitPage').value) || 100;
        const startP     = Math.max(1, Math.min(startInput, totalReal));
        const endP       = Math.min(startP + limitInput - 1, totalReal);

        renderedStartPage = startP;
        renderedEndPage   = endP;

        document.getElementById('gotoPage').max = totalReal;
        if (currentPage < startP || currentPage > endP) currentPage = startP;
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('gotoPage').value          = currentPage;

        container.innerHTML = '';
        const info = document.createElement('div');
        info.style.cssText = 'padding:4px 8px;background:#e8f4fd;border:1px solid #bee3f8;border-radius:4px;font-size:12px;margin-bottom:8px;color:#2c5282;';
        info.textContent = `แสดงหน้า ${startP} – ${endP} จากทั้งหมด ${totalReal} หน้า`;
        container.appendChild(info);
        for (let i = startP; i <= endP; i++) renderPage(i, container);
      }).catch(() => { container.textContent = "ยังไม่มี template หรือเปิดไม่ได้"; });
    }

    function applyPageRange() { loadPdfPreview(); }

    function renderPage(num, container) {
      pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas   = document.createElement('canvas');
        const ctx      = canvas.getContext('2d');
        canvas.width   = viewport.width;
        canvas.height  = viewport.height;
        canvas.style.cursor   = 'pointer';
        canvas.dataset.page   = num;
        canvas.onclick = function () {
          currentPage = num;
          document.getElementById('currentPage').textContent = num;
          document.getElementById('gotoPage').value          = num;
          document.querySelectorAll('#pdfContainer canvas').forEach(c => c.style.border = '');
          canvas.style.border = '4px solid #007bff';
        };
        container.appendChild(canvas);
        page.render({ canvasContext: ctx, viewport }).promise.then(() => {});
      });
    }

    function focusPageCanvas(pageNo) {
      if (pageNo < renderedStartPage || pageNo > renderedEndPage) {
        document.getElementById('startPage').value = pageNo;
        loadPdfPreview();
        return;
      }
      const canvases = document.querySelectorAll('#pdfContainer canvas');
      const idx      = pageNo - renderedStartPage;
      if (canvases[idx]) {
        canvases.forEach(c => c.style.border = '');
        canvases[idx].style.border = '4px solid #007bff';
        canvases[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
        currentPage = pageNo;
        document.getElementById('currentPage').textContent = pageNo;
        document.getElementById('gotoPage').value          = pageNo;
      }
    }

    function gotoPrevPage() { if (currentPage > 1) focusPageCanvas(currentPage - 1); }
    function gotoNextPage() { if (pdfDoc && currentPage < pdfDoc.numPages) focusPageCanvas(currentPage + 1); }

    function gotoPageNumber() {
      const pageNo = parseInt(document.getElementById('gotoPage').value || 1);
      if (!pdfDoc || pageNo < 1 || pageNo > pdfDoc.numPages) return;
      focusPageCanvas(pageNo);
    }

    // ─── Bookmarks ───────────────────────────────────────────────────────────
    function loadBookmarks() {
      fetch('/supplies/pdf/bookmarks')
        .then(r => r.json())
        .then(list => {
          const el = document.getElementById('bookmarkList');
          el.innerHTML = '';
          if (!list || list.length === 0) { el.textContent = 'ไม่พบบุ๊กมาร์ก'; return; }
          list.forEach(b => {
            const div = document.createElement('div');
            div.className = 'bookmark';
            div.style.paddingLeft = (b.level * 12) + 'px';
            div.textContent = `[p.${b.pageIndex + 1}] ${b.title}`;
            div.onclick = () => {
              const targetPage = b.pageIndex + 1;
              document.getElementById('pageNumber').value = targetPage;
              focusPageCanvas(targetPage); // auto-load range ถ้าจำเป็น
            };
            el.appendChild(div);
          });
        })
        .catch(() => document.getElementById('bookmarkList').textContent = 'โหลดบุ๊กมาร์กล้มเหลว');
    }

    // ─── Server files ─────────────────────────────────────────────────────────
    function loadServerFiles() {
      fetch('/supplies/pdf/serverFiles')
        .then(r => r.json())
        .then(list => {
          const sel = document.getElementById('serverFile');
          const box = document.getElementById('serverFiles');
          sel.innerHTML = '<option value="">—</option>';
          box.innerHTML = '';
          if (!list || list.length === 0) { box.textContent = 'ไม่มีไฟล์'; return; }
          list.forEach(fn => {
            sel.insertAdjacentHTML('beforeend', `<option value="${fn}">${fn}</option>`);
            box.insertAdjacentHTML('beforeend', `<div>${fn}</div>`);
          });
        });
    }

    // ─── Upload template ──────────────────────────────────────────────────────
    document.getElementById('templateForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      fetch('/supplies/pdf/uploadTemplate', { method: 'POST', body: fd })
        .then(r => r.ok ? r.text() : r.text().then(t => Promise.reject(t)))
        .then(() => { loadBookmarks(); loadPdfPreview(); })
        .catch(err => alert('อัปโหลดล้มเหลว: ' + err));
    });

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function parsePages(str) {
      const pages = new Set();
      const parts = str.split(',').map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (/^\d+$/.test(part)) {
          pages.add(parseInt(part));
        } else if (/^\d+-\d+$/.test(part)) {
          const [a, b] = part.split('-').map(Number);
          if (a > b) return null;
          for (let i = a; i <= b; i++) pages.add(i);
        } else return null;
      }
      return pages.size ? [...pages].sort((a, b) => a - b) : null;
    }

    function formatPageList(pages) {
      const ranges = [];
      let start = pages[0], end = pages[0];
      for (let i = 1; i < pages.length; i++) {
        if (pages[i] === end + 1) { end = pages[i]; }
        else { ranges.push(start === end ? String(start) : start + '-' + end); start = end = pages[i]; }
      }
      ranges.push(start === end ? String(start) : start + '-' + end);
      return ranges.join(', ');
    }

    // ─── Event wiring ─────────────────────────────────────────────────────────
    document.getElementById('btnReload').addEventListener('click', () => { loadBookmarks(); loadPdfPreview(); });
    document.getElementById('btnReloadServerFiles').addEventListener('click', loadServerFiles);

    document.addEventListener('DOMContentLoaded', () => {
      ['gotoPage', 'startPage', 'limitPage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); gotoPageNumber(); } });
      });
    });

    // ─── Init ─────────────────────────────────────────────────────────────────
    loadBookmarks();
    loadServerFiles();
    loadPdfPreview();
  </script>
</body>
</html>