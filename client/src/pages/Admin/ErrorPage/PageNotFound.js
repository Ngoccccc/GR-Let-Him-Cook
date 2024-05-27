import React from "react";
import ErrorPage from ".";

const PageNotFound = () => {
  return (
    <div>
      <ErrorPage code="404" message="Có thể bạn đã sai đường dẫn" />
    </div>
  );
};

export default PageNotFound;
