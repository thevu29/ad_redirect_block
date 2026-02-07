# Chặn redirect / mở tab mới (WBlock iOS)

Script dùng trong **User Script** của **WBlock** trên iOS: chặn redirect sang domain khác và mở tab mới; chuyển tập (cùng site) mở trong **cùng tab**.

## Script làm gì?

- **Cùng site (cùng domain):** Cho phép. Ví dụ chuyển từ tập 1 → tập 2 trên web xem phim: nếu web mở tập 2 bằng tab mới (`target="_blank"` / `window.open`), script sẽ **chuyển sang tập 2 trong cùng tab** thay vì mở tab mới.
- **Sang domain khác:** Chặn (Shopee, TikTok, quảng cáo, v.v.).

## Setup trong WBlock (iOS) – dùng link

WBlock **không có ô dán code**, chỉ có **import file** hoặc **dán link public** tới file JavaScript. Cần dùng **link file raw**, không dùng link trang xem file.

### ⚠️ Link phải là Raw, không phải trang GitHub

| Loại | Ví dụ | Kết quả |
|------|--------|--------|
| **Sai** (trang xem file) | `https://github.com/USERNAME/ad-redirect-block/blob/main/wblock-block-redirect.user.js` | WBlock tải về **HTML** (trang GitHub), không chạy được script. |
| **Đúng** (file raw) | `https://raw.githubusercontent.com/USERNAME/ad-redirect-block/main/wblock-block-redirect.user.js` | WBlock tải đúng **nội dung .js**, script chạy được. |

### Cách 1: Tự tạo link Raw (không cần bấm Raw)

Khi bấm **Raw** trên GitHub, nhiều trình duyệt sẽ **tải file xuống** thay vì mở trang → không có URL để copy. Bạn có thể **tự gõ / copy link** theo mẫu sau (thay đúng tên user và nhánh):

```text
https://raw.githubusercontent.com/TÊN_USER_GITHUB/ad-redirect-block/main/wblock-block-redirect.user.js
```

- Thay **TÊN_USER_GITHUB** bằng tên tài khoản GitHub của bạn (ví dụ: `minhduc`).
- Nếu repo dùng nhánh khác thì thay **main** (ví dụ: `master`).

Ví dụ: user là `minhduc` → link là  
`https://raw.githubusercontent.com/minhduc/ad-redirect-block/main/wblock-block-redirect.user.js`

Copy link đó và dán vào WBlock (mục nhập link script).

### Cách 2: Tải file rồi Import trong WBlock

1. Trên GitHub, mở file `wblock-block-redirect.user.js` → bấm **Raw** (file sẽ tải xuống máy).
2. Trong WBlock chọn **Import file** (hoặc tương đương).
3. Chọn file `wblock-block-redirect.user.js` vừa tải → WBlock sẽ dùng nội dung file đó làm script.

### Các bước trong WBlock

1. Mở **WBlock** → **Cài đặt** → **User Script** / **Custom Script**.
2. **Thêm script** → chọn kiểu **Link** / **URL** (không chọn “paste code” vì không có).
3. Dán link **raw** (dạng `https://raw.githubusercontent.com/...`).
4. Đặt tên (ví dụ: `Chặn redirect, chuyển tập cùng tab`).
5. Bật script, chọn **All websites** (hoặc chỉ site xem phim) → **Lưu**.

## Debug khi vẫn bị redirect (chỉ dùng iPhone, không cần Mac)

Tất cả bước dưới đây làm **trên iPhone** (Safari iOS). Không cần Mac.

### 1. Bật chế độ DEBUG trong script

Trên máy tính (hoặc GitHub trên điện thoại), mở file `wblock-block-redirect.user.js`, tìm dòng:

```javascript
const DEBUG = false;
```

Đổi thành `const DEBUG = true;`, lưu và push lên GitHub (hoặc Import lại file vào WBlock).

Trên **iPhone**, mở Safari (qua WBlock), vào đúng trang hay bị redirect:

- **Khi vào trang:** tiêu đề tab sẽ đổi thành `[Block Redirect] Script OK` khoảng 2 giây → script **đã chạy**.
- **Khi bạn tap và script chặn:** sẽ hiện **alert** kiểu "Đã chặn link (domain khác): ..." hoặc "Đã chặn mở tab: ..." → script **có bắt được** hành động đó.

**Cách đọc:**  
- Không thấy tiêu đề đổi → script có thể không chạy (kiểm tra WBlock, link, phạm vi áp dụng).  
- Thấy tiêu đề đổi nhưng vẫn redirect và **không** có alert → trang dùng cách khác (iframe hoặc context khác), script có thể không chặn được.  

Sau khi debug xong, đổi lại `DEBUG = false` rồi cập nhật script trong WBlock.

### 2. Test script trên Mac (không dùng WBlock)

**WBlock chỉ có trên iPhone**, không có app Mac. Để test và debug script trên Mac:

1. Cài extension **userscript** trên trình duyệt Mac:
   - **Safari (Mac):** [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089) (App Store) hoặc [Userscripts](https://apps.apple.com/app/userscripts/id1463298887).
   - **Chrome / Edge:** [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) hoặc [Violentmonkey](https://violentmonkey.github.io/).
2. Mở trang cài extension → **Thêm script mới** → copy toàn bộ nội dung file `wblock-block-redirect.user.js` và dán vào → lưu.
3. Mở **cùng trang web** hay bị redirect (trên Mac), thử click như trên iPhone.
4. Mở **DevTools** (Cmd+Option+I) → tab **Console** để xem log `[Block Redirect] ...`; có thể đặt breakpoint trong Sources để debug.

Script giống hệt nhau; nếu trên Mac chặn được thì trên iPhone (WBlock) logic cũng đúng. Nếu trên Mac chặn được nhưng trên iPhone vẫn redirect, nhiều khả năng WBlock inject script ở context khác (isolated world).

### 3. Xem console của Safari trên iPhone (cần Mac)

Trên **chỉ iPhone** không xem được console. Nếu bạn **có Mac**, cắm iPhone vào Mac → Safari (Mac) → **Develop** → chọn iPhone → chọn tab → mở **Console** để xem log `[Block Redirect] ...`. Không bắt buộc; test trên Mac bằng Tampermonkey (mục 2) thường tiện hơn.

### 4. Vì sao vẫn có thể bị redirect?

- **Script chạy trễ:** WBlock có thể inject sau khi trang đã chạy. Trong WBlock thử bật tùy chọn “Chạy sớm” / “Document start” (nếu có).
- **Redirect trong iframe:** Nếu trang nhúng iframe và redirect xảy ra trong iframe, script chỉ chạy trong trang chính, không chạy trong iframe.
- **Context khác (isolated world):** Một số app chặn quảng cáo chạy userscript trong “content script” tách biệt với trang. Khi đó việc ghi đè `window.open` / `location` của script **không** ảnh hưởng đến code JavaScript của trang (trang vẫn dùng `window.open` gốc). Khi đó chỉ có thể chặn được **click trên link** (event trên document). Nếu trang dùng `onclick` gọi `window.open()` mà không qua thẻ `<a href>`, script có thể không chặn được. Cách kiểm tra: bật DEBUG; nếu không có alert khi redirect thì khả năng cao là trường hợp này.

## File trong repo

- `wblock-block-redirect.user.js` – script chính.
- `README.md` – hướng dẫn (file này).

## Lưu ý

- Script chạy phụ thuộc cách WBlock inject (document start/end). Nếu vẫn bị redirect/tab mới, thử bật tùy chọn “chạy sớm” (nếu có).
- Chỉ dùng trên thiết bị của bạn; tuân thủ điều khoản WBlock và trang web bạn truy cập.
