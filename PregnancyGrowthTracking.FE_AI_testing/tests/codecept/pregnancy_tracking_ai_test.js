Feature('Kiểm thử AI Theo dõi Thai kỳ với Gemini 1.5 Pro');

// Các biến toàn cục cho kiểm thử này
const SCREENSHOTS_DIR = './output';
let beforeScreenshot, afterScreenshot;

// Chuẩn bị môi trường kiểm thử
Before(async ({ I }) => {
  // Đăng nhập trước khi truy cập trang theo dõi thai kỳ
  I.amOnPage('/login');
  I.waitForElement('input[placeholder="Nhập email hoặc tên đăng nhập"]', 10);
  I.fillField('input[placeholder="Nhập email hoặc tên đăng nhập"]', 'vip1');
  I.fillField('input[placeholder="Nhập mật khẩu"]', 'vip123');
  I.click('button[type="submit"]');
  I.wait(10); // Tăng thời gian chờ đăng nhập
  
  // Đảm bảo chúng ta bắt đầu từ trang theo dõi thai kỳ
  I.amOnPage('/member/basic-tracking');
  I.wait(10); // Tăng thời gian chờ sau khi chuyển trang
});

// Chụp ảnh màn hình trước và sau để so sánh
AfterSuite(async ({ I }) => {
  // Xóa các ảnh màn hình đã lưu (nếu có)
  if (beforeScreenshot || afterScreenshot) {
    I.say('Đã hoàn thành kiểm thử so sánh. Các ảnh màn hình sẽ được lưu trong thư mục output.');
  }
});

// 1. Phân tích tổng quan trang Theo dõi Thai kỳ
Scenario('Phân tích tổng thể trang theo dõi thai kỳ với Gemini', async ({ I }) => {
  I.amOnPage('/member/basic-tracking');
  // Sửa selector để tìm bất kỳ container nào trên trang
  I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
  
  // Lấy thông tin và mô tả trang
  const pageAnalysis = await I.analyzeUIWithGemini(
    'Đây là trang theo dõi thai kỳ. Hãy mô tả chi tiết trang này, bố cục và các thành phần chính. ' +
    'Phân tích header, phần nhập thông tin thai kỳ, hiển thị kết quả và thông tin bổ sung. ' + 
    'Đánh giá hiệu quả truyền tải thông tin và trải nghiệm người dùng từ góc độ phụ nữ mang thai.'
  );
  
  I.reportAIAnalysis('Phân tích tổng thể trang theo dõi thai kỳ', pageAnalysis);
});

// 2. Đánh giá các thành phần cụ thể
Scenario('Đánh giá các thành phần thiết kế trên trang theo dõi thai kỳ', async ({ I }) => {
  I.amOnPage('/member/basic-tracking');
  // Sửa selector để tìm bất kỳ container nào trên trang
  I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
  
  // Phân tích header trang - Sử dụng selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('header, .header, .tracking-header, h1, .title-section') > 0) {
    const headerAnalysis = await I.analyzeElementWithGemini(
      'header, .header, .tracking-header, h1, .title-section', 
      'Phân tích phần header của trang theo dõi thai kỳ từ góc độ UX/UI. Đánh giá hiệu quả truyền tải thông tin, ' +
      'tính thẩm mỹ, và khả năng thu hút người dùng. Xác định điểm mạnh và điểm yếu.'
    );
    
    I.reportAIAnalysis('Phân tích header trang theo dõi thai kỳ', headerAnalysis);
  }
  
  // Phân tích form nhập liệu
  if (await I.grabNumberOfVisibleElements('form, .form, .tracking-form, .input-container, div[class*="form"]') > 0) {
    const formAnalysis = await I.analyzeElementWithGemini(
      'form, .form, .tracking-form, .input-container, div[class*="form"]', 
      'Phân tích phần form nhập liệu này. Đánh giá tính dễ sử dụng, rõ ràng, và hiệu quả. ' +
      'Liệu người dùng có dễ dàng nhập thông tin thai kỳ không? Có đủ hướng dẫn không?'
    );
    
    I.reportAIAnalysis('Phân tích form nhập liệu thai kỳ', formAnalysis);
  }
});

// 3. Kiểm tra chức năng tính toán thai kỳ
Scenario('Kiểm tra chức năng tính toán thai kỳ với Gemini', async ({ I }) => {
  I.amOnPage('/member/basic-tracking');
  // Sửa selector để tìm bất kỳ container nào trên trang
  I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
  
  // Chụp ảnh trước khi nhập thông tin
  beforeScreenshot = await I.captureScreenshot('pregnancy_before_input');
  
  // Nhập thông tin tuần tuổi thai nhi - Sử dụng selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('input[name="age"], input[placeholder*="tuần"], input[id*="age"]') > 0) {
    I.fillField('input[name="age"], input[placeholder*="tuần"], input[id*="age"]', '20');
    I.wait(1);
    
    // Nhập thông tin đo lường HC
    if (await I.grabNumberOfVisibleElements('input[name="hc"], input[placeholder*="HC"], input[id*="hc"]') > 0) {
      I.fillField('input[name="hc"], input[placeholder*="HC"], input[id*="hc"]', '180');
    }
    
    // Nhập thông tin đo lường AC
    if (await I.grabNumberOfVisibleElements('input[name="ac"], input[placeholder*="AC"], input[id*="ac"]') > 0) {
      I.fillField('input[name="ac"], input[placeholder*="AC"], input[id*="ac"]', '160');
    }
    
    // Nhập thông tin đo lường FL
    if (await I.grabNumberOfVisibleElements('input[name="fl"], input[placeholder*="FL"], input[id*="fl"]') > 0) {
      I.fillField('input[name="fl"], input[placeholder*="FL"], input[id*="fl"]', '35');
    }
    
    // Nhấn nút cập nhật - Sử dụng selector linh hoạt hơn
    if (await I.grabNumberOfVisibleElements('.update-button, button[type="submit"], button[class*="update"], button[class*="save"]') > 0) {
      I.click('.update-button, button[type="submit"], button[class*="update"], button[class*="save"]');
      I.wait(5); // Đợi lâu hơn để kết quả hiển thị
      
      // Chụp ảnh sau khi tính toán
      afterScreenshot = await I.captureScreenshot('pregnancy_after_input');
      
      // So sánh hai trạng thái bằng Gemini
      const calculationComparisonAnalysis = await I.compareUIWithGemini(
        beforeScreenshot,
        afterScreenshot,
        'So sánh trước và sau khi nhập thông số thai nhi và cập nhật. Đánh giá tính phản hồi của hệ thống, ' +
        'cách thức hiển thị kết quả tính toán, và liệu thông tin có được trình bày một cách dễ hiểu không.'
      );
      
      I.reportAIAnalysis('So sánh trước và sau khi cập nhật thông số thai kỳ', calculationComparisonAnalysis);
    }
  }
  
  // Phân tích kết quả tính toán - Sử dụng selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.results-container, .result, .stats-results, div[class*="result"]') > 0) {
    const resultsAnalysis = await I.analyzeElementWithGemini(
      '.results-container, .result, .stats-results, div[class*="result"]',
      'Phân tích kết quả tính toán thai kỳ. Đánh giá độ chính xác, độ chi tiết và tính hữu ích của thông tin. ' +
      'Kết quả có cung cấp đủ thông tin quan trọng cho người mang thai không?'
    );
    
    I.reportAIAnalysis('Phân tích kết quả tính toán thai kỳ', resultsAnalysis);
  }
});

// 4. Kiểm tra chức năng xem lịch sử
Scenario('Phân tích lịch sử theo dõi thai kỳ', async ({ I }) => {
  I.amOnPage('/member/basic-tracking');
  // Sửa selector để tìm bất kỳ container nào trên trang
  I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
  
  // Nhấp vào nút xem lịch sử - Sửa selector để không sử dụng :contains() không hợp lệ
  if (await I.grabNumberOfVisibleElements('.history-button, .btn-history, a[href*="history"], button[class*="history"]') > 0) {
    I.click('.history-button, .btn-history, a[href*="history"], button[class*="history"]');
    I.wait(5); // Đợi lâu hơn
    
    // Kiểm tra xem lịch sử đã hiển thị chưa - Sử dụng selector linh hoạt hơn
    I.waitForElement('.history-table, table, .ant-table, div[class*="table"]', 30);
    
    // Chụp ảnh lịch sử thai kỳ
    const historyScreenshot = await I.captureScreenshot('pregnancy_history');
    
    // Phân tích lịch sử thai kỳ
    const historyAnalysis = await I.analyzeUIWithGemini(
      'Đây là lịch sử theo dõi thai kỳ. Hãy phân tích cách bố trí, thông tin hiển thị trong bảng, ' +
      'và tính dễ dàng đọc hiểu dữ liệu. ' +
      'Đánh giá mức độ hữu ích của việc theo dõi lịch sử này đối với người mang thai.'
    );
    
    I.reportAIAnalysis('Phân tích lịch sử theo dõi thai kỳ', historyAnalysis);
    
    // Quay lại trang chính - Sửa selector để không sử dụng :contains() không hợp lệ
    if (await I.grabNumberOfVisibleElements('.back-button, a[href*="back"], button[class*="back"]') > 0) {
      I.click('.back-button, a[href*="back"], button[class*="back"]');
      I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
    }
  }
});

// 5. Phân tích toàn diện về trải nghiệm người dùng
Scenario('Phân tích tổng thể trải nghiệm người dùng với trang theo dõi thai kỳ', async ({ I }) => {
  I.amOnPage('/member/basic-tracking');
  // Sửa selector để tìm bất kỳ container nào trên trang
  I.waitForElement('.container, .form-container, .basic-tracking-container, div[class*="container"]', 30);
  
  // Phân tích khả năng tiếp cận
  const accessibilityAnalysis = await I.analyzeAccessibility();
  I.reportAIAnalysis('Phân tích khả năng tiếp cận của trang theo dõi thai kỳ', accessibilityAnalysis);
  
  // Phân tích thiết kế UX
  const uxAnalysis = await I.analyzeUXDesign();
  I.reportAIAnalysis('Phân tích thiết kế UX của trang theo dõi thai kỳ', uxAnalysis);
  
  // Phân tích responsive design ở kích thước tablet
  const tabletResponsiveAnalysis = await I.analyzeResponsiveDesign({ width: 768, height: 1024 });
  I.reportAIAnalysis('Phân tích responsive design của trang theo dõi thai kỳ (tablet)', tabletResponsiveAnalysis);
  
  // Phân tích responsive design ở kích thước mobile
  const mobileResponsiveAnalysis = await I.analyzeResponsiveDesign({ width: 375, height: 667 });
  I.reportAIAnalysis('Phân tích responsive design của trang theo dõi thai kỳ (mobile)', mobileResponsiveAnalysis);
  
  // Trở lại kích thước desktop
  I.resizeWindow(1200, 800);
  
  // Đánh giá tính phù hợp cho phụ nữ mang thai
  const pregnancySpecificAnalysis = await I.generateContentWithGemini(
    'Đánh giá trang theo dõi thai kỳ từ góc độ người dùng là phụ nữ mang thai. ' +
    'Xem xét các yếu tố như: ' +
    '1. Tính dễ dàng sử dụng và giảm thiểu căng thẳng khi tương tác ' +
    '2. Mức độ tin cậy và chính xác của thông tin ' +
    '3. Tính toàn diện của dữ liệu được cung cấp ' +
    '4. Khả năng hỗ trợ quá trình ra quyết định về sức khỏe ' +
    '5. Tính thân thiện và an toàn cho người mang thai'
  );
  
  I.reportAIAnalysis('Đánh giá tính phù hợp cho phụ nữ mang thai', pregnancySpecificAnalysis);
  
  // Tạo báo cáo tổng hợp
  const summaryReport = await I.generateContentWithGemini(
    'Dựa trên toàn bộ phân tích về trang theo dõi thai kỳ, hãy tổng hợp: ' +
    '1. Điểm mạnh chính của thiết kế hiện tại ' +
    '2. Năm vấn đề ưu tiên cần cải thiện ' +
    '3. Đề xuất chi tiết để giải quyết mỗi vấn đề ' +
    '4. Ý tưởng để nâng cao trải nghiệm người dùng với công cụ theo dõi thai kỳ ' +
    '5. Các tính năng bổ sung có thể giúp ích cho phụ nữ mang thai'
  );
  
  I.reportAIAnalysis('Báo cáo tổng hợp và đề xuất cải thiện', summaryReport);
}); 