const { I } = inject();

Given('I am on DateChecker screen', () => {
  // Các bước để điều hướng đến màn hình DateChecker
});

When('I select first date {string}', (date) => {
  I.tap('~datePickerButton1');
  I.selectDate(date);
});

When('I select second date {string}', (date) => {
  I.tap('~datePickerButton2');
  I.selectDate(date);
});

Then('I should see date info {string}', (text) => {
  I.see(text);
});