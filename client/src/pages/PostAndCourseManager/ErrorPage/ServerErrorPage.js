import React from "react";
import ErrorPage from ".";

const ServerErrorPage = ({ role }) => {
  return (
    <div>
      <ErrorPage code="500" message="Lỗi server" role={role} />
    </div>
  );
};

export default ServerErrorPage;
