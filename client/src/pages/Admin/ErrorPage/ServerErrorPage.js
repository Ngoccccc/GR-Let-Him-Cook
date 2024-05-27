import React from "react";
import ErrorPage from ".";

const ServerErrorPage = () => {
  return (
    <div>
      <ErrorPage code="500" message="Lỗi server" />
    </div>
  );
};

export default ServerErrorPage;
