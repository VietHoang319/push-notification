<h1>WEB PUSH NOTIFICATION</h1>
Push notification là cơ chế gửi thông báo cho người dùng từ website vào một sự kiện cụ thể nhằm đưa người dùng trở lại website giúp tăng tương tác giữa người dùng với website.

# Ưu điểm và nhược điểm của push notification
## Ưu điểm:
- Có thể gửi thông báo đến bất kỳ thiết bị nào hỗ trợ trình duyệt và trình duyệt đó hỗ trợ push notification.
- Người dùng không cần phải cài đặt các phần mềm hỗ trợ nào.
- Người dùng có thể nhận được thông báo ngay cả khi đang duyệt website khác.
- Tăng tương tác giữa web và người dùng.
## Nhược điểm:
Việc gửi push notification liên tục hoặc notify không có nội dung cụ thể, không đúng thời điểm có thể dẫn tới việc phản tác dụng của push notification.
#Các phiên bản browser hỗ trợ
## Phiên bản trên PC
<table>
  <tr>
    <th><strong>Chrome</strong></th>
    <th><strong>Edge</strong></th>
    <th><strong>Safari</strong></th>
    <th><strong>Firefox</strong></th>
    <th><strong>Opera</strong></th>
    <th><strong>IE</strong></th>
  </tr>
  <tr>
    <td>v22+</td>
    <td>v14+</td>
    <td>v6+ với Mac OSX 10.6+</td>
    <td>v22+</td>
    <td>v25+</td>
    <td>Không hỗ trợ</td>
  </tr>
</table>
##Phiên bản trên mobile:
<table>
  <tr>
    <th><strong>Chrome Android</strong></th>
    <th><strong>Safari iOS</strong></th>
    <th><strong>Samsung Internet</strong></th>
    <th><strong>Opera Min</strong></th>
    <th><strong>Opera Mobile</strong></th>
    <th><strong>UC Browser Android</strong></th>
    <th><strong>Android Browser</strong></th>
    <th><strong>Firefox for Android</strong></th>
    <th><strong>QQ Browser</strong></th>
    <th><strong>Baidu Browser</strong></th>
    <th><strong>KaiOS Browser</strong></th>
    <th><strong>Chrome IOS</strong></th>
  </tr>
  <tr>
    <td>v112</td>
    <td>v16.4+</td>
    <td>v4 với webkit</td>
    <td>Không hỗ trợ</td>
    <td>v73 với webkit</td>
    <td>v13.4</td>
    <td>v4.4 với webkit</td>
    <td>v110</td>
    <td>Không hỗ trợ</td>
    <td>Không hỗ trợ</td>
    <td>v2.5+</td>
    <td>check thấy v112.0.5615.167 chưa hỗ trợ</td>
  </tr>
</table>

- Chrome Android yêu cầu bắt buộc phải tạo 1 service worker.
- Firefox không hỗ trợ thông báo được gửi liền sát nhau.
- Thông báo của firefox sẽ biến mất trong vãi giây.
- IOS không hỗ trợ invisible push notifications (A silent push notification). Là những thông báo không có cảnh báo cho người dùng.
# Các bước thực hiện
## Tạo file manifest.json [tài liệu tham khảo về manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
```JSON
{
  "name": "test",
  "short_name": "test",
  "display": "standalone",
  "start_url": "/"
}
```
## Thêm file manifest vào index.html
```HTML
  <link rel="manifest" href="/manifest.json">
```
## 