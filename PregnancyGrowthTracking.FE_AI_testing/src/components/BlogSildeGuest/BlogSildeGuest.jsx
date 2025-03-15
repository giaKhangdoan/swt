"use client"

import { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./BlogSildeGuest.scss"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react"
import { motion } from "framer-motion"
import blogService from "../../api/services/blogService"

const BlogSlideGuest = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("slider")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getBlogs()
        if (!data || !data.posts) throw new Error("Không thể tải bài viết")
        
        const sortedPosts = data.posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8)
        setPosts(sortedPosts)
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
    >
      <div className="post-icon">
        <img 
          src={blogImageUrl} 
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://picsum.photos/seed/${id}/300/300`;
          }}
        />
      </div>
      <div className="post-content">
        <h3>{title}</h3>
        <p>{body.substring(0, 100)}...</p>
        {categories?.length > 0 && (
          <div className="post-categories">
            {categories.map((category, index) => (
              <span key={index} className="category-tag">
                #{category}
              </span>
            ))}
          </div>
        )}
        <Link to={`/basic-user/blog/${id}`} className="read-more">
          Đọc thêm
          <span className="ripple"></span>
        </Link>
      </div>
    </motion.div>
  )

  const renderLoading = () => (
    <div className="loading-cards">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="post-card skeleton">
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
    <section className="blog-posts">
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
        >
          Bài viết mới nhất
        </motion.h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "slider" ? "active" : ""}`}
            onClick={() => setViewMode("slider")}
          >
            <List size={20} />
          </button>
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        renderLoading()
      ) : viewMode === "slider" ? (
        <Slider {...settings}>
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </Slider>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogSlideGuest

