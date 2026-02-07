# Chặn redirect quảng cáo (WBlock iOS)

Script dùng trong **User Script** của ứng dụng **WBlock** trên iOS để chặn việc click vào button/link bị redirect sang Shopee, TikTok, Lazada hoặc các trang quảng cáo/affiliate.

## Script làm gì?

- Chặn **click vào link** dẫn tới domain bị chặn (Shopee, TikTok, link rút gọn, affiliate…).
- Chặn **redirect bằng JavaScript** (`window.location`, `window.open`) tới các domain đó.
- Chặn **form submit** tới URL bị chặn.

Bạn có thể chỉnh danh sách domain trong file `wblock-block-redirect.user.js` (mảng `BLOCKED_DOMAINS`) để thêm/bớt trang cần chặn.

## Hướng dẫn setup trong WBlock (iOS)

### Bước 1: Mở WBlock và vào User Script

1. Mở ứng dụng **WBlock** trên iPhone/iPad.
2. Vào **Cài đặt / Settings** (hoặc mục tương đương).
3. Tìm mục **User Script**, **Custom Script**, **Script** hoặc **JavaScript** (tên có thể khác tùy phiên bản WBlock).

### Bước 2: Thêm script mới

1. Chọn **Thêm script** / **Add Script** / **New Script**.
2. Đặt tên script (ví dụ: `Chặn redirect Shopee TikTok`).
3. Trong ô nội dung script, **copy toàn bộ** nội dung file `wblock-block-redirect.user.js` và dán vào.

### Bước 3: Bật script và áp dụng

1. **Bật** script (toggle On).
2. Chọn **phạm vi áp dụng**:
   - **All websites** – áp dụng mọi trang.
   - Hoặc chỉ **một số trang** (ví dụ chỉ khi vào site hay bị redirect).
3. Lưu / **Save**.

### Bước 4: Kiểm tra

1. Mở Safari (hoặc trình duyệt mà WBlock hỗ trợ).
2. Vào một trang có button/link thường redirect sang Shopee/TikTok.
3. Click thử: nếu script chạy đúng, sẽ **không** bị chuyển sang Shopee/TikTok/trang trong danh sách chặn.

**Lưu ý:** Nếu WBlock có tùy chọn **Inject at document start** hoặc **Chạy sớm**, nên bật để script chặn redirect sớm hơn.

## Chỉnh sửa danh sách chặn

Mở file `wblock-block-redirect.user.js`, tìm mảng `BLOCKED_DOMAINS` và thêm/bớt chuỗi (domain hoặc từ khóa trong URL):

```javascript
const BLOCKED_DOMAINS = [
  'shopee.',
  'tiktok.com',
  'lazada.',
  'affiliate',
  // Thêm domain hoặc từ khóa của bạn ở đây
];
```

Sau khi sửa, copy lại toàn bộ script và dán đè vào script trong WBlock rồi lưu.

## File trong repo

- `wblock-block-redirect.user.js` – script chính, dùng cho User Script của WBlock.
- `README.md` – hướng dẫn (file này).

## Lưu ý

- Script chạy trong WBlock phụ thuộc cách WBlock inject script (document start/end). Nếu vẫn bị redirect, thử bật “chạy sớm” hoặc dùng rule chặn domain trực tiếp trong WBlock (nếu có).
- Một số trang dùng iframe hoặc redirect nhiều bước có thể cần thêm rule chặn theo domain trong WBlock.
- Chỉ dùng trên thiết bị của bạn; tuân thủ điều khoản sử dụng của WBlock và trang web bạn truy cập.
