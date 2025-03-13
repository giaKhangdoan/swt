describe('Calendar Tests', () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 30000)
    cy.login('vip2', 'vip123')
    cy.visit('/member/calendar')
    cy.wait(10000)
  })

  it('Hiển thị trang lịch', () => {
    // Kiểm tra header
    cy.get('.calendar-header h1')
      .should('be.visible')
      .and('contain', 'Lịch thai kỳ')

    // Kiểm tra các nút chức năng
    cy.get('.header-actions .history-btn')
      .should('be.visible')
      .and('contain', 'Lịch sử')

    cy.get('.header-actions .add-event-btn')
      .should('be.visible')
      .and('contain', 'Thêm sự kiện')
  })

  it('Thêm sự kiện mới', () => {
    // Click nút thêm sự kiện
    cy.get('.add-event-btn').click()
    cy.wait(2000)

    // Kiểm tra form hiển thị
    cy.get('.modal-content')
      .should('be.visible')
      .within(() => {
        // Điền form
        cy.get('input[type="text"]')
          .type('Test Event')

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split('T')[0]
        
        cy.get('input[type="date"]')
          .type(tomorrowStr)

        cy.get('input[type="time"]')
          .type('14:00')

        cy.get('select')
          .select('Uống thuốc')

        cy.get('textarea')
          .type('Test notification')

        // Submit form
        cy.get('button[type="submit"]').click()
      })

    // Đợi api call hoàn thành
    cy.wait(5000)

    // Kiểm tra sự kiện đã được thêm
    cy.get('.event-pill')
      .should('exist')
      .and('contain', 'Test Event')
  })
}) 