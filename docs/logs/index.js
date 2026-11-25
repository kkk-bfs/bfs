/**
 * 日志回放索引（静态文件）
 *
 * 新增日志：
 *   1. 把日志脚本放到本目录（例：2026-11-25_run01.js）
 *   2. 在下面数组追加 { id, name, file }
 *   3. 日志脚本内调用 window.SPX_LOG_INDEX 同目录注册：
 *        window.SPX_LOGS = window.SPX_LOGS || {};
 *        window.SPX_LOGS["run01"] = { meta: {...}, events: [...] };
 *
 * 页面通过 <script> 加载，因此 file:// 直接打开也可用，无需本地服务器。
 */
window.SPX_LOG_INDEX = window.SPX_LOG_INDEX || [
  { id: "sample", name: "示例巡检 · 60s", file: "sample.js" },
];
