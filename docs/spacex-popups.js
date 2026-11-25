/**
 * CustomUIV3 SpaceX HUD 弹窗 — 字段/交互参考 viewsvue/realtimev3
 * 尺寸分类（与 SpxPopupHost::computeGeometry / UI_POPUP_SIZE_* 对齐）：
 * - 登录/关于：LOGIN 默认 30%×50% 居中
 * - 机台提示：SYSMSG 默认 50%×50% 居中
 * - 检验单新建/编辑：SHEET 默认 40%×80% 居中
 * - 信息弹窗（指标/设备）：INFO 默认 60%×60%，按钮 X 对中
 * - 设置弹窗（调试/设置/疵点设置）：SETTINGS 默认 60%×100%，按钮 X 对中
 * - 工具类：铺满中间区；Left：疵点详情旁挂
 */
(function (global) {
  "use strict";

  /** 工具类：铺满中间区 */
  const CENTER_KEYS = new Set([
    "records",
    "defectAidedSelection",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
    "defectAdd",
    "defectEdit",
  ]);

  const MID_BAND_KEYS = new Set([
    "records",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
    "defectAidedSelection",
    "defectAdd",
    "defectEdit",
  ]);

  const TOOL_KEYS = new Set([
    "records",
    "defectAidedSelection",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
  ]);

  /** 系统信息：登录/关于/机台提示 → form → 50%×50% 居中 */
  const FORM_KEYS = new Set([
    "login",
    "about",
    "finishSheet",
    "noclothstop",
    "empty_sheet_stop",
    "noclothstop_clothfinish",
    "loop_stop",
    "cloth_finish_stop",
    "mid_sample_stop",
    "width_sample_stop",
    "colordiffalarm",
    "netWidthNeedStart",
    "netWidthNeedStop",
    "editNeedStop",
  ]);

  /** 检验单新建/编辑 → info → 60%×80% 居中 */
  const SHEET_EDITOR_KEYS = new Set([
    "erpNewSheet",
    "erpEditSheet",
  ]);

  /** 设置弹窗 → quick + SETTINGS → 60%×100% 中间高（含放卷 PLC） */
  const SETTINGS_KEYS = new Set([
    "debug",
    "systemSettings",
    "defectSettings",
    "unwind",
  ]);

  /** 兼容旧名：机台提示已并入 FORM_KEYS */
  const INFO_KEYS = FORM_KEYS;
  const LOGIN_SIZE_KEYS = new Set(["login"]);

  /** 定时 refresh 会冲掉输入与 tab / 滚动位置，这些弹窗跳过整页重建 */
  const NO_LIVE_REFRESH_KEYS = new Set([
    "login",
    "about",
    "systemSettings",
    "erpNewSheet",
    "erpEditSheet",
    "weight",
    "defectAdd",
    "defectEdit",
    "defectSettings",
    "records",
    "debug",
    "plc",
    "camera", // 含曝光输入；整页 refresh 会打断操作
    "light",
    "widthSensor",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
    "defectAidedSelection",
  ]);

  /** 疵点详情：贴在疵点列表左侧旁 */
  const LEFT_KEYS = new Set([
    "defectDetail",
  ]);

  const HEADER_OPACITY_KEYS = new Set([
    "plc",
    "camera",
    "light",
    "alarm",
    "widthSensor",
    "login",
    "systemSettings",
    "debug",
    "about",
  ]);

  const FULLSCREEN_OPACITY_KEYS = new Set([
    "records",
    "defectSettings",
    "defectDetail",
    "defectAdd",
    "defectEdit",
    "defectAidedSelection",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
  ]);

  const POPUP_OPACITY_DEFAULTS = {
    header: 100,
    bottom: 100,
    system: 100,
    fullscreen: 100,
  };

  function popupOpacityKind(key) {
    if (INFO_KEYS.has(key)) return "system";
    if (FULLSCREEN_OPACITY_KEYS.has(key)) return "fullscreen";
    if (HEADER_OPACITY_KEYS.has(key)) return "header";
    return "bottom";
  }

  function popupOpacityPercent(ctx, key) {
    // 全部弹窗强制不透明
    void ctx;
    void key;
    void popupOpacityKind;
    void POPUP_OPACITY_DEFAULTS;
    return 100;
  }

  function applyPopupOpacity(shell, ctx, key) {
    if (!shell) return;
    void ctx;
    void key;
    shell.style.opacity = "1";
  }

  const TITLES = {
    "zh-CN": {
      login: "登录",
      about: "关于",
      plc: "PLC 快设",
      camera: "相机",
      light: "光源",
      alarm: "报警",
      speed: "速度",
      width: "幅宽",
      length: "码长",
      colorDiff: "色差",
      tension: "张力",
      weight: "重量",
      unwind: "PLC 调试",
      cpu: "CPU · 最近1小时",
      gpu: "GPU · 最近1小时",
      systemSettings: "系统设置",
      erpNewSheet: "新建检验单",
      erpEditSheet: "检验单信息",
      fourPoints: "四分制扣分",
      records: "检验记录",
      defectSettings: "疵点设置",
      debug: "硬件调试",
      finishSheet: "结束检验",
      defectDetail: "疵点详情",
      defectAdd: "新增疵点",
      defectEdit: "编辑疵点",
      defectAidedSelection: "疵点辅助选择",
      artificalAddDefect: "疵点标注工具",
      artificalEditDefect: "疵点编辑",
      artificalAddWidth: "净幅宽测量",
      widthSensor: "幅宽传感器 · 布边设置",
      noclothstop: "警告",
      empty_sheet_stop: "警告",
      noclothstop_clothfinish: "警告",
      loop_stop: "警告",
      cloth_finish_stop: "警告",
      mid_sample_stop: "警告",
      width_sample_stop: "警告",
      netWidthNeedStart: "警告",
      netWidthNeedStop: "警告",
      editNeedStop: "警告",
      colordiffalarm: "颜色差异报警",
    },
    en: {
      login: "Login",
      about: "About",
      plc: "PLC Quick",
      camera: "Camera",
      light: "Light",
      alarm: "Alarm",
      speed: "Speed",
      width: "Width",
      length: "Length",
      colorDiff: "ΔE",
      tension: "Tension",
      weight: "Weight",
      unwind: "PLC Test",
      cpu: "CPU · Last 1h",
      gpu: "GPU · Last 1h",
      systemSettings: "System Settings",
      erpNewSheet: "New Sheet",
      erpEditSheet: "Sheet Info",
      fourPoints: "4-Point Score",
      records: "Records",
      defectSettings: "Defect Settings",
      debug: "Hardware Debug",
      finishSheet: "Finish Sheet",
      defectDetail: "Defect Detail",
      defectAdd: "Add Defect",
      defectEdit: "Edit Defect",
      defectAidedSelection: "Defect Aided Selection",
      artificalAddDefect: "Defect Annotation",
      artificalEditDefect: "Defect Edit",
      artificalAddWidth: "Net Width Measure",
      widthSensor: "Width Sensor · Edge",
      noclothstop: "Warning",
      empty_sheet_stop: "Warning",
      noclothstop_clothfinish: "Warning",
      loop_stop: "Warning",
      cloth_finish_stop: "Warning",
      mid_sample_stop: "Warning",
      width_sample_stop: "Warning",
      netWidthNeedStart: "Warning",
      netWidthNeedStop: "Warning",
      editNeedStop: "Warning",
      colordiffalarm: "Color Diff Alarm",
    },
  };

  function titleOf(key, lang) {
    const pack = TITLES[lang] || TITLES.en;
    return pack[key] || key;
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function kv(k, v) {
    return `<div class="spx-kv"><span class="spx-k">${k}</span><span class="spx-v">${v}</span></div>`;
  }

  function field(label, controlHtml) {
    return `<label class="spx-field"><span class="spx-k">${label}</span>${controlHtml}</label>`;
  }

  function section(title) {
    return `<div class="spx-section">${title}</div>`;
  }

  function ghostBtn(text, attrs) {
    return `<button type="button" class="ghost-btn" ${attrs || ""}>${text}</button>`;
  }

  function normalizeLoginUsers(list) {
    const users = Array.isArray(list) ? list : [];
    return users
      .map((u) => ({
        id: u && (u.id != null ? u.id : u.ID),
        name: String((u && (u.name || u.Name || u.inspectorNo || u.InspectorNo)) || "").trim(),
        inspectorNo: String((u && (u.inspectorNo || u.InspectorNo || "")) || "").trim(),
      }))
      .filter((u) => !!u.name);
  }

  function renderLoginUserChips(users, picked, zh) {
    return users
      .map((u) => {
        const n = u.name || "";
        if (!n) return "";
        const sel = n === picked ? " active" : "";
        const initial = String(n).trim().charAt(0).toUpperCase() || "?";
        const no = u.inspectorNo ? `<span class="spx-login-uno">${escapeAttr(u.inspectorNo)}</span>` : "";
        const idAttr = u.id != null && u.id !== "" ? String(u.id) : "";
        const delBtn = idAttr
          ? `<button type="button" class="spx-login-del" data-act="login-del-ask" data-id="${escapeAttr(idAttr)}" data-user="${escapeAttr(n)}" title="${zh ? "删除" : "Delete"}" aria-label="${zh ? "删除" : "Delete"}">×</button>`
          : "";
        return `<div class="spx-login-user${sel}" data-act="login-pick-user" data-user="${escapeAttr(n)}" data-id="${escapeAttr(idAttr)}" role="button" tabindex="0">
          ${delBtn}
          <span class="spx-login-avatar" aria-hidden="true">${escapeAttr(initial)}</span>
          <span class="spx-login-uname">${n}</span>
          ${no}
        </div>`;
      })
      .join("");
  }

  function renderLoginUserOptions(users, picked) {
    return users
      .map((u) => {
        const n = u.name || "";
        return `<option value="${escapeAttr(n)}" ${n === picked ? "selected" : ""}>${n}</option>`;
      })
      .join("");
  }

  function buildLogin(ctx) {
    // 触摸屏优先：管理员→密码；操作员→点选 + 新增；对接 /realtime/login|users/*
    const zh = ctx.lang === "zh-CN";
    let users = normalizeLoginUsers(ctx.users);
    if (!users.length) {
      users = [
        { name: "OPERATOR", inspectorNo: "001" },
        { name: "QA", inspectorNo: "002" },
        { name: "INSPECTOR", inspectorNo: "003" },
      ];
    }
    const curInspector = (ctx.sheet && ctx.sheet.userName) || "";
    const isAdminNow = !!(ctx.about && ctx.about.isAdmin);
    const curAuth = isAdminNow ? "admin" : "user";
    const picked = curInspector || (users[0] && users[0].name) || "";
    const status = isAdminNow
      ? `<div class="spx-login-status is-admin"><span class="spx-login-dot"></span>${zh ? "管理员已登录" : "Admin signed in"}</div>`
      : (curInspector
        ? `<div class="spx-login-status"><span class="spx-login-dot"></span>${zh ? `当前操作员 · ${curInspector}` : `Operator · ${curInspector}`}</div>`
        : `<div class="spx-login-status is-guest"><span class="spx-login-dot"></span>${zh ? "未登录 · 请选择身份" : "Guest · select identity"}</div>`);
    const logoutBtn = isAdminNow
      ? `<button type="button" class="ghost-btn spx-login-btn" data-act="login-logout">${zh ? "登出" : "Logout"}</button>`
      : "";
    return `
      <div class="spx-login ${curAuth === "admin" ? "is-admin" : "is-user"}" id="popLoginRoot">
        <header class="spx-login-hero">
          <div class="spx-login-mark" aria-hidden="true">B</div>
          <div class="spx-login-hero-text">
            <div class="spx-login-brand-row">
              <div class="spx-login-brand">Bullmer</div>
              ${status}
            </div>
            <div class="spx-login-sub">${zh ? "选择身份进入验布台" : "Select identity"}</div>
          </div>
        </header>
        <div class="spx-login-seg" role="group" aria-label="${zh ? "登录类型" : "Sign-in type"}">
          <button type="button" class="spx-login-seg-btn${curAuth !== "admin" ? " active" : ""}" data-act="login-type" data-type="user">${zh ? "操作员" : "Operator"}</button>
          <button type="button" class="spx-login-seg-btn${curAuth === "admin" ? " active" : ""}" data-act="login-type" data-type="admin">${zh ? "管理员" : "Admin"}</button>
        </div>
        <select id="popLoginType" hidden aria-hidden="true">
          <option value="user" ${curAuth !== "admin" ? "selected" : ""}>${zh ? "操作员" : "Operator"}</option>
          <option value="admin" ${curAuth === "admin" ? "selected" : ""}>${zh ? "管理员" : "Admin"}</option>
        </select>
        <div class="spx-login-main">
          <div id="popLoginUserRow" class="spx-login-pane spx-login-pane-user"${curAuth === "admin" ? " hidden" : ""}>
            <div class="spx-login-label-row">
              <div class="spx-login-label">${zh ? "选择操作员" : "Operator"}</div>
              <button type="button" class="ghost-btn compact spx-login-add-toggle" data-act="login-add-toggle">${zh ? "+ 新增" : "+ Add"}</button>
            </div>
            <div class="spx-login-users" id="popLoginUsers">${renderLoginUserChips(users, picked, zh)}</div>
            <select id="popLoginUser" hidden aria-hidden="true">${renderLoginUserOptions(users, picked)}</select>
            <div class="spx-login-add" id="popLoginAdd" hidden>
              <div class="spx-login-add-card">
                <div class="spx-login-add-title">${zh ? "新增操作员" : "New operator"}</div>
                <label class="spx-login-add-field">
                  <span>${zh ? "姓名" : "Name"}</span>
                  <input id="popLoginAddName" class="spx-login-add-inp" type="text" data-osk="1" placeholder="${zh ? "请输入姓名" : "Enter name"}" autocomplete="off" />
                </label>
                <label class="spx-login-add-field">
                  <span>${zh ? "工号" : "ID No."}</span>
                  <input id="popLoginAddNo" class="spx-login-add-inp" type="text" data-osk="1" inputmode="numeric" placeholder="${zh ? "请输入工号" : "Enter ID"}" autocomplete="off" />
                </label>
                <div class="spx-login-add-actions">
                  <button type="button" class="ghost-btn spx-login-add-cancel" data-act="login-add-cancel">${zh ? "取消" : "Cancel"}</button>
                  <button type="button" class="run-btn running spx-login-add-ok" data-act="login-add-user">${zh ? "确认添加" : "Add"}</button>
                </div>
              </div>
            </div>
            <div class="spx-login-confirm" id="popLoginConfirm" hidden>
              <div class="spx-login-confirm-card" role="dialog" aria-modal="true">
                <div class="spx-login-confirm-title">${zh ? "删除确认" : "Confirm delete"}</div>
                <div class="spx-login-confirm-msg" id="popLoginConfirmMsg"></div>
                <div class="spx-login-confirm-actions">
                  <button type="button" class="ghost-btn" data-act="login-del-cancel">${zh ? "取消" : "Cancel"}</button>
                  <button type="button" class="ghost-btn danger spx-login-del-ok" data-act="login-del-ok">${zh ? "删除" : "Delete"}</button>
                </div>
              </div>
            </div>
          </div>
          <div id="popLoginPassRow" class="spx-login-pane spx-login-pane-pass"${curAuth === "admin" ? "" : " hidden"}>
            <div class="spx-login-label">${zh ? "管理员密码" : "Admin password"}</div>
            <label class="spx-login-pass-wrap">
              <span class="spx-login-pass-ico" aria-hidden="true"></span>
              <input id="popLoginPass" class="spx-login-pass" type="password" placeholder="${zh ? "输入密码" : "Enter password"}" data-osk="1" inputmode="numeric" autocomplete="off" />
            </label>
          </div>
        </div>
        <div id="popLoginMsg" class="spx-login-msg" aria-live="polite"></div>
        <div class="spx-actions spx-login-actions">
          ${logoutBtn}
          <button type="button" class="run-btn running spx-login-ok" data-act="login-ok">${zh ? "确认登录" : "Sign in"}</button>
        </div>
      </div>`;
  }

  function escapeAboutText(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildAbout(ctx) {
    // 字段/按钮对齐 CustomUI/component/About（数据来自 /about/info + 原生快照）
    const zh = ctx.lang === "zh-CN";
    const info = (ctx.about && typeof ctx.about === "object") ? ctx.about : {};
    const dash = "-";
    const version = info.version || dash;
    const buildTime = info.buildTime || dash;
    const gitInfo = info.gitInfo || dash;
    const machineProject = info.machineProject != null ? String(info.machineProject) : dash;
    const machineSerial = info.machineSerial || dash;
    const erpFactory = info.erpFactory || dash;
    const installDate = info.installDate || dash;
    const testMode = Number(info.testMode || 0);
    const isAdmin = !!info.isAdmin;
    const notesRaw = String(info.notes || "").trim();
    const notes = notesRaw
      || (zh ? "暂无更新说明。" : "No release notes available.");

    let testBanner = "";
    if (testMode > 0) {
      const modeText = testMode === 1
        ? (zh ? "全模拟" : "Full Sim")
        : testMode === 2
          ? (zh ? "半模拟" : "Half Sim")
          : String(testMode);
      testBanner = `<div class="spx-about-test">!!! ${zh ? "测试模式" : "TEST MODE"} ${testMode}（${modeText}）!!!</div>`;
    }

    // 更新说明占满剩余高度、仅区内滚动；外层 .spx-about 不滚动
    const notesBlock = isAdmin
      ? `<div class="spx-about-notes-panel">
        ${section(zh ? "更新说明" : "Release Notes")}
        <div class="spx-about-notes">${escapeAboutText(notes)}</div>
      </div>`
      : `<div class="spx-about-notes-panel is-empty"></div>`;

    // 按钮序：先非管理员常用（主页/日志），再管理员工具
    const homeBtn = ghostBtn(zh ? "打开主页" : "Open Home", 'data-act="about-open-home"');
    const logBtn = ghostBtn(zh ? "打开日志" : "Open Log", 'data-act="about-log-export"');
    const actions = isAdmin
      ? `<div class="spx-about-footer">
        ${section(zh ? "管理工具" : "Admin Tools")}
        <div class="spx-about-btns spx-about-btns-row">
          ${homeBtn}
          ${logBtn}
          ${ghostBtn(zh ? "检查更新" : "Check Update", 'data-act="about-check-update"')}
          ${ghostBtn(zh ? "提交Bug" : "Report Bug", 'data-act="about-report-bug"')}
          ${ghostBtn(zh ? "执行统计" : "Run Stats", 'data-act="about-stat"')}
          ${ghostBtn(zh ? "上传数据" : "Upload Data", 'data-act="about-upload"')}
          ${ghostBtn(zh ? "PLC调试" : "PLC Debug", 'data-act="about-plc-debug"')}
          ${ghostBtn(zh ? "ERP厂家" : "ERP Folder", 'data-act="about-erp-factory"')}
        </div>
      </div>`
      : `<div class="spx-about-footer">
        ${section(zh ? "快捷入口" : "Quick Links")}
        <div class="spx-about-btns">${homeBtn}${logBtn}</div>
      </div>`;

    return `
      <div class="spx-about">
        <div class="spx-about-head">
          ${section(zh ? "版本信息" : "Version Info")}
          ${testBanner}
          ${kv("Version", escapeAboutText(version))}
          ${kv("BuildTime", escapeAboutText(`${buildTime}_${gitInfo}`))}
          ${kv("MachineProject", escapeAboutText(machineProject))}
          ${kv("MachineSerial", escapeAboutText(machineSerial))}
          ${kv("ERPFactory", escapeAboutText(erpFactory))}
          ${kv("InstallDate", escapeAboutText(installDate))}
        </div>
        ${notesBlock}
        ${actions}
      </div>`;
  }

  function plcCtrlRow(opts) {
    const presets = (opts.presets || [])
      .map(
        (v) =>
          `<button type="button" class="spx-plc-chip" data-act="plc-set" data-target="${opts.id}" data-v="${v}">${v}</button>`
      )
      .join("");
    const undoText = opts.undoText || "撤销";
    return `
      <tr data-plc-row="${opts.id}">
        <td class="spx-plc-label">${opts.label}</td>
        <td>
          <div class="spx-plc-slider">
            <button type="button" class="mini-btn danger" data-act="plc-step" data-target="${opts.id}" data-delta="${opts.decStep}">${opts.decText || "−"}</button>
            <input type="range" id="${opts.id}" min="${opts.min}" max="${opts.max}" step="${opts.step}"
              value="${opts.value}" data-act="plc-range" data-target="${opts.id}"
              data-base="${opts.value}" data-prev="${opts.value}" />
            <button type="button" class="mini-btn ok" data-act="plc-step" data-target="${opts.id}" data-delta="${opts.incStep}">${opts.incText || "+"}</button>
          </div>
        </td>
        <td class="spx-plc-val"><span id="${opts.id}Val">${opts.display}</span>${opts.unit ? ` ${opts.unit}` : ""}</td>
        <td><div class="spx-plc-presets">${presets}</div></td>
        <td class="spx-plc-undo-cell">
          <button type="button" class="spx-plc-undo" data-act="plc-undo" data-target="${opts.id}" disabled title="${undoText}">${undoText}</button>
        </td>
      </tr>`;
  }

  function buildPlc(ctx) {
    const zh = ctx.lang === "zh-CN";
    const s = ctx.state;
    const speed = (Number(s.speed || 0) / 60).toFixed(1);
    const fabric = Number.isFinite(s.fabricTension) ? s.fabricTension : Math.min(50, Math.round(s.tension || 0));
    const roll = Number.isFinite(s.rollTension) ? s.rollTension : 20;
    const swing = Number.isFinite(s.swingAmplitude) ? s.swingAmplitude : 50;
    const undoText = zh ? "撤销" : "Undo";
    return `
      ${section(zh ? "速度与张力" : "Speed & Tension")}
      <p class="spx-plc-hint">${zh ? "触摸调节即时生效；误触可点该行「撤销」恢复上一次数值" : "Changes apply live; use Undo on each row after a mis-touch"}</p>
      <table class="spx-plc-ctrl">
        ${plcCtrlRow({
          id: "popPlcSpeed",
          label: zh ? "电机速度" : "Motor",
          min: 0,
          max: 0.5,
          step: 0.1,
          value: speed,
          display: Number(speed).toFixed(1),
          unit: "m/s",
          presets: [0.1, 0.2, 0.3, 0.4, 0.5],
          decStep: -0.1,
          incStep: 0.1,
          undoText,
        })}
        ${plcCtrlRow({
          id: "popPlcFabric",
          label: zh ? "验布张力" : "Fabric",
          min: 0,
          max: 50,
          step: 1,
          value: fabric,
          display: String(Math.round(fabric)),
          unit: "N",
          presets: [10, 20, 30, 40, 50],
          decStep: -1,
          incStep: 1,
          undoText,
        })}
        ${plcCtrlRow({
          id: "popPlcRoll",
          label: zh ? "收卷张力" : "Roll",
          min: 0,
          max: 50,
          step: 1,
          value: roll,
          display: String(Math.round(roll)),
          unit: "N",
          presets: [10, 20, 30, 40, 50],
          decStep: -1,
          incStep: 1,
          undoText,
        })}
        ${plcCtrlRow({
          id: "popPlcSwing",
          label: zh ? "摆布幅度" : "Swing",
          min: 0,
          max: 100,
          step: 1,
          value: swing,
          display: String(Math.round(swing)),
          unit: "",
          presets: [20, 40, 60, 80, 100],
          decStep: -1,
          incStep: 1,
          decText: zh ? "窄" : "−",
          incText: zh ? "宽" : "+",
          undoText,
        })}
      </table>
      <div class="spx-plc-msg muted" id="popPlcMsg">${zh ? "调节后即时生效" : "Changes apply immediately"}</div>`;
  }

  function fmtPlc(v, digits) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    if (digits === "int") return String(Math.round(n));
    return n.toFixed(digits == null ? 2 : digits);
  }

  function plcAlarmText(st, zh) {
    const parts = [];
    const p = String((st && st.plcalarm) || "");
    const l = String((st && st.labelalarm) || "");
    const m = String((st && st.motoralarm) || "");
    const zero = "0000000000000000";
    if (p && p !== zero) parts.push(zh ? "PLC" : "PLC");
    if (l && l !== zero) parts.push(zh ? "贴标" : "Label");
    if (m && m !== zero) parts.push(zh ? "电机" : "Motor");
    return parts.length ? parts.join("/") : (zh ? "无报警" : "OK");
  }

  function plcTile(id, label, value, unit, warn) {
    return `<div class="spx-plct-tile${warn ? " warn" : ""}">
      <div class="cap">${label}</div>
      <div class="tile-body">
        <span class="val" data-plct="${id}">${value}</span>
        ${unit ? `<span class="unit">${unit}</span>` : ""}
      </div>
    </div>`;
  }

  function plcRoRow(id, label, value, unit) {
    return `<div class="spx-plct-form-row">
      <span class="spx-plct-form-k">${label}</span>
      <div class="spx-plct-unit readonly">
        <span class="unit-value" data-plct="${id}">${value}</span>
        ${unit ? `<span class="unit-suffix">${unit}</span>` : ""}
      </div>
    </div>`;
  }

  /** opts.step>0 时渲染 − / 输入 / +，点步进后立刻写入；单位独立成列避免挡数字 */
  function plcParam(id, label, value, unit, applyText, opts) {
    const step = opts && Number(opts.step) > 0 ? Number(opts.step) : 0;
    const hasUnit = !!unit;
    // 有步进时单位外置占位，保证各行 −值+/单位/写入列对齐；无步进单位叠在输入框右侧
    const inlineUnit = !step && hasUnit ? `<span class="unit-suffix">${unit}</span>` : "";
    const inputBox = `<div class="spx-plct-unit">
        <input type="text" inputmode="decimal" id="${id}" class="spx-plct-inp" data-osk="1" value="${value}" />
        ${inlineUnit}
      </div>`;
    if (step > 0) {
      return `<div class="spx-plct-form-row param has-step${hasUnit ? " has-unit" : ""}">
      <label class="spx-plct-form-k" for="${id}">${label}</label>
      <button type="button" class="ghost-btn compact spx-plct-nudge" data-act="plct-nudge" data-field="${id}" data-delta="-1" data-step="${step}" aria-label="-">−</button>
      ${inputBox}
      <button type="button" class="ghost-btn compact spx-plct-nudge" data-act="plct-nudge" data-field="${id}" data-delta="1" data-step="${step}" aria-label="+">+</button>
      <span class="spx-plct-unit-col">${hasUnit ? unit : ""}</span>
      <button type="button" class="ghost-btn compact spx-plct-apply" data-act="plct-apply" data-field="${id}">${applyText || "↵"}</button>
    </div>`;
    }
    return `<div class="spx-plct-form-row param">
      <label class="spx-plct-form-k" for="${id}">${label}</label>
      <div class="spx-plct-ctrl">${inputBox}</div>
      <button type="button" class="ghost-btn compact spx-plct-apply" data-act="plct-apply" data-field="${id}">${applyText || "↵"}</button>
    </div>`;
  }

  function plcCmd(text, cmd, cls) {
    return `<button type="button" class="ghost-btn compact${cls ? " " + cls : ""}" data-act="plct-cmd" data-cmd="${cmd}">${text}</button>`;
  }

  function plcHold(text, press, release) {
    return `<button type="button" class="ghost-btn compact" data-act="plct-hold" data-press="${press}" data-release="${release || "XZZero"}">${text}</button>`;
  }

  function plcCheck(id, label, onCmd, offCmd) {
    return `<label class="spx-plct-check">
      <input type="checkbox" id="${id}" data-act="plct-toggle" data-on="${onCmd}" data-off="${offCmd}" />
      <span>${label}</span>
    </label>`;
  }

  function plcSwitch(id, label, onCmd, offCmd, checked) {
    return `<div class="spx-plct-switch-row">
      <span class="spx-plct-form-k">${label}</span>
      <label class="spx-plct-switch">
        <input type="checkbox" id="${id}" data-act="plct-toggle" data-on="${onCmd}" data-off="${offCmd}" ${checked ? "checked" : ""} />
        <span class="spx-plct-slider"></span>
      </label>
    </div>`;
  }

  /** unwind：嵌入已做好的 CustomUIV3/tuning/plc.html（SPX 风格 PLC Tool） */
  function buildPlcTestFrame(ctx) {
    const zh = ctx.lang === "zh-CN";
    const src = debugToolUrl("/customuiv3/tuning/plc.html", ctx.lang || (zh ? "zh-CN" : "en-US"));
    return `
      <div class="spx-plct-frame-wrap" id="popPlcTestFrame">
        <iframe class="spx-plct-frame" title="${zh ? "PLC 调试" : "PLC Test"}" src="${src}" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>`;
  }

  /** unwind.html：SPX 版 plctest；非管理员仅状态+基本参数，管理员可见系统/贴标/IO/手动 */
  function buildPlcTest(ctx) {
    const zh = ctx.lang === "zh-CN";
    const isAdmin = !!(ctx.about && ctx.about.isAdmin);
    const applyTxt = zh ? "写入" : "Apply";
    const st = (ctx.state && ctx.state.plc) || {};
    const s = metricState(ctx.state);
    const connected = !!st.is_connected;
    // PLC 面板展示内部 SI；metricState 已换算显示单位，回退用 lengthMeters/speedMPerMin
    const lenRaw = st.fabric_length != null ? st.fabric_length : (ctx.state && ctx.state.lengthM != null ? ctx.state.lengthM : s.lengthMeters);
    const spdRaw = st.servo_speed != null ? st.servo_speed : (ctx.state && ctx.state.speed != null ? ctx.state.speed : s.speedMPerMin);
    const len = fmtPlc(lenRaw, 2);
    const spd = fmtPlc(spdRaw, 2);
    const alarm = plcAlarmText(st, zh);
    const breadth = st.plc_fabric_width != null ? st.plc_fabric_width : st.fabric_width;
    const labelDone = Number(st.label_finish_stop) !== 0;
    const reverse = !!st.shaft_rotation_reverse;
    const modeText = reverse ? (zh ? "反转" : "Reverse") : (zh ? "正转" : "Forward");

    const livePanel = `
      <section class="spx-plct-panel live">
        <div class="spx-plct-heading">${zh ? "实时状态" : "Real State"}</div>
        <div class="spx-plct-panel-body">
          ${plcRoRow("encoder", zh ? "编码器" : "Encoder", fmtPlc(st.encoder, 0))}
          ${plcRoRow("servo", zh ? "伺服" : "Servo", fmtPlc(st.servo_value, 2))}
          ${plcRoRow("motor", zh ? "主电机速度" : "Motor speed", fmtPlc(st.speed, 2), "[m/s]")}
          ${plcRoRow("encSpd", zh ? "编码器速度" : "Encoder speed", fmtPlc(st.servo_speed, 2), "[m/s]")}
          ${plcRoRow("fabTen", zh ? "验布张力" : "Fabric tension", fmtPlc(st.fabric_tension_pid != null ? st.fabric_tension_pid : st.tension, 2), "[N]")}
          ${plcRoRow("rollTen", zh ? "收卷张力" : "Roll tension", fmtPlc(st.roll_tension, 2), "[N]")}
          ${plcRoRow("breadth", zh ? "门幅" : "Breadth", fmtPlc(breadth, 2), "[cm]")}
          ${plcRoRow("wL", zh ? "幅宽左" : "Width left", fmtPlc(st.width_sensor_left, 2), "[cm]")}
          ${plcRoRow("wR", zh ? "幅宽右" : "Width right", fmtPlc(st.width_sensor_right, 2), "[cm]")}
          ${plcRoRow("liveW", zh ? "当前重量" : "Live weight", fmtPlc(st.live_weight, 2), "[kg]")}
          ${plcRoRow("lastW", zh ? "最终重量" : "Final weight", fmtPlc(st.last_weight, 2), "[kg]")}
        </div>
      </section>`;

    const paramPanel = `
      <section class="spx-plct-panel param">
        <div class="spx-plct-heading">${zh ? "参数设定" : "Parameter Set"}</div>
        <div class="spx-plct-panel-body">
          ${plcParam("plctMotor", zh ? "主电机速度设定" : "Motor speed set", fmtPlc(st.speed_set, 3), "[m/s]", applyTxt)}
          ${plcParam("plctFabric", zh ? "验布张力设定" : "Fabric tension set", fmtPlc(st.fabric_tension_set, 3), "[N]", applyTxt)}
          ${plcParam("plctRoll", zh ? "收卷张力设定" : "Roll tension set", fmtPlc(st.roll_tension_set, 3), "[N]", applyTxt)}
          <div class="spx-plct-form-row mode">
            <span class="spx-plct-form-k">${zh ? "正反转模式" : "Direction"}</span>
            <div class="spx-plct-mode">
              <span class="mode-value" data-plct="rollMode">${modeText}</span>
              <label class="spx-plct-switch">
                <input type="checkbox" id="plctReverse" data-act="plct-toggle" data-on="SetReverseMode" data-off="SetForwardMode" ${reverse ? "checked" : ""} />
                <span class="spx-plct-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </section>`;

    const labelPanel = isAdmin ? `
      <section class="spx-plct-panel label">
        <div class="spx-plct-heading">${zh ? "贴标测试" : "Labelling Test"}</div>
        <div class="spx-plct-panel-body">
          <div class="spx-plct-xyz" aria-label="${zh ? "当前坐标" : "Current XYZ"}">
            ${plcRoRow("lblX", zh ? "X坐标" : "X", fmtPlc(st.current_x, "int"))}
            ${plcRoRow("lblY", zh ? "Y坐标" : "Y", fmtPlc(st.current_y, "int"))}
            ${plcRoRow("lblZ", zh ? "Z坐标" : "Z", fmtPlc(st.current_z, "int"))}
          </div>
          ${plcParam("plctHalt", zh ? "预设停机坐标" : "Halt coordinate", fmtPlc(st.label_y, "int"), "", applyTxt)}
          ${plcParam("plctLblX", zh ? "贴标X坐标" : "Labelling X", fmtPlc(st.label_x, "int"), "", applyTxt)}
          <div class="spx-plct-form-row radio">
            <span class="spx-plct-form-k">${zh ? "贴标完成状态" : "Finish state"}</span>
            <div class="spx-plct-radio readonly" id="plctLabelFinish">
              <label><input type="radio" name="plctLabelFinish" ${labelDone ? "" : "checked"} disabled /><span>${zh ? "未完成" : "Pending"}</span></label>
              <label><input type="radio" name="plctLabelFinish" ${labelDone ? "checked" : ""} disabled /><span>${zh ? "完成" : "Done"}</span></label>
            </div>
          </div>
          <div class="spx-plct-labelling-actions">
            <button type="button" class="ghost-btn compact ok" data-act="plct-label-test">${zh ? "测试" : "Test"}</button>
            ${plcCmd(zh ? "贴标" : "Labelling", "Labelling", "ok")}
            <button type="button" class="ghost-btn compact" data-act="plct-movex">${zh ? "移动 X" : "Move X"}</button>
          </div>
        </div>
      </section>` : "";

    const sysTabs = [
      { key: "quick", zh: "常用", en: "Quick" },
      { key: "systemParameters", zh: "系统参数", en: "System" },
      { key: "systemParameters2", zh: "系统参数2", en: "System 2" },
      { key: "tensionParameters", zh: "张力参数", en: "Tension" },
      { key: "manualControl", zh: "收放卷点动", en: "Jog" },
    ];
    const sysTabBtns = sysTabs
      .map(
        (b, i) =>
          `<button type="button" class="ghost-btn compact spx-plct-sys-tab${i === 0 ? " active" : ""}" data-act="plct-sys-tab" data-tab="${b.key}">${zh ? b.zh : b.en}</button>`
      )
      .join("");
    const systemPanel = isAdmin ? `
      <section class="spx-plct-panel system" id="popPlcSysPanel" data-sys-tab="quick">
        <div class="spx-plct-heading">${zh ? "系统参数" : "System Parameter"}</div>
        <div class="spx-plct-sys-tabs" role="tablist" aria-label="${zh ? "系统参数分组" : "System tabs"}">${sysTabBtns}</div>
        <div class="spx-plct-panel-body system-body">
          <div class="spx-plct-sys-pane" data-pane="quick">
            <div class="spx-plct-system-main">
              <div class="spx-plct-system-params">
                ${plcParam("plctTenCoef", zh ? "张力系数" : "Tension coef", fmtPlc(st.tension_factor, 3), "", applyTxt, { step: 0.1 })}
                ${plcParam("plctUnreel", zh ? "进卷/放卷系数" : "Unreel/roll coef", fmtPlc(st.roll_unreel_factor, 3), "", applyTxt, { step: 0.1 })}
                ${plcParam("plctTenDiff", zh ? "叠布电机速度系数" : "Stack coef", fmtPlc(st.differential_tension, 3), "", applyTxt, { step: 0.1 })}
                ${plcParam("plctRollDiff", zh ? "收卷/摆布差速" : "Roll/plait diff", fmtPlc(st.differential_roll, 3), "[m/s]", applyTxt, { step: 0.1 })}
                ${plcParam("plctDrop", zh ? "贴标机下降高度" : "Drop height", fmtPlc(st.labelling_descent_height, 3), "[m/s]", applyTxt, { step: 0.1 })}
              </div>
              <div class="spx-plct-system-switches">
                ${plcSwitch("plctBuzzer", zh ? "蜂鸣器" : "Buzzer", "OpenBuzzer", "CloseBuzzer", false)}
                ${plcSwitch("plctShield", zh ? "屏蔽检测" : "Shield detection", "OpenShieldDetection", "CloseShieldDetection", false)}
              </div>
            </div>
          </div>
          <div class="spx-plct-sys-pane" data-pane="systemParameters" hidden></div>
          <div class="spx-plct-sys-pane" data-pane="systemParameters2" hidden></div>
          <div class="spx-plct-sys-pane" data-pane="tensionParameters" hidden></div>
          <div class="spx-plct-sys-pane" data-pane="manualControl" hidden></div>
          <div class="spx-plct-sys-msg" id="spxPlcSysMsg"></div>
        </div>
      </section>` : "";

    const ioSub = `
      <div class="spx-plct-sub io" id="popPlcIo" hidden>
        <div class="spx-plct-sub-mask" data-act="plct-io-close"></div>
        <div class="spx-plct-sub-card io" role="dialog" aria-label="${zh ? "IO状态" : "IO State"}">
          <div class="spx-plct-sub-head">
            <span>${zh ? "IO状态" : "IO State"}</span>
            <button type="button" class="ghost-btn compact" data-act="plct-io-close">×</button>
          </div>
          <div class="spx-plct-sub-body io" id="popPlcIoHost"></div>
        </div>
      </div>`;

    const manualSub = isAdmin ? `
      <div class="spx-plct-sub" id="popPlcManual" hidden>
        <div class="spx-plct-sub-mask" data-act="plct-manual-close"></div>
        <div class="spx-plct-sub-card manual" role="dialog" aria-label="${zh ? "手动调试" : "Manual"}">
          <div class="spx-plct-sub-head">
            <span>${zh ? "手动调试" : "Manual Debug"}</span>
            <button type="button" class="ghost-btn compact" data-act="plct-manual-close">×</button>
          </div>
          <div class="spx-plct-sub-body">
            ${plcCheck("plctManual", zh ? "启用手动" : "Enable manual", "OpenEnableManual", "CloseEnableManual")}
            <p class="spx-plct-manual-hint" id="popPlcManualHint">${zh ? "开启手动模式后，下方功能才可操作" : "Enable manual mode to use controls below"}</p>
            <div class="spx-plct-manual-ops is-disabled" id="popPlcManualOps" aria-disabled="true">
              <div class="spx-plct-manual-board">
                <section class="spx-plct-manual-group">
                  <div class="spx-plct-h">${zh ? "输出控制" : "Output"}</div>
                  <div class="spx-plct-manual-checks">
                    ${plcCheck("plctDc", zh ? "直流分边电机" : "DC edge motor", "OpenDCMotor", "CloseDCMotor")}
                    ${plcCheck("plctWind", zh ? "卷标电机" : "Winding motor", "OpenWindingMotor", "CloseWindingMotor")}
                    ${plcCheck("plctVac", zh ? "真空阀" : "Vacuum", "OpenVacuumValve", "CloseVacuumValve")}
                    ${plcCheck("plctAir", zh ? "气缸" : "Cylinder", "OpenAirCylinder", "CloseAirCylinder")}
                  </div>
                </section>
                <section class="spx-plct-manual-group">
                  <div class="spx-plct-h">${zh ? "贴标 X 轴" : "Label X"}</div>
                  <div class="spx-plct-manual-grid">
                    ${plcHold(zh ? "左移" : "Left", "XLeftMove")}
                    ${plcHold(zh ? "右移" : "Right", "XRightMove")}
                    ${plcHold(zh ? "停止" : "Stop", "XStop")}
                    ${plcHold(zh ? "回原点" : "Home", "XBack")}
                  </div>
                </section>
                <section class="spx-plct-manual-group">
                  <div class="spx-plct-h">${zh ? "主电机" : "Main motor"}</div>
                  <div class="spx-plct-manual-grid">
                    ${plcCmd(zh ? "后退" : "Back", "MainMotorBack")}
                    ${plcCmd(zh ? "前进" : "Forward", "MainMotoradvance")}
                    ${plcCmd(zh ? "停止" : "Stop", "MainMotorStop", "danger")}
                  </div>
                </section>
                <section class="spx-plct-manual-group">
                  <div class="spx-plct-h">${zh ? "贴标 Z 轴" : "Label Z"}</div>
                  <div class="spx-plct-manual-grid">
                    ${plcHold(zh ? "上移" : "Up", "ZUp")}
                    ${plcHold(zh ? "下移" : "Down", "ZDown")}
                    ${plcHold(zh ? "停止" : "Stop", "ZStop")}
                    ${plcHold(zh ? "回原点" : "Home", "ZBack")}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>` : "";

    const adminManualBtn = isAdmin
      ? `<button type="button" class="ghost-btn compact tool" data-act="plct-manual-open">${zh ? "手动调试" : "Manual"}</button>`
      : "";
    const rightBody = isAdmin
      ? `<div class="spx-plct-col-right">
            <div class="spx-plct-top-pair">${paramPanel}${labelPanel}</div>
            ${systemPanel}
          </div>`
      : `<div class="spx-plct-col-right is-basic">${paramPanel}</div>`;

    const roleHint = isAdmin
      ? (zh ? "管理员 · 可调系统参数与调试" : "Admin · system & debug")
      : (zh ? "操作员 · 状态/基本参数/IO/归零" : "Operator · status, params, IO, zero");

    return `
      <div class="spx-plctest classic ${isAdmin ? "is-admin" : "is-operator"}" id="popPlcTest" data-admin="${isAdmin ? "1" : "0"}">
        <section class="spx-plct-head">
          <div class="spx-plct-tiles">
            ${plcTile("length", zh ? "码长" : "Length", len, "m")}
            ${plcTile("speed", zh ? "速度" : "Speed", spd, "m/s")}
            ${plcTile("connect", zh ? "连接" : "Link", connected ? (zh ? "已连接" : "ON") : (zh ? "未连接" : "OFF"), "", !connected)}
            ${plcTile("alarm", zh ? "报警" : "Alarm", alarm, "", alarm !== (zh ? "无报警" : "OK"))}
          </div>
          <div class="spx-plct-actions">
            <button type="button" class="ghost-btn compact tool" data-act="plct-io-open">${zh ? "IO状态" : "IO State"}</button>
            ${adminManualBtn}
            <div class="spx-plct-actions-spacer"></div>
            ${plcCmd(zh ? "启动" : "Start", "Start", "ok")}
            ${plcCmd(zh ? "停止" : "Stop", "Stop", "danger")}
            ${plcCmd(zh ? "复位" : "Reset", "Reset")}
            ${plcCmd(zh ? "归零" : "Zero", "Zero")}
            ${plcCmd(zh ? "贴标机归零" : "Labeller Zero", "LabellerZero")}
            ${plcCmd(zh ? "编码器复位" : "Encoder Zero", "EncoderReset")}
            ${plcCmd(zh ? "急停" : "E-Stop", "EmergencyStop", "danger")}
          </div>
        </section>
        <section class="spx-plct-body-row ${isAdmin ? "" : "is-basic"}">
          <div class="spx-plct-col-live">${livePanel}</div>
          ${rightBody}
        </section>
        <div class="spx-plct-msg muted" id="popPlcTestMsg">${roleHint} · ${zh ? "参数点「写入」生效" : "Apply writes"}</div>
        ${ioSub}
        ${manualSub}
      </div>`;
  }

  function cameraFamilyOf(type) {
    const t = String(type || "").toLowerCase();
    if (t.indexOf("ikap") >= 0) return "ikap";
    if (t.indexOf("hk") >= 0 || t.indexOf("mvs") >= 0) return "hk";
    if (t.indexOf("luster") >= 0) return "luster";
    if (t.indexOf("sim") >= 0) return "sim";
    if (t.indexOf("dalsa") >= 0) return "dalsa";
    return "generic";
  }

  function cameraFamilyLabel(family, type, zh) {
    if (family === "ikap") return "IKap";
    if (family === "hk") return zh ? "海康" : "Hikvision";
    if (family === "luster") return "Luster";
    if (family === "sim") return zh ? "模拟" : "Sim";
    if (family === "dalsa") return "DALSA";
    return type || "Camera";
  }

  function cameraCanSetExposure(c) {
    const family = (c && c.family) || cameraFamilyOf(c && c.type);
    if (c && c.canSetExposure === true) return true;
    if (c && c.canSetExposure === false) return false;
    return family !== "hk";
  }

  function buildCamera(ctx) {
    const zh = ctx.lang === "zh-CN";
    const isAdmin = !!(ctx.about && ctx.about.isAdmin);
    const cams = Array.isArray(ctx.state && ctx.state.cameras) ? ctx.state.cameras : [];
    const frames = ctx.state && ctx.state.camFrames != null ? ctx.state.camFrames : "—";
    const esc = (s) =>
      String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
    if (!cams.length) {
      return `
        <div class="spx-cam-layout">
          <div class="spx-cam-empty">${zh ? "未检测到相机设备" : "No camera devices"}</div>
          <div class="spx-cam-statbar">
            <span class="spx-cam-chip"><b>${zh ? "帧数" : "Frames"}</b> <span id="popCamFrames">${frames}</span></span>
          </div>
          <div class="spx-actions">${ghostBtn(zh ? "刷新" : "Refresh", 'data-act="cam-refresh"')}</div>
        </div>`;
    }

    const tabNameRaw = String((ctx.state && ctx.state.selectedCamName) || "");
    const activeName = cams.some((c) => String(c.name) === tabNameRaw)
      ? tabNameRaw
      : String(cams[0].name || "");

    const tabs = cams
      .map((c) => {
        const name = String(c.name || "");
        const family = c.family || cameraFamilyOf(c.type);
        const on = name === activeName;
        const lab = cameraFamilyLabel(family, c.type, zh);
        return `<button type="button" class="spx-cam-tab${on ? " active" : ""}" data-act="cam-tab" data-cam="${esc(name)}" role="tab" aria-selected="${on ? "true" : "false"}"><span class="spx-cam-tab-name">${esc(name)}</span><span class="spx-cam-tab-fam">${esc(lab)}</span></button>`;
      })
      .join("");

    const panes = cams
      .map((c) => {
        const name = String(c.name || "");
        const type = String(c.type || "—");
        const family = c.family || cameraFamilyOf(type);
        const on = name === activeName;
        const models = Array.isArray(c.models) ? c.models.filter(Boolean) : [];
        const serials = Array.isArray(c.serials) ? c.serials.filter(Boolean) : [];
        const ips = Array.isArray(c.ips) ? c.ips.filter(Boolean) : [];
        const jsonPath = String(c.settingsJsonRelativePath || "");
        const exp = Number(c.exposure) > 0 ? Number(c.exposure) : 50;
        const res =
          c.bufferWidth > 0 && c.bufferHeight > 0
            ? `${c.bufferWidth}×${c.bufferHeight}`
            : "—";
        const cnt = c.cameraCount != null ? c.cameraCount : models.length || 1;
        const grab = c.isGrab ? (zh ? "采集中" : "Grabbing") : zh ? "空闲" : "Idle";
        const canExp = cameraCanSetExposure(c);
        const canEdit = canExp && isAdmin;
        const famLab = cameraFamilyLabel(family, type, zh);
        const grabTone = c.isGrab ? "ok" : "idle";

        // 2×N 信息格：上标签下数值，避免「驱动模拟数量1…」挤成一行
        const cells = [
          { k: zh ? "驱动" : "Driver", v: famLab, tone: family === "sim" ? "sim" : "fam" },
          { k: zh ? "数量" : "Count", v: String(cnt) },
          { k: zh ? "分辨率" : "Size", v: res, muted: res === "—" },
          {
            k: zh ? "状态" : "State",
            v: grab,
            tone: grabTone,
            attr: `data-cam-grab="${esc(name)}"`,
          },
        ];
        if (family === "hk" || family === "luster") {
          if (serials.length) cells.push({ k: "SN", v: serials.slice(0, 2).join(" / "), mono: true });
          if (ips.length) cells.push({ k: "IP", v: ips.slice(0, 2).join(" / "), mono: true });
        }
        if ((family === "ikap" || family === "hk") && jsonPath) {
          cells.push({
            k: "JSON",
            v: jsonPath.split("/").pop() || jsonPath,
            mono: true,
            title: jsonPath,
          });
        }

        const statGrid = `<div class="spx-cam-statgrid" data-cols="${Math.min(4, cells.length)}">${cells
          .map((cell) => {
            const cls = ["spx-cam-stat"];
            if (cell.tone) cls.push("tone-" + cell.tone);
            if (cell.muted) cls.push("is-muted");
            if (cell.mono) cls.push("is-mono");
            const title = cell.title ? ` title="${esc(cell.title)}"` : "";
            const extra = cell.attr ? " " + cell.attr : "";
            return `<div class="${cls.join(" ")}"${title}${extra}><span class="spx-cam-stat-k">${esc(cell.k)}</span><span class="spx-cam-stat-v">${esc(cell.v)}</span></div>`;
          })
          .join("")}</div>`;

        const modelBlock = models.length
          ? `<div class="spx-cam-models"><span class="spx-k">${zh ? "型号" : "Model"}</span><div class="spx-cam-model-list">${models
              .map((m) => `<span class="spx-cam-model-tag" title="${esc(m)}">${esc(m)}</span>`)
              .join("")}</div></div>`
          : "";

        let paramBlock = "";
        if (canEdit) {
          paramBlock = `
            <div class="spx-cam-param">
              <div class="spx-cam-exp-row">
                <label class="spx-field spx-cam-exp-field"><span class="spx-k">${zh ? "曝光 (us)" : "Exposure (us)"}</span>
                  <input class="popCamExp" data-cam="${esc(name)}" type="number" min="1" max="20000" value="${esc(String(exp))}" />
                </label>
                ${ghostBtn(zh ? "保存" : "Save", 'data-act="cam-save"')}
              </div>
            </div>`;
        } else if (canExp && !isAdmin) {
          paramBlock = `
            <div class="spx-cam-param is-readonly">
              <div class="spx-kv"><span class="spx-k">${zh ? "曝光 (us)" : "Exposure (us)"}</span><span class="spx-v">${esc(String(exp > 0 ? exp : "—"))}</span></div>
              <div class="spx-cam-hint">${zh ? "非管理员仅可查看，修改参数请先登录管理员" : "View only — admin login required to edit"}</div>
            </div>`;
        } else {
          paramBlock = `
            <div class="spx-cam-param is-readonly">
              <div class="spx-cam-hint">${
                zh
                  ? "本类型不支持弹窗改曝光 → 调试·相机 / " + (jsonPath ? jsonPath.split("/").pop() : "JSON")
                  : "No popup exposure → Debug·Camera / JSON"
              }</div>
            </div>`;
        }

        return `
          <div class="spx-cam-pane" data-cam-pane="${esc(name)}" data-cam-family="${esc(family)}" ${on ? "" : "hidden"}>
            ${statGrid}
            ${modelBlock}
            ${paramBlock}
          </div>`;
      })
      .join("");

    return `
      <div class="spx-cam-layout">
        <div class="spx-cam-tabs" role="tablist" aria-label="${zh ? "相机" : "Cameras"}">${tabs}</div>
        <div class="spx-cam-preview-wrap">
          <div class="spx-cam-preview" id="popCamPreview" data-cam="${esc(activeName)}">
            <img class="spx-cam-img" id="popCamImg" alt="" hidden />
            <div class="spx-cam-meta" id="popCamMeta">
              <span id="popCamMetaName">${esc(activeName)}</span>
              · frames <span id="popCamFrames">${esc(String(frames))}</span>
            </div>
          </div>
          <div class="spx-cam-preview-actions">
            ${ghostBtn(zh ? "刷新" : "Refresh", 'data-act="cam-refresh"')}
            ${ghostBtn(zh ? "自动" : "Auto", 'data-act="cam-auto" id="popCamAutoBtn"')}
          </div>
        </div>
        <div class="spx-cam-panes">${panes}</div>
      </div>`;
  }

  function buildLight(ctx) {
    const zh = ctx.lang === "zh-CN";
    const fromApi = Array.isArray(ctx.state && ctx.state.lights) ? ctx.state.lights : [];
    const lights = fromApi.length
      ? fromApi
      : [
          { id: 1, name: zh ? "前灯" : "Front", v: Number(ctx.state && ctx.state.lightBrightness) || 180 },
          { id: 2, name: zh ? "后灯" : "Back", v: 160 },
        ];
    const tabIdRaw = Number(ctx.state && ctx.state.lightTabId);
    const activeId = lights.some((L) => Number(L.id) === tabIdRaw)
      ? tabIdRaw
      : Number(lights[0] && lights[0].id) || 1;
    // 顶部开关为总开关：与顶栏 AUTO/MAN、DetectionSetting 一致，不随 Tab 跳变
    const autoOn = !!(ctx.state && ctx.state.lightAuto);
    const selectedColor = String((ctx.state && ctx.state.selectedColor) || "");
    const fromDb = Array.isArray(ctx.state && ctx.state.lightColors) ? ctx.state.lightColors : [];
    const fallbackColors = [
      { color: "#f5f5f5", brightness: 220, brightnessBottom: 220 },
      { color: "#e8d5b7", brightness: 196, brightnessBottom: 196 },
      { color: "#c4a574", brightness: 172, brightnessBottom: 172 },
      { color: "#8b5a2b", brightness: 148, brightnessBottom: 148 },
      { color: "#4a3728", brightness: 124, brightnessBottom: 124 },
      { color: "#1a1a1a", brightness: 100, brightnessBottom: 100 },
      { color: "#2f4f6f", brightness: 76, brightnessBottom: 76 },
      { color: "#8b0000", brightness: 52, brightnessBottom: 52 },
    ];
    const colorPresets = fromDb.length ? fromDb : fallbackColors;
    const escapeAttr = (s) =>
      String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
    const tabs = lights
      .map((L) => {
        const on = Number(L.id) === activeId;
        return `<button type="button" class="spx-light-tab${on ? " active" : ""}" data-act="light-tab" data-id="${L.id}" role="tab" aria-selected="${on ? "true" : "false"}">${escapeAttr(L.name)}</button>`;
      })
      .join("");
    const panes = lights
      .map((L) => {
        const on = Number(L.id) === activeId;
        const v = Number(L.v) || 0;
        return `<div class="spx-light-pane" data-light-pane="${L.id}" ${on ? "" : "hidden"}>
            <span class="spx-k">${zh ? "亮度" : "Lvl"}</span>
            <input type="range" min="0" max="255" value="${v}" data-act="light-slider" data-id="${L.id}" />
            <span class="spx-v" data-light-val="${L.id}">${v}</span>
          </div>`;
      })
      .join("");
    return `
      <div class="spx-light-compact">
        <div class="spx-light-auto-row" data-auto="${autoOn ? "1" : "0"}">
          <span class="spx-light-auto-lab">
            <span class="spx-light-auto-ico" aria-hidden="true" title="${zh ? (autoOn ? "自动调光" : "手动调光") : autoOn ? "Auto" : "Manual"}"></span>
            <span>${zh ? "自动调光" : "Auto"}</span>
          </span>
          <label class="spx-switch" title="${zh ? (autoOn ? "开" : "关") : autoOn ? "On" : "Off"}">
            <input type="checkbox" data-act="light-auto" ${autoOn ? "checked" : ""} />
            <span class="spx-switch-track" aria-hidden="true"><span class="spx-switch-thumb"></span></span>
          </label>
        </div>
        <div class="spx-light-ctrl">
          <div class="spx-light-tabs" role="tablist" aria-label="${zh ? "光源" : "Lights"}">${tabs}</div>
          <div class="spx-light-panes">${panes}</div>
        </div>
        <div class="spx-light-presets">
          <div class="spx-light-presets-h">${zh ? "布色推荐" : "Presets"}</div>
          <div class="spx-color-grid" data-selected-color="${escapeAttr(selectedColor)}">
            ${colorPresets
              .map((C) => {
                const c = String(C.color || "#888888");
                const v1 = Number(C.brightness) || 0;
                const v2 = C.brightnessBottom != null ? Number(C.brightnessBottom) : v1;
                const sel = selectedColor && c === selectedColor ? " selected" : "";
                const tip = zh
                  ? `${c} 光源1:${v1} 光源2:${v2}`
                  : `${c} L1:${v1} L2:${v2}`;
                return `<button type="button" class="spx-swatch${sel}" style="background:${escapeAttr(c)}" data-act="light-preset" data-color="${escapeAttr(c)}" data-v="${v1}" data-v2="${v2}" title="${escapeAttr(tip)}"><span>${v1}</span></button>`;
              })
              .join("")}
          </div>
        </div>
        <div class="spx-actions spx-light-actions">${ghostBtn(zh ? "应用" : "Apply", 'data-act="light-apply"')}</div>
      </div>`;
  }

  function buildAlarm(ctx) {
    const zh = ctx.lang === "zh-CN";
    const list = Array.isArray(ctx.state.alarmList) ? ctx.state.alarmList : [];
    const esc = (s) =>
      String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const typeClass = (t) => {
      const s = String(t || "").trim();
      if (s === "plc_warn" || s === "warning" || s === "warn") return "plc_warn";
      if (s === "label_alarm") return "label_alarm";
      if (s === "motor_alarm") return "motor_alarm";
      if (s === "device_error" || s === "custom_alarm") return s;
      if (s === "plc_alarm" || s === "error" || s === "alarm") return "plc_alarm";
      return s || "plc_alarm";
    };
    const typeLabel = (t) => {
      const c = typeClass(t);
      if (c === "plc_warn") return zh ? "预警" : "Warn";
      if (c === "label_alarm") return zh ? "贴标" : "Label";
      if (c === "motor_alarm") return zh ? "电机" : "Motor";
      if (c === "device_error" || c === "custom_alarm") return zh ? "设备" : "Device";
      return zh ? "报警" : "Alarm";
    };
    const worstLiveClass = () => {
      if (!list.length) return "ok";
      const onlyWarn = list.every((a) => typeClass(a && a.type) === "plc_warn");
      return onlyWarn ? "warn" : "alarm";
    };
    let bodyHtml;
    if (list.length) {
      bodyHtml = list
        .map((a) => {
          const cls = typeClass(a.type);
          const code = esc(a.code || a.key || "-");
          const msg = esc(a.msg || a.message || a.title || "-");
          return `<tr class="spx-alarm-row ${cls}"><td><span class="spx-alarm-badge ${cls}">${esc(
            typeLabel(a.type)
          )}</span></td><td>${code}</td><td>${msg}</td></tr>`;
        })
        .join("");
    } else {
      bodyHtml = `<tr><td>-</td><td>-</td><td>${zh ? "当前无报警" : "No alarms"}</td></tr>`;
    }
    const liveText = list.length
      ? `${zh ? "当前" : "Now"}（${list.length}）：${esc(
          ctx.state.alarmMsg || list.map((a) => a.msg).filter(Boolean).join(" · ")
        )}`
      : zh
        ? "当前无报警"
        : "No alarms";
    return `
      ${section(zh ? "报警列表" : "Alarms")}
      <p class="spx-msg spx-alarm-live ${worstLiveClass()}">${liveText}</p>
      <table class="spx-table">
        <thead><tr><th>${zh ? "类型" : "Type"}</th><th>${zh ? "代码" : "Code"}</th><th>${zh ? "信息" : "Message"}</th></tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
      <div class="spx-actions">
        ${ghostBtn(zh ? "刷新" : "Refresh", 'data-act="alarm-refresh"')}
        ${ghostBtn(zh ? "复位" : "Reset", 'data-act="alarm-reset" data-cmd="Reset"')}
        <button type="button" class="ghost-btn danger" data-act="alarm-zero" data-cmd="Zero">${zh ? "回零" : "Zero"}</button>
      </div>
      <p class="spx-msg" id="popAlarmMsg"></p>`;
  }

  function seriesPoints(history, xKey, yKey) {
    const list = Array.isArray(history) ? history : [];
    return list
      .filter((p) => p && Number.isFinite(p[xKey]) && Number.isFinite(p[yKey]))
      .map((p) => ({ x: p[xKey], y: p[yKey] }));
  }

  function buildSvgSeries(points, opts) {
    const W = 520;
    const H = 140;
    const pad = { l: 42, r: 12, t: 10, b: 24 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;
    const empty = !points || points.length < 2;

    let minX = 0;
    let maxX = 1;
    let minY = 0;
    let maxY = 1;
    if (!empty) {
      minX = Math.min(...points.map((p) => p.x));
      maxX = Math.max(...points.map((p) => p.x));
      minY = Math.min(...points.map((p) => p.y));
      maxY = Math.max(...points.map((p) => p.y));
      if (maxX <= minX) maxX = minX + 1;
      if (maxY <= minY) {
        minY -= 1;
        maxY += 1;
      } else {
        const padY = (maxY - minY) * 0.12 || 1;
        minY -= padY;
        maxY += padY;
      }
    }

    const sx = (x) => pad.l + ((x - minX) / (maxX - minX)) * plotW;
    const sy = (y) => pad.t + (1 - (y - minY) / (maxY - minY)) * plotH;

    const fmt = opts.fmtY || ((v) => v.toFixed(1));
    const fmtX = opts.fmtX || ((v) => v.toFixed(1));
    const yTicks = [minY, (minY + maxY) / 2, maxY];
    const xTicks = [minX, (minX + maxX) / 2, maxX];

    let path = "";
    let area = "";
    if (!empty) {
      path = points
        .map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
        .join(" ");
      const first = points[0];
      const last = points[points.length - 1];
      area =
        `M${sx(first.x).toFixed(1)},${sy(minY).toFixed(1)} ` +
        points.map((p) => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") +
        ` L${sx(last.x).toFixed(1)},${sy(minY).toFixed(1)} Z`;
    }

    const last = empty ? null : points[points.length - 1];
    return `
      <div class="spx-chart">
        <div class="spx-chart-head">
          <span class="spx-k">${opts.title}</span>
          <span class="spx-v">${empty ? "—" : `${fmt(last.y)} · n=${points.length}`}</span>
        </div>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="${opts.title}">
          ${[0, 0.5, 1]
            .map((t) => {
              const y = pad.t + plotH * (1 - t);
              return `<line class="spx-chart-grid" x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" />`;
            })
            .join("")}
          ${yTicks
            .map(
              (v) =>
                `<text class="spx-chart-axis" x="${pad.l - 6}" y="${sy(v) + 3}" text-anchor="end">${fmt(v)}</text>`
            )
            .join("")}
          ${xTicks
            .map(
              (v) =>
                `<text class="spx-chart-axis" x="${sx(v)}" y="${H - 6}" text-anchor="middle">${fmtX(v)}</text>`
            )
            .join("")}
          ${empty ? "" : `<path class="spx-chart-area" d="${area}" />`}
          ${empty ? "" : `<path class="spx-chart-line" d="${path}" />`}
          ${
            empty
              ? ""
              : `<circle class="spx-chart-dot" cx="${sx(last.x).toFixed(1)}" cy="${sy(last.y).toFixed(1)}" r="3" />`
          }
        </svg>
        <div class="spx-chart-legend">
          <span><i></i>${opts.xLabel} → ${opts.yLabel}</span>
        </div>
      </div>`;
  }

  function seriesStats(points, digits) {
    const d = digits == null ? 1 : digits;
    if (!points || !points.length) {
      return { min: "—", max: "—", avg: "—", n: 0 };
    }
    const ys = points.map((p) => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const avg = ys.reduce((a, b) => a + b, 0) / ys.length;
    return {
      min: min.toFixed(d),
      max: max.toFixed(d),
      avg: avg.toFixed(d),
      n: ys.length,
    };
  }

  function buildStatRow(zh, stats, unit) {
    const u = unit ? ` ${unit}` : "";
    return `
      <div class="spx-stat-row">
        <div class="spx-stat">
          <span class="spx-k">${zh ? "最大" : "Max"}</span>
          <span class="spx-v">${stats.max}${u}</span>
        </div>
        <div class="spx-stat">
          <span class="spx-k">${zh ? "最小" : "Min"}</span>
          <span class="spx-v">${stats.min}${u}</span>
        </div>
        <div class="spx-stat">
          <span class="spx-k">${zh ? "平均" : "Avg"}</span>
          <span class="spx-v">${stats.avg}${u}</span>
        </div>
      </div>`;
  }

  function num(v, d) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  }

  function normalizeLengthUnit(u) {
    const x = String(u || "").trim().toLowerCase();
    return x === "yard" || x === "yd" ? "yd" : "m";
  }
  function normalizeWidthUnit(u) {
    const x = String(u || "").trim().toLowerCase();
    return x === "inch" || x === "in" ? "in" : "cm";
  }
  function normalizeSpeedUnit(u) {
    const x = String(u || "").trim().toLowerCase();
    if (x === "m/s" || x === "m/min" || x === "yd/s" || x === "yd/min") return x;
    return "m/min";
  }
  /** 内部恒 m；yd 对齐 V1 ×1.0936 */
  function lengthFromMeters(m, unit) {
    return normalizeLengthUnit(unit) === "yd" ? m * 1.0936 : m;
  }
  /** 内部恒 cm；in 对齐 V1 ×0.3937 */
  function widthFromCm(cm, unit) {
    return normalizeWidthUnit(unit) === "in" ? cm * 0.3937 : cm;
  }
  /** 内部恒 m/min */
  function speedFromMetersPerMin(mpm, unit) {
    const u = normalizeSpeedUnit(unit);
    if (u === "m/s") return mpm / 60;
    if (u === "yd/s") return mpm / 60 / 0.9144;
    if (u === "yd/min") return mpm / 0.9144;
    return mpm;
  }

  /** 与 preview/spacex-main.html state 字段对齐（兼容 embed/API 别名） */
  function metricState(s) {
    s = s || {};
    const lengthUnit = normalizeLengthUnit(s.lengthUnit);
    const widthUnit = normalizeWidthUnit(s.widthUnit);
    const speedUnit = normalizeSpeedUnit(s.speedUnit);
    const lengthM = num(s.lengthM, 0);
    const targetM = num(s.targetM != null ? s.targetM : s.targetLengthM, 0);
    const widthCm = num(s.widthCm, 0);
    const speed = num(s.speed, 0);
    return {
      lengthUnit,
      widthUnit,
      speedUnit,
      lengthM: lengthFromMeters(lengthM, lengthUnit),
      lengthMeters: lengthM,
      targetM: lengthFromMeters(targetM, lengthUnit),
      widthCm: widthFromCm(widthCm, widthUnit),
      widthCmRaw: widthCm,
      speed: speedFromMetersPerMin(speed, speedUnit),
      speedMPerMin: speed,
      colorDiff: num(s.colorDiff, 0),
      tension: num(s.tension, 0),
      unwind: num(s.unwind != null ? s.unwind : s.unwindPercent, 0),
      cpu: num(s.cpu != null ? s.cpu : s.cpuPercent, 0),
      gpu: num(s.gpu != null ? s.gpu : s.gpuPercent, 0),
      cpuTemp: num(s.cpuTemp != null ? s.cpuTemp : s.cpuTempC, -1),
      gpuTemp: num(s.gpuTemp != null ? s.gpuTemp : s.gpuTempC, -1),
      weightKg: num(s.weightKg, 0),
    };
  }

  function fmtClock(tsSec) {
    const d = new Date(tsSec * 1000);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function buildPerfHourCharts(ctx, kind) {
    const zh = ctx.lang === "zh-CN";
    const useGpu = kind === "gpu";
    const name = useGpu ? "GPU" : "CPU";
    const s = metricState(ctx.state);
    const hist = ctx.perfHistory || (ctx.state && ctx.state.perfHistory) || [];
    const pts = seriesPoints(hist, "t", useGpu ? "gpu" : "cpu");
    const stats = seriesStats(pts, 0);
    const fmtX = (v) => fmtClock(v);
    const fmtY = (v) => `${Math.round(v)}`;
    const usage = useGpu ? s.gpu : s.cpu;
    const temp = useGpu ? s.gpuTemp : s.cpuTemp;

    const chart = buildSvgSeries(pts, {
      title: zh ? `最近1小时 · ${name} 占用` : `Last 1h · ${name}`,
      xLabel: zh ? "时间" : "Time",
      yLabel: "%",
      fmtX,
      fmtY,
    });

    return `
      ${section(titleOf(kind, ctx.lang))}
      ${kv(zh ? `当前 ${name}` : `${name} now`, `${usage.toFixed(0)} %`)}
      ${temp >= 0 ? kv(zh ? "温度" : "Temp", `${temp.toFixed(0)}°C`) : ""}
      ${buildStatRow(zh, stats, "%")}
      ${kv(zh ? "样本数" : "Samples", String(stats.n))}
      ${chart}`;
  }

  function buildMetric(ctx, kind) {
    const zh = ctx.lang === "zh-CN";
    const s = metricState(ctx.state);
    const hist = ctx.history || (ctx.state && ctx.state.history) || [];
    if (kind === "cpu" || kind === "gpu") {
      return buildPerfHourCharts(ctx, kind);
    }

    const lenU = s.lengthUnit || "m";
    const widU = s.widthUnit || "cm";
    const spdU = s.speedUnit || "m/min";
    const specs = {
      length: {
        xKey: "t",
        yKey: "lengthM",
        digits: 1,
        unit: lenU,
        convertY: (v) => lengthFromMeters(v, lenU),
        current: `${s.lengthM.toFixed(1)} / ${s.targetM.toFixed(1)} ${lenU}`,
        currentLabel: zh ? "当前码长" : "Current",
        title: zh ? "时间 — 码长 序列" : "Time — Length",
        xLabel: zh ? "时间(s)" : "Time(s)",
        yLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        fmtX: null,
        fmtY: (v) => v.toFixed(1),
      },
      width: {
        xKey: "lengthM",
        yKey: "widthCm",
        digits: 1,
        unit: widU,
        convertX: (v) => lengthFromMeters(v, lenU),
        convertY: (v) => widthFromCm(v, widU),
        current: `${s.widthCm.toFixed(1)} ${widU}`,
        currentLabel: zh ? "当前幅宽" : "Current",
        title: zh ? "码长 — 幅宽 序列" : "Length — Width",
        xLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        yLabel: zh ? `幅宽(${widU})` : `Width(${widU})`,
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      speed: {
        xKey: "lengthM",
        yKey: "speed",
        digits: 1,
        unit: spdU,
        convertX: (v) => lengthFromMeters(v, lenU),
        convertY: (v) => speedFromMetersPerMin(v, spdU),
        current: `${s.speed.toFixed(1)} ${spdU}`,
        currentLabel: zh ? "当前速度" : "Current",
        title: zh ? "码长 — 速度 序列" : "Length — Speed",
        xLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        yLabel: zh ? `速度(${spdU})` : `Speed(${spdU})`,
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      colorDiff: {
        xKey: "lengthM",
        yKey: "colorDiff",
        digits: 2,
        unit: "",
        convertX: (v) => lengthFromMeters(v, lenU),
        current: s.colorDiff.toFixed(2),
        currentLabel: zh ? "当前色差" : "Current ΔE",
        title: zh ? "码长 — 色差 序列" : "Length — ΔE",
        xLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        yLabel: "ΔE",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(2),
      },
      tension: {
        xKey: "lengthM",
        yKey: "tension",
        digits: 1,
        unit: "",
        convertX: (v) => lengthFromMeters(v, lenU),
        current: s.tension.toFixed(1),
        currentLabel: zh ? "当前张力" : "Current",
        title: zh ? "码长 — 张力 序列" : "Length — Tension",
        xLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        yLabel: zh ? "张力" : "Tension",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      weight: {
        xKey: "lengthM",
        yKey: "weightKg",
        digits: 1,
        unit: "kg",
        convertX: (v) => lengthFromMeters(v, lenU),
        current: `${Number(s.weightKg || 0).toFixed(1)} kg`,
        currentLabel: zh ? "当前重量" : "Current",
        title: zh ? "码长 — 重量 序列" : "Length — Weight",
        xLabel: zh ? `码长(${lenU})` : `Length(${lenU})`,
        yLabel: zh ? "重量(kg)" : "Weight(kg)",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
    };

    const simple = {
      unwind: [[zh ? "放卷" : "Unwind", `${s.unwind.toFixed(0)} %`]],
    };

    const spec = specs[kind];
    if (!spec) {
      const rows = simple[kind] || [[kind, "-"]];
      return `${section(titleOf(kind, ctx.lang))}${rows.map(([k, v]) => kv(k, v)).join("")}`;
    }

    let pts = seriesPoints(hist, spec.xKey, spec.yKey);
    if (spec.convertX || spec.convertY) {
      pts = pts.map((p) => ({
        x: spec.convertX ? spec.convertX(p.x) : p.x,
        y: spec.convertY ? spec.convertY(p.y) : p.y,
      }));
    }
    const stats = seriesStats(pts, spec.digits);
    let fmtX = spec.fmtX;
    if (kind === "length") {
      const t0 = pts.length ? pts[0].x : 0;
      fmtX = (v) => `${(v - t0).toFixed(0)}s`;
    }

    const chart = buildSvgSeries(pts, {
      title: spec.title,
      xLabel: spec.xLabel,
      yLabel: spec.yLabel,
      fmtX,
      fmtY: spec.fmtY,
    });

    return `
      ${section(titleOf(kind, ctx.lang))}
      ${buildStatRow(zh, stats, spec.unit)}
      ${kv(spec.currentLabel, spec.current)}
      ${kv(zh ? "样本数" : "Samples", String(stats.n))}
      ${chart}`;
  }

  function buildWeight(ctx) {
    const zh = ctx.lang === "zh-CN";
    const s = ctx.state;
    const lenU = normalizeLengthUnit(s && s.lengthUnit);
    const gross = Number.isFinite(s.weightGrossKg) ? s.weightGrossKg : s.weightKg;
    const net = Number.isFinite(s.weightNetKg) ? s.weightNetKg : s.weightKg;
    const rolls = Array.isArray(s.recentWeights) ? s.recentWeights : [];
    const rows = rolls.slice(0, 10);
    while (rows.length < 10) {
      rows.push(null);
    }
    return `
      ${section(zh ? "本卷重量" : "Current Roll")}
      <div class="spx-form-grid">
        ${field(zh ? "毛重 (kg)" : "Gross (kg)", `<input id="popWeightGross" type="number" step="0.1" min="0" value="${gross.toFixed(1)}" />`)}
        ${field(zh ? "净重 (kg)" : "Net (kg)", `<input id="popWeightNet" type="number" step="0.1" min="0" value="${net.toFixed(1)}" />`)}
      </div>
      <div class="spx-actions">${ghostBtn(zh ? "保存" : "Save", 'data-act="weight-save"')}</div>
      ${section(zh ? "最近 10 卷重量" : "Last 10 Rolls")}
      <table class="spx-table">
        <thead>
          <tr>
            <th>#</th>
            <th>${zh ? "卷号" : "Roll"}</th>
            <th>${zh ? "毛重" : "Gross"}</th>
            <th>${zh ? "净重" : "Net"}</th>
            <th>${zh ? "码长" : "Len"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((r, i) =>
              r
                ? `<tr>
                    <td>${i + 1}</td>
                    <td>${r.roll || "-"}</td>
                    <td>${Number(r.gross).toFixed(1)}</td>
                    <td>${Number(r.net).toFixed(1)}</td>
                    <td>${lengthFromMeters(Number(r.lengthM), lenU).toFixed(1)} ${lenU}</td>
                  </tr>`
                : `<tr><td>${i + 1}</td><td colspan="4" style="color:rgba(201,208,220,0.35)">—</td></tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function mergeSettingsValues(groups, map, lang) {
    const cat = global.SpxSettingsCatalog;
    if (cat && typeof cat.mergeValues === "function") return cat.mergeValues(groups, map, lang);
    const m = map || {};
    return (groups || []).map((g) => ({
      id: g.id,
      titleZh: g.titleZh,
      titleEn: g.titleEn,
      i18nKey: g.i18nKey,
      items: (g.items || []).map((it) => {
        const next = Object.assign({}, it);
        if (it.key === "__lang") {
          next.value = lang || next.value || "zh-CN";
          return next;
        }
        if (String(it.key || "").charAt(0) === "_") return next;
        if (Object.prototype.hasOwnProperty.call(m, it.key)) {
          let v = m[it.key];
          if (it.control === "toggle") v = v === true || v === 1 || v === "1" ? 1 : 0;
          next.value = v;
        }
        return next;
      }),
    }));
  }

  function settingsGroups(ctx) {
    const cat = global.SpxSettingsCatalog;
    const raw = (cat && cat.GROUPS) || global.SPX_SETTINGS_CATALOG || [];
    const merged = mergeSettingsValues(raw, (ctx && ctx.settingsValues) || {}, (ctx && ctx.lang) || "zh-CN");
    const isAdmin = !!(ctx && ctx.about && ctx.about.isAdmin);
    const opVisible =
      typeof (cat && cat.isOperatorVisibleKey) === "function"
        ? (key) => cat.isOperatorVisibleKey(key)
        : (key) => ((cat && cat.OPERATOR_KEYS) || []).indexOf(String(key || "")) >= 0;
    const seen = {};
    return merged
      .map((g) => ({
        id: g.id,
        titleZh: g.titleZh,
        titleEn: g.titleEn,
        i18nKey: g.i18nKey,
        items: (g.items || []).filter((it) => {
          const key = String(it.key || "");
          if (!key) return false;
          if (!isAdmin && !opVisible(key)) return false;
          if (key.charAt(0) === "_") return true;
          if (seen[key]) return false;
          seen[key] = 1;
          return true;
        }),
      }))
      .filter((g) => g.items && g.items.length);
  }

  function settingAttr(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function settingOn(v) {
    return v === true || v === 1 || v === "1";
  }

  function settingsControlHtml(item, zh, groupId) {
    const id = `set_${groupId}_${String(item.key).replace(/[^A-Za-z0-9_]/g, "_")}`;
    const init = item.control === "toggle" ? (settingOn(item.value) ? "1" : "0") : String(item.value == null ? "" : item.value);
    const keyAttr = ` data-setting-key="${settingAttr(item.key)}" data-setting-control="${item.control || "text"}" data-setting-init="${settingAttr(init)}"`;
    if (item.control === "toggle") {
      const on = settingOn(item.value);
      return `<label class="spx-switch" title="${zh ? (on ? "开" : "关") : on ? "On" : "Off"}">
        <input type="checkbox" id="${id}"${keyAttr} ${on ? "checked" : ""} />
        <span class="spx-switch-track" aria-hidden="true"><span class="spx-switch-thumb"></span></span>
      </label>`;
    }
    if (item.control === "number") {
      return `<input id="${id}"${keyAttr} type="number" step="any" value="${settingAttr(item.value)}" />`;
    }
    if (item.control === "text") {
      return `<input id="${id}"${keyAttr} type="text" value="${settingAttr(item.value)}" />`;
    }
    if (item.control === "lang") {
      const cur = String(item.value || "zh-CN");
      const langs = [
        ["zh-CN", "中文"],
        ["en", "English"],
        ["vi-VN", "Tiếng Việt"],
        ["pt-PT", "Português"],
        ["de-DE", "Deutsch"],
      ];
      const opts = langs
        .map(([v, lab]) => `<option value="${v}"${v === cur || (v === "en" && cur.indexOf("en") === 0) ? " selected" : ""}>${lab}</option>`)
        .join("");
      return `<select id="popSettingsLang"${keyAttr}>${opts}</select>`;
    }
    if (item.control === "select") {
      const opts = (item.options || [])
        .map((o) => `<option value="${settingAttr(o.v)}" ${String(o.v) === String(item.value) ? "selected" : ""}>${settingAttr(zh ? o.zh : o.en)}</option>`)
        .join("");
      return `<select id="${id}"${keyAttr}>${opts}</select>`;
    }
    return `<input id="${id}"${keyAttr} type="text" value="${settingAttr(item.value)}" />`;
  }

  function groupSettingSections(group, zh) {
    const secs = [];
    const seen = {};
    (group.items || []).forEach((it) => {
      const name = zh ? it.sectionZh || "" : it.sectionEn || "";
      if (!name || seen[name]) return;
      seen[name] = 1;
      secs.push(name);
    });
    return secs;
  }

  function settingsSecId(groupId, index) {
    return `setsec_${groupId}_${index}`;
  }

  function buildSettingsPane(group, zh, active) {
    let lastSec = "";
    let secIndex = -1;
    const rows = (group.items || [])
      .map((it) => {
        const secName = zh ? it.sectionZh || "" : it.sectionEn || "";
        let head = "";
        if (secName && secName !== lastSec) {
          lastSec = secName;
          secIndex += 1;
          const sid = settingsSecId(group.id, secIndex);
          head = `<div class="spx-settings-sec" id="${sid}" data-sec-id="${sid}">${settingAttr(secName)}</div>`;
        }
        const label = zh ? it.labelZh : it.labelEn;
        const keyHtml =
          it.key && !String(it.key).startsWith("__")
            ? `<code class="spx-param-key">${settingAttr(it.key)}</code>`
            : "";
        return `${head}<div class="spx-settings-row">
            <div class="spx-settings-meta"><span class="spx-k">${settingAttr(label)}</span>${keyHtml}</div>
            ${settingsControlHtml(it, zh, group.id)}
          </div>`;
      })
      .join("");
    return `<div data-pane="${group.id}" ${active ? "" : "hidden"}>
      ${section(zh ? group.titleZh : group.titleEn)}
      ${rows}
    </div>`;
  }

  function collectSettingsPayload(doc) {
    const d = doc || (typeof document !== "undefined" ? document : null);
    const payload = {};
    if (!d) return payload;
    const seen = {};
    d.querySelectorAll("[data-setting-key]").forEach((el) => {
      const key = el.getAttribute("data-setting-key");
      if (!key || seen[key]) return;
      seen[key] = 1;
      if (key === "__lang") {
        payload.CurrentLanguage = el.value;
        return;
      }
      if (key.charAt(0) === "_") return;
      const control = el.getAttribute("data-setting-control");
      const now = control === "toggle" ? (el.checked ? "1" : "0") : el.value == null ? "" : String(el.value);
      const init = el.getAttribute("data-setting-init");
      if (init != null && init === now) return;
      payload[key] = now;
    });
    return payload;
  }
  global.spxCollectSettingsPayload = collectSettingsPayload;

  function buildSystemSettings(ctx) {
    const zh = ctx.lang === "zh-CN" || String(ctx.lang || "").indexOf("zh") === 0;
    const isAdmin = !!(ctx && ctx.about && ctx.about.isAdmin);
    const catalog = settingsGroups(ctx);
    const prefer = ctx.settingsTabId || "";
    const preferSec = ctx.settingsSecId || "";
    const activeId =
      prefer && catalog.some((g) => g.id === prefer)
        ? prefer
        : catalog[0]
          ? catalog[0].id
          : "";
    const tabs = catalog
      .map((g) => {
        const active = g.id === activeId;
        // 子分类默认折叠；仅在恢复到具体分区时展开
        const expanded = !!(preferSec && String(preferSec).indexOf(`setsec_${g.id}_`) === 0);
        const title = zh ? g.titleZh : g.titleEn;
        const secs = groupSettingSections(g, zh);
        const subs = secs
          .map((name, i) => {
            const sid = settingsSecId(g.id, i);
            const on = expanded && preferSec === sid;
            return `<button type="button" class="spx-settings-sub${on ? " active" : ""}" data-act="settings-tab" data-tab="${g.id}" data-sec="${sid}">${settingAttr(name)}</button>`;
          })
          .join("");
        return `<div class="spx-settings-nav-group${expanded ? " is-open" : ""}" data-nav-group="${g.id}">
          <button type="button" class="spx-settings-nav-main${active ? " active" : ""}" data-act="settings-tab" data-tab="${g.id}">${settingAttr(title)}</button>
          <div class="spx-settings-nav-subs">${subs}</div>
        </div>`;
      })
      .join("");
    const panes = catalog.map((g) => buildSettingsPane(g, zh, g.id === activeId)).join("");
    let hint = ctx.settingsLoaded
      ? zh
        ? "已读取高级设置，保存写回 /settings/advanced/set"
        : "Loaded from advanced settings"
      : zh
        ? "未读到后端参数，当前为目录默认值"
        : "Backend values unavailable; showing catalog defaults";
    if (!isAdmin) {
      hint = zh
        ? "操作员模式：仅显示检测设置常用参数（对齐 bfsdetectionsetting）"
        : "Operator mode: common detection settings only";
    }
    return `
      <div class="spx-settings ${isAdmin ? "is-admin" : "is-operator"}">
        <aside class="spx-tabs" id="popSettingsTabs">${tabs}</aside>
        <div class="spx-tab-body" id="popSettingsBody">
          <p class="spx-msg" id="popSettingsMsg">${hint}</p>
          ${panes}
          <div class="spx-actions">${ghostBtn(zh ? "保存" : "Save", 'data-act="settings-save"')}</div>
        </div>
      </div>`;
  }

  function numVal(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function fmrRow(zh, label, idPrefix, values, step) {
    const [a, b, c] = values;
    const tags = zh ? ["前", "中", "后"] : ["F", "M", "R"];
    return `
      <div class="spx-fmr-row">
        <span class="spx-k">${label}</span>
        <div class="spx-fmr-inputs">
          <label class="spx-fmr-item"><span>${tags[0]}</span><input id="${idPrefix}Front" type="number" step="${step}" value="${a}" /></label>
          <label class="spx-fmr-item"><span>${tags[1]}</span><input id="${idPrefix}Mid" type="number" step="${step}" value="${b}" /></label>
          <label class="spx-fmr-item"><span>${tags[2]}</span><input id="${idPrefix}Rear" type="number" step="${step}" value="${c}" /></label>
        </div>
      </div>`;
  }

  function buildSheetForm(ctx, mode) {
    const zh = ctx.lang === "zh-CN";
    const edit = mode === "edit";
    const sh = ctx.sheet || {};
    const wF = numVal(sh.widthFront, ctx.state.widthCm).toFixed(1);
    const wM = numVal(sh.widthMid, ctx.state.widthCm).toFixed(1);
    const wR = numVal(sh.widthRear, ctx.state.widthCm).toFixed(1);
    const dF = numVal(sh.deFront, ctx.state.colorDiff).toFixed(2);
    const dM = numVal(sh.deMid, ctx.state.colorDiff).toFixed(2);
    const dR = numVal(sh.deRear, ctx.state.colorDiff).toFixed(2);
    const act = edit ? "sheet-save" : "sheet-create";
    const actLabel = edit ? (zh ? "保存" : "Save") : zh ? "创建" : "Create";
    const fabricVal = sh.fabric || sh.fabricName || "";
    const colorVal = sh.color || sh.fabricColor || "";
    const barcodeVal = sh.barcode || "";
    return `
      <div class="spx-sheet-form">
        ${section(zh ? "条码" : "Barcode")}
        <div class="spx-barcode">
          <input id="popBarcode" type="text" placeholder="${zh ? "请输入或扫描条码" : "Scan barcode"}" value="${barcodeVal}" data-osk="1" />
          ${ghostBtn(zh ? "清除" : "Clear", 'data-act="bc-clear"')}
          ${ghostBtn(zh ? "扫描" : "Scan", 'data-act="bc-scan"')}
        </div>
        ${section(edit ? (zh ? "检验单修改" : "Edit Sheet") : zh ? "检验单录入" : "Sheet Entry")}
        <div class="spx-form-grid compact">
          ${field(zh ? "检验单" : "Check ID", `<input id="popCheckId" value="${sh.checkId || ""}" data-osk="1" />`)}
          ${field(zh ? "缸号" : "Lot", `<input id="popLot" value="${sh.lotNo || ""}" data-osk="1" />`)}
          ${field(zh ? "卷号" : "Roll", `<input id="popRoll" value="${sh.rollNo || ""}" data-osk="1" />`)}
          ${field(zh ? "颜色" : "Color", `<input id="popColor" value="${colorVal}" data-osk="1" />`)}
          ${field(zh ? "布料" : "Fabric", `<input id="popFabric" value="${fabricVal}" data-osk="1" />`)}
          ${field(zh ? "目标码长" : "Target", `<input id="popTarget" type="number" value="${(ctx.state && ctx.state.targetM) || 100}" data-osk="1" />`)}
        </div>
        ${
          edit
            ? `${section(zh ? "前 / 中 / 后" : "Front / Mid / Rear")}
        ${fmrRow(zh, zh ? "幅宽" : "Width", "popWidth", [wF, wM, wR], "0.1")}
        ${fmrRow(zh, zh ? "色差" : "ΔE", "popDe", [dF, dM, dR], "0.01")}`
            : `<label class="spx-check-row"><input id="popEmptySheet" type="checkbox" /> ${zh ? "创建空单" : "Empty sheet"}</label>`
        }
        <div class="spx-actions">${ghostBtn(actLabel, `data-act="${act}"`)}</div>
      </div>`;
  }

  function buildNewSheet(ctx) {
    return buildSheetForm(ctx, "create");
  }

  function buildEditSheet(ctx) {
    return buildSheetForm(ctx, "edit");
  }

  function buildFourPoints(ctx) {
    const zh = ctx.lang === "zh-CN";
    const escFp = (s) =>
      String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const fp = ctx.fourPoints || {
      total: 0,
      per100Sq: 0,
      per100: 0,
      counts: { I: 0, II: 0, III: 0, IV: 0 },
      rows: [],
      threshold: 40,
      isNg: false,
    };
    const c = fp.counts || {};
    const isNg = !!(fp.isNg || fp.ng);
    const result = fp.result || (isNg ? "NG" : "OK");
    const resultCls = isNg ? "bad" : "ok";
    const per100Label = fp.useYard
      ? (zh ? "百码" : "/100yd")
      : (zh ? "百米" : "/100m");
    const per100SqLabel = fp.useYard
      ? (zh ? "百平方码" : "/100yd²")
      : (zh ? "百平米" : "/100m²");
    const meterUnit = fp.useYard ? (zh ? "码" : "yd") : (zh ? "米" : "m");
    const fpStat = (key, k, v) =>
      `<div class="spx-fp-stat" data-fp-stat="${key}"><span class="spx-fp-stat-k">${k}</span><span class="spx-fp-stat-v" data-fp-val="${key}">${v}</span></div>`;
    const meterBlock =
      fp.meterIndex || fp.meterPoints || fp.meterGrade || fp.meterListText
        ? `<div class="spx-fp-meter" data-fp-meter="1">
             <div class="spx-fp-meter-head">${zh ? "当前米/码段" : "Current Segment"}</div>
             <div class="spx-fp-stats spx-fp-stats-meter">
               ${fpStat("meterIndex", zh ? "段号" : "Seg", `${fp.meterIndex || "-"} ${meterUnit}`)}
               ${fpStat("meterPoints", zh ? "本段扣分" : "Seg pts", String(fp.meterPoints || 0))}
               ${fpStat("meterGrade", zh ? "本段等级" : "Grade", fp.meterGrade || "-")}
             </div>
             ${
               fp.meterListText
                 ? `<pre class="spx-fp-meter-list" data-fp-val="meterList">${escFp(String(fp.meterListText))}</pre>`
                 : ""
             }
           </div>`
        : "";
    const rows = Array.isArray(fp.rows) ? fp.rows : [];
    const gradeRow = (name, count, mul) =>
      `<div class="spx-fp-grade" data-fp-grade="${name}">
         <span class="spx-fp-grade-name">${name}</span>
         <span class="spx-fp-grade-count" data-fp-val="grade${name}">${count || 0}</span>
         <span class="spx-fp-grade-mul">×${mul}</span>
       </div>`;
    return `
      <div class="spx-fp-panel" data-fp-panel="1">
        <div class="spx-fp-head">
          <div class="spx-fp-result ${resultCls}" data-fp-val="result">${result}</div>
          <div class="spx-fp-stats">
            ${fpStat("total", zh ? "总扣分" : "Total", String(fp.total != null ? fp.total : 0))}
            ${fpStat("per100Sq", per100SqLabel, Number(fp.per100Sq || 0).toFixed(2))}
            ${fpStat("per100", per100Label, Number(fp.per100 || 0).toFixed(2))}
            ${fpStat("threshold", zh ? "合格线" : "Limit", String(fp.threshold != null ? fp.threshold : 0))}
          </div>
        </div>
        <div class="spx-fp-grades">
          ${gradeRow("I", c.I, 4)}
          ${gradeRow("II", c.II, 3)}
          ${gradeRow("III", c.III, 2)}
          ${gradeRow("IV", c.IV, 1)}
        </div>
        ${meterBlock}
        <div class="spx-fp-detail">
          <div class="spx-fp-detail-h">
            <span>${zh ? "扣分详情" : "Deductions"}</span>
            <span class="spx-fp-detail-n" data-fp-val="rowCount">${rows.length}</span>
          </div>
          <div class="spx-defect-scroll spx-fp-scroll" data-fp-scroll="1">
            <table class="spx-table spx-fp-table">
              <thead>
                <tr>
                  <th class="col-idx">#</th>
                  <th class="col-name">${zh ? "疵点" : "Defect"}</th>
                  <th class="col-grade">${zh ? "级别" : "Gr"}</th>
                  <th class="col-pts">${zh ? "扣分" : "Pts"}</th>
                  <th class="col-y">Y</th>
                </tr>
              </thead>
              <tbody data-fp-rows="1">
                ${
                  rows.length
                    ? rows
                        .map(
                          (r) => `<tr>
                    <td class="col-idx mono">${r.id}</td>
                    <td class="col-name">${escFp(r.title || "")}</td>
                    <td class="col-grade">${escFp(String(r.grade || ""))}</td>
                    <td class="col-pts spx-v">${r.points}</td>
                    <td class="col-y mono">${Number(r.y).toFixed(1)}</td>
                  </tr>`
                        )
                        .join("")
                    : `<tr><td colspan="5" class="spx-msg">${zh ? "暂无疵点" : "No defects"}</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  /** 检验记录表头字段中文（对齐 debugsheet / InspectionListEntry） */
  const RECORDS_FIELD_LABELS = {
    ID: "编号",
    IsFinished: "检验状态",
    CheckID: "检验单号",
    Conclusion: "结论",
    ClothName: "布料名称",
    Color: "颜色",
    OrderSeries: "款号",
    LotNumber: "缸号",
    RollNumber: "匹号",
    Specification: "规格",
    Length: "长度",
    Width: "门幅",
    Customer: "客户",
    Source: "来源",
    StandardName: "标准名称",
    DefectLibraryName: "疵点库",
    Inspector: "检验员",
    CreateTime: "创建时间",
    StartTime: "开始时间",
    FinishTime: "结束时间",
    TotalCheckTime: "总检验时间",
    FourPointsScore: "四分制",
    Remarks: "备注",
    Report: "查看报告",
    PrintLabel: "打印",
    ValidDefectCount: "有效疵点",
    MissedDefectCount: "漏检数",
    FalseDefectCount: "误检数",
    DamagedDefectCount: "破损数",
    ContinuityDefectCount: "连续疵点",
    WidthAvgCm: "平均幅宽",
    WidthMinCm: "最小幅宽",
    WidthMaxCm: "最大幅宽",
    WidthRangeCm: "幅宽极差",
    NetWidthCm: "净幅宽",
    ColorDiffMax: "最大色差",
    ColorDiffAvg: "平均色差",
    ColorDiffCount: "色差次数",
    FabricBarCode: "布料条码",
    GrossWeight: "毛重",
    NetWeight: "净重",
    PointsPer100SquareMetre: "百平方码扣分",
    TotalPoints: "总扣分",
  };

  const RECORDS_FIXED_COL_COUNT = 4;
  const RECORDS_DEFAULT_COLS = [
    "InspectionSheets.ID",
    "IsFinished",
    "CheckID",
    "Conclusion",
    "ClothName",
    "Color",
    "OrderSeries",
    "LotNumber",
    "RollNumber",
    "Specification",
    "Length",
    "Width",
    "Customer",
    "Source",
    "InspectionSheets.StandardName",
    "DefectLibraryName",
    "InspectionSheets.Inspector",
    "CreateTime",
    "StartTime",
    "FinishTime",
    "TotalCheckTime",
    "FourPointsScore",
    "InspectionSheets.Remarks",
  ];

  function recordsColSuffix(columnName) {
    const name = String(columnName || "").trim();
    const dot = name.lastIndexOf(".");
    return (dot >= 0 ? name.slice(dot + 1) : name).trim();
  }

  function recordsColLabel(columnName, zh) {
    const suffix = recordsColSuffix(columnName);
    if (!zh) return suffix || columnName;
    return RECORDS_FIELD_LABELS[suffix] || suffix || columnName;
  }

  function recordsColSource(columnName) {
    const lower = String(columnName || "").toLowerCase();
    if (lower.indexOf("inspectionreports.") === 0) return "report";
    if (lower.indexOf("inspectionsheets.") === 0) return "sheet";
    const agg = {
      validdefectcount: 1,
      misseddefectcount: 1,
      falsedefectcount: 1,
      damageddefectcount: 1,
      continuitydefectcount: 1,
      widthavgcm: 1,
      widthmincm: 1,
      widthmaxcm: 1,
      widthrangecm: 1,
      widthbelowcount: 1,
      netwidthcm: 1,
      colordiffmax: 1,
      colordiffavg: 1,
      colordiffcount: 1,
    };
    if (agg[recordsColSuffix(columnName).toLowerCase()]) return "aggregate";
    return "other";
  }

  function recordsColsMatch(a, b) {
    return recordsColSuffix(a).toLowerCase() === recordsColSuffix(b).toLowerCase();
  }

  function recordsWidthClass(kind, suffix) {
    const s = String(suffix || "").toLowerCase();
    if (kind === "status") return "col-status";
    if (kind === "report") return "col-report";
    if (kind === "checkid") return "col-checkid";
    if (kind === "print") return "col-print";
    if (s === "id") return "col-id";
    if (/(length|width|score|points|weight|count|ratio|time)$/i.test(s) || s.indexOf("width") >= 0)
      return "col-num";
    if (/(time|date)$/i.test(s)) return "col-date";
    if (/(name|customer|remarks|source|specification|barcode)/i.test(s)) return "col-text";
    return "col-mid";
  }

  /** 表格展示列：固定前四列（状态/报告/单号/打印）+ ui_records_cols 其余字段 */
  function buildRecordsDisplayColumns(cols) {
    const list = (Array.isArray(cols) && cols.length ? cols : RECORDS_DEFAULT_COLS)
      .map((c) => String(c || "").trim())
      .filter(Boolean);
    const display = [
      { kind: "status", key: "IsFinished", width: "col-status" },
      { kind: "report", key: "Report", width: "col-report" },
      { kind: "checkid", key: "CheckID", width: "col-checkid" },
      { kind: "print", key: "PrintLabel", width: "col-print" },
    ];
    list.forEach((col) => {
      const suffix = recordsColSuffix(col);
      const low = suffix.toLowerCase();
      if (!suffix || low === "id" || low === "isfinished" || low === "checkid") return;
      display.push({
        kind: "field",
        key: suffix,
        col: col,
        width: recordsWidthClass("field", suffix),
      });
    });
    return display;
  }

  function recordsFieldValue(row, key) {
    if (!row) return "";
    const k = String(key || "");
    const low = k.toLowerCase();
    if (low === "checkid") return row.checkId != null ? row.checkId : "";
    if (low === "lotnumber") return row.lot != null ? row.lot : "";
    if (low === "rollnumber") return row.roll != null ? row.roll : "";
    if (low === "orderseries") return row.style != null ? row.style : "";
    if (low === "color") return row.color != null ? row.color : "";
    if (low === "clothname") return row.fabric != null ? row.fabric : "";
    if (low === "length") {
      const n = Number(row.lengthM);
      return Number.isFinite(n) ? n.toFixed(1) : "";
    }
    if (low === "inspector") return row.inspector || "";
    if (low === "conclusion") return row.conclusion || "";
    if (low === "createtime" || low === "starttime") return row.createDate || "";
    const fields = row.fields || {};
    let v = fields[k];
    if (v == null) v = fields[low];
    if (v == null && row.raw) {
      const raw = row.raw;
      const hit = Object.keys(raw).find((rk) => recordsColSuffix(rk).toLowerCase() === low);
      if (hit) v = raw[hit];
    }
    if (v == null || v === "") return "";
    if (typeof v === "number" && Number.isFinite(v)) {
      return Math.abs(v) >= 100 || Number.isInteger(v) ? String(v) : v.toFixed(2);
    }
    return String(v);
  }

  function buildRecordsColumnSettings(ctx, zh, rec) {
    const selected = (Array.isArray(rec.draftCols) && rec.draftCols.length
      ? rec.draftCols
      : Array.isArray(rec.cols) && rec.cols.length
        ? rec.cols
        : RECORDS_DEFAULT_COLS
    )
      .map((c) => String(c || "").trim())
      .filter(Boolean);
    const available = (Array.isArray(rec.availableCols) && rec.availableCols.length
      ? rec.availableCols
      : selected.slice()
    )
      .map((c) => String(c || "").trim())
      .filter(Boolean);
    const q = String(rec.settingsQuery || "").trim().toLowerCase();
    const activeIdx = rec.settingsActiveIdx != null ? Number(rec.settingsActiveIdx) : -1;

    const selectedHtml = selected
      .map((col, index) => {
        const locked = index < RECORDS_FIXED_COL_COUNT;
        const label = recordsColLabel(col, zh);
        const suffix = recordsColSuffix(col);
        const src = recordsColSource(col);
        const active = index === activeIdx ? " active-selected" : "";
        const lockedCls = locked ? " selected-locked" : "";
        return `<button type="button" class="spx-rec-col-chip source-${src}${lockedCls}${active}"
            data-act="rec-col-select" data-index="${index}" data-column="${escapeAttr(col)}"
            title="${escapeAttr(locked ? (zh ? "前 4 列固定" : "Fixed") : col)}">
            <span class="field-order">${index + 1}</span>
            <span class="field-name">${escapeAttr(label)}</span>
            <span class="field-key">${escapeAttr(suffix)}</span>
            ${locked ? "" : `<span class="field-remove" data-act="rec-col-remove" data-index="${index}" title="${zh ? "移除" : "Remove"}">×</span>`}
          </button>`;
      })
      .join("");

    const availableHtml = available
      .filter((col) => {
        if (!q) return true;
        const label = recordsColLabel(col, true).toLowerCase();
        const suffix = recordsColSuffix(col).toLowerCase();
        return label.indexOf(q) >= 0 || suffix.indexOf(q) >= 0 || String(col).toLowerCase().indexOf(q) >= 0;
      })
      .map((col) => {
        const selectedAlready = selected.some((s) => recordsColsMatch(s, col));
        const lockedSelected =
          selectedAlready &&
          selected.findIndex((s) => recordsColsMatch(s, col)) < RECORDS_FIXED_COL_COUNT;
        const label = recordsColLabel(col, zh);
        const suffix = recordsColSuffix(col);
        const src = recordsColSource(col);
        return `<label class="spx-rec-col-item source-${src}${selectedAlready ? " is-selected" : ""}"
            data-act="rec-col-toggle" data-column="${escapeAttr(col)}">
            <input type="checkbox" data-column="${escapeAttr(col)}"
              ${selectedAlready ? "checked" : ""} ${lockedSelected ? "disabled" : ""} />
            <span class="col-name">${escapeAttr(label)}</span>
            <span class="col-key">${escapeAttr(suffix)}</span>
          </label>`;
      })
      .join("") || `<div class="spx-muted">${zh ? "无匹配字段" : "No fields"}</div>`;

    return `
      <div class="spx-rec-settings-modal active" id="popRecSettings">
        <div class="spx-rec-settings-mask" data-act="rec-col-close" title="${zh ? "关闭" : "Close"}"></div>
        <div class="spx-rec-settings-card" role="dialog" aria-modal="true" aria-label="${zh ? "列显示设置" : "Column settings"}">
          <div class="spx-rec-settings-head">
            <div>
              <div class="spx-rec-settings-title">${zh ? "列显示设置" : "Column settings"}</div>
              <div class="spx-rec-settings-tip">${zh
                ? "左侧勾选字段，右侧调整顺序。前 4 列（编号/状态/单号/结论）固定不可移除。"
                : "Select on the left, reorder on the right. First 4 columns are fixed."}</div>
            </div>
            <button type="button" class="spx-rec-settings-x" data-act="rec-col-close" title="${zh ? "关闭" : "Close"}">&times;</button>
          </div>
          <div class="spx-rec-settings-actions">
            <button type="button" class="ghost-btn compact" data-act="rec-col-top" ${activeIdx < RECORDS_FIXED_COL_COUNT ? "disabled" : ""}>${zh ? "置顶" : "Top"}</button>
            <button type="button" class="ghost-btn compact" data-act="rec-col-up" ${activeIdx < RECORDS_FIXED_COL_COUNT ? "disabled" : ""}>${zh ? "上移" : "Up"}</button>
            <button type="button" class="ghost-btn compact" data-act="rec-col-down" ${activeIdx < 0 || activeIdx >= selected.length - 1 || activeIdx < RECORDS_FIXED_COL_COUNT ? "disabled" : ""}>${zh ? "下移" : "Down"}</button>
            <button type="button" class="ghost-btn compact" data-act="rec-col-bottom" ${activeIdx < RECORDS_FIXED_COL_COUNT ? "disabled" : ""}>${zh ? "置底" : "Bottom"}</button>
            <span class="spx-records-sep"></span>
            <button type="button" class="ghost-btn compact" data-act="rec-col-save">${zh ? "保存" : "Save"}</button>
            <button type="button" class="ghost-btn compact" data-act="rec-col-close">${zh ? "取消" : "Cancel"}</button>
          </div>
          <div class="spx-rec-settings-body">
            <div class="spx-rec-settings-panel">
              <div class="spx-rec-settings-panel-h">
                <span>${zh ? "可选字段" : "Available"}</span>
                <input id="popRecColSearch" type="text" value="${escapeAttr(rec.settingsQuery || "")}"
                  placeholder="${zh ? "搜索字段" : "Search"}" data-osk="1" data-act="rec-col-search" />
              </div>
              <div class="spx-rec-col-list" id="popRecColAvailable">${availableHtml}</div>
            </div>
            <div class="spx-rec-settings-panel">
              <div class="spx-rec-settings-panel-h">
                <span>${zh ? "已选顺序" : "Selected order"} <b>${selected.length}</b></span>
              </div>
              <div class="spx-rec-col-selected" id="popRecColSelected">${selectedHtml ||
                `<div class="spx-muted">${zh ? "暂无已选字段" : "No columns"}</div>`}</div>
            </div>
          </div>
          <p class="spx-msg" id="popRecColMsg"></p>
        </div>
      </div>`;
  }

  /** 按可视高度估算单页行数，使表格一页刚好铺满、无需纵向滚动 */
  function calcRecordsPageSize(rec) {
    const fixed = rec && Number(rec.pageSize);
    if (Number.isFinite(fixed) && fixed >= 3) return Math.min(40, Math.floor(fixed));
    let h = 720;
    try {
      if (typeof window !== "undefined" && window.innerHeight) h = window.innerHeight;
    } catch (_) { /* ignore */ }
    // 顶栏标题~48 + toolbar~58 + pager~44 + padding/gap~28 + thead~36
    const avail = Math.max(160, h - 48 - 58 - 44 - 28 - 36);
    const rowH = 38;
    return Math.max(5, Math.min(30, Math.floor(avail / rowH)));
  }

  function recordsPanelFrameUrl(rec, panel, lang) {
    const api = global.SpxApi;
    if (panel === "dyeing") {
      const raw = (rec && rec.dyeingUrl) || "http://localhost:1234/views/bfslotreport";
      if (api && typeof api.resolveRecordsPanelUrl === "function") {
        return api.resolveRecordsPanelUrl(raw, "/views/bfslotreport", lang, "embedded=1&theme=spx");
      }
      return String(raw);
    }
    if (panel === "runstat") {
      const raw = (rec && rec.runStatUrl) || "http://localhost:1234/views/bfsrunstat";
      if (api && typeof api.resolveRecordsPanelUrl === "function") {
        return api.resolveRecordsPanelUrl(raw, "/views/bfsrunstat", lang, "theme=spx");
      }
      return String(raw);
    }
    return "";
  }

  /** DetectionRecords.cpp — 筛选栏 + 库配置列 + 底部分页；设置按钮配置列选择/顺序 */
  function buildRecords(ctx) {
    const zh = ctx.lang === "zh-CN";
    const rec = (ctx.state && ctx.state.recordsUi) || {};
    const enableDyeing = rec.enableDyeing !== false && rec.enableDyeing !== 0 && rec.enableDyeing !== "0";
    const enableRunStat = rec.enableRunStat !== false && rec.enableRunStat !== 0 && rec.enableRunStat !== "0";
    let panel = String(rec.panel || "sheets");
    if (panel === "dyeing" && !enableDyeing) panel = "sheets";
    if (panel === "runstat" && !enableRunStat) panel = "sheets";
    const showPanelTabs = enableDyeing || enableRunStat;
    const filter = rec.filter != null ? Number(rec.filter) : 0; // 0全部 1已检 2未检
    const queryType = rec.queryType != null ? Number(rec.queryType) : 0;
    const queryValue = rec.queryValue != null ? String(rec.queryValue) : "";
    const page = Math.max(1, Number(rec.page) || 1);
    const pageSize = calcRecordsPageSize(rec);
    const totalLen = Number(rec.totalLengthM != null ? rec.totalLengthM : (ctx.state && ctx.state.todayM) || 1260);
    const cols = Array.isArray(rec.cols) && rec.cols.length ? rec.cols : RECORDS_DEFAULT_COLS;
    const displayCols = buildRecordsDisplayColumns(cols);
    const settingsOpen = !!rec.settingsOpen;

    const allRows = (ctx.recordRows && ctx.recordRows.length)
      ? ctx.recordRows
      : defaultRecordRows(zh);

    let filtered = allRows;
    if (filter === 1) filtered = allRows.filter((r) => r.finished);
    else if (filter === 2) filtered = allRows.filter((r) => !r.finished);

    const q = queryValue.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((r) => {
        if (queryType === 0) return String(r.checkId).toLowerCase().includes(q);
        if (queryType === 1) return String(r.lot).toLowerCase().includes(q);
        if (queryType === 2) return String(r.style).toLowerCase().includes(q);
        if (queryType === 5) return String(r.color).toLowerCase().includes(q);
        return true;
      });
    }
    if (queryType === 3 && rec.queryDate) {
      filtered = filtered.filter((r) => String(r.createDate) === String(rec.queryDate));
    }
    if (queryType === 4 && rec.queryDate && rec.queryDate2) {
      filtered = filtered.filter((r) => r.createDate >= rec.queryDate && r.createDate <= rec.queryDate2);
    }

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const cur = Math.min(page, pages);
    const start = (cur - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);
    // 供 embed 按可视高度回写 pageSize 时钳制页码
    try {
      if (ctx.state && ctx.state.recordsUi) {
        ctx.state.recordsUi._lastTotal = total;
        ctx.state.recordsUi.page = cur;
        if (!Number.isFinite(Number(ctx.state.recordsUi.pageSize)) || Number(ctx.state.recordsUi.pageSize) < 3) {
          ctx.state.recordsUi.pageSize = pageSize;
        }
      }
    } catch (_) { /* ignore */ }

    const tab = (id, label) =>
      `<button type="button" class="ghost-btn compact ${filter === id ? "active" : ""}" data-act="rec-filter" data-filter="${id}">${label}</button>`;

    const showDate = queryType === 3 || queryType === 4;
    const showDate2 = queryType === 4;
    const showValue = queryType !== 3 && queryType !== 4;

    const queryOpts = [
      [0, zh ? "检验单号" : "Check ID"],
      [1, zh ? "缸号" : "Lot"],
      [2, zh ? "款号" : "Style"],
      [3, zh ? "日期" : "Date"],
      [4, zh ? "日期范围" : "Date range"],
      [5, zh ? "颜色" : "Color"],
    ]
      .map(([v, lab]) => `<option value="${v}" ${queryType === v ? "selected" : ""}>${lab}</option>`)
      .join("");

    const headCells = displayCols
      .map((c) => {
        let title = c.key;
        if (c.kind === "status") title = zh ? "检验状态" : "Status";
        else if (c.kind === "report") title = zh ? "查看报告" : "Report";
        else if (c.kind === "checkid") title = zh ? "检验单号" : "Check ID";
        else if (c.kind === "print") title = zh ? "打印" : "Print";
        else title = recordsColLabel(c.col || c.key, zh);
        return `<th class="${c.width}">${title}</th>`;
      })
      .join("");

    const bodyRows = pageRows
      .map((r) => {
        const cells = displayCols
          .map((c) => {
            if (c.kind === "status") {
              const status = r.finished
                ? `<span class="spx-rec-status ok">${zh ? "已检验" : "Done"}</span>`
                : `<span class="spx-rec-status warn">${zh ? "未检验" : "Open"}</span>`;
              return `<td class="${c.width}">${status}</td>`;
            }
            if (c.kind === "report") {
              const actionLabel = r.finished
                ? (zh ? "查看报告" : "Report")
                : (zh ? "检验此单" : "Inspect");
              return `<td class="${c.width}"><button type="button" class="ghost-btn compact" data-act="rec-order" data-id="${escapeAttr(r.id)}" data-checkid="${escapeAttr(r.checkId)}" data-finished="${r.finished ? 1 : 0}">${actionLabel}</button></td>`;
            }
            if (c.kind === "checkid") {
              return `<td class="${c.width}"><button type="button" class="ghost-btn compact mono" data-act="rec-checkid" data-id="${escapeAttr(r.id)}" data-checkid="${escapeAttr(r.checkId)}">${escapeAttr(r.checkId)}</button></td>`;
            }
            if (c.kind === "print") {
              return `<td class="${c.width}"><button type="button" class="ghost-btn compact" data-act="rec-print" data-id="${escapeAttr(r.id)}" data-checkid="${escapeAttr(r.checkId)}">${zh ? "打印" : "Print"}</button></td>`;
            }
            const text = recordsFieldValue(r, c.key);
            const mono = c.width === "col-num" || c.width === "col-date" ? " mono" : "";
            return `<td class="${c.width}${mono}" title="${escapeAttr(text)}">${escapeAttr(text || "—")}</td>`;
          })
          .join("");
        return `<tr data-rec-id="${r.id}">${cells}</tr>`;
      })
      .join("") ||
      `<tr><td colspan="${displayCols.length}" class="spx-muted">${zh ? "无匹配记录" : "No matching records"}</td></tr>`;

    const minWidth = Math.max(720, 88 + 96 + 140 + 72 + Math.max(0, displayCols.length - 4) * 96);
    const dyeingSrc = enableDyeing ? recordsPanelFrameUrl(rec, "dyeing", ctx.lang) : "";
    const runStatSrc = enableRunStat ? recordsPanelFrameUrl(rec, "runstat", ctx.lang) : "";
    const panelTab = (id, label) =>
      `<button type="button" class="ghost-btn compact ${panel === id ? "active" : ""}" data-act="rec-panel" data-panel="${id}">${label}</button>`;

    const panelTabsHtml = showPanelTabs
      ? `<div class="spx-records-panel-tabs" id="popRecPanelTabs">
            ${panelTab("sheets", zh ? "检验记录" : "Records")}
            ${enableDyeing ? panelTab("dyeing", zh ? "缸报告" : "Dyeing") : ""}
            ${enableRunStat ? panelTab("runstat", zh ? "运行统计" : "Run Stat") : ""}
          </div>`
      : "";

    const sheetsPane = `
        <div class="spx-records-sheet-pane" data-rec-pane="sheets" ${panel === "sheets" ? "" : "hidden"}>
          <div class="spx-records-toolbar">
            <div class="spx-records-tabs">
              ${tab(0, zh ? "全部检验单" : "All")}
              ${tab(1, zh ? "已检验" : "Finished")}
              ${tab(2, zh ? "未检验" : "Unfinished")}
              <button type="button" class="ghost-btn compact" data-act="rec-export">${zh ? "导出数据" : "Export"}</button>
              <button type="button" class="ghost-btn compact" data-act="rec-total-len">${zh ? "检验长度" : "Length"} ${totalLen.toFixed(0)} m</button>
              <button type="button" class="ghost-btn compact${settingsOpen ? " active" : ""}" data-act="rec-settings" title="${zh ? "列设置" : "Columns"}">${zh ? "设置" : "Settings"}</button>
            </div>
            <div class="spx-records-query">
              <select id="popRecQueryType" class="spx-records-filter" aria-label="${zh ? "过滤项目" : "Filter"}">${queryOpts}</select>
              <input id="popRecQueryValue" type="text" value="${queryValue}" placeholder="${zh ? "查询内容" : "Query"}" data-osk="1" ${showValue ? "" : "hidden"} />
              <input id="popRecDate" type="date" value="${rec.queryDate || ""}" ${showDate ? "" : "hidden"} />
              <input id="popRecDate2" type="date" value="${rec.queryDate2 || ""}" ${showDate2 ? "" : "hidden"} />
              <button type="button" class="ghost-btn compact" data-act="rec-search" title="${zh ? "搜索" : "Search"}">⌕</button>
            </div>
          </div>
          <div class="spx-records-table-wrap">
            <table class="spx-table spx-records-table" style="min-width:${minWidth}px">
              <thead>
                <tr>${headCells}</tr>
              </thead>
              <tbody>${bodyRows}</tbody>
            </table>
          </div>
          <div class="spx-records-pager">
            <div class="spx-records-pager-ctrl">
              <button type="button" class="ghost-btn compact" data-act="rec-page" data-page="1" ${cur <= 1 ? "disabled" : ""}>${zh ? "首页" : "First"}</button>
              <button type="button" class="ghost-btn compact" data-act="rec-page" data-page="${cur - 1}" ${cur <= 1 ? "disabled" : ""}>${zh ? "上页" : "Prev"}</button>
              <button type="button" class="ghost-btn compact" data-act="rec-page" data-page="${cur + 1}" ${cur >= pages ? "disabled" : ""}>${zh ? "下页" : "Next"}</button>
              <button type="button" class="ghost-btn compact" data-act="rec-page" data-page="${pages}" ${cur >= pages ? "disabled" : ""}>${zh ? "末页" : "Last"}</button>
              <span class="spx-records-sep"></span>
              <span class="mono">${zh ? "第" : "P"}</span>
              <input id="popRecJump" type="number" min="1" max="${pages}" value="${cur}" data-osk="1" />
              <span class="mono">${zh ? "页" : ""}</span>
              <button type="button" class="ghost-btn compact" data-act="rec-jump">${zh ? "跳转" : "Go"}</button>
            </div>
            <div class="spx-records-pager-meta mono">
              <span>${zh ? "共" : ""} <b id="popRecPages">${pages}</b> ${zh ? "页" : "pages"}</span>
              <span class="spx-records-sep"></span>
              <span>${zh ? "共" : ""} <b id="popRecTotal">${total}</b> ${zh ? "记录" : "records"}</span>
            </div>
          </div>
        </div>`;

    const dyeingPane = enableDyeing
      ? `<div class="spx-records-frame-pane" data-rec-pane="dyeing" ${panel === "dyeing" ? "" : "hidden"}>
            <iframe class="spx-records-frame" title="${zh ? "缸报告" : "Dyeing report"}"
              ${panel === "dyeing" ? `src="${escapeAttr(dyeingSrc)}"` : `data-src="${escapeAttr(dyeingSrc)}"`}
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>`
      : "";
    const runStatPane = enableRunStat
      ? `<div class="spx-records-frame-pane" data-rec-pane="runstat" ${panel === "runstat" ? "" : "hidden"}>
            <iframe class="spx-records-frame" title="${zh ? "运行统计" : "Run statistics"}"
              ${panel === "runstat" ? `src="${escapeAttr(runStatSrc)}"` : `data-src="${escapeAttr(runStatSrc)}"`}
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>`
      : "";

    return `
      <div class="spx-records${settingsOpen ? " is-settings" : ""}${showPanelTabs ? " has-panel-tabs" : ""}" data-panel="${panel}">
        ${panelTabsHtml}
        ${sheetsPane}
        ${dyeingPane}
        ${runStatPane}
        ${settingsOpen ? buildRecordsColumnSettings(ctx, zh, rec) : ""}
      </div>`;
  }

  function defaultRecordRows(zh) {
    const fabric = "Twill 280GSM";
    const inspector = zh ? "操作员" : "Operator";
    return Array.from({ length: 28 }, (_, i) => {
      const finished = i % 3 !== 2;
      const day = String(19 - (i % 10)).padStart(2, "0");
      const checkId = `CK-202611${day}-${String(17 - (i % 17)).padStart(2, "0")}`;
      const lot = `L-884${21 + (i % 5)}`;
      const roll = `R-${17 - (i % 12)}`;
      const style = `ST-${100 + (i % 7)}`;
      const color = ["Navy", "Black", "Ivory", "Grey"][i % 4];
      const lengthM = 88 + (i % 9) * 2.5;
      const createDate = `2026-11-${day}`;
      const conclusion = finished ? (i % 5 === 0 ? "NG" : "OK") : "";
      const fields = {
        ID: 1200 - i,
        IsFinished: finished ? 1 : 0,
        CheckID: checkId,
        LotNumber: lot,
        RollNumber: roll,
        OrderSeries: style,
        Color: color,
        ClothName: fabric,
        Length: lengthM,
        CreateTime: createDate,
        Inspector: inspector,
        Conclusion: conclusion,
        Specification: "45x45",
        Width: 150 + (i % 5),
        Customer: "Demo",
        Source: "ERP",
        StandardName: "4-Point",
        DefectLibraryName: "Default",
        StartTime: createDate,
        FinishTime: finished ? createDate : "",
        TotalCheckTime: finished ? 12 + (i % 7) : "",
        FourPointsScore: finished ? 8 + (i % 6) : "",
        Remarks: "",
      };
      Object.keys(fields).forEach((k) => {
        fields[k.toLowerCase()] = fields[k];
      });
      return {
        id: 1200 - i,
        finished,
        checkId,
        lot,
        roll,
        style,
        color,
        fabric,
        lengthM,
        createDate,
        inspector,
        conclusion,
        fields,
        raw: fields,
      };
    });
  }

  function spxSwitch(id, checked, extraClass, dataAttrs) {
    return `<label class="spx-switch">
      <input type="checkbox" id="${id}" class="${extraClass || ""}" ${dataAttrs || ""} ${checked ? "checked" : ""} />
      <span class="spx-switch-track" aria-hidden="true"><span class="spx-switch-thumb"></span></span>
    </label>`;
  }

  function defectStep(id, value) {
    const v = Number(value) || 0;
    return `
      <div class="spx-def-step" data-step-id="${id}" data-min="0" data-max="9999" data-step="1">
        <button type="button" class="spx-def-val-btn mono" data-act="def-step-edit" data-target="${id}" aria-haspopup="dialog">${v}</button>
        <input id="${id}" class="spx-def-val" type="hidden" value="${v}" />
      </div>`;
  }

  function defectPrec(id, value) {
    return `
      <div class="spx-def-prec">
        <input id="${id}" type="range" min="0" max="100" step="1" value="${value}" data-act="def-prec" />
        <span class="spx-v" id="${id}Val">${value}</span>
      </div>`;
  }

  function escapeAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildDefectSettings(ctx) {
    const zh = ctx.lang === "zh-CN";
    const ui = (ctx && ctx.defectSettingsUi) || {};
    const demoDefs = [
      { id: 1, name: "Knot", on: true, auto: true, prec: 55, minX: 2, maxX: 80, minY: 2, maxY: 80 },
      { id: 2, name: "Hole", on: true, auto: true, prec: 60, minX: 3, maxX: 100, minY: 3, maxY: 100 },
      { id: 3, name: "Stain", on: true, auto: false, prec: 45, minX: 4, maxX: 120, minY: 4, maxY: 120 },
      { id: 4, name: "Slub", on: false, auto: false, prec: 50, minX: 2, maxX: 60, minY: 2, maxY: 60 },
      { id: 5, name: "Broken", on: true, auto: true, prec: 58, minX: 5, maxX: 150, minY: 5, maxY: 150 },
    ];
    // 已从后台加载过则不要回落 demo（否则切布种失败/空数据时看起来像“没刷新”）
    const hasLoaded = ui.loaded === true || (Array.isArray(ui.defects) && ui.defects.length > 0);
    const defs = Array.isArray(ui.defects) && ui.defects.length
      ? ui.defects
      : hasLoaded
        ? []
        : demoDefs;
    const cloths = Array.isArray(ui.cloths) && ui.cloths.length
      ? ui.cloths
      : hasLoaded
        ? []
        : [
            { id: "demo1", name: "Twill 280GSM" },
            { id: "demo2", name: "Plain 200GSM" },
            { id: "demo3", name: "Denim 12oz" },
          ];
    const clothId = ui.clothId != null && ui.clothId !== ""
      ? String(ui.clothId)
      : cloths.length
        ? String(cloths[0].id)
        : "";
    const clothTabs = cloths
      .map((c) => {
        const id = String(c.id);
        const name = c.name === "__default__" ? (zh ? "默认方案" : "Default") : String(c.name || id);
        const active = id === clothId ? " active" : "";
        return `<button type="button" class="spx-defect-cloth-tab${active}" data-act="defect-settings-cloth" data-cloth="${escapeAttr(id)}" title="${escapeAttr(name)}">${escapeAttr(name)}</button>`;
      })
      .join("");
    const emptyRow = !defs.length
      ? `<tr><td colspan="9" class="spx-muted">${zh ? "暂无疵点参数" : "No defect settings"}</td></tr>`
      : "";
    const loadingHint = ui.loaded === false
      ? `<div class="spx-muted" style="padding:8px 4px;">${zh ? "正在加载后台参数…" : "Loading…"}</div>`
      : "";
    const isAdmin = !!(ctx.about && ctx.about.isAdmin);
    const ico = (paths) =>
      `<svg class="spx-defect-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    const defectIcoBtn = (label, act, paths, extraClass) =>
      `<button type="button" class="ghost-btn compact spx-defect-ico-btn${extraClass ? " " + extraClass : ""}" data-act="${act}" title="${escapeAttr(label)}" aria-label="${escapeAttr(label)}"><span class="spx-defect-ico-wrap">${ico(paths)}</span><span class="spx-defect-ico-lab">${escapeAttr(label)}</span></button>`;
    const customBtn = isAdmin
      ? defectIcoBtn(
          zh ? "自定义" : "Custom",
          "defect-settings-custom",
          '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 12.5h8M8 16h5"/><path d="M17.5 16.5l2 2M19 14.2a1.8 1.8 0 1 0 0 3.6"/>'
        )
      : "";
    return `
      <div class="spx-defect-panel">
        <div class="spx-toolbar spx-defect-toolbar">
          <div class="spx-defect-cloth-bar">
            <button type="button" class="ghost-btn compact spx-defect-cloth-nav" data-act="defect-settings-cloth-prev" title="${zh ? "上一组布料" : "Prev cloths"}" aria-label="${zh ? "上一组布料" : "Prev cloths"}">‹</button>
            <div class="spx-defect-cloth-tabs" id="popDefectClothTabs" role="tablist" aria-label="${zh ? "布种" : "Cloth"}">
              ${clothTabs || `<span class="spx-muted">${zh ? "暂无布种" : "No cloth"}</span>`}
            </div>
            <button type="button" class="ghost-btn compact spx-defect-cloth-nav" data-act="defect-settings-cloth-next" title="${zh ? "下一组布料" : "Next cloths"}" aria-label="${zh ? "下一组布料" : "Next cloths"}">›</button>
            <button type="button" class="ghost-btn compact spx-defect-cloth-add-btn" data-act="defect-settings-cloth-add" title="${zh ? "新增布料" : "Add cloth"}">+</button>
            <input type="hidden" id="popDefectCloth" value="${escapeAttr(clothId)}" />
          </div>
          <div class="spx-toolbar-actions">
            ${defectIcoBtn(zh ? "全开" : "All On", "defect-settings-all-on", '<rect x="3" y="5" width="18" height="10" rx="5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="3.2" fill="#12161e" stroke="none"/><path d="M7.2 10.1l1.5 1.5 2.8-3.2" stroke="#12161e" stroke-width="2"/>', "is-on")}
            ${defectIcoBtn(zh ? "全关" : "All Off", "defect-settings-all-off", '<rect x="3" y="5" width="18" height="10" rx="5"/><circle cx="8" cy="10" r="3.2"/><path d="M14.2 8.2l3.6 3.6M17.8 8.2l-3.6 3.6"/>', "is-off")}
            ${customBtn}
            ${defectIcoBtn(zh ? "保存" : "Save", "defect-settings-save", '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h8V4M8 20v-7h8v7"/>')}
            ${defectIcoBtn(zh ? "刷新" : "Refresh", "defect-settings-refresh", '<path d="M19 8.2A7.2 7.2 0 1 0 19.4 14"/><path d="M16.8 4.2l2.8 3.6-4 .2"/>')}
          </div>
        </div>
        <div class="spx-defect-cloth-add" id="popDefectClothAdd" hidden>
          <input id="popDefectClothName" type="text" maxlength="64" placeholder="${zh ? "输入布料名称" : "Cloth name"}" data-osk="1" autocomplete="off" />
          <button type="button" class="ghost-btn compact" data-act="defect-settings-cloth-add-ok">${zh ? "确定" : "OK"}</button>
          <button type="button" class="ghost-btn compact" data-act="defect-settings-cloth-add-cancel">${zh ? "取消" : "Cancel"}</button>
        </div>
        ${loadingHint}
        <div class="spx-defect-scroll">
          <table class="spx-table spx-defect-table">
            <thead>
              <tr>
                <th class="col-idx">#</th>
                <th class="col-name">${zh ? "疵点" : "Defect"}</th>
                <th class="col-sw">${zh ? "检测" : "On"}</th>
                <th class="col-prec">${zh ? "精度" : "Prec"}</th>
                <th class="col-step">MinX</th>
                <th class="col-step">MaxX</th>
                <th class="col-step">MinY</th>
                <th class="col-step">MaxY</th>
                <th class="col-sw">${zh ? "自动贴标" : "Auto"}</th>
              </tr>
            </thead>
            <tbody>
              ${emptyRow ||
                defs
                  .map((d) => {
                    const id = escapeAttr(d.id);
                    const name = escapeAttr(d.name);
                    return `<tr data-defect-id="${id}" data-name="${name}" class="${d.on ? "on" : ""}">
                  <td class="col-idx mono">${id}</td>
                  <td class="col-name"><span class="spx-v">${name}</span></td>
                  <td class="col-sw">${spxSwitch(`popDefOn${id}`, !!d.on, "spx-def-on", `data-id="${id}"`)}</td>
                  <td class="col-prec">${defectPrec(`popDefPrec${id}`, Number(d.prec) || 0)}</td>
                  <td class="col-step">${defectStep(`popDefMinX${id}`, Number(d.minX) || 0)}</td>
                  <td class="col-step">${defectStep(`popDefMaxX${id}`, Number(d.maxX) || 0)}</td>
                  <td class="col-step">${defectStep(`popDefMinY${id}`, Number(d.minY) || 0)}</td>
                  <td class="col-step">${defectStep(`popDefMaxY${id}`, Number(d.maxY) || 0)}</td>
                  <td class="col-sw">${spxSwitch(`popDefAuto${id}`, !!d.auto)}</td>
                </tr>`;
                  })
                  .join("")}
            </tbody>
          </table>
        </div>
        <div class="spx-def-step-editor" id="popDefStepEditor" hidden role="dialog" aria-label="${zh ? "大小调节" : "Size edit"}">
          <button type="button" class="mini-btn" data-act="def-step-editor-delta" data-delta="-1" tabindex="-1">−</button>
          <input id="popDefStepEditorVal" class="spx-def-val" type="number" min="0" max="9999" step="1" inputmode="numeric" data-osk="1" />
          <button type="button" class="mini-btn" data-act="def-step-editor-delta" data-delta="1" tabindex="-1">+</button>
        </div>
        <div class="spx-defect-custom-modal" id="popDefectCustom" hidden>
          <div class="spx-defect-custom-mask" data-act="defect-settings-custom-close" title="${zh ? "关闭" : "Close"}"></div>
          <div class="spx-defect-custom-card" role="dialog" aria-modal="true" aria-label="${zh ? "自定义疵点类型" : "Custom defect types"}">
            <div class="spx-defect-custom-head">
              <div>
                <div class="spx-defect-custom-title">${zh ? "自定义疵点类型" : "Custom Defect Types"}</div>
                <div class="spx-defect-custom-tip">${zh ? "勾选表示该类型启动启用（写入 defects.IsDefaultCheck）" : "Checked = enabled at startup (defects.IsDefaultCheck)"}</div>
              </div>
              <button type="button" class="spx-defect-custom-x" data-act="defect-settings-custom-close" aria-label="close">&times;</button>
            </div>
            <div class="spx-defect-custom-actions">
              <button type="button" class="ghost-btn compact" data-act="defect-settings-custom-select-all">${zh ? "全选" : "Select all"}</button>
              <button type="button" class="ghost-btn compact" data-act="defect-settings-custom-select-none">${zh ? "全不选" : "Deselect"}</button>
              <button type="button" class="ghost-btn compact" id="popDefectCustomFilterBtn" data-act="defect-settings-custom-filter">${zh ? "只显示已启用" : "Enabled only"}</button>
              <span class="spx-records-sep"></span>
              <button type="button" class="ghost-btn compact" data-act="defect-settings-custom-save">${zh ? "保存" : "Save"}</button>
              <button type="button" class="ghost-btn compact" data-act="defect-settings-custom-close">${zh ? "关闭" : "Close"}</button>
            </div>
            <div class="spx-defect-custom-search">
              <input id="popDefectCustomSearch" type="text" data-osk="1" placeholder="${zh ? "搜索疵点ID或名称…" : "Search ID or name…"}" data-act="defect-settings-custom-search" autocomplete="off" />
            </div>
            <div class="spx-defect-custom-scroll">
              <table class="spx-table spx-defect-custom-table">
                <thead>
                  <tr>
                    <th class="col-sw">${zh ? "启用" : "On"}</th>
                    <th class="col-idx">ID</th>
                    <th class="col-name">${zh ? "标准名称" : "Name"}</th>
                    <th class="col-name">${zh ? "客户名称" : "Customer"}</th>
                    <th class="col-sw">${zh ? "状态" : "Status"}</th>
                  </tr>
                </thead>
                <tbody id="popDefectCustomBody">
                  <tr><td colspan="5" class="spx-muted">${zh ? "正在加载…" : "Loading…"}</td></tr>
                </tbody>
              </table>
            </div>
            <p class="spx-msg" id="popDefectCustomMsg"></p>
          </div>
        </div>
      </div>`;
  }

  function buildFinish(ctx) {
    const zh = ctx.lang === "zh-CN";
    const lenU = normalizeLengthUnit(ctx.state && ctx.state.lengthUnit);
    const lenShow = lengthFromMeters(Number(ctx.state && ctx.state.lengthM || 0), lenU).toFixed(1);
    return `
      <div class="spx-info">
        <div class="spx-info-icon" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? `确认结束当前检验单 ${ctx.sheet.checkId}？已验 ${lenShow} ${lenU}。`
            : `Finish sheet ${ctx.sheet.checkId}? Inspected ${lenShow} ${lenU}.`
        }</p>
        <div class="spx-actions center">
          ${ghostBtn(zh ? "取消" : "No", 'data-act="finish-no"')}
          <button type="button" class="run-btn running" data-act="finish-yes">${zh ? "确认结束" : "Yes"}</button>
        </div>
      </div>`;
  }

  /** slot_show("noclothstop") → NoClothStopDialog：无布 / 断布 / 取消 + 回零复选 */
  function buildNoClothStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    const zeroOn = !!(ctx.state && ctx.state.noClothStopZeroAfter);
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? "无布传感器触发，是否无布？"
            : "No fabric detected! Please check the fabric position. Click Yes if no fabric is present."
        }</p>
        <label class="spx-check spx-info-check">
          <input type="checkbox" id="popNoClothZero" ${zeroOn ? "checked" : ""} />
          <span>${zh ? "无布确认后执行回零" : "After confirming no fabric, perform machine zero"}</span>
        </label>
        <div class="spx-actions center">
          ${ghostBtn(zh ? "取消" : "Cancel", 'data-act="nocloth-cancel"')}
          <button type="button" class="run-btn running" data-act="nocloth-yes">${zh ? "无布" : "No fabric / end roll"}</button>
          ${ghostBtn(zh ? "断布" : "Broken web", 'data-act="nocloth-no"')}
        </div>
      </div>`;
  }

  /** slot_show("empty_sheet_stop") → IsEmptySheetFinish */
  function buildEmptySheetStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${zh ? "空单是否完成？" : "Is the empty sheet finished?"}</p>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="empty-sheet-yes">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  /** slot_show("noclothstop_clothfinish") → IsFabricInspected */
  function buildNoClothStopClothFinish(ctx) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? "无布后停机，是否完成此卷布料检验？"
            : "Fabric moved after no fabric detected, has this roll's inspection been completed?"
        }</p>
        <div class="spx-actions center">
          ${ghostBtn(zh ? "否" : "No", 'data-act="clothfinish-no"')}
          <button type="button" class="run-btn running" data-act="clothfinish-yes">${zh ? "是" : "Yes"}</button>
        </div>
      </div>`;
  }

  /** slot_show("loop_stop") → IsLoopStop：Yes 暂停 / No 继续 */
  function buildLoopStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? "循环停机位置到达，是否暂停检验？"
            : "Loop stop position reached. Pause inspection?"
        }</p>
        <div class="spx-actions center">
          ${ghostBtn(zh ? "继续" : "No", 'data-act="loop-no"')}
          <button type="button" class="run-btn running" data-act="loop-yes">${zh ? "暂停" : "Yes"}</button>
        </div>
      </div>`;
  }

  /** slot_show("cloth_finish_stop") → IsClothFinishStop */
  function buildClothFinishStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${zh ? "布尾到位停机！" : "Fabric end reached the stop position!"}</p>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="cloth-finish-ok">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  /** slot_show("mid_sample_stop") → MidSampleStop */
  function buildMidSampleStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    const inspected = Number(ctx.state && ctx.state.lengthM != null ? ctx.state.lengthM : 0).toFixed(1);
    const piece = Number(ctx.state && ctx.state.targetM != null ? ctx.state.targetM : 0).toFixed(1);
    const msg = zh
      ? `已到中段取样位置（已检 ${inspected} 米 / 匹长 ${piece} 米），请人工核对色差。取样后点确定，再启动继续。`
      : `Middle sampling position reached (inspected ${inspected} m / piece ${piece} m). Check the color difference, press OK, then start again.`;
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${msg}</p>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="mid-sample-ok">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  /** slot_show("width_sample_stop") → WidthSampleStop */
  function buildWidthSampleStop(ctx) {
    const zh = ctx.lang === "zh-CN";
    const inspected = Number(ctx.state && ctx.state.lengthM != null ? ctx.state.lengthM : 0).toFixed(1);
    const piece = Number(ctx.state && ctx.state.targetM != null ? ctx.state.targetM : 0).toFixed(1);
    const ratio = Math.round(
      Number(ctx.state && ctx.state.widthSampleRatio != null ? ctx.state.widthSampleRatio : 50)
    );
    const msg = zh
      ? `已到门幅采样位置（${ratio}%，已检 ${inspected} 米 / 匹长 ${piece} 米），请手动测量净幅宽。测完后点确定，再启动继续。`
      : `Width sample position reached (${ratio}%, inspected ${inspected} m / piece ${piece} m). Measure net width manually, press OK, then start again.`;
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${msg}</p>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="width-sample-ok">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  /** 净幅宽按钮门禁：已开检 / 机台已停 */
  function buildNetWidthHint(ctx, zhMsg, enMsg) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${zh ? zhMsg : enMsg}</p>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="close">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  /** slot_show("colordiffalarm") → 未开启提示 / 色差报警确认（预览简化） */
  function buildColorDiffAlarm(ctx) {
    const zh = ctx.lang === "zh-CN";
    const enabled = !(ctx.state && ctx.state.enableColourDiff === false);
    if (!enabled) {
      return `
        <div class="spx-info">
          <div class="spx-info-icon warn" aria-hidden="true">!</div>
          <p class="spx-msg">${
            zh
              ? "色差检测未开启，请在系统设置中开启。"
              : "Color difference detection is not enabled. Please enable it in the system settings."
          }</p>
          <div class="spx-actions center">
            <button type="button" class="run-btn running" data-act="colordiff-ok">${zh ? "确定" : "OK"}</button>
          </div>
        </div>`;
    }
    const s = ctx.state || {};
    const sh = ctx.sheet || {};
    const cur = Number(s.colorDiff != null ? s.colorDiff : 0).toFixed(2);
    const dF = Number(sh.deFront != null ? sh.deFront : cur).toFixed(2);
    const dM = Number(sh.deMid != null ? sh.deMid : cur).toFixed(2);
    const dR = Number(sh.deRear != null ? sh.deRear : cur).toFixed(2);
    return `
      <div class="spx-info">
        <div class="spx-info-icon warn" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? "检测到颜色差异超限，请核对前后色差后继续。"
            : "Color difference exceeded limit. Review ΔE values, then continue."
        }</p>
        <div class="spx-stat-row" style="width:100%;grid-template-columns:repeat(4,minmax(0,1fr))">
          <div class="spx-stat"><span class="spx-k">${zh ? "当前" : "Now"}</span><span class="spx-v">${cur}</span></div>
          <div class="spx-stat"><span class="spx-k">${zh ? "前" : "F"}</span><span class="spx-v">${dF}</span></div>
          <div class="spx-stat"><span class="spx-k">${zh ? "中" : "M"}</span><span class="spx-v">${dM}</span></div>
          <div class="spx-stat"><span class="spx-k">${zh ? "后" : "R"}</span><span class="spx-v">${dR}</span></div>
        </div>
        <div class="spx-actions center">
          <button type="button" class="run-btn running" data-act="colordiff-ok">${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  function selectedDefect(ctx) {
    const id = ctx.state && ctx.state.selectedId;
    const list = ctx.defects || [];
    return list.find((d) => Number(d.id) === Number(id)) || null;
  }

  function gradeLetter(g) {
    if (g === 1 || g === "1" || g === "I") return "I";
    if (g === 2 || g === "2" || g === "II") return "II";
    if (g === 3 || g === "3" || g === "III") return "III";
    if (g === 4 || g === "4" || g === "IV") return "IV";
    return "I";
  }

  function gradeOptions(selected) {
    const sel = gradeLetter(selected);
    return ["I", "II", "III", "IV"]
      .map((g) => `<option value="${g}" ${g === sel ? "selected" : ""}>${g}</option>`)
      .join("");
  }

  function defectThumbSrc(ctx, d) {
    const fromState = ctx.state && ctx.state.defectDetailImage;
    if (fromState) return String(fromState);
    if (!d) return "";
    const b64 = d.localImgBase64 || "";
    if (b64) {
      return String(b64).indexOf("data:") === 0 ? String(b64) : "data:image/png;base64," + b64;
    }
    const path = d.defectImage || "";
    if (path && global.SpxApi && typeof global.SpxApi.getEditDefectFileUrl === "function") {
      return global.SpxApi.getEditDefectFileUrl(path);
    }
    return "";
  }

  function buildDefectDetail(ctx) {
    const zh = ctx.lang === "zh-CN";
    const d = selectedDefect(ctx);
    if (!d) {
      return `
        <div class="spx-defect-detail">
          ${section(zh ? "疵点详情" : "Detail")}
          <p class="spx-msg">${zh ? "未选择疵点" : "No defect selected"}</p>
          <div class="spx-actions">
            ${ghostBtn(zh ? "关闭" : "Close", 'data-act="close"')}
          </div>
        </div>`;
    }
    const letter = gradeLetter(d.grade);
    const pts = ({ I: 1, II: 2, III: 3, IV: 4 })[letter] || 0;
    const yRaw = Number(d.y) || 0;
    const yM = yRaw > 50 ? yRaw / 1000 : yRaw;
    const xRaw = Number(d.x) || 0;
    const xShow = xRaw <= 1.5 ? xRaw * 100 : xRaw;
    const xUnit = xRaw <= 1.5 ? "%" : " mm";
    const sizeMm = Number(
      d.sizeMm != null ? d.sizeMm : Math.max(Number(d.width) || 0, Number(d.length) || 0)
    );
    const imgSrc = defectThumbSrc(ctx, d);
    const thumb = imgSrc
      ? `<div class="spx-defect-thumb has-img"><img src="${imgSrc}" alt="" /></div>`
      : `<div class="spx-defect-thumb">${zh ? "暂无疵点图像" : "No defect image"}</div>`;
    return `
      <div class="spx-defect-detail">
        ${section(zh ? "预览" : "Preview")}
        ${thumb}
        ${section(zh ? "信息" : "Info")}
        ${kv(zh ? "编号" : "ID", String(d.id))}
        ${kv(zh ? "名称" : "Name", d.title || "-")}
        ${kv(zh ? "级别" : "Grade", `${letter}  ·  ${pts}${zh ? " 分" : " pts"}`)}
        ${kv(zh ? "大小" : "Size", `${sizeMm.toFixed(1)} mm`)}
        ${kv(zh ? "Y坐标" : "Y", `${yM.toFixed(2)} m`)}
        ${kv("X", `${xShow.toFixed(1)} ${xUnit}`)}
        <div class="spx-actions split">
          ${ghostBtn(zh ? "编辑" : "Edit", 'data-act="defect-detail-edit"')}
          ${ghostBtn(zh ? "关闭" : "Close", 'data-act="close"')}
        </div>
      </div>`;
  }

  function buildDefectForm(ctx, mode) {
    const zh = ctx.lang === "zh-CN";
    const add = mode === "add";
    const d = add ? null : selectedDefect(ctx);
    const title = add ? "Manual" : (d ? d.title : "");
    const grade = add ? "I" : (d ? d.grade : "I");
    const y = add ? Number(ctx.state && ctx.state.lengthM || 0).toFixed(1) : (d ? Number(d.y).toFixed(1) : "0.0");
    const x = add ? "0.50" : (d ? Number(d.x).toFixed(2) : "0.50");
    const act = add ? "defect-add-save" : "defect-edit-save";
    const actLabel = add ? (zh ? "添加" : "Add") : (zh ? "保存" : "Save");
    return `
      ${section(add ? (zh ? "新增疵点" : "Add Defect") : (zh ? "编辑疵点" : "Edit Defect"))}
      ${field(zh ? "类型" : "Type", `<input id="popDefTitle" type="text" value="${title}" data-osk="1" />`)}
      ${field(zh ? "等级" : "Grade", `<select id="popDefGrade">${gradeOptions(grade)}</select>`)}
      ${field("Y (m)", `<input id="popDefY" type="number" step="0.1" min="0" value="${y}" data-osk="1" />`)}
      ${field("X (0–1)", `<input id="popDefX" type="number" step="0.01" min="0" max="1" value="${x}" data-osk="1" />`)}
      <div class="spx-actions">
        ${ghostBtn(zh ? "取消" : "Cancel", 'data-act="close"')}
        ${ghostBtn(actLabel, `data-act="${act}"`)}
      </div>`;
  }

  /** DefectAidedSelection — 主图全幅 + DefectCard 风格卡片 */
  function buildDefectAidedSelection(ctx) {
    const zh = ctx.lang === "zh-CN";
    const st = ctx.state || {};
    const showAll = !!st.aidedShowAll;
    const all = Array.isArray(ctx.aidedDefectsAll) ? ctx.aidedDefectsAll : (ctx.aidedDefects || []);
    let cards = Array.isArray(ctx.aidedDefects)
      ? ctx.aidedDefects.slice()
      : (showAll ? all.slice() : all.filter((c) => !c.filtered));
    // 展示前再按 X 排一次（多路线也不按 line）
    if (cards.length > 1) {
      cards.sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return Number(a.id) - Number(b.id);
      });
    }
    const totalAll = all.length;
    const totalValid = all.filter((c) => !c.filtered).length;
    const total = cards.length;
    const selected = cards.filter((c) => c.selected).length;
    const page = 1;
    const pages = 1;
    const mainUrl = ctx.aidedMainImageUrl || "";
    // 全图不画疵点框（选中/未选中都不显示）
    const marks = "";
    const zoomPct = Math.round((Number(st.aidedZoom) > 0 ? Number(st.aidedZoom) : 1) * 100);
    const mainImg = mainUrl
      ? `<img class="spx-aided-main-img" src="${mainUrl}" alt="" draggable="false"/>`
      : `<span class="spx-aided-main-hint">${zh ? "暂无全图" : "No frame"}</span>`;
    const zoomed = zoomPct > 100;
    const zoomBar = mainUrl
      ? `<div class="spx-aided-zoombar${zoomed ? " is-visible" : ""}" id="spxAidedZoomBar" title="${zh ? "滚轮缩放，拖拽平移，右键复位" : "Wheel zoom, drag pan, right-click reset"}">
            <button type="button" class="ghost-btn compact" data-act="aided-zoom" data-delta="-0.15" aria-label="-">−</button>
            <span class="spx-aided-zoomlab mono" id="spxAidedZoom">${zoomPct}%</span>
            <button type="button" class="ghost-btn compact" data-act="aided-zoom" data-delta="0.15" aria-label="+">+</button>
            <button type="button" class="ghost-btn compact" data-act="aided-zoom-reset">${zh ? "复位" : "Reset"}</button>
          </div>`
      : "";
    // 对齐 DefectAidedSelection.h + DefectCard：选择：/推荐：文案与 268 卡布局
    const cardsHtml = cards.length
      ? cards.map((c) => {
          const sel = c.selected ? "selected" : "ignored";
          const statusText = c.selected ? c.title : (zh ? "忽略" : "Ignored");
          const coordText = c.selected ? `(${c.x},${c.y})` : "";
          const thumb = c.thumb
            ? `<img class="spx-aided-thumb-img" src="${c.thumb}" alt=""/>`
            : `<span class="spx-aided-thumb-ph">${zh ? "局部图" : "Crop"}</span>`;
          const lineBadge = (c.line === 0 || c.line === 1)
            ? `<span class="spx-aided-line line${c.line}">${zh ? `第${c.line + 1}路` : `L${c.line + 1}`}</span>`
            : "";
          const filterBadge = c.filtered
            ? `<span class="spx-aided-badge filtered">${zh ? "过滤" : "F"}</span>`
            : "";
          return `
        <article class="spx-aided-card ${sel}${c.filtered ? " filtered" : ""}" data-act="aided-toggle" data-id="${c.id}" data-aided-id="${c.id}" role="button" tabindex="0">
          <div class="spx-aided-thumb">${thumb}${lineBadge}${filterBadge}</div>
          <div class="spx-aided-selrow">
            <span class="spx-aided-cap">${zh ? "选择：" : "Select:"}</span>
            <span class="spx-aided-status">${statusText}</span>
            <span class="spx-aided-coord">${coordText}</span>
          </div>
          <div class="spx-aided-typerow">
            <span class="spx-aided-cap">${zh ? "推荐：" : "Rec:"}</span>
            <button type="button" class="spx-aided-typechip" data-act="type-open" data-source="aided" data-id="${c.id}">${c.title}</button>
            <span class="spx-aided-score">${c.grade || ""}</span>
          </div>
        </article>`;
        }).join("")
      : `<div class="spx-muted" style="padding:16px">${zh ? "当前无可见疵点" : "No visible defects"}</div>`;
    const busy = !!(st.aidedBusy);
    const confirmLabel = busy
      ? (selected > 0 ? (zh ? "贴标中…" : "Labeling…") : (zh ? "处理中…" : "Working…"))
      : (selected > 0 ? (zh ? "贴标" : "Label") : (zh ? "跳过" : "Skip"));
    const confirmCls = selected > 0 ? "run-btn" : "run-btn running";
    const dis = busy ? " disabled" : "";
    const filterToggle = `
            <div class="spx-aided-filter-toggle" role="group" aria-label="${zh ? "显示范围" : "Filter"}">
              <button type="button" class="spx-aided-filter-btn${!showAll ? " active" : ""}" data-act="aided-show-valid"${dis}>${zh ? "有效" : "Valid"}</button>
              <button type="button" class="spx-aided-filter-btn${showAll ? " active" : ""}" data-act="aided-show-all"${dis}>${zh ? "所有" : "All"}</button>
            </div>`;
    const tpAided = typePickerState(ctx);
    const aidedPickId = tpAided.targetId;
    const aidedPick = (Array.isArray(ctx.aidedDefectsAll) ? ctx.aidedDefectsAll : cards)
      .find((c) => Number(c.id) === Number(aidedPickId));
    const typeModalHtml = buildDefectTypePickerModal(ctx, {
      open: !!(tpAided.open && tpAided.source === "aided"),
      filter: tpAided.filter || "",
      selectedName: aidedPick ? aidedPick.title : "",
      selectedId: aidedPick ? (aidedPick.defectId || "") : "",
      showPreview: !!st.isEnableImagePreview,
    });
    return `
      <div class="spx-aided${busy ? " is-busy" : ""}">
        <div class="spx-aided-preview">
          <div class="spx-aided-main" id="spxAidedMain">${zoomBar}${mainImg}${marks}</div>
          <div class="spx-aided-ruler"><span>0</span><span>300</span><span>600</span><span>900</span><span>1200 mm</span></div>
        </div>
        <div class="spx-aided-mainrow">
          <div class="spx-aided-cards" id="spxAidedCards">${cardsHtml}</div>
          <aside class="spx-aided-side">
            <button type="button" class="${confirmCls} spx-aided-confirm" data-act="aided-confirm"${dis}>${confirmLabel}</button>
            ${filterToggle}
            <button type="button" class="ghost-btn" data-act="aided-select-all"${dis}>${zh ? "全部选中" : "Select All"}</button>
            <button type="button" class="ghost-btn danger" data-act="aided-ignore-all"${dis}>${zh ? "全部忽略" : "Ignore All"}</button>
            <button type="button" class="ghost-btn danger" data-act="aided-ignore-other"${dis}>${zh ? "忽略其他" : "Ignore Other"}</button>
            <div class="spx-aided-info">
              <div class="spx-section">${zh ? "当前疵点信息" : "Batch Info"}</div>
              <div class="spx-kv"><span class="spx-k">${zh ? "共有缺陷" : "Defects"}</span><span class="spx-v">${total}${zh ? " 个" : ""}</span></div>
              <div class="spx-kv"><span class="spx-k">${zh ? "有效/全部" : "Valid/All"}</span><span class="spx-v">${totalValid}/${totalAll}</span></div>
              <div class="spx-kv"><span class="spx-k">${zh ? "已选中" : "Selected"}</span><span class="spx-v">${selected}</span></div>
              <div class="spx-kv"><span class="spx-k">${zh ? "共有页面" : "Pages"}</span><span class="spx-v">${pages}${zh ? " 页" : ""}</span></div>
              <div class="spx-kv"><span class="spx-k">${zh ? "当前页面" : "Page"}</span><span class="spx-v">${page}${zh ? " 页" : ""}</span></div>
            </div>
            <div class="spx-aided-nav">
              <button type="button" class="ghost-btn compact" data-act="aided-prev">${zh ? "上一页" : "Prev"}</button>
              <button type="button" class="ghost-btn compact" data-act="aided-next">${zh ? "下一页" : "Next"}</button>
            </div>
          </aside>
        </div>
        ${typeModalHtml}
      </div>`;
  }

  /** 默认疵点标签（对齐 artifical_add_defect 常用类型；可被 ctx.artificalLabelGroups 覆盖） */
  function defaultArtificalLabelGroups(zh) {
    return zh
      ? [
          { group: "经向", items: [{ code: "01", name: "断经" }, { code: "02", name: "粗经" }, { code: "03", name: "经柳" }] },
          { group: "纬向", items: [{ code: "11", name: "断纬" }, { code: "12", name: "粗纬" }, { code: "13", name: "纬斜" }] },
          { group: "外观", items: [{ code: "21", name: "油污" }, { code: "22", name: "破洞" }, { code: "23", name: "色斑" }, { code: "24", name: "其他" }] },
        ]
      : [
          { group: "Warp", items: [{ code: "01", name: "Broken warp" }, { code: "02", name: "Coarse warp" }, { code: "03", name: "Warp streak" }] },
          { group: "Weft", items: [{ code: "11", name: "Broken weft" }, { code: "12", name: "Coarse weft" }, { code: "13", name: "Skew" }] },
          { group: "Surface", items: [{ code: "21", name: "Oil" }, { code: "22", name: "Hole" }, { code: "23", name: "Spot" }, { code: "24", name: "Other" }] },
        ];
  }

  function defectTypeGroupsOf(ctx) {
    if (ctx.artificalLabelGroups && ctx.artificalLabelGroups.length) return ctx.artificalLabelGroups;
    const items = (ctx.editDefectParams && ctx.editDefectParams.length)
      ? ctx.editDefectParams
      : (ctx.artificalDefectParams || []);
    if (items.length) {
      const byGroup = new Map();
      items.forEach((p) => {
        const g = (p && p.group) || "";
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g).push({
          code: p.id || p.code || "",
          name: p.display || p.name || "",
          sampleImage: p.sampleImage || "",
          value: p.value || p.display || p.name || "",
          id: p.id || p.code || "",
        });
      });
      return Array.from(byGroup.keys()).map((g) => ({
        group: g || "全部",
        items: byGroup.get(g),
      }));
    }
    return defaultArtificalLabelGroups((ctx.lang || "").startsWith("zh"));
  }

  function defectSampleImageUrl(path) {
    if (!path) return "";
    const s = String(path).trim();
    if (!s) return "";
    if (s.indexOf("data:") === 0 || s.indexOf("http://") === 0 || s.indexOf("https://") === 0) return s;
    const base = (global.SpxApi && global.SpxApi.base) || "";
    return base + "/api/v0/defects/image?path=" + encodeURIComponent(s);
  }

  /**
   * 共用疵点类型选择弹窗（对齐 artifical_add_defect.html #labelModal / DefectCard TypePicker）
   * opts: { open, filter, selectedName, selectedId, showPreview }
   */
  function buildDefectTypePickerModal(ctx, opts) {
    const o = opts || {};
    if (!o.open) return "";
    const zh = (ctx.lang || "").startsWith("zh");
    const groups = defectTypeGroupsOf(ctx);
    const filter = o.filter || "";
    const showPreview = !!o.showPreview;
    const namedGroups = groups.filter((g) => g && g.group);
    const showFilter = namedGroups.length > 1;
    const filterChips = showFilter
      ? [`<button type="button" class="spx-art-chip ${!filter ? "active" : ""}" data-act="type-filter" data-group="">${zh ? "全部" : "All"}</button>`]
          .concat(namedGroups.map((g) =>
            `<button type="button" class="spx-art-chip ${filter === g.group ? "active" : ""}" data-act="type-filter" data-group="${g.group}">${g.group} ${(g.items || []).length}</button>`
          )).join("")
      : "";
    const visible = filter ? groups.filter((g) => g.group === filter) : groups;
    const filtered = visible.length <= 1;
    const visibleItems = visible.reduce((n, g) => n + ((g.items && g.items.length) || 0), 0);
    const dense = filtered && visibleItems >= 10;
    const manyCols = !filtered && visible.length >= 6;
    let indexNo = 1;
    // 全量编号与 HTML 一致：按未筛选顺序编号
    const indexMap = new Map();
    groups.forEach((g) => {
      (g.items || []).forEach((it) => {
        const key = (typeof it === "string" ? it : (it.name || it.value || "")) + "::" + (it && it.code ? it.code : "");
        if (!indexMap.has(key)) indexMap.set(key, indexNo++);
      });
    });
    const cards = visible.map((g) => {
      const items = (g.items || []).map((it) => {
        const name = typeof it === "string" ? it : (it.name || it.value || "");
        const code = typeof it === "string" ? "" : (it.code || it.id || "");
        const value = typeof it === "string" ? it : (it.value || it.name || "");
        const sample = typeof it === "string" ? "" : (it.sampleImage || "");
        const key = name + "::" + code;
        const no = indexMap.get(key) || "";
        const selected = (o.selectedId && code && String(o.selectedId) === String(code))
          || (o.selectedName && (name === o.selectedName || value === o.selectedName));
        const thumbUrl = showPreview ? defectSampleImageUrl(sample) : "";
        const thumb = showPreview
          ? (thumbUrl
            ? `<img class="spx-art-type-thumb" src="${thumbUrl}" alt="" loading="lazy" />`
            : `<span class="spx-art-type-thumb is-empty">${zh ? "暂无预览" : "No preview"}</span>`)
          : "";
        return `<button type="button" class="spx-art-type ${selected ? "selected" : ""}" data-act="type-pick" data-label="${name}" data-value="${value}" data-id="${code}" title="${no} ${name}">
          ${thumb}
          <span class="spx-art-type-meta">
            <span class="spx-art-type-code">#${no}</span>
            <span class="spx-art-type-name">${name}</span>
          </span>
        </button>`;
      }).join("");
      return `<section class="spx-art-type-group" data-group="${g.group || ""}">
        ${g.group ? `<div class="spx-art-type-group-title">${g.group}<span class="spx-art-type-count">${(g.items || []).length}</span></div>` : ""}
        <div class="spx-art-type-grid">${items}</div>
      </section>`;
    }).join("");
    const wrapCls = [
      "spx-art-type-wrap",
      showPreview ? "" : "is-no-image-preview",
      filtered ? "is-group-filtered" : "",
      dense ? "is-dense" : "",
      manyCols ? "is-many-cols" : "",
    ].filter(Boolean).join(" ");
    return `
      <div class="spx-art-modal active" data-type-picker>
        <div class="spx-art-modal-card wide type-picker">
          <div class="spx-art-modal-head">
            <span>${zh ? "请选择标签" : "Select Label"}</span>
            <button type="button" class="spx-art-modal-x" data-act="type-close">&times;</button>
          </div>
          ${showFilter ? `<div class="spx-art-filter">${filterChips}</div>` : ""}
          <div class="${wrapCls}">${cards || `<div class="spx-muted">${zh ? "暂无类型" : "No types"}</div>`}</div>
        </div>
      </div>`;
  }

  function typePickerState(ctx) {
    const st = (ctx && ctx.state) || {};
    return st.typePicker || { open: false, source: "", targetId: null, filter: "" };
  }

  /**
   * artifical_add_defect.html — SPX 人工添加疵点
   * 左：模式/图像切换/缩放 + 画布；右：缩略图 + ROI 表 + 预览/选标签；底：状态栏；层：标签弹窗 / 确认弹窗
   */
  function buildArtificalAddDefect(ctx) {
    const zh = ctx.lang === "zh-CN";
    const st = ctx.state || {};
    const rois = st.artificalRois || [];
    const selectedId = st.artificalRoiId;
    const mode = st.artificalMode || "rect";
    const imgType = st.artificalImgType == null ? 0 : Number(st.artificalImgType);
    const tp = typePickerState(ctx);
    const labelModal = !!st.artificalLabelModal || (tp.open && tp.source === "add");
    const labelFilter = (tp.open && tp.source === "add" ? tp.filter : null) || st.artificalLabelFilter || "";
    const confirmKind = st.artificalConfirm || null; // finish | clear | delete
    const confirmId = st.artificalConfirmId;

    const rows = rois.map((r) => {
      const active = r.id === selectedId ? "active" : "";
      return `<tr class="${active}" data-roi-id="${r.id}" data-act="art-roi-select">
        <td>${r.id}</td>
        <td>${Number(r.x).toFixed(0)}</td>
        <td>${Number(r.y).toFixed(0)}</td>
        <td>${Number(r.w).toFixed(0)}</td>
        <td>${Number(r.h).toFixed(0)}</td>
        <td>${r.label || "—"}</td>
        <td class="spx-art-ops">
          <button type="button" class="mini-btn" data-act="art-ticket" data-id="${r.id}">${zh ? "贴标" : "Label"}</button>
          <button type="button" class="mini-btn danger" data-act="art-roi-del" data-id="${r.id}">${zh ? "删除" : "Del"}</button>
        </td>
      </tr>`;
    }).join("") || `<tr><td colspan="7" class="spx-muted">${zh ? "暂无 ROI，请在主图画矩形" : "No ROI — draw a rect on canvas"}</td></tr>`;

    const modeBtns = [
      ["move", zh ? "移动" : "Move"],
      ["rect", zh ? "矩形" : "Rect"],
      ["measure", zh ? "测量" : "Measure"],
    ].map(([k, lab]) =>
      `<button type="button" class="ghost-btn compact ${mode === k ? "active" : ""}" data-act="art-mode" data-mode="${k}">${lab}</button>`
    ).join("");

    const imgTypeBtns = [0, 1].map((t) =>
      `<button type="button" class="ghost-btn compact ${imgType === t ? "active" : ""}" data-act="art-imgtype" data-imgtype="${t}">${zh ? `图像${t + 1}` : `Image ${t + 1}`}</button>`
    ).join("");

    const sel = rois.find((r) => r.id === selectedId);
    const previewPos = sel
      ? `${zh ? "位置" : "Pos"}: ${Number(sel.x).toFixed(0)}, ${Number(sel.y).toFixed(0)}`
      : `${zh ? "位置" : "Pos"}: -`;
    const previewSize = sel
      ? `${zh ? "尺寸" : "Size"}: ${Number(sel.w).toFixed(0)}×${Number(sel.h).toFixed(0)}`
      : `${zh ? "尺寸" : "Size"}: -`;
    const labelBtnText = (sel && sel.label) ? sel.label : (zh ? "请选择标签" : "Select label");
    const labelModalHtml = buildDefectTypePickerModal(ctx, {
      open: labelModal,
      filter: labelFilter,
      selectedName: sel ? sel.label : "",
      selectedId: sel ? sel.defectId : "",
      showPreview: !!st.isEnableImagePreview,
    });

    let confirmHtml = "";
    if (confirmKind) {
      const titles = {
        finish: zh ? "保存确认" : "Confirm Save",
        clear: zh ? "清空确认" : "Confirm Clear",
        delete: zh ? "删除确认" : "Confirm Delete",
        ticket: zh ? "贴标确认" : "Confirm Labeling",
      };
      const msgs = {
        finish: zh ? "确定要保存疵点吗？" : "Save the defects?",
        clear: zh ? "确定要清空所有 ROI 吗？此操作不可撤销。" : "Clear all ROIs? This cannot be undone.",
        delete: zh ? `确定要删除 ROI-${confirmId} 吗？` : `Delete ROI-${confirmId}?`,
        ticket: zh ? "确定移动贴标机到该疵点 X 位置并贴标吗？" : "Move labeler to this defect X and apply a label?",
      };
      confirmHtml = `
        <div class="spx-art-modal active" data-art-confirm>
          <div class="spx-art-modal-card">
            <div class="spx-art-modal-head">
              <span>${titles[confirmKind] || ""}</span>
              <button type="button" class="spx-art-modal-x" data-act="art-confirm-cancel">&times;</button>
            </div>
            <div class="spx-art-modal-msg">${msgs[confirmKind] || ""}</div>
            <div class="spx-art-modal-actions">
              ${ghostBtn(zh ? "取消" : "Cancel", 'data-act="art-confirm-cancel"')}
              <button type="button" class="run-btn running" data-act="art-confirm-ok">${zh ? "确定" : "OK"}</button>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="spx-art">
        <div class="spx-art-left">
          <div class="spx-art-toolbar">
            ${modeBtns}
            <span class="spx-art-sep"></span>
            <div class="spx-art-imgtype">${imgTypeBtns}</div>
            <span class="spx-art-sep"></span>
            <button type="button" class="ghost-btn compact" data-act="art-zoom" data-delta="-0.1">−</button>
            <span class="mono" id="spxArtZoom">100%</span>
            <button type="button" class="ghost-btn compact" data-act="art-zoom" data-delta="0.1">+</button>
            <button type="button" class="ghost-btn compact" data-act="art-zoom-reset">${zh ? "复位" : "Reset"}</button>
          </div>
          <div class="spx-art-stage">
            <canvas id="spxArtCanvas"></canvas>
            <div class="spx-art-hint" id="spxArtHint">${zh ? "矩形模式：拖拽框选漏检区域" : "Rect mode: drag to mark missed defect"}</div>
            <div class="spx-art-loading" id="spxArtLoading" hidden>
              <div class="spx-art-spinner"></div>
              <span>${zh ? "图像正在加载..." : "Loading image..."}</span>
            </div>
          </div>
        </div>
        <aside class="spx-art-right">
          <div class="spx-section">${zh ? "缩略图导航" : "Navigator"}</div>
          <div class="spx-art-thumb" id="spxArtThumb"></div>
          <div class="spx-section">${zh ? "疵点列表" : "ROI List"}</div>
          <div class="spx-art-table-wrap">
            <table class="spx-table compact">
              <thead><tr>
                <th>${zh ? "编号" : "ID"}</th><th>X</th><th>Y</th><th>${zh ? "宽" : "W"}</th><th>${zh ? "高" : "H"}</th>
                <th>${zh ? "标签" : "Label"}</th><th>${zh ? "操作" : "Ops"}</th>
              </tr></thead>
              <tbody id="spxArtRoiBody">${rows}</tbody>
            </table>
          </div>
          <div class="spx-section">${zh ? "预览 / 标签" : "Preview / Label"}</div>
          <div class="spx-art-preview">
            <div class="spx-defect-thumb" id="spxArtPreviewThumb">${sel ? (zh ? "ROI 预览" : "ROI") : (zh ? "暂无预览" : "No preview")}</div>
            <div class="mono" id="spxArtPreviewInfo">${previewPos}</div>
            <div class="mono">${previewSize}</div>
            <div class="spx-art-label-row">
              <button type="button" class="ghost-btn" data-act="type-open" data-source="add" ${sel ? "" : "disabled"}>${labelBtnText}</button>
            </div>
          </div>
          <div class="spx-actions split">
            ${ghostBtn(zh ? "清空所有" : "Clear", 'data-act="art-clear"')}
            ${ghostBtn(zh ? "取消选中" : "Deselect", 'data-act="art-deselect"')}
            <button type="button" class="run-btn running" data-act="art-finish">${zh ? "完成" : "Finish"}</button>
          </div>
        </aside>
        <div class="spx-art-status">
          <span id="spxArtCoord">${zh ? "图像" : "Image"} X: 0, Y: 0 px | ${zh ? "物理" : "Physical"} X: 0.0, Y: 0.0 mm</span>
          <span class="spx-art-badge" id="spxArtPad">${zh ? "触摸板" : "Touchpad"} · ${zh ? "预览模拟" : "sim"}</span>
          <span id="spxArtStatus">${zh ? "就绪" : "Ready"}</span>
        </div>
        ${labelModalHtml}
        ${confirmHtml}
        <div class="spx-art-saving" id="spxArtSaving" hidden>
          <div class="spx-art-progress"></div>
          <span>${zh ? "正在保存，请耐心等待..." : "Saving, please wait..."}</span>
        </div>
      </div>`;
  }

  /** 将主界面/API 疵点规范为编辑页毫米坐标（API：x/y/xLength/yLength 已是 mm） */
  function normalizeEditDefectList(ctx) {
    const src = (ctx.state && Array.isArray(ctx.state.editDefects) && ctx.state.editDefects.length)
      ? ctx.state.editDefects
      : (ctx.defects || []);
    const widthMm = Math.max(200, Number((ctx.state && ctx.state.widthCm) || 150) * 10);
    return src.map((d) => {
      const fromApi = d.xLength != null || d.yLength != null || d.defectLength != null || d.xMm != null;
      const xRaw = Number(d.xMm != null ? d.xMm : d.x) || 0;
      const yRaw = Number(d.yMm != null ? d.yMm : d.y) || 0;
      const xMm = fromApi
        ? (d.xMm != null ? Number(d.xMm) : xRaw)
        : (d.xMm != null ? Number(d.xMm) : (xRaw <= 1.5 ? xRaw * widthMm : xRaw));
      const yMm = fromApi
        ? (d.yMm != null ? Number(d.yMm) : yRaw)
        : (d.yMm != null ? Number(d.yMm) : (yRaw < 500 ? yRaw * 1000 : yRaw));
      const lengthMm = Number(
        d.lengthMm != null ? d.lengthMm
          : (d.yLength != null ? d.yLength
            : (d.defectLength != null ? d.defectLength : (d.w || 24)))
      );
      const widthVal = Number(
        d.widthMm != null ? d.widthMm
          : (d.xLength != null ? d.xLength
            : (d.defectWidth != null ? d.defectWidth : (d.h || 18)))
      );
      return {
        id: d.id,
        title: d.title || "",
        titleRaw: d.titleRaw || "",
        grade: d.grade || "I",
        defectID: d.defectID || "",
        xMm,
        yMm,
        lengthMm,
        widthMm: widthVal,
        areaMm2: Number(d.areaMm2 != null ? d.areaMm2 : (d.area != null ? d.area : (lengthMm * widthVal))),
        desc: d.desc || d.remarks || "",
        localImgBase64: d.localImgBase64 || "",
        yHead: d.yHead,
      };
    });
  }

  function editDefectTypeOptions(ctx, selectedTitle, selectedDefectID) {
    const zh = ctx.lang === "zh-CN";
    const items = (ctx.editDefectParams && ctx.editDefectParams.length)
      ? ctx.editDefectParams
      : (ctx.artificalDefectParams && ctx.artificalDefectParams.length)
        ? ctx.artificalDefectParams
        : null;
    if (items) {
      const seen = new Set();
      return items.map((p) => {
        const display = String(p.display || p.name || p.id || "").trim();
        if (!display) return "";
        const key = display.toLowerCase();
        if (seen.has(key)) return "";
        seen.add(key);
        const name = String(p.name || display);
        const id = String(p.id || "");
        const selected = (selectedDefectID && id && id === String(selectedDefectID))
          || ((!selectedDefectID || !id) && display === selectedTitle);
        return `<option value="${display}" data-id="${id}" data-name="${name}" ${selected ? "selected" : ""}>${display}</option>`;
      }).filter(Boolean).join("");
    }
    const labels = (ctx.artificalLabels && ctx.artificalLabels.length)
      ? ctx.artificalLabels
      : (zh
        ? ["断经", "断纬", "油污", "破洞", "色斑", "粗节", "纬斜", "Knot", "Hole", "Stain", "Slub", "Broken", "Tear", "其他"]
        : ["Broken warp", "Broken weft", "Oil", "Hole", "Spot", "Slub", "Skew", "Knot", "Stain", "Broken", "Tear", "Other"]);
    const set = new Set(labels);
    if (selectedTitle) set.add(selectedTitle);
    return Array.from(set).map((t) =>
      `<option value="${t}" data-id="" data-name="${t}" ${t === selectedTitle ? "selected" : ""}>${t}</option>`
    ).join("");
  }

  /**
   * artifical_edit_defect.html — SPX 疵点编辑
   * 左地图 · 中分组缩略列表 · 右预览+表单+保存/删除/完成
   */
  function buildArtificalEditDefect(ctx) {
    const zh = ctx.lang === "zh-CN";
    const st = ctx.state || {};
    const list = normalizeEditDefectList(ctx);
    const selectedId = st.editSelectedId != null ? st.editSelectedId
      : (st.selectedId != null ? st.selectedId : (list[0] && list[0].id));
    const confirmKind = st.editConfirm || null;
    const sel = list.find((d) => Number(d.id) === Number(selectedId)) || null;

    let groupsHtml = "";
    if (ctx.editGroups && ctx.editGroups.length) {
      groupsHtml = ctx.editGroups.map((g) => {
        const items = (g.defects || []).map((raw) => {
          const hit = list.find((d) => Number(d.id) === Number(raw.id));
          return hit || normalizeEditDefectList({ defects: [raw], state: {} })[0];
        }).filter(Boolean);
        if (!items.length) return "";
        const hasSel = items.some((d) => Number(d.id) === Number(selectedId));
        const thumbs = items.map((d) => {
          const on = Number(d.id) === Number(selectedId) ? "selected" : "";
          const thumb = d.localImgBase64
            ? `<img class="spx-edit-thumb-img" src="data:image/png;base64,${d.localImgBase64}" alt="" />`
            : `<span class="spx-edit-thumb-img">${zh ? "图" : "Img"}</span>`;
          return `<button type="button" class="spx-edit-thumb ${on}" data-act="edit-select" data-id="${d.id}">
              ${thumb}
              <span class="spx-edit-thumb-lab">${d.title || ("#" + d.id)}</span>
            </button>`;
        }).join("");
        const yHead = g.yHead != null ? g.yHead : "";
        return `<div class="spx-edit-group ${hasSel ? "selected" : ""}">
            <div class="spx-edit-group-title">Y: ${yHead} (mm)</div>
            <div class="spx-edit-thumbs">${thumbs}</div>
          </div>`;
      }).filter(Boolean).join("");
    } else {
      const groupsMap = new Map();
      list.forEach((d) => {
        const key = d.yHead != null ? Number(d.yHead) : (Math.floor(d.yMm / 5000) * 5000);
        if (!groupsMap.has(key)) groupsMap.set(key, []);
        groupsMap.get(key).push(d);
      });
      const groupKeys = Array.from(groupsMap.keys()).sort((a, b) => b - a);
      groupsHtml = groupKeys.length
        ? groupKeys.map((key) => {
            const items = groupsMap.get(key);
            const hasSel = items.some((d) => Number(d.id) === Number(selectedId));
            const thumbs = items.map((d) => {
              const on = Number(d.id) === Number(selectedId) ? "selected" : "";
              const thumb = d.localImgBase64
                ? `<img class="spx-edit-thumb-img" src="data:image/png;base64,${d.localImgBase64}" alt="" />`
                : `<span class="spx-edit-thumb-img">${zh ? "图" : "Img"}</span>`;
              return `<button type="button" class="spx-edit-thumb ${on}" data-act="edit-select" data-id="${d.id}">
              ${thumb}
              <span class="spx-edit-thumb-lab">${d.title || ("#" + d.id)}</span>
            </button>`;
            }).join("");
            return `<div class="spx-edit-group ${hasSel ? "selected" : ""}">
            <div class="spx-edit-group-title">Y: ${key} (mm)</div>
            <div class="spx-edit-thumbs">${thumbs}</div>
          </div>`;
          }).join("")
        : "";
    }
    if (!groupsHtml) {
      groupsHtml = `<div class="spx-muted">${zh ? "没有可编辑的疵点" : "No defects to edit"}</div>`;
    }

    const gradeOpts = gradeOptions(sel ? sel.grade : "I");
    const xVal = sel ? Number(sel.xMm).toFixed(1) : "";
    const yVal = sel ? Number(sel.yMm).toFixed(1) : "";
    const lenVal = sel ? Number(sel.lengthMm).toFixed(1) : "";
    const widVal = sel ? Number(sel.widthMm).toFixed(1) : "";
    const areaVal = sel ? Number(sel.areaMm2).toFixed(1) : "";
    const descVal = sel ? (sel.desc || "") : "";
    const typeBtnText = sel
      ? (sel.title || sel.titleRaw || (zh ? "请选择标签" : "Select label"))
      : (zh ? "请选择标签" : "Select label");
    const previewHtml = sel
      ? (sel.localImgBase64
        ? `<img src="data:image/png;base64,${sel.localImgBase64}" alt="" style="max-width:100%;max-height:100%;object-fit:contain" />`
        : (zh ? "ROI 预览" : "Preview"))
      : (zh ? "暂无预览" : "No preview");
    const tpEdit = typePickerState(ctx);
    const typeModalHtml = buildDefectTypePickerModal(ctx, {
      open: !!(tpEdit.open && tpEdit.source === "edit"),
      filter: tpEdit.filter || "",
      selectedName: sel ? (sel.title || sel.titleRaw || "") : "",
      selectedId: sel ? (sel.defectID || sel.defectId || "") : "",
      showPreview: !!st.isEnableImagePreview,
    });

    let confirmHtml = "";
    if (confirmKind) {
      const titles = {
        delete: zh ? "删除确认" : "Confirm Delete",
        finish: zh ? "完成确认" : "Confirm Finish",
        type: zh ? "更改类型" : "Change Type",
      };
      const msgs = {
        delete: zh ? "确定要删除此疵点吗？" : "Delete this defect?",
        finish: zh ? "完成编辑并关闭？" : "Finish editing and close?",
        type: zh ? "确定要更改类型吗？" : "Change defect type?",
      };
      confirmHtml = `
        <div class="spx-art-modal active" data-edit-confirm>
          <div class="spx-art-modal-card">
            <div class="spx-art-modal-head">
              <span>${titles[confirmKind] || (zh ? "确认" : "Confirm")}</span>
              <button type="button" class="spx-art-modal-x" data-act="edit-confirm-cancel">&times;</button>
            </div>
            <div class="spx-art-modal-msg">${msgs[confirmKind] || ""}</div>
            <div class="spx-art-modal-actions">
              ${ghostBtn(zh ? "取消" : "Cancel", 'data-act="edit-confirm-cancel"')}
              <button type="button" class="run-btn running" data-act="edit-confirm-ok">${zh ? "确定" : "OK"}</button>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="spx-edit">
        <div class="spx-edit-map">
          <canvas id="spxEditMapCanvas"></canvas>
          <div class="spx-edit-map-hint">${zh ? "点击地图选择疵点" : "Click map to select"}</div>
        </div>
        <div class="spx-edit-list" id="spxEditList">${groupsHtml}</div>
        <aside class="spx-edit-info">
          <div class="spx-section">${zh ? "疵点图片" : "Defect Image"}</div>
          <div class="spx-edit-preview" id="spxEditPreview">${previewHtml}</div>
          <div class="spx-section">${zh ? "疵点信息" : "Defect Info"}</div>
          <div class="spx-edit-form">
            <label>${zh ? "疵点类型" : "Type"}</label>
            <button type="button" class="ghost-btn spx-edit-type-btn" id="spxEditTypeBtn" data-act="type-open" data-source="edit" ${sel ? "" : "disabled"}>${typeBtnText}</button>
            <input type="hidden" id="spxEditTypeName" value="${sel ? (sel.titleRaw || sel.title || "") : ""}" />
            <input type="hidden" id="spxEditTypeId" value="${sel ? (sel.defectID || sel.defectId || "") : ""}" />
            <label>${zh ? "X坐标(mm)" : "X(mm)"}</label>
            <input id="spxEditX" type="number" step="0.1" min="0" value="${xVal}" data-osk="0" disabled />
            <label>${zh ? "Y坐标(mm)" : "Y(mm)"}</label>
            <input id="spxEditY" type="number" step="0.1" min="0" value="${yVal}" data-osk="0" disabled />
            <label>${zh ? "长度(mm)" : "Length(mm)"}</label>
            <input id="spxEditLen" type="number" step="0.1" min="0" value="${lenVal}" data-osk="0" disabled />
            <label>${zh ? "宽度(mm)" : "Width(mm)"}</label>
            <input id="spxEditWid" type="number" step="0.1" min="0" value="${widVal}" data-osk="0" disabled />
            <label>${zh ? "面积(mm²)" : "Area(mm²)"}</label>
            <input id="spxEditArea" type="number" value="${areaVal}" disabled />
            <label>${zh ? "缺陷等级" : "Grade"}</label>
            <select id="spxEditGrade" disabled>${gradeOpts}</select>
            <label class="spx-edit-desc-lab">${zh ? "缺陷描述" : "Description"}</label>
            <textarea id="spxEditDesc" rows="2" disabled>${descVal}</textarea>
          </div>
          <div class="spx-actions split spx-edit-actions">
            <button type="button" class="ghost-btn" data-act="edit-save" ${sel ? "" : "disabled"}>${zh ? "保存" : "Save"}</button>
            <button type="button" class="mini-btn danger" data-act="edit-delete" ${sel ? "" : "disabled"}>${zh ? "删除" : "Delete"}</button>
            <button type="button" class="run-btn running" data-act="edit-finish">${zh ? "完成" : "Finish"}</button>
          </div>
        </aside>
        ${typeModalHtml}
        ${confirmHtml}
        <div class="spx-art-saving" id="spxEditSaving" hidden>
          <div class="spx-art-progress"></div>
          <span>${zh ? "正在保存，请耐心等待..." : "Saving, please wait..."}</span>
        </div>
      </div>`;
  }

  /**
   * artifical_add_width.html — SPX 净幅宽测量
   * 触摸板点两次布边 / 画布点击 / 未启用触摸板时手输；对齐 PublicServer API
   */
  function buildArtificalAddWidth(ctx) {
    const zh = ctx.lang === "zh-CN";
    const m = (ctx.state && ctx.state.netWidth) || {};
    const last = m.last != null && Number(m.last) > 0 ? Number(m.last).toFixed(1) : "—";
    return `
      <div class="spx-width">
        <div class="spx-width-status">
          <span id="spxWidthStatus">${zh ? "正在准备触摸板测量…" : "Preparing touchpad…"}</span>
          <span class="spx-art-badge" id="spxWidthPad" hidden>${zh ? "触摸板" : "Pad"}</span>
          <span id="spxWidthPadData" class="spx-width-pad-data" hidden></span>
        </div>
        <div class="spx-width-stage">
          <canvas id="spxWidthCanvas"></canvas>
          <div class="spx-width-float" id="spxWidthFloat"></div>
          <div class="spx-width-loading" id="spxWidthLoading">${zh ? "正在准备触摸板测量…" : "Preparing…"}</div>
        </div>
        <div class="spx-width-bar">
          <div class="spx-width-metric left"><span class="k">${zh ? "左布边" : "Left"}</span><span class="v" id="spxWidthLeft">—</span></div>
          <div class="spx-width-metric right"><span class="k">${zh ? "右布边" : "Right"}</span><span class="v" id="spxWidthRight">—</span></div>
          <div class="spx-width-metric"><span class="k">${zh ? "净幅宽" : "Net"}</span><span class="v" id="spxWidthVal">—</span></div>
          <div class="spx-width-metric muted"><span class="k">${zh ? "上次净幅宽" : "Last"}</span><span class="v" id="spxWidthLast">${last === "—" ? last : last + " cm"}</span></div>
          <label class="spx-width-manual" id="spxWidthManual">${zh ? "净幅宽" : "Net"}
            <input id="spxWidthInput" type="number" min="0.1" step="0.1" inputmode="decimal" placeholder="cm" data-osk="1" />
          </label>
          <label class="spx-check"><input type="checkbox" id="spxWidthShowImg" /> ${zh ? "显示图片" : "Show image"}</label>
          <div class="spacer"></div>
          <button type="button" class="ghost-btn" data-act="width-reset">${zh ? "重测" : "Reset"}</button>
          <button type="button" class="run-btn running" data-act="width-save" disabled>${zh ? "确定" : "OK"}</button>
        </div>
      </div>`;
  }

  function debugToolGroups(zh) {
    // 按设备类型分组；灯带按 LightBandDeviceType 拆成 Type1 / Type2 两页
    return [
      {
        group: zh ? "总览" : "Overview",
        tabs: [
          { id: "devices", label: zh ? "设备总览" : "Health", path: "/customuiv3/tuning/devices.html" },
        ],
      },
      {
        group: zh ? "控制" : "Control",
        tabs: [
          { id: "plc", label: "PLC", path: "/customuiv3/tuning/plc.html" },
          { id: "alarms", label: zh ? "报警" : "Alarms", path: "/customuiv3/tuning/alarms.html" },
        ],
      },
      {
        group: zh ? "视觉" : "Vision",
        tabs: [
          { id: "camera", label: zh ? "相机" : "Camera", path: "/customuiv3/tuning/camera.html" },
          { id: "detector", label: zh ? "检测设置" : "Detection", path: "/customuiv3/tuning/detector.html" },
          { id: "color", label: zh ? "色差" : "Color Diff", path: "/customuiv3/tuning/color.html" },
          { id: "widthsensor", label: zh ? "幅宽传感器" : "Width Sensor", path: "/customuiv3/tuning/widthsensor.html" },
        ],
      },
      {
        group: zh ? "光源" : "Lighting",
        tabs: [
          { id: "light", label: zh ? "串口光源" : "Serial Light", path: "/customuiv3/tuning/light.html" },
          { id: "light3", label: zh ? "频闪光源" : "Strobe Light", path: "/customuiv3/tuning/light3.html" },
          { id: "lightband", label: zh ? "灯带·创联" : "LB Type1", path: "/customuiv3/tuning/lightband.html" },
          { id: "lightband2", label: zh ? "灯带·STM32" : "LB Type2", path: "/customuiv3/tuning/lightband2.html" },
        ],
      },
      {
        group: zh ? "贴标出票" : "Labeling",
        tabs: [
          { id: "printer", label: zh ? "打印机" : "Printer", path: "/customuiv3/tuning/printer.html" },
          { id: "zpl", label: zh ? "ZPL 打印" : "ZPL Print", path: "/customuiv3/tuning/zpl.html" },
          { id: "label", label: zh ? "贴标" : "Label", path: "/customuiv3/tuning/label.html" },
          { id: "nonstop", label: zh ? "不停机贴标" : "Nonstop Label", path: "/customuiv3/tuning/nonstop.html" },
        ],
      },
      {
        group: zh ? "人机" : "HMI",
        tabs: [
          { id: "touchpad", label: zh ? "触摸板" : "Touchpad", path: "/customuiv3/tuning/touchpad.html" },
          { id: "colorreader", label: zh ? "取色仪" : "Color Reader", path: "/customuiv3/tuning/colorreader.html" },
        ],
      },
    ];
  }

  function debugToolTabs(zh) {
    return debugToolGroups(zh).reduce(function (acc, g) {
      return acc.concat(g.tabs || []);
    }, []);
  }

  function debugToolUrl(path, lang) {
    const q = "lang=" + encodeURIComponent(lang || "zh-CN");
    const base = (global.SpxApi && global.SpxApi.base) || "";
    return base + path + (path.indexOf("?") >= 0 ? "&" : "?") + q;
  }

  function buildDebug(ctx) {
    const zh = ctx.lang === "zh-CN";
    const groups = debugToolGroups(zh);
    const tabs = debugToolTabs(zh);
    const active = (ctx.debugTabId && tabs.some((t) => t.id === ctx.debugTabId))
      ? ctx.debugTabId
      : tabs[0].id;
    const tabBtns = groups
      .map(function (g, gi) {
        const btns = (g.tabs || [])
          .map(
            (t) =>
              `<button type="button" class="ghost-btn compact ${t.id === active ? "active" : ""}" data-act="debug-tab" data-tab="${t.id}" data-src="${debugToolUrl(t.path, ctx.lang)}">${t.label}</button>`
          )
          .join("");
        const sep = gi > 0 ? `<span class="spx-debug-sep" aria-hidden="true"></span>` : "";
        return sep + btns;
      })
      .join("");
    const panes = tabs
      .map((t) => {
        const on = t.id === active;
        const src = debugToolUrl(t.path, ctx.lang);
        return `<div class="spx-debug-pane" data-debug-pane="${t.id}" ${on ? "" : "hidden"}>
          <iframe class="spx-debug-frame" title="${t.label}" ${on ? `src="${src}"` : `data-src="${src}"`} referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>`;
      })
      .join("");
    return `
      <div class="spx-debug">
        <div class="spx-debug-nav" id="popDebugNav">
          <button type="button" class="ghost-btn compact spx-debug-nav-btn" data-act="debug-tab-scroll-prev" aria-label="${zh ? "向左滚动" : "Scroll left"}">‹</button>
          <div class="spx-debug-tabs" id="popDebugTabs">${tabBtns}</div>
          <button type="button" class="ghost-btn compact spx-debug-nav-btn" data-act="debug-tab-scroll-next" aria-label="${zh ? "向右滚动" : "Scroll right"}">›</button>
        </div>
        <div class="spx-debug-frames" id="popDebugFrames">${panes}</div>
      </div>`;
  }

  function wsSettingOn(sv, key, defOn) {
    const raw = sv && sv[key] != null ? sv[key] : defOn ? "1" : "0";
    return raw === true || raw === 1 || raw === "1" || String(raw).toLowerCase() === "true";
  }

  function wsSettingNum(sv, key, defVal) {
    const n = Number(sv && sv[key] != null ? sv[key] : defVal);
    return Number.isFinite(n) ? n : defVal;
  }

  function wsToggleRow(label, key, remark, on) {
    const init = on ? "1" : "0";
    return `<label class="spx-ws-toggle" title="${key}">
      <span class="spx-ws-toggle-lab">${label}</span>
      <span class="spx-switch" title="${on ? "On" : "Off"}">
        <input type="checkbox" data-setting-key="${key}" data-setting-control="toggle" data-setting-init="${init}" data-remark="${remark || ""}" ${on ? "checked" : ""} />
        <span class="spx-switch-track" aria-hidden="true"><span class="spx-switch-thumb"></span></span>
      </span>
    </label>`;
  }

  function wsStepField(label, key, remark, value, min, max, step) {
    return `<div class="spx-ws-field" title="${key}" data-ws-step data-min="${min}" data-max="${max}" data-step="${step}">
      <span class="spx-ws-field-lab">${label}</span>
      <div class="spx-ws-step">
        <button type="button" class="mini-btn" data-act="ws-step" data-delta="-1" aria-label="-">−</button>
        <input type="number" min="${min}" max="${max}" step="${step}" value="${value}"
          inputmode="numeric" data-osk="1"
          data-setting-key="${key}" data-setting-control="number" data-setting-init="${value}" data-remark="${remark || ""}" />
        <button type="button" class="mini-btn" data-act="ws-step" data-delta="1" aria-label="+">+</button>
      </div>
    </div>`;
  }

  function wsModeButtons(zh, mode) {
    const opts = [
      ["0", zh ? "固定" : "Fixed"],
      ["1", "Canny"],
      ["2", "KMeans"],
      ["3", zh ? "卷积" : "Conv"],
      ["4", "BLOB"],
      ["5", zh ? "自适应" : "Adapt"],
    ];
    const btns = opts
      .map(
        ([v, lab]) =>
          `<button type="button" class="spx-ws-mode-btn${String(v) === String(mode) ? " active" : ""}" data-act="ws-mode" data-v="${v}">${lab}</button>`
      )
      .join("");
    return `<div class="spx-ws-field spx-ws-field-span" title="DetectEdgeMode">
      <span class="spx-ws-field-lab">${zh ? "视觉检测方法" : "Vision edge mode"}</span>
      <input type="hidden" data-setting-key="DetectEdgeMode" data-setting-control="select"
        data-setting-init="${mode}" data-remark="视觉边缘检测模式" value="${mode}" id="wsDetectEdgeMode" />
      <div class="spx-ws-modes" role="group">${btns}</div>
    </div>`;
  }

  function buildWidthSensor(ctx) {
    const zh = ctx.lang === "zh-CN" || String(ctx.lang || "").indexOf("zh") === 0;
    const st = ctx.state || {};
    const plc = st.plc || {};
    const sv = ctx.settingsValues || {};
    const fmt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(1) : "—";
    };
    const fabric =
      st.widthCm != null
        ? st.widthCm
        : plc.fabric_width != null
          ? plc.fabric_width
          : null;
    const plcW =
      plc.plc_fabric_width != null
        ? plc.plc_fabric_width
        : st.plcFabricWidth != null
          ? st.plcFabricWidth
          : fabric;
    const left =
      plc.width_sensor_left != null
        ? plc.width_sensor_left
        : st.widthSensorLeft != null
          ? st.widthSensorLeft
          : st.width_sensor_left;
    const right =
      plc.width_sensor_right != null
        ? plc.width_sensor_right
        : st.widthSensorRight != null
          ? st.widthSensorRight
          : st.width_sensor_right;
    const visionOn = wsSettingOn(sv, "IsEnableImageWidth", false);
    const followOn = wsSettingOn(sv, "IsEnableWidthDetectorEdge", false);
    const showEdge = wsSettingOn(sv, "IsEnabledShowEdge", false);
    const pinhole = wsSettingOn(sv, "IsEnabledPinhole", false);
    const cropL = wsSettingNum(sv, "DistanceToLeftEdge", 0);
    const cropR = wsSettingNum(sv, "DistanceToRightEdge", 0);
    const mode = String(sv.DetectEdgeMode != null ? sv.DetectEdgeMode : "0");
    const srcText = visionOn
      ? zh ? "当前：视觉测量" : "Source: vision"
      : zh ? "当前：幅宽传感器测量" : "Source: sensor";
    return `
      <div class="spx-ws">
      ${section(zh ? "实时测量" : "Live Measure")}
      <div class="spx-stat-row spx-ws-live" id="wsLiveRow">
        <div class="spx-stat"><div class="spx-k">Fabric</div><div class="spx-v" id="wsLiveFabric">${fmt(fabric)}</div></div>
        <div class="spx-stat"><div class="spx-k">PLC</div><div class="spx-v" id="wsLivePlc">${fmt(plcW)}</div></div>
        <div class="spx-stat"><div class="spx-k">L</div><div class="spx-v" id="wsLiveLeft">${fmt(left)}</div></div>
        <div class="spx-stat"><div class="spx-k">R</div><div class="spx-v" id="wsLiveRight">${fmt(right)}</div></div>
      </div>
      <p class="spx-msg spx-ws-src" id="wsLiveSource">${srcText}</p>
      ${section(zh ? "开关" : "Switches")}
      <div class="spx-ws-toggles">
        ${wsToggleRow(zh ? "传感器跟随布边" : "Sensor follow", "IsEnableWidthDetectorEdge", zh ? "幅宽检测器边缘检测" : "Width detector edge", followOn)}
        ${wsToggleRow(zh ? "视觉幅宽测量" : "Vision measure", "IsEnableImageWidth", zh ? "视觉幅宽检测" : "Image width", visionOn)}
        ${wsToggleRow(zh ? "显示边距线" : "Show edge marks", "IsEnabledShowEdge", zh ? "是否开启在图片中显示左右边距标记线" : "Show edge marks", showEdge)}
        ${wsToggleRow(zh ? "双针孔布边" : "Pinhole edge", "IsEnabledPinhole", zh ? "双针孔布边检测" : "Pinhole edge", pinhole)}
      </div>
      ${section(zh ? "边距设置" : "Margins")}
      <div class="spx-ws-fields">
        ${wsStepField(zh ? "左边距 mm" : "Left mm", "DistanceToLeftEdge", "左边距(mm)", cropL, 0, 450, 1)}
        ${wsStepField(zh ? "右边距 mm" : "Right mm", "DistanceToRightEdge", "右边距(mm)", cropR, 0, 450, 1)}
        ${wsModeButtons(zh, mode)}
      </div>
      <div class="spx-actions spx-ws-actions">
        ${ghostBtn(zh ? "保存" : "Save", 'data-act="widthsensor-save"')}
        ${ghostBtn(zh ? "刷新数值" : "Refresh", 'data-act="widthsensor-refresh"')}
      </div>
      <p class="spx-msg" id="wsSaveMsg"></p>
      </div>`;
  }

  function buildBody(key, ctx) {
    switch (key) {
      case "login":
        return buildLogin(ctx);
      case "about":
        return buildAbout(ctx);
      case "debug":
        return buildDebug(ctx);
      case "plc":
        return buildPlc(ctx);
      case "camera":
        return buildCamera(ctx);
      case "light":
        return buildLight(ctx);
      case "alarm":
        return buildAlarm(ctx);
      case "widthSensor":
        return buildWidthSensor(ctx);
      case "unwind":
        // web/popups/unwind.html → SPX 风格 plctest 布局（buildPlcTest）
        return buildPlcTest(ctx);
      case "speed":
      case "width":
      case "length":
      case "colorDiff":
      case "tension":
      case "cpu":
      case "gpu":
        return buildMetric(ctx, key);
      case "weight":
        return buildWeight(ctx);
      case "systemSettings":
        return buildSystemSettings(ctx);
      case "erpNewSheet":
        return buildNewSheet(ctx);
      case "erpEditSheet":
        return buildEditSheet(ctx);
      case "fourPoints":
        return buildFourPoints(ctx);
      case "records":
        return buildRecords(ctx);
      case "defectSettings":
        return buildDefectSettings(ctx);
      case "finishSheet":
        return buildFinish(ctx);
      case "defectDetail":
        return buildDefectDetail(ctx);
      case "defectAdd":
        return buildDefectForm(ctx, "add");
      case "defectEdit":
      case "artificalEditDefect":
        return buildArtificalEditDefect(ctx);
      case "defectAidedSelection":
        return buildDefectAidedSelection(ctx);
      case "artificalAddDefect":
        return buildArtificalAddDefect(ctx);
      case "artificalAddWidth":
        return buildArtificalAddWidth(ctx);
      case "noclothstop":
        return buildNoClothStop(ctx);
      case "empty_sheet_stop":
        return buildEmptySheetStop(ctx);
      case "noclothstop_clothfinish":
        return buildNoClothStopClothFinish(ctx);
      case "loop_stop":
        return buildLoopStop(ctx);
      case "cloth_finish_stop":
        return buildClothFinishStop(ctx);
      case "mid_sample_stop":
        return buildMidSampleStop(ctx);
      case "width_sample_stop":
        return buildWidthSampleStop(ctx);
      case "netWidthNeedStart":
        return buildNetWidthHint(
          ctx,
          "请先启动验布，再测量净幅宽",
          "Start inspection before measuring net width"
        );
      case "netWidthNeedStop":
        return buildNetWidthHint(
          ctx,
          "请先停止验布，再测量净幅宽",
          "Stop the machine before measuring net width"
        );
      case "editNeedStop":
        return buildNetWidthHint(
          ctx,
          "请先停止验布，再编辑疵点",
          "Stop the machine before editing defects"
        );
      case "colordiffalarm":
        return buildColorDiffAlarm(ctx);
      default:
        return `<p class="spx-msg">${key}</p>`;
    }
  }

  function SpxOsk(host) {
    this.host = host;
    this.target = null;
    this.targetId = null;
    this.mode = "alpha"; // alpha | num
    this.shift = false;
    this.caps = false;
    this.root = el("div", "spx-osk");
    this.root.hidden = true;
    this.root.innerHTML = `<div class="spx-osk-inner" id="spxOskInner"></div>`;
    document.body.appendChild(this.root);
    this.inner = this.root.querySelector("#spxOskInner");
    this.root.addEventListener("mousedown", (e) => e.preventDefault());
    this.root.addEventListener("click", (e) => this._onClick(e));
  }

  SpxOsk.prototype._isEditable = function (node) {
    if (!node || node.disabled || node.readOnly) return false;
    if (node.isConnected === false) return false;
    if (node.tagName === "TEXTAREA") return true;
    if (node.tagName !== "INPUT") return false;
    const t = (node.type || "text").toLowerCase();
    return t === "text" || t === "password" || t === "number" || t === "search" || t === "tel";
  };

  SpxOsk.prototype._wantNum = function (inp) {
    if (!inp) return false;
    const t = (inp.type || "").toLowerCase();
    if (t === "number" || t === "tel") return true;
    if (inp.getAttribute("inputmode") === "numeric" || inp.getAttribute("inputmode") === "decimal") return true;
    return false;
  };

  SpxOsk.prototype._useExternal = function () {
    // CEF 嵌入：独立底栏 Qt 键盘（CallBridge.showOsk），避免键盘困在弹窗窗体内
    try {
      return !!(
        document.body &&
        document.body.classList.contains("spx-embed") &&
        global.CallBridge &&
        typeof global.CallBridge.invoke === "function"
      );
    } catch (_) {
      return false;
    }
  };

  SpxOsk.prototype._letterUpper = function () {
    return this.caps ? !this.shift : this.shift;
  };

  SpxOsk.prototype._bodyRoot = function () {
    if (this.host && this.host.bodyEl) return this.host.bodyEl;
    if (this.host && this.host.body) return this.host.body;
    return document;
  };

  /** 优先用 fieldId 找回仍挂在 DOM 上的输入框（CEF 失焦 / refresh 后旧引用失效） */
  SpxOsk.prototype._resolveInput = function (fieldId) {
    const id = fieldId || this.targetId;
    if (id) {
      const byId = document.getElementById(id);
      if (this._isEditable(byId)) return byId;
    }
    if (this._isEditable(this.target)) return this.target;
    const ae = document.activeElement;
    if (this._isEditable(ae)) return ae;
    const root = this._bodyRoot();
    if (root && root.querySelector) {
      const cand = root.querySelector(
        'input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])'
      );
      if (this._isEditable(cand)) return cand;
    }
    return null;
  };

  SpxOsk.prototype.show = function (inp) {
    if (!this._isEditable(inp)) return;
    this.target = inp;
    this.targetId = inp && inp.id ? String(inp.id) : null;
    this.mode = this._wantNum(inp) ? "num" : "alpha";
    this.shift = false;
    if (this._useExternal()) {
      this.root.hidden = true;
      document.body.classList.add("spx-osk-open");
      if (this.host && typeof this.host._liftForOsk === "function") this.host._liftForOsk(true);
      try {
        global.CallBridge.invoke("showOsk", this.mode, this.targetId || "");
      } catch (_) { /* ignore */ }
      return;
    }
    this._render();
    this.root.hidden = false;
    document.body.classList.add("spx-osk-open");
    const lift = () => {
      if (this.host && typeof this.host._liftForOsk === "function") this.host._liftForOsk(true);
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(lift);
    else lift();
  };

  SpxOsk.prototype.hide = function (opts) {
    const fromNative = !!(opts && opts.fromNative);
    const wasExternal = this._useExternal() || !!this.targetId;
    this.target = null;
    this.targetId = null;
    this.root.hidden = true;
    document.body.classList.remove("spx-osk-open");
    if (this.host && typeof this.host._liftForOsk === "function") this.host._liftForOsk(false);
    // 原生已 hide 时不要再 invoke hideOsk，否则与 C++ hideOskPopup 回环
    if (wasExternal && !fromNative) {
      try {
        if (global.CallBridge && typeof global.CallBridge.invoke === "function")
          global.CallBridge.invoke("hideOsk");
      } catch (_) { /* ignore */ }
    }
  };

  /** 独立 OSK 回传：按字段 id 写回（CEF 点键盘可能短暂失焦） */
  SpxOsk.prototype.applyExternal = function (action, payload, fieldId) {
    if (fieldId) this.targetId = String(fieldId);
    // 关闭/隐藏必须优先处理：即使已无焦点也要清 spx-osk-open / osk-lift
    if (action === "done" || action === "close" || action === "hide") {
      const inp = this._resolveInput(fieldId);
      if (action !== "hide" && this._isEditable(inp)) {
        try {
          inp.blur();
        } catch (_) {}
      }
      this.hide({ fromNative: true });
      return;
    }
    const inp = this._resolveInput(fieldId);
    if (!this._isEditable(inp)) return;
    this.target = inp;
    if (inp.id) this.targetId = String(inp.id);
    try {
      inp.focus({ preventScroll: true });
    } catch (_) {
      try {
        inp.focus();
      } catch (_) {}
    }
    if (action === "back") {
      this._backspace();
      return;
    }
    if (action === "clear") {
      inp.value = "";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (action === "insert" && payload != null) this._insert(String(payload));
  };

  SpxOsk.prototype._rowsAlpha = function () {
    const up = this._letterUpper();
    const sh = !!this.shift;
    const L = (c) => (up ? c.toUpperCase() : c.toLowerCase());
    const S = (base, shifted) => (sh ? shifted : base);
    // 标准 QWERTY（含行缩进，对齐物理键盘）
    return [
      {
        keys: [
          S("1", "!"),
          S("2", "@"),
          S("3", "#"),
          S("4", "$"),
          S("5", "%"),
          S("6", "^"),
          S("7", "&"),
          S("8", "*"),
          S("9", "("),
          S("0", ")"),
          S("-", "_"),
          S("=", "+"),
          "back",
        ],
      },
      {
        keys: [L("q"), L("w"), L("e"), L("r"), L("t"), L("y"), L("u"), L("i"), L("o"), L("p"), S("[", "{"), S("]", "}")],
        lead: 1,
      },
      {
        keys: [L("a"), L("s"), L("d"), L("f"), L("g"), L("h"), L("j"), L("k"), L("l"), S(";", ":"), S("'", '"')],
        lead: 2,
        trail: 1,
      },
      {
        keys: [
          "shift",
          L("z"),
          L("x"),
          L("c"),
          L("v"),
          L("b"),
          L("n"),
          L("m"),
          S(",", "<"),
          S(".", ">"),
          S("/", "?"),
          "clear",
        ],
      },
      { keys: ["123", "caps", "space", "enter", "done"] },
    ];
  };

  SpxOsk.prototype._rowsNum = function () {
    // 九宫格小键盘（计算器序）
    return [
      { keys: ["7", "8", "9"] },
      { keys: ["4", "5", "6"] },
      { keys: ["1", "2", "3"] },
      { keys: ["-", "0", "."] },
      { keys: ["abc", "back", "clear", "done"] },
    ];
  };

  SpxOsk.prototype._keyHtml = function (k) {
    const labels = {
      caps: this.caps ? "CAPS" : "Caps",
      shift: "⇧",
      back: "⌫",
      clear: "CLR",
      space: "SPACE",
      done: "OK",
      close: "✕",
      tab: "Tab",
      enter: "↵",
      "123": "123",
      abc: "ABC",
    };
    const special = labels[k] != null;
    const cls = ["spx-osk-key"];
    if (this.mode === "num" && k !== "close") cls.push("num");
    if (special) cls.push("special");
    if (k === "space") cls.push("space");
    if (k === "done") cls.push("done");
    if (k === "close") cls.push("close");
    if (k === "tab") cls.push("tab");
    if (k === "enter") cls.push("enter");
    if (k === "shift" && this.shift) cls.push("active");
    if (k === "caps" && this.caps) cls.push("active");
    const label = special ? labels[k] : k;
    return `<button type="button" class="${cls.join(" ")}" data-osk="${k}">${label}</button>`;
  };

  SpxOsk.prototype._render = function () {
    const num = this.mode === "num";
    const rows = num ? this._rowsNum() : this._rowsAlpha();
    this.root.classList.toggle("is-num", num);
    this.inner.classList.toggle("is-num", num);
    // 关闭键：按键区外侧右上角（绝对定位，不进按键行）
    let toolbar = this.root.querySelector(".spx-osk-toolbar");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "spx-osk-toolbar";
      this.root.appendChild(toolbar);
    }
    toolbar.innerHTML = this._keyHtml("close");
    this.inner.innerHTML = rows
      .map((row) => {
        const keys = Array.isArray(row) ? row : row.keys || [];
        const lead = row && row.lead ? Number(row.lead) : 0;
        const trail = row && row.trail ? Number(row.trail) : 0;
        const leadHtml = lead > 0 ? `<span class="spx-osk-spacer" style="flex:${lead * 0.35}"></span>` : "";
        const trailHtml = trail > 0 ? `<span class="spx-osk-spacer" style="flex:${trail * 0.35}"></span>` : "";
        return `<div class="spx-osk-row">${leadHtml}${keys.map((k) => this._keyHtml(k)).join("")}${trailHtml}</div>`;
      })
      .join("");
  };

  SpxOsk.prototype._insert = function (text) {
    const inp = this._resolveInput() || this.target;
    if (!inp) return;
    this.target = inp;
    const start = inp.selectionStart != null ? inp.selectionStart : String(inp.value || "").length;
    const end = inp.selectionEnd != null ? inp.selectionEnd : start;
    const val = String(inp.value || "");
    const next = val.slice(0, start) + text + val.slice(end);
    if (inp.type === "number") {
      // number 输入框部分浏览器不支持 selection；整段替换更稳
      inp.value = next;
    } else {
      inp.value = next;
      const caret = start + text.length;
      try {
        inp.setSelectionRange(caret, caret);
      } catch (_) {}
    }
    inp.dispatchEvent(new Event("input", { bubbles: true }));
  };

  SpxOsk.prototype._backspace = function () {
    const inp = this._resolveInput() || this.target;
    if (!inp) return;
    this.target = inp;
    const val = String(inp.value || "");
    if (inp.selectionStart != null && inp.selectionEnd != null && inp.selectionStart !== inp.selectionEnd) {
      const start = inp.selectionStart;
      const end = inp.selectionEnd;
      inp.value = val.slice(0, start) + val.slice(end);
      try {
        inp.setSelectionRange(start, start);
      } catch (_) {}
    } else if (inp.selectionStart != null && inp.selectionStart > 0) {
      const start = inp.selectionStart;
      inp.value = val.slice(0, start - 1) + val.slice(start);
      try {
        inp.setSelectionRange(start - 1, start - 1);
      } catch (_) {}
    } else {
      inp.value = val.slice(0, -1);
    }
    inp.dispatchEvent(new Event("input", { bubbles: true }));
  };

  SpxOsk.prototype._onClick = function (e) {
    const btn = e.target.closest("[data-osk]");
    if (!btn) return;
    const k = btn.getAttribute("data-osk");
    if (k === "done" || k === "close") {
      if (this.target) this.target.blur();
      this.hide();
      return;
    }
    if (k === "enter") {
      this._insert("\n");
      return;
    }
    if (k === "tab") {
      this._insert("\t");
      return;
    }
    if (k === "caps") {
      this.caps = !this.caps;
      this.shift = false;
      this._render();
      return;
    }
    if (k === "shift") {
      this.shift = !this.shift;
      this._render();
      return;
    }
    if (k === "123") {
      this.mode = "num";
      this._render();
      return;
    }
    if (k === "abc") {
      this.mode = "alpha";
      this.shift = false;
      this._render();
      return;
    }
    if (k === "back") {
      this._backspace();
      return;
    }
    if (k === "clear") {
      const inp = this._resolveInput() || this.target;
      if (inp) {
        this.target = inp;
        inp.value = "";
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    if (k === "space") {
      this._insert(" ");
      return;
    }
    this._insert(k);
    // Shift 单击：输入字母/上档符号后自动弹起
    const actions = new Set([
      "caps",
      "shift",
      "back",
      "clear",
      "123",
      "abc",
      "space",
      "close",
      "tab",
      "enter",
      "done",
    ]);
    if (this.mode === "alpha" && this.shift && !actions.has(k)) {
      this.shift = false;
      this._render();
    }
  };

  function SpxPopupHost(options) {
    this.getCtx = options.getCtx;
    this.onAction = options.onAction || function () {};
    this.activeKey = null;
    this.triggerEl = null;
    this._placeMode = null;
    this._placeTrigger = null;
    this.settingsTabId = null; // 系统设置当前 tab，切换弹窗后恢复
    this.settingsSecId = null; // 系统设置当前子分类（分区 id）
    this.debugTabId = null; // 硬件调试当前 tab
    this._defStepEditId = ""; // 疵点设置：当前弹出编辑的尺寸字段 id

    this.root = el("div", "spx-popup-root");
    this.root.hidden = true;
    this.root.innerHTML = `
      <div class="spx-popup-mask" data-act="close"></div>
      <div class="spx-popup-shell" id="spxPopupShell">
        <header class="spx-popup-header">
          <div class="spx-popup-title" id="spxPopupTitle"></div>
          <button type="button" class="spx-popup-close" data-act="close" aria-label="close">×</button>
        </header>
        <div class="spx-popup-body" id="spxPopupBody"></div>
      </div>`;
    document.body.appendChild(this.root);

    this.shell = this.root.querySelector("#spxPopupShell");
    this.titleEl = this.root.querySelector("#spxPopupTitle");
    this.bodyEl = this.root.querySelector("#spxPopupBody");
    this.osk = new SpxOsk(this);

    this.root.addEventListener("click", (e) => this._onClick(e));
    this.root.addEventListener("input", (e) => this._onInput(e));
    this.root.addEventListener("pointerdown", (e) => this._onPlcPointerDown(e));
    this.root.addEventListener("pointerup", (e) => this._onPlcPointerUp(e));
    this.root.addEventListener("pointercancel", (e) => this._onPlcPointerUp(e));
    this.root.addEventListener("change", (e) => this._onInput(e));
    this.bodyEl.addEventListener("focusin", (e) => this._onFocusIn(e));
    this.bodyEl.addEventListener("focusout", (e) => this._onFocusOut(e));
    document.addEventListener("keydown", (e) => {
      if (!this.activeKey) return;
      if (this._defStepEditId && (e.key === "Escape" || e.key === "Enter")) {
        this._closeDefStepEditor();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const clothAdd = this.bodyEl && this.bodyEl.querySelector("#popDefectClothAdd");
      const clothAddOpen = !!(clothAdd && !clothAdd.hidden);
      if (clothAddOpen && e.key === "Escape") {
        clothAdd.hidden = true;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (
        clothAddOpen &&
        e.key === "Enter" &&
        e.target &&
        e.target.id === "popDefectClothName"
      ) {
        e.preventDefault();
        e.stopPropagation();
        this._actEl = e.target;
        this.onAction("defect-settings-cloth-add-ok", this.activeKey, this);
        return;
      }
      if (e.key === "Escape") this.close();
    });
  }

  SpxPopupHost.prototype._closeDefStepEditor = function () {
    if (this._defStepScrollEl && this._defStepScrollHandler) {
      try {
        this._defStepScrollEl.removeEventListener("scroll", this._defStepScrollHandler);
      } catch (_) { /* ignore */ }
    }
    this._defStepScrollEl = null;
    this._defStepScrollHandler = null;
    this._commitDefStepEditor();
    const editor = this.bodyEl && this.bodyEl.querySelector("#popDefStepEditor");
    if (editor) editor.hidden = true;
    if (this.bodyEl) {
      this.bodyEl.querySelectorAll(".spx-def-val-btn.is-editing").forEach((b) => b.classList.remove("is-editing"));
    }
    this._defStepEditId = "";
  };

  SpxPopupHost.prototype._commitDefStepEditor = function () {
    const id = this._defStepEditId;
    if (!id || !this.bodyEl) return;
    const editorInp = this.bodyEl.querySelector("#popDefStepEditorVal");
    const wrap = this.bodyEl.querySelector(`.spx-def-step[data-step-id="${id}"]`);
    const hidden = this.bodyEl.querySelector(`#${id}`);
    const btn = wrap && wrap.querySelector(".spx-def-val-btn");
    if (!editorInp || !hidden) return;
    const min = Number((wrap && wrap.getAttribute("data-min")) || 0) || 0;
    const max = Number((wrap && wrap.getAttribute("data-max")) || 9999) || 9999;
    let v = Number(editorInp.value);
    if (!Number.isFinite(v)) v = Number(hidden.value) || 0;
    v = Math.min(max, Math.max(min, Math.round(v)));
    hidden.value = String(v);
    if (btn) btn.textContent = String(v);
    editorInp.value = String(v);
  };

  SpxPopupHost.prototype._openDefStepEditor = function (targetId, anchorEl) {
    if (!this.bodyEl || !targetId || !anchorEl) return;
    if (this._defStepEditId && this._defStepEditId !== targetId) this._closeDefStepEditor();
    const panel = this.bodyEl.querySelector(".spx-defect-panel");
    const editor = this.bodyEl.querySelector("#popDefStepEditor");
    const editorInp = this.bodyEl.querySelector("#popDefStepEditorVal");
    const wrap = this.bodyEl.querySelector(`.spx-def-step[data-step-id="${targetId}"]`);
    const hidden = this.bodyEl.querySelector(`#${targetId}`);
    if (!panel || !editor || !editorInp || !hidden) return;

    this.bodyEl.querySelectorAll(".spx-def-val-btn.is-editing").forEach((b) => b.classList.remove("is-editing"));
    anchorEl.classList.add("is-editing");
    this._defStepEditId = targetId;
    editorInp.value = String(Number(hidden.value) || 0);
    editor.hidden = false;

    // 先显示再量尺寸，锚点下方居中；溢出时钳到面板内
    const pr = panel.getBoundingClientRect();
    const ar = anchorEl.getBoundingClientRect();
    const ew = editor.offsetWidth || 120;
    const eh = editor.offsetHeight || 40;
    let left = ar.left - pr.left + (ar.width - ew) / 2;
    let top = ar.bottom - pr.top + 6;
    left = Math.max(4, Math.min(left, Math.max(4, pr.width - ew - 4)));
    if (top + eh > pr.height - 4) top = Math.max(4, ar.top - pr.top - eh - 6);
    editor.style.left = `${Math.round(left)}px`;
    editor.style.top = `${Math.round(top)}px`;

    const scroll = panel.querySelector(".spx-defect-scroll");
    if (scroll) {
      this._defStepScrollEl = scroll;
      this._defStepScrollHandler = () => this._closeDefStepEditor();
      scroll.addEventListener("scroll", this._defStepScrollHandler, { passive: true });
    }

    requestAnimationFrame(() => {
      try {
        editorInp.focus({ preventScroll: true });
        editorInp.select();
      } catch (_) { /* ignore */ }
    });
  };

  SpxPopupHost.prototype.modeFor = function (key) {
    if (FORM_KEYS.has(key)) return "form";
    if (SHEET_EDITOR_KEYS.has(key)) return "info";
    if (LEFT_KEYS.has(key)) return "left";
    return CENTER_KEYS.has(key) ? "center" : "quick";
  };

  SpxPopupHost.prototype.isOpen = function (key) {
    return !!this.activeKey && this.activeKey === key && !this.root.hidden;
  };

  SpxPopupHost.prototype.close = function () {
    if (this._defStepEditId) this._closeDefStepEditor();
    if (this.osk) this.osk.hide();
    this._disposeTool();
    if (global.SpxPlcSys && typeof global.SpxPlcSys.unmount === "function") global.SpxPlcSys.unmount();
    if (global.SpxPlcIo && typeof global.SpxPlcIo.unmount === "function") global.SpxPlcIo.unmount();
    this.activeKey = null;
    this.triggerEl = null;
    this._placeMode = null;
    this._placeTrigger = null;
    this.root.hidden = true;
    this.root.classList.remove("modeless");
    this.shell.classList.remove("center", "quick", "info", "form", "left", "tool", "login", "osk-lift");
  };

  SpxPopupHost.prototype._disposeTool = function () {
    if (this._toolCleanup) {
      try { this._toolCleanup(); } catch (_) { /* ignore */ }
      this._toolCleanup = null;
    }
    this._toolApi = null;
  };

  /** 工具弹窗：画布交互（人工疵点 / 净幅宽 / 贴标全图缩放） */
  SpxPopupHost.prototype._initTool = function (key) {
    this._disposeTool();
    if (key === "artificalAddDefect") this._initArtificalAddDefect();
    else if (key === "artificalEditDefect" || key === "defectEdit") this._initArtificalEditDefect();
    else if (key === "artificalAddWidth") this._initArtificalAddWidth();
    else if (key === "defectAidedSelection") this._initDefectAidedZoom();
  };

  /** 疵点辅助选择：全图滚轮缩放 + 拖拽平移 */
  SpxPopupHost.prototype._initDefectAidedZoom = function () {
    const viewport = this.bodyEl && this.bodyEl.querySelector("#spxAidedMain");
    const img = viewport && viewport.querySelector(".spx-aided-main-img");
    const zoomLab = this.bodyEl && this.bodyEl.querySelector("#spxAidedZoom");
    const zoomBar = this.bodyEl && this.bodyEl.querySelector("#spxAidedZoomBar");
    if (!viewport || !img) return;

    const host = this;
    const clampZoom = (z) => Math.min(6, Math.max(1, z));
    const stateOf = () => {
      const c = host.getCtx() || {};
      if (!c.state) c.state = {};
      return c.state;
    };
    const read = () => {
      const st = stateOf();
      return {
        zoom: clampZoom(Number(st.aidedZoom) > 0 ? Number(st.aidedZoom) : 1),
        panX: Number(st.aidedPanX) || 0,
        panY: Number(st.aidedPanY) || 0,
      };
    };
    const write = (zoom, panX, panY) => {
      const st = stateOf();
      st.aidedZoom = zoom;
      st.aidedPanX = panX;
      st.aidedPanY = panY;
    };
    const apply = () => {
      const { zoom, panX, panY } = read();
      const zoomed = zoom > 1.001;
      img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
      viewport.classList.toggle("is-zoomed", zoomed);
      if (zoomLab) zoomLab.textContent = `${Math.round(zoom * 100)}%`;
      if (zoomBar) zoomBar.classList.toggle("is-visible", zoomed);
    };

    // 换图时复位缩放（同弹窗内 refresh 换图）
    const mainUrl = (host.getCtx() && host.getCtx().aidedMainImageUrl) || img.getAttribute("src") || "";
    if (host._aidedZoomUrl && host._aidedZoomUrl !== mainUrl) {
      write(1, 0, 0);
    }
    host._aidedZoomUrl = mainUrl;

    img.style.transformOrigin = "0 0";
    img.draggable = false;
    apply();

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pointerId = null;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = viewport.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const cur = read();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const nextZoom = clampZoom(cur.zoom * factor);
      if (Math.abs(nextZoom - cur.zoom) < 1e-6) return;
      const nextPanX = cx - (cx - cur.panX) * (nextZoom / cur.zoom);
      const nextPanY = cy - (cy - cur.panY) * (nextZoom / cur.zoom);
      write(nextZoom, nextPanX, nextPanY);
      apply();
    };

    const onDown = (e) => {
      if (e.button != null && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest(".spx-aided-zoombar")) return;
      const cur = read();
      if (cur.zoom <= 1.001) return;
      dragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      viewport.classList.add("is-panning");
      try { viewport.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      const cur = read();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      write(cur.zoom, cur.panX + dx, cur.panY + dy);
      apply();
    };
    const onUp = (e) => {
      if (!dragging) return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      viewport.classList.remove("is-panning");
      try { viewport.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    };
    const resetZoomView = () => {
      write(1, 0, 0);
      apply();
    };
    const onContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetZoomView();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("contextmenu", onContextMenu);

    this._toolApi = {
      setZoom(delta) {
        const cur = read();
        const rect = viewport.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const nextZoom = clampZoom(cur.zoom + Number(delta || 0));
        const nextPanX = cx - (cx - cur.panX) * (nextZoom / cur.zoom);
        const nextPanY = cy - (cy - cur.panY) * (nextZoom / cur.zoom);
        write(nextZoom, nextZoom <= 1.001 ? 0 : nextPanX, nextZoom <= 1.001 ? 0 : nextPanY);
        apply();
      },
      resetZoom() {
        resetZoomView();
      },
    };
    this._toolCleanup = () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("contextmenu", onContextMenu);
    };
  };

  SpxPopupHost.prototype._initArtificalAddDefect = function () {
    const canvas = this.bodyEl.querySelector("#spxArtCanvas");
    const thumb = this.bodyEl.querySelector("#spxArtThumb");
    const hint = this.bodyEl.querySelector("#spxArtHint");
    const coord = this.bodyEl.querySelector("#spxArtCoord");
    const status = this.bodyEl.querySelector("#spxArtStatus");
    const zoomLab = this.bodyEl.querySelector("#spxArtZoom");
    const loadingEl = this.bodyEl.querySelector("#spxArtLoading");
    const previewThumb = this.bodyEl.querySelector("#spxArtPreviewThumb");
    const padBadge = this.bodyEl.querySelector("#spxArtPad");
    if (!canvas) return;
    const ctx2 = canvas.getContext("2d");
    const host = this;
    let zoom = 1;
    let dragging = false;
    let startImg = null;
    let draftImg = null;
    let pan = { x: 0, y: 0 };
    let tiles = [];
    let imgNaturalWidth = 0;
    let imgNaturalHeight = 0;
    let simulated = true;
    let loadGen = 0;
    let viewW = 1;
    let viewH = 1;

    const getState = () => {
      const c = host.getCtx() || {};
      return c.state || {};
    };
    const roisOf = () => (getState().artificalRois || []).slice();
    const modeOf = () => getState().artificalMode || "rect";
    const zh = () => ((host.getCtx() && host.getCtx().lang) || "").startsWith("zh");
    const boardOf = () => getState().artificalBoard || {};

    function setLoading(on, text) {
      if (!loadingEl) return;
      loadingEl.hidden = !on;
      if (text) {
        const lab = loadingEl.querySelector("span");
        if (lab) lab.textContent = text;
      }
    }

    function fitScale() {
      if (imgNaturalWidth <= 0 || imgNaturalHeight <= 0) return 1;
      return Math.min(viewW / imgNaturalWidth, viewH / imgNaturalHeight) * 0.96;
    }

    function worldScale() {
      return fitScale() * zoom;
    }

    function imgToCanvas(ix, iy) {
      const s = worldScale();
      const ox = (viewW - imgNaturalWidth * s) / 2 + pan.x;
      const oy = (viewH - imgNaturalHeight * s) / 2 + pan.y;
      return { x: ox + ix * s, y: oy + iy * s };
    }

    function canvasToImg(cx, cy) {
      const s = worldScale();
      const ox = (viewW - imgNaturalWidth * s) / 2 + pan.x;
      const oy = (viewH - imgNaturalHeight * s) / 2 + pan.y;
      return { x: (cx - ox) / s, y: (cy - oy) / s };
    }

    function toCanvasLocal(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / Math.max(1, r.width)) * viewW,
        y: ((e.clientY - r.top) / Math.max(1, r.height)) * viewH,
      };
    }

    function decodeBlob(blob) {
      return new Promise((resolve, reject) => {
        if (typeof createImageBitmap === "function") {
          createImageBitmap(blob).then(resolve, reject);
          return;
        }
        const im = new Image();
        const url = URL.createObjectURL(blob);
        im.onload = () => {
          URL.revokeObjectURL(url);
          resolve(im);
        };
        im.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("decode"));
        };
        im.src = url;
      });
    }

    function releaseTiles(list) {
      (list || []).forEach((t) => {
        if (t && t.drawable && typeof t.drawable.close === "function") {
          try { t.drawable.close(); } catch (_) { /* ignore */ }
        }
      });
    }

    function useSimulatedBoard() {
      const cached = host._artImageCache && host._artImageCache.tiles;
      if (tiles && tiles !== cached) releaseTiles(tiles);
      tiles = [];
      const board = boardOf();
      imgNaturalWidth = Math.max(800, Number(board.imageWidth) || Number(board.fabricWidth) || 1600);
      imgNaturalHeight = Math.max(600, Math.round(imgNaturalWidth * 0.55));
      simulated = true;
      if (padBadge) {
        padBadge.hidden = false;
        padBadge.textContent = zh() ? "预览模拟" : "sim";
      }
      if (status) status.textContent = zh() ? "无拼图，使用模拟画布" : "No tiles — simulated board";
    }

    function cacheKey(board) {
      const imgs = Array.isArray(board.tiles) ? board.tiles : [];
      return [
        board.imagePath || "",
        getState().artificalImgType != null ? getState().artificalImgType : 0,
        imgs.map((t) => t && t.url).join("|"),
        board.tileCount || imgs.length,
      ].join("::");
    }

    async function loadBoardImage() {
      const board = boardOf();
      const metaTiles = Array.isArray(board.tiles) ? board.tiles : [];
      const key = cacheKey(board);
      if (host._artImageCache && host._artImageCache.key === key && host._artImageCache.tiles) {
        tiles = host._artImageCache.tiles;
        imgNaturalWidth = host._artImageCache.w;
        imgNaturalHeight = host._artImageCache.h;
        simulated = !!host._artImageCache.simulated;
        setLoading(false);
        draw();
        updateRoiPreview();
        return;
      }
      if (!metaTiles.length || board.simulated || !global.SpxApi || typeof global.SpxApi.getAddDefectFileUrl !== "function") {
        useSimulatedBoard();
        setLoading(false);
        draw();
        updateRoiPreview();
        return;
      }
      const gen = ++loadGen;
      setLoading(true, zh() ? "图像正在加载..." : "Loading image...");
      try {
        let accY = 0;
        const loaded = [];
        for (const img of metaTiles) {
          if (gen !== loadGen) return;
          const url = global.SpxApi.getAddDefectFileUrl(img.url);
          const res = await fetch(url, { credentials: "same-origin" });
          if (!res.ok) throw new Error("tile HTTP " + res.status);
          const drawable = await decodeBlob(await res.blob());
          loaded.push({
            drawable: drawable,
            yStart: accY,
            w: Number(img.w) || drawable.width || 0,
            h: Number(img.h) || drawable.height || 0,
          });
          accY += Number(img.h) || drawable.height || 0;
        }
        if (gen !== loadGen) {
          releaseTiles(loaded);
          return;
        }
        const prevCached = host._artImageCache && host._artImageCache.tiles;
        if (tiles && tiles !== prevCached) releaseTiles(tiles);
        tiles = loaded;
        imgNaturalWidth = Number(board.imageWidth) || (loaded[0] && loaded[0].w) || 0;
        imgNaturalHeight = Number(board.totalHeight) || accY;
        if (!imgNaturalWidth && loaded[0]) imgNaturalWidth = loaded[0].w;
        if (!imgNaturalHeight) imgNaturalHeight = accY;
        simulated = false;
        if (prevCached && prevCached !== tiles) releaseTiles(prevCached);
        host._artImageCache = {
          key: key,
          tiles: tiles,
          w: imgNaturalWidth,
          h: imgNaturalHeight,
          simulated: false,
        };
        if (padBadge) {
          padBadge.hidden = false;
          padBadge.textContent = zh()
            ? `图像 · ${loaded.length}片`
            : `img · ${loaded.length}`;
        }
        if (status) {
          status.textContent = zh()
            ? `已加载 ${imgNaturalWidth}×${imgNaturalHeight}`
            : `Loaded ${imgNaturalWidth}×${imgNaturalHeight}`;
        }
        setLoading(false);
        draw();
        updateRoiPreview();
      } catch (e) {
        if (gen !== loadGen) return;
        console.warn("artificalAddDefect loadBoardImage", e);
        useSimulatedBoard();
        setLoading(false);
        if (status) {
          status.textContent = (zh() ? "加载图片失败：" : "Image load failed: ")
            + ((e && e.message) || e);
        }
        draw();
        updateRoiPreview();
      }
    }

    function drawPlaceholder(g, w, h) {
      g.fillStyle = "#121218";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(201,208,220,0.08)";
      g.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < w; x += step) {
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke();
      }
      for (let y = 0; y < h; y += step) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
      }
      g.fillStyle = "rgba(201,208,220,0.28)";
      g.font = '12px "Segoe UI","Microsoft YaHei UI","Microsoft YaHei",sans-serif';
      g.fillText(zh() ? "模拟布面（无后端拼图）" : "SIM FABRIC · NO TILES", 16, 28);
    }

    function drawBoard(g) {
      if (!tiles.length || simulated) {
        const tl = imgToCanvas(0, 0);
        const br = imgToCanvas(imgNaturalWidth, imgNaturalHeight);
        const w = Math.max(1, br.x - tl.x);
        const h = Math.max(1, br.y - tl.y);
        g.save();
        g.beginPath();
        g.rect(tl.x, tl.y, w, h);
        g.clip();
        g.translate(tl.x, tl.y);
        g.scale(w / Math.max(1, imgNaturalWidth), h / Math.max(1, imgNaturalHeight));
        drawPlaceholder(g, imgNaturalWidth, imgNaturalHeight);
        g.restore();
        return;
      }
      const s = worldScale();
      const ox = (viewW - imgNaturalWidth * s) / 2 + pan.x;
      const oy = (viewH - imgNaturalHeight * s) / 2 + pan.y;
      tiles.forEach((t) => {
        try {
          g.drawImage(
            t.drawable,
            ox,
            oy + t.yStart * s,
            t.w * s,
            t.h * s
          );
        } catch (_) { /* ignore tile draw */ }
      });
    }

    function updateThumbNav() {
      if (!thumb) return;
      if (tiles.length && !simulated) {
        try {
          const off = document.createElement("canvas");
          off.width = 160;
          off.height = Math.max(40, Math.round(160 * (imgNaturalHeight / Math.max(1, imgNaturalWidth))));
          const og = off.getContext("2d");
          const sy = off.height / Math.max(1, imgNaturalHeight);
          const sx = off.width / Math.max(1, imgNaturalWidth);
          tiles.forEach((t) => {
            og.drawImage(t.drawable, 0, t.yStart * sy, t.w * sx, t.h * sy);
          });
          thumb.style.backgroundImage = `url(${off.toDataURL("image/jpeg", 0.7)})`;
          thumb.style.backgroundSize = "cover";
        } catch (_) {
          thumb.style.backgroundImage = "";
        }
      } else {
        thumb.style.backgroundImage = "linear-gradient(90deg,#1a1a22 0 40%,#22222c 40% 100%)";
      }
      const s = worldScale();
      const ox = (viewW - imgNaturalWidth * s) / 2 + pan.x;
      const oy = (viewH - imgNaturalHeight * s) / 2 + pan.y;
      const left = Math.max(0, Math.min(100, (-ox / Math.max(1, imgNaturalWidth * s)) * 100));
      const top = Math.max(0, Math.min(100, (-oy / Math.max(1, imgNaturalHeight * s)) * 100));
      const vw = Math.max(6, Math.min(100, (viewW / Math.max(1, imgNaturalWidth * s)) * 100));
      const vh = Math.max(6, Math.min(100, (viewH / Math.max(1, imgNaturalHeight * s)) * 100));
      thumb.innerHTML = `<div class="spx-art-thumb-vp" style="left:${left}%;top:${top}%;width:${vw}%;height:${vh}%"></div>`;
    }

    function updateRoiPreview() {
      if (!previewThumb) return;
      const selId = getState().artificalRoiId;
      const sel = roisOf().find((r) => r.id === selId);
      if (!sel) {
        previewThumb.textContent = zh() ? "暂无预览" : "No preview";
        previewThumb.classList.remove("has-img");
        return;
      }
      if (!tiles.length || simulated) {
        previewThumb.textContent = zh() ? "ROI 预览" : "ROI";
        previewThumb.classList.remove("has-img");
        return;
      }
      try {
        const rw = Math.max(1, Math.round(sel.w));
        const rh = Math.max(1, Math.round(sel.h));
        const off = document.createElement("canvas");
        off.width = rw;
        off.height = rh;
        const og = off.getContext("2d");
        tiles.forEach((t) => {
          const overlapY0 = Math.max(sel.y, t.yStart);
          const overlapY1 = Math.min(sel.y + sel.h, t.yStart + t.h);
          if (overlapY1 <= overlapY0) return;
          const sx = Math.max(0, sel.x);
          const sy = overlapY0 - t.yStart;
          const sw = Math.min(t.w - sx, sel.w);
          const sh = overlapY1 - overlapY0;
          if (sw <= 0 || sh <= 0) return;
          og.drawImage(
            t.drawable,
            sx, sy, sw, sh,
            0, overlapY0 - sel.y, sw, sh
          );
        });
        previewThumb.innerHTML = `<img src="${off.toDataURL("image/jpeg", 0.85)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain" />`;
        previewThumb.classList.add("has-img");
      } catch (_) {
        previewThumb.textContent = zh() ? "ROI 预览" : "ROI";
      }
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.fillStyle = "#0B0E12";
      ctx2.fillRect(0, 0, w, h);
      if (imgNaturalWidth > 0 && imgNaturalHeight > 0) drawBoard(ctx2);

      const rois = roisOf();
      const sel = getState().artificalRoiId;
      rois.forEach((r) => {
        const tl = imgToCanvas(r.x, r.y);
        const br = imgToCanvas(r.x + r.w, r.y + r.h);
        const x = tl.x;
        const y = tl.y;
        const rw = br.x - tl.x;
        const rh = br.y - tl.y;
        ctx2.strokeStyle = r.id === sel ? "#E0B84A" : "#E85A5C";
        ctx2.lineWidth = 2;
        ctx2.strokeRect(x, y, rw, rh);
        ctx2.fillStyle = "rgba(232,90,92,0.12)";
        ctx2.fillRect(x, y, rw, rh);
        ctx2.fillStyle = "#C9D0DC";
        ctx2.font = '11px "Segoe UI","Microsoft YaHei UI",sans-serif';
        ctx2.fillText(`${r.id} ${r.label || ""}`, x + 4, y + 14);
      });
      if (draftImg) {
        const tl = imgToCanvas(
          Math.min(draftImg.x, draftImg.x + draftImg.w),
          Math.min(draftImg.y, draftImg.y + draftImg.h)
        );
        const br = imgToCanvas(
          Math.max(draftImg.x, draftImg.x + draftImg.w),
          Math.max(draftImg.y, draftImg.y + draftImg.h)
        );
        ctx2.strokeStyle = draftImg.measure ? "#5B8CFF" : "#3ddc97";
        ctx2.lineWidth = 2;
        ctx2.setLineDash([6, 4]);
        ctx2.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx2.setLineDash([]);
      }
      updateThumbNav();
      if (zoomLab) zoomLab.textContent = `${Math.round(zoom * 100)}%`;
    }

    function resize() {
      const box = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      viewW = Math.max(1, box.width);
      viewH = Math.max(1, box.height);
      canvas.width = Math.max(1, Math.floor(viewW * dpr));
      canvas.height = Math.max(1, Math.floor(viewH * dpr));
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
      ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      updateRoiPreview();
    }

    function onDown(e) {
      const mode = modeOf();
      const p = toCanvasLocal(e);
      const img = canvasToImg(p.x, p.y);
      dragging = true;
      startImg = img;
      if (mode === "rect" || mode === "measure") draftImg = { x: img.x, y: img.y, w: 0, h: 0, measure: mode === "measure" };
      canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const p = toCanvasLocal(e);
      const img = canvasToImg(p.x, p.y);
      if (coord) {
        const mmX = (img.x * 0.14).toFixed(1);
        const mmY = (img.y * 0.14).toFixed(1);
        coord.textContent = zh()
          ? `图像 X: ${img.x.toFixed(0)}, Y: ${img.y.toFixed(0)} px | 物理 X: ${mmX}, Y: ${mmY} mm`
          : `Image X: ${img.x.toFixed(0)}, Y: ${img.y.toFixed(0)} px | Physical X: ${mmX}, Y: ${mmY} mm`;
      }
      if (!dragging || !startImg) return;
      const mode = modeOf();
      if (mode === "move") {
        pan.x += e.movementX;
        pan.y += e.movementY;
        draw();
        return;
      }
      if ((mode === "rect" || mode === "measure") && draftImg) {
        draftImg.w = img.x - startImg.x;
        draftImg.h = img.y - startImg.y;
        draw();
      }
    }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      const mode = modeOf();
      if (mode === "rect" && draftImg && Math.abs(draftImg.w) > 8 && Math.abs(draftImg.h) > 8) {
        const x = Math.min(draftImg.x, draftImg.x + draftImg.w);
        const y = Math.min(draftImg.y, draftImg.y + draftImg.h);
        const w = Math.abs(draftImg.w);
        const h = Math.abs(draftImg.h);
        host._pendingRoi = { x, y, w, h };
        host.onAction("art-roi-add", "artificalAddDefect", host);
      }
      if (mode === "measure" && draftImg && status) {
        const px = Math.hypot(draftImg.w, draftImg.h);
        const mm = px * 0.14;
        status.textContent = `Δ ${px.toFixed(0)} px · ~${mm.toFixed(1)} mm`;
      }
      draftImg = null;
      startImg = null;
      draw();
      updateRoiPreview();
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    resize();
    if (hint) hint.style.opacity = "1";
    setTimeout(() => { if (hint) hint.style.opacity = "0"; }, 2200);
    loadBoardImage();

    function cropRoiToCanvas(roi) {
      if (!roi || !tiles.length || simulated) return null;
      const rw = Math.max(1, Math.round(roi.w));
      const rh = Math.max(1, Math.round(roi.h));
      const off = document.createElement("canvas");
      off.width = rw;
      off.height = rh;
      const og = off.getContext("2d");
      tiles.forEach((t) => {
        const overlapY0 = Math.max(roi.y, t.yStart);
        const overlapY1 = Math.min(roi.y + roi.h, t.yStart + t.h);
        if (overlapY1 <= overlapY0) return;
        const sx = Math.max(0, roi.x);
        const sy = overlapY0 - t.yStart;
        const sw = Math.min(t.w - sx, roi.w);
        const sh = overlapY1 - overlapY0;
        if (sw <= 0 || sh <= 0) return;
        og.drawImage(t.drawable, sx, sy, sw, sh, 0, overlapY0 - roi.y, sw, sh);
      });
      return off;
    }

    function exportRoiBlobs(rois) {
      const list = Array.isArray(rois) ? rois : [];
      return Promise.all(list.map((r, i) => new Promise((resolve) => {
        const c = cropRoiToCanvas(r);
        if (!c) {
          resolve(null);
          return;
        }
        c.toBlob((blob) => {
          resolve(blob ? { blob: blob, name: "defect_" + i + "_F.jpg" } : null);
        }, "image/jpeg", 0.92);
      }))).then((arr) => arr.filter(Boolean));
    }

    this._toolApi = {
      setZoom(delta) {
        zoom = Math.min(3, Math.max(0.5, zoom + delta));
        draw();
        updateRoiPreview();
      },
      resetZoom() {
        zoom = 1;
        pan = { x: 0, y: 0 };
        draw();
        updateRoiPreview();
      },
      redraw() {
        draw();
        updateRoiPreview();
      },
      reloadBoard: loadBoardImage,
      exportRoiBlobs: exportRoiBlobs,
      clearImageCache() {
        const cached = host._artImageCache && host._artImageCache.tiles;
        if (cached && cached !== tiles) releaseTiles(cached);
        host._artImageCache = null;
      },
    };
    this._toolCleanup = () => {
      loadGen += 1;
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  };

  SpxPopupHost.prototype._initArtificalEditDefect = function () {
    const canvas = this.bodyEl.querySelector("#spxEditMapCanvas");
    if (!canvas) return;
    const g = canvas.getContext("2d");
    const host = this;
    const MAP_MAX_X = 2000;
    const MARGIN = 28;

    function listOf() {
      return normalizeEditDefectList(host.getCtx() || {});
    }
    function selectedIdOf() {
      const st = (host.getCtx() && host.getCtx().state) || {};
      if (st.editSelectedId != null) return st.editSelectedId;
      if (st.selectedId != null) return st.selectedId;
      const list = listOf();
      return list[0] ? list[0].id : null;
    }
    function maxYOf(list) {
      let maxY = 10000;
      list.forEach((d) => { if (d.yMm > maxY) maxY = d.yMm; });
      return Math.floor(maxY / 10000) * 10000 + 10000;
    }

    function resize() {
      const box = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(box.width * dpr));
      canvas.height = Math.max(1, Math.floor(box.height * dpr));
      canvas.style.width = `${box.width}px`;
      canvas.style.height = `${box.height}px`;
      draw();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const list = listOf();
      const sel = selectedIdOf();
      const maxY = maxYOf(list);
      const m = MARGIN * (window.devicePixelRatio || 1);
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = "#121218";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(201,208,220,0.35)";
      g.strokeRect(0.5, 0.5, w - 1, h - 1);

      const xScale = (w - 2 * m) / MAP_MAX_X;
      const yScale = (h - 2 * m) / maxY;
      g.strokeStyle = "rgba(201,208,220,0.12)";
      g.fillStyle = "rgba(201,208,220,0.45)";
      g.font = `${10 * (window.devicePixelRatio || 1)}px "Segoe UI","Microsoft YaHei UI","Microsoft YaHei",sans-serif`;
      for (let x = 0; x <= MAP_MAX_X; x += 200) {
        const sx = m + x * xScale;
        g.beginPath(); g.moveTo(sx, m); g.lineTo(sx, h - m); g.stroke();
        g.fillText((x / 1000).toFixed(1), sx - 8, h - m + 14);
      }
      for (let y = 0; y <= maxY; y += 5000) {
        const sy = h - m - y * yScale;
        g.beginPath(); g.moveTo(m, sy); g.lineTo(w - m, sy); g.stroke();
        g.fillText(String(Math.round(y / 1000)), 4, sy + 3);
      }

      list.forEach((d) => {
        const sx = m + Math.min(MAP_MAX_X, Math.max(0, d.xMm)) * xScale;
        const sy = h - m - Math.min(maxY, Math.max(0, d.yMm)) * yScale;
        const on = d.id === sel;
        const r = (on ? 7 : 4) * (window.devicePixelRatio || 1);
        g.beginPath();
        g.fillStyle = on ? "#E85A5C" : "#3ddc97";
        g.arc(sx, sy, r, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#C9D0DC";
        g.font = `${11 * (window.devicePixelRatio || 1)}px sans-serif`;
        g.textAlign = "center";
        g.fillText(d.title || String(d.id), sx, sy - r - 4);
        g.textAlign = "left";
      });
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const px = (e.clientX - rect.left) * dpr;
      const py = (e.clientY - rect.top) * dpr;
      const list = listOf();
      const maxY = maxYOf(list);
      const m = MARGIN * (window.devicePixelRatio || 1);
      const xScale = (canvas.width - 2 * m) / MAP_MAX_X;
      const yScale = (canvas.height - 2 * m) / maxY;
      const mmX = (px - m) / xScale;
      const mmY = (canvas.height - m - py) / yScale;
      let nearest = null;
      let minDist = 120;
      list.forEach((d) => {
        const dist = Math.abs(d.xMm - mmX) + Math.abs(d.yMm - mmY);
        if (dist < minDist) {
          minDist = dist;
          nearest = d;
        }
      });
      if (nearest) {
        host._pendingEditId = nearest.id;
        host.onAction("edit-select", host.activeKey, host);
      }
    }

    canvas.addEventListener("click", onClick);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    resize();

    this._toolApi = { redraw: draw };
    this._toolCleanup = () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  };

  /** 对齐 views/artifical_add_width.html：触摸板 / 画布点击 / 手输 + API */
  SpxPopupHost.prototype._initArtificalAddWidth = function () {
    const canvas = this.bodyEl.querySelector("#spxWidthCanvas");
    if (!canvas) return;
    const g = canvas.getContext("2d");
    const host = this;
    const zh = () => (host.getCtx().lang || "").startsWith("zh");
    const apiBase = (global.SpxApi && global.SpxApi.base) || "";
    const apiUrl = (path) => {
      if (!path) return apiBase || "/";
      if (/^https?:\/\//i.test(path)) return path;
      return (apiBase || "") + (path.charAt(0) === "/" ? path : "/" + path);
    };

    const statusEl = host.bodyEl.querySelector("#spxWidthStatus");
    const padBadge = host.bodyEl.querySelector("#spxWidthPad");
    const padData = host.bodyEl.querySelector("#spxWidthPadData");
    const loadingEl = host.bodyEl.querySelector("#spxWidthLoading");
    const floatEl = host.bodyEl.querySelector("#spxWidthFloat");
    const leftEl = host.bodyEl.querySelector("#spxWidthLeft");
    const rightEl = host.bodyEl.querySelector("#spxWidthRight");
    const widthEl = host.bodyEl.querySelector("#spxWidthVal");
    const lastEl = host.bodyEl.querySelector("#spxWidthLast");
    const btnSave = host.bodyEl.querySelector('[data-act="width-save"]');
    const manualWrap = host.bodyEl.querySelector("#spxWidthManual");
    const widthInput = host.bodyEl.querySelector("#spxWidthInput");
    const chkShowImage = host.bodyEl.querySelector("#spxWidthShowImg");

    const TOUCHPAD_POLL_MS = 400;
    let isEnableTouchPad = true;
    let touchPadWidthMm = 2000;
    let touchPadLengthMm = 500;
    let simulatedImage = false;
    let showBoardImage = false;
    let loadingBoardImage = false;
    let pageOpenedAtMs = Date.now();
    let lastTouchpadSeq = -1;
    let touchpadPollTimer = null;
    let imgNaturalWidth = 0;
    let imgNaturalHeight = 0;
    let tiles = [];
    let scale = 1;
    let imgOffsetX = 0;
    let imgOffsetY = 0;
    let edges = [];
    let drag = null;
    let savedHint = "";
    let lastMeasure = null;
    let manualMode = false;
    let previewMode = false; // 无 API 时本地演示

    function setStatus(text) {
      if (statusEl) statusEl.textContent = text || "";
    }
    function setLoading(on, text) {
      if (!loadingEl) return;
      loadingEl.classList.toggle("active", !!on);
      if (text) loadingEl.textContent = text;
    }
    function manualCm() {
      const cm = Number(widthInput && widthInput.value);
      return Number.isFinite(cm) && cm > 0.1 ? cm : 0;
    }
    function fmtMm(v) {
      if (!Number.isFinite(v)) return "—";
      return (Math.round(v * 10) / 10).toFixed(1) + " mm";
    }
    function sortedEdges() {
      return edges.slice().sort((a, b) => a.actualX - b.actualX);
    }
    function stageSize() {
      const stage = canvas.parentElement;
      return {
        w: Math.max(1, canvas.clientWidth || (stage && stage.clientWidth) || 1),
        h: Math.max(1, canvas.clientHeight || (stage && stage.clientHeight) || 1),
      };
    }
    function fitImage() {
      const size = stageSize();
      if (imgNaturalWidth <= 0 || imgNaturalHeight <= 0) return;
      scale = Math.min(size.w / imgNaturalWidth, size.h / imgNaturalHeight);
      if (!(scale > 0) || !Number.isFinite(scale)) scale = 1;
      imgOffsetX = (size.w - imgNaturalWidth * scale) / 2;
      imgOffsetY = (size.h - imgNaturalHeight * scale) / 2;
    }
    function resizeCanvas() {
      const size = stageSize();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(size.w * dpr);
      canvas.height = Math.round(size.h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (imgNaturalWidth > 0 && imgNaturalHeight > 0 && !drag) fitImage();
      draw();
    }
    function drawSimulatedPanel() {
      g.fillStyle = "#1a1a22";
      g.fillRect(0, 0, imgNaturalWidth, imgNaturalHeight);
      g.fillStyle = "rgba(201,208,220,0.05)";
      for (let i = 0; i < 32; i++) {
        g.fillRect(i * (imgNaturalWidth / 32), 0, 1, imgNaturalHeight);
      }
    }
    function draw() {
      const size = stageSize();
      g.clearRect(0, 0, size.w, size.h);
      g.fillStyle = "#0c0c10";
      g.fillRect(0, 0, size.w, size.h);
      if (!tiles.length && !simulatedImage) return;
      if (!(scale > 0) || !Number.isFinite(scale)) fitImage();
      g.save();
      g.translate(imgOffsetX, imgOffsetY);
      g.scale(scale, scale);
      if (simulatedImage) drawSimulatedPanel();
      else {
        for (const tile of tiles) {
          g.drawImage(tile.drawable, 0, tile.yStart, tile.w, tile.h);
        }
      }
      const sorted = sortedEdges();
      sorted.forEach((edge, index) => {
        g.beginPath();
        g.strokeStyle = index === 0 ? "#E85A5C" : "#4c9aff";
        g.lineWidth = 2 / Math.max(scale, 0.0001);
        g.moveTo(edge.imgX, 0);
        g.lineTo(edge.imgX, imgNaturalHeight);
        g.stroke();
      });
      if (edges.length === 0 && lastMeasure && imgNaturalHeight > 0) {
        g.setLineDash([10 / Math.max(scale, 0.0001), 8 / Math.max(scale, 0.0001)]);
        g.lineWidth = 2 / Math.max(scale, 0.0001);
        const prevXs = simulatedImage
          ? [lastMeasure.leftMm, lastMeasure.rightMm]
          : [lastMeasure.leftImgX, lastMeasure.rightImgX];
        prevXs.forEach((imgX, index) => {
          if (!Number.isFinite(imgX)) return;
          g.beginPath();
          g.strokeStyle = index === 0 ? "rgba(232,90,92,0.75)" : "rgba(76,154,255,0.75)";
          g.moveTo(imgX, 0);
          g.lineTo(imgX, imgNaturalHeight);
          g.stroke();
        });
        g.setLineDash([]);
      }
      g.restore();
    }
    function pushNetState(payload) {
      if (!host.getCtx().state) host.getCtx().state = {};
      const prev = host.getCtx().state.netWidth || {};
      host.getCtx().state.netWidth = Object.assign({}, prev, payload || {});
    }
    function refreshReadout() {
      const sorted = sortedEdges();
      const left = sorted[0];
      const right = sorted[1];
      if (leftEl) leftEl.textContent = left ? fmtMm(left.actualX) : "—";
      if (rightEl) rightEl.textContent = right ? fmtMm(right.actualX) : "—";
      const typed = manualCm();
      if (left && right && right.actualX > left.actualX + 1) {
        const cm = (right.actualX - left.actualX) / 10;
        const cmText = (Math.round(cm * 10) / 10).toFixed(1) + " cm";
        if (widthEl) widthEl.textContent = cmText;
        if (floatEl) {
          floatEl.textContent = (zh() ? "净幅宽 " : "Net ") + cmText;
          floatEl.classList.add("show");
        }
        if (btnSave) btnSave.disabled = false;
        setStatus(
          zh()
            ? `左 ${fmtMm(left.actualX)}，右 ${fmtMm(right.actualX)}。确认后写入本卷净幅宽。`
            : `L ${fmtMm(left.actualX)}, R ${fmtMm(right.actualX)}. Confirm to save.`
        );
        pushNetState({
          left: left.actualX / 10,
          right: right.actualX / 10,
          width: cm,
          leftMm: left.actualX,
          rightMm: right.actualX,
        });
      } else if (manualMode && typed > 0) {
        const cmText = (Math.round(typed * 10) / 10).toFixed(1) + " cm";
        if (widthEl) widthEl.textContent = cmText;
        if (floatEl) {
          floatEl.textContent = (zh() ? "净幅宽 " : "Net ") + cmText;
          floatEl.classList.add("show");
        }
        if (btnSave) btnSave.disabled = false;
        setStatus(
          (savedHint ? savedHint + " " : "") +
            (zh() ? `触摸板未启用，按手输净幅宽 ${cmText} 写入本卷。` : `Touchpad off. Manual net ${cmText}.`)
        );
        pushNetState({ left: 0, right: typed, width: typed, leftMm: 0, rightMm: typed * 10 });
      } else {
        if (widthEl) widthEl.textContent = "—";
        if (floatEl) {
          floatEl.textContent = "";
          floatEl.classList.remove("show");
        }
        if (btnSave) btnSave.disabled = true;
        if (edges.length === 0) {
          const hint = manualMode
            ? zh()
              ? "触摸板未启用。请直接输入净幅宽（cm）后确定。"
              : "Touchpad disabled. Enter net width (cm)."
            : showBoardImage
              ? zh()
                ? "显示图片：触摸笔先转实际坐标再画到图上；也可在画布点击。"
                : "Image on: touchpad maps to image; or click canvas."
              : zh()
                ? "未显示图片：用触摸笔点两次，按原始 X 计算净幅宽。也可在画布点击。"
                : "No image: tap twice on touchpad (raw X), or click canvas.";
          setStatus(savedHint ? savedHint + " " + hint : hint);
        } else if (edges.length === 1) {
          setStatus(zh() ? "已收到第 1 条。请再点另一侧布边。" : "Got edge 1. Tap the other side.");
        } else {
          setStatus(zh() ? "两点太近，请重测。" : "Points too close. Reset.");
        }
      }
      draw();
    }
    function addEdge(actualX, imgX) {
      if (!Number.isFinite(actualX) || edges.length >= 2) return;
      let drawX = Number.isFinite(imgX) ? imgX : actualX;
      if (imgNaturalWidth > 0) drawX = Math.max(0, Math.min(drawX, imgNaturalWidth));
      edges.push({ actualX: actualX, imgX: drawX });
      refreshReadout();
    }
    function useSimulatedImage(widthPx, heightPx) {
      tiles.forEach((tile) => {
        if (tile.drawable && typeof tile.drawable.close === "function") tile.drawable.close();
      });
      tiles = [];
      imgNaturalWidth = Math.max(1, Math.round(widthPx > 0 ? widthPx : touchPadWidthMm));
      imgNaturalHeight = Math.max(1, Math.round(heightPx > 0 ? heightPx : touchPadLengthMm));
      simulatedImage = true;
      manualMode = false;
      if (manualWrap) manualWrap.classList.remove("show");
      setLoading(false);
      resizeCanvas();
    }
    function updateTouchpadBar(opts) {
      if (!isEnableTouchPad) {
        if (padBadge) padBadge.hidden = true;
        if (padData) padData.hidden = true;
        return;
      }
      if (padBadge) padBadge.hidden = false;
      if (padData) padData.hidden = false;
      const frame = opts && opts.frame;
      if (padBadge) {
        padBadge.classList.remove("active", "warn");
        if (frame && (frame.seq != null || frame.x != null)) padBadge.classList.add("active");
        else if (opts && opts.isOpen === false) padBadge.classList.add("warn");
      }
      if (!padData) return;
      if (frame && (frame.seq != null || frame.x != null)) {
        padData.textContent =
          "seq=" + (frame.seq != null ? frame.seq : 0) +
          " X=" + (frame.x != null ? frame.x : 0) +
          " Y=" + (frame.y != null ? frame.y : 0);
        return;
      }
      padData.textContent = opts && opts.isOpen === false
        ? (zh() ? "未连接" : "Offline")
        : (zh() ? "等待按压..." : "Waiting...");
    }
    async function mapTouchpad(frame) {
      const padX = Number(frame && frame.x);
      if (!Number.isFinite(padX)) return null;
      if (!showBoardImage) return { imgX: padX, actualX: padX };
      const padY = Number(frame && frame.y);
      if (!Number.isFinite(padY)) return null;
      const qs = new URLSearchParams({
        x: String(padX),
        y: String(padY),
        a: String(Number(frame.a) > 0 ? frame.a : 20),
        b: String(Number(frame.b) > 0 ? frame.b : 20),
      });
      if (frame.seq != null) qs.set("seq", String(frame.seq));
      const res = await fetch(apiUrl("/api/add_defect/get_imagepos_from_touchpad?" + qs.toString()));
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.success || data.simulated) return null;
      const actualX = Number(data.actualx);
      let imgX = Number(data.centerx);
      if (!Number.isFinite(imgX) && Number.isFinite(Number(data.imgx))) {
        imgX = Number(data.imgx) + (Number(data.imgw) || 0) / 2;
      }
      if (!Number.isFinite(actualX) || !Number.isFinite(imgX)) return null;
      return { imgX: imgX, actualX: actualX };
    }
    function isLeftover(frame) {
      return frame && typeof frame.timestampMs === "number" && frame.timestampMs > 0 && frame.timestampMs < pageOpenedAtMs;
    }
    async function pollTouchpad() {
      if (!isEnableTouchPad || imgNaturalWidth <= 0 || previewMode) return;
      try {
        const res = await fetch(apiUrl("/api/v0/devices/touchpad/frame"));
        if (!res.ok) {
          updateTouchpadBar({ isOpen: false });
          return;
        }
        const data = await res.json();
        if (!data.success) {
          updateTouchpadBar({ isOpen: false });
          return;
        }
        updateTouchpadBar({
          isOpen: data.isOpen !== false,
          frame: data.hasFrame && data.last ? data.last : null,
        });
        if (edges.length >= 2 || !data.hasFrame || !data.last) return;
        const frame = data.last;
        if (frame.seq === lastTouchpadSeq) return;
        if (isLeftover(frame)) {
          lastTouchpadSeq = frame.seq;
          return;
        }
        const mapped = await mapTouchpad(frame);
        if (!mapped) {
          setStatus(zh() ? "触摸板坐标转换失败，请再点一次。" : "Touchpad map failed.");
          return;
        }
        lastTouchpadSeq = frame.seq;
        addEdge(mapped.actualX, mapped.imgX);
      } catch (e) {
        updateTouchpadBar({ isOpen: false });
      }
    }
    function startTouchpad() {
      if (touchpadPollTimer) clearInterval(touchpadPollTimer);
      if (!isEnableTouchPad || previewMode) {
        updateTouchpadBar({ isOpen: false });
        return;
      }
      pageOpenedAtMs = Date.now();
      lastTouchpadSeq = -1;
      updateTouchpadBar({ state: "waiting" });
      touchpadPollTimer = setInterval(pollTouchpad, TOUCHPAD_POLL_MS);
    }
    function screenToImage(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left - imgOffsetX) / scale,
        y: (clientY - rect.top - imgOffsetY) / scale,
      };
    }
    async function addEdgeFromImage(imgX, imgY) {
      if (edges.length >= 2) return;
      if (simulatedImage || !showBoardImage || previewMode) {
        addEdge(imgX, imgX);
        return;
      }
      const qs = new URLSearchParams({ imgx: String(imgX), imgy: String(imgY != null ? imgY : 0) });
      const res = await fetch(apiUrl("/api/add_defect/get_actualpos_from_imagepos?" + qs.toString()));
      if (!res.ok) {
        setStatus(zh() ? "图片坐标转实际坐标失败。" : "Image→actual failed.");
        return;
      }
      const data = await res.json();
      const actualX = Number(data.actualx);
      if (!Number.isFinite(actualX)) {
        setStatus(zh() ? "图片坐标转实际坐标失败。" : "Image→actual failed.");
        return;
      }
      addEdge(actualX, imgX);
    }
    async function decodeBlob(blob) {
      if (typeof createImageBitmap === "function") return await createImageBitmap(blob);
      return await new Promise((resolve, reject) => {
        const im = new Image();
        const url = URL.createObjectURL(blob);
        im.onload = () => {
          URL.revokeObjectURL(url);
          resolve(im);
        };
        im.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("decode"));
        };
        im.src = url;
      });
    }
    async function loadBoardImage() {
      if (loadingBoardImage || previewMode) {
        if (previewMode) {
          useSimulatedImage();
          return true;
        }
        return false;
      }
      loadingBoardImage = true;
      setLoading(true, zh() ? "正在加载图片…" : "Loading image…");
      try {
        const res = await fetch(apiUrl("/api/add_defect/get_image_list?imgtype=0"));
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (!data || data.success === false || !data.images || !data.images.length) {
          throw new Error((data && (data.detail || data.error)) || "no image");
        }
        let accY = 0;
        const loaded = [];
        for (const img of data.images) {
          const fileRes = await fetch(apiUrl("/api/add_defect/get_file?path=" + encodeURIComponent(img.url)));
          if (!fileRes.ok) throw new Error("tile");
          const drawable = await decodeBlob(await fileRes.blob());
          loaded.push({ drawable: drawable, yStart: accY, w: img.w, h: img.h });
          accY += img.h;
        }
        tiles.forEach((tile) => {
          if (tile.drawable && typeof tile.drawable.close === "function") tile.drawable.close();
        });
        tiles = loaded;
        imgNaturalWidth = data.totalWidth;
        imgNaturalHeight = data.totalHeight;
        simulatedImage = false;
        manualMode = false;
        if (manualWrap) manualWrap.classList.remove("show");
        setLoading(false);
        resizeCanvas();
        refreshReadout();
        return true;
      } catch (e) {
        setLoading(false);
        setStatus(
          (zh() ? "加载图片失败：" : "Image load failed: ") +
            ((e && e.message) || e) +
            (zh() ? "。已切回空白画布。" : ". Blank canvas.")
        );
        useSimulatedImage();
        if (chkShowImage) chkShowImage.checked = false;
        showBoardImage = false;
        return false;
      } finally {
        loadingBoardImage = false;
      }
    }
    async function applyShowImage(on) {
      showBoardImage = !!on;
      edges = [];
      if (showBoardImage) {
        await loadBoardImage();
        refreshReadout();
        return;
      }
      useSimulatedImage();
      refreshReadout();
    }
    function setupStage() {
      if (chkShowImage) chkShowImage.checked = false;
      showBoardImage = false;
      if (isEnableTouchPad) {
        useSimulatedImage();
        setStatus(zh() ? "未显示图片：用触摸笔点两次，按原始 X 计算净幅宽。" : "Tap touchpad twice (raw X).");
        return true;
      }
      manualMode = true;
      simulatedImage = false;
      if (manualWrap) manualWrap.classList.add("show");
      setLoading(false, zh() ? "触摸板未启用\n请在下方输入净幅宽" : "Touchpad off\nEnter net width");
      setStatus(zh() ? "触摸板未启用。请直接输入净幅宽（cm）后确定。" : "Enter net width (cm).");
      return false;
    }
    async function loadParams() {
      try {
        const res = await fetch(apiUrl("/api/add_defect/get_params"));
        if (!res.ok) throw new Error("params");
        const data = await res.json();
        isEnableTouchPad = !!data.isEnableTouchPad;
        const padW = Number(data.touchPadWidthMm);
        const padH = Number(data.touchPadLengthMm);
        if (padW > 0) touchPadWidthMm = padW;
        if (padH > 0) touchPadLengthMm = padH;
        previewMode = false;
      } catch (_) {
        // 预览 / 无服务：本地演示，默认启用触摸板模拟（画布点击）
        isEnableTouchPad = true;
        previewMode = true;
        if (padBadge) {
          padBadge.hidden = false;
          padBadge.textContent = zh() ? "触摸板 · sim" : "Pad · sim";
        }
      }
    }
    async function loadSaved() {
      try {
        const res = await fetch(apiUrl("/api/add_defect/get_width_measure"));
        if (!res.ok) return;
        const data = await res.json();
        const lastCm = Number(data && data.lastWidthCm);
        if (data && lastCm > 0) {
          lastMeasure = {
            leftMm: Number(data.lastLeftMm),
            rightMm: Number(data.lastRightMm),
            widthCm: lastCm,
            leftImgX: Number(data.lastLeftImgX),
            rightImgX: Number(data.lastRightImgX),
          };
          if (lastEl) lastEl.textContent = lastCm.toFixed(1) + " cm";
          savedHint =
            (zh() ? "上次净幅宽 " : "Last ") +
            lastCm.toFixed(1) +
            " cm。";
          pushNetState({ last: lastCm });
        } else if (data && data.hasMeasure) {
          const n = Number(data.count) > 0 ? Number(data.count) : 1;
          if (lastEl) lastEl.textContent = Number(data.widthCm).toFixed(1) + " cm";
          savedHint =
            (zh() ? `本卷已测 ${n} 次，平均净幅宽 ` : `Measured ${n}×, avg `) +
            Number(data.widthCm).toFixed(1) +
            " cm。";
          pushNetState({ last: Number(data.widthCm) });
        }
      } catch (_) {
        const m = (host.getCtx().state && host.getCtx().state.netWidth) || {};
        if (m.last != null && Number(m.last) > 0 && lastEl) {
          lastEl.textContent = Number(m.last).toFixed(1) + " cm";
        }
      }
    }

    function onPointerDown(ev) {
      canvas.setPointerCapture(ev.pointerId);
      drag = { x: ev.clientX, y: ev.clientY, ox: imgOffsetX, oy: imgOffsetY, moved: false };
    }
    function onPointerMove(ev) {
      if (!drag) return;
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if (!drag.moved) return;
      imgOffsetX = drag.ox + dx;
      imgOffsetY = drag.oy + dy;
      draw();
    }
    async function onPointerUp(ev) {
      const info = drag;
      drag = null;
      if (!info || info.moved || imgNaturalWidth <= 0) return;
      const p = screenToImage(ev.clientX, ev.clientY);
      if (p.x < 0 || p.y < 0 || p.x > imgNaturalWidth || p.y > imgNaturalHeight) return;
      await addEdgeFromImage(p.x, p.y);
    }
    function onWheel(ev) {
      if (imgNaturalWidth <= 0) return;
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const imgX = (sx - imgOffsetX) / scale;
      const imgY = (sy - imgOffsetY) / scale;
      scale = Math.max(0.02, Math.min(20, scale * (ev.deltaY < 0 ? 1.15 : 0.87)));
      imgOffsetX = sx - imgX * scale;
      imgOffsetY = sy - imgY * scale;
      draw();
    }
    function onManualInput() {
      if (manualMode) refreshReadout();
    }
    function onChkChange() {
      applyShowImage(!!chkShowImage.checked);
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    if (widthInput) widthInput.addEventListener("input", onManualInput);
    if (chkShowImage) chkShowImage.addEventListener("change", onChkChange);
    const onResize = () => {
      if (!drag) resizeCanvas();
    };
    window.addEventListener("resize", onResize);

    this._toolApi = {
      reset() {
        edges = [];
        if (widthInput) widthInput.value = "";
        refreshReadout();
      },
      measure() {
        const sorted = sortedEdges();
        if (sorted.length >= 2) {
          const leftMm = sorted[0].actualX;
          const rightMm = sorted[1].actualX;
          return {
            leftMm: leftMm,
            rightMm: rightMm,
            left: leftMm / 10,
            right: rightMm / 10,
            width: (rightMm - leftMm) / 10,
          };
        }
        if (manualMode && manualCm() > 0) {
          const cm = manualCm();
          return { leftMm: 0, rightMm: cm * 10, left: 0, right: cm, width: cm };
        }
        return null;
      },
      async save() {
        const m = this.measure();
        if (!m) throw new Error(zh() ? "请先完成测量" : "Measure first");
        if (previewMode) return Object.assign({ success: true, preview: true }, m);
        const res = await fetch(apiUrl("/api/add_defect/post_width_measure"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leftMm: m.leftMm, rightMm: m.rightMm }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          const code = (data && data.error) || "";
          const errMap = {
            "no sheet": zh() ? "当前没有检验单，请先建单再测" : "No sheet",
            "width too small": zh() ? "两点太近" : "Too close",
            "save failed": zh() ? "保存失败" : "Save failed",
          };
          throw new Error(errMap[code] || code || (zh() ? "保存失败" : "Save failed"));
        }
        return Object.assign({ success: true }, m, data);
      },
    };

    this._toolCleanup = () => {
      if (touchpadPollTimer) clearInterval(touchpadPollTimer);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      if (widthInput) widthInput.removeEventListener("input", onManualInput);
      if (chkShowImage) chkShowImage.removeEventListener("change", onChkChange);
      window.removeEventListener("resize", onResize);
      tiles.forEach((tile) => {
        if (tile.drawable && typeof tile.drawable.close === "function") tile.drawable.close();
      });
    };

    (async function init() {
      resizeCanvas();
      await loadParams();
      const touchpadOk = setupStage();
      await loadSaved();
      refreshReadout();
      requestAnimationFrame(() => {
        resizeCanvas();
        refreshReadout();
        requestAnimationFrame(() => {
          resizeCanvas();
          refreshReadout();
          if (touchpadOk) startTouchpad();
        });
      });
    })();
  };

  SpxPopupHost.prototype._onFocusIn = function (e) {
    const t = e.target;
    if (!this.osk || !this.osk._isEditable(t)) return;
    // 表单弹窗（检验单）默认开键盘；其它弹窗可用 data-osk="1" 显式开启
    const force = t.getAttribute("data-osk") === "1";
    const formMode = this.shell.classList.contains("form");
    if (!force && !formMode) return;
    this.osk.show(t);
  };

  SpxPopupHost.prototype._onFocusOut = function (e) {
    // 延迟判断：点 OSK 会短暂失焦，写回后会重新 focus；真正离开输入才隐藏
    clearTimeout(this._oskBlurTimer);
    this._oskBlurTimer = setTimeout(() => {
      if (!this.osk) return;
      const ae = document.activeElement;
      if (this.osk._isEditable && this.osk._isEditable(ae)) {
        const force = ae.getAttribute("data-osk") === "1";
        const formMode = this.shell && this.shell.classList.contains("form");
        if (force || formMode) {
          this.osk.show(ae);
          return;
        }
      }
      if (this.osk.root && !this.osk.root.hidden && this.osk.root.contains(ae)) return;
      this.osk.hide();
    }, 220);
  };

  SpxPopupHost.prototype._liftForOsk = function (on) {
    if (!this.shell || this.root.hidden) return;
    if (on) {
      this.shell.classList.add("osk-lift");
      if (this._placeMode) this._place(this._placeMode, this._placeTrigger);
    } else {
      this.shell.classList.remove("osk-lift");
      if (this._placeMode) this._place(this._placeMode, this._placeTrigger);
    }
  };

  SpxPopupHost.prototype.open = function (key, trigger) {
    if (!key) return;
    if (this.isOpen(key)) {
      this.close();
      return;
    }
    if (this.osk) this.osk.hide();
    const prevFocus = document.activeElement;
    const ctx = this.getCtx() || {};
    if (key === "systemSettings" && this.settingsTabId) {
      ctx.settingsTabId = this.settingsTabId;
      if (this.settingsSecId) ctx.settingsSecId = this.settingsSecId;
    }
    if (key === "debug" && this.debugTabId)
      ctx.debugTabId = this.debugTabId;
    this._defStepEditId = "";
    this.activeKey = key;
    this.triggerEl = trigger || null;
    this.titleEl.textContent = key === "login" ? "" : titleOf(key, ctx.lang);
    this.bodyEl.innerHTML = buildBody(key, ctx);
    if (key === "unwind") this._afterPlcTestBody();

    const mode = this.modeFor(key);
    this._placeMode = mode;
    this._placeTrigger = trigger || null;
    this.shell.classList.remove("center", "quick", "info", "form", "left", "tool", "osk-lift", "login");
    this.shell.classList.add(mode);
    if (key === "login") this.shell.classList.add("login");
    if (TOOL_KEYS.has(key)) this.shell.classList.add("tool");
    this.root.classList.toggle("modeless", mode === "left");
    this.root.hidden = false;
    applyPopupOpacity(this.shell, ctx, key);
    this._place(mode, trigger);
    if (TOOL_KEYS.has(key)) {
      requestAnimationFrame(() => this._initTool(key));
    }
    if (key === "systemSettings") this._scrollSettingsSec();
    if (key === "login") this._syncLoginType();
    if (key === "defectSettings") {
      requestAnimationFrame(() => this._syncDefectClothNav(true));
    }

    const langSel = this.bodyEl.querySelector("#popSettingsLang");
    if (langSel) langSel.value = ctx.lang;

    // 旁挂详情不抢焦点：保持列表/原控件可继续点选
    if (mode === "left") {
      const closeBtn = this.shell.querySelector(".spx-popup-close");
      if (closeBtn) closeBtn.tabIndex = -1;
      this.bodyEl.querySelectorAll("button, a, input, select, textarea, [tabindex]").forEach((n) => {
        if (!n.hasAttribute("data-keep-tab")) n.tabIndex = -1;
      });
      if (prevFocus && prevFocus !== document.body && typeof prevFocus.focus === "function") {
        requestAnimationFrame(() => {
          try { prevFocus.focus({ preventScroll: true }); } catch (_) { /* ignore */ }
        });
      } else if (document.activeElement && this.root.contains(document.activeElement)) {
        try { document.activeElement.blur(); } catch (_) { /* ignore */ }
      }
    }
  };

  SpxPopupHost.prototype._scrollDebugTabIntoView = function (tab) {
    const strip = this.bodyEl && this.bodyEl.querySelector("#popDebugTabs");
    if (!strip) return;
    const btn = strip.querySelector('[data-act="debug-tab"][data-tab="' + tab + '"]');
    if (!btn) return;
    const left = btn.offsetLeft;
    const right = left + btn.offsetWidth;
    const viewL = strip.scrollLeft;
    const viewR = viewL + strip.clientWidth;
    if (left < viewL) strip.scrollLeft = Math.max(0, left - 8);
    else if (right > viewR) strip.scrollLeft = right - strip.clientWidth + 8;
  };

  SpxPopupHost.prototype._activateDebugTab = function (tab, srcHint) {
    if (!this.bodyEl || !tab) return;
    this.debugTabId = tab;
    this.bodyEl.querySelectorAll("#popDebugTabs [data-act='debug-tab']").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-tab") === tab)
    );
    this.bodyEl.querySelectorAll("[data-debug-pane]").forEach((p) => {
      const on = p.getAttribute("data-debug-pane") === tab;
      p.hidden = !on;
      if (!on) return;
      const frame = p.querySelector("iframe.spx-debug-frame");
      if (frame && !frame.getAttribute("src")) {
        const src = frame.getAttribute("data-src") || srcHint;
        if (src) frame.setAttribute("src", src);
      }
    });
    this._scrollDebugTabIntoView(tab);
  };

  SpxPopupHost.prototype._scrollDebugTabs = function (dir) {
    const strip = this.bodyEl && this.bodyEl.querySelector("#popDebugTabs");
    if (!strip) return;
    const step = Math.max(120, Math.floor(strip.clientWidth * 0.6));
    const max = Math.max(0, strip.scrollWidth - strip.clientWidth);
    const next = Math.max(0, Math.min(max, strip.scrollLeft + dir * step));
    if (typeof strip.scrollTo === "function") {
      try {
        strip.scrollTo({ left: next, behavior: "smooth" });
        return;
      } catch (e) { /* fall through */ }
    }
    strip.scrollLeft = next;
  };

  SpxPopupHost.prototype._applySettingsNav = function (tab, sec) {
    if (!this.bodyEl) return;
    this.bodyEl.querySelectorAll("#popSettingsTabs .spx-settings-nav-group").forEach((g) => {
      const id = g.getAttribute("data-nav-group");
      if (id !== tab) {
        g.classList.remove("is-open");
        return;
      }
      if (sec) {
        g.classList.add("is-open");
      } else {
        // 点父分类：切换展开/折叠（默认折叠）
        g.classList.toggle("is-open");
      }
    });
    this.bodyEl.querySelectorAll("#popSettingsTabs .spx-settings-nav-main").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tab);
    });
    this.bodyEl.querySelectorAll("#popSettingsTabs .spx-settings-sub").forEach((b) => {
      b.classList.toggle("active", !!sec && b.getAttribute("data-sec") === sec);
    });
  };

  SpxPopupHost.prototype._scrollSettingsSec = function (sec) {
    if (!this.bodyEl) return;
    const sid = sec || this.settingsSecId || "";
    const scroller = this.bodyEl.querySelector("#popSettingsBody");
    if (!sid) {
      if (scroller) scroller.scrollTop = 0;
      return;
    }
    const target = this.bodyEl.querySelector('[data-sec-id="' + sid + '"]') || this.bodyEl.querySelector("#" + sid);
    if (!target) return;
    requestAnimationFrame(() => {
      try {
        target.scrollIntoView({ block: "start", behavior: "smooth" });
      } catch (_) {
        if (scroller) scroller.scrollTop = Math.max(0, target.offsetTop - 8);
      }
    });
  };

  SpxPopupHost.prototype._captureInnerScroll = function () {
    const list = [];
    if (!this.bodyEl) return list;
    this.bodyEl.querySelectorAll(".spx-defect-scroll, .spx-fp-scroll, .spx-fp-meter-list").forEach((el) => {
      list.push({ top: el.scrollTop, left: el.scrollLeft });
    });
    return list;
  };

  SpxPopupHost.prototype._restoreInnerScroll = function (list) {
    if (!this.bodyEl || !list || !list.length) return;
    const nodes = this.bodyEl.querySelectorAll(".spx-defect-scroll, .spx-fp-scroll, .spx-fp-meter-list");
    nodes.forEach((el, i) => {
      if (!list[i]) return;
      el.scrollTop = list[i].top;
      el.scrollLeft = list[i].left;
    });
  };

  SpxPopupHost.prototype._patchFourPointsLive = function (ctx) {
    if (!this.bodyEl) return false;
    const panel = this.bodyEl.querySelector("[data-fp-panel]");
    if (!panel) return false;
    const zh = (ctx.lang || "").indexOf("zh") === 0;
    const fp = ctx.fourPoints || {};
    const c = fp.counts || {};
    const isNg = !!(fp.isNg || fp.ng);
    const result = fp.result || (isNg ? "NG" : "OK");
    const setText = (key, text) => {
      const el = panel.querySelector(`[data-fp-val="${key}"]`);
      if (el && el.textContent !== String(text)) el.textContent = String(text);
    };
    const resultEl = panel.querySelector('[data-fp-val="result"]');
    if (resultEl) {
      if (resultEl.textContent !== result) resultEl.textContent = result;
      resultEl.classList.toggle("ok", !isNg);
      resultEl.classList.toggle("bad", isNg);
    }
    setText("total", fp.total != null ? fp.total : 0);
    setText("per100Sq", Number(fp.per100Sq || 0).toFixed(2));
    setText("per100", Number(fp.per100 || 0).toFixed(2));
    setText("threshold", fp.threshold != null ? fp.threshold : 0);
    setText("gradeI", c.I || 0);
    setText("gradeII", c.II || 0);
    setText("gradeIII", c.III || 0);
    setText("gradeIV", c.IV || 0);
    const meterUnit = fp.useYard ? (zh ? "码" : "yd") : (zh ? "米" : "m");
    if (panel.querySelector("[data-fp-meter]")) {
      setText("meterIndex", `${fp.meterIndex || "-"} ${meterUnit}`);
      setText("meterPoints", fp.meterPoints || 0);
      setText("meterGrade", fp.meterGrade || "-");
      if (fp.meterListText != null) setText("meterList", fp.meterListText);
    }
    const rows = Array.isArray(fp.rows) ? fp.rows : [];
    setText("rowCount", rows.length);
    const tbody = panel.querySelector("[data-fp-rows]");
    const scroll = panel.querySelector("[data-fp-scroll]");
    if (tbody) {
      const sig = rows
        .map((r) => `${r.id}|${r.title}|${r.grade}|${r.points}|${Number(r.y).toFixed(1)}`)
        .join(";");
      if (tbody.getAttribute("data-fp-sig") !== sig) {
        const y = scroll ? scroll.scrollTop : 0;
        const x = scroll ? scroll.scrollLeft : 0;
        const escFp = (s) =>
          String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        tbody.innerHTML = rows.length
          ? rows
              .map(
                (r) => `<tr>
            <td class="col-idx mono">${r.id}</td>
            <td class="col-name">${escFp(r.title || "")}</td>
            <td class="col-grade">${escFp(String(r.grade || ""))}</td>
            <td class="col-pts spx-v">${r.points}</td>
            <td class="col-y mono">${Number(r.y).toFixed(1)}</td>
          </tr>`
              )
              .join("")
          : `<tr><td colspan="5" class="spx-msg">${zh ? "暂无疵点" : "No defects"}</td></tr>`;
        tbody.setAttribute("data-fp-sig", sig);
        if (scroll) {
          scroll.scrollTop = y;
          scroll.scrollLeft = x;
        }
      }
    }
    return true;
  };

  /** 强制重建正文（忽略 NO_LIVE_REFRESH；疵点设置保存/切布种/标注工具态变更后用） */
  SpxPopupHost.prototype.rebuild = function () {
    if (!this.activeKey || this.root.hidden) return;
    const ctx = this.getCtx() || {};
    if (this.activeKey === "systemSettings" && this.settingsTabId) {
      ctx.settingsTabId = this.settingsTabId;
      if (this.settingsSecId) ctx.settingsSecId = this.settingsSecId;
    }
    this._defStepEditId = "";
    const y = this.bodyEl.scrollTop;
    const inner = this._captureInnerScroll();
    this.titleEl.textContent = this.activeKey === "login" ? "" : titleOf(this.activeKey, ctx.lang);
    this.bodyEl.innerHTML = buildBody(this.activeKey, ctx);
    if (this.activeKey === "unwind") this._afterPlcTestBody();
    this.bodyEl.scrollTop = y;
    this._restoreInnerScroll(inner);
    if (TOOL_KEYS.has(this.activeKey)) {
      const key = this.activeKey;
      requestAnimationFrame(() => this._initTool(key));
    }
    if (this.activeKey === "login") this._syncLoginType();
    if (this.activeKey === "systemSettings") this._scrollSettingsSec();
    if (this.activeKey === "defectSettings") {
      requestAnimationFrame(() => this._syncDefectClothNav(true));
    }
  };

  /** 仅刷新正文（用于序列图实时更新，不重算位置）
   * @param {string[]=} keys 限定弹窗 key；空则刷新当前
   * @param {{force?:boolean}=} opts force=true 时忽略 NO_LIVE_REFRESH（用户筛选/翻页等）
   */
  SpxPopupHost.prototype.refresh = function (keys, opts) {
    if (!this.activeKey || this.root.hidden) return;
    if (Array.isArray(keys) && keys.length && keys.indexOf(this.activeKey) < 0) return;
    const force = !!(opts && opts.force);
    // 相机：只补丁帧数/采集态，绝不重建（避免曝光输入无法操作）
    if (!force && this.activeKey === "camera") {
      this._patchCameraLive(this.getCtx() || {});
      return;
    }
    // 幅宽传感器：只刷 Fabric/PLC/L/R，保留开关与边距输入
    if (!force && this.activeKey === "widthSensor") {
      this._patchWidthSensorLive(this.getCtx() || {});
      return;
    }
    // 设置/登录/表单：定时重建会冲掉 tab 与输入；用户操作可 force
    if (!force && NO_LIVE_REFRESH_KEYS.has(this.activeKey)) return;
    // unwind.html：SPX 版 plctest 局部刷状态，保留输入与手动勾选
    // 若权限从操作员→管理员变化，局部 patch 补不出系统/贴标/手动面板，需整页重建
    if (this.activeKey === "unwind" && !force) {
      const ctx = this.getCtx() || {};
      const isAdmin = !!(ctx.about && ctx.about.isAdmin);
      const root = this.bodyEl && this.bodyEl.querySelector("#popPlcTest");
      const shownAdmin = !!(root && root.getAttribute("data-admin") === "1");
      if (root && shownAdmin === isAdmin) {
        this._patchPlcTestLive(ctx);
        return;
      }
      // 权限不一致：fallthrough 重建
    }
    // 四分制：局部 patch，避免整页重建打断列表滚动
    if (this.activeKey === "fourPoints" && !force) {
      const ctx = this.getCtx() || {};
      if (this._patchFourPointsLive(ctx)) return;
    }
    // OSK 编辑中：重建会拆掉目标 input；强制刷新时先收起软键盘态
    if (!force && this.osk && (this.osk.targetId || this.osk.target)) return;
    if (force && this.osk) {
      try {
        if (typeof this.osk.hide === "function") this.osk.hide();
        else {
          this.osk.targetId = "";
          this.osk.target = null;
        }
      } catch (_) { /* ignore */ }
    }
    const prevFocus = document.activeElement;
    const keepFocus = this._placeMode === "left" && prevFocus && !this.root.contains(prevFocus);
    const ctx = this.getCtx() || {};
    if (this.activeKey === "systemSettings" && this.settingsTabId) {
      ctx.settingsTabId = this.settingsTabId;
      if (this.settingsSecId) ctx.settingsSecId = this.settingsSecId;
    }
    this._defStepEditId = "";
    const y = this.bodyEl.scrollTop;
    const inner = this._captureInnerScroll();
    this.titleEl.textContent = titleOf(this.activeKey, ctx.lang);
    this.bodyEl.innerHTML = buildBody(this.activeKey, ctx);
    if (this.activeKey === "unwind") this._afterPlcTestBody();
    this.bodyEl.scrollTop = y;
    this._restoreInnerScroll(inner);
    if (this._placeMode === "left") {
      const closeBtn = this.shell.querySelector(".spx-popup-close");
      if (closeBtn) closeBtn.tabIndex = -1;
      this.bodyEl.querySelectorAll("button, a, input, select, textarea, [tabindex]").forEach((n) => {
        if (!n.hasAttribute("data-keep-tab")) n.tabIndex = -1;
      });
      if (keepFocus && typeof prevFocus.focus === "function") {
        requestAnimationFrame(() => {
          try { prevFocus.focus({ preventScroll: true }); } catch (_) { /* ignore */ }
        });
      }
    }
  };

  SpxPopupHost.prototype._setPlct = function (id, text) {
    const el = this.bodyEl && this.bodyEl.querySelector(`[data-plct="${id}"]`);
    if (el) el.textContent = text;
  };

  /** 相机弹窗局部更新：帧数 / 采集态，不碰曝光输入与 Tab */
  SpxPopupHost.prototype._patchCameraLive = function (ctx) {
    if (!this.bodyEl) return;
    const zh = (ctx.lang || "").indexOf("zh") === 0;
    const st = (ctx && ctx.state) || {};
    const frames = st.camFrames != null ? st.camFrames : "—";
    const framesEl = this.bodyEl.querySelector("#popCamFrames");
    if (framesEl) framesEl.textContent = String(frames);
    const cams = Array.isArray(st.cameras) ? st.cameras : [];
    this.bodyEl.querySelectorAll("[data-cam-grab]").forEach((cell) => {
      const n = cell.getAttribute("data-cam-grab") || "";
      const hit = cams.find((c) => c && String(c.name) === n);
      if (!hit) return;
      const label = hit.isGrab ? (zh ? "采集中" : "Grabbing") : zh ? "空闲" : "Idle";
      const v = cell.querySelector(".spx-cam-stat-v");
      if (v) v.textContent = label;
      else cell.textContent = label;
      cell.classList.toggle("tone-ok", !!hit.isGrab);
      cell.classList.toggle("tone-idle", !hit.isGrab);
    });
  };

  /** 幅宽传感器弹窗：只刷实时测量，不重建开关/边距输入 */
  SpxPopupHost.prototype._patchWidthSensorLive = function (ctx) {
    if (!this.bodyEl || !this.bodyEl.querySelector("#wsLiveRow")) return false;
    const st = (ctx && ctx.state) || {};
    const plc = st.plc || {};
    const sv = (ctx && ctx.settingsValues) || {};
    const fmt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(1) : "—";
    };
    const set = (id, v) => {
      const el = this.bodyEl.querySelector("#" + id);
      if (el) el.textContent = fmt(v);
    };
    const fabric =
      st.widthCm != null ? st.widthCm : plc.fabric_width != null ? plc.fabric_width : null;
    const plcW =
      plc.plc_fabric_width != null
        ? plc.plc_fabric_width
        : st.plcFabricWidth != null
          ? st.plcFabricWidth
          : fabric;
    const left =
      plc.width_sensor_left != null
        ? plc.width_sensor_left
        : st.widthSensorLeft != null
          ? st.widthSensorLeft
          : st.width_sensor_left;
    const right =
      plc.width_sensor_right != null
        ? plc.width_sensor_right
        : st.widthSensorRight != null
          ? st.widthSensorRight
          : st.width_sensor_right;
    set("wsLiveFabric", fabric);
    set("wsLivePlc", plcW);
    set("wsLiveLeft", left);
    set("wsLiveRight", right);
    const src = this.bodyEl.querySelector("#wsLiveSource");
    if (src) {
      const zh = (ctx.lang || "").indexOf("zh") === 0;
      const visionOn =
        sv.IsEnableImageWidth === true ||
        sv.IsEnableImageWidth === 1 ||
        sv.IsEnableImageWidth === "1" ||
        String(sv.IsEnableImageWidth || "").toLowerCase() === "true";
      src.textContent = visionOn
        ? zh
          ? "当前：视觉测量"
          : "Source: vision"
        : zh
          ? "当前：幅宽传感器测量"
          : "Source: sensor";
    }
    return true;
  };

  SpxPopupHost.prototype._afterPlcTestBody = function () {
    if (!this.bodyEl || !this.bodyEl.querySelector("#popPlcTest")) return;
    if (global.SpxPlcSys && typeof global.SpxPlcSys.unmount === "function") global.SpxPlcSys.unmount();
    const panel = this.bodyEl.querySelector("#popPlcSysPanel");
    if (!panel || !global.SpxPlcSys || typeof global.SpxPlcSys.mount !== "function") return;
    const ctx = this.getCtx() || {};
    global.SpxPlcSys.mount(panel, { lang: ctx.lang || "zh-CN" });
    panel.setAttribute("data-sys-mounted", "1");
  };

  SpxPopupHost.prototype._ensurePlcSysMounted = function () {
    const panel = this.bodyEl && this.bodyEl.querySelector("#popPlcSysPanel");
    if (!panel) return null;
    if (panel.getAttribute("data-sys-mounted") === "1") return panel;
    this._afterPlcTestBody();
    return this.bodyEl.querySelector("#popPlcSysPanel");
  };

  SpxPopupHost.prototype._switchPlcSysTab = function (tabKey) {
    const panel = this._ensurePlcSysMounted();
    if (!panel) return;
    const key = tabKey || "quick";
    panel.setAttribute("data-sys-tab", key);
    panel.querySelectorAll(".spx-plct-sys-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === key);
    });
    panel.querySelectorAll(".spx-plct-sys-pane").forEach((pane) => {
      const paneKey = pane.getAttribute("data-pane");
      pane.hidden = paneKey !== key;
    });
    if (global.SpxPlcSys && typeof global.SpxPlcSys.setActiveTab === "function") {
      global.SpxPlcSys.setActiveTab(key);
    }
  };

  SpxPopupHost.prototype._patchPlcTestLive = function (ctx) {
    if (!this.bodyEl || !this.bodyEl.querySelector("#popPlcTest")) return;
    const zh = (ctx.lang || "").indexOf("zh") === 0;
    const st = (ctx.state && ctx.state.plc) || {};
    const s = metricState(ctx.state);
    const connected = !!st.is_connected;
    const alarm = plcAlarmText(st, zh);
    this._setPlct("length", fmtPlc(st.fabric_length != null ? st.fabric_length : s.lengthM, 2));
    this._setPlct("speed", fmtPlc(st.servo_speed != null ? st.servo_speed : s.speed, 2));
    this._setPlct("connect", connected ? (zh ? "已连接" : "ON") : (zh ? "未连接" : "OFF"));
    this._setPlct("alarm", alarm);
    const tileConn = this.bodyEl.querySelector('[data-plct="connect"]');
    if (tileConn && tileConn.closest) {
      const tile = tileConn.closest(".spx-plct-tile");
      if (tile) tile.classList.toggle("warn", !connected);
    }
    const tileAlarm = this.bodyEl.querySelector('[data-plct="alarm"]');
    if (tileAlarm && tileAlarm.closest) {
      const tile = tileAlarm.closest(".spx-plct-tile");
      if (tile) tile.classList.toggle("warn", alarm !== (zh ? "无报警" : "OK"));
    }

    const breadth = st.plc_fabric_width != null ? st.plc_fabric_width : st.fabric_width;
    this._setPlct("encoder", fmtPlc(st.encoder, 0));
    this._setPlct("servo", fmtPlc(st.servo_value, 2));
    this._setPlct("motor", fmtPlc(st.speed, 2));
    this._setPlct("encSpd", fmtPlc(st.servo_speed, 2));
    this._setPlct("fabTen", fmtPlc(st.fabric_tension_pid != null ? st.fabric_tension_pid : st.tension, 2));
    this._setPlct("rollTen", fmtPlc(st.roll_tension, 2));
    this._setPlct("breadth", fmtPlc(breadth, 2));
    this._setPlct("wL", fmtPlc(st.width_sensor_left, 2));
    this._setPlct("wR", fmtPlc(st.width_sensor_right, 2));
    this._setPlct("liveW", fmtPlc(st.live_weight, 2));
    this._setPlct("lastW", fmtPlc(st.last_weight, 2));
    this._setPlct("lblX", fmtPlc(st.current_x, "int"));
    this._setPlct("lblY", fmtPlc(st.current_y, "int"));
    this._setPlct("lblZ", fmtPlc(st.current_z, "int"));
    {
      const reverse = !!st.shaft_rotation_reverse;
      this._setPlct("rollMode", reverse ? (zh ? "反转" : "Reverse") : (zh ? "正转" : "Forward"));
      const done = Number(st.label_finish_stop) !== 0;
      const radios = this.bodyEl.querySelectorAll("#plctLabelFinish input[type='radio']");
      if (radios.length >= 2) {
        radios[0].checked = !done;
        radios[1].checked = done;
      }
    }

    // 未编辑过的设定框：首次/空值时用状态填充
    const fills = [
      ["plctMotor", st.speed_set, 3],
      ["plctFabric", st.fabric_tension_set, 3],
      ["plctRoll", st.roll_tension_set, 3],
      ["plctHalt", st.label_y, "int"],
      ["plctLblX", st.label_x, "int"],
      ["plctTenCoef", st.tension_factor, 3],
      ["plctUnreel", st.roll_unreel_factor, 3],
      ["plctTenDiff", st.differential_tension, 3],
      ["plctRollDiff", st.differential_roll, 3],
      ["plctDrop", st.labelling_descent_height, 3],
    ];
    fills.forEach((row) => {
      const el = this.bodyEl.querySelector(`#${row[0]}`);
      if (!el || el.dataset.userEdited === "1") return;
      const next = fmtPlc(row[1], row[2]);
      if (el.value !== next && next !== "—") el.value = next;
    });
    const rev = this.bodyEl.querySelector("#plctReverse");
    if (rev && rev.dataset.userEdited !== "1") rev.checked = !!st.shaft_rotation_reverse;
  };

  SpxPopupHost.prototype._place = function (mode, trigger) {
    const stage = document.querySelector(".stage");
    const stageRect = stage
      ? stage.getBoundingClientRect()
      : { left: 0, top: 0, width: innerWidth, height: innerHeight, right: innerWidth, bottom: innerHeight };

    const oskH =
      this.osk && !this.osk.root.hidden
        ? Math.max(180, this.osk.root.getBoundingClientRect().height || 240)
        : 0;
    const availBottom = stageRect.bottom - oskH - 8;
    const pad = 8;
    const headerEl = document.querySelector("#SpxHeaderBar, .SpxHeaderBar, .topbar, header.spx-header");
    const bottomEl = document.querySelector("#SpxBottomHud, .SpxBottomHud, .bottom-hud, footer.spx-bottom");
    const headerH = headerEl ? Math.max(0, headerEl.getBoundingClientRect().bottom - stageRect.top) : 56;
    const bottomH = bottomEl ? Math.max(0, stageRect.bottom - bottomEl.getBoundingClientRect().top) : 110;
    const midTop = stageRect.top + headerH + pad;
    const midBottom = Math.min(availBottom - 4, stageRect.bottom - bottomH - pad);
    const midLeft = stageRect.left + pad;
    const midRight = stageRect.right - pad;
    const midH = Math.max(200, midBottom - midTop);
    const midW = Math.max(280, midRight - midLeft);
    const midCy = midTop + midH / 2;
    const t = trigger ? trigger.getBoundingClientRect() : null;
    const gap = 8;

    const st = (this.getCtx && this.getCtx()) ? (this.getCtx().state || {}) : {};
    const sizeFrac = (keyName, defPct) => {
      const n = Number(st[keyName]);
      const pct = Number.isFinite(n) ? n : defPct;
      return Math.max(20, Math.min(100, Math.round(pct))) / 100;
    };

    const placeCentered = (wFrac, hFrac) => {
      const w = Math.max(280, Math.min(midW, Math.round(midW * wFrac)));
      const h = Math.max(200, Math.min(midH, Math.round(midH * hFrac)));
      return {
        w,
        h,
        x: midLeft + (midW - w) / 2,
        y: midTop + (midH - h) / 2,
      };
    };

    const placeAnchored = (wFrac, hFrac) => {
      const w = Math.max(280, Math.min(midW, Math.round(midW * wFrac)));
      const h = Math.max(200, Math.min(midH, Math.round(midH * hFrac)));
      let x = t ? t.left + t.width / 2 - w / 2 : midLeft + (midW - w) / 2;
      x = Math.min(Math.max(x, midLeft), Math.max(midLeft, midRight - w));
      let y = midTop;
      if (h < midH - 2) {
        const preferBelow = !t || t.top + t.height / 2 <= midCy;
        if (preferBelow) {
          y = t ? Math.max(midTop, t.bottom + gap) : midTop;
          if (y + h > midBottom) y = t ? t.top - gap - h : midBottom - h;
        } else {
          y = t ? t.top - gap - h : midBottom - h;
          if (y < midTop) y = t ? Math.max(midTop, t.bottom + gap) : midTop;
        }
        y = Math.min(Math.max(y, midTop), Math.max(midTop, midBottom - h));
      }
      return { w, h, x, y };
    };

    let w, h, x, y;
    const key = this.activeKey || "";
    if (mode === "left") {
      const listEl = document.querySelector(".hud-panel.list");
      const listRect = listEl ? listEl.getBoundingClientRect() : t;
      w = Math.max(260, Math.min(340, stageRect.width * 0.24, midW));
      if (listRect && listRect.width > 0) {
        h = Math.max(200, Math.min(listRect.height, midH));
        x = listRect.left - gap - w;
        y = Math.min(Math.max(listRect.top, midTop), Math.max(midTop, midBottom - h));
      } else {
        ({ w, h, x, y } = placeAnchored(0.24, 1));
        x = midRight - w;
      }
    } else if (mode === "center" || MID_BAND_KEYS.has(key)) {
      w = midW;
      h = midH;
      x = midLeft;
      y = midTop;
    } else if (mode === "form" || FORM_KEYS.has(key)) {
      if (key === "about") {
        ({ w, h, x, y } = placeCentered(
          sizeFrac("UI_POPUP_SIZE_ABOUT_W_PCT", 40),
          sizeFrac("UI_POPUP_SIZE_ABOUT_H_PCT", 70)
        ));
      } else if (key === "login") {
        ({ w, h, x, y } = placeCentered(
          sizeFrac("UI_POPUP_SIZE_LOGIN_W_PCT", 30),
          sizeFrac("UI_POPUP_SIZE_LOGIN_H_PCT", 50)
        ));
      } else {
        ({ w, h, x, y } = placeCentered(
          sizeFrac("UI_POPUP_SIZE_SYSMSG_W_PCT", 50),
          sizeFrac("UI_POPUP_SIZE_SYSMSG_H_PCT", 50)
        ));
      }
    } else if (mode === "info" || SHEET_EDITOR_KEYS.has(key)) {
      ({ w, h, x, y } = placeCentered(
        sizeFrac("UI_POPUP_SIZE_SHEET_W_PCT", 40),
        sizeFrac("UI_POPUP_SIZE_SHEET_H_PCT", 80)
      ));
    } else if (SETTINGS_KEYS.has(key)) {
      ({ w, h, x, y } = placeAnchored(
        sizeFrac("UI_POPUP_SIZE_SETTINGS_W_PCT", 60),
        sizeFrac("UI_POPUP_SIZE_SETTINGS_H_PCT", 100)
      ));
    } else {
      ({ w, h, x, y } = placeAnchored(
        sizeFrac("UI_POPUP_SIZE_INFO_W_PCT", 60),
        sizeFrac("UI_POPUP_SIZE_INFO_H_PCT", 60)
      ));
    }

    this.shell.style.width = `${Math.round(w)}px`;
    this.shell.style.height = `${Math.round(h)}px`;
    this.shell.style.left = `${Math.round(x)}px`;
    this.shell.style.top = `${Math.round(y)}px`;
  };

  SpxPopupHost.prototype._onClick = function (e) {
    const actEl = e.target.closest("[data-act]");
    // 尺寸弹出编辑：点外部关闭
    if (this._defStepEditId) {
      const editor = this.bodyEl && this.bodyEl.querySelector("#popDefStepEditor");
      const inEditor = !!(editor && editor.contains(e.target));
      const act = actEl && actEl.getAttribute("data-act");
      const reopen = act === "def-step-edit";
      if (!inEditor && !reopen && act !== "def-step-editor-delta") {
        this._closeDefStepEditor();
      }
    }
    if (!actEl) {
      if (e.target.classList.contains("spx-light-card")) {
        this.bodyEl.querySelectorAll(".spx-light-card").forEach((c) => c.classList.remove("active"));
        e.target.classList.add("active");
      }
      return;
    }
    const act = actEl.getAttribute("data-act");
    if (act === "login-type") {
      const type = actEl.getAttribute("data-type");
      const typeEl = this.bodyEl && this.bodyEl.querySelector("#popLoginType");
      if (typeEl && type) typeEl.value = type;
      this._syncLoginType();
      return;
    }
    if (act === "login-pick-user") {
      const name = actEl.getAttribute("data-user") || "";
      const userEl = this.bodyEl && this.bodyEl.querySelector("#popLoginUser");
      if (userEl) userEl.value = name;
      this.bodyEl.querySelectorAll('[data-act="login-pick-user"]').forEach((b) => {
        b.classList.toggle("active", b === actEl);
      });
      return;
    }
    if (act === "login-add-toggle") {
      const add = this.bodyEl && this.bodyEl.querySelector("#popLoginAdd");
      const pane = this.bodyEl && this.bodyEl.querySelector("#popLoginUserRow");
      if (!add) return;
      const open = !!add.hidden;
      add.hidden = !open;
      actEl.classList.toggle("active", open);
      if (pane) pane.classList.toggle("is-adding", open);
      if (open) {
        const nameInp = this.bodyEl.querySelector("#popLoginAddName");
        if (nameInp) {
          try { nameInp.focus(); } catch (_) { /* ignore */ }
        }
      }
      return;
    }
    if (act === "login-add-cancel") {
      const add = this.bodyEl && this.bodyEl.querySelector("#popLoginAdd");
      const pane = this.bodyEl && this.bodyEl.querySelector("#popLoginUserRow");
      const toggle = this.bodyEl && this.bodyEl.querySelector('[data-act="login-add-toggle"]');
      if (add) add.hidden = true;
      if (pane) pane.classList.remove("is-adding");
      if (toggle) toggle.classList.remove("active");
      return;
    }
    if (act === "login-add-user") {
      this.onAction("login-add-user", this.activeKey, this);
      return;
    }
    if (act === "login-del-ask") {
      const id = actEl.getAttribute("data-id") || "";
      const name = actEl.getAttribute("data-user") || "";
      const box = this.bodyEl && this.bodyEl.querySelector("#popLoginConfirm");
      const msg = this.bodyEl && this.bodyEl.querySelector("#popLoginConfirmMsg");
      const pane = this.bodyEl && this.bodyEl.querySelector("#popLoginUserRow");
      if (!id || !box) return;
      this._loginDelId = id;
      this._loginDelName = name;
      if (msg) {
        const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
        msg.textContent = zh
          ? `确认删除操作员「${name}」？删除后不可恢复。`
          : `Delete operator "${name}"? This cannot be undone.`;
      }
      box.hidden = false;
      if (pane) pane.classList.add("is-confirming");
      return;
    }
    if (act === "login-del-cancel") {
      const box = this.bodyEl && this.bodyEl.querySelector("#popLoginConfirm");
      const pane = this.bodyEl && this.bodyEl.querySelector("#popLoginUserRow");
      this._loginDelId = "";
      this._loginDelName = "";
      if (box) box.hidden = true;
      if (pane) pane.classList.remove("is-confirming");
      return;
    }
    if (act === "login-del-ok") {
      this.onAction("login-del-user", this.activeKey, this);
      return;
    }
    // 信息弹窗确认/取消/关闭：必须先走 onAction（写操作日志 + 业务），勿直接关窗跳过
    if (act === "close" || act === "finish-no" || act === "nocloth-cancel") {
      this._actEl = actEl;
      const key = this.activeKey;
      let ret;
      try {
        ret = this.onAction(act, key, this);
      } catch (_) { /* ignore */ }
      if (act === "close") {
        if (this.activeKey) this.close();
      } else {
        // finish-no 同步关；nocloth-cancel 可能 await 后再关；无宿主时兜底
        Promise.resolve(ret).finally(() => {
          if (this.activeKey === key) this.close();
        });
      }
      return;
    }
    if (actEl.closest("#popSettingsTabs")) {
      const tab = actEl.getAttribute("data-tab");
      const sec = actEl.getAttribute("data-sec") || "";
      if (tab) {
        this.settingsTabId = tab;
        this.settingsSecId = sec || null;
        this._applySettingsNav(tab, sec);
        this.bodyEl.querySelectorAll("[data-pane]").forEach((p) => {
          p.hidden = p.getAttribute("data-pane") !== tab;
        });
        this._scrollSettingsSec(sec);
      }
      return;
    }
    if (act === "debug-tab-scroll-prev") {
      this._scrollDebugTabs(-1);
      return;
    }
    if (act === "debug-tab-scroll-next") {
      this._scrollDebugTabs(1);
      return;
    }
    if (act === "debug-tab" || actEl.closest("#popDebugTabs")) {
      const tab = actEl.getAttribute("data-tab");
      if (!tab) return;
      this._activateDebugTab(tab, actEl.getAttribute("data-src"));
      return;
    }
    if (act === "rec-panel" || actEl.closest("#popRecPanelTabs")) {
      const panel = actEl.getAttribute("data-panel");
      if (!panel) return;
      const ctx = this.getCtx && this.getCtx();
      if (ctx && ctx.state) {
        if (!ctx.state.recordsUi) ctx.state.recordsUi = {};
        ctx.state.recordsUi.panel = panel;
      }
      const root = this.bodyEl && this.bodyEl.querySelector(".spx-records");
      if (root) root.setAttribute("data-panel", panel);
      this.bodyEl.querySelectorAll("#popRecPanelTabs button").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-panel") === panel)
      );
      this.bodyEl.querySelectorAll("[data-rec-pane]").forEach((p) => {
        const on = p.getAttribute("data-rec-pane") === panel;
        p.hidden = !on;
        if (!on) return;
        const frame = p.querySelector("iframe.spx-records-frame");
        if (frame && !frame.getAttribute("src")) {
          const src = frame.getAttribute("data-src");
          if (src) frame.setAttribute("src", src);
        }
      });
      return;
    }
    if (act === "plct-io-open") {
      const sub = this.bodyEl && this.bodyEl.querySelector("#popPlcIo");
      const host = this.bodyEl && this.bodyEl.querySelector("#popPlcIoHost");
      if (sub) sub.hidden = false;
      if (host && global.SpxPlcIo && typeof global.SpxPlcIo.mount === "function") {
        const ctx = this.getCtx() || {};
        global.SpxPlcIo.mount(host, { lang: ctx.lang || "zh-CN" });
      } else if (host) {
        host.innerHTML = `<div class="spx-plc-io-empty">${(this.getCtx() || {}).lang === "zh-CN" ? "spacex-plc-io.js 未加载" : "spacex-plc-io.js missing"}</div>`;
      }
      return;
    }
    if (act === "plct-io-close") {
      const sub = this.bodyEl && this.bodyEl.querySelector("#popPlcIo");
      if (global.SpxPlcIo && typeof global.SpxPlcIo.unmount === "function") global.SpxPlcIo.unmount();
      if (sub) sub.hidden = true;
      return;
    }
    if (act === "plct-sys-tab") {
      this._switchPlcSysTab(actEl.getAttribute("data-tab") || "quick");
      return;
    }
    if (act === "plct-manual-open") {
      const sub = this.bodyEl && this.bodyEl.querySelector("#popPlcManual");
      if (sub) {
        sub.hidden = false;
        this._syncPlcManualOps();
      }
      return;
    }
    if (act === "plct-manual-close") {
      const sub = this.bodyEl && this.bodyEl.querySelector("#popPlcManual");
      if (sub) sub.hidden = true;
      return;
    }
    if (act === "plct-cmd" || act === "plct-apply" || act === "plct-movex" || act === "plct-label-test") {
      const ops = actEl.closest("#popPlcManualOps");
      if (ops && ops.classList.contains("is-disabled")) return;
      if (actEl.disabled) return;
      this._actEl = actEl;
      this.onAction(act, this.activeKey, this);
      return;
    }
    if (act === "plct-toggle") {
      // checkbox 走 change/_onInput
      return;
    }
    if (act === "plc-undo") {
      const id = actEl.getAttribute("data-target");
      const range = id ? this.bodyEl.querySelector(`#${id}`) : null;
      if (!range) return;
      const prev = range.getAttribute("data-prev");
      if (prev == null || prev === "") return;
      const cur = range.value;
      range.value = prev;
      range.setAttribute("data-prev", cur);
      this._syncPlcVal(range);
      this._syncPlcUndoBtn(range);
      this.onAction("plc-live", this.activeKey, this);
      return;
    }
    if (act === "plc-set" || act === "plc-step") {
      const id = actEl.getAttribute("data-target");
      const range = id ? this.bodyEl.querySelector(`#${id}`) : null;
      if (!range) return;
      const min = Number(range.min);
      const max = Number(range.max);
      const step = Number(range.step) || 1;
      const before = range.value;
      let next;
      if (act === "plc-set") {
        next = Number(actEl.getAttribute("data-v"));
      } else {
        next = Number(range.value) + Number(actEl.getAttribute("data-delta") || 0);
      }
      next = Math.min(max, Math.max(min, next));
      if (step < 1) next = Math.round(next / step) * step;
      else next = Math.round(next);
      const nextStr = step < 1 ? next.toFixed(1) : String(next);
      if (nextStr === before) return;
      range.setAttribute("data-prev", before);
      range.value = nextStr;
      this._syncPlcVal(range);
      this._syncPlcUndoBtn(range);
      this.onAction("plc-live", this.activeKey, this);
      return;
    }
    if (act === "cam-tab") {
      const name = actEl.getAttribute("data-cam") || "";
      if (!name) return;
      this.bodyEl.querySelectorAll('[data-act="cam-tab"]').forEach((b) => {
        const on = b === actEl;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      this.bodyEl.querySelectorAll("[data-cam-pane]").forEach((p) => {
        p.hidden = String(p.getAttribute("data-cam-pane")) !== String(name);
      });
      const preview = this.bodyEl.querySelector("#popCamPreview");
      if (preview) preview.setAttribute("data-cam", name);
      const metaName = this.bodyEl.querySelector("#popCamMetaName");
      if (metaName) metaName.textContent = name;
      const ctx = this.getCtx && this.getCtx();
      if (ctx && ctx.state) ctx.state.selectedCamName = name;
      this._actEl = actEl;
      this.onAction("cam-tab", this.activeKey, this);
      return;
    }
    if (act === "light-tab") {
      const id = actEl.getAttribute("data-id");
      if (id == null) return;
      this.bodyEl.querySelectorAll('[data-act="light-tab"]').forEach((b) => {
        const on = b === actEl;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      this.bodyEl.querySelectorAll("[data-light-pane]").forEach((p) => {
        p.hidden = String(p.getAttribute("data-light-pane")) !== String(id);
      });
      const ctx = this.getCtx && this.getCtx();
      if (ctx && ctx.state) ctx.state.lightTabId = Number(id);
      return;
    }
    if (act === "light-auto") {
      // checkbox 走 change/_onInput，避免 click 与 change 双触发
      return;
    }
    if (act === "light-preset") {
      const v1 = actEl.getAttribute("data-v");
      const v2 = actEl.getAttribute("data-v2") != null ? actEl.getAttribute("data-v2") : v1;
      const color = actEl.getAttribute("data-color") || "";
      this.bodyEl.querySelectorAll('[data-act="light-slider"]').forEach((el) => {
        const id = Number(el.getAttribute("data-id"));
        const v = id === 2 ? v2 : v1;
        if (v == null) return;
        el.value = v;
        const lab = this.bodyEl.querySelector(`[data-light-val="${id}"]`);
        if (lab) lab.textContent = v;
      });
      this.bodyEl.querySelectorAll(".spx-swatch").forEach((b) => b.classList.toggle("selected", b === actEl));
      const grid = this.bodyEl.querySelector(".spx-color-grid");
      if (grid) grid.setAttribute("data-selected-color", color);
      this._actEl = actEl;
      this.onAction("light-preset", this.activeKey, this);
      return;
    }
    if (act === "bc-clear") {
      const inp = this.bodyEl.querySelector("#popBarcode");
      if (inp) inp.value = "";
      return;
    }
    if (act === "def-step-edit") {
      const id = actEl.getAttribute("data-target");
      if (!id) return;
      if (this._defStepEditId === id) {
        this._closeDefStepEditor();
        return;
      }
      this._openDefStepEditor(id, actEl);
      return;
    }
    if (act === "def-step-editor-delta") {
      const editorInp = this.bodyEl && this.bodyEl.querySelector("#popDefStepEditorVal");
      const wrap = this._defStepEditId
        ? this.bodyEl.querySelector(`.spx-def-step[data-step-id="${this._defStepEditId}"]`)
        : null;
      if (!editorInp || !wrap) return;
      const min = Number(wrap.getAttribute("data-min")) || 0;
      const max = Number(wrap.getAttribute("data-max")) || 9999;
      const step = Number(wrap.getAttribute("data-step")) || 1;
      const delta = Number(actEl.getAttribute("data-delta")) || 0;
      const cur = Number(editorInp.value) || 0;
      const next = Math.min(max, Math.max(min, cur + delta * step));
      editorInp.value = String(next);
      this._commitDefStepEditor();
      return;
    }
    if (act === "ws-step") {
      const wrap = actEl.closest("[data-ws-step]");
      const inp = wrap ? wrap.querySelector("input[data-setting-key]") : null;
      if (!wrap || !inp) return;
      const min = Number(wrap.getAttribute("data-min"));
      const max = Number(wrap.getAttribute("data-max"));
      const step = Number(wrap.getAttribute("data-step")) || 1;
      const delta = Number(actEl.getAttribute("data-delta")) || 0;
      const lo = Number.isFinite(min) ? min : 0;
      const hi = Number.isFinite(max) ? max : 9999;
      const cur = Number(inp.value);
      const base = Number.isFinite(cur) ? cur : 0;
      const next = Math.min(hi, Math.max(lo, base + delta * step));
      inp.value = String(next);
      // 边距 +/-：立即落库，顶栏幅宽按钮同步显示
      this._actEl = actEl;
      this.onAction("ws-margin-live", this.activeKey, this);
      return;
    }
    if (act === "ws-mode") {
      const v = actEl.getAttribute("data-v");
      const inp = this.bodyEl.querySelector("#wsDetectEdgeMode");
      if (inp && v != null) inp.value = String(v);
      this.bodyEl.querySelectorAll(".spx-ws-mode-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-v") === String(v));
      });
      // 视觉检测方法：立即写入，避免只改 UI 未点保存就关掉
      if (inp) {
        this._actEl = inp;
        this.onAction("ws-setting-live", this.activeKey, this);
      }
      return;
    }
    if (act === "art-zoom" || act === "aided-zoom") {
      const delta = Number(actEl.getAttribute("data-delta")) || 0;
      if (this._toolApi && this._toolApi.setZoom) this._toolApi.setZoom(delta);
      return;
    }
    if (act === "art-zoom-reset" || act === "aided-zoom-reset") {
      if (this._toolApi && this._toolApi.resetZoom) this._toolApi.resetZoom();
      return;
    }
    if (act === "width-reset") {
      if (this._toolApi && this._toolApi.reset) this._toolApi.reset();
      this.onAction(act, this.activeKey, this);
      return;
    }
    if (act === "defect-settings-cloth-prev" || act === "defect-settings-cloth-next") {
      this._scrollDefectCloth(act === "defect-settings-cloth-next" ? 1 : -1);
      return;
    }
    if (act === "defect-settings-all-on" || act === "defect-settings-all-off") {
      this._setDefectDetectAll(act === "defect-settings-all-on");
      return;
    }
    if (act === "defect-settings-custom") {
      const ctxAdmin = this.getCtx() || {};
      if (!(ctxAdmin.about && ctxAdmin.about.isAdmin)) {
        this._actEl = actEl;
        this.onAction("defect-settings-custom-denied", this.activeKey, this);
        return;
      }
      this._showDefectCustomModal(true);
      this._actEl = actEl;
      this.onAction("defect-settings-custom", this.activeKey, this);
      return;
    }
    if (act === "defect-settings-custom-close") {
      this._showDefectCustomModal(false);
      return;
    }
    if (act === "defect-settings-custom-select-all") {
      this._setDefectCustomSelect(true);
      return;
    }
    if (act === "defect-settings-custom-select-none") {
      this._setDefectCustomSelect(false);
      return;
    }
    if (act === "defect-settings-custom-filter") {
      this._defectCustomFilterEnabled = !this._defectCustomFilterEnabled;
      const btn = this.bodyEl && this.bodyEl.querySelector("#popDefectCustomFilterBtn");
      if (btn) {
        const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
        btn.classList.toggle("active", !!this._defectCustomFilterEnabled);
        btn.textContent = this._defectCustomFilterEnabled
          ? (zh ? "显示全部" : "Show all")
          : (zh ? "只显示已启用" : "Enabled only");
      }
      this._applyDefectCustomFilter();
      return;
    }
    if (act === "defect-settings-custom-search") {
      return;
    }
    if (act === "defect-settings-custom-save") {
      this._actEl = actEl;
      this.onAction("defect-settings-custom-save", this.activeKey, this);
      return;
    }
    if (act === "defect-settings-cloth-add") {
      const box = this.bodyEl && this.bodyEl.querySelector("#popDefectClothAdd");
      if (box) box.hidden = false;
      const inp = this.bodyEl && this.bodyEl.querySelector("#popDefectClothName");
      if (inp) {
        inp.value = "";
        requestAnimationFrame(() => {
          try {
            inp.focus({ preventScroll: true });
            inp.select();
          } catch (_) { /* ignore */ }
        });
      }
      return;
    }
    if (act === "defect-settings-cloth-add-cancel") {
      const box = this.bodyEl && this.bodyEl.querySelector("#popDefectClothAdd");
      if (box) box.hidden = true;
      return;
    }
    // 原生 select 只在 change 里处理，避免点开下拉就 onAction
    if (actEl.tagName === "SELECT") return;
    if (actEl.hasAttribute("disabled") || actEl.disabled) return;
    // 透传 data-id / data-mode / data-label 供宿主更新状态
    this._actEl = actEl;
    this.onAction(act, this.activeKey, this);
  };

  SpxPopupHost.prototype._syncPlcVal = function (range) {
    if (!range || !range.id) return;
    const lab = this.bodyEl.querySelector(`#${range.id}Val`);
    if (!lab) return;
    const step = Number(range.step) || 1;
    const v = Number(range.value);
    lab.textContent = step < 1 ? v.toFixed(1) : String(Math.round(v));
  };

  SpxPopupHost.prototype._syncPlcUndoBtn = function (range) {
    if (!range || !range.id || !this.bodyEl) return;
    const btn = this.bodyEl.querySelector(`[data-act="plc-undo"][data-target="${range.id}"]`);
    if (!btn) return;
    const prev = range.getAttribute("data-prev");
    const canUndo = prev != null && prev !== "" && String(prev) !== String(range.value);
    btn.disabled = !canUndo;
  };

  SpxPopupHost.prototype._syncPlcManualOps = function () {
    if (!this.bodyEl) return;
    const enable = this.bodyEl.querySelector("#plctManual");
    const ops = this.bodyEl.querySelector("#popPlcManualOps");
    const hint = this.bodyEl.querySelector("#popPlcManualHint");
    if (!ops) return;
    const on = !!(enable && enable.checked);
    ops.classList.toggle("is-disabled", !on);
    ops.setAttribute("aria-disabled", on ? "false" : "true");
    if (hint) {
      const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
      hint.textContent = on
        ? (zh ? "手动模式已开启" : "Manual mode on")
        : (zh ? "开启手动模式后，下方功能才可操作" : "Enable manual mode to use controls below");
      hint.classList.toggle("ok", on);
    }
    // 关闭手动：复位子开关 UI，并禁用控件
    const subIds = ["plctDc", "plctWind", "plctVac", "plctAir"];
    subIds.forEach((id) => {
      const el = this.bodyEl.querySelector(`#${id}`);
      if (!el) return;
      if (!on) el.checked = false;
      el.disabled = !on;
    });
    ops.querySelectorAll("button").forEach((btn) => {
      btn.disabled = !on;
    });
  };

  SpxPopupHost.prototype._onPlcPointerDown = function (e) {
    const t = e.target;
    if (!t) return;
    if (t.getAttribute("data-act") === "plct-hold") {
      const ops = t.closest("#popPlcManualOps");
      if (ops && ops.classList.contains("is-disabled")) return;
      if (t.disabled) return;
      e.preventDefault();
      this._actEl = t;
      this._plctHolding = t;
      this.onAction("plct-hold-down", this.activeKey, this);
      return;
    }
    if (t.getAttribute("data-act") !== "plc-range") return;
    t._plcDragging = false;
    t.setAttribute("data-drag-start", t.value);
  };

  SpxPopupHost.prototype._onPlcPointerUp = function (e) {
    const t = e.target;
    if (this._plctHolding) {
      this._actEl = this._plctHolding;
      this.onAction("plct-hold-up", this.activeKey, this);
      this._plctHolding = null;
      return;
    }
    if (!t || t.getAttribute("data-act") !== "plc-range") return;
    if (t._plcDragging) {
      const start = t.getAttribute("data-drag-start");
      if (start != null && start !== t.value) {
        t.setAttribute("data-prev", start);
        this._syncPlcUndoBtn(t);
      }
    }
    t._plcDragging = false;
  };

  SpxPopupHost.prototype._syncLoginType = function () {
    if (!this.bodyEl) return;
    const typeEl = this.bodyEl.querySelector("#popLoginType");
    const root = this.bodyEl.querySelector("#popLoginRoot") || this.bodyEl.querySelector(".spx-login");
    const userRow = this.bodyEl.querySelector("#popLoginUserRow");
    const passRow = this.bodyEl.querySelector("#popLoginPassRow");
    const addBox = this.bodyEl.querySelector("#popLoginAdd");
    const addToggle = this.bodyEl.querySelector('[data-act="login-add-toggle"]');
    if (!typeEl) return;
    const admin = typeEl.value === "admin";
    if (root) {
      root.classList.toggle("is-admin", admin);
      root.classList.toggle("is-user", !admin);
    }
    if (userRow) {
      userRow.hidden = admin;
      userRow.style.display = admin ? "none" : "";
    }
    if (passRow) {
      passRow.hidden = !admin;
      passRow.style.display = admin ? "" : "none";
    }
    if (admin) {
      if (addBox) addBox.hidden = true;
      if (addToggle) addToggle.classList.remove("active");
      if (userRow) userRow.classList.remove("is-adding", "is-confirming");
      this.closeLoginConfirm();
    }
    this.bodyEl.querySelectorAll('[data-act="login-type"]').forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-type") === typeEl.value);
    });
    const pass = this.bodyEl.querySelector("#popLoginPass");
    if (!admin) {
      if (pass) pass.value = "";
    } else if (pass) {
      requestAnimationFrame(() => {
        try { pass.focus(); } catch (_) { /* ignore */ }
      });
    }
  };

  /** 刷新登录弹窗操作员列表（新增/删除后调用） */
  SpxPopupHost.prototype.refreshLoginUsers = function (users, pickName) {
    if (!this.bodyEl) return;
    const list = normalizeLoginUsers(users);
    const userEl = this.bodyEl.querySelector("#popLoginUser");
    const current = pickName || (userEl && userEl.value) || (list[0] && list[0].name) || "";
    const chips = this.bodyEl.querySelector("#popLoginUsers");
    const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
    if (chips) chips.innerHTML = renderLoginUserChips(list, current, zh);
    if (userEl) {
      userEl.innerHTML = renderLoginUserOptions(list, current);
      if (list.some((u) => u.name === current)) userEl.value = current;
      else userEl.value = (list[0] && list[0].name) || "";
    }
    const ctx = this.getCtx && this.getCtx();
    if (ctx) ctx.users = list;
  };

  SpxPopupHost.prototype.closeLoginAddPanel = function () {
    if (!this.bodyEl) return;
    const add = this.bodyEl.querySelector("#popLoginAdd");
    const pane = this.bodyEl.querySelector("#popLoginUserRow");
    const toggle = this.bodyEl.querySelector('[data-act="login-add-toggle"]');
    if (add) add.hidden = true;
    if (pane) pane.classList.remove("is-adding");
    if (toggle) toggle.classList.remove("active");
  };

  SpxPopupHost.prototype.closeLoginConfirm = function () {
    if (!this.bodyEl) return;
    const box = this.bodyEl.querySelector("#popLoginConfirm");
    const pane = this.bodyEl.querySelector("#popLoginUserRow");
    this._loginDelId = "";
    this._loginDelName = "";
    if (box) box.hidden = true;
    if (pane) pane.classList.remove("is-confirming");
  };

  SpxPopupHost.prototype._scrollDefectCloth = function (dir) {
    if (!this.bodyEl) return;
    const tabs = this.bodyEl.querySelector("#popDefectClothTabs");
    if (!tabs) return;
    const step = Math.max(140, Math.floor(tabs.clientWidth * 0.7));
    const nextLeft = Math.max(0, Math.min(tabs.scrollWidth - tabs.clientWidth, tabs.scrollLeft + dir * step));
    if (typeof tabs.scrollTo === "function") {
      try {
        tabs.scrollTo({ left: nextLeft, behavior: "smooth" });
      } catch (_) {
        tabs.scrollLeft = nextLeft;
      }
    } else {
      tabs.scrollLeft = nextLeft;
    }
    window.setTimeout(() => this._syncDefectClothNav(false), 240);
  };

  SpxPopupHost.prototype._syncDefectClothNav = function (scrollActive) {
    if (!this.bodyEl) return;
    const tabs = this.bodyEl.querySelector("#popDefectClothTabs");
    if (!tabs) return;
    if (scrollActive) {
      const active = tabs.querySelector(".spx-defect-cloth-tab.active");
      if (active && typeof active.scrollIntoView === "function") {
        try {
          active.scrollIntoView({ inline: "nearest", block: "nearest" });
        } catch (_) {
          /* ignore */
        }
      }
    }
    const max = Math.max(0, tabs.scrollWidth - tabs.clientWidth);
    const prev = this.bodyEl.querySelector('[data-act="defect-settings-cloth-prev"]');
    const next = this.bodyEl.querySelector('[data-act="defect-settings-cloth-next"]');
    const atStart = tabs.scrollLeft <= 1;
    const atEnd = tabs.scrollLeft >= max - 1;
    if (prev) {
      prev.disabled = max <= 0 || atStart;
      prev.classList.toggle("is-disabled", prev.disabled);
    }
    if (next) {
      next.disabled = max <= 0 || atEnd;
      next.classList.toggle("is-disabled", next.disabled);
    }
    if (!tabs._spxClothNavBound) {
      tabs._spxClothNavBound = true;
      tabs.addEventListener("scroll", () => this._syncDefectClothNav(false), { passive: true });
    }
  };

  SpxPopupHost.prototype._setDefectDetectAll = function (on) {
    if (!this.bodyEl) return;
    this.bodyEl.querySelectorAll(".spx-def-on").forEach((inp) => {
      inp.checked = !!on;
      const id = inp.getAttribute("data-id");
      if (!id) return;
      const row = this.bodyEl.querySelector(`tr[data-defect-id="${id}"]`);
      if (row) row.classList.toggle("on", !!on);
    });
  };

  SpxPopupHost.prototype._showDefectCustomModal = function (show) {
    if (!this.bodyEl) return;
    const modal = this.bodyEl.querySelector("#popDefectCustom");
    if (!modal) return;
    modal.hidden = !show;
    if (show) {
      const msg = this.bodyEl.querySelector("#popDefectCustomMsg");
      if (msg) {
        msg.textContent = "";
        msg.className = "spx-msg";
      }
      const search = this.bodyEl.querySelector("#popDefectCustomSearch");
      if (search) search.value = "";
      this._defectCustomFilterEnabled = false;
      const btn = this.bodyEl.querySelector("#popDefectCustomFilterBtn");
      if (btn) {
        const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
        btn.classList.remove("active");
        btn.textContent = zh ? "只显示已启用" : "Enabled only";
      }
    }
  };

  SpxPopupHost.prototype.setDefectCustomMsg = function (text, kind) {
    if (!this.bodyEl) return;
    const msg = this.bodyEl.querySelector("#popDefectCustomMsg");
    if (!msg) return;
    msg.textContent = text || "";
    msg.className = "spx-msg" + (kind ? " " + kind : "");
  };

  SpxPopupHost.prototype.renderDefectCustomCatalog = function (rows) {
    if (!this.bodyEl) return;
    const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
    const tbody = this.bodyEl.querySelector("#popDefectCustomBody");
    if (!tbody) return;
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="spx-muted">${zh ? "暂无数据" : "No data"}</td></tr>`;
      return;
    }
    const esc = (s) =>
      String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    tbody.innerHTML = list
      .map((d) => {
        const id = String(d.ID != null ? d.ID : d.id != null ? d.id : "");
        const name = String(d.Name != null ? d.Name : d.name != null ? d.name : "");
        const customer = String(
          d.CustomerName != null
            ? d.CustomerName
            : d.customerName != null
              ? d.customerName
              : ""
        );
        const enabled = d.IsDefaultCheck === 1 || d.IsDefaultCheck === true || d.isDefaultCheck === 1;
        const statusClass = enabled ? "is-on" : "is-off";
        const statusText = enabled ? (zh ? "已启用" : "On") : (zh ? "未启用" : "Off");
        return `<tr data-defect-id="${esc(id)}" data-name="${esc(name)}" data-is-enabled="${enabled ? "1" : "0"}" data-modified="0">
          <td class="col-sw"><input type="checkbox" class="spx-defect-custom-on" data-original-checked="${enabled ? "1" : "0"}" ${enabled ? "checked" : ""} /></td>
          <td class="col-idx mono">${esc(id)}</td>
          <td class="col-name"><span class="spx-v">${esc(name)}</span></td>
          <td class="col-name"><input type="text" class="spx-defect-custom-customer" value="${esc(customer)}" data-original-value="${esc(customer)}" data-osk="1" placeholder="${esc(name)}" autocomplete="off" /></td>
          <td class="col-sw"><span class="spx-defect-custom-status ${statusClass}">${statusText}</span></td>
        </tr>`;
      })
      .join("");
    this._applyDefectCustomFilter();
  };

  SpxPopupHost.prototype._syncDefectCustomRow = function (row) {
    if (!row) return;
    const zh = ((this.getCtx() || {}).lang || "").indexOf("zh") === 0;
    const chk = row.querySelector(".spx-defect-custom-on");
    const customer = row.querySelector(".spx-defect-custom-customer");
    const status = row.querySelector(".spx-defect-custom-status");
    const on = !!(chk && chk.checked);
    row.setAttribute("data-is-enabled", on ? "1" : "0");
    if (status) {
      status.className = "spx-defect-custom-status " + (on ? "is-on" : "is-off");
      status.textContent = on ? (zh ? "已启用" : "On") : (zh ? "未启用" : "Off");
    }
    const origOn = chk && chk.getAttribute("data-original-checked") === "1";
    const origCustomer = customer ? String(customer.getAttribute("data-original-value") || "") : "";
    const curCustomer = customer ? String(customer.value || "").trim() : "";
    const changed = (chk && origOn !== on) || origCustomer !== curCustomer;
    row.setAttribute("data-modified", changed ? "1" : "0");
  };

  SpxPopupHost.prototype._setDefectCustomSelect = function (on) {
    if (!this.bodyEl) return;
    this.bodyEl.querySelectorAll("#popDefectCustomBody tr[data-defect-id]").forEach((row) => {
      if (row.style.display === "none") return;
      const chk = row.querySelector(".spx-defect-custom-on");
      if (!chk) return;
      chk.checked = !!on;
      this._syncDefectCustomRow(row);
    });
    this._applyDefectCustomFilter();
  };

  SpxPopupHost.prototype._applyDefectCustomFilter = function () {
    if (!this.bodyEl) return;
    const searchEl = this.bodyEl.querySelector("#popDefectCustomSearch");
    const q = String((searchEl && searchEl.value) || "").trim().toLowerCase();
    const onlyOn = !!this._defectCustomFilterEnabled;
    this.bodyEl.querySelectorAll("#popDefectCustomBody tr[data-defect-id]").forEach((row) => {
      const id = String(row.getAttribute("data-defect-id") || "").toLowerCase();
      const name = String(row.getAttribute("data-name") || "").toLowerCase();
      const customerEl = row.querySelector(".spx-defect-custom-customer");
      const customer = customerEl ? String(customerEl.value || "").toLowerCase() : "";
      const enabled = row.getAttribute("data-is-enabled") === "1";
      const hit =
        !q ||
        id.indexOf(q) >= 0 ||
        name.indexOf(q) >= 0 ||
        customer.indexOf(q) >= 0;
      const pass = hit && (!onlyOn || enabled);
      row.style.display = pass ? "" : "none";
    });
  };

  SpxPopupHost.prototype.collectDefectCustomChanges = function () {
    if (!this.bodyEl) return [];
    const out = [];
    this.bodyEl.querySelectorAll("#popDefectCustomBody tr[data-defect-id][data-modified='1']").forEach((row) => {
      const id = row.getAttribute("data-defect-id") || "";
      const name = row.getAttribute("data-name") || "";
      const chk = row.querySelector(".spx-defect-custom-on");
      const customer = row.querySelector(".spx-defect-custom-customer");
      if (!id || !chk) return;
      out.push({
        defectid: id,
        name: name,
        isdefaultcheck: chk.checked ? 1 : 0,
        customername: customer ? String(customer.value || "").trim() : "",
      });
    });
    return out;
  };

  SpxPopupHost.prototype._onInput = function (e) {
    const t = e.target;
    if (t.id === "popLoginType" || t.getAttribute("data-act") === "login-type") {
      this._syncLoginType();
      return;
    }
    // 边距数值输入（含 OSK）：change 时立即写入，顶栏幅宽同步
    if (
      e.type === "change" &&
      t.matches &&
      t.matches('input[data-setting-key="DistanceToLeftEdge"], input[data-setting-key="DistanceToRightEdge"]')
    ) {
      const wrap = t.closest("[data-ws-step]");
      if (wrap) {
        const min = Number(wrap.getAttribute("data-min"));
        const max = Number(wrap.getAttribute("data-max"));
        const lo = Number.isFinite(min) ? min : 0;
        const hi = Number.isFinite(max) ? max : 9999;
        const cur = Number(t.value);
        const next = Number.isFinite(cur) ? Math.min(hi, Math.max(lo, cur)) : lo;
        t.value = String(next);
      }
      this._actEl = t;
      this.onAction("ws-margin-live", this.activeKey, this);
      return;
    }
    // 幅宽传感器开关：change 立即写入（与边距一致，避免关弹窗后复位）
    if (
      e.type === "change" &&
      this.activeKey === "widthSensor" &&
      t.matches &&
      t.matches('input[data-setting-control="toggle"][data-setting-key]')
    ) {
      this._actEl = t;
      this.onAction("ws-setting-live", this.activeKey, this);
      return;
    }
    if (t.classList && t.classList.contains("spx-plct-inp")) {
      t.dataset.userEdited = "1";
      return;
    }
    if (t.getAttribute("data-act") === "plct-toggle") {
      t.dataset.userEdited = "1";
      this._actEl = t;
      if (t.id === "plctManual") this._syncPlcManualOps();
      // 子开关在手动关闭时不允许改
      const ops = t.closest("#popPlcManualOps");
      if (ops && ops.classList.contains("is-disabled") && t.id !== "plctManual") {
        t.checked = false;
        return;
      }
      this.onAction("plct-toggle", this.activeKey, this);
      return;
    }
    if (t.getAttribute("data-act") === "plc-range" || t.id === "popPlcSpeed" || t.id === "popPlcFabric" ||
        t.id === "popPlcRoll" || t.id === "popPlcSwing") {
      // 滑条：整段拖动以按下时数值为撤销点
      if (!t._plcDragging) {
        t._plcDragging = true;
        const start = t.getAttribute("data-drag-start");
        if (start != null) t.setAttribute("data-prev", start);
      }
      this._syncPlcVal(t);
      this._syncPlcUndoBtn(t);
      this.onAction("plc-live", this.activeKey, this);
    }
    if (t.getAttribute("data-act") === "light-slider") {
      const id = t.getAttribute("data-id");
      const lab = this.bodyEl.querySelector(`[data-light-val="${id}"]`);
      if (lab) lab.textContent = t.value;
      const card = t.closest(".spx-light-card");
      if (card) {
        this.bodyEl.querySelectorAll(".spx-light-card").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      }
      this._actEl = t;
      this.onAction("light-live", this.activeKey, this);
    }
    if (t.getAttribute("data-act") === "light-auto" && e.type === "change") {
      const ctx = this.getCtx && this.getCtx();
      const on = !!t.checked;
      if (ctx && ctx.state) {
        ctx.state.lightAuto = on;
        if (Array.isArray(ctx.state.lights)) {
          ctx.state.lights = ctx.state.lights.map((L) => Object.assign({}, L, { auto: on }));
        }
      }
      const row = t.closest(".spx-light-auto-row");
      if (row) row.setAttribute("data-auto", on ? "1" : "0");
      const ico = row && row.querySelector(".spx-light-auto-ico");
      const lab = t.closest(".spx-switch");
      const zh = !!(ctx && String(ctx.lang || "").indexOf("zh") === 0);
      if (lab) lab.title = zh ? (on ? "开" : "关") : on ? "On" : "Off";
      if (ico) ico.title = zh ? (on ? "自动调光" : "手动调光") : on ? "Auto" : "Manual";
      this._actEl = t;
      this.onAction("light-auto", this.activeKey, this);
    }
    if (t.id === "popDefStepEditorVal" && this._defStepEditId) {
      this._commitDefStepEditor();
      return;
    }
    if (t.getAttribute("data-act") === "def-prec" && t.id) {
      const lab = this.bodyEl.querySelector(`#${t.id}Val`);
      if (lab) lab.textContent = String(t.value);
    }
    if (t.classList && t.classList.contains("spx-def-on")) {
      const id = t.getAttribute("data-id");
      const row = this.bodyEl.querySelector(`tr[data-defect-id="${id}"]`);
      if (row) row.classList.toggle("on", !!t.checked);
    }
    if (t.classList && t.classList.contains("spx-defect-custom-on")) {
      const row = t.closest("tr[data-defect-id]");
      this._syncDefectCustomRow(row);
      if (this._defectCustomFilterEnabled) this._applyDefectCustomFilter();
      return;
    }
    if (t.classList && t.classList.contains("spx-defect-custom-customer")) {
      const row = t.closest("tr[data-defect-id]");
      this._syncDefectCustomRow(row);
      if (e.type === "input") this._applyDefectCustomFilter();
      return;
    }
    if (t.id === "popDefectCustomSearch") {
      this._applyDefectCustomFilter();
      return;
    }
    if (t.id === "popRecQueryType") {
      this._actEl = t;
      this.onAction("rec-query-type", this.activeKey, this);
    }
    if (t.id === "popRecColSearch") {
      // 本地过滤可选字段，避免整页刷新丢失焦点
      if (e.type === "input" || e.type === "change") {
        const q = String(t.value || "").trim().toLowerCase();
        const ctx = this.getCtx && this.getCtx();
        if (ctx && ctx.state && ctx.state.recordsUi) ctx.state.recordsUi.settingsQuery = t.value || "";
        const list = this.bodyEl && this.bodyEl.querySelector("#popRecColAvailable");
        if (list) {
          list.querySelectorAll(".spx-rec-col-item").forEach((item) => {
            const name = (item.querySelector(".col-name") && item.querySelector(".col-name").textContent) || "";
            const key = (item.querySelector(".col-key") && item.querySelector(".col-key").textContent) || "";
            const col = item.getAttribute("data-column") || "";
            const hit = !q
              || name.toLowerCase().indexOf(q) >= 0
              || key.toLowerCase().indexOf(q) >= 0
              || col.toLowerCase().indexOf(q) >= 0;
            item.style.display = hit ? "" : "none";
          });
        }
      }
    }
    // select 在现代浏览器会先 input 再 change，只处理 change 避免重复拉库
    if (
      (t.id === "popDefectCloth" || t.getAttribute("data-act") === "defect-settings-cloth")
      && e.type === "change"
    ) {
      this._actEl = t;
      this.onAction("defect-settings-cloth", this.activeKey, this);
    }
  };

  global.SpxPopupHost = SpxPopupHost;
})(window);
