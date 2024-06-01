import React from "react";
import { useParams } from "react-router-dom";
import CreatePost from "../PostAndCourseManager/CreatePost";
const ChefCreatePostForCourse = () => {
  const { id } = useParams();
  return (
    <div>
      <CreatePost role="chef" courseId={id} />
    </div>
  );
};

export default ChefCreatePostForCourse;
