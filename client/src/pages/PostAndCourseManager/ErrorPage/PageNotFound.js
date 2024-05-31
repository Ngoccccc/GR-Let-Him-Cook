import React from "react";
import ErrorPage from ".";

const PageNotFound = ({ role }) => {
  return (
    <div>
      <ErrorPage code="404" message="Có thể bạn đã sai đường dẫn" role={role} />
    </div>
  );
};

export default PageNotFound;
