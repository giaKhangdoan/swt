# Kiểm thử AI với CodeceptJS và Gemini 1.5 Pro

Tài liệu này mô tả cách sử dụng Gemini 1.5 Pro API để tự động hóa kiểm thử và phân tích UI/UX trong dự án Pregnancy Growth Tracking.

## Tổng quan

Hệ thống kiểm thử AI này sử dụng:
- **CodeceptJS**: Framework kiểm thử end-to-end
- **Playwright**: Trình duyệt tự động hóa
- **Gemini 1.5 Pro API**: Mô hình AI đa phương thức để phân tích hình ảnh và tạo nội dung

Kiểm thử AI giúp tự động hóa các công việc sau:
- Phân tích UI/UX và đánh giá chất lượng
- Kiểm tra khả năng tiếp cận và responsive design
- So sánh các phiên bản UI khác nhau
- Tạo báo cáo kiểm thử chi tiết
- Đề xuất cải tiến dựa trên phân tích AI

## Cấu trúc kiểm thử

```
tests/
  ├── codecept/                    # Kiểm thử CodeceptJS
  │   ├── blog_ai_test.js          # Kiểm thử AI cho blog
  │   ├── pregnancy_tracking_ai_test.js # Kiểm thử AI cho tính năng theo dõi thai kỳ
  │   └── README.md                # Tài liệu hướng dẫn (tệp này)
  ├── helpers/
  │   └── gemini_helper.js         # Helper cho Gemini AI
  ├── ai/                          # Kiểm thử AI khác (Applitools)
  ├── e2e/                         # Kiểm thử E2E thông thường
  └── unit/                        # Kiểm thử đơn vị
```

## Cài đặt và thiết lập

1. **Cài đặt các phụ thuộc**:
   ```bash
   npm install --save-dev codeceptjs playwright @google/generative-ai
   ```

2. **Cấu hình API Key**:
   - API key mặc định đã được cấu hình trong `tests/helpers/gemini_helper.js`
   - Để sử dụng API key của riêng bạn, hãy đặt biến môi trường `GEMINI_API_KEY` hoặc cập nhật trong helper

3. **Chạy kiểm thử**:
   ```bash
   # Chạy tất cả kiểm thử AI
   npm run test:ai
   
   # Chạy tất cả kiểm thử CodeceptJS
   npm run test:codecept
   
   # Chạy kiểm thử cụ thể
   npx codeceptjs run --grep "Phân tích tổng thể trang blog"
   ```

## Phương thức kiểm thử AI có sẵn

Các phương thức kiểm thử AI dưới đây được định nghĩa trong `steps_file.js` và có thể sử dụng trong kịch bản kiểm thử:

### Phân tích UI

```javascript
// Phân tích UI hiện tại
const uiAnalysis = await I.analyzeUIWithGemini('Mô tả chi tiết về những gì cần phân tích');

// Phân tích một phần tử cụ thể
const elementAnalysis = await I.analyzeElementWithGemini('.selector', 'Prompt về phần tử này');

// Tạo nội dung dựa trên prompt
const content = await I.generateContentWithGemini('Prompt để tạo nội dung');

// So sánh hai hình ảnh UI (trước và sau)
const comparison = await I.compareUIWithGemini(beforeImagePath, afterImagePath, 'Hướng dẫn so sánh');
```

### Chụp ảnh màn hình

```javascript
// Chụp ảnh và lưu
const screenshotPath = await I.captureScreenshot('tên_ảnh');
```

### Phân tích chuyên biệt

```javascript
// Phân tích khả năng tiếp cận (WCAG)
const accessibilityReport = await I.analyzeAccessibility();

// Phân tích UX design
const uxReport = await I.analyzeUXDesign();

// Phân tích responsive design
const responsiveReport = await I.analyzeResponsiveDesign({ width: 768, height: 1024 });
```

### Báo cáo kết quả

```javascript
// Hiển thị kết quả phân tích đã định dạng
I.reportAIAnalysis('Tiêu đề phân tích', analysisResult);
```

## Tùy chỉnh prompt AI

Khi sử dụng Gemini, chất lượng prompt rất quan trọng. Một số hướng dẫn để viết prompt hiệu quả:

1. **Cụ thể và chi tiết**: Mô tả chính xác những gì bạn muốn phân tích
2. **Cung cấp ngữ cảnh**: Giải thích về UI/tính năng đang được phân tích
3. **Đặt câu hỏi cụ thể**: Thay vì "phân tích UI", hãy yêu cầu "đánh giá tính dễ sử dụng, tổ chức thông tin và mức độ phù hợp với người dùng mục tiêu"
4. **Yêu cầu định dạng**: Đôi khi yêu cầu kết quả theo định dạng cụ thể (danh sách, bảng...)

## Xử lý lỗi

Tất cả các phương thức AI đều có tích hợp xử lý lỗi. Nếu gặp lỗi:

1. **API quota/rate limit**: Đợi vài phút và thử lại
2. **Lỗi kết nối**: Kiểm tra kết nối internet 
3. **Lỗi phân tích hình ảnh**: Kiểm tra xem phần tử có hiển thị không

## Ví dụ kiểm thử đầy đủ

Xem file `blog_ai_test.js` và `pregnancy_tracking_ai_test.js` để có ví dụ về cách sử dụng kiểm thử AI trong thực tế.

## Chạy vòng lặp CI/CD

Kiểm thử AI có thể chạy như một phần của quy trình CI/CD để phát hiện vấn đề UI/UX tự động. Thêm cấu hình sau vào CI:

```yaml
# Ví dụ cho GitHub Actions
jobs:
  ai-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npm run test:ai
      - name: Archive test results
        uses: actions/upload-artifact@v3
        with:
          name: ai-test-results
          path: output/
``` 