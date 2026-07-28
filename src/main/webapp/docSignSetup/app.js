(() => {
  "use strict";

  // ═══════════════════════════════════════════════════════════
  // DATA
  // ═══════════════════════════════════════════════════════════
  const ROLES = [
    { id: "r1", name: "ผู้จัดทำ", color: "#3B82F6" },
    { id: "r2", name: "ผู้ตรวจสอบ", color: "#8B5CF6" },
    { id: "r3", name: "ผู้อนุมัติ", color: "#10B981" },
    { id: "r4", name: "ผู้รับทราบ", color: "#F59E0B" },
  ];

  const EMPLOYEES = [
    { id: "e1", name: "นายสมชาย ใจดี", dept: "จัดซื้อ", position: "เจ้าหน้าที่จัดซื้อ" },
    { id: "e2", name: "นางสาวสมหญิง รักดี", dept: "จัดซื้อ", position: "หัวหน้าแผนกจัดซื้อ" },
    { id: "e3", name: "นายวิชัย มานะ", dept: "บัญชี", position: "ผู้จัดการบัญชี" },
    { id: "e4", name: "นางสาวอรุณี สวัสดี", dept: "บริหาร", position: "ผู้อำนวยการ" },
    { id: "e5", name: "นายประสิทธิ์ ดีงาม", dept: "จัดซื้อ", position: "ผู้จัดการจัดซื้อ" },
  ];

  const STEPS = [
    { icon: "📄", title: "Template ชนิดเอกสาร", subtitle: "กำหนด document type และ purchase group" },
    { icon: "👥", title: "กลุ่มผู้ลงนาม", subtitle: "สร้างกลุ่มและกำหนด role ของแต่ละคน" },
    { icon: "📌", title: "วางบล็อกผู้เกี่ยวข้อง", subtitle: "อัปโหลด PDF แล้วลาก/ปรับขนาดบล็อกลงนามของแต่ละคนบนเอกสาร" },
    { icon: "💾", title: "ตรวจสอบและบันทึก", subtitle: "Preview และ save template" },
  ];

  // Mock document signing list
  const DOCS = [
    { id: "d1", no: "PR-2026-0142", type: "PR", dept: "จัดซื้อ", requester: "นายสมชาย ใจดี", date: "2026-07-25", signers: 4, signed: 2, current: "นายวิชัย มานะ", amount: 128000, status: "pending" },
    { id: "d2", no: "PO-2026-0098", type: "PO", dept: "IT", requester: "นางสาวสมหญิง รักดี", date: "2026-07-24", signers: 3, signed: 3, current: "-", amount: 452000, status: "done" },
    { id: "d3", no: "PR-2026-0141", type: "PR", dept: "บัญชี", requester: "นายวิชัย มานะ", date: "2026-07-23", signers: 4, signed: 1, current: "นางสาวสมหญิง รักดี", amount: 76500, status: "pending" },
    { id: "d4", no: "GR-2026-0067", type: "GR", dept: "จัดซื้อ", requester: "นายประสิทธิ์ ดีงาม", date: "2026-07-22", signers: 2, signed: 2, current: "-", amount: 31200, status: "done" },
    { id: "d5", no: "IV-2026-0055", type: "IV", dept: "บัญชี", requester: "นายวิชัย มานะ", date: "2026-07-22", signers: 3, signed: 0, current: "นายสมชาย ใจดี", amount: 219000, status: "pending" },
    { id: "d6", no: "PO-2026-0097", type: "PO", dept: "บริหาร", requester: "นางสาวอรุณี สวัสดี", date: "2026-07-21", signers: 4, signed: 4, current: "-", amount: 980000, status: "done" },
    { id: "d7", no: "PR-2026-0140", type: "PR", dept: "IT", requester: "นางสาวสมหญิง รักดี", date: "2026-07-20", signers: 4, signed: 3, current: "นางสาวอรุณี สวัสดี", amount: 154000, status: "pending" },
    { id: "d8", no: "GR-2026-0066", type: "GR", dept: "จัดซื้อ", requester: "นายสมชาย ใจดี", date: "2026-07-19", signers: 2, signed: 2, current: "-", amount: 18900, status: "done" },
    { id: "d9", no: "IV-2026-0054", type: "IV", dept: "จัดซื้อ", requester: "นายประสิทธิ์ ดีงาม", date: "2026-07-18", signers: 3, signed: 1, current: "นายวิชัย มานะ", amount: 67500, status: "pending" },
    { id: "d10", no: "PR-2026-0139", type: "PR", dept: "บัญชี", requester: "นายวิชัย มานะ", date: "2026-07-17", signers: 4, signed: 4, current: "-", amount: 305000, status: "done" },
  ];

  const DOC_TYPE_LABEL = { PR: "PR - ใบขอซื้อ", PO: "PO - ใบสั่งซื้อ", GR: "GR - ใบรับสินค้า", IV: "IV - ใบแจ้งหนี้" };

  const uid = () => Math.random().toString(36).slice(2, 8);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ═══════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════
  const state = {
    view: "create",
    step: 0,
    config: { docType: "PR - ใบขอซื้อ", purchaseGroup: "", templateName: "", description: "", status: "Draft" },
    groups: [],
    editingGroupId: null,
    // step 2: involved-party block placement
    blocks: [],
    selectedBlockId: null,
    pdfDoc: null,
    pdfFileName: null,
    currentPage: 1,
    totalPages: 1,
    pageSizes: {},
    previewMode: false,
    // list view
    listTab: "all",
    search: "",
    typeFilter: "",
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN MENU
  // ═══════════════════════════════════════════════════════════
  const MOBILE_BREAKPOINT = 900;
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  let sidebarCollapsed = false;
  function openMobileMenu() {
    $("#mainMenu").classList.add("mobile-open");
    $("#menuScrim").classList.add("visible");
    $("#menuOpener").style.display = "none";
  }
  function closeMobileMenu() {
    $("#mainMenu").classList.remove("mobile-open");
    $("#menuScrim").classList.remove("visible");
    if (isMobile()) $("#menuOpener").style.display = "flex";
  }
  function setSidebarCollapsed(val, persist = true) {
    sidebarCollapsed = val;
    $("#mainMenu").classList.toggle("collapsed", sidebarCollapsed);
    $("#menuToggle").setAttribute("aria-expanded", String(!sidebarCollapsed));
    if (persist) {
      try { localStorage.setItem("mainMenuCollapsed", sidebarCollapsed ? "1" : "0"); } catch (e) { /* ignore */ }
    }
  }
  function syncSidebarForViewport() {
    if (isMobile()) {
      $("#mainMenu").classList.remove("collapsed");
      closeMobileMenu();
      $("#menuOpener").style.display = "flex";
    } else {
      $("#mainMenu").classList.remove("mobile-open");
      $("#menuScrim").classList.remove("visible");
      $("#menuOpener").style.display = "none";
      setSidebarCollapsed(sidebarCollapsed, false);
    }
  }
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function initMainMenu() {
    $$(".menu-item").forEach(btn => {
      btn.addEventListener("click", () => {
        state.view = btn.dataset.view;
        $$(".menu-item").forEach(b => b.classList.toggle("active", b === btn));
        $$(".app-view").forEach(v => v.classList.remove("active"));
        $(`#view-${state.view}`).classList.add("active");
        if (state.view === "list") renderDocList();
        if (isMobile()) closeMobileMenu(); // auto-close drawer after navigating
      });
    });

    try { sidebarCollapsed = localStorage.getItem("mainMenuCollapsed") === "1"; } catch (e) { /* ignore */ }

    $("#menuToggle").addEventListener("click", () => {
      if (isMobile()) closeMobileMenu();
      else setSidebarCollapsed(!sidebarCollapsed);
    });
    $("#menuOpener").addEventListener("click", openMobileMenu);
    $("#menuScrim").addEventListener("click", closeMobileMenu);

    window.addEventListener("resize", debounce(syncSidebarForViewport, 150));
    syncSidebarForViewport();
  }

  // ═══════════════════════════════════════════════════════════
  // WIZARD: STEP NAVIGATION
  // ═══════════════════════════════════════════════════════════
  function goToStep(i) {
    state.step = i;
    $$(".tab-btn").forEach((b, idx) => b.classList.toggle("active", idx === i));
    $$(".step-item").forEach((el, idx) => {
      el.classList.toggle("active", idx === i);
      el.classList.toggle("done", idx < i);
      el.querySelector(".step-num").textContent = idx < i ? "✓" : String(idx + 1);
    });
    $$(".step-panel").forEach((el, idx) => el.classList.toggle("active", idx === i));

    $("#sectionIcon").textContent = STEPS[i].icon;
    $("#sectionTitle").textContent = STEPS[i].title;
    $("#sectionSubtitle").textContent = STEPS[i].subtitle;

    $("#backBtn").disabled = i === 0;
    $("#nextBtn").style.display = i === STEPS.length - 1 ? "none" : "inline-flex";

    if (i === 2) initBlockStepIfNeeded();
    if (i === 3) renderPreview();
  }

  function initWizardNav() {
    $$(".tab-btn").forEach((b, i) => b.addEventListener("click", () => goToStep(i)));
    $$(".step-item").forEach((b, i) => b.addEventListener("click", () => goToStep(i)));
    $("#backBtn").addEventListener("click", () => goToStep(Math.max(0, state.step - 1)));
    $("#nextBtn").addEventListener("click", () => goToStep(Math.min(STEPS.length - 1, state.step + 1)));
  }

  // ═══════════════════════════════════════════════════════════
  // STEP 0: TEMPLATE CONFIG
  // ═══════════════════════════════════════════════════════════
  function initStep0() {
    $("#docType").addEventListener("change", e => state.config.docType = e.target.value);
    $("#purchaseGroup").addEventListener("change", e => state.config.purchaseGroup = e.target.value);
    $("#templateName").addEventListener("input", e => state.config.templateName = e.target.value);
    $("#description").addEventListener("input", e => state.config.description = e.target.value);
    $$(".status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.config.status = btn.dataset.status;
        $$(".status-btn").forEach(b => b.classList.toggle("active", b === btn));
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // STEP 1: SIGNATURE GROUPS
  // ═══════════════════════════════════════════════════════════
  function addGroup() {
    const input = $("#newGroupName");
    const name = input.value.trim();
    if (!name) return;
    state.groups.push({ id: uid(), name, members: [] });
    input.value = "";
    renderGroups();
  }

  function removeGroup(gid) {
    state.groups = state.groups.filter(g => g.id !== gid);
    state.blocks = state.blocks.filter(b => b.groupId !== gid);
    renderGroups();
    if (typeof refreshBlockGroupOptions === "function") refreshBlockGroupOptions();
  }

  function addMember(gid, empId, roleId) {
    const emp = EMPLOYEES.find(e => e.id === empId);
    const role = ROLES.find(r => r.id === roleId);
    if (!emp || !role) return;
    const g = state.groups.find(g => g.id === gid);
    g.members.push({
      id: uid(), empId: emp.id, empName: emp.name, position: emp.position, dept: emp.dept,
      roleName: role.name, roleColor: role.color, order: g.members.length + 1,
    });
    renderGroups();
    if (typeof refreshBlockGroupOptions === "function") refreshBlockGroupOptions();
  }

  function removeMember(gid, mid) {
    const g = state.groups.find(g => g.id === gid);
    g.members = g.members.filter(m => m.id !== mid);
    state.blocks = state.blocks.filter(b => !(b.groupId === gid && b.memberId === mid));
    renderGroups();
  }

  function renderGroups() {
    const listEl = $("#groupList");
    if (state.groups.length === 0) {
      listEl.innerHTML = `<p class="empty-msg">ยังไม่มีกลุ่มผู้ลงนาม — เพิ่มกลุ่มแรกด้านบน</p>`;
    } else {
      listEl.innerHTML = state.groups.map((g, gi) => `
        <div class="card group-card" data-gid="${g.id}">
          <div class="group-header">
            <div class="group-header-left">
              <span class="group-idx">${gi + 1}</span>
              <span class="group-name">${escapeHtml(g.name)}</span>
              <span class="group-count">${g.members.length} คน</span>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-subtle btn-sm js-edit-group">${state.editingGroupId === g.id ? "✕ ปิด" : "✏️ แก้ไข"}</button>
              <button class="btn btn-danger btn-sm js-remove-group">ลบ</button>
            </div>
          </div>
          <div class="group-body">
            ${g.members.length === 0 && state.editingGroupId !== g.id ? `<p class="empty-msg" style="padding:0;font-style:italic">ยังไม่มีสมาชิก</p>` : ""}
            ${g.members.map(m => `
              <div class="member-row" data-mid="${m.id}">
                <span class="member-order" style="background:${m.roleColor}22;color:${m.roleColor}">${m.order}</span>
                <span class="member-name">${escapeHtml(m.empName)}</span>
                <span class="badge" style="background:${m.roleColor}22;color:${m.roleColor};border:1px solid ${m.roleColor}44">${m.roleName}</span>
                <button class="remove-x js-remove-member">✕</button>
              </div>
            `).join("")}
            ${state.editingGroupId === g.id ? `
              <div class="add-member-form">
                <select class="js-sel-emp">
                  <option value="">-- เลือกพนักงาน --</option>
                  ${EMPLOYEES.map(e => `<option value="${e.id}">${escapeHtml(e.name)} (${e.dept})</option>`).join("")}
                </select>
                <select class="js-sel-role">
                  <option value="">-- เลือก Role --</option>
                  ${ROLES.map(r => `<option value="${r.id}">${r.name}</option>`).join("")}
                </select>
                <button class="btn btn-primary btn-sm js-add-member">เพิ่ม</button>
              </div>
            ` : ""}
          </div>
        </div>
      `).join("");
    }

    // wire events
    $$(".js-edit-group", listEl).forEach(btn => {
      btn.addEventListener("click", () => {
        const gid = btn.closest(".group-card").dataset.gid;
        state.editingGroupId = state.editingGroupId === gid ? null : gid;
        renderGroups();
      });
    });
    $$(".js-remove-group", listEl).forEach(btn => {
      btn.addEventListener("click", () => removeGroup(btn.closest(".group-card").dataset.gid));
    });
    $$(".js-remove-member", listEl).forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".group-card");
        removeMember(card.dataset.gid, btn.closest(".member-row").dataset.mid);
      });
    });
    $$(".js-add-member", listEl).forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".group-card");
        const empSel = $(".js-sel-emp", card);
        const roleSel = $(".js-sel-role", card);
        if (empSel.value && roleSel.value) addMember(card.dataset.gid, empSel.value, roleSel.value);
      });
    });

    renderGroupSelector();
  }

  function initStep1() {
    $("#addGroupBtn").addEventListener("click", addGroup);
    $("#newGroupName").addEventListener("keydown", e => { if (e.key === "Enter") addGroup(); });
  }

  // ═══════════════════════════════════════════════════════════
  // STEP 2: INVOLVED-PARTY BLOCK PLACEMENT (PDF + drag/resize blocks)
  // ═══════════════════════════════════════════════════════════
  const FALLBACK_W = 595, FALLBACK_H = 842;
  let blockStepInited = false;

  const thaiDate = () => {
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // give each group a stable color derived from its id for visual distinction
  const GROUP_PALETTE = ["#1E6FCC", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];
  function roleColorForGroup(g) {
    if (!g) return "#9CA3AF";
    const idx = state.groups.findIndex(x => x.id === g.id);
    return GROUP_PALETTE[idx % GROUP_PALETTE.length];
  }

  function findGroup(gid) { return state.groups.find(g => g.id === gid) || null; }
  function findMember(g, mid) { return g ? g.members.find(m => m.id === mid) : null; }
  function selectedBlock() { return state.blocks.find(b => b.id === state.selectedBlockId) || null; }

  // ── Mock page fallback (drawn when no real PDF has been uploaded yet) ──
  function renderFallbackPage() {
    const canvas = $("#pdfCanvas");
    canvas.width = FALLBACK_W; canvas.height = FALLBACK_H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, FALLBACK_W, FALLBACK_H);
    ctx.fillStyle = "#f0f4f8"; ctx.fillRect(40, 40, FALLBACK_W - 80, 80);
    ctx.fillStyle = "#1E6FCC"; ctx.font = "bold 18px sans-serif";
    ctx.fillText("ใบขอซื้อ (PR) - Purchase Request", 60, 85);
    ctx.fillStyle = "#6B7280"; ctx.font = "12px sans-serif";
    ["เลขที่เอกสาร:", "วันที่:", "แผนก:", "ผู้ขอซื้อ:", "รายการสินค้า:"].forEach((t, i) => {
      ctx.fillText(t, 60, 160 + i * 30);
      ctx.strokeStyle = "#E2E6EA";
      ctx.strokeRect(160, 145 + i * 30, 380, 22);
    });
    ctx.fillStyle = "#374151"; ctx.font = "bold 13px sans-serif";
    ctx.fillText("ตาราง รายการสินค้า", 60, 330);
    ctx.strokeStyle = "#E2E6EA"; ctx.strokeRect(40, 340, FALLBACK_W - 80, 200);
    ["ลำดับ", "รายการ", "จำนวน", "หน่วย", "ราคา/หน่วย", "รวม"].forEach((h, i) => {
      const x = 40 + i * ((FALLBACK_W - 80) / 6);
      ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, 340, (FALLBACK_W - 80) / 6, 24);
      ctx.strokeStyle = "#D1D5DB"; ctx.strokeRect(x, 340, (FALLBACK_W - 80) / 6, 24);
      ctx.fillStyle = "#374151"; ctx.font = "bold 10px sans-serif";
      ctx.fillText(h, x + 4, 356);
    });
    ctx.fillStyle = "#9CA3AF"; ctx.font = "11px sans-serif";
    ctx.fillText("(ตัวอย่างเอกสารจำลอง — อัปโหลด PDF จริงด้านบนเพื่อวางตำแหน่งแม่นยำขึ้น)", 60, 580);
    ctx.fillStyle = "#E5E7EB"; ctx.fillRect(40, 600, FALLBACK_W - 80, 200);
    ctx.fillStyle = "#9CA3AF"; ctx.font = "italic 12px sans-serif";
    ctx.fillText("พื้นที่ลายเซ็น — ลากวางบล็อกที่นี่", 180, 700);

    $("#docPage").style.width = FALLBACK_W + "px";
    $("#docPage").style.height = FALLBACK_H + "px";
    state.pageSizes[1] = { displayWidth: FALLBACK_W, displayHeight: FALLBACK_H };
    state.totalPages = 1;
    state.currentPage = 1;
    $("#pageLabel").textContent = "ตัวอย่างเอกสารจำลอง · 595 × 842 px";
    updatePageCounter();
  }

  function updatePageCounter() {
    $("#pageCounter").textContent = `หน้า ${state.currentPage} / ${state.totalPages}`;
    $("#prevPageBtn").disabled = state.currentPage <= 1;
    $("#nextPageBtn").disabled = state.currentPage >= state.totalPages;
  }

  // ── Real PDF loading via pdf.js ──
  async function loadPdfFile(file) {
    if (!file) return;
    try {
      $("#coordsReadout").textContent = "กำลังเปิดไฟล์ PDF...";
      if (typeof pdfjsLib === "undefined") throw new Error("ไม่พบไลบรารี pdf.js");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const data = await file.arrayBuffer();
      state.pdfDoc = await pdfjsLib.getDocument({ data }).promise;
      state.pdfFileName = file.name;
      state.totalPages = state.pdfDoc.numPages;
      state.currentPage = 1;
      state.pageSizes = {};
      await renderPdfPage(1);
      $("#coordsReadout").textContent = `เปิด ${file.name} แล้ว (${state.totalPages} หน้า) — เลือกกลุ่ม/สมาชิกแล้วเพิ่มบล็อกได้เลย`;
    } catch (err) {
      state.pdfDoc = null;
      renderFallbackPage();
      renderBlocksForPage();
      $("#coordsReadout").textContent = `เปิด PDF ไม่สำเร็จ (${err.message}) — ใช้ตัวอย่างเอกสารจำลองแทน`;
    }
  }

  async function renderPdfPage(pageNum) {
    const pdfPage = await state.pdfDoc.getPage(pageNum);
    const original = pdfPage.getViewport({ scale: 1 });
    const viewport = pdfPage.getViewport({ scale: FALLBACK_W / original.width });
    const docPage = $("#docPage");
    docPage.style.width = `${viewport.width}px`;
    docPage.style.height = `${viewport.height}px`;
    state.pageSizes[pageNum] = { displayWidth: viewport.width, displayHeight: viewport.height };

    const canvas = $("#pdfCanvas");
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    await pdfPage.render({
      canvasContext: canvas.getContext("2d"),
      viewport,
      transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0],
    }).promise;

    $("#pageLabel").textContent = `หน้า ${pageNum} จาก ${state.totalPages} · ${Math.round(viewport.width)} × ${Math.round(viewport.height)} px`;
    updatePageCounter();
    renderBlocksForPage();
  }

  async function showPage(pageNum) {
    if (pageNum < 1 || pageNum > state.totalPages) return;
    state.currentPage = pageNum;
    if (state.pdfDoc) {
      await renderPdfPage(pageNum);
    } else {
      updatePageCounter();
      renderBlocksForPage();
    }
  }

  // ── Group / member pickers (sidebar "add block" form) ──
  function refreshBlockGroupOptions() {
    const groupSel = $("#blockGroupSelect");
    const memberSel = $("#blockMemberSelect");
    const hasGroups = state.groups.some(g => g.members.length > 0);
    $("#sideHint").style.display = hasGroups ? "none" : "block";

    const prevGroup = groupSel.value;
    groupSel.innerHTML = `<option value="">-- เลือกกลุ่ม --</option>` +
      state.groups.map(g => `<option value="${g.id}">${escapeHtml(g.name)} (${g.members.length} คน)</option>`).join("");
    groupSel.value = state.groups.some(g => g.id === prevGroup) ? prevGroup : "";
    refreshBlockMemberOptions();
  }

  function refreshBlockMemberOptions() {
    const groupSel = $("#blockGroupSelect");
    const memberSel = $("#blockMemberSelect");
    const g = findGroup(groupSel.value);
    if (!g) {
      memberSel.innerHTML = `<option value="">-- เลือกสมาชิก --</option>`;
      memberSel.disabled = true;
    } else {
      memberSel.innerHTML = `<option value="">-- เลือกสมาชิก --</option>` +
        g.members.map(m => `<option value="${m.id}">${m.order}. ${escapeHtml(m.empName)} (${m.roleName})</option>`).join("");
      memberSel.disabled = g.members.length === 0;
    }
    $("#addBlockBtn").disabled = !(groupSel.value && memberSel.value);
  }

  function addBlock() {
    const g = findGroup($("#blockGroupSelect").value);
    const m = findMember(g, $("#blockMemberSelect").value);
    if (!g || !m) return;
    const size = state.pageSizes[state.currentPage] || { displayWidth: FALLBACK_W, displayHeight: FALLBACK_H };
    const ratio = { xRatio: 0.32, yRatio: 0.10 + (state.blocks.filter(b => b.page === state.currentPage).length % 4) * 0.20, widthRatio: 0.46, heightRatio: 0.17 };
    const block = {
      id: uid(),
      groupId: g.id,
      memberId: m.id,
      page: state.currentPage,
      x: Math.round(size.displayWidth * ratio.xRatio),
      y: Math.round(size.displayHeight * ratio.yRatio),
      w: Math.round(size.displayWidth * ratio.widthRatio),
      h: Math.round(size.displayHeight * ratio.heightRatio),
      fontName: "TH Sarabun",
      fontSize: 12,
      hiddenRows: [],
      reviewAction: m.roleName === "ผู้ตรวจสอบ" || m.roleName === "ผู้จัดทำ",
      signAction: true,
      approveAction: m.roleName === "ผู้อนุมัติ",
      approval: "อนุมัติ",
      signText: m.roleName === "ผู้รับทราบ" ? "รับทราบ" : "ลงชื่อ",
      signatureImage: null,
      committee: m.roleName,
      signerName: `(${m.empName})`,
      position: m.position || "",
      organization: m.dept || "",
      signedDate: thaiDate(),
    };
    state.blocks.push(block);
    renderBlocksForPage();
    renderBlockListPanel();
    selectBlock(block.id);
  }

  // ── Rendering blocks on the page ──
  function renderBlocksForPage() {
    const docPage = $("#docPage");
    $$(".rp-block", docPage).forEach(el => el.remove());
    state.blocks.filter(b => b.page === state.currentPage).forEach(block => buildBlockEl(block, docPage));
  }

  function textInput(field, key, label, className = "") {
    const node = document.createElement("input");
    node.className = className;
    node.value = field[key] || "";
    node.setAttribute("aria-label", label);
    node.addEventListener("pointerdown", e => e.stopPropagation());
    node.addEventListener("input", () => { field[key] = node.value; });
    return node;
  }

  function deleteRowBtn(field, key) {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "rp-delete-row"; btn.textContent = "×"; btn.title = `ซ่อนแถว`;
    btn.addEventListener("click", e => { e.stopPropagation(); if (!field.hiddenRows.includes(key)) field.hiddenRows.push(key); renderBlocksForPage(); });
    return btn;
  }

  function appendTextRow(el, field, key, label, className = "") {
    if (field.hiddenRows.includes(key)) return;
    const row = document.createElement("div");
    row.className = "rp-text-row";
    row.appendChild(textInput(field, key, label, className));
    row.appendChild(deleteRowBtn(field, key));
    el.appendChild(row);
  }

  function buildBlockEl(field, container) {
    const g = findGroup(field.groupId);
    const color = roleColorForGroup(g);
    const el = document.createElement("div");
    el.className = `rp-block ${field.id === state.selectedBlockId ? "selected" : ""}`;
    el.dataset.id = field.id;
    Object.assign(el.style, {
      left: `${field.x}px`, top: `${field.y}px`, width: `${field.w}px`, height: `${field.h}px`,
      "--block-font-size": `${field.fontSize}px`, borderColor: field.id === state.selectedBlockId ? "" : color,
    });

    const tools = document.createElement("div");
    tools.className = "rp-block-tools";
    tools.innerHTML = `<span>${g ? escapeHtml(g.name) : "?"}</span><span>ขนาด</span>`;
    const sizeInput = document.createElement("input");
    sizeInput.type = "number"; sizeInput.min = "8"; sizeInput.max = "72"; sizeInput.value = field.fontSize; sizeInput.title = "ขนาดตัวอักษร (px)";
    sizeInput.addEventListener("pointerdown", e => e.stopPropagation());
    sizeInput.addEventListener("input", () => {
      field.fontSize = clamp(Number(sizeInput.value) || 12, 8, 72);
      el.style.setProperty("--block-font-size", `${field.fontSize}px`);
    });
    tools.appendChild(sizeInput);
    const restoreBtn = document.createElement("button");
    restoreBtn.type = "button"; restoreBtn.textContent = "คืนแถว"; restoreBtn.title = "แสดงแถวที่ซ่อนไว้กลับคืน";
    restoreBtn.disabled = field.hiddenRows.length === 0;
    restoreBtn.addEventListener("click", e => { e.stopPropagation(); field.hiddenRows = []; renderBlocksForPage(); });
    tools.appendChild(restoreBtn);
    el.appendChild(tools);

    if (field.approveAction) appendTextRow(el, field, "approval", "ข้อความอนุมัติ", "approval-input");

    const sigRow = document.createElement("div");
    sigRow.className = "rp-sig-row";
    if (!field.signAction || field.hiddenRows.includes("signatureLine")) sigRow.style.display = "none";
    if (field.signAction && !field.hiddenRows.includes("signText")) sigRow.appendChild(textInput(field, "signText", "ข้อความลงนาม", "sign-prefix"));
    const sigUpload = document.createElement("label");
    sigUpload.className = "rp-sig-upload";
    sigUpload.innerHTML = field.signatureImage ? `<img alt="ภาพลายเซ็น" src="${field.signatureImage}">` : `<span>+ ภาพลายเซ็น</span>`;
    const fileInput = document.createElement("input");
    fileInput.type = "file"; fileInput.accept = "image/png,image/jpeg,image/webp";
    fileInput.addEventListener("change", () => {
      if (!fileInput.files[0]) return;
      const reader = new FileReader();
      reader.onload = () => { field.signatureImage = reader.result; renderBlocksForPage(); };
      reader.readAsDataURL(fileInput.files[0]);
    });
    sigUpload.appendChild(fileInput);
    sigUpload.addEventListener("pointerdown", e => e.stopPropagation());
    if (!field.hiddenRows.includes("signatureImage")) sigRow.appendChild(sigUpload);
    if (!field.hiddenRows.includes("committee")) sigRow.appendChild(textInput(field, "committee", "ตำแหน่งกรรมการ/บทบาท", "committee-input"));
    sigRow.appendChild(deleteRowBtn(field, "signatureLine"));
    el.appendChild(sigRow);

    appendTextRow(el, field, "signerName", "ชื่อ-นามสกุล");
    appendTextRow(el, field, "position", "ตำแหน่ง");
    appendTextRow(el, field, "organization", "หน่วยงาน");
    appendTextRow(el, field, "signedDate", "วันที่");

    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "rp-remove"; remove.textContent = "×"; remove.title = "ลบบล็อก";
    remove.addEventListener("click", e => { e.stopPropagation(); removeBlock(field.id); });
    el.appendChild(remove);

    const resize = document.createElement("span");
    resize.className = "rp-resize";
    resize.addEventListener("pointerdown", e => startResize(e, field, el));
    el.appendChild(resize);

    el.addEventListener("pointerdown", e => startDrag(e, field, el));
    container.appendChild(el);
  }

  function startDrag(e, field, el) {
    if (e.target.closest("input,label,button,.rp-resize")) return;
    if (state.previewMode) return;
    e.preventDefault();
    selectBlock(field.id);
    el.setPointerCapture(e.pointerId);
    const page = $("#docPage");
    const sx = e.clientX, sy = e.clientY, ox = field.x, oy = field.y;
    const move = ev => {
      field.x = clamp(ox + ev.clientX - sx, 0, page.clientWidth - field.w);
      field.y = clamp(oy + ev.clientY - sy, 0, page.clientHeight - field.h);
      el.style.left = `${field.x}px`; el.style.top = `${field.y}px`;
      $("#coordsReadout").textContent = `x:${field.x.toFixed(0)} y:${field.y.toFixed(0)} กว้าง:${field.w.toFixed(0)} สูง:${field.h.toFixed(0)} px`;
    };
    const end = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", end); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerup", end);
  }

  function startResize(e, field, el) {
    e.stopPropagation(); e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const page = $("#docPage");
    const sx = e.clientX, sy = e.clientY, ow = field.w, oh = field.h;
    const move = ev => {
      field.w = clamp(ow + ev.clientX - sx, 120, page.clientWidth - field.x);
      field.h = clamp(oh + ev.clientY - sy, 70, page.clientHeight - field.y);
      el.style.width = `${field.w}px`; el.style.height = `${field.h}px`;
      $("#coordsReadout").textContent = `x:${field.x.toFixed(0)} y:${field.y.toFixed(0)} กว้าง:${field.w.toFixed(0)} สูง:${field.h.toFixed(0)} px`;
    };
    const end = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", end); };
    handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", end);
  }

  function selectBlock(id) {
    state.selectedBlockId = id;
    $$(".rp-block", $("#docPage")).forEach(el => el.classList.toggle("selected", el.dataset.id === id));
    renderBlockEditor();
    renderBlockListPanel();
  }

  function removeBlock(id) {
    state.blocks = state.blocks.filter(b => b.id !== id);
    if (state.selectedBlockId === id) state.selectedBlockId = null;
    renderBlocksForPage();
    renderBlockEditor();
    renderBlockListPanel();
  }

  function renderBlockEditor() {
    const field = selectedBlock();
    const editor = $("#blockEditor");
    if (!field) { editor.style.display = "none"; return; }
    editor.style.display = "block";

    const editGroupSel = $("#editGroupSelect");
    const editMemberSel = $("#editMemberSelect");
    editGroupSel.innerHTML = state.groups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join("");
    editGroupSel.value = field.groupId;
    const g = findGroup(editGroupSel.value);
    editMemberSel.innerHTML = (g ? g.members : []).map(m => `<option value="${m.id}">${m.order}. ${escapeHtml(m.empName)} (${m.roleName})</option>`).join("");
    editMemberSel.value = field.memberId;

    $("#actionReview").checked = !!field.reviewAction;
    $("#actionSign").checked = !!field.signAction;
    $("#actionApprove").checked = !!field.approveAction;

    const m = findMember(g, field.memberId);
    $("#selectedBlockInfo").textContent = `${g ? g.name : "?"} · ${m ? m.empName : "?"} · หน้า ${field.page}`;
  }

  function renderBlockListPanel() {
    const panel = $("#blockListPanel");
    $("#blockCount").textContent = state.blocks.length;
    if (state.blocks.length === 0) {
      panel.innerHTML = `<p class="empty-msg" style="padding:0;font-style:italic">ยังไม่มีบล็อก</p>`;
      return;
    }
    panel.innerHTML = state.blocks.map(b => {
      const g = findGroup(b.groupId);
      const m = findMember(g, b.memberId);
      const color = roleColorForGroup(g);
      return `
        <div class="block-row ${b.id === state.selectedBlockId ? "selected" : ""}" data-bid="${b.id}">
          <div class="group-dot" style="background:${color}"></div>
          <span class="block-row-name">${m ? escapeHtml(m.empName) : "?"}</span>
          <span class="block-row-page">หน้า ${b.page}</span>
        </div>`;
    }).join("");
    $$(".block-row", panel).forEach(row => {
      row.addEventListener("click", async () => {
        const bid = row.dataset.bid;
        const block = state.blocks.find(b => b.id === bid);
        if (block && block.page !== state.currentPage) await showPage(block.page);
        selectBlock(bid);
      });
    });
  }

  function togglePreviewMode() {
    state.previewMode = !state.previewMode;
    $("#blockWorkspace").classList.toggle("preview", state.previewMode);
    $("#previewToggleBtn").textContent = state.previewMode ? "✏️ กลับไปแก้ไข" : "👁️ ดูตัวอย่างจริง";
  }

  function initBlockStepIfNeeded() {
    refreshBlockGroupOptions();
    renderBlockListPanel();
    if (!blockStepInited) {
      blockStepInited = true;
      renderFallbackPage();

      $("#pdfUpload").addEventListener("change", e => { if (e.target.files[0]) loadPdfFile(e.target.files[0]); });
      $("#prevPageBtn").addEventListener("click", () => showPage(state.currentPage - 1));
      $("#nextPageBtn").addEventListener("click", () => showPage(state.currentPage + 1));
      $("#previewToggleBtn").addEventListener("click", togglePreviewMode);
      $("#clearBlocksBtn").addEventListener("click", () => {
        if (state.blocks.length === 0) return;
        if (confirm("ล้างบล็อกผู้เกี่ยวข้องทั้งหมดหรือไม่?")) {
          state.blocks = [];
          state.selectedBlockId = null;
          renderBlocksForPage(); renderBlockEditor(); renderBlockListPanel();
        }
      });

      $("#blockGroupSelect").addEventListener("change", refreshBlockMemberOptions);
      $("#blockMemberSelect").addEventListener("change", () => {
        $("#addBlockBtn").disabled = !($("#blockGroupSelect").value && $("#blockMemberSelect").value);
      });
      $("#addBlockBtn").addEventListener("click", addBlock);

      $("#editGroupSelect").addEventListener("change", () => {
        const field = selectedBlock(); if (!field) return;
        const g = findGroup($("#editGroupSelect").value);
        field.groupId = g ? g.id : "";
        const firstMember = g && g.members[0];
        field.memberId = firstMember ? firstMember.id : "";
        if (firstMember) { field.committee = firstMember.roleName; field.signerName = `(${firstMember.empName})`; field.position = firstMember.position || ""; field.organization = firstMember.dept || ""; }
        renderBlocksForPage(); renderBlockEditor(); renderBlockListPanel();
      });
      $("#editMemberSelect").addEventListener("change", () => {
        const field = selectedBlock(); if (!field) return;
        const g = findGroup(field.groupId);
        const m = findMember(g, $("#editMemberSelect").value);
        if (!m) return;
        field.memberId = m.id; field.committee = m.roleName; field.signerName = `(${m.empName})`; field.position = m.position || ""; field.organization = m.dept || "";
        renderBlocksForPage(); renderBlockEditor(); renderBlockListPanel();
      });
      $("#removeBlockBtn").addEventListener("click", () => { const f = selectedBlock(); if (f) removeBlock(f.id); });
      ["actionReview", "actionSign", "actionApprove"].forEach(id => {
        $(`#${id}`).addEventListener("change", () => {
          const field = selectedBlock(); if (!field) return;
          field.reviewAction = $("#actionReview").checked;
          field.signAction = $("#actionSign").checked;
          field.approveAction = $("#actionApprove").checked;
          renderBlocksForPage(); renderBlockEditor();
        });
      });

      $("#exportPdfBoxBtn").addEventListener("click", () => {
        $("#jsonOutput").value = JSON.stringify(buildPdfBoxPayload(), null, 2);
        $("#jsonDialog").showModal();
      });
      $("#closeJsonDialogBtn").addEventListener("click", () => $("#jsonDialog").close());
      $("#downloadJsonBtn").addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(buildPdfBoxPayload(), null, 2)], { type: "application/json;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pdfbox-involved-party-fields.json";
        a.click();
        URL.revokeObjectURL(a.href);
      });
    } else {
      renderBlocksForPage();
    }
  }

  function buildPdfBoxPayload() {
    return {
      savedAt: new Date().toISOString(),
      docType: state.config.docType,
      templateName: state.config.templateName,
      samplePdf: { fileName: state.pdfFileName || null, pageCount: state.totalPages },
      groups: state.groups.map(g => ({ id: g.id, name: g.name, members: g.members.map(m => ({ id: m.id, order: m.order, empName: m.empName, roleName: m.roleName })) })),
      involvedPartyFields: state.blocks.map(b => {
        const g = findGroup(b.groupId);
        const m = findMember(g, b.memberId);
        const size = state.pageSizes[b.page] || { displayWidth: FALLBACK_W, displayHeight: FALLBACK_H };
        return {
          id: b.id,
          page: b.page,
          groupId: b.groupId, groupName: g ? g.name : "",
          memberId: b.memberId, memberName: m ? m.empName : "",
          roleName: m ? m.roleName : "",
          xRatio: +(b.x / size.displayWidth).toFixed(5),
          yRatio: +(b.y / size.displayHeight).toFixed(5),
          widthRatio: +(b.w / size.displayWidth).toFixed(5),
          heightRatio: +(b.h / size.displayHeight).toFixed(5),
          pdfBoxAnchor: "top-left",
          fontName: b.fontName, fontSize: b.fontSize, hiddenRows: b.hiddenRows,
          actions: { review: !!b.reviewAction, sign: !!b.signAction, approve: !!b.approveAction },
          approval: b.approveAction && !b.hiddenRows.includes("approval") ? b.approval : null,
          signText: b.signAction && !b.hiddenRows.includes("signatureLine") ? b.signText : null,
          signatureImage: b.signAction && !b.hiddenRows.includes("signatureLine") && !b.hiddenRows.includes("signatureImage") ? b.signatureImage : null,
          committee: b.hiddenRows.includes("signatureLine") ? null : b.committee,
          signerName: b.hiddenRows.includes("signerName") ? null : b.signerName,
          position: b.hiddenRows.includes("position") ? null : b.position,
          organization: b.hiddenRows.includes("organization") ? null : b.organization,
          signedDate: b.hiddenRows.includes("signedDate") ? null : b.signedDate,
        };
      }),
    };
  }


  // ═══════════════════════════════════════════════════════════
  // STEP 3: PREVIEW + SAVE
  // ═══════════════════════════════════════════════════════════
  function renderPreview() {
    const c = state.config;
    $("#previewConfig").innerHTML = [
      ["ชนิดเอกสาร", c.docType], ["กลุ่มการจัดซื้อ", c.purchaseGroup],
      ["ชื่อ Template", c.templateName], ["สถานะ", c.status],
    ].map(([k, v]) => `<div class="preview-row"><span class="k">${k}</span><span class="v">${escapeHtml(v) || "—"}</span></div>`).join("");

    $("#previewBoxCount").textContent = state.blocks.length;
    $("#previewBoxes").innerHTML = state.blocks.length === 0
      ? `<p class="empty-msg" style="padding:0">ยังไม่มีบล็อก</p>`
      : state.blocks.map(b => {
          const g = state.groups.find(gr => gr.id === b.groupId);
          const m = g && g.members.find(mm => mm.id === b.memberId);
          const color = g ? roleColorForGroup(g) : "#ccc";
          const actions = [b.reviewAction && "ตรวจสอบ", b.signAction && "ลงนาม", b.approveAction && "อนุมัติ"].filter(Boolean).join(" · ") || "—";
          return `<div class="preview-box-row">
            <div class="group-dot" style="width:8px;height:8px;background:${color};margin-top:3px"></div>
            <span style="flex:1">${g ? escapeHtml(g.name) : "?"} — ${m ? escapeHtml(m.empName) : "?"}</span>
            <span style="color:var(--text-muted)">หน้า ${b.page} · ${actions}</span>
          </div>`;
        }).join("");

    $("#previewGroupCount").textContent = state.groups.length;
    $("#previewGroups").innerHTML = state.groups.map(g => `
      <div class="preview-group-block">
        <div class="preview-group-head">
          <div class="group-dot" style="background:${roleColorForGroup(g)}"></div>
          <span style="font-weight:700;font-size:13px">${escapeHtml(g.name)}</span>
        </div>
        ${g.members.map(m => `
          <div class="preview-member-row">
            <span style="flex:1;color:var(--text)">${escapeHtml(m.empName)}</span>
            <span class="badge" style="background:${m.roleColor}22;color:${m.roleColor};border:1px solid ${m.roleColor}44">${m.roleName}</span>
          </div>`).join("")}
      </div>
    `).join("");
  }

  function initStep3() {
    $("#saveBtn").addEventListener("click", () => {
      const btn = $("#saveBtn");
      btn.disabled = true;
      btn.textContent = "⏳ กำลังบันทึก...";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "✅ บันทึกแล้ว";
        $("#savedMsg").style.display = "block";
        $("#savedDetail").textContent = `Template ID: ${uid()} · ${new Date().toLocaleString("th-TH")}`;
      }, 1200);
    });

    $("#exportJsonBtn").addEventListener("click", () => {
      const data = { config: state.config, groups: state.groups, blocks: state.blocks, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `signature-template-${state.config.templateName || "unnamed"}.json`;
      a.click();
    });

    $("#exportPdfBtn").addEventListener("click", () => {
      alert("ฟีเจอร์ Export PDF พร้อมลายเซ็นจะเปิดใช้งานเมื่อเชื่อมต่อ Backend");
    });
  }

  // ═══════════════════════════════════════════════════════════
  // VIEW 2: DOCUMENT SIGNING LIST
  // ═══════════════════════════════════════════════════════════
  function initDocList() {
    $$(".list-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        state.listTab = tab.dataset.tab;
        $$(".list-tab").forEach(t => t.classList.toggle("active", t === tab));
        renderDocList();
      });
    });
    $("#docSearch").addEventListener("input", e => { state.search = e.target.value; renderDocList(); });
    $("#docTypeFilter").addEventListener("change", e => { state.typeFilter = e.target.value; renderDocList(); });
    renderDocList();
  }

  function filteredDocs() {
    return DOCS.filter(d => {
      if (state.listTab === "pending" && d.status !== "pending") return false;
      if (state.listTab === "done" && d.status !== "done") return false;
      if (state.typeFilter && d.type !== state.typeFilter) return false;
      if (state.search) {
        const q = state.search.trim().toLowerCase();
        const hay = `${d.no} ${d.requester} ${d.dept}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function initials(name) {
    const parts = name.replace(/^(นาย|นางสาว|นาง)/, "").trim();
    return parts.charAt(0) || "?";
  }

  function renderDocList() {
    $("#countAll").textContent = DOCS.length;
    $("#countPending").textContent = DOCS.filter(d => d.status === "pending").length;
    $("#countDone").textContent = DOCS.filter(d => d.status === "done").length;

    const rows = filteredDocs();
    const tbody = $("#docTableBody");
    $("#docEmptyMsg").style.display = rows.length === 0 ? "block" : "none";

    tbody.innerHTML = rows.map(d => {
      const pct = Math.round((d.signed / d.signers) * 100);
      const statusHtml = d.status === "pending"
        ? `<span class="status-chip pending">⏳ รอเซ็น</span>`
        : `<span class="status-chip done">✅ เซ็นเรียบร้อย</span>`;
      return `
        <tr>
          <td class="doc-no">${d.no}</td>
          <td><span class="doc-type-chip">${DOC_TYPE_LABEL[d.type]}</span></td>
          <td>${escapeHtml(d.dept)}</td>
          <td>${escapeHtml(d.requester)}</td>
          <td>${formatThaiDate(d.date)}</td>
          <td>
            <div class="signer-cell">
              ${d.current !== "-" ? `<span class="signer-avatar">${initials(d.current)}</span><span>${escapeHtml(d.current)}</span>` : `<span style="color:var(--text-light)">—</span>`}
            </div>
          </td>
          <td>
            <div class="progress-cell">
              <div class="progress-bar-track"><div class="progress-bar-fill ${pct === 100 ? "full" : ""}" style="width:${pct}%"></div></div>
              <span class="progress-label">${d.signed}/${d.signers}</span>
            </div>
          </td>
          <td>฿${d.amount.toLocaleString("th-TH")}</td>
          <td>${statusHtml}</td>
          <td><button class="row-action">ดูรายละเอียด</button></td>
        </tr>`;
    }).join("");
  }

  function formatThaiDate(iso) {
    const d = new Date(iso);
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  // ═══════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════
  document.addEventListener("DOMContentLoaded", () => {
    initMainMenu();
    initWizardNav();
    initStep0();
    initStep1();
    initStep3();
    initDocList();
    goToStep(0);
    renderGroups();
  });
})();
