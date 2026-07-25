// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  step: 0,
  config: { docType: "PR - ใบขอซื้อ", purchaseGroup: "", templateName: "", description: "", status: "Draft" },
  groups: [],
  signatureBoxes: [],
  zoom: 1.0,
  pageNum: 1,
  totalPages: 1,
  placingMode: false,
  startPos: null,
  selectedGroupId: null,
};

const ROLES = [
  { id: "r1", name: "ผู้จัดทำ",    color: "#3B82F6" },
  { id: "r2", name: "ผู้ตรวจสอบ",  color: "#8B5CF6" },
  { id: "r3", name: "ผู้อนุมัติ",   color: "#10B981" },
  { id: "r4", name: "ผู้รับทราบ",   color: "#F59E0B" },
];

const EMPLOYEES = [
  { id: "e1", name: "นายสมชาย ใจดี",       dept: "จัดซื้อ" },
  { id: "e2", name: "นางสาวสมหญิง รักดี",   dept: "จัดซื้อ" },
  { id: "e3", name: "นายวิชัย มานะ",         dept: "บัญชี"  },
  { id: "e4", name: "นางสาวอรุณี สวัสดี",    dept: "บริหาร" },
  { id: "e5", name: "นายประสิทธิ์ ดีงาม",    dept: "จัดซื้อ" },
];

const STEPS = [
  { icon: "📄", title: "Template ชนิดเอกสาร",       subtitle: "กำหนด document type และ purchase group" },
  { icon: "👥", title: "กลุ่มผู้ลงนาม",               subtitle: "สร้างกลุ่มและกำหนด role ของแต่ละคน" },
  { icon: "📌", title: "แสกน PDF & วาง Signature Box", subtitle: "อัปโหลด PDF และลากวางตำแหน่งกล่องลายเซ็น" },
  { icon: "💾", title: "ตรวจสอบและบันทึก",            subtitle: "Preview และ save template" },
];

const uid = () => Math.random().toString(36).slice(2, 8);

// ─── Navigation ───────────────────────────────────────────────────────────────
function goToStep(n) {
  state.step = Math.max(0, Math.min(3, n));

  // panels
  document.querySelectorAll(".step-panel").forEach((p, i) => {
    p.classList.toggle("active", i === state.step);
  });

  // step bar items
  document.querySelectorAll(".step-item").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i === state.step) el.classList.add("active");
    else if (i < state.step) {
      el.classList.add("done");
      el.querySelector(".step-num").textContent = "✓";
    } else {
      el.querySelector(".step-num").textContent = i + 1;
    }
  });

  // tab buttons
  document.querySelectorAll(".tab-btn").forEach((b, i) =>
    b.classList.toggle("active", i === state.step)
  );

  // section header
  document.getElementById("sectionIcon").textContent = STEPS[state.step].icon;
  document.getElementById("sectionTitle").textContent = STEPS[state.step].title;
  document.getElementById("sectionSubtitle").textContent = STEPS[state.step].subtitle;

  // nav buttons
  document.getElementById("backBtn").disabled = state.step === 0;
  const nextBtn = document.getElementById("nextBtn");
  if (state.step === 3) { nextBtn.style.display = "none"; }
  else { nextBtn.style.display = ""; }

  // step-specific render
  if (state.step === 2) renderGroupSelector();
  if (state.step === 3) renderPreview();
}

document.getElementById("backBtn").addEventListener("click", () => goToStep(state.step - 1));
document.getElementById("nextBtn").addEventListener("click", () => goToStep(state.step + 1));
document.querySelectorAll(".tab-btn").forEach(b =>
  b.addEventListener("click", () => goToStep(+b.dataset.step))
);
document.querySelectorAll(".step-item").forEach(el =>
  el.addEventListener("click", () => goToStep(+el.dataset.step))
);

// ─── Step 0: Config ───────────────────────────────────────────────────────────
["docType", "purchaseGroup", "templateName", "description"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    state.config[id] = e.target.value;
  });
});

document.querySelectorAll(".status-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".status-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.config.status = btn.dataset.status;
  });
});

// ─── Step 1: Signature Groups ─────────────────────────────────────────────────
function renderGroups() {
  const list = document.getElementById("groupList");
  if (state.groups.length === 0) {
    list.innerHTML = '<p class="empty-msg">ยังไม่มีกลุ่มผู้ลงนาม — เพิ่มกลุ่มแรกด้านบน</p>';
    return;
  }
  list.innerHTML = state.groups.map((g, gi) => `
    <div class="group-card" id="gc-${g.id}">
      <div class="group-header">
        <div class="group-header-left">
          <span class="group-num">${gi + 1}</span>
          <span class="group-name">${g.name}</span>
          <span class="group-count">${g.members.length} คน</span>
        </div>
        <div class="group-header-btns">
          <button class="btn btn-subtle btn-sm" onclick="toggleEditGroup('${g.id}')">✏️ แก้ไข</button>
          <button class="btn btn-danger btn-sm" onclick="removeGroup('${g.id}')">ลบ</button>
        </div>
      </div>
      <div class="group-body">
        ${g.members.length === 0 && g._editing !== true
          ? '<p class="empty-msg">ยังไม่มีสมาชิก</p>'
          : g.members.map((m, mi) => `
            <div class="member-row">
              <span class="member-order" style="background:${m.roleColor}22;color:${m.roleColor}">${m.order}</span>
              <span class="member-name">${m.empName}</span>
              <span class="badge" style="background:${m.roleColor}22;color:${m.roleColor};border:1px solid ${m.roleColor}44">${m.roleName}</span>
              <button class="btn-remove-member" onclick="removeMember('${g.id}','${m.id}')">✕</button>
            </div>`).join("")}
        ${g._editing ? `
          <div class="add-member-form">
            <select id="selEmp-${g.id}">
              <option value="">-- เลือกพนักงาน --</option>
              ${EMPLOYEES.map(e => `<option value="${e.id}">${e.name} (${e.dept})</option>`).join("")}
            </select>
            <select id="selRole-${g.id}">
              <option value="">-- เลือก Role --</option>
              ${ROLES.map(r => `<option value="${r.id}">${r.name}</option>`).join("")}
            </select>
            <button class="btn btn-primary btn-sm" onclick="addMember('${g.id}')">เพิ่ม</button>
          </div>` : ""}
      </div>
    </div>`).join("");
}

function toggleEditGroup(gid) {
  state.groups = state.groups.map(g =>
    g.id === gid ? { ...g, _editing: !g._editing } : g
  );
  renderGroups();
}

function removeGroup(gid) {
  state.groups = state.groups.filter(g => g.id !== gid);
  state.signatureBoxes = state.signatureBoxes.filter(b => b.groupId !== gid);
  renderGroups();
}

function addMember(gid) {
  const empId = document.getElementById(`selEmp-${gid}`)?.value;
  const roleId = document.getElementById(`selRole-${gid}`)?.value;
  if (!empId || !roleId) return;
  const emp = EMPLOYEES.find(e => e.id === empId);
  const role = ROLES.find(r => r.id === roleId);
  state.groups = state.groups.map(g =>
    g.id === gid ? {
      ...g,
      members: [...g.members, {
        id: uid(), empId, roleId,
        empName: emp.name, roleName: role.name, roleColor: role.color,
        order: g.members.length + 1
      }]
    } : g
  );
  renderGroups();
}

function removeMember(gid, mid) {
  state.groups = state.groups.map(g =>
    g.id === gid ? { ...g, members: g.members.filter(m => m.id !== mid) } : g
  );
  renderGroups();
}

document.getElementById("addGroupBtn").addEventListener("click", () => {
  const input = document.getElementById("newGroupName");
  const name = input.value.trim();
  if (!name) return;
  // assign color from role palette cycling
  const colors = ["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#06B6D4"];
  const color = colors[state.groups.length % colors.length];
  state.groups.push({ id: uid(), name, members: [], color, _editing: false });
  input.value = "";
  renderGroups();
  if (state.step === 2) renderGroupSelector();
});

document.getElementById("newGroupName").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("addGroupBtn").click();
});

// ─── Step 2: PDF Scanner ──────────────────────────────────────────────────────
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const canvasW = 595, canvasH = 842;

function renderFakePDF() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = "#f0f4f8";
  ctx.fillRect(40, 40, canvasW - 80, 80);
  ctx.fillStyle = "#1E6FCC";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("ใบขอซื้อ (PR) - Purchase Request", 60, 85);
  ctx.fillStyle = "#6B7280";
  ctx.font = "12px sans-serif";
  ["เลขที่เอกสาร:", "วันที่:", "แผนก:", "ผู้ขอซื้อ:", "รายการสินค้า:"].forEach((t, i) => {
    ctx.fillText(t, 60, 160 + i * 30);
    ctx.strokeStyle = "#E2E6EA"; ctx.strokeRect(160, 145 + i * 30, 380, 22);
  });
  ctx.fillStyle = "#374151"; ctx.font = "bold 13px sans-serif";
  ctx.fillText("ตาราง รายการสินค้า", 60, 330);
  ctx.strokeStyle = "#E2E6EA"; ctx.strokeRect(40, 340, canvasW - 80, 200);
  ["ลำดับ","รายการ","จำนวน","หน่วย","ราคา/หน่วย","รวม"].forEach((h, i) => {
    const x = 40 + i * ((canvasW - 80) / 6);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, 340, (canvasW - 80) / 6, 24);
    ctx.strokeStyle = "#D1D5DB"; ctx.strokeRect(x, 340, (canvasW - 80) / 6, 24);
    ctx.fillStyle = "#374151"; ctx.font = "bold 10px sans-serif";
    ctx.fillText(h, x + 4, 356);
  });
  ctx.fillStyle = "#9CA3AF"; ctx.font = "11px sans-serif";
  ctx.fillText("(ลากเพื่อวางกล่องลายเซ็น ด้านล่าง)", 60, 580);
  ctx.fillStyle = "#E5E7EB"; ctx.fillRect(40, 600, canvasW - 80, 200);
  ctx.fillStyle = "#9CA3AF"; ctx.font = "italic 12px sans-serif";
  ctx.fillText("พื้นที่ลายเซ็น — ลากวางกล่องที่นี่", 180, 700);
}
renderFakePDF();

function applyZoom() {
  canvas.style.transform = `scale(${state.zoom})`;
  const overlay = document.getElementById("boxOverlay");
  overlay.style.width = (canvasW * state.zoom) + "px";
  overlay.style.height = (canvasH * state.zoom) + "px";
  document.getElementById("zoomLabel").textContent = Math.round(state.zoom * 100) + "%";
  renderBoxOverlay();
}

document.getElementById("zoomOut").addEventListener("click", () => {
  state.zoom = Math.max(0.5, +(state.zoom - 0.1).toFixed(1)); applyZoom();
});
document.getElementById("zoomIn").addEventListener("click", () => {
  state.zoom = Math.min(2.0, +(state.zoom + 0.1).toFixed(1)); applyZoom();
});

// PDF upload
document.getElementById("pdfUpload").addEventListener("change", function() {
  const file = this.files[0];
  if (!file) return;
  // Try pdf.js if available
  if (window.pdfjsLib) {
    const url = URL.createObjectURL(file);
    window.pdfjsLib.getDocument(url).promise.then(doc => {
      state.pdfDoc = doc;
      state.totalPages = doc.numPages;
      state.pageNum = 1;
      renderPdfPage();
      updatePageCtrl();
    });
  } else {
    // Fallback: show file name on fake PDF
    renderFakePDF();
    ctx.fillStyle = "#22875A"; ctx.font = "bold 13px sans-serif";
    ctx.fillText("ไฟล์: " + file.name, 60, 40);
  }
});

function renderPdfPage() {
  if (!state.pdfDoc) return;
  state.pdfDoc.getPage(state.pageNum).then(page => {
    const vp = page.getViewport({ scale: 1 });
    canvas.width = vp.width; canvas.height = vp.height;
    page.render({ canvasContext: ctx, viewport: vp });
    applyZoom();
  });
}

function updatePageCtrl() {
  const ctrl = document.getElementById("pageCtrl");
  ctrl.style.display = state.totalPages > 1 ? "flex" : "none";
  document.getElementById("pageLabel").textContent = `หน้า ${state.pageNum}/${state.totalPages}`;
  document.getElementById("prevPage").disabled = state.pageNum <= 1;
  document.getElementById("nextPage").disabled = state.pageNum >= state.totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (state.pageNum > 1) { state.pageNum--; renderPdfPage(); updatePageCtrl(); }
});
document.getElementById("nextPage").addEventListener("click", () => {
  if (state.pageNum < state.totalPages) { state.pageNum++; renderPdfPage(); updatePageCtrl(); }
});

// Place mode
document.getElementById("placeModeBtn").addEventListener("click", () => {
  state.placingMode = !state.placingMode;
  const btn = document.getElementById("placeModeBtn");
  const container = document.getElementById("canvasContainer");
  if (state.placingMode) {
    btn.textContent = "⏹ หยุดวาง";
    btn.className = "btn btn-danger btn-sm";
    container.classList.add("placing");
    document.getElementById("placeBanner").style.display = "block";
  } else {
    btn.textContent = "✏️ วางกล่องลายเซ็น";
    btn.className = "btn btn-ghost btn-sm";
    container.classList.remove("placing");
    document.getElementById("placeBanner").style.display = "none";
  }
});

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((e.clientX - rect.left) / state.zoom),
    y: Math.round((e.clientY - rect.top) / state.zoom),
  };
}

canvas.addEventListener("mousedown", e => {
  if (!state.placingMode || !state.selectedGroupId) return;
  state.startPos = getCanvasPos(e);
});

canvas.addEventListener("mousemove", e => {
  if (!state.placingMode || !state.startPos) return;
  const pos = getCanvasPos(e);
  // draw ghost
  let ghost = document.getElementById("previewGhost");
  if (!ghost) {
    ghost = document.createElement("div");
    ghost.id = "previewGhost";
    ghost.className = "preview-ghost";
    document.getElementById("boxOverlay").appendChild(ghost);
  }
  const x = Math.min(state.startPos.x, pos.x);
  const y = Math.min(state.startPos.y, pos.y);
  const w = Math.abs(pos.x - state.startPos.x);
  const h = Math.abs(pos.y - state.startPos.y);
  ghost.style.left = (x * state.zoom) + "px";
  ghost.style.top  = (y * state.zoom) + "px";
  ghost.style.width  = (w * state.zoom) + "px";
  ghost.style.height = (h * state.zoom) + "px";
});

canvas.addEventListener("mouseup", e => {
  if (!state.placingMode || !state.startPos) return;
  const pos = getCanvasPos(e);
  const box = {
    id: uid(),
    groupId: state.selectedGroupId,
    page: state.pageNum,
    x: Math.min(state.startPos.x, pos.x),
    y: Math.min(state.startPos.y, pos.y),
    w: Math.max(Math.abs(pos.x - state.startPos.x), 80),
    h: Math.max(Math.abs(pos.y - state.startPos.y), 40),
  };
  if (box.w > 10 && box.h > 10) {
    state.signatureBoxes.push(box);
    renderBoxOverlay();
    renderBoxList();
  }
  state.startPos = null;
  const ghost = document.getElementById("previewGhost");
  if (ghost) ghost.remove();
});

function renderBoxOverlay() {
  const overlay = document.getElementById("boxOverlay");
  const ghost = document.getElementById("previewGhost");
  overlay.innerHTML = "";
  if (ghost) overlay.appendChild(ghost);
  const pageBoxes = state.signatureBoxes.filter(b => b.page === state.pageNum);
  pageBoxes.forEach(box => {
    const g = state.groups.find(g => g.id === box.groupId);
    const color = g?.color || "#1E6FCC";
    const div = document.createElement("div");
    div.className = "sig-box";
    div.style.left   = (box.x * state.zoom) + "px";
    div.style.top    = (box.y * state.zoom) + "px";
    div.style.width  = (box.w * state.zoom) + "px";
    div.style.height = (box.h * state.zoom) + "px";
    div.style.borderColor = color;
    div.style.background  = color + "18";
    div.style.color = color;
    div.textContent = g?.name || "?";
    overlay.appendChild(div);
  });
}

function renderGroupSelector() {
  const sel = document.getElementById("groupSelector");
  if (state.groups.length === 0) {
    sel.innerHTML = '<p class="empty-msg">ยังไม่มีกลุ่ม — สร้างในขั้นตอนที่ 2</p>';
    return;
  }
  sel.innerHTML = state.groups.map(g => `
    <div class="group-sel-item ${state.selectedGroupId === g.id ? "selected" : ""}"
         style="${state.selectedGroupId === g.id ? `background:${g.color}18;border-color:${g.color}` : ""}"
         onclick="selectGroup('${g.id}')">
      <div class="group-sel-dot" style="background:${g.color}"></div>
      <span class="group-sel-name" style="font-weight:${state.selectedGroupId === g.id ? 700 : 400}">${g.name}</span>
      <span class="group-sel-count">${g.members.length} คน</span>
    </div>`).join("");
  if (!state.selectedGroupId && state.groups.length > 0) {
    state.selectedGroupId = state.groups[0].id;
    renderGroupSelector();
  }
}

function selectGroup(gid) {
  state.selectedGroupId = gid;
  renderGroupSelector();
}

function renderBoxList() {
  const list = document.getElementById("boxList");
  document.getElementById("boxCount").textContent = state.signatureBoxes.length;
  if (state.signatureBoxes.length === 0) {
    list.innerHTML = '<p class="empty-msg">ยังไม่มีกล่อง</p>';
    return;
  }
  list.innerHTML = state.signatureBoxes.map(box => {
    const g = state.groups.find(gr => gr.id === box.groupId);
    return `
      <div class="box-list-item">
        <div class="box-list-dot" style="background:${g?.color||'#ccc'}"></div>
        <span class="box-list-name">${g?.name||'?'} — หน้า ${box.page}</span>
        <span class="box-list-size">${box.w}×${box.h}</span>
        <button class="btn-remove-box" onclick="removeBox('${box.id}')">✕</button>
      </div>`;
  }).join("");
}

function removeBox(id) {
  state.signatureBoxes = state.signatureBoxes.filter(b => b.id !== id);
  renderBoxOverlay();
  renderBoxList();
}

// ─── Step 3: Preview & Save ───────────────────────────────────────────────────
function renderPreview() {
  // config
  const cfg = state.config;
  document.getElementById("previewConfig").innerHTML = [
    ["ชนิดเอกสาร", cfg.docType],
    ["กลุ่มการจัดซื้อ", cfg.purchaseGroup],
    ["ชื่อ Template", cfg.templateName],
    ["สถานะ", cfg.status],
  ].map(([k, v]) => `
    <div class="preview-row">
      <span>${k}</span>
      <span>${v || "—"}</span>
    </div>`).join("");

  // boxes
  document.getElementById("previewBoxCount").textContent = state.signatureBoxes.length;
  document.getElementById("previewBoxes").innerHTML = state.signatureBoxes.length === 0
    ? '<p class="empty-msg">ยังไม่มีกล่อง</p>'
    : state.signatureBoxes.map(box => {
        const g = state.groups.find(gr => gr.id === box.groupId);
        return `<div class="preview-row">
          <span style="display:flex;align-items:center;gap:6px">
            <div style="width:8px;height:8px;border-radius:50%;background:${g?.color||'#ccc'}"></div>
            ${g?.name||'?'}
          </span>
          <span>หน้า ${box.page}, (${box.x},${box.y}) ${box.w}×${box.h}px</span>
        </div>`;
      }).join("");

  // groups
  document.getElementById("previewGroupCount").textContent = state.groups.length;
  document.getElementById("previewGroups").innerHTML = state.groups.length === 0
    ? '<p class="empty-msg">ยังไม่มีกลุ่ม</p>'
    : state.groups.map(g => `
      <div class="preview-group-name">
        <div class="preview-group-dot" style="background:${g.color}"></div>
        ${g.name}
      </div>
      ${g.members.map(m => `
        <div class="preview-member">
          <span>${m.empName}</span>
          <span class="badge" style="background:${m.roleColor}22;color:${m.roleColor};border:1px solid ${m.roleColor}44">${m.roleName}</span>
        </div>`).join("")}`).join("");
}

document.getElementById("saveBtn").addEventListener("click", function() {
  this.textContent = "⏳ กำลังบันทึก...";
  this.disabled = true;

  const payload = {
    config: state.config,
    groups: state.groups.map(g => ({
      id: g.id, name: g.name,
      members: g.members.map(m => ({ id: m.id, empId: m.empId, roleId: m.roleId, order: m.order }))
    })),
    signatureBoxes: state.signatureBoxes,
  };

  // POST to Java Servlet
  fetch("SignatureTemplateServlet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(r => r.json())
    .then(data => {
      this.textContent = "✅ บันทึกแล้ว";
      const msg = document.getElementById("savedMsg");
      msg.style.display = "block";
      document.getElementById("savedDetail").textContent =
        `Template ID: ${data.templateId || uid()} · ${new Date().toLocaleString("th-TH")}`;
    })
    .catch(() => {
      // Offline fallback
      this.textContent = "✅ บันทึกแล้ว (Local)";
      const msg = document.getElementById("savedMsg");
      msg.style.display = "block";
      document.getElementById("savedDetail").textContent =
        `Template ID: ${uid()} · ${new Date().toLocaleString("th-TH")} (offline)`;
    });
});

document.getElementById("exportJsonBtn").addEventListener("click", () => {
  const data = {
    config: state.config,
    groups: state.groups,
    signatureBoxes: state.signatureBoxes,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `signature-template-${state.config.templateName || "unnamed"}.json`;
  a.click();
});

document.getElementById("exportPdfBtn").addEventListener("click", () => {
  alert("ฟีเจอร์ Export PDF พร้อมลายเซ็นจะเปิดใช้งานเมื่อเชื่อมต่อ Backend");
});

// ─── Init ─────────────────────────────────────────────────────────────────────
goToStep(0);
