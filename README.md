# 验布机软件更新说明


## 1.26.0807.095638（2026-08-07）

### 发布

- **精简安装包重发：** 全量重编并同步 views / ERP / 现场调试文档后发布，版本与 About「检查更新」一致。

### 调试 / 现场向导

- **现场教程：** 保留 bfsmV1 / V1Sp 六步向导、实时叠加预览与报告导出能力。


## 1.26.0807.091953（2026-08-07）

### 调试 / 现场向导

- **现场调试向导入包：** 同步 bfsmV1 / V1Sp 现场教程页、导航入口与预览接口，覆盖机型确认、布边、分辨率、贴标与报告导出。

### 灯光 / 设备

- **灯光控制完善：** 优化 `dev_light3` 与灯光设置面板联动，提升现场调光稳定性。

### 磁盘 / 报警 / 调光

- **磁盘告警与自动调光：** 强制清理阈值才提示；无布停机后按新卷继续自动调光。

### 文档

- **售后现场调试文档：** 安装包携带 `docs/调试文档/`（含现场调试说明）。


## 1.26.0807.085529（2026-08-07）

### 调试 / 现场向导

- **bfsmV1 / V1Sp 现场调试向导：** 提供六步引导与右侧实时叠加预览（边线/布幅/贴标参考线），报告写入 `configs/field_tutorial_report_*.json`，便于售后现场逐步验收留档。
- **Debug 导航入口：** Debug 面板增加「现场教程」入口，分别覆盖单线与分时频闪机型。

### 磁盘 / 报警

- **磁盘告警收敛：** 仅在图像磁盘达到强制清理阈值时提示；`DISK_USAGE_FORCE` 按警告级别展示，减少状态栏刷屏。

### 界面 / About

- **测试模式醒目标识：** `IsTestMode>0` 时 About 显示红色提示，避免现场误用模拟环境交机。

### 检测 / 自动调光

- **无布停机后重新调光：** 自动调光模式在无布停机后跳过旧卷布尾，新布从头继续调光。

### 文档

- **现场调试文档：** 同步售后向现场调试说明与截图至安装包 `docs/调试文档/`。


## 1.26.0806.165722（2026-08-06）

### 调试 / 现场向导

- **bfsmV1 现场调试向导：** `/views/debugfieldtutorial` 六步引导（机型 → 缓存 → 布边 → 分辨率 → 贴标 → 导出），右侧实时叠加预览边线/布幅/贴标参考线，便于现场逐步验收。
- **bfsmV1Sp 分时频闪向导：** 新增 `/views/debugfieldtutorial_v1sp`，覆盖 `MachineProject=1`、IKapCamera2Sp 分割参数、双线布边（青/紫）与 `TicketOffset`/`TicketOffset2`、`ClothStopOffset`/`ClothStopOffset2`。
- **双线边预览接口：** `/api/v0/debug/ticket/frame` 增加线1 `DetectEdgeLeft2/Right2` 叠加；报告按机型写入 `configs/field_tutorial_report_v1.json` / `field_tutorial_report_v1sp.json`（含时间戳备份）。

### 文档

- **现场调试文档：** 补充 V1 / V1Sp 向导入口；`分时频闪机型.md` 增加向导说明。


## 1.26.0806.104923（2026-08-06）

### 磁盘 / 报警

- **磁盘告警仅严重占用触发：** 图像磁盘占用达到强制清理阈值（默认 ≥90%）时才发钉钉通知与状态栏提示；常规预警阈值（默认 75%）仍触发清理，不再报警刷屏。
- **严重占用按警告展示：** `DISK_USAGE_FORCE` 由严重报警改为警告级别（橙色），状态栏不再以红色严重报警显示。

### 调试 / 现场教程

- **现场教程页：** Debug 面板新增「现场教程」页面，支持步骤指引与票样预览；报告可读写 `configs/field_tutorial_report.json`（含备份），便于现场验收留档。


## 1.26.0806.080500（2026-08-06）

### 界面 / About

- **测试模式醒目标识：** `IsTestMode>0` 时 About 页显示红色提示条（全模拟 / 半模拟），避免现场误当正式环境使用。

### 检测 / 自动调光

- **无布停机后重新调光：** `IsAutoAdjustBrightnessMode=1` 在无布停机后跳过旧卷布尾区域，新布从头继续自动调光；`last_clothindex` 仅在实际执行调光时更新，避免误跳过。

### 发布 / 运维

- **发行仓库切换：** 安装包发布目标改为 `kkk-bfs/bfs`；发版时同步完整 `更新说明.md` 为仓库 `README.md`，About「检查更新」仍从 MySQL `releases.download_url` 拉取。


## 1.26.0805.161734（2026-08-05）

### ERP / CMT 报表

- **疵点评分与幅宽记录：** CMT `reportgen` 按 DefectID 多语言显示疵点名，按码段汇总扣分（单码最多 4 分）；幅宽记录排除首尾各一段后按三列排版进报告模板。

### PLC / 远东

- **除尘寄存器地址校正：** `plcregisters.json` 中 `dust_cleaner` 地址由 `73` 调整为 `6D`（`400110`），与现场 PLC 映射一致。


## 1.26.0805.143030（2026-08-05）

### ERP / 任务加载

- **避免重复加载上传任务：** 工厂目录（`ERP_FACTORY_FOLDER`）已加载 `erp_upload` / `erp_webupload` / `erp_bullmerupload` / `erp_backup` 前缀任务时，不再从默认 `erpinterface` 根目录重复创建同前缀任务，避免双任务并发上传。

### 相机 / 模拟模式

- **测试模式相机统一：** `IsTestMode=1/2` 时一律使用 `DALSASim` 模拟相机，避免 `CameraType=8` 误开真实 IKap 采集卡。

### ERP / 报喜鸟

- **上传间隔：** `database_maintain.sql` 将 `ERPUploadInterval` 设为 `35` 秒，降低 ERP 上传频率压力。


## 1.26.0805.085718（2026-08-05）

### 相机 / 模拟模式

- **测试模式相机统一：** `IsTestMode=1/2` 时一律使用 `DALSASim` 模拟相机，避免 `CameraType=8` 误开真实 IKap 采集卡。

### ERP / 报喜鸟

- **上传间隔：** `database_maintain.sql` 将 `ERPUploadInterval` 设为 `35` 秒，降低 ERP 上传频率压力。


## 1.26.0804.091320（2026-08-04）

### 设备 / 运维

- **安装日期：** 新增系统参数 `InstallDate`（首次启动写入 `yyyy-MM-dd`）；About 页展示；`task_test` 同步到云端 MySQL `machine.installdate`（库表由 `scripts/mysql/add_machine_installdate.py` 维护）。


## 1.26.0803.135303（2026-08-03）

### 相机 / IKap

- **可选加载采集卡配置：** 新增系统参数 `IKapCameraEnableLoadConfig`（默认 `0` 关闭）。仅开启时，`IKapCamera` 初始化才加载 `configs/{序列号}.vlcf`，避免现场默认误加载配置文件。


## 1.26.0801.155652（2026-08-01）

### 报表 / 疵点统计

- **疵点数量汇总结果表扩展：** `bfsdefectstats` 结果表增加码长、幅宽、总扣分列；`/api/v0/sheets/defectstats` 同步返回 `length` / `width` / `totalPoints`，导出 CSV 一并包含。


## 1.26.0731.152639（2026-07-31）

### 设备 / 调试

- **触摸板设备接入：** 新增 `dev_touchpad` 与调试页 `debugtouchpad.html`，支持串口开闭、端口设置与帧状态查询（`/api/v0/devices/touchpad/*`），便于现场联调触摸板。
- **IKap 相机序列号：** 设备信息增加 `serialNumber` 字段，便于多相机识别与排查。

### ERP / 远东

- **缓存文件命名与清理：** 远东接口拉取明细缓存改为 `temp_日期_仓位_*.xml/json`，仅清理带日期前缀的过期缓存，避免误删非日期命名文件；仓位查询缺省 `date` 时默认当天。


## 1.26.0731.135710（2026-07-31）

### PLC / 远东

- **除尘装置随软件开关：** 远东工厂（`yuandong`）软件启动时向 PLC `VW218`（`400110` / `0x73`）写 `1` 开启除尘装置，关闭软件时写 `0` 关闭，避免退出后装置继续运行。


## 1.26.0731.081611（2026-07-31）

### 版本号

- **版本精确到秒：** 第四段由小时改为 `HHMMSS`（如 `081611`），About / 安装包文件名 / 更新说明统一为 `1.26.月日.时分秒`（例 `1.26.0731.081611`）。

### 钉钉 / 报表摘要

- **幅宽与贴标摘要可读化：** 统计/日报中的机型参数摘要，布边检测算法与布边贴标模式改为中文名称；贴标关闭时明确显示「贴标:关」，开启时展示 X/Y 偏移与布边模式文案。


## 1.26.0730.17（2026-07-30）

### 系统参数

- **参数热更新同步：** `updateSystemPara` 写入后同步更新 `SystemSetting` 成员与 `settings.*` 共享内存，避免仅改库未改内存导致打印/贴标等仍用旧值。
- **重载接口：** 新增 `GET /api/v0/settings/reload`（`LoadAllPara`）；帮助页启用打印机、二维码打印参数保存后自动重载，无需重启即可生效。

### 疵点顺序

- **排序配置解析报错：** `defect_order.json` 非法（如尾逗号）时不再静默回退默认顺序；日志 `qCritical`，接口返回 `defectOrderError`，人工标注/编辑页弹窗提示路径与解析错误。


## 1.26.0730.16（2026-07-30）

### 疵点顺序

- **工厂级排序配置：** 人工标注疵点列表优先读取 `erpinterface/<ERP_FACTORY_FOLDER>/defect_order.json`，不存在时回退 `configs/defect_order.json`；报喜鸟等工厂可单独维护顺序。
- **默认/报喜鸟顺序更新：** 同步针织常用疵点名称排序（标签、色点、经纬疵、色纤、横档等），未列出的类型仍追加在末尾。


## 1.26.0730.12（2026-07-30）

### 疵点设置

- **切换布种同步与去重：** 切换布种时，`DefectSetting` 与 `defects`（`IsDefaultCheck=1`）及默认方案对齐；同一布种下同一 `DefectID` 多行重复时只保留一条，并统一名称，避免列表出现重复疵点。


## 1.26.0730.11（2026-07-30）

### 疵点与界面

- **自定义疵点列表行号：** `custom_defects` 增加「行号」列；开启「只显示已启用」或搜索过滤后，按当前可见行从 1 连续重排。


## 1.26.0730.09（2026-07-30）

### ERP / 报喜鸟

- **针织默认疵点名称同步：** `database_maintain.sql` 末尾按 `defect_default.md` 同步更新 `Name` 与 `CustomerName`（标签、污渍/油污、经疵、纬疵、色纤、针孔边、花布边、擦伤、横档等），安装后维护脚本即可生效。


## 1.26.0730.08（2026-07-30）

### 发布与工具

- **一键打包发布：** `build-release-installer.bat` 串联编译 → `updateviews`/`updateerp` → ISCC 精简包 → GitHub/MySQL；支持 `nobuild` / `nopublish`。
- **更新说明自动起草：** 定时任务可通过 Cursor Agent 按当前小时版本追加 `更新说明.md` 章节，再打包发布。

### ERP

- **导出列 MistakeStopCount：** `cols.dat` 增加误停次数统计列，供导出模板选用。


## 1.26.0729.20（2026-07-29）

### 在线更新 / 发布

- **GitHub Releases 排序：** 新建 Release 前在 `mdkoss/bfs` 推送空 commit，再按新 commit 打 tag，避免多个版本共用同一 `created_at` 导致列表不按发布时间排序。


## 1.26.0729.19（2026-07-29）

### 版本号

- **版本号补零格式：** 月日固定为 `MMDD`（如 `0729`）、小时固定为 `HH`（如 `08`），About / 钉钉 / 安装包文件名统一为 `1.26.0729.HH`；并修复 About、钉钉版本未随 `version.h` 重编的问题。


## 1.26.729.18（2026-07-29）

### 在线更新

- **检查更新超时卡死：** About「检查更新」改为后台线程查询云端版本，并设置 MySQL 连接/读写超时与 UI 超时；网络不通时不再冻住界面，超时后提示并可重试。

### ERP / 打印

- **报喜鸟 ZPL 打印超时：** 默认改走 Windows 本机队列 RAW（`ZPL_PRINTER_TRANSPORT=windows`），发送前探测脱机/暂停，大图分块写入，避免误连不可达 IP 导致「发送打印任务超时」。
- **ERP 静态目录可浏览：** 浏览器访问 `/erpinterface` 可列出并下载程序目录下 ERP 文件，便于现场核对脚本与配置。

### 疵点与界面

- **针织默认疵点目录更新：** 同步 `defect_default` 名称/编号（标签、经纬疵、色纤、横档等）。
- **贴标测试「打印二维码」：** 按系统参数 `IsEnableESCPrinter` 显示，不再依赖设备列表中已有 ESC 打印机条目。

### 文档

- **验布机调试文档：** 补充布边/视觉幅宽等参数说明，便于现场排查。


## 1.26.729.17（2026-07-29）

### 在线更新

- **检查更新超时卡死：** About「检查更新」改为后台线程查询云端版本，并设置 MySQL 连接/读写超时与 UI 超时；网络不通时不再冻住界面，超时后提示并可重试。


## 1.26.729.15（2026-07-29）

### 编码器

- **码长编码器反向误停机无法再启动：** 修复 `task_cloth_weight` 反向检测仅看 `machine_state==1`、报警后每圈重复 `Stop()` 的问题；改为仅在前进运行（`!IsStop && !IsReversal`）时检测，停机/反转时刷新基准并清报警，`Stop()` 仅首次触发一次。


## 1.26.729.14（2026-07-29）

### 检测与安装包

- **模型推理自检默认关闭：** `EnableModelInferenceSelfTest` 默认改为 0，避免启动时额外跑 Python 自检影响开机速度。
- **自检脚本去 OpenCV 依赖：** `model_inference_selftest.py` 改为标准库生成/读取 BMP，安装环境无需 cv2/numpy。
- **精简安装包附带自检脚本：** `setup-release-slim.iss` 打包 `erpinterface/model_inference_selftest.py`，现场可按需开启自检。


## 1.26.729.8（2026-07-29）

### 光源

- **停机超时关灯策略调整：** `task_stop_timeout_light` 在验布中/暂停（`machine_state=1/2`）且停机超时后关灯；默认超时由 10s 调整为 **60s**（`LightTimeoutTask.TimeoutSec`）。恢复移动时本任务不再直接开灯，仅清计时，开灯改由「继续验布 / PLC 物理启动」入口负责。
- **PLC 物理启动恢复光源：** 新增 `task_light_physical_resume`；PLC 从停止变为运行时发布 `physicalResumeSeq`，若光源此前因超时关闭则自动 `turnOnAll`。
- **暂停验布关灯：** 实时检测「暂停」统一关闭光源，并标记 `global.light.offByStopTimeout`；「继续」开灯后清除该标记。
- **空闲亮灯也计超时：** 未开验布（`machine_state=0`）但灯仍亮时，同样按超时关灯，避免停机后灯长时间常亮。


## 1.26.728.17（2026-07-28）

### 光源

- **停机超时关灯策略调整：** `task_stop_timeout_light` 在验布中/暂停（`machine_state=1/2`）且停机超时后关灯；默认超时由 10s 调整为 **60s**（`LightTimeoutTask.TimeoutSec`）。恢复移动时本任务不再直接开灯，仅清计时，开灯改由「继续验布 / PLC 物理启动」入口负责。
- **PLC 物理启动恢复光源：** 新增 `task_light_physical_resume`；PLC 从停止变为运行时发布 `physicalResumeSeq`，若光源此前因超时关闭则自动 `turnOnAll`。
- **暂停验布关灯：** 实时检测「暂停」统一关闭光源，并标记 `global.light.offByStopTimeout`；「继续」开灯后清除该标记。
- **空闲亮灯也计超时：** 未开验布（`machine_state=0`）但灯仍亮时，同样按超时关灯，避免停机后灯长时间常亮。


## 1.26.728.16（2026-07-28）

### 安装包与文档

- **验布机调试文档入包：** `updateviews` 同步 `docs/调试文档` 到安装目录，便于现场查阅调试说明与截图。
- **版本资源恢复小时段：** PE / 安装包版本号恢复为四段（`主.年.月日.小时`），与 About「检查更新」比对口径一致。

### 在线更新

- **发布附带更新说明：** 发布脚本自动从 `更新说明.md` 抽取当前版本章节，写入 GitHub Release 与 MySQL `release_notes`。


## 1.26.727.15（2026-07-27）

### 版本号与在线更新

- **版本精确到小时：** 软件版本第四段由日级改为小时（`主版本.年份.月日.小时`，如 `1.26.727.15`），安装包文件名与 About「检查更新」比对口径一致。
- **检查更新：** About 界面支持查询云端 `releases` 表、下载 GitHub 安装包并以静默方式启动安装；发布流程同步写入 GitHub Release 与 MySQL。

### 光源

- **结束验布后再开始验布光源不亮：** 修复 `bfsmV1` / `devlight` 在结束验布只关灯不关串口、开始验布因时序未 `turnOnAll` 的问题；串口打开失败后清理错误状态以便重试。

### ERP

- **周期任务间隔：** `erp_upload` / `erp_webupload` / `erp_backup` 等按系统参数读取间隔（秒），不再固定 600s。
- **脚本执行日志：** 补充 `jobId`、退出码、stdout/stderr 等摘要，便于排查上传成败。

### 稳定性与相机

- **ImageObjectPool 随机闪退：** 修复停机还池 / 辅图池化场景下错误释放导致的堆损坏（`c0000374`）。
- **相机触发间距报警：** IKap 相邻发图 Y 间距过短跳过发图并报 `CAM_TRIGGER_INTERVAL_TOO_SHORT`；过长仍发图并报 `CAM_TRIGGER_INTERVAL_TOO_LONG`。
- **ESC 打印机报警：** 未连接时状态栏提示 `ESC_PRINTER_ERROR`，连接恢复后自动清除。

### 业务与页面

- **换卷 / 导出疵点：** 完善换卷疵点按 Remarks 更新与导出时疵点数据保存。
- **称重流程：** 梳理并加固 WeightMode（收卷/放卷）开卷称重、无布停机与净重落库路径。
- **疵点汇总统计页：** 新增 `bfsdefectstats`（`/newviews/defectstats`），按日期/款号/缸号/匹号汇总疵点并支持导出。


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
