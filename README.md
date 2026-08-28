# 验布机软件更新说明

## 1.26.0828.143805（2026-08-28）

### 安装包

- **升级清缓存：** 覆盖安装时删除安装目录 `cache` 文件夹，避免旧缓存影响新版本。

### 检测机型 — Pro

- **完整设备：** V1 Pro / V1Sp / V1SpPro 补上 ESC 打印机、色差仪、云端 MySQL 初始化；停检先排空相机与检测队列，再停任务，避免尾帧丢失。
- **入口：** 仅机型为 V1 且 `use_machine_pro=1` 时走 `bfsmV1Pro`，其它机型不再误入 Pro。

### 灯光

- **掉线重连：** 光源串口意外关闭后自动重开并补发待发亮度，避免调光卡住。
- **分时频闪：** V1Sp 灯光指令按序入队，减少频闪开关丢命令。

### 稳定性

- **图像释放：** 对象池只释放自己管理的图像，避免误删借用指针导致崩溃。
- **任务日志：** 带命名空间的任务名去掉 Windows 非法字符后再写入 `logs/`。
- **忽略疵点：** 独立线程落库，停检时不再被忽略疵点保存堵住。

### 现场文档

- **调试手册：** 安装包带上现场调试文档与色差检测原理说明，便于售后对照排查。

---

## 1.26.0828.142134（2026-08-28）

### 检测机型 — Pro

- **完整设备：** V1 Pro / V1Sp / V1SpPro 补上 ESC 打印机、色差仪、云端 MySQL 初始化；停检先排空相机与检测队列，再停任务，避免尾帧丢失。
- **入口：** 仅机型为 V1 且 `use_machine_pro=1` 时走 `bfsmV1Pro`，其它机型不再误入 Pro。

### 灯光

- **掉线重连：** 光源串口意外关闭后自动重开并补发待发亮度，避免调光卡住。
- **分时频闪：** V1Sp 灯光指令按序入队，减少频闪开关丢命令。

### 稳定性

- **图像释放：** 对象池只释放自己管理的图像，避免误删借用指针导致崩溃。
- **任务日志：** 带命名空间的任务名去掉 Windows 非法字符后再写入 `logs/`。
- **忽略疵点：** 独立线程落库，停检时不再被忽略疵点保存堵住。

### 现场文档

- **调试手册：** 安装包带上现场调试文档与色差检测原理说明，便于售后对照排查。

---

## 1.26.0827.114151（2026-08-27）

### 检测机型 — bfsmV1Pro

- **启动入口：** 补上 `main.cpp`（V1 主程序）在 `use_machine_pro=1` 时走 `bfsmV1Pro`；V1 与手动贴标机型均生效。
- **日志：** `start bfsmV1Pro====单线 Common 多检测器`。

---

## 1.26.0827.104001（2026-08-27）

### 检测机型 — bfsmV1Pro

- **Common 流水线：** 新增 V1 单线 Pro 机型，检测主链路改由 `CommonDetectionPipeline` 组装（布边 → 预处理 → 多 detector → 归并 → 后处理）。
- **启用方式：** 参数 `use_machine_pro=1`（机型仍为 V1）。V1Sp 同样用该开关走 `bfsmV1SpPro`。默认 0 仍用原 `bfsmV1` / `bfsmV1Sp`。
- **并行推理：** 同一来源可配置多个独立 CommonDetect worker，共享预处理、各自候选队列；数量沿用 `IsEnableHengtianDualProcess`。
- **生命周期：** `wait()` 只排空不杀线程，`stop()` 下游到上游停止；实时状态图像队列计入 Common `ImageDispatcher` topic。

---

## 1.26.0827.102526（2026-08-27）

### 称重标定

- **仪表标定：** PLC 增加称重标定下限 VW234、上限 VW236、仪表反馈 VW238；PLC 工具页增加「称重标定」弹窗。
- **现场两步：** 空秤显示 0 时把 VW238 写入下限；放上 10kg 后把反馈填入电脑端，按公式算出 400kg 上限写入 VW236：`(F10 − VW234) / 10 × 400 + VW234`。

---

## 1.26.0825.160415（2026-08-25）

### 检测图

- **过滤原因：** 被过滤的疵点在标注图上画出框，并写明原因（禁用、裁剪、尺寸、布边、贴标超限等）。
- **全图预览：** 实时检测打开全图时，过滤框第二行显示过滤类别；有效疵点仍为红框。打开全图不再因疵点数据结构变化崩溃。

---

## 1.26.0825.140505（2026-08-25）

### 安装包 / 版本号

- **Version Info 刷新：** 发版必须重新 cmake configure，才会写入 `version.h` / 资源管理器版本；只编译不会换号。
- **去尾空格：** `BFS_FORCE_VERSION_BUILD` 去掉空格，避免 FileVersion / 安装包文件名带空格。

### 检测图

- **过滤原因：** 被过滤的疵点在标注图上画出框，并写明过滤原因（禁用、裁剪、尺寸、布边等）。

---

## 1.26.0825.112530（2026-08-25）

### 新增疵点 / 布边二维码

- **N 序号递增：** 新增疵点页「打码(布边)」二维码 `S…Nxxxx…` 中的 N 序号每次打印 +1；原先只在打疵点码时计数，单独打布边码时 N 不变。
- **自动贴标兼容：** 先打疵点码再打布边码时，N 仍为 1、2、3…，与原自动贴标顺序一致。

---

## 1.26.0824.172741（2026-08-24）

### PLC

- **寄存器地址：** 修正 `plcregisters.json` 中 39 条 address，统一为 `HEX(index-1)`，避免与 PLC 实际寄存器错位。
- **放卷摆杆高度：** 下限/上限/反馈改为读取 0x6F/0x70/0x71（寄存器 112/113/114），与修正后的地址表一致。

### 云端统计

- **整点上报：** todaystat 增加新增瑕疵、API 版本、自动调光、机型参数、硬件与相机信息，便于远程对账。

### ERP（同奈 / fg1）

- **布封宽度 SOP：** 补充中/英/越操作说明与界面示意。

---

## 1.26.0824.155200（2026-08-24）

### 实时状态 / 底部栏

- **放卷摆杆高度：** 实时状态面板显示放卷摆杆高度百分比；由 PLC 寄存器下限(111)、上限(112)、反馈(113) 计算，并写入共享内存。
- **实时重量位置：** 实时状态面板去掉实时重量；底部状态栏在「光源」后显示实时重量（kg）。

---

## 1.26.0824.113046（2026-08-24）

### ERP（合泰）

- **针孔边距减宽：** 结束检验可录入针孔边距（左右两边总和）；出报告时从检出幅宽中扣除，得到实际门幅。
- **单位随系统：** 录入与减宽计算均按当前系统门幅单位（cm / in）；英寸时先换算再减，报告显示与录入同单位。
- **现场启用：** 安装包已包含 `erpinterface/hetai`；现场将工厂目录设为 `hetai` 并执行 `init_db.py`（或重启后由 `database_maintain.sql` 写入参数）。

---

## 1.26.0821.163940（2026-08-21）

### 安装包（全量）

- **OpenCV 运行库：** 全量安装包重新带上 `opencv_world480.dll`，新机或覆盖安装后不必再单独拷贝。
- **现场工具：** 同步精简包已有的 `field-update`、`machine-switch` 脚本；安装时可选择目录。

---

## 1.26.0821.150700（2026-08-21）

### 疵点页面

- **检出率统计：** 支持自选起止日期范围（最长 90 天），一次汇总该区间的检出、漏检、误检，不必再按天逐次查询。

---

## 1.26.0821.130044（2026-08-21）

### 贴标

- **近距下一站停机：** 跳过或确认当前疵点后，若下一站已在贴标窗口内，机台保持停机并弹出下一窗，不再立刻启动把近距站冲过。
- **停机坐标：** 只有目标 Y 已落后于当前布位时才前推，不再把仍在前方的近距站抬高，避免写错停机点。
- **同站 Y 微调：** 同一停机位贴第二个疵点需要少量走布时，会等真正启动并走到目标附近再贴标，不再把刚下发的启动当成「未到位即停」而在原地打标。

---

## 1.26.0820.170238（2026-08-20）

### 人工添加疵点

- **没图原因说明：** 打开添加疵点页拿不到图时，不再只显示 `no image data`。页面会给出原因（缓存为空、刚开始验布看板还在布头后方、检验单号不符、缓存被挤掉等）以及 CurrentY、停机偏移、窗口和缓存范围，方便现场排查。
- **多语言提示：** 上述原因与排查数字按系统语言显示中/英/越文。
- **布头缓存：** 布头布尾不检跳过的帧仍写入 `imgtemps`，避免无布连续切卷后布头全图缓存断开。

### 疵点设置

- **客户名称：** 更新疵点客户名称改用参数绑定；仅在名称为空时从 `Name` 回填，避免覆盖已改名称。批量保存按接口 `success` 判断成败。

### ERP（茂路）

- **条码查询：** 有缓存则直接返回，无缓存再拉 token；并打印原始查询结果便于对账。

---


## 1.26.0820.120218（2026-08-20）

### 人工看板

- **上下偏移分开：** 人工添加疵点看板的 top / bottom 偏移独立可调（`MaunalCheckBoardOffset` / `MaunalCheckBoardOffset2`），帮助页可直接改宽度与偏移并立刻生效。

### ERP（茂路）

- **条码备注：** 扫码把成分、仓库、库位写入备注（Remarks），不再占用 AdditionalData；AdditionalData 仍用于结束录入左右布边 mm。

---

## 1.26.0820.115158（2026-08-20）

### ERP（茂路）

- **条码备注：** 扫码把成分、仓库、库位写入备注（Remarks），不再占用 AdditionalData；AdditionalData 仍用于结束录入左右布边 mm。

---

## 1.26.0820.111320（2026-08-20）

### ERP（茂路）

- **结束录入布封：** 结束弹窗显示左右布边（mm），默认带出设置页左边距/右边距，可确认后修改；写入 `AdditionalData` 后报告按 `(左+右)/10` cm 对检出幅宽减宽。斜丝率、备注仍可一并录入。

---

## 1.26.0820.092830（2026-08-20）

### ERP（茂路）

- **茂路布封：** 结束弹窗显示左右布边（mm，默认带出设置页），确认或修改后写入 `AdditionalData`；报告按 `(左+右)/10` cm 减宽。不改主程序。

---

## 1.26.0819.153540（2026-08-19）

### 布边检测

- **自适应布面掩膜：** 新增 `DetectEdgeMode=5`，按布面掩膜找左右边（深色布去掉边光/机台灰带，浅色布保留左右边）；线扫 16k 单帧约 100ms 内。设置页、帮助页与中/英/越文已加选项，报告中记为「布面掩膜」。

### 模型报警

- **初始化失败详情：** `MODEL_INIT_FAILED` 报警显示加载类、设备、模型路径与原因（中/英/越）；推理时模型未初始化也会报警，已触发时不再重复刷屏。

### 检测流水线与内存

- **图像对象池：** `QImage`/`cv::Mat` 按尺寸复用，借款票防止二次归还导致堆损坏；关闭机型前等待在飞帧归零。
- **斜面机 Pro：** `use_machine_pro=1` 时 `bfsmV1Sp` 走 `bfsmV1SpPro` 组装器（默认仍为原 V1Sp）。

### 安装包与版本号

- **显示版本：** 安装包与 About 使用 `主.年.月日.时分秒`；Windows 资源 FILEVERSION 第四段改为 HHMM，避免 16-bit 溢出。
- **现场调试文档：** 安装包同步 `docs/调试文档`（含色差原理与现场调试说明）。

---

## 1.26.0817.174430（2026-08-17）

### 发行

- **全量重编译：** 本包为完整 Release 重编，纳入当前检测流水线、疵点名称与编辑页改动。

### 检测流水线

- **公共层：** 布边、预处理、推理与后处理队列监控整理；积压过高时可走磁盘预取，减轻内存压力。
- **斜面机 Pro：** `use_machine_pro=1` 时 `bfsmV1Sp` 改用 `bfsmV1SpPro` 组装器（默认仍为原 V1Sp）。
- **待检计数：** 主界面图像队列改为读取全局 `pendingImage`，与公共层监控一致。

### 疵点名称与编辑

- **越南语统一：** 各界面疵点名为 `vi (en)`；编辑页按 DefectID 显示/保存类型。
- **缩略图：** 无内存局部图时读取疵点图文件生成预览。

---

## 1.26.0817.173210（2026-08-17）

### 疵点名称（越南语）

- **各界面统一：** 卡片、实时列表、疵点设置、编辑/地图/叠加层与设置 API 使用同一套展示名；越南语为 `vi (en)`（如 `Nhãn (Label)`），中文/英文仍为单语。
- **编辑页类型：** 疵点编辑选中类型后按下拉框正确显示越南语名称；切换类型按 DefectID 保存，入库仍为中文名。

### 疵点编辑图片

- **缩略图：** 内存无局部图时改为读取疵点图文件（`defectImage`）生成缩略图与预览，不再误用整幅布图。

---

## 1.26.0817.103558（2026-08-17）

### fg1（通耐）疵点与多语言

- **默认疵点参数：** 新增 8 类疵点写入 `defects` 时同步 `DefectSetting` 默认检测参数（精度 50、门幅 0–2200、码长 0–150），并补齐各布种方案；`init_db.py` 一次执行 SQL。
- **越南语名称：** 新增疵点补齐 `defect_map` / `Language_vi.xml` / `Language_en.xml`，疵点设置与人工标注统一显示（越南语为 vi + 英文对照）。
- **人工标注弹窗：** 疵点类型按 ID/别名排序，避免客户名对不上掉到末尾；越南语长名称按钮可换行，弹窗加宽，不再被裁成省略号。

---

## 1.26.0814.153658（2026-08-14）

### 检测设置（算法配置）

- **模型路径下拉选择：** 检测设置页扫描 `D:/models` 及其子目录中的 `best_ckpt.trt`，模型路径可点右侧箭头选择，也可直接手动输入（支持分号多路径）。
- **界面简化：** 算法配置去掉算法版本（`inference_Method_Version`）和内部置信度阈值三项，减少现场误改；程序仍使用数据库中已有配置。

---

## 1.26.0814.105318（2026-08-14）

### 界面权限

- **About 全部按钮仅管理员：** 导出日志、执行统计、上传数据、PLC 调试、提交 Bug、「检查更新」均仅管理员可见；非管理员打开关于页不再自动检查更新。

### 检测流程与相机

- **布边独立线程：** `bfsmV1` 将布边从存图设备拆出为 `EdgeDetect` / `task_edge_detect`，相机图先入 `detectimages` 做布边，再入 `detectimagesEdge` 给检测线程，避免存图与布边互相阻塞。
- **结束检验排空：** 结束验布时同时等待待布边队列与布边后待检队列清空，避免停机时仍有帧在流水线中。
- **检测公共层：** 新增 `PublicFabricScannerCommon`，把布边、预处理、推理、跨图合并与后处理抽成可复用流水线，多机型可共用同一套检测任务。
- **帧元数据：** `DetectionFrameMeta` 补充布边、相机 id/名称、采集时间戳及 inflight 来源，便于后续检测与归档对齐。

### 光源控制

- **亮度滑块防抖：** 拖动时每次重新计时，只把最后一次滑块值下发到设备，避免中间值覆盖最终亮度。
- **分时频闪下发：** `devlight3` 按本次快照提交串口结果；发送期间到达的新目标保留到下一帧，发送失败则重排队，正/背光可安全共用一台控制器。

### 结束检验

- **斜面机结束等待：** `bfsmV1Sp` 结束检验改为后台排空图像/保存队列，不再在 UI 线程里超时空转，结束流程不卡界面。

---

## 1.26.0814.090852（2026-08-14）

### 检测流程与相机

- **布边独立线程：** `bfsmV1` 将布边从存图设备拆出为 `EdgeDetect` / `task_edge_detect`，相机图先入 `detectimages` 做布边，再入 `detectimagesEdge` 给检测线程，避免存图与布边互相阻塞。
- **结束检验排空：** 结束验布时同时等待待布边队列与布边后待检队列清空，避免停机时仍有帧在流水线中。
- **检测公共层：** 新增 `PublicFabricScannerCommon`，把布边、预处理、推理、跨图合并与后处理抽成可复用流水线，多机型可共用同一套检测任务。
- **帧元数据：** `DetectionFrameMeta` 补充布边、相机 id/名称、采集时间戳及 inflight 来源，便于后续检测与归档对齐。

### 光源控制

- **亮度滑块防抖：** 拖动时每次重新计时，只把最后一次滑块值下发到设备，避免中间值覆盖最终亮度。
- **分时频闪下发：** `devlight3` 按本次快照提交串口结果；发送期间到达的新目标保留到下一帧，发送失败则重排队，正/背光可安全共用一台控制器。

### 界面与结束检验

- **About 管理员工具：** 日志导出、统计、上传检验、PLC 调试仅管理员可见；「检查更新」仍对所有用户开放。
- **斜面机结束等待：** `bfsmV1Sp` 结束检验改为后台排空图像/保存队列，不再在 UI 线程里超时空转，结束流程不卡界面。

---

## 1.26.0812.150505（2026-08-12）

### 帮助页（newhelp）参数说明与设置优化

- **艾科一代裁剪：** 修正 `IKapCameraLeftCrop0/RightCrop0` 等注释歧义（按相机左/右侧裁边，非左/右相机）；界面按相机分行；参数 key 统一蓝色标签样式。
- **ERP 任务总开关：** 增加周期设置 `ERPUploadInterval` / `ERPUploadToWebInterval` / `ERPBackupInterval` / `ERPBullmerUploadInterval`（秒），与 `task_erp_base` 对齐；任务循环内重读，一般无需重启。
- **相机类型/参数：** 按机型整理说明（`bfsmV1` / `bfsmV1Online` / `bfsmV1Sp` / `bfsmDual2` / `bfsmV1Cam4`），明确 `MachineProject` 与 `CameraDeviceType` 取值差异；下拉选项按机型分组（含 42 / 811 / 888）。

---

## 1.26.0812.113154（2026-08-12）

### fg1（通耐）工厂定制

- **工厂目录：** 新增 `erpinterface/fg1`，机型对接 `bfsmV1`（`MachineProject=0`），`init_db.py` / `database_maintain.sql` 一键切换工厂与报告参数。
- **结束录入布封：** `IsErpFinishInput=1`，结束检验录入「布封宽度」写入 `AdditionalData`；`reportgen.py` 按 report3 出报告并对检出幅宽做布封减宽。
- **美标四分制：** `FourPointsMode=3` + `reportcalc.py`，对齐系统默认 `FourPointsUSStrategy`（按英寸扣分、每码上限 4、百平方码结论）；日志按天保留。
- **疵点列表：** 补充通耐 8 类疵点（含新建 `K1-7` / `K1-4-6` / `K6-3-3` / `K5-6`），`defect_order.json` 控制人工标注顺序。
- **安装包：** 精简版 ISS 增加 `erpinterface\fg1` 打包条目。

---

## 1.26.811.0（2026-08-11）

### 光源控制多通道统一与亮度恢复修复

#### 背景问题

此前光源设备存在以下问题：

1. **多通道仅 devlight3 支持**：基类 `devlight` 虽有 16 通道串口协议（`turnOn(ch)`、`adjustBrightness(ch, num)`），但 `open()` 只调 `turnOnAll()` 打开全部 16 通道（耗时最多 1.6 秒串口阻塞），不恢复任何通道亮度。普通 `devlight` 双通道场景下通道 1+ 永远不会被打开。
2. **亮度恢复缺失**：`savedBrightnessForChannel()` 只存在于 `devlight3`，基类 `devlight` 和 `devlight2` 启动时不会从数据库读取已保存亮度值。
3. **devlight2 空实现**：`devlight2::turnOn(int)` 和 `devlight2::turnOff(int)` 为空函数，按通道调用时静默丢弃操作。
4. **LightSetting setupUi 混乱**：用 `type == "devlight3"` 硬判断决定滑块数量；光源1/光源2 近 70 行代码复制；4 个 apply + 4 个 slot + 4 个 debounce timer + 4 个 dragging flag 完全重复；`applyDevlight1BackBrightness` 非 devlight3 时调 `adjustBrightness(val)` 单参数→实际写 ch0，背光滑块控制了主光。

#### 改动内容

**dev_light.h / dev_light.cpp（基类改动）**

- 新增 `m_activeChannelCount` 成员（默认 1，向后兼容），通过 `setActiveChannelCount(count)` 配置。
- 新增 `activeChannelCount()` getter。
- 新增 `savedBrightnessKey(int channel)` 虚方法：统一存储键公式 `LastSaveBrightness + (id>1?id:"") + (ch>0?"_"+ch:"")`。
- 新增 `savedBrightnessForChannel(int channel)` 虚方法：从数据库读取指定通道亮度，查不到时回退到 `SystemSetting` 内存值（`LastSaveBrightness` / `LastSaveBrightness2`）。
- `open()` 中新增亮度恢复逻辑：遍历 `m_activeChannelCount` 个通道，逐个调用 `savedBrightnessForChannel(i)` 读取并 `adjustBrightness(i, saved)` 恢复。
- `turnOn()` / `turnOff()` 无参版本改为遍历 `m_activeChannelCount` 个活跃通道（替代原来的单通道操作）。

**dev_light2.cpp（海康光源）**

- `turnOn(int channel)` 由空实现改为转发到 `turnOn()`（海康 `SH#` 为全局开关，不支持单通道开关）。
- `turnOff(int channel)` 由空实现改为转发到 `turnOff()`。

**dev_light3.h / dev_light3.cpp（分时频闪）**

- `savedBrightnessForChannel()` 加 `override` 关键字，声明覆盖基类。原有实现逻辑不变（含 `isEnabledStrobeChannel` 检查和 DB 读取）。

**LightSetting.h / LightSetting.cpp（光源设置面板重构）**

- 删除 16 个硬编码成员（`m_SliderBrightness`、`m_SliderBrightness_1`、`m_Brightness2` 等），替换为 `LightChannelUI` 和 `LightGroupUI` 数据结构 + `m_lightGroups` 向量。
- `setupUi()` 从 289 行压缩到约 95 行：遍历 `gMachine->devices`，对每个 `devlight*` 调用 `createBrightnessRow(dev, deviceIndex)`，按 `dev->activeChannelCount()` 动态创建 N 个滑块。
- 4 个 apply 函数 + 4 个 slot 函数统一为 `applyBrightness(groupIndex, channelIndex)` 和 `slot_sliderBrightnessChanged(groupIndex, channelIndex)` 两个参数化函数。
- 修复 `applyDevlight1BackBrightness` bug：统一用 `adjustBrightness(channelIndex, brightness)` 带通道号调用，不再出现背光滑块写主光通道的问题。
- 存储键使用 `dev->savedBrightnessKey(channel)` 统一生成，不再散落硬编码字符串。

#### 存储键兼容性

| 设备 ID | 通道 | 存储键 | 兼容旧版本 |
|---------|------|--------|-----------|
| 1 | 0 | `LastSaveBrightness` | ✅ |
| 2 | 0 | `LastSaveBrightness2` | ✅ |
| 1 | 1 | `LastSaveBrightness_1` | ✅（devlight3 原有） |
| 2 | 1 | `LastSaveBrightness2_1` | ✅（devlight3 原有） |
| 3 | 0 | `LastSaveBrightness3` | 新增 |
| 1 | 2 | `LastSaveBrightness_2` | 新增 |

不需要数据迁移，`m_activeChannelCount` 默认 1 时行为与原版本完全一致。

---

### 机型组装光源设备使用案例

#### 统一规则

1. **设备键名**：`devlight{N}`（N=1,2,3...），一个键名对应一个物理控制器。
2. **通道数**：通过 `setActiveChannelCount(n)` 在 `init()` 之前设置，默认 1。
3. **亮度恢复**：`open()` 自动遍历活跃通道逐个恢复，无需机型代码手动调用。
4. **存储键**：由 `savedBrightnessKey(ch)` 自动生成，调用方无需拼接字符串。

#### 案例 1：bfsmV1 — 单灯 welop 控制器（单通道）

```cpp
// PublicFabricScanner/bfsmV1.cpp init()
// lightDeviceType == 2 → 沃德普控制器
light1 = new devlight();
light1->id = 1;
light1->name = "devlight1";
// setActiveChannelCount 不调用，默认 1
light1->init();

m_lightThread1 = new QThread;
light1->moveToThread(m_lightThread1);
m_lightThread1->start();

light1->open();
// → open() 内部：turnOnAll() + 遍历 1 个通道恢复亮度

devices["devlight1"] = light1;
```

**效果**：启动后自动读取 `LastSaveBrightness` 恢复通道 0 亮度。UI 面板显示 1 个亮度滑块。

#### 案例 2：bfsmV1 — 单灯 welop 控制器（双通道独立控制）

```cpp
// 如果 welop 控制器接了正光 + 背光两路
light1 = new devlight();
light1->id = 1;
light1->name = "devlight1";
light1->setActiveChannelCount(2);  // ← 新增：2 通道独立控制
light1->init();

m_lightThread1 = new QThread;
light1->moveToThread(m_lightThread1);
m_lightThread1->start();

light1->open();
// → open() 内部：turnOnAll() + 遍历 2 个通道：
//   ch0 → 读取 LastSaveBrightness 恢复
//   ch1 → 读取 LastSaveBrightness_1 恢复

devices["devlight1"] = light1;
```

**效果**：启动后自动恢复正光和背光亮度。UI 面板自动显示 2 个亮度滑块（主光/背光），各通道独立控制。

#### 案例 3：bfsmDual2 — 普通光源 + 分时频闪双设备

```cpp
// PublicFabricScanner2/bfsmDual2.cpp init()
// 主线程光源（普通 welop）
m_devlight = new devlight();
m_devlight->id = 1;
// setActiveChannelCount 不调用，默认 1
m_devlight->init();
m_devlight->open();
// → open() 内部：turnOnAll() + 恢复 LastSaveBrightness

// 分时光线光源（分时频闪控制器，2 通道）
m_devlight2 = new devlight3();
m_devlight2->id = 2;
m_devlight2->init();
m_devlight2->open();
// → devlight3::init() 内部 restoreSavedBrightness() 恢复 2 通道亮度

devices["devlight1"] = m_devlight;
devices["devlight2"] = m_devlight2;
```

**效果**：UI 面板自动显示 3 个滑块——光源 1（1 个）+ 光源 2（2 个，正/反光）。

#### 案例 4：bfsmV1Sp — 单分时频闪控制器（双通道）

```cpp
// PublicFabricScanner3/bfsmV1Sp.cpp init()
m_devlight = new devlight3();
m_devlight->id = 1;
m_devlight->init();
// devlight3 内部 kEnabledStrobeChannelCount=2，自动管理 2 通道

m_devlightThread = new QThread;
m_devlight->moveToThread(m_devlightThread);
m_devlightThread->start();

m_devlight->open();
// → devlight3 有独立 open() 实现，不调基类 open()
// → init() 中已通过 restoreSavedBrightness() 恢复

devices["devlight1"] = m_devlight;
```

**效果**：UI 面板自动显示 2 个滑块（正光/背光），亮度恢复由 devlight3 内部处理。

#### 案例 5：海康控制器多通道（假设场景）

```cpp
// 如果使用海康控制器并需要多通道
light1 = new devlight2();
light1->id = 1;
light1->setActiveChannelCount(2);  // 海康双通道
light1->init();

m_lightThread1 = new QThread;
light1->moveToThread(m_lightThread1);
m_lightThread1->start();

light1->open();
// → open() 内部：turnOnAll() + 遍历 2 通道恢复亮度
//   turnOn(int ch) → 转发到 turnOn()（海康全局开关）
//   adjustBrightness(ch, val) → 按通道设置（海康 SA0168# 协议支持）

devices["devlight1"] = light1;
```

#### 机型装配清单

| 机型 | 设备键名 | 类型 | 通道数 | 亮度恢复位置 |
|------|---------|------|--------|-------------|
| bfsmV1 | devlight1 | devlight / devlight2 | 1（可配 2） | 基类 `open()` |
| bfsmDual2 | devlight1 | devlight | 1 | 基类 `open()` |
| bfsmDual2 | devlight2 | devlight3 | 2 | devlight3 `init()` |
| bfsmV1Sp | devlight1 | devlight3 | 2 | devlight3 `init()` |

> **注**：`open()` 中 `turnOnAll()` 会打开全部 16 通道（每个通道等待 100ms 串口写完成），后续优化建议改为 `turnOn()` 仅打开 `m_activeChannelCount` 个活跃通道，减少启动耗时。

---



## 1.26.707.0（2026-07-07）



### 统一后台管理



- **新增统一入口：** 新增 `erpinterface/manager/manager.html` 作为唯一“验布数据管理”后台入口，`/fabric_inspection` 统一跳转到该页面，避免机型目录和工厂目录各自维护多个 `manager.html`。

- **模块化装配：** 新增 `PublicServer/ApiManager.h`，通过 `/api/v0/manager/context` 合并通用、机型、工厂三层 `manager.config.json`。合并顺序为 `manager -> 机型目录 -> 工厂目录`，工厂同名模块可覆盖机型模块，不同名模块自动追加。

- **机型后台目录：** 新增系统参数 `FabricInspectionManagerFolder`，用于显式指定验布数据管理机型后台目录；当该参数为空且 `MachineProject == 11` 时，默认加载 `bfsmv1sponline` 机型后台。

- **V1SpOnline 复核贴标：** 新增 `bfsmv1sponline` 机型通用疵点复核、贴标队列和运行状态页面；新增 `/api/v0/bfsmv1sponline/review/*` 与 `/api/v0/bfsmv1sponline/label/queue` 接口。Web 只负责人工作确认 / 误检和队列查看，复核业务抽到 `BfsmV1SpOnlineReviewService`，确认后的保存、导出和贴标控制仍由 `TryLabellingV1SpOnline` 统一编排。

- **设备概览页：** 新增 `/api/v0/manager/overview` 和通用 `dashboard.html`，展示设备信息、运行状态、今日统计、检测模型、硬件摘要、磁盘使用率、相机信息和后台装配路径。该页面仅在调试模式或管理员权限下显示。

- **多语言支持：** 统一后台支持中文 / English，语言默认同步后台软件配置 `CurrentLanguage`；`manager.config.json` 的 `title`、`desc`、`group` 支持 `{zh,en}` 双语对象。

- **CMT 后台迁移：** CMT 数据导出接入统一后台，新增 `cmt/manager.config.json` 注册 `cmt_export` 模块，删除旧 `cmt/manager.html`；`cmt/pages/export.html` 改为使用统一前端对象 `BFSM`。

- **部署更新：** CMake 增加复制 `erpinterface/manager` 与 `erpinterface/bfsmv1sponline` 到运行目录；工厂目录仍按已有复制规则部署。


## 1.26.703.0（2026-07-03）

### 分时频闪加装更新



- `dev_light3` uninit更改在设备线程执行，否则异常。



### MessageBus 消息总线（替代 signal/slot）



- **新增 `MessageBus`**（PublicClass/Common/MessageBus.h/.cpp）：基于发布-订阅模式的线程安全消息总线，用于替代 `bfsmV1SpOnline` 中原有的 signal/slot 连接。

- **订阅/发布模式：** 支持按 topic 字符串订阅，发布时通过 `QMetaObject::invokeMethod` 将消息投递到订阅者所在线程的事件队列，避免跨线程 signal/slot 的队列拥堵问题。

- **消息类型定义：** `MessageTypeDef.h` 定义统一的 数据类型。



### 本地缓存优化大模型检测流程



- **检测重构（`detect_v1sp_online`）：** 采用本地缓存方式优化大模型检测流程，减少不必要的图像拷贝与内存分配。

- **预处理任务剥离（`task_detectionimage_preprocess.h`）：** 新增独立的图像预处理任务，从 `imageDispatcher` 消费图像，生成 `DetectionFrameMeta` 元数据，与检测任务解耦。

- **检测任务精简（`task_detector_v1sp_online.h`）：** 重构检测任务，从预处理队列获取 `DetectionFrameMeta`，推理结果写入 `m_workerTempQueue`。

- **图像数据结构：** `DetectionFrameMeta.h` 新增帧元数据结构，`DetectionImageData.h` 调整图像数据封装。



### bfsmV1SpOnline 整体重构



- **流水线升级：** `bfsmV1SpOnline` 整体采用 MessageBus 替代 signal/slot，改善多线程间的数据传递效率。

- **图像保存：** `ImageSaveV2` / `MainImageSaveV2` 适配 MessageBus 订阅模式，优化图像存储流程。

- **优雅停机：** 增加 `wait()` 接口，确保各模块（预处理、检测、图像保存）安全排空队列后再退出。

- **YoloApi 调整：** `YoloApi.h` 调整了sim模式下疵点数量。



### 单元测试



- **新增 `test_SimCameraSp_with_detector_task.h`：** 基于 MessageBus 的仿真相机+检测器任务压力测试，验证整个检测流水线的正确性与稳定性。



---

## 1.26.617.0（2026-06-17）

### 疵点多语言（defect_i18n / defect_map）

- 新增疵点多语言架构：以 **DefectID** 为稳定主键，名称外置 **defect_map.json**（不再依赖 Language XML 的 DefectSetting 段）
- C++：PublicClass/I18n/DefectNameResolver + DefectMasterSync；Linguist::getUIText 对 DefectSetting/DefectSettings 内部走 resolver
- Python：共用 PublicClass/ERP/erpinterface/defect_i18n.py；工厂仅维护 erpinterface/<factory>/defect_map.json
- 部署：config/defect_map.default.json（CMake 拷贝）+ erpinterface/<factory>/defect_map.json；exe 根目录不含 ResourceAll
- 存库策略：
ealdefects.Title / defects.Name 仍存中文；展示、报告、CSV、Web API（lang 参数）再翻译
- 详细说明见 **PublicClass/I18n/defect_i18n.md**

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
## 1.26.616.0（2026-06-16）


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
### 检测与机型 — bfsmV1Pro 单线模块


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
新增 **bfsmV1Pro** 单线（`MachineType::V1`）检测流水线，作为原 `bfsmV1` 的增强替代方案；**不修改** legacy `bfsmV1`、`task_detector`、`Detect` 等原有源码，Pro 逻辑独立在 `PublicFabricScanner/bfsmV1Pro/` 目录。

**启用方式：** 数据库参数 `bfsmV1.usePro = 1`（`MachineType` 仍为 `V1`）；启动日志关键字：`start bfsmV1Pro====单线检测多检测器 pro=========`。

**流水线架构（edge → detect → merge）：**

| 阶段 | 组件 | 职责 |
| --- | --- | --- |
| 入队 | `task_camera_feed_pro` | IKap（camtype=8）或 datamode=2 相机帧写入 `Line{N}` |
| 布边 | `task_edge_detect_pro` | 计算 `edgeLeft`/`edgeRight`，线程池执行自动调光缩略图 |
| 检测 | `Detect_*_pro` + `task_detector_pro` | 推理 + `DefectFilter` 过滤 + 异步存图，结果写入 `Line{N}Temp{i}` |
| 归并 | `task_merge_detect_pro` | 按 `yHead` 合并多 worker，**不在此阶段过滤** |
| 下游 | `TryLabelling` / `ImageSave` | 贴标、落库、PLC/ERP（与 V1 一致） |

**核心改进：**

- **Topic 平台化**（`pipeline_topics.h`）：`Line{N}` / `Line{N}Edge` / `Line{N}Temp{W}` / 合并结果 topic，单机默认 `bfsmV1Pro.lineId = 0`，便于后续扩展多线。
- **在飞帧屏障（FrameInflightTracker）**：merge 仅当 `targetYHead < min(inflight)` 时 emit，避免多 worker 并行导致贴标乱序。
- **DefectFilter 独立模块**（`defect_filter.h/.cpp`）：从 drawBox 抽离疵点过滤规则（布边、黑布 K8-1、边缘大框等），与 legacy `Detect::drawBoxAndGetLocalImg` 对齐。
- **DetectProMixin**：线程池处理 raw 1/8 缓存、色差、全帧存图；主线程推理 + 过滤；局部裁图/标注图异步落盘。
- **优雅停机**：`stop()` 时先 `stopCameraIntake`，再 `waitInflightIdle` → `drainProTempQueuesToOutput` → `waitBackgroundWorkDone`，避免 temp 队列尾部疵点丢失。
- **背压**：图像队列超过 `bfsmV1Pro.detectBacklogLimit` 时丢弃最旧帧，缓解多 detector OOM。

**主要参数：**

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `bfsmV1.usePro` | 0 | 1 启用 bfsmV1Pro |
| `bfsmV1Pro.lineId` | 0 | 流水线线号 |
| `bfsmV1Pro.detectorNum` | 1 | 并行 worker 数（1–8） |
| `bfsmV1Pro.stopInflightWaitMs` | 15000 | 停机等待 inflight 清空超时（ms） |
| `bfsmV1Pro.inflightStaleMs` | 0 | merge 被 inflight 卡住时的 watchdog（0=关闭） |

详细设计见 `PublicFabricScanner/bfsmV1Pro/bfsmV1Pro.md`。

---

### 检测与机型 — bfsmV1 多 detector 疵点归并优化


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
在 **仍使用 legacy `bfsmV1`**（`bfsmV1.usePro = 0`）且 **`detectorNum > 1`** 时，自动启用 **temp 队列 + merge + inflight** 归并链路，复用 Pro 侧 `task_merge_detect_pro` 与 `MergeRuntime`，解决多检测器并行时结果乱序、停机丢批等问题。

**工作机制：**

1. **自动开关：** `init()` 中 `m_useMergeInflight = (detectorNum > 1)`；`MergeRuntime::setup` 为每个 worker 绑定 `Line0Temp{i}` 物理队列，失败则回退为直接 push（无顺序保障）。
2. **检测输出分流：** 各 `Detect` 的 `outputDetectionResultQueue` 指向对应 temp 队列；`task_detector` 在推理作用域内通过 `FrameInflightGuard` 维护在飞 `yHead` 集合。
3. **有序归并：** `task_merge_detect_pro` 读取各 temp 队列队首，取最小 `yHead` 作为本批帧号；仅当该帧已全部 worker 出队且满足 inflight 屏障时，合并并按 `ty` 排序后 `pushSorted` 到 `DetectionResultQueue`（topic `Line0`）。
4. **inflight watchdog：** 参数 `bfsmV1.inflightStaleMs`（默认 0）> 0 时，若 merge 长期被 inflight 阻塞，超时后清空 inflight 状态使归并继续，避免贴标线程永久卡住（不删除队列内疵点 batch）。
5. **停机排空：** `stop()` Phase1 调用 `waitInflightIdle` + `drainToMergedOutput`，将 temp 中剩余批次按 `yHead` 顺序写入输出队列后再停止 task。

**主要参数：**

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `bfsmV1.stopInflightWaitMs` | 10000 | 停机等待在飞检测结束超时（ms） |
| `bfsmV1.inflightStaleMs` | 0 | merge 被 inflight 卡住时的兜底超时（ms），0=关闭 |

**与 bfsmV1Pro 的关系：** 归并算法与 Pro 共用 `task_merge_detect_pro`；legacy 路径仍使用原 `Detect`/`task_detector` 全链路，仅多 worker 时在检测与贴标之间插入 temp+merge 层。

---

### 打印与设备报警 — ESC 打印机状态报警


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
新增 **ESC 标签打印机软件报警位** `ESC_PRINTER_ERROR`，与 PLC/设备报警体系统一展示，便于现场及时发现打印机离线、缺纸、卡纸等异常。

**实现要点：**

- **状态轮询：** `SharedData::refreshEscPrinterAlarm()`（`SharedMemoryData_esc_printer_alarm.cpp`）在报警刷新周期内查找设备 `ESC_Printer`，调用 `dev_esc_printer::queryPlcAlarmState()`。
- **报警判定：** 设备未 enable 时不报警；未连接 → 报警并提示「打印机未连接」；`getPrinterState` 失败 → 报警并附带 SDK 错误；`status != 0` → 报警并输出 `describeEscPrinterStatus` 解析的具体状态（缺纸、开盖等）；正常 Ready 时清除报警。
- **配置注册：** `configs/plc_alarm.json` 增加 `ESC_PRINTER_ERROR`（中/英/越：`标签打印机状态异常` / `Label printer status abnormal`），类型 `device_error`。
- **展示与 API：** `SharedData::get_plc_alarm()` / `get_plc_alarm_json()` 聚合该位；报警文案支持附加 `ESC_PRINTER_ERROR_DETAIL` 明细（如「缺纸」）；状态栏 `RecentAlarm` 由 `refreshStatusBarRecentAlarm()` 每秒刷新（`MainUI` 定时器 + PLC 周期读共用，与 Web API 同源）；`PLCMessageHandler` 轮播展示。
- **全局变量：** 同步写入 `global.escPrinter.alarm`、`global.escPrinter.statusDetail`，供 Web/脚本读取。
- **bfsmV1Pro 集成：** Pro 机型 `init()` 中注册 `dev_esc_printer` 设备，与 legacy 机型一致。

---

### 界面与 Web — CEF 退出流程优化


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
针对 **关闭主窗口时 CEF 后台线程（`CrBrowserMain`）仍在运行、主线程阻塞于模态框** 导致的 `libcef.dll` 断言崩溃（如 `0x80000003`），优化 CEF 与 Qt 主窗口的协同退出顺序。

**核心改动：**

- **`MainUI::closeEvent` 调整：** 运行中（`machine_state == 1`）仍禁止退出；用户确认退出后、调用 `event->accept()` 之前，先执行 `BCefDialog::prepareApplicationExit()`，避免主窗口已关闭而 CEF 浏览器进程/弹窗未收尾。
- **`BCefDialog::prepareApplicationExit()`（新增静态入口）：** 遍历所有顶层 `BCefDialog`；`ManagedPopup` 弹窗走 `requestCloseFromWeb(0)` 统一关闭；`EmbeddedMain` 整页先 `browserStopLoad()` 再 hide；随后 `processEvents` + 短等待（默认 600 ms），给 CEF native 线程收尾时间。
- **生命周期区分（`LifetimeMode`）：** ERP/帮助/漏检等为 `ManagedPopup`（延迟销毁）；主界面整页 CEF 为 `EmbeddedMain`，退出时不误触发 `deleteLater` 链式销毁。

**适用场景：** `layout >= 3` 使用 CEF 主界面，或现场启用 Web 弹窗（ERP、帮助页等）的机型；与 `DISABLE_CEF` 编译开关兼容（未定义 CEF 时不编译上述调用）。

---

### 稳定性与诊断 — CrashSEH / Minidump 生成优化


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
增强未处理 SEH 异常时的 **minidump 信息密度** 与 **旁路可读报告**，便于现场快速定位崩溃线程、模块与业务状态，并改善钉钉/服务端告警内容。

**Minidump 加厚：**

- 写 dump 时使用组合类型：`MiniDumpWithDataSegs | MiniDumpWithHandleData | MiniDumpWithThreadInfo | MiniDumpWithUnloadedModules | MiniDumpWithIndirectlyReferencedMemory`，提升 WinDbg/Visual Studio 栈还原能力。
- **`MINIDUMP_EXCEPTION_INFORMATION.ThreadId` 与故障线程一致**（传入真实 `faultTid`，非 worker 线程 tid），避免 dump 中异常上下文错位。
- 独立工作线程写 dump（4 MB 栈），降低 SEH 回调栈溢出风险。

**旁路报告（与 `.dmp` 同目录）：**

| 文件 | 内容 |
| --- | --- |
| `{timestamp}.dmp.crash.json` | 异常码/地址、故障线程名、进程线程列表（含是否主线程）、已加载模块、业务快照 |
| `{timestamp}.dmp.crash.txt` | 上述信息的纯文本摘要，便于现场直接打开 |

**业务快照（`business` 字段）包括：** `machine_state`、`CurrentY`、`quitapp`、`ImageObjectPool` 池状态（key 数量/占用）、模型状态等，辅助区分「CEF/检测/内存池」类问题。

**崩溃处置流程优化：**

- `installCatchExceptionAndGenDump()` 启动时记录 `s_mainThreadId`，sidecar 中标注主线程与故障线程。
- SEH 回调中：`quitapp = true` → `releaseAllImageCaches()` 释放 raw 预览/色差/调光等 QImage 缓存 → `save_all()` / `global_save()`，减少崩溃时残留大块图像内存。
- `buildCrashNotifyText()` 生成结构化钉钉文案（异常、线程、sidecar 路径）；minidump 失败时仍尝试写 sidecar。
- 正常退出 `appShutdown()` 同样调用 `releaseAllImageCaches()`，与崩溃路径一致释放图像缓存。

**依赖头文件：** `catchExceptionAndGenerateDump.h` 增加 `tlhelp32.h`（线程枚举）、`Psapi.lib`（模块信息）。

---

## 1.26.528.0（2026-05-28）


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
### 相机与采集
- 新增移动中相机触发超时报警：布面移动时若超过 1 秒无采集回调，触发 PLC 报警 `CAM_TRIGGER_TIMEOUT`，恢复回调后自动清除。
- 新增 `SimCameraCrop` 仿真裁切相机；四相机机型 testmode=2 且 `CameraDeviceType=88` 时可离线测试 `IKapCamera2Crop` 四分割回调。
- 统一 IKap / DALSA 相机 open·close 线程归属与触发自检逻辑。
- 新增系统参数 `IKapCameraTriggerSelfcheckIntervalMs`（触发自检间隔，默认 200 ms）。

### 打印
- ESC 打印机打印二维码前校验连接与硬件就绪状态，失败时返回明确错误。
- 打印机状态与错误提示支持中/英/越三语。
- `debugprinter` 调试页增加内联错误展示；PLCTest 提示框支持自动关闭。

### 界面与调试
- 重构 `debugsheet` 检验单字段配置页：搜索过滤、拖拽排序与字段管理交互优化。

### 数据库
- SQLite 增加 `busy_timeout=30000`，降低与 ERP 上传脚本并发访问时的锁冲突。

### ERP 与客户
- 福德士 ERP：更新上传脚本、`init_db`、检验键映射及 `erpinput` 录入界面。
- Bullmer 云平台上传脚本优化：自动向上查找 `FabricInspectionSystemNew.db`、只读连接查询、CSV 上传日志。

---

## 1.26.526.0（2026-05-26）


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
### 相机与采集
- 新增海康相机 HkCamera2 采集链路，优化多相机取图稳定性。
- 重构 MVS 相机封装（CMvCamera），提升相机初始化与异常处理。
- 优化 IKapCamera2 裁剪取图与 ImageObjectPool 内存池管理。

### 检验记录
- 修复检验记录查询字段后缀解析问题，保障自定义表头筛选与刷新正确。

### 界面与多语言
- 完善越南语界面翻译与 StyleSheet_vi / StyleSheet_white_vi 样式适配。
- 标题栏支持语言切换，Linguist 加载逻辑优化。
- 优化疵点设置、疵点辅助选择等界面交互。

### ERP 与客户
- 更新福德士、苏美达等 ERP 接口脚本与数据库维护脚本。

---

## 1.26.521.0（2026-05-21）


## 1.26.617.0（2026-06-17）

### bfsmV1Pro — ImageSavePro + 共享原图管线

- 新增 `bfsmV1Pro/save/ImageSavePro.*`：全图 `PooledConstImage`，复用 MainImageSaveV2 / AsyncImageWriter
- `pro_image_handle`：边界 adopt + ProFrameRef 归还 IOP
- IsSaveAllImage 全图由 edge 后台 `dispatchEdgeArchiveSave` 归档；疵点全图仍由 detect 后台 hooks 投递
- `bindImageSavePro(m_imgSavePro)`；监控 `global.savePlan=ImageSavePro`
### 报告
- 新增 CMT 单页验布报告，支持中英文显示。
- 修复 report3 多语言、疵点图片与 API 导出问题。

### 检测与机型
- 修复 bfsmv1cam4 检测器 ID 映射及四相机机型异常弹窗。
- 修复 IKapCamera2 与 ImageStitcher2 拼接链路问题。

### 打印
- 修复 ESC 打印机字符串与参数传递问题。

### 国际化
- 更新越南语翻译资源。

---

> 完整功能说明见帮助文档，或访问 `http://localhost:1234/views/newhelp`。
