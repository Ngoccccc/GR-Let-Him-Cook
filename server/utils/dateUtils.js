const moment = require("moment");
require("moment-timezone");

const transformTimestamp = (timestamp) => {
  // Convert the timestamp to the Ho Chi Minh City timezone
  const hcmTime = moment(timestamp).tz("Asia/Ho_Chi_Minh");

  // Format the date according to the desired format
  const formattedDate = hcmTime.format("DD/MM/YYYY - h:mm A");

  return formattedDate;
};

module.exports = { transformTimestamp };
