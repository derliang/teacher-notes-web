# 第三方元件聲明：座位表「拍照填入」辨識元件

本資料夾的檔案是第三方開源元件，**原樣收錄、未修改**，僅用於網頁版的座位表拍照辨識（辨識在使用者自己的裝置上執行，照片不會上傳）。
這些元件的授權各自獨立，**不受**本專案 `LICENSE.md`、`COPYRIGHT.md` 的條款影響。GAS 版組建不包含本資料夾。

只從 npm 官方套件取得，版本固定如下（取得日期 2026-10-25）：

| 元件 | npm 套件與版本 | 授權（套件宣告） | 上游 |
|---|---|---|---|
| Tesseract.js（主程式、worker） | `tesseract.js@7.0.0` | Apache-2.0 | https://github.com/naptha/tesseract.js |
| Tesseract.js Core（辨識引擎 WASM） | `tesseract.js-core@6.1.2` | Apache-2.0 | https://github.com/naptha/tesseract.js-core |
| 繁體中文模型 chi_tra | `@tesseract.js-data/chi_tra@1.0.0`（`4.0.0_best_int`，已解壓縮） | 套件宣告 MIT；模型本身源自 Tesseract `tessdata_best`，上游為 Apache-2.0 | https://github.com/tesseract-ocr/tessdata_best |

## 檔案與 SHA-256

| 檔案 | 來自 | SHA-256 |
|---|---|---|
| `tesseract.min.js` | `tesseract.js@7.0.0` 的 `dist/tesseract.min.js` | `000c27d9cd0def655f77b36c72a389c0ab13793aa31cb4d7aab56d09c0afbc7e` |
| `worker.min.js` | `tesseract.js@7.0.0` 的 `dist/worker.min.js` | `576b7df7e3393e137e51849357c9adb53fe7ac1bb69bfa06cf3d61520f182c6d` |
| `tesseract-core-simd-lstm.wasm.js` | `tesseract.js-core@6.1.2` 同名檔 | `9d7c43fb206dc9f48475228b46bf35f888fa9e6259da2e67d5a75c77049f2dc7` |
| `chi_tra.traineddata` | `@tesseract.js-data/chi_tra@1.0.0` 的 `4.0.0_best_int/chi_tra.traineddata.gz` 解壓縮 | `6abfb87cce5db0d09624f16eedd8a0b24173718856121f721b6d1214193d4dab` |

驗證：`sha256sum *` 應與上表一致。

## 授權全文

- `licenses/tesseract.js.LICENSE.md`：Tesseract.js（Apache License 2.0，取自套件內 `LICENSE.md`）
- `licenses/tesseract.js-core.LICENSE`：Tesseract.js Core（Apache License 2.0，取自套件內 `LICENSE`）
- 繁中模型：npm 套件未附授權檔，僅在 `package.json` 宣告 MIT；模型內容上游 tessdata_best 採 Apache License 2.0，全文與上列相同（Apache-2.0）。
- `tesseract.min.js`、`worker.min.js` 內另含 regenerator-runtime、buffer、ieee754、zlib.js 等打包進來的 MIT／BSD-3-Clause 程式碼，其版權標示保留在檔案開頭的註解中。
