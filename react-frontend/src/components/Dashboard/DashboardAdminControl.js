import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { connect } from "react-redux";
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
import { TitleDash } from "./TitleDash";
import EditDashComp from "./EditDashComp";
import ProjectLayout from "../Layouts/ProjectLayout";
import client from "../../services/restClient";
import moment from "moment";

export const AdminControl = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
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

  // Chart data
  const [chartData, setChartData] = useState({
    voucherRedeemData: {},
    userActivityData: {},
    categoryDistributionData: {}
  });

  useEffect(() => {
    checkConnection();
    get();
  }, []);

  const get = async () => {
    try {
    const cache = await props.get();
      console.log('Cache loaded:', cache);
    } catch (error) {
      console.error('Cache loading error:', error);
    }
  };

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log('Checking API connection...');
      console.log('API URL:', process.env.REACT_APP_SERVER_URL);
      
      // Test connection by fetching a simple service
      const testResponse = await client.service('users').find({ query: { $limit: 1 } });
      console.log('Connection test successful:', testResponse);
      setConnectionStatus('connected');
      
      // If connection is successful, fetch all data
      await fetchAllData();
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Failed to connect to database');
      
      // Show detailed error information
      props.alert({
        type: "error",
        title: "Database Connection Error",
        message: `Failed to connect to MongoDB: ${error.message}. Please ensure the backend server is running on ${process.env.REACT_APP_SERVER_URL || 'http://localhost:3030'}`
      });
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from MongoDB...');
      
      // Fetch all data in parallel with better error handling
      const fetchPromises = [
        client.service('users').find({ query: { $limit: 1000 } }).catch(err => {
          console.error('Users fetch error:', err);
          return { data: [] };
        }),
        client.service('voucher').find({ 
          query: { 
            $limit: 1000,
            $populate: [
              { path: 'categoryId', service: 'catergory', select: ['name'] }
            ]
          }
        }).catch(err => {
          console.error('Vouchers fetch error:', err);
          return { data: [] };
        }),
        client.service('cartitemhistory').find({ 
          query: { 
            $limit: 1000,
            $populate: [
              { path: 'userId', service: 'users', select: ['name', 'email'] },
              { path: 'voucherId', service: 'voucher', select: ['title', 'points'] }
            ]
          }
        }).catch(err => {
          console.error('Transactions fetch error:', err);
          return { data: [] };
        }),
        client.service('catergory').find({ query: { $limit: 1000 } }).catch(err => {
          console.error('Categories fetch error:', err);
          return { data: [] };
        })
      ];

      const [usersRes, vouchersRes, transactionsRes, categoriesRes] = await Promise.all(fetchPromises);

      const usersData = usersRes.data || [];
      const vouchersData = vouchersRes.data || [];
      const transactionsData = transactionsRes.data || [];
      const categoriesData = categoriesRes.data || [];

      console.log('Data fetched successfully:', {
        users: usersData.length,
        vouchers: vouchersData.length,
        transactions: transactionsData.length,
        categories: categoriesData.length
      });

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

      // Prepare chart data
      prepareChartData(vouchersData, transactionsData, categoriesData);

      props.alert({
        type: "success",
        title: "Data Loaded Successfully",
        message: `Connected to MongoDB and loaded ${usersData.length} users, ${vouchersData.length} vouchers, and ${transactionsData.length} transactions`
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.message);
      props.alert({
        type: "error",
        title: "Data Loading Error",
        message: `Failed to load admin dashboard data: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (vouchersData, transactionsData, categoriesData) => {
    try {
      // Voucher redemption over time (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return moment(date).format('YYYY-MM-DD');
      }).reverse();

      const redemptionData = last7Days.map(date => {
        const dayTransactions = transactionsData.filter(t => 
          moment(t.completedDate).format('YYYY-MM-DD') === date
        );
        return dayTransactions.length;
      });

      // Category distribution
      const categoryCounts = {};
      vouchersData.forEach(voucher => {
        const categoryName = voucher.categoryId?.name || 'Uncategorized';
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });

      setChartData({
        voucherRedeemData: {
          labels: last7Days.map(date => moment(date).format('MMM DD')),
          datasets: [{
            label: 'Vouchers Redeemed',
            data: redemptionData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        },
        categoryDistributionData: {
          labels: Object.keys(categoryCounts),
          datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
              '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
            ]
          }]
        }
      });
    } catch (error) {
      console.error('Error preparing chart data:', error);
    }
  };

  // User management functions
  const handleUserStatusChange = async (user, newStatus) => {
    try {
      console.log(`Updating user ${user.name} status to ${newStatus}`);
      await client.service('users').patch(user._id, { isActive: newStatus });
      await fetchAllData();
      props.alert({
        type: "success",
        title: "User Status Updated",
        message: `User ${user.name} status changed to ${newStatus ? 'Active' : 'Inactive'}`
      });
    } catch (error) {
      console.error('User status update error:', error);
      props.alert({
        type: "error",
        title: "Update Failed",
        message: `Failed to update user status: ${error.message}`
      });
    }
  };

  const handleUserPointsUpdate = async (user, newPoints) => {
    try {
      console.log(`Updating user ${user.name} points to ${newPoints}`);
      await client.service('users').patch(user._id, { points: parseInt(newPoints) });
      await fetchAllData();
      props.alert({
        type: "success",
        title: "Points Updated",
        message: `User ${user.name} points updated to ${newPoints}`
      });
    } catch (error) {
      console.error('User points update error:', error);
      props.alert({
        type: "error",
        title: "Update Failed",
        message: `Failed to update user points: ${error.message}`
      });
    }
  };

  // Voucher management functions
  const handleVoucherStatusChange = async (voucher, newStatus) => {
    try {
      console.log(`Updating voucher ${voucher.title} status to ${newStatus}`);
      await client.service('voucher').patch(voucher._id, { isLatest: newStatus });
      await fetchAllData();
      props.alert({
        type: "success",
        title: "Voucher Status Updated",
        message: `Voucher ${voucher.title} status updated`
      });
    } catch (error) {
      console.error('Voucher status update error:', error);
      props.alert({
        type: "error",
        title: "Update Failed",
        message: `Failed to update voucher status: ${error.message}`
      });
    }
  };

  // Template functions
  const userStatusTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.isActive ? 'Active' : 'Inactive'} 
        severity={rowData.isActive ? 'success' : 'danger'}
      />
    );
  };

  const userActionsTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-sm p-button-outlined"
          onClick={() => {
            setSelectedUser(rowData);
            setShowUserDialog(true);
          }}
        />
        <Button
          icon={rowData.isActive ? "pi pi-ban" : "pi pi-check"}
          className={`p-button-sm ${rowData.isActive ? 'p-button-danger' : 'p-button-success'}`}
          onClick={() => handleUserStatusChange(rowData, !rowData.isActive)}
        />
      </div>
    );
  };

  const voucherStatusTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.isLatest ? 'Active' : 'Inactive'} 
        severity={rowData.isLatest ? 'success' : 'danger'}
      />
    );
  };

  const voucherCategoryTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.categoryId?.name || 'Uncategorized'} 
        severity="info"
      />
    );
  };

  const voucherActionsTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-sm p-button-outlined"
          onClick={() => {
            setSelectedVoucher(rowData);
            setShowVoucherDialog(true);
          }}
        />
        <Button
          icon={rowData.isLatest ? "pi pi-ban" : "pi pi-check"}
          className={`p-button-sm ${rowData.isLatest ? 'p-button-danger' : 'p-button-success'}`}
          onClick={() => handleVoucherStatusChange(rowData, !rowData.isLatest)}
        />
      </div>
    );
  };

  const transactionDateTemplate = (rowData) => {
    return moment(rowData.completedDate).format('MMM DD, YYYY');
  };

  const transactionUserTemplate = (rowData) => {
    return rowData.userId?.name || 'Unknown User';
  };

  const transactionVoucherTemplate = (rowData) => {
    return rowData.voucherId?.title || 'Unknown Voucher';
  };

  // Connection status display
  const renderConnectionStatus = () => {
    if (connectionStatus === 'checking') {
      return (
        <Message 
          severity="info" 
          text="Checking database connection..." 
          className="mb-4"
        />
      );
    } else if (connectionStatus === 'error') {
      return (
        <Message 
          severity="error" 
          text={`Database connection failed: ${errorMessage}`}
          className="mb-4"
        />
      );
    } else if (connectionStatus === 'connected') {
      return (
        <Message 
          severity="success" 
          text="Successfully connected to MongoDB database"
          className="mb-4"
        />
      );
    }
    return null;
  };

  if (loading && connectionStatus === 'checking') {
    return (
      <ProjectLayout>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
            <p className="text-gray-600">Connecting to MongoDB database...</p>
            <p className="text-sm text-gray-500 mt-2">Please ensure the backend server is running</p>
          </div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
    <div className="p-2 md:p-4">
        {/* Connection Status */}
        {renderConnectionStatus()}

      {/* Title and Edit section */}
        <div className="mb-4 flex justify-content-between align-items-center">
        <TitleDash user={props.user} />
          <div className="flex gap-2">
            <Button
              icon="pi pi-refresh"
              label="Refresh Data"
              className="p-button-outlined"
              onClick={fetchAllData}
              loading={loading}
            />
            <Button
              icon="pi pi-sign-out"
              label="Logout"
              className="p-button-danger p-button-outlined"
              onClick={() => {
                props.logout();
                window.location.href = '/';
              }}
            />
            <EditDashComp isEdit={isEdit} setIsEdit={setIsEdit} />
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <div className="flex align-items-center justify-content-center mb-3">
              <i className="pi pi-users text-3xl text-blue-500 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
            <ProgressBar value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0} />
            <div className="text-xs text-gray-500 mt-2">{stats.activeUsers} Active</div>
          </Card>

          <Card className="text-center">
            <div className="flex align-items-center justify-content-center mb-3">
              <i className="pi pi-ticket text-3xl text-green-500 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalVouchers}</div>
                <div className="text-sm text-gray-600">Total Vouchers</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">Available for redemption</div>
          </Card>

          <Card className="text-center">
            <div className="flex align-items-center justify-content-center mb-3">
              <i className="pi pi-shopping-cart text-3xl text-orange-500 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</div>
                <div className="text-sm text-gray-600">Total Redemptions</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">Vouchers redeemed</div>
          </Card>

          <Card className="text-center">
            <div className="flex align-items-center justify-content-center mb-3">
              <i className="pi pi-star text-3xl text-purple-500 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">Across all users</div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card header="Voucher Redemption Trends">
            <Chart type="line" data={chartData.voucherRedeemData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} />
          </Card>

          <Card header="Voucher Categories Distribution">
            <Chart type="doughnut" data={chartData.categoryDistributionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </Card>
        </div>

        {/* Main Control Tabs */}
        <Card>
          <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
            {/* User Control Tab */}
            <TabPanel header="User Management">
              <DataTable 
                value={users} 
                paginator 
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-sm"
                emptyMessage="No users found"
                loading={loading}
              >
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="points" header="Points" sortable />
                <Column field="isActive" header="Status" body={userStatusTemplate} />
                <Column field="createdAt" header="Joined" sortable body={(rowData) => moment(rowData.createdAt).format('MMM DD, YYYY')} />
                <Column header="Actions" body={userActionsTemplate} style={{ width: '120px' }} />
              </DataTable>
            </TabPanel>

            {/* Voucher Control Tab */}
            <TabPanel header="Voucher Management">
              <DataTable 
                value={vouchers} 
                paginator 
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-sm"
                emptyMessage="No vouchers found"
                loading={loading}
              >
                <Column field="title" header="Title" sortable />
                <Column field="points" header="Points" sortable />
                <Column field="categoryId.name" header="Category" body={voucherCategoryTemplate} />
                <Column field="isLatest" header="Status" body={voucherStatusTemplate} />
                <Column field="createdAt" header="Created" sortable body={(rowData) => moment(rowData.createdAt).format('MMM DD, YYYY')} />
                <Column header="Actions" body={voucherActionsTemplate} style={{ width: '120px' }} />
              </DataTable>
            </TabPanel>

            {/* Transaction Monitoring Tab */}
            <TabPanel header="Transaction Monitoring">
              <DataTable 
                value={transactions} 
                paginator 
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-sm"
                emptyMessage="No transactions found"
                loading={loading}
              >
                <Column field="userId.name" header="User" body={transactionUserTemplate} sortable />
                <Column field="voucherId.title" header="Voucher" body={transactionVoucherTemplate} sortable />
                <Column field="quantity" header="Quantity" sortable />
                <Column field="voucherId.points" header="Points" sortable />
                <Column field="completedDate" header="Date" body={transactionDateTemplate} sortable />
              </DataTable>
            </TabPanel>
          </TabView>
        </Card>

        {/* User Edit Dialog */}
        <Dialog 
          header="Edit User" 
          visible={showUserDialog} 
          style={{ width: '50vw' }} 
          onHide={() => setShowUserDialog(false)}
        >
          {selectedUser && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <InputText 
                  value={selectedUser.name || ''} 
                  className="w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <InputText 
                  value={selectedUser.email || ''} 
                  className="w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <InputText 
                  value={selectedUser.points || 0} 
                  className="w-full"
                  type="number"
                  onChange={(e) => setSelectedUser({...selectedUser, points: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Dropdown
                  value={selectedUser.isActive}
                  options={[
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false }
                  ]}
                  optionLabel="label"
                  optionValue="value"
                  className="w-full"
                  onChange={(e) => setSelectedUser({...selectedUser, isActive: e.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              label="Cancel" 
              className="p-button-text" 
              onClick={() => setShowUserDialog(false)}
            />
            <Button 
              label="Save" 
              onClick={() => {
                if (selectedUser) {
                  handleUserPointsUpdate(selectedUser, selectedUser.points);
                  setShowUserDialog(false);
                }
              }}
            />
          </div>
        </Dialog>

        {/* Voucher Edit Dialog */}
        <Dialog 
          header="Edit Voucher" 
          visible={showVoucherDialog} 
          style={{ width: '50vw' }} 
          onHide={() => setShowVoucherDialog(false)}
        >
          {selectedVoucher && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <InputText 
                  value={selectedVoucher.title || ''} 
                  className="w-full"
                  disabled
                />
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <InputText 
                  value={selectedVoucher.points || 0} 
                  className="w-full"
                  type="number"
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, points: parseInt(e.target.value)})}
                />
      </div>
      <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Dropdown
                  value={selectedVoucher.categoryId}
                  options={categories}
                  optionLabel="name"
                  className="w-full"
                  disabled
                />
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Dropdown
                  value={selectedVoucher.isLatest}
                  options={[
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false }
                  ]}
                  optionLabel="label"
                  optionValue="value"
                  className="w-full"
                  onChange={(e) => setSelectedVoucher({...selectedVoucher, isLatest: e.value})}
                />
          </div>
        </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              label="Cancel" 
              className="p-button-text" 
              onClick={() => setShowVoucherDialog(false)}
            />
            <Button 
              label="Save" 
              onClick={() => {
                if (selectedVoucher) {
                  handleVoucherStatusChange(selectedVoucher, selectedVoucher.isLatest);
                  setShowVoucherDialog(false);
                }
              }}
        />
      </div>
        </Dialog>
    </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { cache } = state.cache;
  return { user, isLoggedIn, cache };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  get: () => dispatch.cache.get(),
  logout: () => dispatch.auth.logout(),
});

export default connect(mapState, mapDispatch)(AdminControl);
