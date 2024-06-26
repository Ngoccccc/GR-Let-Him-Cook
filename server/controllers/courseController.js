const courseModel = require("../models/courseModel.js");
const userModel = require("../models/userModel.js");
const userHaveCourseModel = require("../models/userHaveCourseModel.js");
const postModel = require("../models/postModel.js");
const mongoose = require("mongoose");

const createCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, image, description, price } = req.body;

    if (!name || !image || !description || !price) {
      return res
        .status(404)
        .json({ success: false, message: "not found data" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await userModel.findById(userId);
    if (!user && user.role != "chef") {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const course = new courseModel({ userId, name, image, description, price });
    await course.save();

    return res
      .status(200)
      .json({ success: true, message: "course create successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "course create false",
      error,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;
    const { name, image, description, price } = req.body;

    const course = await courseModel.findById(courseId);

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!course || course.userId.toString() != userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    if (!name || !image || !description || !price) {
      return res
        .status(404)
        .json({ success: false, message: "not found data" });
    }
    // Kiểm tra xem user có tồn tại không
    course.name = name;
    course.image = image;
    course.description = description;
    course.price = price;

    await course.save();

    return res
      .status(200)
      .json({ success: true, message: "course create successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "course create false",
      error,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.userId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    await courseModel.findByIdAndUpdate(courseId, { status: "disabled" });
    await postModel.updateMany({ courseId }, { status: "disabled" });
    return res.status(200).json({
      success: true,
      message: "Course disabled successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getAllCourses = async (req, res) => {
  try {
    // Lấy tất cả các khóa học từ cơ sở dữ liệu
    const courses = await courseModel
      .find({ status: "published" })
      .populate("userId", "name");

    return res.status(200).json({
      success: true,
      message: "All courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ userId: req.user._id, status: { $ne: "disabled" } })
      .populate("userId", "name");

    return res.status(200).json({
      success: true,
      message: "All courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getCoursesUnapproved = async (req, res) => {
  try {
    // Lấy tất cả các khóa học từ cơ sở dữ liệu
    const courses = await courseModel
      .find({ status: "waiting" })
      .populate("userId", "name");

    return res.status(200).json({
      success: true,
      message: "All courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const registerCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "course not found" });
    }
    const existingCourse = await userHaveCourseModel.findOne({
      courseId,
      userId,
    });
    console.log(existingCourse);
    if (existingCourse) {
      return res
        .status(400)
        .json({ success: false, message: "Course already register" });
    }

    const UserHaveCourse = new userHaveCourseModel({ userId, courseId });
    await UserHaveCourse.save();
    return res
      .status(200)
      .json({ success: true, message: "Course register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Course register false",
      error,
    });
  }
};

const getCoursesByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const courses = await userHaveCourseModel
      .find({ userId })
      .populate({
        path: "courseId",
        populate: {
          path: "userId", // Đường dẫn đến trường userId trong collection courseId
          model: "User",
          select: "name", // Tên của model chứa thông tin về userId
        },
      })
      .select("courseId")
      .lean();

    const transformCourses = courses.map((course) => course.courseId);
    return res.status(200).json({
      success: true,
      message: "All courses retrieved successfully",
      courses: transformCourses,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getAllPostsOfCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userHaveCourse = await userHaveCourseModel.findOne({
      userId,
      courseId,
    });

    if (userHaveCourse) {
      const posts = await postModel
        .find({ courseId, status: "published" })
        .sort("-createdAt")
        .select("_id title mediaTitle level intendTime likeCount");
      return res.status(200).json({ success: true, data: posts });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't  have this course" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).send({
        success: false,
        message: "Invalid params",
      });
    }
    console.log(req.user);
    let query = { _id: courseId };
    let postQuery = { courseId: courseId };
    if (req.user.role === "user" || req.user.role === "guest") {
      query.status = "published";
      postQuery.status = "published";
    } else {
      query.status = { $ne: "disabled" };
      postQuery.status = { $ne: "disabled" };
    }
    const courseInfo = await courseModel
      .findOne(query)
      .populate("userId", "name")
      .lean();
    if (!courseInfo) {
      return res.status(404).send({
        success: false,
        message: "course not found",
      });
    }
    const posts = await postModel
      .find(postQuery)
      .sort("-createdAt")
      .populate("userId", "name")
      .select("_id userId title mediaTitle level intendTime likeCount")
      .lean();
    const userRegisteredQuantity = await userHaveCourseModel
      .find({
        courseId,
      })
      .lean();
    console.log(userRegisteredQuantity.length);
    const data = {
      courseInfo,
      posts,
      userRegisteredQuantity: userRegisteredQuantity.length,
    };
    console.log(data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getCourseInfo = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).send({
        success: false,
        message: "Invalid params",
      });
    }
    console.log(req.user);
    let query = { _id: courseId };
    if (req.user.role === "user" || req.user.role === "guest") {
      query.status = "published";
    } else {
      query.status = { $ne: "disabled" };
    }
    const courseInfo = await courseModel
      .findOne(query)
      .populate("userId", "name")
      .lean();
    if (!courseInfo) {
      return res.status(404).send({
        success: false,
        message: "course not found",
      });
    }
    console.log(courseInfo);
    return res.status(200).json({ success: true, courseInfo });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const getUnregisteredCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy tất cả các khóa học đã đăng ký bởi người dùng
    const registeredCourses = await userHaveCourseModel
      .find({ userId })
      .select("courseId");

    // Tạo một mảng các ID khóa học đã đăng ký
    const registeredCourseIds = registeredCourses.map(
      (course) => course.courseId
    );

    // Tìm tất cả các khóa học chưa được đăng ký bởi người dùng
    const unregisteredCourses = await courseModel
      .find({
        _id: { $nin: registeredCourseIds },
        status: "published",
      })
      .populate("userId", "name");

    return res.status(200).json({
      success: true,
      message: "All unregistered courses retrieved successfully",
      courses: unregisteredCourses,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const checkUserHaveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(200).json({
        status: false,
      });
    }

    const haveCourseStatus = await userHaveCourseModel.findOne({
      courseId,
      userId,
    });
    return res.status(200).json({
      status: !!haveCourseStatus,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "course not found",
      });
    }

    await courseModel.findByIdAndUpdate(courseId, { status: "published" });
    await postModel.updateMany({ courseId }, { status: "published" });
    res.status(200).send({
      success: true,
      message: "course published Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while published course",
      error,
    });
  }
};
module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  registerCourse,
  getCoursesByUserId,
  getAllPostsOfCourse,
  getUnregisteredCourses,
  checkUserHaveCourse,
  approveCourse,
  getSingleCourse,
  getCoursesUnapproved,
  getMyCourses,
  deleteCourse,
  getCourseInfo,
};
