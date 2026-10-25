# 第三方元件聲明：座位表「匯入檔案」的 PDF 讀取元件

本資料夾的檔案是第三方開源元件，**原樣收錄、未修改內容**（只把副檔名 `.mjs` 改成 `.js`，讓各種靜態主機都用 JavaScript 的類型送出），僅用於網頁版座位表匯入 PDF（在使用者自己的裝置上讀取，檔案不會上傳）。
這些元件的授權各自獨立，**不受**本專案 `LICENSE.md`、`COPYRIGHT.md` 的條款影響。GAS 版組建不包含本資料夾。

只從 npm 官方套件取得，版本固定如下（取得日期 2026-10-25，該版本發佈於 2026-10-03）：

| 元件 | npm 套件與版本 | 授權 | 上游 |
|---|---|---|---|
| PDF.js（相容舊瀏覽器的 legacy 組建） | `pdfjs-dist@6.4.299` | Apache-2.0 | https://github.com/mozilla/pdf.js |
| 字元對照表（CMap，只收繁體中文相關與 Identity） | 同上套件的 `cmaps/` | Adobe 的 BSD 式授權，見 `cmaps/LICENSE` | https://github.com/adobe-type-tools/cmap-resources |

## 檔案與 SHA-256

| 檔案 | 來自 | SHA-256 |
|---|---|---|
| `pdf.min.js` | `pdfjs-dist@6.4.299` 的 `legacy/build/pdf.min.mjs` | `bccc24ea711db8e44503629519904a5292d73b9daaa214bbe7cdcc282b0f4259` |
| `pdf.worker.min.js` | `pdfjs-dist@6.4.299` 的 `legacy/build/pdf.worker.min.mjs` | `145d2dd3ab0c86151011dba95acfa2d5336e2accd59388ea43dbee0efddaaec6` |
| `cmaps/*.bcmap` | `pdfjs-dist@6.4.299` 的 `cmaps/` 中檔名含 CNS、B5、HK 與 Identity 的 44 個檔 | 與套件內同名檔相同 |

驗證：`sha256sum pdf.min.js pdf.worker.min.js` 應與上表一致。

## 授權全文

- `LICENSE`：PDF.js（Apache License 2.0，取自套件內 `LICENSE`）
- `cmaps/LICENSE`：Adobe CMap 資源授權（取自套件內 `cmaps/LICENSE`）

## 使用方式與安全設定

`src/js_seatdoc.html` 在老師選了 PDF 檔之後才用 `import()` 載入 `pdf.min.js`，並設定 `isEvalSupported: false`、`enableXfa: false`；只讀第 1 頁的文字與畫面，不執行 PDF 裡的程式。
