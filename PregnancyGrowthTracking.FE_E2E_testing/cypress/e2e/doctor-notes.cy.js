describe('Doctor Notes Tests', () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 30000)
    cy.login('vip2', 'vip123')
    cy.visit('/member/doctor-notes')
    cy.wait(10000)
  })

  it('Hiển thị trang ghi chú bác sĩ', () => {
    // Kiểm tra tiêu đề
    cy.get('.page-title')
      .should('be.visible')
      .and('contain', 'Ghi Chú Bác Sĩ')

    // Kiểm tra nút thêm ghi chú
    cy.get('.add-note-btn')
      .should('be.visible')
      .and('contain', 'Thêm Ghi Chú Mới')
  })

  it('Thêm ghi chú mới', () => {
    // Click nút thêm ghi chú
    cy.get('.add-note-btn').click()
    cy.wait(2000)

    // Kiểm tra form hiển thị
    cy.get('.modal-content')
      .should('be.visible')
      .within(() => {
        // Điền form
        const today = new Date().toISOString().split('T')[0]
        cy.get('input[type="date"]')
          .type(today)

        cy.get('#note1')
          .type('Test Hospital and Doctor')

        cy.get('#diagnosis')
          .type('Test Diagnosis')

        cy.get('#note2')
          .type('Test Details')

        // Upload ảnh test - Sửa phần này
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })

        // Submit form
        cy.get('button[type="submit"]').click()
      })

    // Đợi api call hoàn thành
    cy.wait(5000)

    // Kiểm tra ghi chú đã được thêm
    cy.get('.note-item')
      .should('exist')
      .and('contain', 'Test Hospital and Doctor')
  })

  it('Xóa ghi chú', () => {
    // Tìm ghi chú đầu tiên và xóa
    cy.get('.note-item')
      .first()
      .within(() => {
        cy.get('.delete-btn').click()
      })

    // Xác nhận xóa trong dialog
    cy.on('window:confirm', () => true)

    // Đợi api call hoàn thành
    cy.wait(5000)
  })
}) 