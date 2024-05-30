function extractImageName(url) {
  // Tách URL thành các phần bằng dấu "/"
  const parts = url.split("/");

  // Lấy phần tử cuối cùng trong mảng parts
  const lastPart = parts[parts.length - 1];

  // Tách số từ phần cuối cùng của URL bằng dấu "?"
  const number = lastPart.split("?")[0];
  const convertedString = decodeURIComponent(number.replace(/%2F/g, "/"));
  return convertedString;
}

export default extractImageName;
