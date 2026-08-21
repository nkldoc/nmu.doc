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
    { icon: "📌", title: "แสกน PDF & วาง Signature Box", subtitle: "อัปโหลด PDF และลากวางตำแหน่งกล่องลายเซ็น" },
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

  // ═══════════════════════════════════════════════════════════
  // BACKEND CONFIG — Spring Boot + PDFBox service
  // ═══════════════════════════════════════════════════════════
  const PDF_EXPORT_CONFIG = {
    // ปรับ URL นี้ให้ตรงกับ endpoint จริงของ service ที่ประมวลผลด้วย PDFBox
    // เช่น "/notif/api/pdf/export-signature-template" หรือ full URL ของ notif-server
    url: "/api/pdf/export-signature-template",
    method: "POST",
    timeoutMs: 60000, // PDFBox กับไฟล์หลายหน้าอาจใช้เวลา ปรับตามจริง
  };

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
    signatureBoxes: [],
    editingGroupId: null,
    // pdf canvas
    zoom: 1,
    placingMode: false,
    selectedGroupId: null,
    pageNum: 1,
    totalPages: 1,
    startPos: null,
    // list view
    listTab: "all",
    search: "",
    typeFilter: "",
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN MENU
  // ═══════════════════════════════════════════════════════════
  function initMainMenu() {
    $$(".menu-item").forEach(btn => {
      btn.addEventListener("click", () => {
        state.view = btn.dataset.view;
        $$(".menu-item").forEach(b => b.classList.toggle("active", b === btn));
        $$(".app-view").forEach(v => v.classList.remove("active"));
        $(`#view-${state.view}`).classList.add("active");
        if (state.view === "list") renderDocList();
      });
    });
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

    if (i === 2) initCanvasIfNeeded();
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
    if (state.selectedGroupId === gid) state.selectedGroupId = state.groups[0]?.id || null;
    renderGroups();
  }

  function addMember(gid, empId, roleId) {
    const emp = EMPLOYEES.find(e => e.id === empId);
    const role = ROLES.find(r => r.id === roleId);
    if (!emp || !role) return;
    const g = state.groups.find(g => g.id === gid);
    g.members.push({ id: uid(), empName: emp.name, roleName: role.name, roleColor: role.color, order: g.members.length + 1 });
    renderGroups();
  }

  function removeMember(gid, mid) {
    const g = state.groups.find(g => g.id === gid);
    g.members = g.members.filter(m => m.id !== mid);
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
  // STEP 2: PDF CANVAS + SIGNATURE BOX PLACEMENT
  // ═══════════════════════════════════════════════════════════
  let canvasInited = false;
  const CANVAS_W = 595, CANVAS_H = 842;

  function renderFakePDF() {
    const canvas = $("#pdfCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#f0f4f8"; ctx.fillRect(40, 40, CANVAS_W - 80, 80);
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
    ctx.strokeStyle = "#E2E6EA"; ctx.strokeRect(40, 340, CANVAS_W - 80, 200);
    ["ลำดับ", "รายการ", "จำนวน", "หน่วย", "ราคา/หน่วย", "รวม"].forEach((h, i) => {
      const x = 40 + i * ((CANVAS_W - 80) / 6);
      ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, 340, (CANVAS_W - 80) / 6, 24);
      ctx.strokeStyle = "#D1D5DB"; ctx.strokeRect(x, 340, (CANVAS_W - 80) / 6, 24);
      ctx.fillStyle = "#374151"; ctx.font = "bold 10px sans-serif";
      ctx.fillText(h, x + 4, 356);
    });
    ctx.fillStyle = "#9CA3AF"; ctx.font = "11px sans-serif";
    ctx.fillText("(ลากเพื่อวางกล่องลายเซ็น ด้านล่าง)", 60, 580);
    ctx.fillStyle = "#E5E7EB"; ctx.fillRect(40, 600, CANVAS_W - 80, 200);
    ctx.fillStyle = "#9CA3AF"; ctx.font = "italic 12px sans-serif";
    ctx.fillText("พื้นที่ลายเซ็น — ลากวางกล่องที่นี่", 180, 700);
  }

  function initCanvasIfNeeded() {
    if (canvasInited) { renderGroupSelector(); renderBoxOverlay(); return; }
    canvasInited = true;
    renderFakePDF();

    $("#pdfUpload").addEventListener("change", e => {
      // Real PDF rendering requires pdf.js which isn't bundled here; keep the mock preview.
      if (e.target.files[0]) renderFakePDF();
    });

    $("#placeModeBtn").addEventListener("click", () => {
      state.placingMode = !state.placingMode;
      $("#placeModeBtn").textContent = state.placingMode ? "⏹ หยุดวาง" : "✏️ วางกล่องลายเซ็น";
      $("#placeModeBtn").classList.toggle("btn-danger", state.placingMode);
      $("#placeModeBtn").classList.toggle("btn-ghost", !state.placingMode);
      $("#placeBanner").style.display = state.placingMode ? "block" : "none";
      $("#canvasContainer").classList.toggle("placing", state.placingMode);
    });

    $("#zoomIn").addEventListener("click", () => setZoom(Math.min(2, state.zoom + 0.1)));
    $("#zoomOut").addEventListener("click", () => setZoom(Math.max(0.5, state.zoom - 0.1)));

    const canvas = $("#pdfCanvas");
    canvas.addEventListener("mousedown", onCanvasDown);
    canvas.addEventListener("mousemove", onCanvasMove);
    canvas.addEventListener("mouseup", onCanvasUp);

    setZoom(1);
    renderGroupSelector();
    renderBoxOverlay();
  }

  function setZoom(z) {
    state.zoom = z;
    $("#pdfCanvas").style.transform = `scale(${z})`;
    $("#boxOverlay").style.width = (CANVAS_W * z) + "px";
    $("#boxOverlay").style.height = (CANVAS_H * z) + "px";
    $("#zoomLabel").textContent = Math.round(z * 100) + "%";
    renderBoxOverlay();
  }

  function getCanvasPos(e) {
    const rect = $("#pdfCanvas").getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / state.zoom),
      y: Math.round((e.clientY - rect.top) / state.zoom),
    };
  }

  function onCanvasDown(e) {
    if (!state.placingMode || !state.selectedGroupId) return;
    state.startPos = getCanvasPos(e);
  }
  function onCanvasMove(e) {
    if (!state.placingMode || !state.startPos) return;
    const pos = getCanvasPos(e);
    renderBoxOverlay({
      x: Math.min(state.startPos.x, pos.x), y: Math.min(state.startPos.y, pos.y),
      w: Math.abs(pos.x - state.startPos.x), h: Math.abs(pos.y - state.startPos.y),
    });
  }
  function onCanvasUp(e) {
    if (!state.placingMode || !state.startPos) return;
    const pos = getCanvasPos(e);
    const box = {
      id: uid(), groupId: state.selectedGroupId, page: state.pageNum,
      x: Math.min(state.startPos.x, pos.x), y: Math.min(state.startPos.y, pos.y),
      w: Math.max(Math.abs(pos.x - state.startPos.x), 80),
      h: Math.max(Math.abs(pos.y - state.startPos.y), 40),
    };
    if (box.w > 10 && box.h > 10) state.signatureBoxes.push(box);
    state.startPos = null;
    renderBoxOverlay();
    renderBoxList();
  }

  function renderGroupSelector() {
    const el = $("#groupSelector");
    if (!el) return;
    if (state.groups.length === 0) {
      el.innerHTML = `<p class="empty-msg">ยังไม่มีกลุ่ม — สร้างในขั้นตอนที่ 2</p>`;
      return;
    }
    if (!state.selectedGroupId) state.selectedGroupId = state.groups[0].id;
    el.innerHTML = state.groups.map(g => `
      <div class="group-pick-row ${state.selectedGroupId === g.id ? "selected" : ""}" data-gid="${g.id}" style="${state.selectedGroupId === g.id ? `background:${roleColorForGroup(g)}18` : ""}">
        <div class="group-dot" style="background:${roleColorForGroup(g)}"></div>
        <span class="group-pick-name" style="font-weight:${state.selectedGroupId === g.id ? 700 : 400}">${escapeHtml(g.name)}</span>
        <span class="group-pick-count">${g.members.length} คน</span>
      </div>
    `).join("");
    $$(".group-pick-row", el).forEach(row => {
      row.addEventListener("click", () => {
        state.selectedGroupId = row.dataset.gid;
        renderGroupSelector();
      });
    });
    renderBoxList();
  }

  // give each group a stable color derived from its id for visual distinction
  const GROUP_PALETTE = ["#1E6FCC", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];
  function roleColorForGroup(g) {
    const idx = state.groups.findIndex(x => x.id === g.id);
    return GROUP_PALETTE[idx % GROUP_PALETTE.length];
  }

  function renderBoxOverlay(preview) {
    const overlay = $("#boxOverlay");
    if (!overlay) return;
    const pageBoxes = state.signatureBoxes.filter(b => b.page === state.pageNum);
    let html = pageBoxes.map(box => {
      const g = state.groups.find(gr => gr.id === box.groupId);
      const color = g ? roleColorForGroup(g) : "#1E6FCC";
      return `
        <div class="sig-box" style="left:${box.x * state.zoom}px;top:${box.y * state.zoom}px;width:${box.w * state.zoom}px;height:${box.h * state.zoom}px;border-color:${color};background:${color}18">
          <span style="color:${color}">${g ? escapeHtml(g.name) : "?"}</span>
        </div>`;
    }).join("");
    if (preview) {
      html += `<div class="preview-box" style="left:${preview.x * state.zoom}px;top:${preview.y * state.zoom}px;width:${preview.w * state.zoom}px;height:${preview.h * state.zoom}px"></div>`;
    }
    overlay.innerHTML = html;
  }

  function renderBoxList() {
    const listEl = $("#boxList");
    const countEl = $("#boxCount");
    if (!listEl) return;
    countEl.textContent = state.signatureBoxes.length;
    if (state.signatureBoxes.length === 0) {
      listEl.innerHTML = `<p class="empty-msg" style="padding:0;font-style:italic">ยังไม่มีกล่อง</p>`;
      return;
    }
    listEl.innerHTML = state.signatureBoxes.map(box => {
      const g = state.groups.find(gr => gr.id === box.groupId);
      const color = g ? roleColorForGroup(g) : "#ccc";
      return `
        <div class="box-row" data-bid="${box.id}">
          <div class="group-dot" style="width:8px;height:8px;background:${color}"></div>
          <span class="box-row-name">${g ? escapeHtml(g.name) : "?"} — หน้า ${box.page}</span>
          <span class="box-row-dim">${box.w}×${box.h}</span>
          <button class="remove-x js-remove-box">✕</button>
        </div>`;
    }).join("");
    $$(".js-remove-box", listEl).forEach(btn => {
      btn.addEventListener("click", () => {
        const bid = btn.closest(".box-row").dataset.bid;
        state.signatureBoxes = state.signatureBoxes.filter(b => b.id !== bid);
        renderBoxOverlay();
        renderBoxList();
      });
    });
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

    $("#previewBoxCount").textContent = state.signatureBoxes.length;
    $("#previewBoxes").innerHTML = state.signatureBoxes.length === 0
      ? `<p class="empty-msg" style="padding:0">ยังไม่มีกล่อง</p>`
      : state.signatureBoxes.map(box => {
          const g = state.groups.find(gr => gr.id === box.groupId);
          const color = g ? roleColorForGroup(g) : "#ccc";
          return `<div class="preview-box-row">
            <div class="group-dot" style="width:8px;height:8px;background:${color};margin-top:3px"></div>
            <span style="flex:1">${g ? escapeHtml(g.name) : "?"}</span>
            <span style="color:var(--text-muted)">หน้า ${box.page}, (${box.x},${box.y}) ${box.w}×${box.h}px</span>
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

    $("#exportJsonFileBtn").addEventListener("click", () => {
      const data = buildExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `signature-template-${state.config.templateName || "unnamed"}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    $("#exportPdfBtn").addEventListener("click", () => {
      exportPdfToServer();
    });
  }

  // ═══════════════════════════════════════════════════════════
  // JSON MEMORIES — บันทึก/โหลด Template config ผ่าน localStorage
  // (บันทึกไว้ในเบราว์เซอร์ของเครื่องนี้ ไม่ผ่าน server)
  // ═══════════════════════════════════════════════════════════
  const JSON_MEMORY_KEY = "nmu_signature_template_memories_v1";

  function buildExportData() {
    return {
      config: state.config,
      groups: state.groups,
      signatureBoxes: state.signatureBoxes,
      exportedAt: new Date().toISOString(),
    };
  }

  function loadJsonMemories() {
    try {
      const raw = localStorage.getItem(JSON_MEMORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function saveJsonMemories(list) {
    try {
      localStorage.setItem(JSON_MEMORY_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      // เช่น localStorage เต็ม หรือถูกปิดใช้งานโดยเบราว์เซอร์
      console.error("บันทึก Memories ไม่สำเร็จ:", err);
      return false;
    }
  }

  function setJsonMemoryHint(msg, kind /* 'ok' | 'err' | '' */ = "") {
    const el = $("#jsonMemoryHint");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function renderJsonMemorySelect(selectId) {
    const sel = $("#jsonMemorySelect");
    const list = loadJsonMemories().sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
    sel.innerHTML = `<option value="">-- เลือก Template จาก Memories เพื่อใช้งาน --</option>` +
      list.map(item => {
        const dt = item.savedAt ? new Date(item.savedAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }) : "";
        return `<option value="${item.id}">${escapeHtml(item.name)} — ${dt} (${item.data.signatureBoxes.length} กล่อง)</option>`;
      }).join("");
    if (selectId) sel.value = selectId;
  }

  function saveCurrentToMemory() {
    const defaultName = state.config.templateName || `Template-${new Date().toLocaleDateString("th-TH")}`;
    const name = prompt("ตั้งชื่อ Template ที่จะบันทึกใน Memories:", defaultName);
    if (name === null) return; // ผู้ใช้กด cancel
    const trimmed = name.trim();
    if (!trimmed) {
      setJsonMemoryHint("กรุณาระบุชื่อ Template", "err");
      return;
    }

    const list = loadJsonMemories();
    const existing = list.find(item => item.name === trimmed);
    if (existing && !confirm(`มี Template ชื่อ "${trimmed}" อยู่แล้วใน Memories ต้องการเขียนทับหรือไม่?`)) {
      return;
    }

    const entry = {
      id: existing ? existing.id : uid(),
      name: trimmed,
      savedAt: new Date().toISOString(),
      data: buildExportData(),
    };

    const nextList = existing
      ? list.map(item => (item.id === existing.id ? entry : item))
      : [...list, entry];

    if (saveJsonMemories(nextList)) {
      renderJsonMemorySelect(entry.id);
      setJsonMemoryHint(`✅ บันทึก "${trimmed}" ไว้ใน Memories แล้ว (เก็บในเบราว์เซอร์นี้เท่านั้น)`, "ok");
    } else {
      setJsonMemoryHint("⚠️ บันทึกไม่สำเร็จ — พื้นที่จัดเก็บของเบราว์เซอร์อาจเต็มหรือถูกปิดใช้งาน", "err");
    }
  }

  // sync ค่าใน step 0 (input/select/สถานะ) ให้ตรงกับ state.config หลังโหลดจาก memory
  function syncStep0FromConfig() {
    const c = state.config;
    $("#docType").value = c.docType || "";
    $("#purchaseGroup").value = c.purchaseGroup || "";
    $("#templateName").value = c.templateName || "";
    $("#description").value = c.description || "";
    $$(".status-btn").forEach(b => b.classList.toggle("active", b.dataset.status === c.status));
  }

  function loadMemoryIntoState(id) {
    const list = loadJsonMemories();
    const entry = list.find(item => item.id === id);
    if (!entry) return;

    // deep clone กันไม่ให้ mutate ข้อมูลใน localStorage โดยตรง
    const data = JSON.parse(JSON.stringify(entry.data));
    state.config = data.config || state.config;
    state.groups = data.groups || [];
    state.signatureBoxes = data.signatureBoxes || [];
    state.selectedGroupId = state.groups[0]?.id || null;
    state.editingGroupId = null;

    // sync UI ทุกส่วนที่ผูกกับ state
    syncStep0FromConfig();
    renderGroups();
    if ($("#boxOverlay")) {
      renderBoxOverlay();
      renderBoxList();
    }
    if (typeof renderGroupSelector === "function" && $("#groupSelector")) renderGroupSelector();
    renderPreview();

    setJsonMemoryHint(`✅ โหลด "${entry.name}" มาใช้งานแล้ว`, "ok");
  }

  function deleteSelectedMemory() {
    const sel = $("#jsonMemorySelect");
    const id = sel.value;
    if (!id) {
      setJsonMemoryHint("กรุณาเลือก Template ที่ต้องการลบก่อน", "err");
      return;
    }
    const list = loadJsonMemories();
    const entry = list.find(item => item.id === id);
    if (!entry) return;
    if (!confirm(`ลบ Template "${entry.name}" ออกจาก Memories?`)) return;

    saveJsonMemories(list.filter(item => item.id !== id));
    renderJsonMemorySelect();
    setJsonMemoryHint(`🗑️ ลบ "${entry.name}" แล้ว`, "ok");
  }

  function initJsonMemories() {
    renderJsonMemorySelect();

    $("#exportJsonMemoryBtn").addEventListener("click", saveCurrentToMemory);
    $("#jsonMemoryDeleteBtn").addEventListener("click", deleteSelectedMemory);

    // เลือกจาก combo แล้วโหลดมาใช้งานทันที
    $("#jsonMemorySelect").addEventListener("change", (e) => {
      const id = e.target.value;
      if (id) loadMemoryIntoState(id);
      else setJsonMemoryHint("");
    });
  }

  // ═══════════════════════════════════════════════════════════
  // PDF EXPORT — POST JSON to PDFBox (Java) backend with progress UI
  // ═══════════════════════════════════════════════════════════
  let activeExportXhr = null;

  function setPdfStage(stageName, status /* 'active' | 'done' | 'error' */) {
    const li = $(`#pdfStageList li[data-stage="${stageName}"]`);
    if (!li) return;
    if (status === "active") {
      li.classList.add("active");
      li.classList.remove("done", "error");
    } else if (status === "done") {
      li.classList.remove("active", "error");
      li.classList.add("done");
    } else if (status === "error") {
      li.classList.remove("active", "done");
      li.classList.add("error");
    }
  }

  function setPdfProgress(pct, label, mode /* 'normal' | 'indeterminate' | 'error' | 'success' */ = "normal") {
    const fill = $("#pdfProgressFill");
    fill.classList.remove("indeterminate", "error", "success");
    if (mode === "indeterminate") {
      fill.classList.add("indeterminate");
      $("#pdfProgressPct").textContent = "";
    } else {
      fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
      $("#pdfProgressPct").textContent = `${Math.round(pct)}%`;
      if (mode === "error") fill.classList.add("error");
      if (mode === "success") fill.classList.add("success");
    }
    if (label) $("#pdfProgressStatus").textContent = label;
  }

  function resetPdfModal() {
    $$("#pdfStageList li").forEach(li => li.classList.remove("active", "done", "error"));
    setPdfProgress(0, "กำลังเตรียมข้อมูล...", "normal");
    $("#pdfModalIcon").textContent = "📄";
    $("#pdfModalTitle").textContent = "กำลังสร้างไฟล์ PDF";
    $("#pdfModalSub").textContent = "โปรดรอสักครู่ ระบบกำลังประมวลผลบน Server";
    $("#pdfModalClose").style.display = "none";
    $("#pdfRetryBtn").style.display = "none";
    $("#pdfCancelBtn").style.display = "inline-flex";
    $("#pdfCancelBtn").textContent = "ยกเลิก";
  }

  function openPdfModal() {
    resetPdfModal();
    $("#pdfExportModal").style.display = "flex";
  }

  function closePdfModal() {
    $("#pdfExportModal").style.display = "none";
  }

  function showPdfError(message) {
    setPdfProgress(100, message || "เกิดข้อผิดพลาด", "error");
    $("#pdfModalIcon").textContent = "⚠️";
    $("#pdfModalTitle").textContent = "สร้างไฟล์ PDF ไม่สำเร็จ";
    $("#pdfModalSub").textContent = message || "กรุณาลองใหม่อีกครั้ง";
    $("#pdfModalClose").style.display = "inline-flex";
    $("#pdfCancelBtn").style.display = "none";
    $("#pdfRetryBtn").style.display = "inline-flex";
  }

  function showPdfSuccess(filename) {
    setPdfProgress(100, "เสร็จสิ้น", "success");
    $("#pdfModalIcon").textContent = "✅";
    $("#pdfModalTitle").textContent = "สร้างไฟล์ PDF สำเร็จ";
    $("#pdfModalSub").textContent = filename ? `ดาวน์โหลดไฟล์ ${filename} แล้ว` : "ดาวน์โหลดไฟล์เรียบร้อยแล้ว";
    $("#pdfModalClose").style.display = "inline-flex";
    $("#pdfCancelBtn").style.display = "none";
    $("#pdfRetryBtn").style.display = "none";
  }

  function exportPdfToServer() {
    if (state.signatureBoxes.length === 0) {
      alert("กรุณาวางกล่องลายเซ็นอย่างน้อย 1 ตำแหน่งก่อน Export PDF");
      return;
    }

    // Payload ส่งให้ backend (Spring Boot) เพื่อใช้ PDFBox วางตำแหน่ง signature field ลงบน PDF ต้นฉบับ
    const payload = {
      config: state.config,
      groups: state.groups,
      signatureBoxes: state.signatureBoxes,
      exportedAt: new Date().toISOString(),
    };
    const jsonBody = JSON.stringify(payload);
    const filename = `${state.config.templateName || "signature-template"}.pdf`;

    openPdfModal();
    setPdfStage("prepare", "active");
    setPdfProgress(4, "กำลังเตรียมข้อมูล JSON...");

    setTimeout(() => {
      setPdfStage("prepare", "done");
      sendExportRequest(jsonBody, filename);
    }, 250);
  }

  function sendExportRequest(jsonBody, filename) {
    const xhr = new XMLHttpRequest();
    activeExportXhr = xhr;

    xhr.open(PDF_EXPORT_CONFIG.method, PDF_EXPORT_CONFIG.url, true);
    xhr.responseType = "blob";
    xhr.timeout = PDF_EXPORT_CONFIG.timeoutMs;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/pdf, application/json");

    let uploadDone = false;

    // ── Upload phase (0–35%): ส่ง JSON config/signatureBoxes ไปยัง server ──
    xhr.upload.onprogress = (e) => {
      setPdfStage("upload", "active");
      const pct = e.lengthComputable ? (e.loaded / e.total) * 35 : 20;
      setPdfProgress(pct, "กำลังส่งข้อมูลไปยัง Server...");
    };
    xhr.upload.onload = () => {
      uploadDone = true;
      setPdfStage("upload", "done");
      setPdfStage("process", "active");
      // ช่วงนี้ server กำลังรัน PDFBox (วาง signature field, วาด box ต่างๆ) — ไม่มี progress ที่แน่นอน
      setPdfProgress(0, "กำลังประมวลผล PDF ด้วย PDFBox (Java)...", "indeterminate");
    };

    // ── Download phase (server กำลังส่ง PDF กลับมา) ──
    xhr.onprogress = (e) => {
      if (!uploadDone) return; // ยังอยู่ช่วง upload ใหญ่ (กรณี browser รวม event)
      setPdfStage("process", "done");
      setPdfStage("download", "active");
      if (e.lengthComputable) {
        const pct = 65 + (e.loaded / e.total) * 30; // 65–95%
        setPdfProgress(pct, "กำลังดาวน์โหลดไฟล์ PDF...");
      } else {
        setPdfProgress(0, "กำลังดาวน์โหลดไฟล์ PDF...", "indeterminate");
      }
    };

    xhr.onload = () => {
      activeExportXhr = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        setPdfStage("download", "done");
        setPdfProgress(98, "กำลังบันทึกไฟล์ลงเครื่อง...");

        const blob = xhr.response instanceof Blob
          ? xhr.response
          : new Blob([xhr.response], { type: "application/pdf" });

        // ดึงชื่อไฟล์จาก header ถ้า server ระบุมา (Content-Disposition)
        let finalName = filename;
        const disposition = xhr.getResponseHeader("Content-Disposition");
        if (disposition) {
          const match = /filename\*?=(?:UTF-8'')?"?([^;"]+)"?/i.exec(disposition);
          if (match && match[1]) finalName = decodeURIComponent(match[1]);
        }

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = finalName;
        a.click();
        URL.revokeObjectURL(a.href);

        showPdfSuccess(finalName);
      } else {
        handleExportFailure(xhr);
      }
    };

    xhr.onerror = () => {
      activeExportXhr = null;
      setPdfStage("upload", uploadDone ? "done" : "error");
      setPdfStage("process", "error");
      showPdfError("เชื่อมต่อ Server ไม่สำเร็จ กรุณาตรวจสอบเครือข่ายหรือสถานะ Server");
    };

    xhr.ontimeout = () => {
      activeExportXhr = null;
      setPdfStage("process", "error");
      showPdfError("การประมวลผลใช้เวลานานเกินกำหนด (timeout) กรุณาลองใหม่อีกครั้ง");
    };

    xhr.onabort = () => {
      activeExportXhr = null;
      closePdfModal();
    };

    xhr.send(jsonBody);

    // เก็บ context ไว้ retry
    sendExportRequest._lastArgs = [jsonBody, filename];
  }

  function handleExportFailure(xhr) {
    setPdfStage("process", "error");
    setPdfStage("download", "error");

    // พยายามอ่าน error message จาก server (ถ้าตอบกลับเป็น JSON error แทน PDF)
    if (xhr.response instanceof Blob && xhr.response.type.indexOf("json") !== -1) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const err = JSON.parse(reader.result);
          showPdfError(err.message || `Server ตอบกลับผิดพลาด (HTTP ${xhr.status})`);
        } catch {
          showPdfError(`Server ตอบกลับผิดพลาด (HTTP ${xhr.status})`);
        }
      };
      reader.readAsText(xhr.response);
    } else {
      showPdfError(`Server ตอบกลับผิดพลาด (HTTP ${xhr.status})`);
    }
  }

  function initPdfExportModal() {
    $("#pdfCancelBtn").addEventListener("click", () => {
      if (activeExportXhr) activeExportXhr.abort();
      else closePdfModal();
    });
    $("#pdfModalClose").addEventListener("click", closePdfModal);
    $("#pdfRetryBtn").addEventListener("click", () => {
      exportPdfToServer();
    });
    // ปิด modal เมื่อคลิกพื้นหลัง หลังจากเสร็จ/error แล้วเท่านั้น (ไม่ปิดระหว่างกำลังประมวลผล)
    $("#pdfExportModal").addEventListener("click", (e) => {
      if (e.target.id === "pdfExportModal" && !activeExportXhr && $("#pdfModalClose").style.display !== "none") {
        closePdfModal();
      }
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
    initJsonMemories();
    initPdfExportModal();
    initDocList();
    goToStep(0);
    renderGroups();
  });
})();
