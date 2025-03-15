"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  FaBabyCarriage,
  FaCalendarAlt,
  FaNotesMedical,
  FaBlog,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserEdit,
  FaBell,
} from "react-icons/fa"
import "./Navbar.scss"

const NavLink = ({ to, children, icon, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className={`nav-link ${isActive ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{children}</span>
    </Link>
  )
}

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showSidebarNotifications, setShowSidebarNotifications] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("userData"))

    if (token) {
      try {
        const decoded = jwtDecode(token)
        console.group("NavBar - User Information")
        console.log("UserData from localStorage:", userData)

        // Lấy trực tiếp từ userData vì đã được lưu từ authService
        setUserInfo({
          ...decoded,
          fullName: userData?.fullName,
          email: userData?.email,
          userName: userData?.userName,
          role: userData?.role,
        })

        setIsLoggedIn(true)
        setIsAdmin(userData?.role === "admin")

        if (userData?.profileImageUrl) {
          setProfileImage(userData.profileImageUrl)
        }
      } catch (error) {
        console.error("Token decode error:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        setIsLoggedIn(false)
        setUserInfo(null)
        setIsAdmin(false)
        setProfileImage(null)
      }
    }

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "userData") {
        const newUserData = JSON.parse(e.newValue)
        if (newUserData?.profileImageUrl) {
          setProfileImage(newUserData.profileImageUrl)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Giả lập thông báo cho phiên bản public
  useEffect(() => {
    // Tạo một số thông báo mẫu
    const sampleNotifications = [
      {
        reminderType: "Thông báo",
        title: "Chào mừng đến với Mẹ Bầu",
        date: new Date().toISOString(),
        time: "10:00"
      },
      {
        reminderType: "Tin tức",
        title: "Bài viết mới về dinh dưỡng thai kỳ",
        date: new Date(Date.now() + 86400000).toISOString(), // Ngày mai
        time: "14:30"
      }
    ]
    
    setNotifications(sampleNotifications)
  }, [])

  const formatDateTime = (date, time) => {
    try {
      const dateStr = date.includes("T") ? date.split("T")[0] : date
      const dateObj = new Date(`${dateStr}T${time}`)

      return `${time} ${dateObj.toLocaleDateString("vi-VN")}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const handleLogout = () => {
    console.log("Logging out...")
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setIsLoggedIn(false)
    setUserInfo(null)
    setIsAdmin(false)
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    }
  }

  // Thêm useEffect để handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Đóng dropdown thông báo trong sidebar khi click bên ngoài
      if (showSidebarNotifications && 
          !event.target.closest('.sidebar-notification-dropdown') && 
          !event.target.closest('.sidebar-notification-button')) {
        setShowSidebarNotifications(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSidebarNotifications])

  // Thêm useEffect để theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Tự động đóng sidebar khi chuyển từ mobile sang desktop
      if (!mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} style={{ margin: 0, padding: 0 }}>
        <div className="navbar-container">
          <div className="logo-section">
            <Link to="/" className="navbar-logo">
              <img src="/Logo bau-02.png" alt="Mẹ Bầu" className="navbar-logo-image" />
              <span className="navbar-logo-text">Mẹ Bầu</span>
            </Link>
            {/* Chỉ hiển thị nút toggle sidebar trên mobile */}
            {isMobile && (
              <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
                {isSidebarOpen ? (
                  <FaTimes className="toggle-icon" />
                ) : (
                  <FaBars className="toggle-icon" />
                )}
              </button>
            )}
          </div>

          <div className={`navbar-content ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="menu-section">
              {isAdmin && (
                <div className="nav-item">
                  <NavLink to="/admin" icon={<FaUserCircle className="nav-icon" />} onClick={closeMobileMenu}>
                    Quản trị
                  </NavLink>
                </div>
              )}
              <div className="nav-item">
                <NavLink
                  to="/member/basic-tracking"
                  icon={<FaBabyCarriage className="nav-icon" />}
                  onClick={closeMobileMenu}
                >
                  Theo Dõi Thai Kỳ
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="/member/calendar" icon={<FaCalendarAlt className="nav-icon" />} onClick={closeMobileMenu}>
                  Lịch Trình Thăm Khám
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink
                  to="/member/doctor-notes"
                  icon={<FaNotesMedical className="nav-icon" />}
                  onClick={closeMobileMenu}
                >
                  Ghi Chú Bác Sĩ
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="/member/blog" icon={<FaBlog className="nav-icon" />} onClick={closeMobileMenu}>
                  Blog
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="/member/community" icon={<FaUsers className="nav-icon" />} onClick={closeMobileMenu}>
                  Cộng Đồng
                </NavLink>
              </div>
            </div>

            <div className="notification-container">
              <button
                className="notification-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <h3>
                    Lịch nhắc sắp tới
                    <button
                      className="close-button"
                      onClick={() => setShowNotifications(false)}
                    >
                      ×
                    </button>
                  </h3>

                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>Không có lịch nhắc nào sắp tới</p>
                      </div>
                    ) : (
                      notifications.map((reminder, index) => (
                        <div key={index} className="notification-item">
                          <div className="notification-type">
                            {reminder.reminderType || "Khám thai"}
                          </div>
                          <div className="notification-content">
                            <h4>{reminder.title}</h4>
                            <p className="notification-time">
                              {formatDateTime(reminder.date, reminder.time)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    to="/calendar"
                    className="view-all-link"
                    onClick={() => setShowNotifications(false)}
                  >
                    Xem tất cả lịch
                  </Link>
                </div>
              )}
            </div>

            <div className="auth-section">
              {!isLoggedIn ? (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-login" onClick={closeMobileMenu}>
                    Đăng Nhập
                  </Link>
                  <Link to="/register" className="btn btn-register" onClick={closeMobileMenu}>
                    Đăng Ký
                  </Link>
                </div>
              ) : (
                <div className="user-menu">
                  <button
                    onClick={toggleDropdown}
                    className="user-menu-button"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="user-avatar"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                          setProfileImage(null)
                        }}
                      />
                    ) : (
                      <FaUserCircle className="user-icon" />
                    )}
                    <span className="user-name">
                      {userInfo?.fullName || "Người dùng"}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-profile-header">
                        {profileImage ? (
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="dropdown-user-avatar"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg"
                              setProfileImage(null)
                            }}
                          />
                        ) : (
                          <FaUserCircle className="dropdown-user-icon" />
                        )}
                        <div className="user-details">
                          <div className="user-name">
                            {userInfo?.fullName || "Người dùng"}
                          </div>
                          <div className="user-email">{userInfo?.email}</div>
                        </div>
                      </div>
                      <div className="user-info">
                        <div className="info-item">
                          Ngày sinh: {userInfo?.birthDate}
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link
                        to="/profile/edit"
                        className="edit-profile-button"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserEdit className="edit-icon" />
                        Chỉnh sửa thông tin
                      </Link>
                      <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt className="logout-icon" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer" style={{ margin: 0, padding: 0 }}></div>

      {/* Chỉ render sidebar khi ở chế độ mobile */}
      {isMobile && (
        <>
          {/* Sidebar Menu */}
          <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <img
                  src="/Logo bau-02.png"
                  alt="Mẹ Bầu"
                  className="sidebar-logo-image"
                />
                <h2 className="sidebar-title">Mẹ Bầu</h2>
              </div>
              <button className="close-sidebar" onClick={toggleSidebar}>
                <FaTimes />
              </button>
            </div>
            
            {/* Thêm thông tin người dùng vào sidebar */}
            {isLoggedIn && (
              <div className="sidebar-user-profile">
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="sidebar-user-avatar"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg"
                      setProfileImage(null)
                    }}
                  />
                ) : (
                  <FaUserCircle className="sidebar-user-icon" />
                )}
                <div className="sidebar-user-info">
                  <h3 className="sidebar-user-name">{userInfo?.fullName || "Người dùng"}</h3>
                  <p className="sidebar-user-email">{userInfo?.email}</p>
                </div>
              </div>
            )}
            
            <div className="sidebar-items">
              <Link to="/member/basic-tracking" className="sidebar-menu-item">
                <div className="sidebar-icon"><FaBabyCarriage /></div>
                <span className="sidebar-text">Theo Dõi Thai Kỳ</span>
              </Link>
              <Link to="/member/calendar" className="sidebar-menu-item">
                <div className="sidebar-icon"><FaCalendarAlt /></div>
                <span className="sidebar-text">Lịch Trình Thăm Khám</span>
              </Link>
              <Link to="/member/doctor-notes" className="sidebar-menu-item">
                <div className="sidebar-icon"><FaNotesMedical /></div>
                <span className="sidebar-text">Ghi Chú Bác Sĩ</span>
              </Link>
              <Link to="/member/blog" className="sidebar-menu-item">
                <div className="sidebar-icon"><FaBlog /></div>
                <span className="sidebar-text">Blog</span>
              </Link>
              <Link to="/member/community" className="sidebar-menu-item">
                <div className="sidebar-icon"><FaUsers /></div>
                <span className="sidebar-text">Cộng Đồng</span>
              </Link>
              
              {/* Thêm nút thông báo vào sidebar */}
              <button 
                className="sidebar-menu-item sidebar-notification-button"
                onClick={(e) => {
                  e.stopPropagation() // Ngăn sự kiện lan ra ngoài
                  setShowSidebarNotifications(!showSidebarNotifications)
                }}
              >
                <div className="sidebar-icon">
                  <FaBell />
                  {notifications.length > 0 && (
                    <span className="sidebar-notification-badge">{notifications.length}</span>
                  )}
                </div>
                <span className="sidebar-text">Thông báo</span>
              </button>
            </div>
            
            {/* Thêm nút đăng xuất hoặc đăng nhập dưới cùng */}
            <div className="sidebar-footer">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="sidebar-logout-button">
                  <FaSignOutAlt className="sidebar-icon" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link to="/login" className="sidebar-logout-button" onClick={toggleSidebar}>
                  <FaUserCircle className="sidebar-icon" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Overlay */}
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
            onClick={toggleSidebar}
          ></div>

          {/* Dropdown thông báo cho sidebar */}
          {showSidebarNotifications && (
            <div className="sidebar-notification-dropdown">
              <div className="sidebar-notification-header">
                <h3>Lịch nhắc sắp tới</h3>
                <button className="close-button" onClick={() => setShowSidebarNotifications(false)}>
                  ×
                </button>
              </div>
              
              <div className="sidebar-notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <i className="fas fa-bell-slash"></i>
                    <p>Không có lịch nhắc nào sắp tới</p>
                  </div>
                ) : (
                  notifications.map((reminder, index) => (
                    <div key={index} className="sidebar-notification-item">
                      <div className="notification-type">
                        {reminder.reminderType || "Khám thai"}
                      </div>
                      <div className="notification-content">
                        <h4>{reminder.title}</h4>
                        <p className="notification-time">
                          {formatDateTime(reminder.date, reminder.time)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <Link
                to="/calendar"
                className="view-all-link"
                onClick={() => setShowSidebarNotifications(false)}
              >
                Xem tất cả lịch
              </Link>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default NavBar

