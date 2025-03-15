/**
 * Tệp kiểm thử AI tự động hóa cho BlogSlide component
 * 
 * Tệp này sử dụng Playwright và Applitools Eyes để tự động hóa kiểm thử
 * với sự hỗ trợ của AI để phát hiện các vấn đề trực quan và chức năng.
 */

const { test, expect } = require('@playwright/test');
const { 
  Eyes, 
  VisualGridRunner, 
  Configuration, 
  BatchInfo, 
  BrowserType, 
  DeviceName, 
  ScreenOrientation, 
  Target 
} = require('@applitools/eyes-playwright');

// Cấu hình kiểm thử AI
test.describe('BlogSlide AI Testing', () => {
  let eyes;
  let runner;
  let configuration;

  test.beforeAll(async () => {
    // Khởi tạo Visual Grid Runner với 5 luồng đồng thời
    runner = new VisualGridRunner({ testConcurrency: 5 });

    // Tạo cấu hình cho Applitools Eyes
    configuration = new Configuration();
    configuration.setBatch(new BatchInfo('BlogSlide AI Tests'));

    // Thêm các trình duyệt và thiết bị khác nhau để kiểm thử
    configuration.addBrowser(800, 600, BrowserType.CHROME);
    configuration.addBrowser(1600, 1200, BrowserType.CHROME);
    configuration.addBrowser(1024, 768, BrowserType.FIREFOX);
    configuration.addBrowser(1024, 768, BrowserType.SAFARI);
    configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
    configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
  });

  test.beforeEach(async ({ page }) => {
    // Khởi tạo Eyes với cấu hình đã thiết lập
    eyes = new Eyes(runner, configuration);
    await eyes.open(page, 'Pregnancy Growth Tracking', test.info().title);
  });

  test.afterEach(async () => {
    await eyes.close();
  });

  test.afterAll(async () => {
    // Đợi và hiển thị kết quả kiểm thử
    const results = await runner.getAllTestResults();
    console.log('Visual test results', results);
  });

  test('AI kiểm tra hiển thị ban đầu của BlogSlide', async ({ page }) => {
    // Điều hướng đến trang chứa BlogSlide
    await page.goto('/');
    
    // Đợi cho đến khi component được tải
    await page.waitForSelector('.blog-posts');
    
    // Kiểm tra trực quan với AI
    await eyes.check('BlogSlide Initial State', Target.region('.blog-posts').fully());
    
    // Kiểm tra các phần tử quan trọng
    await expect(page.locator('.blog-posts h2')).toContainText('Bài viết mới nhất');
    await expect(page.locator('.post-card')).toHaveCount({ min: 1 });
  });

  test('AI kiểm tra chuyển đổi chế độ xem', async ({ page }) => {
    // Điều hướng đến trang chứa BlogSlide
    await page.goto('/');
    
    // Đợi cho đến khi component được tải
    await page.waitForSelector('.blog-posts');
    
    // Kiểm tra trực quan chế độ slider
    await eyes.check('BlogSlide Slider Mode', Target.region('.blog-posts').fully());
    
    // Chuyển sang chế độ grid
    await page.click('.view-toggle button:nth-child(2)');
    
    // Đợi cho đến khi chế độ grid được hiển thị
    await page.waitForSelector('.posts-grid');
    
    // Kiểm tra trực quan chế độ grid
    await eyes.check('BlogSlide Grid Mode', Target.region('.blog-posts').fully());
    
    // Kiểm tra cấu trúc grid
    await expect(page.locator('.posts-grid')).toBeVisible();
    await expect(page.locator('.slick-slider')).not.toBeVisible();
  });

  test('AI kiểm tra tương tác với bài viết', async ({ page }) => {
    // Điều hướng đến trang chứa BlogSlide
    await page.goto('/');
    
    // Đợi cho đến khi component được tải
    await page.waitForSelector('.blog-posts');
    
    // Hover vào bài viết đầu tiên để kiểm tra hiệu ứng
    await page.hover('.post-card:first-child');
    
    // Kiểm tra trực quan hiệu ứng hover
    await eyes.check('BlogSlide Hover Effect', Target.region('.blog-posts').fully());
    
    // Click vào nút "Đọc thêm" của bài viết đầu tiên
    const firstPostLink = page.locator('.post-card:first-child .read-more');
    await firstPostLink.click();
    
    // Đợi cho đến khi chuyển trang
    await page.waitForURL(/\/blog\/\d+/);
    
    // Kiểm tra trực quan trang chi tiết
    await eyes.check('Blog Detail Page', Target.window().fully());
  });

  test('AI kiểm tra khả năng thích ứng với các kích thước màn hình', async ({ page }) => {
    // Điều hướng đến trang chứa BlogSlide
    await page.goto('/');
    
    // Đợi cho đến khi component được tải
    await page.waitForSelector('.blog-posts');
    
    // Kiểm tra trực quan ở kích thước desktop
    await eyes.check('BlogSlide Desktop View', Target.region('.blog-posts').fully());
    
    // Thay đổi kích thước viewport sang tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Kiểm tra trực quan ở kích thước tablet
    await eyes.check('BlogSlide Tablet View', Target.region('.blog-posts').fully());
    
    // Thay đổi kích thước viewport sang mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Kiểm tra trực quan ở kích thước mobile
    await eyes.check('BlogSlide Mobile View', Target.region('.blog-posts').fully());
  });
}); 