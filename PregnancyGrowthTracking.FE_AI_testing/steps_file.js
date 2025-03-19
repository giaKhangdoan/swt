// in this file you can append custom step methods to 'I' object

// Định nghĩa các phương thức tùy chỉnh cho AI testing

module.exports = function() {
  return actor({
    // Đăng nhập vào hệ thống
    loginAsUser: function(email, password) {
      this.amOnPage('/login');
      this.fillField('Email', email);
      this.fillField('Password', password);
      this.click('Đăng nhập');
      this.waitForText('Trang cá nhân', 10);
    },

    // ----- Các phương thức AI testing -----

    // Phân tích UI với Gemini
    analyzeUIWithGemini: async function(description = '') {
      this.say('🤖 Đang phân tích UI với Gemini AI...');
      return await this._executeGeminiHelper('validateUI', [description]);
    },

    // Phân tích một phần tử cụ thể với Gemini
    analyzeElementWithGemini: async function(locator, prompt) {
      this.say(`🤖 Đang phân tích phần tử "${locator}" với Gemini AI...`);
      return await this._executeGeminiHelper('analyzeElement', [locator, prompt]);
    },

    // Tạo nội dung với Gemini
    generateContentWithGemini: async function(prompt) {
      this.say('🤖 Đang tạo nội dung với Gemini AI...');
      return await this._executeGeminiHelper('generateContent', [prompt]);
    },

    // So sánh hai hình ảnh UI
    compareUIWithGemini: async function(beforePath, afterPath, description) {
      this.say('🤖 Đang so sánh UI trước và sau với Gemini AI...');
      return await this._executeGeminiHelper('compareImages', [beforePath, afterPath, description]);
    },

    // Phương thức helper để gọi GeminiHelper
    _executeGeminiHelper: async function(method, args) {
      try {
        // Kiểm tra đầy đủ helpers
        if (!this.helpers || typeof this.helpers !== 'object') {
          return 'Lỗi: Đối tượng helpers không tồn tại';
        }

        const helper = this.helpers.GeminiHelper;
        if (!helper) {
          return 'Lỗi: GeminiHelper không được tìm thấy. Kiểm tra cấu hình trong codecept.conf.js';
        }

        if (typeof helper[method] !== 'function') {
          return `Lỗi: Phương thức ${method} không tồn tại trong GeminiHelper`;
        }

        return await helper[method](...args);
      } catch (error) {
        console.error(`Lỗi khi gọi GeminiHelper.${method}:`, error);
        return `Lỗi: ${error.message}`;
      }
    },

    // Chụp ảnh màn hình hiện tại và lưu
    captureScreenshot: async function(name) {
      // Đợi để trang tải ổn định trước khi chụp
      await this.wait(2);
      const fileName = `./output/${name || 'screenshot'}_${Date.now()}.jpg`;
      try {
        await this.saveScreenshot(fileName);
        this.say(`📸 Đã chụp ảnh màn hình: ${fileName}`);
        return fileName;
      } catch (error) {
        this.say(`❌ Lỗi khi chụp ảnh màn hình: ${error.message}`);
        // Nếu lỗi timeout, thử lại với timeout ngắn hơn
        if (error.message.includes('timeout')) {
          this.say('⚠️ Thử lại với tùy chọn khác...');
          try {
            // Sử dụng tùy chọn khác để chụp ảnh
            await this.executeScript(function() {
              return document.documentElement.outerHTML;
            });
            await this.wait(1);
            await this.saveScreenshot(fileName);
            this.say(`�� Đã chụp lại ảnh màn hình thành công: ${fileName}`);
            return fileName;
          } catch (retryError) {
            this.say(`❌ Không thể chụp ảnh màn hình ngay cả khi thử lại: ${retryError.message}`);
            return null;
          }
        }
        return null;
      }
    },

    // Phân tích accessibility
    analyzeAccessibility: async function() {
      return this.analyzeUIWithGemini(
        'Hãy phân tích trang web dựa trên hướng dẫn tiếp cận WCAG 2.1. ' +
        'Kiểm tra độ tương phản, kích thước văn bản, cấu trúc heading, thuộc tính alt, ' +
        'và các vấn đề tiếp cận khác. Đề xuất cải thiện cụ thể.'
      );
    },

    // Phân tích UX design
    analyzeUXDesign: async function() {
      return this.analyzeUIWithGemini(
        'Hãy phân tích trải nghiệm người dùng của trang web này. ' +
        'Đánh giá tính nhất quán, tính trực quan, hiệu quả tương tác, ' +
        'và các nguyên tắc thiết kế UX. Xác định cả điểm mạnh và lĩnh vực cần cải thiện.'
      );
    },

    // Kiểm tra responsive design
    analyzeResponsiveDesign: async function(viewport) {
      if (viewport) {
        this.resizeWindow(viewport.width, viewport.height);
      }
      
      return this.analyzeUIWithGemini(
        `Đánh giá responsive design của trang web này ở kích thước viewport ${viewport?.width || 'hiện tại'} x ${viewport?.height || 'hiện tại'}. ` +
        'Kiểm tra xem nội dung có hiển thị đúng không, có vấn đề overflow không, ' +
        'các phần tử có tương thích với kích thước màn hình không.'
      );
    },

    // Báo cáo kết quả kiểm thử
    reportAIAnalysis: function(testName, result) {
      this.say(`\n----- 📊 Báo cáo phân tích AI cho "${testName}" -----\n`);
      this.say(result);
      this.say('\n----- Kết thúc báo cáo phân tích -----\n');
    }
  });
} 