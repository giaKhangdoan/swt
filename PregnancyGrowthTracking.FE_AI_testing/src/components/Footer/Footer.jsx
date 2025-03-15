"use client"

import { FaFacebookF, FaInstagram, FaYoutube, FaHeart, FaCalendarAlt } from "react-icons/fa"
import { CiMedicalCase } from "react-icons/ci"
import { FaBlog } from "react-icons/fa6"
import { FaNotesMedical } from "react-icons/fa"
import { TiSocialInstagram } from "react-icons/ti"
import { motion } from "framer-motion"
import "./Footer.scss"
import { Link } from "react-router-dom"

const footerSections = [
  {
    title: "Liên kết",
    links: [
      { name: "Về chúng tôi", url: "/about" },
      { name: "Blog", url: "/blog" },
      { name: "Liên hệ", url: "/contact" },
      { name: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "Dịch vụ",
    links: [
      {
        name: "Theo dõi Thai Kỳ",
        icon: <CiMedicalCase />,
        url: "/member/basic-tracking",
      },
      {
        name: "Lịch trình Thăm Khám",
        icon: <FaCalendarAlt />,
        url: "/member/calendar",
      },
      {
        name: "Ghi Chú Bác Sỹ",
        icon: <FaNotesMedical />,
        url: "/member/doctor-notes",
      },
      {
        name: "Blog",
        icon: <FaBlog />,
        url: "/blog",
      },
      {
        name: "Cộng Đồng",
        icon: <TiSocialInstagram />,
        url: "/basic-user/community",
      },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="brand-name">Mẹ Bầu</h3>
            <p className="brand-description">Đồng hành cùng mẹ trên hành trình thiêng liêng nhất cuộc đời</p>
            <div className="social-links">
              <motion.a href="#" className="social-link" whileHover={{ scale: 1.2 }}>
                <FaFacebookF />
              </motion.a>
              <motion.a href="#" className="social-link" whileHover={{ scale: 1.2 }}>
                <FaInstagram />
              </motion.a>
              <motion.a href="#" className="social-link" whileHover={{ scale: 1.2 }}>
                <FaYoutube />
              </motion.a>
            </div>
          </motion.div>
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              className="footer-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="section-title">{section.title}</h3>
              <ul className="section-links">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} className="link-item" whileHover={{ x: 5 }}>
                    <a href={link.url} className="footer-link">
                      {link.icon && <span className="link-icon">{link.icon}</span>}
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="section-title">Liên hệ</h3>
            <ul className="contact-info">
              <li>
                <Link to="/contact" className="contact-link" whileHover={{ scale: 1.1 }}>
                  Email: KhangDGSE184442@fpt.edu.vn
                </Link>
              </li>
              <li>
                <Link to="/contact" className="contact-link" whileHover={{ scale: 1.1 }}>
                  Hotline: 0383989481
                </Link>
              </li>
              <li>
                <Link to="/contact" className="contact-link" whileHover={{ scale: 1.1 }}>
                Địa chỉ: 874/44/21 Đoàn Văn Bơ, Phường 16, Quận 4, Hồ Chí Minh, Vietnam
                </Link> </li>
              <li>
      
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p>&copy; 2025 Mẹ Bầu. Tất cả quyền được bảo lưu.</p>
        <p>
          Made with <FaHeart className="heart-icon" /> in Vietnam
        </p>
      </motion.div>
    </footer>
  )
}

export default Footer

