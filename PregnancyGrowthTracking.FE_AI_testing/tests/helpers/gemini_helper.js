const Helper = require('@codeceptjs/helper');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiHelper extends Helper {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || 'AIzaSyDBBSk9GjW255u7yQYdEmgslN2uRrZBBdo';
    this.modelName = config.modelName || 'gemini-1.5-pro';
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
    } catch (error) {
      console.error(`Lỗi khi khởi tạo Gemini API: ${error.message}`);
    }
    
    this.outputDir = './output';
    
    // Tạo thư mục output nếu chưa tồn tại
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Khởi tạo phiên Gemini
   */
  async _before() {
    console.log('Khởi tạo phiên Gemini AI...');
  }

  /**
   * Kết thúc phiên Gemini
   */
  async _after() {
    console.log('Kết thúc phiên Gemini AI...');
  }

  /**
   * Đảm bảo model được khởi tạo
   * @private
   */
  _ensureModel() {
    if (!this.model) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      } catch (error) {
        throw new Error(`Không thể khởi tạo model Gemini: ${error.message}`);
      }
    }
    return this.model;
  }

  /**
   * Phân tích hình ảnh bằng Gemini
   * @param {string} imagePath - Đường dẫn đến hình ảnh
   * @param {string} prompt - Prompt cho Gemini
   * @returns {Promise<string>} - Kết quả phân tích
   */
  async analyzeImage(imagePath, prompt) {
    try {
      // Kiểm tra tham số
      if (!imagePath || !prompt) {
        return 'Lỗi: Thiếu đường dẫn hình ảnh hoặc prompt';
      }
      
      // Kiểm tra file tồn tại
      if (!fs.existsSync(imagePath)) {
        return `Lỗi: Không tìm thấy file hình ảnh tại ${imagePath}`;
      }

      const imageData = fs.readFileSync(imagePath);
      const imageBase64 = imageData.toString('base64');
      const model = this._ensureModel();

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }]
      });

      if (!result?.response) {
        return 'Không nhận được phản hồi từ Gemini API';
      }

      return result.response.text();
    } catch (error) {
      console.error(`Lỗi khi phân tích hình ảnh: ${error.message}`);
      return `Không thể phân tích hình ảnh: ${error.message}`;
    }
  }

  /**
   * Phân tích phần tử trên trang web
   * @param {string} locator - Bộ chọn CSS hoặc XPath
   * @param {string} prompt - Prompt cho Gemini
   * @returns {Promise<string>} - Kết quả phân tích
   */
  async analyzeElement(locator, prompt) {
    const helper = this.helpers.Playwright;
    if (!helper) {
      return 'Lỗi: Không tìm thấy helper Playwright';
    }
    
    if (!locator || !prompt) {
      return 'Lỗi: Thiếu locator hoặc prompt';
    }

    const fileName = `element_${Date.now()}.jpg`;
    const tempPath = path.join(this.outputDir, fileName);
    
    try {
      // Kiểm tra xem phần tử có tồn tại không trước khi chụp ảnh
      const isVisible = await helper.grabNumberOfVisibleElements(locator) > 0;
      if (!isVisible) {
        return `Phần tử "${locator}" không hiển thị trên trang`;
      }
      
      await helper.saveElementScreenshot(locator, tempPath);
      const response = await this.analyzeImage(tempPath, prompt);
      
      return response;
    } catch (error) {
      console.error(`Lỗi khi phân tích phần tử: ${error.message}`);
      return `Không thể phân tích phần tử: ${error.message}`;
    } finally {
      // Xóa file tạm nếu tồn tại
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  /**
   * Tạo nội dung với Gemini
   * @param {string} prompt - Prompt cho Gemini
   * @returns {Promise<string>} - Nội dung được tạo
   */
  async generateContent(prompt) {
    if (!prompt) {
      return 'Lỗi: Thiếu prompt';
    }
    
    try {
      const model = this._ensureModel();
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      if (!result?.response) {
        return 'Không nhận được phản hồi từ Gemini API';
      }
      
      return result.response.text();
    } catch (error) {
      console.error(`Lỗi khi tạo nội dung: ${error.message}`);
      return `Không thể tạo nội dung: ${error.message}`;
    }
  }

  /**
   * Phân tích giao diện người dùng hiện tại
   * @param {string} description - Mô tả và hướng dẫn phân tích
   * @returns {Promise<string>} - Kết quả phân tích
   */
  async validateUI(description) {
    if (!description) {
      description = 'Hãy phân tích giao diện người dùng này và đánh giá về UX/UI, tổ chức thông tin, và hiệu quả sử dụng.';
    }
    
    const helper = this.helpers.Playwright;
    if (!helper) {
      return 'Lỗi: Không tìm thấy helper Playwright';
    }
    
    const fileName = `ui_${Date.now()}.jpg`;
    const tempPath = path.join(this.outputDir, fileName);
    
    try {
      await helper.saveScreenshot(tempPath);
      
      const prompt = `Đây là ảnh chụp màn hình của ứng dụng web. ${description}`;
      const response = await this.analyzeImage(tempPath, prompt);
      
      this.debug(`[Gemini AI] Phân tích UI: ${response.substring(0, 100)}...`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi phân tích UI: ${error.message}`);
      return `Không thể phân tích UI: ${error.message}`;
    } finally {
      // Xóa file tạm nếu tồn tại
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  /**
   * So sánh hai hình ảnh UI (trước và sau khi thay đổi)
   * @param {string} beforeImagePath - Đường dẫn đến hình ảnh trước
   * @param {string} afterImagePath - Đường dẫn đến hình ảnh sau
   * @param {string} description - Mô tả về những gì cần so sánh
   * @returns {Promise<string>} - Kết quả phân tích
   */
  async compareImages(beforeImagePath, afterImagePath, description) {
    if (!beforeImagePath || !afterImagePath) {
      return 'Lỗi: Thiếu đường dẫn hình ảnh';
    }
    
    if (!fs.existsSync(beforeImagePath) || !fs.existsSync(afterImagePath)) {
      return `Lỗi: Không tìm thấy một hoặc cả hai file hình ảnh`;
    }
    
    try {
      const beforeImageData = fs.readFileSync(beforeImagePath);
      const afterImageData = fs.readFileSync(afterImagePath);
      
      const beforeImageBase64 = beforeImageData.toString('base64');
      const afterImageBase64 = afterImageData.toString('base64');

      const prompt = `Đây là hai ảnh chụp màn hình của ứng dụng web. Ảnh đầu tiên là trước thay đổi, ảnh thứ hai là sau thay đổi. ${description || 'Hãy so sánh hai ảnh và mô tả sự khác biệt.'}`;
      
      const model = this._ensureModel();
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: beforeImageBase64
              }
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: afterImageBase64
              }
            }
          ]
        }]
      });

      if (!result?.response) {
        return 'Không nhận được phản hồi từ Gemini API';
      }
      
      return result.response.text();
    } catch (error) {
      console.error(`Lỗi khi so sánh hình ảnh: ${error.message}`);
      return `Không thể so sánh hình ảnh: ${error.message}`;
    }
  }
}

module.exports = GeminiHelper; 