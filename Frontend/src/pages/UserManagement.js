import React, { useState } from 'react';
import './styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Thu Thủy', email: 'thuthuy@editorial.vn', phone: '0987 654 321', role: 'Admin', status: 'Online' },
    // Add more users here
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Tất cả' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    // Logic for adding a new user
    console.log('Add new user');
  };

  return (
    <div className="user-management">
      <h1>Quản Lý Người Dùng</h1>
      <div className="stats">
        <div className="stat">
          <h2>Tổng số người dùng</h2>
          <p>1,284</p>
        </div>
        <div className="stat">
          <h2>Hoạt động</h2>
          <p>856</p>
        </div>
        <div className="stat">
          <h2>Bị chặn</h2>
          <p>14</p>
        </div>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={filterRole} onChange={handleRoleFilterChange}>
          <option value="Tất cả">Tất cả</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="User">User</option>
        </select>
        <button onClick={handleAddUser} className="add-user-button">+ Thêm người dùng mới</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Liên Hệ</th>
            <th>Vai Trò</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}<br />{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className="edit-button">Sửa</button>
                <button className="block-button">Chặn</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;