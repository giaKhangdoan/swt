const { test, expect } = require('@playwright/test');
const { Eyes, Target } = require('@applitools/eyes-playwright');

test.describe('Trang Blog', () => {
  let eyes;

  test.beforeEach(async ({ page }) => {
    // Khởi tạo Applitools Eyes
    eyes = new Eyes();
    
    // Thiết lập thông tin kiểm thử
    await eyes.open(page, 'Pregnancy Growth Tracking', 'Kiểm thử trang Blog');
  });

  test.afterEach(async () => {
    // Đóng Applitools Eyes sau mỗi test
    await eyes.close();
  });

  test('hiển thị danh sách bài viết blog', async ({ page }) => {
    // Điều hướng đến trang blog
    await page.goto('/blog');
    
    // Đợi cho đến khi trang được tải hoàn toàn
    await page.waitForSelector('.blog-posts');
    
    // Kiểm tra tiêu đề trang
    await expect(page).toHaveTitle(/Blog/);
    
    // Kiểm tra xem có hiển thị tiêu đề "Bài viết mới nhất" không
    await expect(page.locator('h2:has-text("Bài viết mới nhất")')).toBeVisible();
    
    // Kiểm tra xem có hiển thị danh sách bài viết không
    await expect(page.locator('.post-card')).toHaveCount({ min: 1 });
    
    // Kiểm tra trực quan với Applitools
    await eyes.check('Trang Blog', Target.window().fully());
  });

  test('chuyển đổi giữa chế độ xem slider và grid', async ({ page }) => {
    // Điều hướng đến trang blog
    await page.goto('/blog');
    
    // Đợi cho đến khi trang được tải hoàn toàn
    await page.waitForSelector('.blog-posts');
    
    // Kiểm tra xem ban đầu có ở chế độ slider không
    await expect(page.locator('.slick-slider')).toBeVisible();
    
    // Click vào nút chuyển đổi chế độ xem grid
    await page.click('button.toggle-btn:has(.grid)');
    
    // Kiểm tra xem đã chuyển sang chế độ grid chưa
    await expect(page.locator('.posts-grid')).toBeVisible();
    await expect(page.locator('.slick-slider')).not.toBeVisible();
    
    // Kiểm tra trực quan với Applitools
    await eyes.check('Chế độ xem Grid', Target.window().fully());
    
    // Click vào nút chuyển đổi chế độ xem slider
    await page.click('button.toggle-btn:has(.list)');
    
    // Kiểm tra xem đã chuyển về chế độ slider chưa
    await expect(page.locator('.slick-slider')).toBeVisible();
    await expect(page.locator('.posts-grid')).not.toBeVisible();
    
    // Kiểm tra trực quan với Applitools
    await eyes.check('Chế độ xem Slider', Target.window().fully());
  });

  test('điều hướng đến trang chi tiết bài viết', async ({ page }) => {
    // Điều hướng đến trang blog
    await page.goto('/blog');
    
    // Đợi cho đến khi trang được tải hoàn toàn
    await page.waitForSelector('.blog-posts');
    
    // Click vào liên kết "Đọc thêm" của bài viết đầu tiên
    await page.click('.post-card:first-child .read-more');
    
    // Đợi cho đến khi trang chi tiết bài viết được tải
    await page.waitForURL(/\/blog\/\d+/);
    
    // Kiểm tra xem có hiển thị nội dung bài viết không
    await expect(page.locator('article.blog-detail')).toBeVisible();
    
    // Kiểm tra trực quan với Applitools
    await eyes.check('Trang Chi tiết Bài viết', Target.window().fully());
  });
}); 