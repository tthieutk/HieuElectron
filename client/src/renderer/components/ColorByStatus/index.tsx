import React from 'react';

const ColorByStatus = (status) => {
    switch (status) {
      case '承認待ち':
        return '#D6E8F8'; // Màu xanh cho trạng thái '承認待ち'
      case '差し戻し':
        return '#FBE5B9'; // Màu vàng cho trạng thái '差し戻し'
      case '下書き':
        return '#E9E9E9'; // Màu nâu cho trạng thái '下書き'
      case '却下':
        return '#FFA5A5'; // Màu đỏ cho trạng thái '却下'
      case '完了':
        return '#FFFFFF'; // Màu trắng cho trạng thái '完了'
      case '取り消し':
        return '#FFFFFF'; // Màu trắng cho trạng thái '取り消し'
      default:
        return '#fff'; // Màu mặc định
    }
}

export default ColorByStatus;