const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Chuyển đổi chuỗi sang dạng tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu tổ hợp
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // Thay thế chữ đ
    .replace(/[^a-zA-Z0-9\s]/g, ""); // Loại bỏ các ký tự không phải chữ cái và số
};
export default removeVietnameseTones;
