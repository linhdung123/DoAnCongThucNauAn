import React, { useState } from 'react';
import './styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'beA@gmail.com',
    phone: '0123456789',
    address: 'Hutech',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Logic for logging out
    console.log('User logged out');
  };

  return (
    <div className="user-profile">
      <h1>Hồ Sơ Cá Nhân</h1>
      <p>Đây là thông tin cá nhân của bạn</p>
      <div className="profile-picture">
        <img src="/path/to/profile-picture.jpg" alt="Profile" />
        <button className="edit-picture">✏️</button>
      </div>
      <div className="user-info">
        <label>Họ và tên</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <label>SĐT</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <label>Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>
      <div className="actions">
        {isEditing ? (
          <button onClick={handleSave} className="save-button">Lưu thông tin</button>
        ) : (
          <button onClick={handleEdit} className="edit-button">Sửa thông tin</button>
        )}
        <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
      </div>
    </div>
  );
};

export default UserProfile;