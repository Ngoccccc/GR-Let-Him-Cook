import React from "react";
import ErrorPage from ".";

const NotHavePost = () => {
  return (
    <div>
      <ErrorPage
        code="403"
        message="Bài viết này trong một khóa học mà bạn chưa sở hữu"
      />
    </div>
  );
};

export default NotHavePost;
