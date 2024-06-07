const axios = require("axios");
const dotenv = require("dotenv");
const crypto = require("crypto");
const userHaveCourseModel = require("../models/userHaveCourseModel");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const momoPayment = async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  const { courseId, name, userId, reqAmount } = req.body;
  console.log(req.body);
  var accessKey = process.env.ACCESS_KEY;
  var secretKey = process.env.SECRET_KEY;
  var orderInfo = `Thanh toán đăng kí khóa học nấu ăn: ${name}`;
  var partnerCode = "MOMO";
  var redirectUrl = "https://gr-let-him-cook.vercel.app/course/my-course";
  var ipnUrl =
    "https://gr-let-him-cook-api-v1.vercel.app/api/v1/payment/momo-response";
  var requestType = "payWithMethod";
  var amount = reqAmount;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = JSON.stringify({ courseId, userId });
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";
  var orderExpireTime = 5;
  extraData = encodeURIComponent(extraData);
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
    orderExpireTime: 5,
  });
  //Create the HTTPS objects
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    port: 443,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const momoResponse = async (req, res) => {
  try {
    console.log("::callback");
    console.log(req.body);
    const { orderId, resultCode, extraData } = req.body;

    const { courseId, userId } = JSON.parse(decodeURIComponent(extraData));
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

    if (resultCode === 0) {
      const result = await userHaveCourseModel.create({ userId, courseId });
      return res
        .status(200)
        .json({ message: "Payment successful and course registered", result });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const checkTransactions = async (req, res) => {
  try {
    const { orderId } = req.body;
    const rawSignature = `accessKey=${process.env.ACCESS_KEY}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(rawSignature)
      .digest("hex");
    const requestBody = JSON.stringify({
      partnerCode: "MOMO",
      requestId: orderId,
      orderId,
      signature,
      lang: "vi",
    });

    //option for axios
    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };
    let result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { momoPayment, momoResponse, checkTransactions };
