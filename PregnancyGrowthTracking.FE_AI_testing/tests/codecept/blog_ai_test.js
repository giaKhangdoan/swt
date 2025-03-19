Feature('Kiểm thử AI Blog với Gemini 1.5 Pro');

// Các biến toàn cục cho kiểm thử này
const SCREENSHOTS_DIR = './output';
let beforeScreenshot, afterScreenshot;

// Chuẩn bị môi trường kiểm thử
Before(async ({ I }) => {
  // Đảm bảo chúng ta bắt đầu từ trang blog
  I.amOnPage('/blog');
  I.wait(5); // Tăng thời gian chờ sau khi chuyển trang
});

// Chụp ảnh màn hình trước và sau để so sánh
AfterSuite(async ({ I }) => {
  // Xóa các ảnh màn hình đã lưu (nếu có)
  if (beforeScreenshot || afterScreenshot) {
    I.say('Đã hoàn thành kiểm thử so sánh. Các ảnh màn hình sẽ được lưu trong thư mục output.');
  }
});

// 1. Phân tích tổng quan trang Blog
Scenario('Phân tích tổng thể trang blog với Gemini', async ({ I }) => {
  I.amOnPage('/blog');
  I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  
  // Lấy thông tin và mô tả trang
  const pageAnalysis = await I.analyzeUIWithGemini(
    'Đây là trang blog. Hãy mô tả chi tiết trang này, bố cục và các thành phần chính. ' +
    'Phân tích header, phần tìm kiếm/lọc, grid hiển thị bài viết và phân trang. ' + 
    'Đánh giá hiệu quả truyền tải thông tin và trải nghiệm người dùng.'
  );
  
  I.reportAIAnalysis('Phân tích tổng thể trang blog', pageAnalysis);
});

// 2. Đánh giá các thành phần cụ thể
Scenario('Đánh giá các thành phần thiết kế trên trang blog', async ({ I }) => {
  I.amOnPage('/blog');
  I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  
  // Phân tích header blog - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.blog-header, header, .header, h1, .title') > 0) {
    const headerAnalysis = await I.analyzeElementWithGemini(
      '.blog-header, header, .header, h1, .title', 
      'Phân tích phần header của blog từ góc độ UX/UI. Đánh giá hiệu quả truyền tải thông tin, ' +
      'tính thẩm mỹ, và khả năng thu hút người dùng. Xác định điểm mạnh và điểm yếu.'
    );
    
    I.reportAIAnalysis('Phân tích header blog', headerAnalysis);
  }
  
  // Phân tích phần tìm kiếm và lọc - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.search-filter-container, .search, .filter, div[class*="search"], div[class*="filter"]') > 0) {
    const searchFilterAnalysis = await I.analyzeElementWithGemini(
      '.search-filter-container, .search, .filter, div[class*="search"], div[class*="filter"]', 
      'Phân tích phần tìm kiếm và lọc này. Đánh giá tính dễ sử dụng, rõ ràng, và hiệu quả. ' +
      'Xác định liệu người dùng có dễ dàng tìm thấy thông tin họ cần không?'
    );
    
    I.reportAIAnalysis('Phân tích phần tìm kiếm và lọc', searchFilterAnalysis);
  }
  
  // Phân tích grid bài viết - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.blog-grid, .grid, .posts, div[class*="grid"], div[class*="blog-list"]') > 0) {
    const blogGridAnalysis = await I.analyzeElementWithGemini(
      '.blog-grid, .grid, .posts, div[class*="grid"], div[class*="blog-list"]', 
      'Phân tích cách hiển thị các bài viết trong grid. Đánh giá bố cục, cách sử dụng không gian, ' +
      'và cách thức hiển thị thông tin. Các bài viết có được trình bày rõ ràng và hấp dẫn không?'
    );
    
    I.reportAIAnalysis('Phân tích grid bài viết', blogGridAnalysis);
  }
  
  // Phân tích một thẻ bài viết - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.blog-card, .card, article, div[class*="blog-item"], div[class*="post"]') > 0) {
    const blogCardAnalysis = await I.analyzeElementWithGemini(
      '.blog-card:first-child, .card:first-child, article:first-child, div[class*="blog-item"]:first-child', 
      'Phân tích thiết kế thẻ bài viết này. Đánh giá cách hiển thị hình ảnh, tiêu đề, đoạn trích, ' +
      'ngày tháng và nút "Đọc thêm". Thiết kế này có hiệu quả trong việc thu hút người đọc không?'
    );
    
    I.reportAIAnalysis('Phân tích thẻ bài viết', blogCardAnalysis);
  }
  
  // Phân tích phân trang - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.pagination, .pager, nav, ul[class*="pagination"]') > 0) {
    const paginationAnalysis = await I.analyzeElementWithGemini(
      '.pagination, .pager, nav, ul[class*="pagination"]', 
      'Phân tích hệ thống phân trang. Đánh giá tính rõ ràng, dễ sử dụng, và vị trí trên trang. ' +
      'Liệu người dùng có dễ dàng điều hướng giữa các trang không?'
    );
    
    I.reportAIAnalysis('Phân tích phân trang', paginationAnalysis);
  }
});

// 3. Kiểm tra chức năng tìm kiếm và lọc
Scenario('Kiểm tra chức năng tìm kiếm và lọc với Gemini', async ({ I }) => {
  I.amOnPage('/blog');
  I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  
  // === PHẦN 1: KIỂM TRA TÌM KIẾM ===
  // Chụp ảnh trước khi tìm kiếm
  try {
    beforeScreenshot = await I.captureScreenshot('blog_before_search');
    
    // Tìm kiếm một từ khóa - Selector linh hoạt hơn
    if (await I.grabNumberOfVisibleElements('input.search-input, input[type="search"], input[placeholder*="tìm"], input[placeholder*="search"]') > 0) {
      I.fillField('input.search-input, input[type="search"], input[placeholder*="tìm"], input[placeholder*="search"]', 'thai kỳ');
      I.wait(2);
      // Nhấn Enter hoặc nút tìm kiếm nếu cần
      I.pressKey('Enter');
      I.wait(2); // Đợi để kết quả tìm kiếm hiển thị
      
      // Đợi cho kết quả tìm kiếm xuất hiện
      I.waitForElement('.blog-card, .card, article, div[class*="blog-item"]', 15);
      
      // Chụp ảnh sau khi tìm kiếm
      afterScreenshot = await I.captureScreenshot('blog_after_search');
      
      if (beforeScreenshot && afterScreenshot) {
        try {
          // So sánh hai trạng thái bằng Gemini
          const searchComparisonAnalysis = await I.compareUIWithGemini(
            beforeScreenshot,
            afterScreenshot,
            'So sánh trước và sau khi tìm kiếm với từ khóa "thai kỳ". Đánh giá tính phản hồi của hệ thống, ' +
            'cách thức hiển thị kết quả tìm kiếm, và liệu trải nghiệm tìm kiếm có trực quan không.'
          );
          
          I.reportAIAnalysis('So sánh trước và sau khi tìm kiếm', searchComparisonAnalysis);
        } catch (error) {
          I.say(`❌ Lỗi khi so sánh ảnh tìm kiếm: ${error.message}`);
        }
      } else {
        I.say('⚠️ Không thể so sánh trước và sau tìm kiếm do thiếu ảnh chụp màn hình');
      }
      
      // Trở về trạng thái ban đầu
      I.clearField('input.search-input, input[type="search"], input[placeholder*="tìm"], input[placeholder*="search"]');
      I.wait(1);
      I.pressKey('Enter');
      I.wait(2);
    }
  } catch (error) {
    I.say(`❌ Lỗi khi kiểm tra chức năng tìm kiếm: ${error.message}`);
  }
  
  // === PHẦN 2: KIỂM TRA LỌC (thực hiện độc lập với phần tìm kiếm) ===
  try {
    // Tải lại trang để đảm bảo trạng thái ban đầu
    I.amOnPage('/blog');
    I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 15);
    I.wait(2); // Đợi trang tải hoàn tất
    
    // Chụp ảnh trước khi lọc
    try {
      beforeScreenshot = await I.captureScreenshot('blog_before_filter');
    } catch (error) {
      I.say(`❌ Lỗi khi chụp ảnh trước khi lọc: ${error.message}`);
      return; // Nếu không chụp được ảnh trước, thoát khỏi kịch bản để tránh timeout
    }
    
    // Kiểm tra chức năng lọc theo danh mục - Selector linh hoạt hơn
    if (await I.grabNumberOfVisibleElements('.tags-container .tag-button, .categories button, .filter-tags button, button[class*="tag"], button[class*="category"]') > 0) {
      // Click vào nút danh mục đầu tiên
      I.click('.tags-container .tag-button:first-child, .categories button:first-child, .filter-tags button:first-child, button[class*="tag"]:first-child');
      I.wait(2);
      
      // Đợi cho kết quả lọc xuất hiện
      I.waitForElement('.blog-card, .card, article, div[class*="blog-item"]', 15);
      I.wait(1); // Đợi thêm để đảm bảo tất cả đã tải xong
      
      // Chụp ảnh sau khi lọc
      try {
        afterScreenshot = await I.captureScreenshot('blog_after_filter');
      } catch (error) {
        I.say(`❌ Lỗi khi chụp ảnh sau khi lọc: ${error.message}`);
        return;
      }
      
      if (beforeScreenshot && afterScreenshot) {
        try {
          // So sánh trước và sau khi lọc
          const filterComparisonAnalysis = await I.compareUIWithGemini(
            beforeScreenshot,
            afterScreenshot,
            'So sánh trước và sau khi lọc theo danh mục. Đánh giá hiệu quả của chức năng lọc, ' +
            'cách hiển thị kết quả lọc, và liệu người dùng có dễ dàng hiểu được thay đổi không.'
          );
          
          I.reportAIAnalysis('So sánh trước và sau khi lọc', filterComparisonAnalysis);
        } catch (error) {
          I.say(`❌ Lỗi khi so sánh ảnh lọc: ${error.message}`);
        }
      } else {
        I.say('⚠️ Không thể so sánh trước và sau lọc do thiếu ảnh chụp màn hình');
      }
    } else {
      I.say('⚠️ Không tìm thấy nút lọc/danh mục trên trang');
    }
  } catch (error) {
    I.say(`❌ Lỗi khi kiểm tra chức năng lọc: ${error.message}`);
  }
});

// 4. Kiểm tra trang chi tiết bài viết
Scenario('Phân tích trang chi tiết bài viết', async ({ I }) => {
  I.amOnPage('/blog');
  I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  
  // Click vào bài viết đầu tiên - Selector linh hoạt hơn
  if (await I.grabNumberOfVisibleElements('.blog-card .read-more, a.read-more, a[class*="read"], .card a, article a, a.blog-link') > 0) {
    I.click('.blog-card .read-more:first-child, a.read-more:first-child, a[class*="read"]:first-child, .card a:first-child, article a:first-child');
    I.wait(5); // Đợi để trang chi tiết tải
    
    // Kiểm tra xem đã chuyển đến trang chi tiết chưa - Selector linh hoạt hơn
    I.waitForElement('.blog-detail, .detail, article.single, div[class*="detail"], div[class*="single"]', 30);
    
    // Chụp ảnh trang chi tiết
    const detailScreenshot = await I.captureScreenshot('blog_detail');
    
    // Phân tích trang chi tiết
    const detailPageAnalysis = await I.analyzeUIWithGemini(
      'Đây là trang chi tiết bài viết blog. Hãy phân tích cách bố trí nội dung, ' +
      'phần header, hình ảnh, nội dung bài viết và các thông tin meta. ' +
      'Đánh giá trải nghiệm đọc và tính dễ dàng tiếp cận thông tin.'
    );
    
    I.reportAIAnalysis('Phân tích trang chi tiết bài viết', detailPageAnalysis);
    
    // Phân tích phần nội dung chi tiết - Selector linh hoạt hơn
    if (await I.grabNumberOfVisibleElements('.blog-detail-content, .content, .post-content, div[class*="content"], article div') > 0) {
      const contentAnalysis = await I.analyzeElementWithGemini(
        '.blog-detail-content, .content, .post-content, div[class*="content"], article div',
        'Phân tích cách trình bày nội dung bài viết. Đánh giá độ rõ ràng, khả năng đọc, ' +
        'cấu trúc đoạn, font chữ, khoảng cách và các yếu tố khác ảnh hưởng đến trải nghiệm đọc.'
      );
      
      I.reportAIAnalysis('Phân tích nội dung bài viết', contentAnalysis);
    }
    
    // Phân tích nút quay lại - Sửa selector để không sử dụng :contains()
    if (await I.grabNumberOfVisibleElements('.back-button, a[class*="back"], button[class*="back"], a[href*="back"]') > 0) {
      const backButtonAnalysis = await I.analyzeElementWithGemini(
        '.back-button, a[class*="back"], button[class*="back"], a[href*="back"]',
        'Phân tích nút quay lại. Đánh giá vị trí, kích thước, và khả năng nhận biết. ' +
        'Người dùng có dễ dàng tìm thấy nút này để quay lại trang danh sách không?'
      );
      
      I.reportAIAnalysis('Phân tích nút quay lại', backButtonAnalysis);
    }
    
    // Quay lại trang danh sách - Sửa selector để không sử dụng :contains()
    I.click('.back-button, a[class*="back"], button[class*="back"], a[href*="back"]');
    I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  }
});

// 5. Phân tích toàn diện về trải nghiệm người dùng
Scenario('Phân tích tổng thể trải nghiệm người dùng với blog', async ({ I }) => {
  I.amOnPage('/blog');
  I.waitForElement('.blog-container, .container, div[class*="blog"], div[class*="container"]', 30);
  
  // Phân tích khả năng tiếp cận
  const accessibilityAnalysis = await I.analyzeAccessibility();
  I.reportAIAnalysis('Phân tích khả năng tiếp cận của trang blog', accessibilityAnalysis);
  
  // Phân tích thiết kế UX
  const uxAnalysis = await I.analyzeUXDesign();
  I.reportAIAnalysis('Phân tích thiết kế UX của trang blog', uxAnalysis);
  
  // Phân tích responsive design ở kích thước tablet
  const tabletResponsiveAnalysis = await I.analyzeResponsiveDesign({ width: 768, height: 1024 });
  I.reportAIAnalysis('Phân tích responsive design của trang blog (tablet)', tabletResponsiveAnalysis);
  
  // Phân tích responsive design ở kích thước mobile
  const mobileResponsiveAnalysis = await I.analyzeResponsiveDesign({ width: 375, height: 667 });
  I.reportAIAnalysis('Phân tích responsive design của trang blog (mobile)', mobileResponsiveAnalysis);
  
  // Trở lại kích thước desktop
  I.resizeWindow(1200, 800);
  
  // Tạo báo cáo tổng hợp
  const summaryReport = await I.generateContentWithGemini(
    'Dựa trên toàn bộ phân tích về trang blog và trang chi tiết bài viết, hãy tổng hợp: ' +
    '1. Điểm mạnh chính của thiết kế hiện tại ' +
    '2. Năm vấn đề ưu tiên cần cải thiện ' +
    '3. Đề xuất chi tiết để giải quyết mỗi vấn đề ' +
    '4. Ý tưởng để nâng cao trải nghiệm người dùng với blog '
  );
  
  I.reportAIAnalysis('Báo cáo tổng hợp và đề xuất cải thiện', summaryReport);
}); 