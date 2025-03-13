// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

// Lệnh đăng nhập
Cypress.Commands.add('login', (username = 'vip2', password = 'vip123') => {
  cy.visit('/login');
  cy.get('input[type="text"]').first().clear().type(username);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  
  // Đợi chuyển hướng và API calls
  cy.url().should('include', '/member');
  cy.wait(2000); // Đợi các API calls ban đầu hoàn thành
});

// Lệnh đăng ký
Cypress.Commands.add('register', (userData) => {
  const defaultUser = {
    userName: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };
  
  const user = { ...defaultUser, ...userData };
  
  cy.visit('/register');
  cy.get('input[name=userName]').type(user.userName);
  cy.get('input[name=email]').type(user.email);
  cy.get('input[name=password]').type(user.password);
  cy.get('input[name=confirmPassword]').type(user.confirmPassword);
  cy.get('button[type=submit]').click();
});

// Lệnh tạo thai nhi mới
Cypress.Commands.add('createFoetus', (name = 'Test Baby', gender = 'Male') => {
  cy.visit('/member/basic-tracking');
  cy.wait(2000);
  
  cy.contains('button', /thêm thai nhi|add foetus/i).click();
  cy.get('input[name="name"]').type(name);
  cy.get('select[name="gender"]').select(gender);
  cy.get('button[type="submit"]').click();
  
  cy.contains(name).should('be.visible');
});

// Lệnh tạo lịch nhắc nhở
Cypress.Commands.add('createReminder', (title = 'Test Reminder', date, time = '10:00') => {
  const today = new Date();
  const formattedDate = date || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  cy.visit('/member/calendar');
  cy.get('button').contains(/thêm lịch|add reminder/i).click();
  cy.get('input[name=title]').type(title);
  cy.get('input[name=date]').type(formattedDate);
  cy.get('input[name=time]').type(time);
  cy.get('button[type=submit]').click();
}); 