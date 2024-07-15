// Node v10.15.3
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const userHaveCourseModel = require("../models/userHaveCourseModel");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
// APP INFO
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const zaloPayment = async (req, res) => {
  const embed_data = {
    redirecturl: "https://gr-let-him-cook.vercel.app/course/my-course",
  };
  console.log(req.body);
  const items = [
    {
      course: req.body,
    },
  ];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    expire_duration_seconds: 600,
    embed_data: JSON.stringify(embed_data),
    amount: req.body.reqAmount,
    description: `Ryouri Master - Thanh toán đăng ký khóa học #${req.body.name}`,
    bank_code: "",
    title: "Thanh toán đăng ký khóa học",
    callback_url:
      "https://gr-let-him-cook-api-v1.vercel.app/api/v1/payment/zalopay-response",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result);
    return res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const zalopayResponse = async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      let orderInfo = JSON.parse(JSON.parse(dataStr).item)[0].course;
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );
      const { courseId, userId } = orderInfo;
      console.log(courseId, userId);
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

      const result = await userHaveCourseModel.create({ userId, courseId });
      return res.status(200).json({
        message: "Payment successful and course registered",
        result,
      });
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

module.exports = { zaloPayment, zalopayResponse };
