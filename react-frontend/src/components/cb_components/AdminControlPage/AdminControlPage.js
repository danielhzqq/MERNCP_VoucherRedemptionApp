import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Chart } from "primereact/chart";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const AdminControlPage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [userFilters, setUserFilters] = useState({});
  const [voucherFilters, setVoucherFilters] = useState({});
  const [transactionFilters, setTransactionFilters] = useState({});
  
  // Dialog states
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showVoucherDialog, setShowVoucherDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  
  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVouchers: 0,
    totalTransactions: 0,
    totalPoints: 0,
    recentTransactions: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, vouchersRes, transactionsRes, categoriesRes] = await Promise.all([
        client.service('users').find({ query: { $limit: 1000 } }),
        client.service('voucher').find({ 
          query: { 
            $limit: 1000,
            $populate: [
              { path: 'categoryId', service: 'catergory', select: ['name'] }
            ]
          }
        }),
        client.service('cartitemhistory').find({ 
          query: { 
            $limit: 1000,
            $populate: [
              { path: 'userId', service: 'users', select: ['name', 'email'] },
              { path: 'voucherId', service: 'voucher', select: ['title', 'points'] }
            ]
          }
        }),
        client.service('catergory').find({ query: { $limit: 1000 } })
      ]);

      const usersData = usersRes.data || [];
      const vouchersData = vouchersRes.data || [];
      const transactionsData = transactionsRes.data || [];
      const categoriesData = categoriesRes.data || [];

      setUsers(usersData);
      setVouchers(vouchersData);
      setTransactions(transactionsData);
      setCategories(categoriesData);

      // Calculate statistics
      const activeUsers = usersData.filter(user => user.isActive !== false).length;
      const totalPoints = usersData.reduce((sum, user) => sum + (user.points || 0), 0);
      const recentTransactions = transactionsData.slice(0, 10);

      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalVouchers: vouchersData.length,
        totalTransactions: transactionsData.length,
        totalPoints,
        recentTransactions
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      props.alert({
        type: "error",
        title: "Data Loading Error",
        message: "Failed to load admin control data"
      });
    } finally {
      setLoading(false);
    }
  };

  // User Control Functions
  const handleUserStatusChange = async (user, newStatus) => {
    try {
      await client.service('users').patch(user._id, { isActive: newStatus });
      setUsers(users.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));
      props.alert({
        type: "success",
        title: "User Status Updated",
        message: `User ${user.name} status changed to ${newStatus ? 'Active' : 'Inactive'}`
      });
    } catch (error) {
      props.alert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update user status"
      });
    }
  };

  const handleUserPointsUpdate = async (user, newPoints) => {
    try {
      await client.service('users').patch(user._id, { points: newPoints });
      setUsers(users.map(u => u._id === user._id ? { ...u, points: newPoints } : u));
      props.alert({
        type: "success",
        title: "Points Updated",
        message: `User ${user.name} points updated to ${newPoints}`
      });
    } catch (error) {
      props.alert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update user points"
      });
    }
  };

  // Voucher Control Functions
  const handleVoucherStatusChange = async (voucher, newStatus) => {
    try {
      await client.service('voucher').patch(voucher._id, { isLatest: newStatus });
      setVouchers(vouchers.map(v => v._id === voucher._id ? { ...v, isLatest: newStatus } : v));
      props.alert({
        type: "success",
        title: "Voucher Status Updated",
        message: `Voucher ${voucher.title} featured status updated`
      });
    } catch (error) {
      props.alert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update voucher status"
      });
    }
  };

  const handleVoucherPointsUpdate = async (voucher, newPoints) => {
    try {
      await client.service('voucher').patch(voucher._id, { points: newPoints });
      setVouchers(vouchers.map(v => v._id === voucher._id ? { ...v, points: newPoints } : v));
      props.alert({
        type: "success",
        title: "Points Updated",
        message: `Voucher ${voucher.title} points updated to ${newPoints}`
      });
    } catch (error) {
      props.alert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update voucher points"
      });
    }
  };

  // User Control Template
  const userStatusTemplate = (rowData) => (
    <Tag 
      value={rowData.isActive ? 'Active' : 'Inactive'} 
      severity={rowData.isActive ? 'success' : 'danger'}
    />
  );

  const userActionsTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-pencil" 
        className="p-button-sm p-button-outlined"
        onClick={() => {
          setSelectedUser(rowData);
          setShowUserDialog(true);
        }}
        tooltip="Edit User"
      />
      <Button 
        icon={rowData.isActive ? "pi pi-ban" : "pi pi-check"} 
        className={`p-button-sm ${rowData.isActive ? 'p-button-danger' : 'p-button-success'}`}
        onClick={() => handleUserStatusChange(rowData, !rowData.isActive)}
        tooltip={rowData.isActive ? "Deactivate" : "Activate"}
      />
    </div>
  );

  // Voucher Control Template
  const voucherStatusTemplate = (rowData) => (
    <Tag 
      value={rowData.isLatest ? 'Featured' : 'Regular'} 
      severity={rowData.isLatest ? 'warning' : 'info'}
    />
  );

  const voucherCategoryTemplate = (rowData) => (
    <span>{rowData.categoryId?.name || 'Uncategorized'}</span>
  );

  const voucherActionsTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-pencil" 
        className="p-button-sm p-button-outlined"
        onClick={() => {
          setSelectedVoucher(rowData);
          setShowVoucherDialog(true);
        }}
        tooltip="Edit Voucher"
      />
      <Button 
        icon={rowData.isLatest ? "pi pi-star-fill" : "pi pi-star"} 
        className={`p-button-sm ${rowData.isLatest ? 'p-button-warning' : 'p-button-outlined'}`}
        onClick={() => handleVoucherStatusChange(rowData, !rowData.isLatest)}
        tooltip={rowData.isLatest ? "Remove Featured" : "Mark Featured"}
      />
    </div>
  );

  // Transaction Monitoring Template
  const transactionDateTemplate = (rowData) => (
    <span>{moment(rowData.completedDate).format('MMM DD, YYYY HH:mm')}</span>
  );

  const transactionUserTemplate = (rowData) => (
    <span>{rowData.userId?.name || 'Unknown User'}</span>
  );

  const transactionVoucherTemplate = (rowData) => (
    <span>{rowData.voucherId?.title || 'Unknown Voucher'}</span>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Control Center</h1>
        <p className="text-gray-600">Comprehensive control panel for managing users, vouchers, and monitoring transactions</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <i className="pi pi-users text-3xl text-blue-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
          <div className="mt-2">
            <ProgressBar 
              value={(stats.activeUsers / stats.totalUsers) * 100} 
              className="h-2"
            />
            <small className="text-gray-500">{stats.activeUsers} active</small>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <i className="pi pi-ticket text-3xl text-green-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalVouchers}</h3>
          <p className="text-gray-600">Total Vouchers</p>
          <div className="mt-2">
            <small className="text-gray-500">Available for redemption</small>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <i className="pi pi-history text-3xl text-purple-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</h3>
          <p className="text-gray-600">Total Transactions</p>
          <div className="mt-2">
            <small className="text-gray-500">Voucher redemptions</small>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <i className="pi pi-star text-3xl text-orange-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</h3>
          <p className="text-gray-600">Total Points</p>
          <div className="mt-2">
            <small className="text-gray-500">Across all users</small>
          </div>
        </Card>
      </div>

      {/* Main Control Tabs */}
      <Card>
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          
          {/* User Control Tab */}
          <TabPanel header="User Control">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">User Management</h3>
                <Button 
                  label="Add New User" 
                  icon="pi pi-plus" 
                  className="p-button-success"
                  onClick={() => navigate('/admin/users')}
                />
              </div>
              
              <DataTable 
                value={users} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="No users found"
              >
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="points" header="Points" sortable />
                <Column field="isActive" header="Status" body={userStatusTemplate} sortable />
                <Column field="createdAt" header="Joined" sortable 
                  body={(rowData) => moment(rowData.createdAt).format('MMM DD, YYYY')} />
                <Column header="Actions" body={userActionsTemplate} style={{ width: '120px' }} />
              </DataTable>
            </div>
          </TabPanel>

          {/* Voucher Control Tab */}
          <TabPanel header="Voucher Control">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Voucher Management</h3>
                <Button 
                  label="Add New Voucher" 
                  icon="pi pi-plus" 
                  className="p-button-success"
                  onClick={() => navigate('/admin/vouchers')}
                />
              </div>
              
              <DataTable 
                value={vouchers} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="No vouchers found"
              >
                <Column field="title" header="Title" sortable />
                <Column field="points" header="Points" sortable />
                <Column field="categoryId.name" header="Category" body={voucherCategoryTemplate} sortable />
                <Column field="isLatest" header="Status" body={voucherStatusTemplate} sortable />
                <Column field="createdAt" header="Created" sortable 
                  body={(rowData) => moment(rowData.createdAt).format('MMM DD, YYYY')} />
                <Column header="Actions" body={voucherActionsTemplate} style={{ width: '120px' }} />
              </DataTable>
            </div>
          </TabPanel>

          {/* Transaction Monitoring Tab */}
          <TabPanel header="Transaction Monitoring">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                <Button 
                  label="View All Transactions" 
                  icon="pi pi-external-link" 
                  className="p-button-outlined"
                  onClick={() => navigate('/admin/cartitemhistory')}
                />
              </div>
              
              <DataTable 
                value={transactions} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="No transactions found"
              >
                <Column field="userId.name" header="User" body={transactionUserTemplate} sortable />
                <Column field="voucherId.title" header="Voucher" body={transactionVoucherTemplate} sortable />
                <Column field="quantity" header="Quantity" sortable />
                <Column field="voucherId.points" header="Points" 
                  body={(rowData) => (rowData.voucherId?.points || 0) * rowData.quantity} sortable />
                <Column field="completedDate" header="Date" body={transactionDateTemplate} sortable />
              </DataTable>
            </div>
          </TabPanel>

        </TabView>
      </Card>

      {/* User Edit Dialog */}
      <Dialog 
        header="Edit User" 
        visible={showUserDialog} 
        style={{ width: '50vw' }} 
        onHide={() => setShowUserDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowUserDialog(false)} />
            <Button label="Save" icon="pi pi-check" onClick={() => setShowUserDialog(false)} />
          </div>
        }
      >
        {selectedUser && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <InputText value={selectedUser.name} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <InputText value={selectedUser.email} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <InputText 
                value={selectedUser.points} 
                className="w-full"
                onChange={(e) => handleUserPointsUpdate(selectedUser, parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Dropdown 
                value={selectedUser.isActive} 
                options={[
                  { label: 'Active', value: true },
                  { label: 'Inactive', value: false }
                ]}
                onChange={(e) => handleUserStatusChange(selectedUser, e.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Voucher Edit Dialog */}
      <Dialog 
        header="Edit Voucher" 
        visible={showVoucherDialog} 
        style={{ width: '50vw' }} 
        onHide={() => setShowVoucherDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowVoucherDialog(false)} />
            <Button label="Save" icon="pi pi-check" onClick={() => setShowVoucherDialog(false)} />
          </div>
        }
      >
        {selectedVoucher && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <InputText value={selectedVoucher.title} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <InputText 
                value={selectedVoucher.points} 
                className="w-full"
                onChange={(e) => handleVoucherPointsUpdate(selectedVoucher, parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Dropdown 
                value={selectedVoucher.categoryId?._id} 
                options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Featured Status</label>
              <Dropdown 
                value={selectedVoucher.isLatest} 
                options={[
                  { label: 'Featured', value: true },
                  { label: 'Regular', value: false }
                ]}
                onChange={(e) => handleVoucherStatusChange(selectedVoucher, e.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(AdminControlPage); 