/**
 * CustomUIV3 SpaceX HUD 弹窗 — 字段/交互参考 viewsvue/realtimev3
 * Quick: 舞台内约 50%×80%；Center: 约 95%×95%（mid-band 键仅铺满顶底栏之间）；
 * Form: 居中约 480–560（检验单）；Left: 贴疵点列表左侧旁（疵点详情）；Info: 居中约 1/3 宽
 * Tool/mid-band: DefectAidedSelection / artifical_add_defect / artifical_edit_defect / defectAdd / defectEdit
 * slot_show 对齐 RealTimeDetection::slot_show：
 * noclothstop / empty_sheet_stop / noclothstop_clothfinish /
 * loop_stop / cloth_finish_stop / mid_sample_stop / width_sample_stop / colordiffalarm
 * netWidthNeedStart / netWidthNeedStop
 */
(function (global) {
  "use strict";

  const CENTER_KEYS = new Set([
    "records",
    "defectSettings",
    "debug",
    "unwind",
    "defectAidedSelection",
    "artificalAddDefect",
    "artificalEditDefect",
    "artificalAddWidth",
    "defectAdd",
    "defectEdit",
  ]);

  /** 铺满顶底栏之间的中间区（对齐 SpxPopupHost::isFullStageCenterKey） */
  const MID_BAND_KEYS = new Set([
    "records",
    "defectSettings",
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

  /** 登录/检验单：居中紧凑，避免铺满舞台 */
  const FORM_KEYS = new Set([
    "login",
    "erpNewSheet",
    "erpEditSheet",
    "fourPoints",
  ]);

  /** 定时 refresh 会冲掉输入与 tab，这些弹窗跳过整页重建 */
  const NO_LIVE_REFRESH_KEYS = new Set([
    "login",
    "systemSettings",
    "erpNewSheet",
    "erpEditSheet",
    "fourPoints",
    "defectAdd",
    "defectEdit",
    "defectSettings",
    "records",
    "debug",
    "plc", // 快调滑条/撤销态：重建会刷回旧 setpoint
    "light", // 布色/滑条设亮度后，列表接口滞后会把 UI 刷回旧值
    "artificalAddDefect", // 标注态 / 标签弹窗 / 画布交互
    "artificalEditDefect",
    "artificalAddWidth",
    "defectAidedSelection",
  ]);

  /** 疵点详情：贴在疵点列表左侧旁 */
  const LEFT_KEYS = new Set([
    "defectDetail",
  ]);

  /** 基本信息弹窗（对齐 BFSMessageBox / NoClothStopDialog） */
  const INFO_KEYS = new Set([
    "noclothstop",
    "empty_sheet_stop",
    "noclothstop_clothfinish",
    "loop_stop",
    "cloth_finish_stop",
    "mid_sample_stop",
    "width_sample_stop",
    "colordiffalarm",
    "finishSheet",
    "netWidthNeedStart",
    "netWidthNeedStop",
  ]);

  /** 顶栏控制弹窗 */
  const HEADER_OPACITY_KEYS = new Set([
    "plc",
    "camera",
    "light",
    "alarm",
    "login",
    "systemSettings",
    "about",
  ]);

  /** 全屏弹窗（检验记录 / 疵点设置 / 详情 / 标注工具） */
  const FULLSCREEN_OPACITY_KEYS = new Set([
    "records",
    "defectSettings",
    "debug",
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
    system: 88,
    fullscreen: 88,
  };

  function popupOpacityKind(key) {
    if (INFO_KEYS.has(key)) return "system";
    if (FULLSCREEN_OPACITY_KEYS.has(key)) return "fullscreen";
    if (HEADER_OPACITY_KEYS.has(key)) return "header";
    return "bottom";
  }

  function popupOpacityPercent(ctx, key) {
    const kind = popupOpacityKind(key);
    const s = (ctx && ctx.state) || {};
    const map = {
      header: "UI_POPUP_OPACITY_HEADER",
      bottom: "UI_POPUP_OPACITY_BOTTOM",
      system: "UI_POPUP_OPACITY_SYSTEM",
      fullscreen: "UI_POPUP_OPACITY_FULLSCREEN",
    };
    const aliases = {
      header: ["popupOpacityHeader", "UI_POPUP_OPACITY_HEADER"],
      bottom: ["popupOpacityBottom", "UI_POPUP_OPACITY_BOTTOM"],
      system: ["popupOpacitySystem", "UI_POPUP_OPACITY_SYSTEM"],
      fullscreen: ["popupOpacityFullscreen", "UI_POPUP_OPACITY_FULLSCREEN"],
    };
    let v = POPUP_OPACITY_DEFAULTS[kind];
    const keys = aliases[kind] || [map[kind]];
    for (const k of keys) {
      if (s[k] != null && s[k] !== "") {
        const n = Number(s[k]);
        if (Number.isFinite(n)) {
          v = n;
          break;
        }
      }
    }
    return Math.max(40, Math.min(100, Math.round(v)));
  }

  function applyPopupOpacity(shell, ctx, key) {
    if (!shell) return;
    const pct = popupOpacityPercent(ctx, key);
    shell.style.opacity = String(pct / 100);
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
      noclothstop: "警告",
      empty_sheet_stop: "警告",
      noclothstop_clothfinish: "警告",
      loop_stop: "警告",
      cloth_finish_stop: "警告",
      mid_sample_stop: "警告",
      width_sample_stop: "警告",
      netWidthNeedStart: "警告",
      netWidthNeedStop: "警告",
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
      noclothstop: "Warning",
      empty_sheet_stop: "Warning",
      noclothstop_clothfinish: "Warning",
      loop_stop: "Warning",
      cloth_finish_stop: "Warning",
      mid_sample_stop: "Warning",
      width_sample_stop: "Warning",
      netWidthNeedStart: "Warning",
      netWidthNeedStop: "Warning",
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

  function buildLogin(ctx) {
    // 对齐 CustomUI Login / bfslogin：类型切换后只显示用户或密码，对接 /realtime/login
    // 已是管理员时显示登出，便于收回调试权限
    const zh = ctx.lang === "zh-CN";
    const users = Array.isArray(ctx.users) && ctx.users.length
      ? ctx.users
      : [{ name: "OPERATOR" }, { name: "QA" }, { name: "INSPECTOR" }];
    const curInspector = (ctx.sheet && ctx.sheet.userName) || "";
    const isAdminNow = !!(ctx.about && ctx.about.isAdmin);
    const curAuth = isAdminNow ? "admin" : "user";
    const opts = users
      .map((u) => {
        const n = u.name || u.inspectorNo || "";
        return `<option value="${n}" ${n === curInspector ? "selected" : ""}>${n}</option>`;
      })
      .join("");
    const status = isAdminNow
      ? `<div class="spx-plc-msg ok">${zh ? "当前：管理员已登录" : "Signed in as Admin"}</div>`
      : (curInspector
        ? `<div class="spx-plc-msg">${zh ? `当前：${curInspector}` : `Current: ${curInspector}`}</div>`
        : "");
    const logoutBtn = isAdminNow
      ? ghostBtn(zh ? "登出" : "Logout", 'data-act="login-logout"')
      : "";
    return `
      ${section(zh ? "登录" : "Login")}
      ${status}
      ${field(zh ? "类型" : "Type", `
        <select id="popLoginType" data-act="login-type">
          <option value="user" ${curAuth !== "admin" ? "selected" : ""}>${zh ? "操作员" : "Operator"}</option>
          <option value="admin" ${curAuth === "admin" ? "selected" : ""}>${zh ? "管理员" : "Admin"}</option>
        </select>`)}
      <div id="popLoginUserRow" ${curAuth === "admin" ? "hidden" : ""}>
        ${field(zh ? "用户" : "User", `<select id="popLoginUser">${opts}</select>`)}
      </div>
      <div id="popLoginPassRow" ${curAuth === "admin" ? "" : "hidden"}>
        ${field(zh ? "密码" : "Password", `<input id="popLoginPass" type="password" placeholder="••••••" data-osk="1" />`)}
      </div>
      <div id="popLoginMsg" class="spx-plc-msg" style="min-height:1.2em"></div>
      <div class="spx-actions">
        ${logoutBtn}
        ${ghostBtn(zh ? "登录" : "Login", 'data-act="login-ok"')}
      </div>`;
  }

  function buildAbout(ctx) {
    // 字段/按钮对齐 CustomUI/component/About（refreshVersionText + admin 工具行）
    const zh = ctx.lang === "zh-CN";
    const info = (ctx.about && typeof ctx.about === "object") ? ctx.about : {};
    const version = info.version || "1.26.1119.232927";
    const buildTime = info.buildTime || "2026-11-19 23:29:27";
    const gitInfo = info.gitInfo || "v2-stable_60de8481";
    const machineProject = info.machineProject != null ? String(info.machineProject) : "0";
    const machineSerial = info.machineSerial || "BM-FS-2026-001";
    const erpFactory = info.erpFactory || "default";
    const installDate = info.installDate || "2026-11-01";
    const testMode = Number(info.testMode || 0);
    const isAdmin = info.isAdmin !== false;
    const notes = info.notes || (zh
      ? "1.26.1119 — 不停机贴标/复核、自动停机、双面贴标、自动调光与 ERP 接口等合并更新。"
      : "1.26.1119 — Non-stop labelling/review, auto-stop, doubleside, auto light, ERP merges.");

    let testBanner = "";
    if (testMode > 0) {
      const modeText = testMode === 1
        ? (zh ? "全模拟" : "Full Sim")
        : testMode === 2
          ? (zh ? "半模拟" : "Half Sim")
          : String(testMode);
      testBanner = `<div class="spx-about-test">!!! ${zh ? "测试模式" : "TEST MODE"} ${testMode}（${modeText}）!!!</div>`;
    }

    const notesBlock = isAdmin
      ? `${section(zh ? "更新说明" : "Release Notes")}
      <div class="spx-about-notes">${notes}</div>`
      : "";

    const homeBtn = ghostBtn(zh ? "打开主页" : "Open Home", 'data-act="about-open-home"');
    const logBtn = ghostBtn(zh ? "打开日志" : "Open Log", 'data-act="about-log-export"');
    const actions = isAdmin
      ? `${section(zh ? "管理工具" : "Admin Tools")}
      <div class="spx-about-btns">
        ${ghostBtn(zh ? "检查更新" : "Check Update", 'data-act="about-check-update"')}
        ${ghostBtn(zh ? "提交Bug" : "Report Bug", 'data-act="about-report-bug"')}
        ${ghostBtn(zh ? "导出日志" : "Export Log", 'data-act="about-log-export"')}
      </div>
      <div class="spx-about-btns">
        ${ghostBtn(zh ? "执行统计" : "Run Stats", 'data-act="about-stat"')}
        ${ghostBtn(zh ? "上传数据" : "Upload Data", 'data-act="about-upload"')}
        ${ghostBtn(zh ? "PLC调试" : "PLC Debug", 'data-act="about-plc-debug"')}
      </div>
      <div class="spx-about-btns">
        ${homeBtn}
        ${ghostBtn(zh ? "ERP厂家" : "ERP Folder", 'data-act="about-erp-factory"')}
      </div>`
      : `${section(zh ? "快捷入口" : "Quick Links")}
      <div class="spx-about-btns">${homeBtn}${logBtn}</div>`;

    return `
      ${section(zh ? "版本信息" : "Version Info")}
      ${testBanner}
      ${kv("Version", version)}
      ${kv("BuildTime", `${buildTime}_${gitInfo}`)}
      ${kv("MachineProject", machineProject)}
      ${kv("MachineSerial", machineSerial)}
      ${kv("ERPFactory", erpFactory)}
      ${kv("InstallDate", installDate)}
      ${notesBlock}
      ${actions}`;
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

  function plcTile(id, label, value, warn) {
    return `<div class="spx-plct-tile${warn ? " warn" : ""}">
      <div class="cap">${label}</div>
      <div class="val" data-plct="${id}">${value}</div>
    </div>`;
  }

  function plcLive(id, label, value) {
    return `<div class="spx-plct-kv"><span class="k">${label}</span><span class="v" data-plct="${id}">${value}</span></div>`;
  }

  function plcParam(id, label, value, unit) {
    return `<label class="spx-plct-param">
      <span class="k">${label}${unit ? ` <em>${unit}</em>` : ""}</span>
      <span class="ctrl">
        <input type="text" inputmode="decimal" id="${id}" class="spx-plct-inp" data-osk="1" value="${value}" />
        <button type="button" class="ghost-btn compact" data-act="plct-apply" data-field="${id}">↵</button>
      </span>
    </label>`;
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

  /** 对齐 CustomUI/PLCTest：系统参数与手动分离；手动走二级弹窗 */
  function buildPlcTest(ctx) {
    const zh = ctx.lang === "zh-CN";
    const isAdmin = !!(ctx.about && ctx.about.isAdmin);
    const st = (ctx.state && ctx.state.plc) || {};
    const s = metricState(ctx.state);
    const connected = !!st.is_connected;
    const len = fmtPlc(st.fabric_length != null ? st.fabric_length : s.lengthM, 2);
    const spd = fmtPlc(st.servo_speed != null ? st.servo_speed : s.speed, 2);
    const alarm = plcAlarmText(st, zh);
    const unwind = fmtPlc(s.unwind, 0) + "%";
    const breadth = st.plc_fabric_width != null ? st.plc_fabric_width : st.fabric_width;
    const labelDone = Number(st.label_finish_stop) !== 0;

    const livePanel = `
      <div class="spx-plct-panel">
        <div class="spx-plct-h">${zh ? "实时状态" : "Live"}</div>
        <div class="spx-plct-live fill">
          ${plcLive("encoder", zh ? "编码器" : "Encoder", fmtPlc(st.encoder, 0))}
          ${plcLive("servo", zh ? "伺服" : "Servo", fmtPlc(st.servo_value, 2))}
          ${plcLive("motor", zh ? "主电机" : "Motor", fmtPlc(st.speed, 2))}
          ${plcLive("encSpd", zh ? "编码速度" : "Enc Spd", fmtPlc(st.servo_speed, 2))}
          ${plcLive("fabTen", zh ? "验布张力" : "Fabric", fmtPlc(st.fabric_tension_pid != null ? st.fabric_tension_pid : st.tension, 2))}
          ${plcLive("rollTen", zh ? "收卷张力" : "Roll", fmtPlc(st.roll_tension, 2))}
          ${plcLive("breadth", zh ? "幅宽" : "Width", fmtPlc(breadth, 2))}
          ${plcLive("wL", zh ? "幅宽左" : "W-L", fmtPlc(st.width_sensor_left, 2))}
          ${plcLive("wR", zh ? "幅宽右" : "W-R", fmtPlc(st.width_sensor_right, 2))}
          ${plcLive("liveW", zh ? "实时重量" : "Live Wt", fmtPlc(st.live_weight, 2))}
          ${plcLive("lastW", zh ? "最终重量" : "Final Wt", fmtPlc(st.last_weight, 2))}
          ${plcLive("xyz", "X/Y/Z", `${fmtPlc(st.current_x, "int")} / ${fmtPlc(st.current_y, "int")} / ${fmtPlc(st.current_z, "int")}`)}
        </div>
      </div>`;

    const paramPanel = `
      <div class="spx-plct-panel">
        <div class="spx-plct-h">${zh ? "参数设定" : "Setpoints"}</div>
        <div class="spx-plct-params fill">
          ${plcParam("plctMotor", zh ? "主电机速度" : "Motor", fmtPlc(st.speed_set, 3), "m/s")}
          ${plcParam("plctFabric", zh ? "验布张力" : "Fabric", fmtPlc(st.fabric_tension_set, 3), "N")}
          ${plcParam("plctRoll", zh ? "收卷张力" : "Roll", fmtPlc(st.roll_tension_set, 3), "N")}
          <label class="spx-plct-check">
            <input type="checkbox" id="plctReverse" data-act="plct-toggle" data-on="SetReverseMode" data-off="SetForwardMode" ${st.shaft_rotation_reverse ? "checked" : ""} />
            <span>${zh ? "反转模式" : "Reverse"}</span>
          </label>
        </div>
      </div>`;

    const labelPanel = `
      <div class="spx-plct-panel">
        <div class="spx-plct-h">${zh ? "贴标调试" : "Labelling"}</div>
        <div class="spx-plct-live compact">
          ${plcLive("lblX", "X", fmtPlc(st.current_x, "int"))}
          ${plcLive("lblY", "Y", fmtPlc(st.current_y, "int"))}
          ${plcLive("lblZ", "Z", fmtPlc(st.current_z, "int"))}
          ${plcLive("lblFin", zh ? "完成" : "Done", labelDone ? (zh ? "是" : "Y") : (zh ? "否" : "N"))}
        </div>
        <div class="spx-plct-params fill">
          ${plcParam("plctHalt", zh ? "停机坐标" : "Halt Y", fmtPlc(st.label_y, "int"), "mm")}
          ${plcParam("plctLblX", zh ? "贴标 X" : "Label X", fmtPlc(st.label_x, "int"), "mm")}
          ${plcParam("plctDrop", zh ? "下降高度" : "Drop H", fmtPlc(st.labelling_descent_height, 3), "mm")}
        </div>
        <div class="spx-plct-row">
          ${plcCmd(zh ? "通知贴标" : "Label", "Labelling", "ok")}
          <button type="button" class="ghost-btn compact" data-act="plct-movex">${zh ? "移动 X" : "Move X"}</button>
          ${plcCmd(zh ? "贴标归零" : "Lbl0", "LabellerZero")}
        </div>
      </div>`;

    const systemPanel = `
      <div class="spx-plct-panel">
        <div class="spx-plct-h">${zh ? "系统参数" : "System"}</div>
        <div class="spx-plct-params dense fill">
          ${plcParam("plctTenCoef", zh ? "张力系数" : "Ten.coef", fmtPlc(st.tension_factor, 3))}
          ${plcParam("plctUnreel", zh ? "进/放卷系数" : "Unreel", fmtPlc(st.roll_unreel_factor, 3))}
          ${plcParam("plctTenDiff", zh ? "叠布速系" : "Stack", fmtPlc(st.differential_tension, 3))}
          ${plcParam("plctRollDiff", zh ? "收/摆差速" : "Diff", fmtPlc(st.differential_roll, 3))}
        </div>
        <div class="spx-plct-sys">
          ${plcCheck("plctBuzzer", zh ? "蜂鸣器" : "Buzzer", "OpenBuzzer", "CloseBuzzer")}
          ${plcCheck("plctShield", zh ? "屏蔽无布检测" : "Shield", "OpenShieldDetection", "CloseShieldDetection")}
        </div>
        <div class="spx-plct-row">
          <button type="button" class="ghost-btn compact ok" data-act="plct-manual-open">${zh ? "手动功能…" : "Manual…"}</button>
        </div>
      </div>`;

    const manualSub = isAdmin
      ? `<div class="spx-plct-sub" id="popPlcManual" hidden>
          <div class="spx-plct-sub-mask" data-act="plct-manual-close"></div>
          <div class="spx-plct-sub-card" role="dialog" aria-label="${zh ? "手动功能" : "Manual"}">
            <div class="spx-plct-sub-head">
              <span>${zh ? "手动功能" : "Manual"}</span>
              <button type="button" class="ghost-btn compact" data-act="plct-manual-close">×</button>
            </div>
            <div class="spx-plct-sub-body">
              <div class="spx-plct-sys">
                ${plcCheck("plctManual", zh ? "启动手动模式" : "Enable manual", "OpenEnableManual", "CloseEnableManual")}
              </div>
              <p class="spx-plct-manual-hint" id="popPlcManualHint">${zh ? "开启手动模式后，下方功能才可操作" : "Enable manual mode to use controls below"}</p>
              <div class="spx-plct-manual-ops is-disabled" id="popPlcManualOps" aria-disabled="true">
                <div class="spx-plct-sys">
                  ${plcCheck("plctDc", zh ? "直流分边" : "DC edge", "OpenDCMotor", "CloseDCMotor")}
                  ${plcCheck("plctWind", zh ? "卷标电机" : "Winding", "OpenWindingMotor", "CloseWindingMotor")}
                  ${plcCheck("plctVac", zh ? "真空阀" : "Vacuum", "OpenVacuumValve", "CloseVacuumValve")}
                  ${plcCheck("plctAir", zh ? "气缸" : "Cylinder", "OpenAirCylinder", "CloseAirCylinder")}
                </div>
                <div class="spx-plct-h">${zh ? "主电机" : "Main motor"}</div>
                <div class="spx-plct-row">
                  ${plcCmd(zh ? "前进" : "Fwd", "MainMotoradvance")}
                  ${plcCmd(zh ? "后退" : "Back", "MainMotorBack")}
                  ${plcCmd(zh ? "停止" : "Stop", "MainMotorStop", "danger")}
                </div>
                <div class="spx-plct-h">${zh ? "贴标 X / Z（按住）" : "Label X/Z (hold)"}</div>
                <div class="spx-plct-row">
                  ${plcHold(zh ? "X左" : "X←", "XLeftMove")}
                  ${plcHold(zh ? "X右" : "X→", "XRightMove")}
                  ${plcHold(zh ? "X停" : "X■", "XStop")}
                  ${plcHold(zh ? "X原点" : "X0", "XBack")}
                </div>
                <div class="spx-plct-row">
                  ${plcHold(zh ? "Z上" : "Z↑", "ZUp")}
                  ${plcHold(zh ? "Z下" : "Z↓", "ZDown")}
                  ${plcHold(zh ? "Z停" : "Z■", "ZStop")}
                  ${plcHold(zh ? "Z原点" : "Z0", "ZBack")}
                </div>
              </div>
            </div>
          </div>
        </div>`
      : "";

    const cmds = isAdmin
      ? `<div class="spx-plct-cmds">
          ${plcCmd(zh ? "启动" : "Start", "Start", "ok")}
          ${plcCmd(zh ? "停止" : "Stop", "Stop", "danger")}
          ${plcCmd(zh ? "复位" : "Reset", "Reset")}
          ${plcCmd(zh ? "归零" : "Zero", "Zero")}
          ${plcCmd(zh ? "急停" : "E-Stop", "EmergencyStop", "danger")}
          ${plcCmd(zh ? "编码器归零" : "Enc0", "EncoderReset")}
          <button type="button" class="ghost-btn compact" data-act="plct-manual-open">${zh ? "手动…" : "Manual…"}</button>
        </div>`
      : "";

    // 管理员：状态/参数/贴标/系统参数；手动走二级弹窗
    const body = isAdmin
      ? `<div class="spx-plct-body admin">${livePanel}${paramPanel}${labelPanel}${systemPanel}</div>`
      : `<div class="spx-plct-body user">${livePanel}${paramPanel}</div>`;

    return `
      <div class="spx-plctest${isAdmin ? " admin" : " user"}" id="popPlcTest">
        <div class="spx-plct-tiles">
          ${plcTile("length", zh ? "码长" : "Len", len)}
          ${plcTile("speed", zh ? "速度" : "Spd", spd)}
          ${plcTile("connect", zh ? "连接" : "Link", connected ? (zh ? "已连" : "ON") : (zh ? "未连" : "OFF"), !connected)}
          ${plcTile("alarm", zh ? "报警" : "Alm", alarm, alarm !== (zh ? "无报警" : "OK"))}
          ${plcTile("unwind", zh ? "放卷" : "Unw", unwind)}
        </div>
        ${cmds}
        ${body}
        <div class="spx-plct-msg muted" id="popPlcTestMsg">${
          isAdmin
            ? (zh ? "参数 ↵ 写入 · 手动点「手动…」打开" : "↵ write · Manual opens sub-dialog")
            : (zh ? "参数点 ↵ 写入；状态自动刷新" : "↵ writes · status auto-refresh")
        }</div>
        ${manualSub}
      </div>`;
  }

  function buildCamera(ctx) {
    const zh = ctx.lang === "zh-CN";
    const cams = Array.isArray(ctx.state && ctx.state.cameras) ? ctx.state.cameras : [];
    const meta = cams.length
      ? cams.map((c) => `${c.name || c.type || "cam"}`).join(" · ")
      : "—";
    const frames = ctx.state && ctx.state.camFrames != null ? ctx.state.camFrames : "—";
    return `
      ${section(zh ? "相机预览" : "Camera Preview")}
      <div class="spx-cam-preview" id="popCamPreview">
        <div class="spx-cam-meta">${meta} · frames ${frames}</div>
      </div>
      <div class="spx-actions">
        ${ghostBtn(zh ? "刷新图像" : "Refresh", 'data-act="cam-refresh"')}
        ${ghostBtn(zh ? "自动刷新" : "Auto", 'data-act="cam-auto"')}
      </div>
      ${section(zh ? "参数" : "Params")}
      ${field(zh ? "曝光" : "Exposure", `<input id="popCamExp" type="number" min="10" max="20000" value="1200" />`)}
      ${field(zh ? "增益" : "Gain", `<input id="popCamGain" type="number" min="0" max="24" step="0.1" value="1.5" />`)}
      <label class="spx-check"><input type="checkbox" checked /> ${zh ? "显示像素信息" : "Show pixel info"}</label>
      <div class="spx-actions">${ghostBtn(zh ? "保存" : "Save", 'data-act="cam-save"')}</div>`;
  }

  function buildLight(ctx) {
    const zh = ctx.lang === "zh-CN";
    const fromApi = Array.isArray(ctx.state && ctx.state.lights) ? ctx.state.lights : [];
    const lights = fromApi.length
      ? fromApi
      : [
          { id: 1, name: zh ? "前灯" : "Front", v: Number(ctx.state && ctx.state.lightBrightness) || 180 },
          { id: 2, name: zh ? "后灯" : "Back", v: 160 },
          { id: 3, name: zh ? "侧灯 A" : "Side A", v: 140 },
          { id: 4, name: zh ? "侧灯 B" : "Side B", v: 140 },
        ];
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
    return `
      ${section(zh ? "亮度控制" : "Brightness")}
      <div class="spx-light-grid">
        ${lights
          .map(
            (L, i) => `
          <div class="spx-light-card${i === 0 ? " active" : ""}" data-light="${L.id}">
            <div class="spx-k">${L.name}</div>
            <input type="range" min="0" max="255" value="${L.v}" data-act="light-slider" data-id="${L.id}" />
            <div class="spx-v" data-light-val="${L.id}">${L.v}</div>
          </div>`
          )
          .join("")}
      </div>
      ${section(zh ? "布色推荐亮度" : "Cloth Color Presets")}
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
      <div class="spx-actions">${ghostBtn(zh ? "应用" : "Apply", 'data-act="light-apply"')}</div>`;
  }

  function buildAlarm(ctx) {
    const zh = ctx.lang === "zh-CN";
    const list = Array.isArray(ctx.state.alarmList) ? ctx.state.alarmList : [];
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    let rows;
    if (list.length) {
      rows = list.map((a) => [
        (a.time || ts).toString().replace("T", " ").slice(0, 19),
        a.code || a.title || "-",
        a.msg || a.message || "-",
      ]);
    } else if (ctx.state.alarm > 0) {
      rows = Array.from({ length: ctx.state.alarm }, (_, i) => [
        ts,
        `E${100 + i}`,
        ctx.state.alarmMsg || (zh ? "演示报警" : "Demo alarm"),
      ]);
    } else {
      rows = [["-", "-", zh ? "当前无报警" : "No alarms"]];
    }
    const live = ctx.state.alarmMsg
      ? `<p class="spx-msg">${zh ? "当前" : "Now"}：${ctx.state.alarmMsg}</p>`
      : "";
    return `
      ${section(zh ? "报警列表" : "Alarms")}
      ${live}
      <table class="spx-table">
        <thead><tr><th>${zh ? "时间" : "Time"}</th><th>${zh ? "代码" : "Code"}</th><th>${zh ? "信息" : "Message"}</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
        </tbody>
      </table>
      <div class="spx-actions">${ghostBtn(zh ? "清除" : "Clear", 'data-act="alarm-clear"')}</div>`;
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

  /** 与 preview/spacex-main.html state 字段对齐（兼容 embed/API 别名） */
  function metricState(s) {
    s = s || {};
    return {
      lengthM: num(s.lengthM, 0),
      targetM: num(s.targetM != null ? s.targetM : s.targetLengthM, 0),
      widthCm: num(s.widthCm, 0),
      speed: num(s.speed, 0),
      colorDiff: num(s.colorDiff, 0),
      tension: num(s.tension, 0),
      unwind: num(s.unwind != null ? s.unwind : s.unwindPercent, 0),
      cpu: num(s.cpu != null ? s.cpu : s.cpuPercent, 0),
      gpu: num(s.gpu != null ? s.gpu : s.gpuPercent, 0),
      cpuTemp: num(s.cpuTemp != null ? s.cpuTemp : s.cpuTempC, -1),
      gpuTemp: num(s.gpuTemp != null ? s.gpuTemp : s.gpuTempC, -1),
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

    const specs = {
      length: {
        xKey: "t",
        yKey: "lengthM",
        digits: 1,
        unit: "m",
        current: `${s.lengthM.toFixed(1)} / ${s.targetM.toFixed(1)} m`,
        currentLabel: zh ? "当前码长" : "Current",
        title: zh ? "时间 — 码长 序列" : "Time — Length",
        xLabel: zh ? "时间(s)" : "Time(s)",
        yLabel: zh ? "码长(m)" : "Length(m)",
        fmtX: null,
        fmtY: (v) => v.toFixed(1),
      },
      width: {
        xKey: "lengthM",
        yKey: "widthCm",
        digits: 1,
        unit: "cm",
        current: `${s.widthCm.toFixed(1)} cm`,
        currentLabel: zh ? "当前幅宽" : "Current",
        title: zh ? "码长 — 幅宽 序列" : "Length — Width",
        xLabel: zh ? "码长(m)" : "Length(m)",
        yLabel: zh ? "幅宽(cm)" : "Width(cm)",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      speed: {
        xKey: "lengthM",
        yKey: "speed",
        digits: 1,
        unit: "m/min",
        current: `${s.speed.toFixed(1)} m/min`,
        currentLabel: zh ? "当前速度" : "Current",
        title: zh ? "码长 — 速度 序列" : "Length — Speed",
        xLabel: zh ? "码长(m)" : "Length(m)",
        yLabel: zh ? "速度(m/min)" : "Speed(m/min)",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      colorDiff: {
        xKey: "lengthM",
        yKey: "colorDiff",
        digits: 2,
        unit: "",
        current: s.colorDiff.toFixed(2),
        currentLabel: zh ? "当前色差" : "Current ΔE",
        title: zh ? "码长 — 色差 序列" : "Length — ΔE",
        xLabel: zh ? "码长(m)" : "Length(m)",
        yLabel: "ΔE",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(2),
      },
      tension: {
        xKey: "lengthM",
        yKey: "tension",
        digits: 1,
        unit: "",
        current: s.tension.toFixed(1),
        currentLabel: zh ? "当前张力" : "Current",
        title: zh ? "码长 — 张力 序列" : "Length — Tension",
        xLabel: zh ? "码长(m)" : "Length(m)",
        yLabel: zh ? "张力" : "Tension",
        fmtX: (v) => v.toFixed(1),
        fmtY: (v) => v.toFixed(1),
      },
      weight: {
        xKey: "lengthM",
        yKey: "weightKg",
        digits: 1,
        unit: "kg",
        current: `${Number(s.weightKg || 0).toFixed(1)} kg`,
        currentLabel: zh ? "当前重量" : "Current",
        title: zh ? "码长 — 重量 序列" : "Length — Weight",
        xLabel: zh ? "码长(m)" : "Length(m)",
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

    const pts = seriesPoints(hist, spec.xKey, spec.yKey);
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
                    <td>${Number(r.lengthM).toFixed(1)} m</td>
                  </tr>`
                : `<tr><td>${i + 1}</td><td colspan="4" style="color:rgba(240,240,250,0.35)">—</td></tr>`
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
    const seen = {};
    return merged
      .map((g) => ({
        id: g.id,
        titleZh: g.titleZh,
        titleEn: g.titleEn,
        i18nKey: g.i18nKey,
        items: (g.items || []).filter((it) => {
          const key = String(it.key || "");
          if (!key || key.charAt(0) === "_") return true;
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

  function buildSettingsPane(group, zh, active) {
    let lastSec = "";
    const rows = (group.items || [])
      .map((it) => {
        const secName = zh ? it.sectionZh || "" : it.sectionEn || "";
        const head =
          secName && secName !== lastSec
            ? ((lastSec = secName), `<div class="spx-settings-sec">${secName}</div>`)
            : "";
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
    const catalog = settingsGroups(ctx);
    const prefer = ctx.settingsTabId || "";
    const activeId =
      prefer && catalog.some((g) => g.id === prefer)
        ? prefer
        : catalog[0]
          ? catalog[0].id
          : "";
    const tabs = catalog
      .map(
        (g) =>
          `<button type="button" class="${g.id === activeId ? "active" : ""}" data-act="settings-tab" data-tab="${g.id}">${
            zh ? g.titleZh : g.titleEn
          }</button>`
      )
      .join("");
    const panes = catalog.map((g) => buildSettingsPane(g, zh, g.id === activeId)).join("");
    const hint = ctx.settingsLoaded
      ? zh
        ? "已读取高级设置，保存写回 /settings/advanced/set"
        : "Loaded from advanced settings"
      : zh
        ? "未读到后端参数，当前为目录默认值"
        : "Backend values unavailable; showing catalog defaults";
    return `
      <div class="spx-settings">
        <aside class="spx-tabs" id="popSettingsTabs">${tabs}</aside>
        <div class="spx-tab-body">
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
    const result = fp.isNg ? "NG" : "OK";
    const resultCls = fp.isNg ? "bad" : "ok";
    return `
      <div class="spx-fp-panel">
        <div class="spx-fp-summary">
          <div class="spx-fp-result ${resultCls}">${result}</div>
          <div class="spx-fp-kpis">
            ${kv(zh ? "总扣分" : "Total", String(fp.total))}
            ${kv(zh ? "百平方码扣分" : "/100 yd²", Number(fp.per100Sq).toFixed(2))}
            ${kv(zh ? "百码扣分" : "/100 yd", Number(fp.per100).toFixed(2))}
            ${kv(zh ? "合格线" : "Threshold", String(fp.threshold))}
          </div>
        </div>
        ${section(zh ? "I–IV 级别数量" : "Grade Counts I–IV")}
        <div class="spx-fp-grades">
          <div class="spx-fp-grade"><span class="spx-k">I</span><span class="spx-v">${c.I || 0}</span><span class="spx-k">×1</span></div>
          <div class="spx-fp-grade"><span class="spx-k">II</span><span class="spx-v">${c.II || 0}</span><span class="spx-k">×2</span></div>
          <div class="spx-fp-grade"><span class="spx-k">III</span><span class="spx-v">${c.III || 0}</span><span class="spx-k">×3</span></div>
          <div class="spx-fp-grade"><span class="spx-k">IV</span><span class="spx-v">${c.IV || 0}</span><span class="spx-k">×4</span></div>
        </div>
        ${section(zh ? "扣分详情" : "Deduction Detail")}
        <div class="spx-defect-scroll">
          <table class="spx-table spx-fp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>${zh ? "疵点" : "Defect"}</th>
                <th>${zh ? "级别" : "Grade"}</th>
                <th>${zh ? "扣分" : "Pts"}</th>
                <th>Y (m)</th>
              </tr>
            </thead>
            <tbody>
              ${(fp.rows || [])
                .map(
                  (r) => `<tr>
                  <td class="mono">${r.id}</td>
                  <td>${r.title}</td>
                  <td>${r.grade}</td>
                  <td class="spx-v">${r.points}</td>
                  <td class="mono">${Number(r.y).toFixed(1)}</td>
                </tr>`
                )
                .join("") ||
                `<tr><td colspan="5" class="spx-msg">${zh ? "暂无疵点" : "No defects"}</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /** DetectionRecords.cpp / DetectionRecords_ui.h — 筛选栏 + 表格 + 底部分页 */
  function buildRecords(ctx) {
    const zh = ctx.lang === "zh-CN";
    const rec = (ctx.state && ctx.state.recordsUi) || {};
    const filter = rec.filter != null ? Number(rec.filter) : 0; // 0全部 1已检 2未检
    const queryType = rec.queryType != null ? Number(rec.queryType) : 0;
    const queryValue = rec.queryValue != null ? String(rec.queryValue) : "";
    const page = Math.max(1, Number(rec.page) || 1);
    const pageSize = 14;
    const totalLen = Number(rec.totalLengthM != null ? rec.totalLengthM : (ctx.state && ctx.state.todayM) || 1260);

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

    const bodyRows = pageRows
      .map((r) => {
        const status = r.finished
          ? `<span class="spx-rec-status ok">${zh ? "已检验" : "Done"}</span>`
          : `<span class="spx-rec-status warn">${zh ? "未检验" : "Open"}</span>`;
        const actionLabel = r.finished
          ? (zh ? "查看报告" : "Report")
          : (zh ? "检验此单" : "Inspect");
        return `<tr data-rec-id="${r.id}">
          <td class="mono">${r.id}</td>
          <td>${status}</td>
          <td><button type="button" class="ghost-btn compact" data-act="rec-order" data-id="${r.id}" data-finished="${r.finished ? 1 : 0}">${actionLabel}</button></td>
          <td><button type="button" class="ghost-btn compact mono" data-act="rec-checkid" data-id="${r.id}">${r.checkId}</button></td>
          <td><button type="button" class="ghost-btn compact" data-act="rec-print" data-id="${r.id}">${zh ? "打印" : "Print"}</button></td>
          <td>${r.lot}</td>
          <td>${r.roll}</td>
          <td>${r.style}</td>
          <td>${r.color}</td>
          <td>${r.fabric}</td>
          <td class="mono">${Number(r.lengthM).toFixed(1)}</td>
          <td class="mono">${r.createDate}</td>
          <td>${r.inspector || "—"}</td>
          <td>${r.conclusion || "—"}</td>
        </tr>`;
      })
      .join("") ||
      `<tr><td colspan="14" class="spx-muted">${zh ? "无匹配记录" : "No matching records"}</td></tr>`;

    return `
      <div class="spx-records">
        <div class="spx-records-toolbar">
          <div class="spx-records-tabs">
            ${tab(0, zh ? "全部检验单" : "All")}
            ${tab(1, zh ? "已检验" : "Finished")}
            ${tab(2, zh ? "未检验" : "Unfinished")}
            <button type="button" class="ghost-btn compact" data-act="rec-export">${zh ? "导出数据" : "Export"}</button>
            <button type="button" class="ghost-btn compact" data-act="rec-total-len">${zh ? "检验长度" : "Length"} ${totalLen.toFixed(0)} m</button>
          </div>
          <div class="spx-records-query">
            <select id="popRecQueryType" class="spx-records-filter" aria-label="${zh ? "过滤项目" : "Filter"}">${queryOpts}</select>
            <input id="popRecQueryValue" type="text" value="${queryValue}" placeholder="${zh ? "查询内容" : "Query"}" data-osk="1" ${showValue ? "" : "hidden"} />
            <input id="popRecDate" type="date" value="${rec.queryDate || "2026-11-19"}" ${showDate ? "" : "hidden"} />
            <input id="popRecDate2" type="date" value="${rec.queryDate2 || "2026-11-20"}" ${showDate2 ? "" : "hidden"} />
            <button type="button" class="ghost-btn compact" data-act="rec-search" title="${zh ? "搜索" : "Search"}">⌕</button>
          </div>
        </div>
        <div class="spx-records-table-wrap">
          <table class="spx-table spx-records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>${zh ? "状态" : "Status"}</th>
                <th>${zh ? "查看报告" : "Report"}</th>
                <th>${zh ? "检验单号" : "Check ID"}</th>
                <th>${zh ? "打印" : "Print"}</th>
                <th>${zh ? "缸号" : "Lot"}</th>
                <th>${zh ? "匹号" : "Roll"}</th>
                <th>${zh ? "款号" : "Style"}</th>
                <th>${zh ? "颜色" : "Color"}</th>
                <th>${zh ? "布料名称" : "Fabric"}</th>
                <th>${zh ? "长度" : "Length"}</th>
                <th>${zh ? "创建日期" : "Created"}</th>
                <th>${zh ? "检验员" : "Inspector"}</th>
                <th>${zh ? "结果" : "Result"}</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
        <div class="spx-records-pager">
          <div class="spx-records-pager-meta mono">
            <span>${zh ? "共" : ""} <b id="popRecPages">${pages}</b> ${zh ? "页" : "pages"}</span>
            <span class="spx-records-sep"></span>
            <span>${zh ? "共" : ""} <b id="popRecTotal">${total}</b> ${zh ? "记录" : "records"}</span>
          </div>
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
        </div>
      </div>`;
  }

  function defaultRecordRows(zh) {
    const fabric = "Twill 280GSM";
    const inspector = zh ? "操作员" : "Operator";
    return Array.from({ length: 28 }, (_, i) => {
      const finished = i % 3 !== 2;
      const day = String(19 - (i % 10)).padStart(2, "0");
      return {
        id: 1200 - i,
        finished,
        checkId: `CK-202611${day}-${String(17 - (i % 17)).padStart(2, "0")}`,
        lot: `L-884${21 + (i % 5)}`,
        roll: `R-${17 - (i % 12)}`,
        style: `ST-${100 + (i % 7)}`,
        color: ["Navy", "Black", "Ivory", "Grey"][i % 4],
        fabric,
        lengthM: 88 + (i % 9) * 2.5,
        createDate: `2026-11-${day}`,
        inspector,
        conclusion: finished ? (i % 5 === 0 ? "NG" : "OK") : "",
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
    return `
      <div class="spx-def-step" data-step-id="${id}" data-min="0" data-max="9999" data-step="1">
        <button type="button" class="mini-btn" data-act="def-step" data-target="${id}" data-delta="-1">−</button>
        <input id="${id}" class="spx-def-val" type="number" min="0" max="9999" step="1" value="${value}" inputmode="numeric" />
        <button type="button" class="mini-btn" data-act="def-step" data-target="${id}" data-delta="1">+</button>
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
    const defs = Array.isArray(ui.defects) && ui.defects.length ? ui.defects : demoDefs;
    const cloths = Array.isArray(ui.cloths) && ui.cloths.length
      ? ui.cloths
      : [
          { id: "demo1", name: "Twill 280GSM" },
          { id: "demo2", name: "Plain 200GSM" },
          { id: "demo3", name: "Denim 12oz" },
        ];
    const clothId = ui.clothId != null ? String(ui.clothId) : String(cloths[0].id);
    const clothOpts = cloths
      .map((c) => {
        const id = String(c.id);
        const name = c.name === "__default__" ? (zh ? "默认方案" : "Default") : c.name;
        return `<option value="${escapeAttr(id)}" ${id === clothId ? "selected" : ""}>${escapeAttr(name)}</option>`;
      })
      .join("");
    const emptyRow = !defs.length
      ? `<tr><td colspan="9" class="spx-muted">${zh ? "暂无疵点参数" : "No defect settings"}</td></tr>`
      : "";
    const loadingHint = ui.loaded === false
      ? `<div class="spx-muted" style="padding:8px 4px;">${zh ? "正在加载后台参数…" : "Loading…"}</div>`
      : "";
    return `
      <div class="spx-defect-panel">
        <div class="spx-toolbar">
          <label class="spx-field inline">
            <span class="spx-k">${zh ? "布种" : "Cloth"}</span>
            <select id="popDefectCloth" data-act="defect-settings-cloth">${clothOpts}</select>
          </label>
          <div class="spx-toolbar-actions">
            ${ghostBtn(zh ? "保存" : "Save", 'data-act="defect-settings-save"')}
            ${ghostBtn(zh ? "刷新" : "Refresh", 'data-act="defect-settings-refresh"')}
          </div>
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
      </div>`;
  }

  function buildFinish(ctx) {
    const zh = ctx.lang === "zh-CN";
    return `
      <div class="spx-info">
        <div class="spx-info-icon" aria-hidden="true">!</div>
        <p class="spx-msg">${
          zh
            ? `确认结束当前检验单 ${ctx.sheet.checkId}？已验 ${ctx.state.lengthM.toFixed(1)} m。`
            : `Finish sheet ${ctx.sheet.checkId}? Inspected ${ctx.state.lengthM.toFixed(1)} m.`
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
    return list.find((d) => d.id === id) || null;
  }

  function gradeOptions(selected) {
    return ["I", "II", "III", "IV"]
      .map((g) => `<option value="${g}" ${g === selected ? "selected" : ""}>${g}</option>`)
      .join("");
  }

  function buildDefectDetail(ctx) {
    const zh = ctx.lang === "zh-CN";
    const d = selectedDefect(ctx);
    if (!d) {
      return `
        ${section(zh ? "疵点详情" : "Detail")}
        <p class="spx-msg">${zh ? "未选择疵点" : "No defect selected"}</p>
        <div class="spx-actions">
          ${ghostBtn(zh ? "关闭" : "Close", 'data-act="close"')}
        </div>`;
    }
    const pts = ({ I: 1, II: 2, III: 3, IV: 4 })[d.grade] || 0;
    return `
      ${section(zh ? "预览" : "Preview")}
      <div class="spx-defect-thumb">${zh ? "疵点图像" : "Defect Image"}</div>
      ${section(zh ? "信息" : "Info")}
      ${kv(zh ? "编号" : "ID", String(d.id))}
      ${kv(zh ? "类型" : "Type", d.title)}
      ${kv(zh ? "等级" : "Grade", `${d.grade}  ·  ${pts}${zh ? " 分" : " pts"}`)}
      ${kv("Y", `${Number(d.y).toFixed(2)} m`)}
      ${kv("X", `${(Number(d.x) * 100).toFixed(1)} %`)}
      <div class="spx-actions split">
        ${ghostBtn(zh ? "编辑" : "Edit", 'data-act="defect-detail-edit"')}
        ${ghostBtn(zh ? "关闭" : "Close", 'data-act="close"')}
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

  /** DefectAidedSelection.h — 辅助选择：主图+标尺+卡片流+右侧操作 */
  function buildDefectAidedSelection(ctx) {
    const zh = ctx.lang === "zh-CN";
    const cards = (ctx.aidedDefects && ctx.aidedDefects.length)
      ? ctx.aidedDefects
      : [
          { id: 1, title: zh ? "断经" : "Broken warp", x: 182, y: 1240, recommend: true, selected: true, grade: "II" },
          { id: 2, title: zh ? "油污" : "Oil stain", x: 640, y: 1180, recommend: true, selected: true, grade: "I" },
          { id: 3, title: zh ? "破洞" : "Hole", x: 910, y: 1310, recommend: false, selected: false, grade: "III" },
          { id: 4, title: zh ? "纬斜" : "Skew", x: 420, y: 1260, recommend: true, selected: true, grade: "II" },
          { id: 5, title: zh ? "色斑" : "Color spot", x: 1050, y: 1205, recommend: false, selected: false, grade: "I" },
          { id: 6, title: zh ? "粗节" : "Slub", x: 260, y: 1340, recommend: true, selected: true, grade: "II" },
        ];
    const total = cards.length;
    const selected = cards.filter((c) => c.selected).length;
    const page = 1;
    const pages = 1;
    const marks = cards.map((c) => {
      const left = Math.min(96, Math.max(4, (c.x / 1200) * 100));
      const cls = c.selected ? "on" : "off";
      return `<span class="spx-aided-mark ${cls}" style="left:${left}%" title="${c.title}"></span>`;
    }).join("");
    const cardsHtml = cards.map((c) => {
      const sel = c.selected ? "selected" : "ignored";
      const badge = c.recommend
        ? `<span class="spx-aided-badge">${zh ? "推荐" : "Rec"}</span>`
        : "";
      return `
        <article class="spx-aided-card ${sel}" data-aided-id="${c.id}">
          <div class="spx-aided-thumb">${zh ? "局部图" : "Crop"}</div>
          <div class="spx-aided-body">
            <div class="spx-aided-row">
              <button type="button" class="ghost-btn compact" data-act="aided-type" data-id="${c.id}">${c.title}</button>
              ${badge}
            </div>
            <div class="spx-aided-coord">X ${c.x} · Y ${c.y} · ${c.grade}</div>
            <div class="spx-aided-ops">
              <button type="button" class="mini-btn ok" data-act="aided-select" data-id="${c.id}">${zh ? "选中" : "Select"}</button>
              <button type="button" class="mini-btn danger" data-act="aided-ignore" data-id="${c.id}">${zh ? "忽略" : "Ignore"}</button>
            </div>
          </div>
        </article>`;
    }).join("");
    return `
      <div class="spx-aided">
        <div class="spx-aided-preview">
          <div class="spx-aided-main">${marks}<span class="spx-aided-main-hint">${zh ? "停机主图预览" : "Stop frame"}</span></div>
          <div class="spx-aided-ruler"><span>0</span><span>300</span><span>600</span><span>900</span><span>1200 mm</span></div>
        </div>
        <div class="spx-aided-mainrow">
          <div class="spx-aided-cards" id="spxAidedCards">${cardsHtml}</div>
          <aside class="spx-aided-side">
            <button type="button" class="run-btn running spx-aided-confirm" data-act="aided-confirm">${zh ? "继续" : "Continue"}</button>
            <button type="button" class="ghost-btn" data-act="aided-select-all">${zh ? "全部选中" : "Select All"}</button>
            <button type="button" class="ghost-btn" data-act="aided-ignore-all">${zh ? "全部忽略" : "Ignore All"}</button>
            <button type="button" class="ghost-btn" data-act="aided-ignore-other">${zh ? "忽略其他" : "Ignore Other"}</button>
            <div class="spx-aided-info">
              <div class="spx-section">${zh ? "当前疵点信息" : "Batch Info"}</div>
              ${kv(zh ? "共有缺陷" : "Defects", `${total} ${zh ? "个" : ""}`)}
              ${kv(zh ? "已选中" : "Selected", `${selected}`)}
              ${kv(zh ? "共有页面" : "Pages", `${pages} ${zh ? "页" : ""}`)}
              ${kv(zh ? "当前页面" : "Page", `${page}`)}
            </div>
            <div class="spx-aided-nav">
              <button type="button" class="ghost-btn compact" data-act="aided-prev">${zh ? "上一页" : "Prev"}</button>
              <button type="button" class="ghost-btn compact" data-act="aided-next">${zh ? "下一页" : "Next"}</button>
            </div>
          </aside>
        </div>
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
    const labelModal = !!st.artificalLabelModal;
    const labelFilter = st.artificalLabelFilter || "";
    const confirmKind = st.artificalConfirm || null; // finish | clear | delete
    const confirmId = st.artificalConfirmId;
    const groups = (ctx.artificalLabelGroups && ctx.artificalLabelGroups.length)
      ? ctx.artificalLabelGroups
      : defaultArtificalLabelGroups(zh);

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

    const filterChips = [`<button type="button" class="spx-art-chip ${!labelFilter ? "active" : ""}" data-act="art-label-filter" data-group="">${zh ? "全部" : "All"}</button>`]
      .concat(groups.map((g) =>
        `<button type="button" class="spx-art-chip ${labelFilter === g.group ? "active" : ""}" data-act="art-label-filter" data-group="${g.group}">${g.group}</button>`
      )).join("");

    const visibleGroups = labelFilter ? groups.filter((g) => g.group === labelFilter) : groups;
    const labelCards = visibleGroups.map((g) => {
      const items = (g.items || []).map((it) => {
        const name = typeof it === "string" ? it : (it.name || "");
        const code = typeof it === "string" ? "" : (it.code || "");
        const selected = sel && sel.label === name ? "selected" : "";
        return `<button type="button" class="spx-art-type ${selected}" data-act="art-label" data-label="${name}">
          <span class="spx-art-type-thumb is-empty"></span>
          <span class="spx-art-type-meta">
            ${code ? `<span class="spx-art-type-code">${code}</span>` : ""}
            <span class="spx-art-type-name">${name}</span>
          </span>
        </button>`;
      }).join("");
      return `<div class="spx-art-type-group">
        <div class="spx-art-type-group-title">${g.group}<span class="spx-art-type-count">${(g.items || []).length}</span></div>
        <div class="spx-art-type-grid">${items}</div>
      </div>`;
    }).join("");

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

    const labelModalHtml = `
      <div class="spx-art-modal ${labelModal ? "active" : ""}" id="spxArtLabelModal">
        <div class="spx-art-modal-card wide">
          <div class="spx-art-modal-head">
            <span>${zh ? "请选择标签" : "Select Label"}</span>
            <button type="button" class="spx-art-modal-x" data-act="art-label-close">&times;</button>
          </div>
          <div class="spx-art-filter">${filterChips}</div>
          <div class="spx-art-type-wrap">${labelCards}</div>
        </div>
      </div>`;

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
              <button type="button" class="ghost-btn" data-act="art-label-open" ${sel ? "" : "disabled"}>${labelBtnText}</button>
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

    const typeOpts = editDefectTypeOptions(ctx, sel ? sel.title : "", sel ? sel.defectID : "");
    const gradeOpts = gradeOptions(sel ? sel.grade : "I");
    const xVal = sel ? Number(sel.xMm).toFixed(1) : "";
    const yVal = sel ? Number(sel.yMm).toFixed(1) : "";
    const lenVal = sel ? Number(sel.lengthMm).toFixed(1) : "";
    const widVal = sel ? Number(sel.widthMm).toFixed(1) : "";
    const areaVal = sel ? Number(sel.areaMm2).toFixed(1) : "";
    const descVal = sel ? (sel.desc || "") : "";
    const previewHtml = sel
      ? (sel.localImgBase64
        ? `<img src="data:image/png;base64,${sel.localImgBase64}" alt="" style="max-width:100%;max-height:100%;object-fit:contain" />`
        : (zh ? "ROI 预览" : "Preview"))
      : (zh ? "暂无预览" : "No preview");

    let confirmHtml = "";
    if (confirmKind) {
      const titles = {
        delete: zh ? "删除确认" : "Confirm Delete",
        finish: zh ? "完成确认" : "Confirm Finish",
      };
      const msgs = {
        delete: zh ? "确定要删除此疵点吗？" : "Delete this defect?",
        finish: zh ? "完成编辑并关闭？" : "Finish editing and close?",
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
            <select id="spxEditType" data-osk="0" ${sel ? "" : "disabled"}>${typeOpts}</select>
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

  function debugToolTabs(zh) {
    // 设备硬件调试：嵌入 PublicServer views，hideNavbar=1 去掉调试顶栏
    return [
      { id: "plc", label: zh ? "PLC" : "PLC", path: "/newviews/plctool" },
      { id: "camera", label: zh ? "相机" : "Camera", path: "/views/debugcamera" },
      { id: "light", label: zh ? "光源" : "Light", path: "/views/debuglight" },
      { id: "printer", label: zh ? "打印机" : "Printer", path: "/views/debugprinter" },
      { id: "color", label: zh ? "色差" : "Color", path: "/views/debugcolordiff" },
      { id: "devices", label: zh ? "设备" : "Devices", path: "/views/debugdevices" },
      { id: "alarms", label: zh ? "报警" : "Alarms", path: "/views/debugalarms" },
      { id: "touchpad", label: zh ? "触摸板" : "Touchpad", path: "/views/debugtouchpad" },
      { id: "label", label: zh ? "贴标" : "Label", path: "/views/debugticket" },
    ];
  }

  function debugToolUrl(path, lang) {
    const q = "hideNavbar=1&lang=" + encodeURIComponent(lang || "zh-CN");
    const base = (global.SpxApi && global.SpxApi.base) || "";
    return base + path + (path.indexOf("?") >= 0 ? "&" : "?") + q;
  }

  function buildDebug(ctx) {
    const zh = ctx.lang === "zh-CN";
    const tabs = debugToolTabs(zh);
    const active = (ctx.debugTabId && tabs.some((t) => t.id === ctx.debugTabId))
      ? ctx.debugTabId
      : tabs[0].id;
    const tabBtns = tabs
      .map(
        (t) =>
          `<button type="button" class="ghost-btn compact ${t.id === active ? "active" : ""}" data-act="debug-tab" data-tab="${t.id}" data-src="${debugToolUrl(t.path, ctx.lang)}">${t.label}</button>`
      )
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
        <div class="spx-debug-tabs" id="popDebugTabs">${tabBtns}</div>
        <div class="spx-debug-frames" id="popDebugFrames">${panes}</div>
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
      case "unwind":
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
    const map = (arr) => arr.map((c) => (up ? c.toUpperCase() : c.toLowerCase()));
    return [
      [...map(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]), "back"],
      map(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]),
      map(["a", "s", "d", "f", "g", "h", "j", "k", "l"]),
      ["caps", "shift", ...map(["z", "x", "c", "v", "b", "n", "m"]), "clear"],
      ["tab", "123", "space", "-", "_", ".", "@", "enter", "done"],
    ];
  };

  SpxOsk.prototype._rowsNum = function () {
    // 紧凑 4×4 计算器小键盘
    return [
      ["7", "8", "9", "back"],
      ["4", "5", "6", "clear"],
      ["1", "2", "3", "abc"],
      ["-", "0", ".", "done"],
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
    // 关闭键放在 root 右上角（不挤在键盘行内）
    let toolbar = this.root.querySelector(".spx-osk-toolbar");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "spx-osk-toolbar";
      this.root.insertBefore(toolbar, this.inner);
    }
    toolbar.innerHTML = this._keyHtml("close");
    this.inner.innerHTML = rows
      .map((row) => `<div class="spx-osk-row">${row.map((k) => this._keyHtml(k)).join("")}</div>`)
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
    if (this.mode === "alpha" && this.shift && k.length === 1 && /[A-Za-z]/.test(k)) {
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
    this.debugTabId = null; // 硬件调试当前 tab

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
      if (e.key === "Escape" && this.activeKey) this.close();
    });
  }

  SpxPopupHost.prototype.modeFor = function (key) {
    if (INFO_KEYS.has(key)) return "info";
    if (FORM_KEYS.has(key)) return "form";
    if (LEFT_KEYS.has(key)) return "left";
    return CENTER_KEYS.has(key) ? "center" : "quick";
  };

  SpxPopupHost.prototype.isOpen = function (key) {
    return !!this.activeKey && this.activeKey === key && !this.root.hidden;
  };

  SpxPopupHost.prototype.close = function () {
    if (this.osk) this.osk.hide();
    this._disposeTool();
    this.activeKey = null;
    this.triggerEl = null;
    this._placeMode = null;
    this._placeTrigger = null;
    this.root.hidden = true;
    this.root.classList.remove("modeless");
    this.shell.classList.remove("center", "quick", "info", "form", "left", "tool");
  };

  SpxPopupHost.prototype._disposeTool = function () {
    if (this._toolCleanup) {
      try { this._toolCleanup(); } catch (_) { /* ignore */ }
      this._toolCleanup = null;
    }
    this._toolApi = null;
  };

  /** 工具弹窗：画布交互（人工疵点 / 净幅宽） */
  SpxPopupHost.prototype._initTool = function (key) {
    this._disposeTool();
    if (key === "artificalAddDefect") this._initArtificalAddDefect();
    else if (key === "artificalEditDefect" || key === "defectEdit") this._initArtificalEditDefect();
    else if (key === "artificalAddWidth") this._initArtificalAddWidth();
  };

  SpxPopupHost.prototype._initArtificalAddDefect = function () {
    const canvas = this.bodyEl.querySelector("#spxArtCanvas");
    const thumb = this.bodyEl.querySelector("#spxArtThumb");
    const hint = this.bodyEl.querySelector("#spxArtHint");
    const coord = this.bodyEl.querySelector("#spxArtCoord");
    const status = this.bodyEl.querySelector("#spxArtStatus");
    const zoomLab = this.bodyEl.querySelector("#spxArtZoom");
    if (!canvas) return;
    const ctx2 = canvas.getContext("2d");
    const host = this;
    let zoom = 1;
    let dragging = false;
    let start = null;
    let draft = null;
    let pan = { x: 0, y: 0 };

    const getState = () => {
      const c = host.getCtx();
      return c.state || {};
    };
    const roisOf = () => (getState().artificalRois || []).slice();
    const modeOf = () => getState().artificalMode || "rect";

    function resize() {
      const box = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(box.width * dpr));
      canvas.height = Math.max(1, Math.floor(box.height * dpr));
      canvas.style.width = `${box.width}px`;
      canvas.style.height = `${box.height}px`;
      draw();
    }

    function toLocal(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * canvas.width,
        y: ((e.clientY - r.top) / r.height) * canvas.height,
      };
    }

    function drawFabric(g, w, h) {
      g.fillStyle = "#121218";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(240,240,250,0.08)";
      g.lineWidth = 1;
      const step = 28 * (window.devicePixelRatio || 1);
      for (let x = 0; x < w; x += step) {
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke();
      }
      for (let y = 0; y < h; y += step) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
      }
      g.fillStyle = "rgba(240,240,250,0.2)";
      g.font = `${12 * (window.devicePixelRatio || 1)}px Bahnschrift,Segoe UI,sans-serif`;
      g.fillText("FABRIC BOARD · PREVIEW", 16, 28);
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      drawFabric(ctx2, w, h);
      ctx2.save();
      ctx2.translate(pan.x, pan.y);
      ctx2.scale(zoom, zoom);
      const rois = roisOf();
      const sel = getState().artificalRoiId;
      rois.forEach((r) => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const x = r.x * dpr;
        const y = r.y * dpr;
        const rw = r.w * dpr;
        const rh = r.h * dpr;
        ctx2.strokeStyle = r.id === sel ? "#f5c542" : "#ff4d4f";
        ctx2.lineWidth = 2 / zoom;
        ctx2.strokeRect(x, y, rw, rh);
        ctx2.fillStyle = "rgba(255,77,79,0.12)";
        ctx2.fillRect(x, y, rw, rh);
        ctx2.fillStyle = "#f0f0fa";
        ctx2.font = `${11 / zoom}px sans-serif`;
        ctx2.fillText(`${r.id} ${r.label || ""}`, x + 4, y + 14 / zoom);
      });
      if (draft) {
        ctx2.strokeStyle = "#3ddc97";
        ctx2.lineWidth = 2 / zoom;
        ctx2.setLineDash([6 / zoom, 4 / zoom]);
        ctx2.strokeRect(draft.x, draft.y, draft.w, draft.h);
        ctx2.setLineDash([]);
      }
      ctx2.restore();
      if (thumb) {
        thumb.style.backgroundImage = `linear-gradient(90deg,#1a1a22 0 40%,#22222c 40% 100%)`;
        thumb.innerHTML = `<div class="spx-art-thumb-vp" style="left:${8 + pan.x * 0.02}%;top:${8 + pan.y * 0.02}%;width:${28 / zoom}%;height:${22 / zoom}%"></div>`;
      }
      if (zoomLab) zoomLab.textContent = `${Math.round(zoom * 100)}%`;
    }

    function onDown(e) {
      const mode = modeOf();
      const p = toLocal(e);
      dragging = true;
      start = p;
      if (mode === "rect") draft = { x: p.x, y: p.y, w: 0, h: 0 };
      canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const p = toLocal(e);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (coord) {
        const ix = (p.x / dpr).toFixed(0);
        const iy = (p.y / dpr).toFixed(0);
        const mmX = (p.x / dpr * 0.14).toFixed(1);
        const mmY = (p.y / dpr * 0.14).toFixed(1);
        const zh = (host.getCtx().lang || "").startsWith("zh");
        coord.textContent = zh
          ? `图像 X: ${ix}, Y: ${iy} px | 物理 X: ${mmX}, Y: ${mmY} mm`
          : `Image X: ${ix}, Y: ${iy} px | Physical X: ${mmX}, Y: ${mmY} mm`;
      }
      if (!dragging || !start) return;
      const mode = modeOf();
      if (mode === "move") {
        pan.x += e.movementX * (window.devicePixelRatio || 1);
        pan.y += e.movementY * (window.devicePixelRatio || 1);
        draw();
        return;
      }
      if (mode === "rect" && draft) {
        draft.w = p.x - start.x;
        draft.h = p.y - start.y;
        draw();
      }
      if (mode === "measure" && start) {
        draft = { x: start.x, y: start.y, w: p.x - start.x, h: p.y - start.y, measure: true };
        draw();
      }
    }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      const mode = modeOf();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (mode === "rect" && draft && Math.abs(draft.w) > 8 && Math.abs(draft.h) > 8) {
        const x = Math.min(draft.x, draft.x + draft.w) / dpr;
        const y = Math.min(draft.y, draft.y + draft.h) / dpr;
        const w = Math.abs(draft.w) / dpr;
        const h = Math.abs(draft.h) / dpr;
        host._pendingRoi = { x, y, w, h };
        host.onAction("art-roi-add", "artificalAddDefect", host);
      }
      if (mode === "measure" && draft && status) {
        const mm = Math.hypot(draft.w, draft.h) / dpr * 0.14;
        status.textContent = `Δ ${(Math.hypot(draft.w, draft.h) / dpr).toFixed(0)} px · ~${mm.toFixed(1)} mm`;
      }
      draft = null;
      start = null;
      draw();
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

    this._toolApi = {
      setZoom(delta) {
        zoom = Math.min(3, Math.max(0.5, zoom + delta));
        draw();
      },
      resetZoom() {
        zoom = 1;
        pan = { x: 0, y: 0 };
        draw();
      },
      redraw: draw,
    };
    this._toolCleanup = () => {
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
      g.strokeStyle = "rgba(240,240,250,0.35)";
      g.strokeRect(0.5, 0.5, w - 1, h - 1);

      const xScale = (w - 2 * m) / MAP_MAX_X;
      const yScale = (h - 2 * m) / maxY;
      g.strokeStyle = "rgba(240,240,250,0.12)";
      g.fillStyle = "rgba(240,240,250,0.45)";
      g.font = `${10 * (window.devicePixelRatio || 1)}px Bahnschrift,Segoe UI,sans-serif`;
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
        g.fillStyle = on ? "#ff4d4f" : "#3ddc97";
        g.arc(sx, sy, r, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#f0f0fa";
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
      g.fillStyle = "rgba(240,240,250,0.05)";
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
        g.strokeStyle = index === 0 ? "#ff4d4f" : "#4c9aff";
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
          g.strokeStyle = index === 0 ? "rgba(255,77,79,0.75)" : "rgba(76,154,255,0.75)";
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
    if (key === "systemSettings" && this.settingsTabId)
      ctx.settingsTabId = this.settingsTabId;
    if (key === "debug" && this.debugTabId)
      ctx.debugTabId = this.debugTabId;
    this.activeKey = key;
    this.triggerEl = trigger || null;
    this.titleEl.textContent = titleOf(key, ctx.lang);
    this.bodyEl.innerHTML = buildBody(key, ctx);

    const mode = this.modeFor(key);
    this._placeMode = mode;
    this._placeTrigger = trigger || null;
    this.shell.classList.remove("center", "quick", "info", "form", "left", "tool", "osk-lift");
    this.shell.classList.add(mode);
    if (TOOL_KEYS.has(key)) this.shell.classList.add("tool");
    this.root.classList.toggle("modeless", mode === "left");
    this.root.hidden = false;
    applyPopupOpacity(this.shell, ctx, key);
    this._place(mode, trigger);
    if (TOOL_KEYS.has(key)) {
      requestAnimationFrame(() => this._initTool(key));
    }
    if (key === "login") this._syncLoginType();

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

  /** 强制重建正文（忽略 NO_LIVE_REFRESH；疵点设置保存/切布种/标注工具态变更后用） */
  SpxPopupHost.prototype.rebuild = function () {
    if (!this.activeKey || this.root.hidden) return;
    const ctx = this.getCtx() || {};
    if (this.activeKey === "systemSettings" && this.settingsTabId)
      ctx.settingsTabId = this.settingsTabId;
    const y = this.bodyEl.scrollTop;
    this.titleEl.textContent = titleOf(this.activeKey, ctx.lang);
    this.bodyEl.innerHTML = buildBody(this.activeKey, ctx);
    this.bodyEl.scrollTop = y;
    if (TOOL_KEYS.has(this.activeKey)) {
      const key = this.activeKey;
      requestAnimationFrame(() => this._initTool(key));
    }
  };

  /** 仅刷新正文（用于序列图实时更新，不重算位置） */
  SpxPopupHost.prototype.refresh = function (keys) {
    if (!this.activeKey || this.root.hidden) return;
    if (Array.isArray(keys) && keys.length && keys.indexOf(this.activeKey) < 0) return;
    // 设置/登录/表单：定时重建会冲掉 tab 与输入
    if (NO_LIVE_REFRESH_KEYS.has(this.activeKey)) return;
    // PLCTest：局部刷状态，保留输入与手动勾选
    if (this.activeKey === "unwind") {
      this._patchPlcTestLive(this.getCtx() || {});
      return;
    }
    // OSK 编辑中：重建会拆掉目标 input，导致软键盘写值无效
    if (this.osk && (this.osk.targetId || this.osk.target)) return;
    const prevFocus = document.activeElement;
    const keepFocus = this._placeMode === "left" && prevFocus && !this.root.contains(prevFocus);
    const ctx = this.getCtx() || {};
    if (this.activeKey === "systemSettings" && this.settingsTabId)
      ctx.settingsTabId = this.settingsTabId;
    const y = this.bodyEl.scrollTop;
    this.titleEl.textContent = titleOf(this.activeKey, ctx.lang);
    this.bodyEl.innerHTML = buildBody(this.activeKey, ctx);
    this.bodyEl.scrollTop = y;
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
    this._setPlct("unwind", fmtPlc(s.unwind, 0) + "%");
    const tileConn = this.bodyEl.querySelector('[data-plct="connect"]');
    if (tileConn && tileConn.parentElement) tileConn.parentElement.classList.toggle("warn", !connected);
    const tileAlarm = this.bodyEl.querySelector('[data-plct="alarm"]');
    if (tileAlarm && tileAlarm.parentElement)
      tileAlarm.parentElement.classList.toggle("warn", alarm !== (zh ? "无报警" : "OK"));

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
    this._setPlct(
      "xyz",
      `${fmtPlc(st.current_x, "int")} / ${fmtPlc(st.current_y, "int")} / ${fmtPlc(st.current_z, "int")}`
    );
    this._setPlct("lblX", fmtPlc(st.current_x, "int"));
    this._setPlct("lblY", fmtPlc(st.current_y, "int"));
    this._setPlct("lblZ", fmtPlc(st.current_z, "int"));
    {
      const zhLang = (ctx.lang || "").indexOf("zh") === 0;
      const done = Number(st.label_finish_stop) !== 0;
      this._setPlct("lblFin", done ? (zhLang ? "是" : "Y") : (zhLang ? "否" : "N"));
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

    let w, h, x, y;
    if (mode === "center") {
      const pad = 8;
      const headerEl = document.querySelector("#SpxHeaderBar, .SpxHeaderBar, .topbar, header.spx-header");
      const bottomEl = document.querySelector("#SpxBottomHud, .SpxBottomHud, .bottom-hud, footer.spx-bottom");
      const headerH = headerEl ? Math.max(0, headerEl.getBoundingClientRect().bottom - stageRect.top) : 56;
      const bottomH = bottomEl ? Math.max(0, stageRect.bottom - bottomEl.getBoundingClientRect().top) : 110;

      if (this.activeKey === "debug") {
        // 硬件调试：顶栏以下整片（覆盖中间区 + 底栏）
        w = Math.max(480, stageRect.width - pad * 2);
        h = Math.max(360, stageRect.height - headerH - pad * 2);
        x = stageRect.left + pad;
        y = stageRect.top + headerH + pad;
      } else if (MID_BAND_KEYS.has(this.activeKey)) {
        // 检验记录 / 疵点设置 / 新增·编辑疵点：仅铺满顶底栏之间
        w = Math.max(480, stageRect.width - pad * 2);
        h = Math.max(360, stageRect.height - headerH - bottomH - pad * 2);
        x = stageRect.left + pad;
        y = stageRect.top + headerH + pad;
      } else {
        w = Math.max(480, stageRect.width * 0.95);
        h = Math.max(360, stageRect.height * 0.95);
        x = stageRect.left + (stageRect.width - w) / 2;
        y = stageRect.top + (stageRect.height - h) / 2;
      }
    } else if (mode === "form") {
      // 检验单信息：居中紧凑，约 480–560 宽；登录更小；弹出键盘时上移避让
      if (this.activeKey === "login") {
        w = Math.max(340, Math.min(400, stageRect.width * 0.30));
        h = Math.max(260, Math.min(340, (availBottom - stageRect.top) * 0.36));
      } else {
        w = Math.max(440, Math.min(560, stageRect.width * 0.38));
        h = Math.max(360, Math.min(oskH ? 480 : 620, (availBottom - stageRect.top) * (oskH ? 0.92 : 0.72)));
      }
      x = stageRect.left + (stageRect.width - w) / 2;
      y = stageRect.top + Math.max(8, (availBottom - stageRect.top - h) / 2);
    } else if (mode === "info") {
      // 对齐 NoClothStopDialog：主界面约 1/3 宽；取样/色差文案略增高
      w = Math.max(380, Math.min(560, stageRect.width / 3));
      h = Math.max(260, Math.min(440, w * 0.85));
      x = stageRect.left + (stageRect.width - w) / 2;
      y = stageRect.top + (stageRect.height - h) / 2;
    } else if (mode === "left") {
      // 疵点详情：贴在右侧疵点列表左侧旁，高度与列表对齐
      const listEl = document.querySelector(".hud-panel.list");
      const listRect = listEl ? listEl.getBoundingClientRect() : (trigger ? trigger.getBoundingClientRect() : null);
      w = Math.max(260, Math.min(340, stageRect.width * 0.24));
      if (listRect && listRect.width > 0) {
        h = Math.max(280, Math.min(listRect.height, availBottom - listRect.top - 4));
        x = listRect.left - 8 - w;
        y = listRect.top;
      } else {
        h = Math.max(320, Math.min(availBottom - stageRect.top - 16, stageRect.height * 0.88));
        x = stageRect.right - 16 - 280 - 8 - w;
        y = stageRect.top + 16;
      }
    } else {
      // Quick（含系统设置 / 放卷PLCTest）：相对触发按钮上/下，水平对中
      const t = trigger ? trigger.getBoundingClientRect() : null;
      if (this.activeKey === "unwind") {
        // admin 2×2 需要更宽更高；贴触发按钮上方铺开
        w = Math.max(520, Math.min(720, stageRect.width * 0.58));
        const above = t ? Math.max(320, t.top - stageRect.top - 12) : stageRect.height * 0.82;
        const below = t ? Math.max(320, availBottom - t.bottom - 12) : above;
        h = Math.max(420, Math.min(stageRect.height * 0.9, Math.max(above, below)));
      } else {
        w = Math.max(360, stageRect.width * 0.5);
        h = Math.max(280, stageRect.height * 0.8);
      }
      x = t ? t.left + t.width / 2 - w / 2 : stageRect.left + (stageRect.width - w) / 2;
      if (t && t.top < stageRect.top + stageRect.height / 2) {
        y = t.bottom + 8;
        if (y + h > availBottom) y = Math.max(stageRect.top + 4, availBottom - h - 4);
      } else if (t) {
        y = t.top - 8 - h;
        if (y < stageRect.top + 4) {
          // 上方不够则夹在 stage 顶与按钮之间
          y = stageRect.top + 4;
          h = Math.max(280, Math.min(h, t.top - y - 8));
        }
      } else {
        y = stageRect.top + (stageRect.height - h) / 2;
      }
    }

    x = Math.min(Math.max(x, stageRect.left + 4), stageRect.right - w - 4);
    // 防止过高弹窗把 y 顶出可视区（admin PLCTest 尤其）
    if (y + h > availBottom - 4) {
      h = Math.max(260, availBottom - 4 - y);
    }
    y = Math.min(Math.max(y, stageRect.top + 4), Math.max(stageRect.top + 4, availBottom - h - 4));
    this.shell.style.width = `${Math.round(w)}px`;
    this.shell.style.height = `${Math.round(h)}px`;
    this.shell.style.left = `${Math.round(x)}px`;
    this.shell.style.top = `${Math.round(y)}px`;
  };

  SpxPopupHost.prototype._onClick = function (e) {
    const actEl = e.target.closest("[data-act]");
    if (!actEl) {
      if (e.target.classList.contains("spx-light-card")) {
        this.bodyEl.querySelectorAll(".spx-light-card").forEach((c) => c.classList.remove("active"));
        e.target.classList.add("active");
      }
      return;
    }
    const act = actEl.getAttribute("data-act");
    if (act === "close" || act === "finish-no" || act === "nocloth-cancel") {
      this.close();
      return;
    }
    if (actEl.closest("#popSettingsTabs")) {
      const tab = actEl.getAttribute("data-tab");
      if (tab) {
        this.settingsTabId = tab;
        this.bodyEl.querySelectorAll("#popSettingsTabs button").forEach((b) => b.classList.toggle("active", b === actEl));
        this.bodyEl.querySelectorAll("[data-pane]").forEach((p) => {
          p.hidden = p.getAttribute("data-pane") !== tab;
        });
      }
      return;
    }
    if (act === "debug-tab" || actEl.closest("#popDebugTabs")) {
      const tab = actEl.getAttribute("data-tab");
      if (!tab) return;
      this.debugTabId = tab;
      this.bodyEl.querySelectorAll("#popDebugTabs button").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-tab") === tab)
      );
      this.bodyEl.querySelectorAll("[data-debug-pane]").forEach((p) => {
        const on = p.getAttribute("data-debug-pane") === tab;
        p.hidden = !on;
        if (!on) return;
        const frame = p.querySelector("iframe.spx-debug-frame");
        if (frame && !frame.getAttribute("src")) {
          const src = frame.getAttribute("data-src") || actEl.getAttribute("data-src");
          if (src) frame.setAttribute("src", src);
        }
      });
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
    if (act === "plct-cmd" || act === "plct-apply" || act === "plct-movex") {
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
    if (act === "def-step") {
      const id = actEl.getAttribute("data-target");
      const wrap = id ? this.bodyEl.querySelector(`.spx-def-step[data-step-id="${id}"]`) : null;
      const inp = id ? this.bodyEl.querySelector(`#${id}`) : null;
      if (!wrap || !inp) return;
      const min = Number(wrap.getAttribute("data-min")) || 0;
      const max = Number(wrap.getAttribute("data-max")) || 9999;
      const step = Number(wrap.getAttribute("data-step")) || 1;
      const delta = Number(actEl.getAttribute("data-delta")) || 0;
      const cur = Number(inp.value) || 0;
      const next = Math.min(max, Math.max(min, cur + delta * step));
      inp.value = String(next);
      return;
    }
    if (act === "art-zoom") {
      const delta = Number(actEl.getAttribute("data-delta")) || 0;
      if (this._toolApi && this._toolApi.setZoom) this._toolApi.setZoom(delta);
      return;
    }
    if (act === "art-zoom-reset") {
      if (this._toolApi && this._toolApi.resetZoom) this._toolApi.resetZoom();
      return;
    }
    if (act === "width-reset") {
      if (this._toolApi && this._toolApi.reset) this._toolApi.reset();
      this.onAction(act, this.activeKey, this);
      return;
    }
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
    const userRow = this.bodyEl.querySelector("#popLoginUserRow");
    const passRow = this.bodyEl.querySelector("#popLoginPassRow");
    if (!typeEl) return;
    const admin = typeEl.value === "admin";
    if (userRow) userRow.hidden = admin;
    if (passRow) passRow.hidden = !admin;
  };

  SpxPopupHost.prototype._onInput = function (e) {
    const t = e.target;
    if (t.id === "popLoginType" || t.getAttribute("data-act") === "login-type") {
      this._syncLoginType();
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
    if (t.getAttribute("data-act") === "def-prec" && t.id) {
      const lab = this.bodyEl.querySelector(`#${t.id}Val`);
      if (lab) lab.textContent = String(t.value);
    }
    if (t.classList && t.classList.contains("spx-def-on")) {
      const id = t.getAttribute("data-id");
      const row = this.bodyEl.querySelector(`tr[data-defect-id="${id}"]`);
      if (row) row.classList.toggle("on", !!t.checked);
    }
    if (t.id === "popRecQueryType") {
      this._actEl = t;
      this.onAction("rec-query-type", this.activeKey, this);
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
