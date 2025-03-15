const React = require('react');
const { render, screen, waitFor, fireEvent } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const BlogSlide = require('../../src/components/BlogSilde/BlogSilde').default;
const blogService = require('../../src/api/services/blogService');

// Giả lập module blogService
jest.mock('../../src/api/services/blogService', () => ({
  getBlogs: jest.fn()
}));

describe('BlogSlide Component', () => {
  const mockPosts = {
    posts: [
      {
        id: 1,
        title: 'Bài viết 1',
        body: 'Nội dung bài viết 1 chi tiết',
        categories: ['Mang thai', 'Sức khỏe'],
        blogImageUrl: 'https://example.com/image1.jpg',
        createdAt: '2023-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        title: 'Bài viết 2',
        body: 'Nội dung bài viết 2 chi tiết',
        categories: ['Dinh dưỡng'],
        blogImageUrl: 'https://example.com/image2.jpg',
        createdAt: '2023-01-02T00:00:00.000Z'
      }
    ]
  };

  beforeEach(() => {
    // Thiết lập giá trị trả về mặc định cho mock
    blogService.getBlogs.mockResolvedValue(mockPosts);
  });

  afterEach(() => {
    // Xóa tất cả các mock sau mỗi test
    jest.clearAllMocks();
  });

  test('hiển thị trạng thái loading khi đang tải dữ liệu', () => {
    render(
      <BrowserRouter>
        <BlogSlide />
      </BrowserRouter>
    );
    
    // Kiểm tra xem có hiển thị skeleton loading không
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(4);
  });

  test('hiển thị danh sách bài viết sau khi tải dữ liệu thành công', async () => {
    render(
      <BrowserRouter>
        <BlogSlide />
      </BrowserRouter>
    );
    
    // Đợi cho đến khi dữ liệu được tải
    await waitFor(() => {
      expect(screen.getAllByText('Bài viết 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Bài viết 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Nội dung bài viết 1 chi tiết/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/#Mang thai/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/#Sức khỏe/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/#Dinh dưỡng/)[0]).toBeInTheDocument();
    });
  });

  test('xử lý lỗi khi không thể tải dữ liệu', async () => {
    // Giả lập lỗi khi gọi API
    blogService.getBlogs.mockRejectedValue(new Error('Lỗi khi tải dữ liệu'));
    
    render(
      <BrowserRouter>
        <BlogSlide />
      </BrowserRouter>
    );
    
    // Đợi cho đến khi component được render hoàn toàn
    await waitFor(() => {
      // Kiểm tra xem component có hiển thị trạng thái không có dữ liệu không
      expect(screen.queryByText('Bài viết 1')).not.toBeInTheDocument();
    });
  });

  test('chuyển đổi giữa chế độ xem slider và grid', async () => {
    render(
      <BrowserRouter>
        <BlogSlide />
      </BrowserRouter>
    );
    
    // Đợi cho đến khi dữ liệu được tải
    await waitFor(() => {
      expect(screen.getAllByText('Bài viết 1')[0]).toBeInTheDocument();
    });
    
    // Kiểm tra xem ban đầu có ở chế độ slider không
    expect(screen.getByTestId('slider-view')).toBeInTheDocument();
    
    // Click vào nút chuyển đổi chế độ xem
    fireEvent.click(screen.getByTestId('grid-view-button'));
    
    // Kiểm tra xem đã chuyển sang chế độ grid chưa
    expect(screen.getByTestId('grid-view')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-view')).not.toBeInTheDocument();
  });
}); 