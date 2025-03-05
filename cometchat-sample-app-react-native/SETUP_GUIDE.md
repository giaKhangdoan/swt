# Hướng Dẫn Cài Đặt và Chạy Ứng Dụng React Native

## Mục Lục
- [A. Cài đặt Java 17](#a-cài-đặt-java-17)
- [B. Cài đặt Android Studio và thiết lập máy ảo](#b-cài-đặt-android-studio-và-thiết-lập-máy-ảo)
- [C. Chạy ứng dụng React Native](#c-chạy-ứng-dụng-react-native)
- [D. Xử lý lỗi thường gặp](#d-xử-lý-lỗi-thường-gặp)
- [E. Các lệnh hữu ích](#e-các-lệnh-hữu-ích)

## A. Cài đặt Java 17

### 1. Tải JDK 17
- Truy cập: https://www.oracle.com/java/technologies/downloads/#java17
- Tải phiên bản Windows x64 Installer

### 2. Cài đặt JDK 17
- Chạy file installer vừa tải
- Nhấn Next và làm theo các bước cài đặt
- Ghi nhớ đường dẫn cài đặt (thường là `C:\Program Files\Java\jdk-17`)

### 3. Thiết lập biến môi trường JAVA_HOME
- Mở Windows Search, gõ "environment variables"
- Chọn "Edit the system environment variables"
- Nhấn "Environment Variables"
- Trong phần "System variables", nhấn "New"
- Variable name: `JAVA_HOME`
- Variable value: đường dẫn JDK (ví dụ: `C:\Program Files\Java\jdk-17`)
- Thêm `%JAVA_HOME%\bin` vào biến Path

### 4. Kiểm tra cài đặt
```bash
java -version
```

## B. Cài đặt Android Studio và thiết lập máy ảo

### 1. Tải và cài đặt Android Studio
- Truy cập: https://developer.android.com/studio
- Tải Android Studio
- Chạy installer và làm theo hướng dẫn cài đặt

### 2. Thiết lập biến môi trường ANDROID_HOME
- Thêm biến môi trường mới:
  - Variable name: `ANDROID_HOME`
  - Variable value: `C:\Users\[TenUser]\AppData\Local\Android\Sdk`
- Thêm vào Path:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`
  - `%ANDROID_HOME%\tools\bin`

### 3. Tạo máy ảo Android
- Mở Android Studio
- Chọn "More Actions" > "Virtual Device Manager"
- Nhấn "Create Device"
- Chọn "Phone" và chọn một điện thoại (ví dụ: Pixel 4)
- Chọn "Next"
- Chọn hệ điều hành (ví dụ: API 33)
- Nếu chưa có, nhấn "Download" bên cạnh phiên bản Android
- Đặt tên cho máy ảo và nhấn "Finish"

## C. Chạy ứng dụng React Native

### 1. Cài đặt Node.js và npm
- Truy cập: https://nodejs.org/
- Tải và cài đặt phiên bản LTS

### 2. Cài đặt React Native CLI
```bash
npm install -g react-native-cli
```

### 3. Khởi động máy ảo
- Mở Android Studio
- Chọn "Virtual Device Manager"
- Nhấn nút play ▶️ bên cạnh máy ảo bạn muốn chạy
- Đợi máy ảo khởi động hoàn tất

### 4. Chạy ứng dụng trong hai terminal

Terminal 1 (Metro Bundler):
```bash
cd C:\cometchat-sample-app-react-native
npx react-native start
```

Terminal 2 (Cài đặt và chạy ứng dụng):
```bash
cd C:\cometchat-sample-app-react-native
npx react-native run-android
```

## D. Xử lý lỗi thường gặp

### 1. Lỗi "No connected devices"
- Kiểm tra máy ảo đã chạy chưa
- Chạy lệnh `adb devices` để kiểm tra kết nối
- Khởi động lại máy ảo

### 2. Lỗi về dependencies
```bash
npm install
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 3. Lỗi Metro Bundler
- Dừng cả hai terminal
- Xóa thư mục `node_modules`
- Chạy `npm install`
- Khởi động lại cả hai terminal

## E. Các lệnh hữu ích

### 1. Kiểm tra thiết bị đang kết nối
```bash
adb devices
```

### 2. Xóa cache của Metro
```bash
npx react-native start --reset-cache
```

### 3. Kiểm tra phiên bản các công cụ
```bash
java -version
node -v
npm -v
```

## Lưu ý quan trọng
- Làm theo đúng thứ tự các bước từ A đến C
- Đảm bảo tất cả các biến môi trường được thiết lập đúng
- Kiểm tra kỹ các phiên bản phần mềm tương thích
- Nếu gặp lỗi, tham khảo phần D để xử lý

## Yêu cầu hệ thống tối thiểu
- Windows 10 trở lên
- RAM: 8GB trở lên
- Ổ cứng trống: ít nhất 10GB
- Bật Virtualization trong BIOS (cho máy ảo Android)

## Liên hệ hỗ trợ
Nếu bạn gặp khó khăn trong quá trình cài đặt hoặc chạy ứng dụng, vui lòng liên hệ:
- Email: support@example.com
- Discord: discord.gg/example
- GitHub Issues: github.com/example/issues 