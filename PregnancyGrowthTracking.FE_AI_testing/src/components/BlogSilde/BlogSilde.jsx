"use client"

import { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./BlogSilde.scss"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react"
import { motion } from "framer-motion"
import blogService from "../../api/services/blogService"
import { API_BASE_URL } from "../../api/constants/apiEndpoints"

const BlogSlide = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("slider")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching blog posts...')
        const data = await blogService.getBlogs()
        console.log('Blog response:', data)
        
        if (data && data.posts) {
          const sortedPosts = data.posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8)
          
          console.log('Sorted posts:', sortedPosts)
          setPosts(sortedPosts)
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const CustomArrow = ({ direction, onClick }) => (
    <button
      className={`custom-arrow ${direction}`}
      onClick={onClick}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
      data-testid={`${direction}-arrow`}
    >
      {direction === 'prev' ? (
        <ChevronLeft size={24} />
      ) : (
        <ChevronRight size={24} />
      )}
    </button>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1440,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  }

  const PostCard = ({ title, body, id, categories, blogImageUrl }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="post-card"
      data-testid={`post-card-${id}`}
    >
      <div className="post-icon">
        <img 
          src={blogImageUrl}
          alt={title}
          data-testid={`post-image-${id}`}
          onError={(e) => {
            console.error('Error loading blog slide image:', id);
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className="post-content">
        <h3 data-testid={`post-title-${id}`}>{title}</h3>
        <p data-testid={`post-body-${id}`}>{body.substring(0, 100)}...</p>
        {categories?.length > 0 && (
          <div className="post-categories" data-testid={`post-categories-${id}`}>
            {categories.map((category, index) => (
              <span key={index} className="category-tag" data-testid={`category-${id}-${index}`}>
                #{typeof category === 'string' ? category : category.categoryName}
              </span>
            ))}
          </div>
        )}
        <Link to={`/blog/${id}`} className="read-more" data-testid={`read-more-${id}`}>
          Đọc thêm
          <span className="ripple"></span>
        </Link>
      </div>
    </motion.div>
  )

  const renderLoading = () => (
    <div className="loading-cards" data-testid="loading-skeleton">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="post-card skeleton" data-testid="skeleton-card">
          <div className="post-icon skeleton-image" />
          <div className="post-content">
            <div className="skeleton-title" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
            <div className="skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className="blog-posts" data-testid="blog-posts-section">
      <div className="blog-background">
        <div className="wave wave1" />
        <div className="wave wave2" />
        <div className="wave wave3" />
      </div>

      <div className="blog-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          data-testid="blog-title"
        >
          Bài viết mới nhất
        </motion.h2>
        <div className="view-toggle" data-testid="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "slider" ? "active" : ""}`}
            onClick={() => setViewMode("slider")}
            data-testid="slider-view-button"
          >
            <List size={20} />
          </button>
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            data-testid="grid-view-button"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        renderLoading()
      ) : viewMode === "slider" ? (
        <div data-testid="slider-view">
          <Slider {...settings}>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </Slider>
        </div>
      ) : (
        <div className="posts-grid" data-testid="grid-view">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogSlide

