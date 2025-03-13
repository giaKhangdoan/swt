import { Outlet } from "react-router-dom";

const BlogPublic = () => {
  return (
    <div className="blog-container">
      <Outlet />
    </div>
  );
};

export default BlogPublic;
