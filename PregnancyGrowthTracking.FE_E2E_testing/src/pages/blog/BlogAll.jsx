import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader, Calendar, User } from "lucide-react";
import "./BlogAll.scss";
import blogService from "../../api/services/blogService";

const BlogAll = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs...');
        const data = await blogService.getBlogs();
        console.log('Blog data:', data);
        
        if (!data || !data.posts) {
          throw new Error("Không thể tải danh sách bài viết");
        }

        setBlogs(data.posts);
        
        const allCategories = data.posts.reduce((acc, post) => {
          if (post.categories && Array.isArray(post.categories)) {
            post.categories.forEach(category => {
              const categoryName = typeof category === 'string' ? category : category.categoryName;
              if (categoryName) acc.add(categoryName);
            });
          }
          return acc;
        }, new Set());
        
        console.log('Available categories:', [...allCategories]);
        setAvailableCategories([...allCategories]);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const filterBlogs = () => {
      let results = [...blogs];

      // Lọc theo search term
      if (searchTerm) {
        results = results.filter((blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sửa lại logic lọc theo categories
      if (selectedCategories.length > 0) {
        results = results.filter((blog) =>
          blog.categories?.some(category => 
            selectedCategories.includes(category)
          )
        );
      }

      setFilteredBlogs(sortBlogs(results));
    };

    filterBlogs();
  }, [searchTerm, blogs, sortOption, selectedCategories]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const sortBlogs = (blogsToSort) => {
    const sorted = [...blogsToSort];
    switch (sortOption) {
      case "a-z":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return sorted.sort((a, b) => b.views - a.views);
      default:
        return sorted;
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Có lỗi xảy ra: {error}</p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Chia sẻ kiến thức và kinh nghiệm về thai kỳ</p>
      </div>

      <div className="search-filter-container">
        <div className="search-and-sort">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-box">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="a-z">A đến Z</option>
              <option value="z-a">Z đến A</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>
        </div>

        <div className="tags-container">
          {availableCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`tag-button ${
                selectedCategories.includes(category) ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-grid">
        {currentBlogs.map(({ id, title, body, blogImageUrl }) => (
          <div key={id} className="blog-card">
            <div className="blog-image">
              <img
                src={blogImageUrl}
                alt={title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${id}/400/300`;
                }}
              />
            </div>
            <div className="blog-content">
              <h2>{title}</h2>
              <p className="blog-excerpt">{body.substring(0, 150)}...</p>
              <div className="blog-meta">
                <span className="blog-date">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
              <Link to={`/member/blog/${id}`} className="read-more">
                Đọc thêm
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Sau
        </button>
      </div>
    </div>
  );
};

export default BlogAll;
