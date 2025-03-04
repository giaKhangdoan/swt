Feature('DateChecker');

Scenario('test date selection', async ({ I }) => {
  I.wait(10);

  // Tìm theo text chính xác
  I.see('Kiểm tra ngày tháng');
  
  // Sử dụng XPath để tìm button
  I.seeElement({
    xpath: '//android.widget.TextView[contains(@text, "Ngày thứ nhất")]'
  });

  // Click vào button bằng text
  I.tap('Chọn ngày');
  I.wait(3);

  // Kiểm tra kết quả
  I.see('Ngày:');
  I.see('Thứ:');
});

Scenario('test date comparison', async ({ I }) => {
  I.wait(10);

  // Click button bằng text
  I.tap('Chọn ngày');
  I.wait(3);

  // Kiểm tra text
  I.see('So sánh:');
  I.see('Khoảng cách:');
});