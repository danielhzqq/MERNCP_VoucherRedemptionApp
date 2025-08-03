import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Chart } from "primereact/chart";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import moment from "moment";

const AdminManagementDashboard = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVouchers: 0,
    totalCategories: 0,
    totalRedeemedVouchers: 0,
    totalPoints: 0,
    recentUsers: [],
    recentVouchers: [],
    recentRedeemed: []
  });
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        usersResponse,
        vouchersResponse,
        categoriesResponse,
        redeemedResponse
      ] = await Promise.all([
        client.service('users').find({ query: { $limit: 1000 } }),
        client.service('voucher').find({ query: { $limit: 1000 } }),
        client.service('catergory').find({ query: { $limit: 1000 } }),
        client.service('cartitemhistory').find({ query: { $limit: 1000 } })
      ]);

      const users = usersResponse.data || [];
      const vouchers = vouchersResponse.data || [];
      const categories = categoriesResponse.data || [];
      const redeemed = redeemedResponse.data || [];

      // Calculate statistics
      const activeUsers = users.filter(user => user.isActive !== false).length;
      const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
      const recentUsers = users.slice(0, 5);
      const recentVouchers = vouchers.slice(0, 5);
      const recentRedeemed = redeemed.slice(0, 5);

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalVouchers: vouchers.length,
        totalCategories: categories.length,
        totalRedeemedVouchers: redeemed.length,
        totalPoints,
        recentUsers,
        recentVouchers,
        recentRedeemed
      });

      // Prepare chart data
      prepareChartData(categories, vouchers, redeemed);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      props.alert({
        type: "error",
        title: "Dashboard Error",
        message: "Failed to load dashboard data"
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (categories, vouchers, redeemed) => {
    // Category distribution chart
    const categoryData = categories.map(cat => {
      const voucherCount = vouchers.filter(v => v.categoryId === cat._id).length;
      return {
        category: cat.name,
        count: voucherCount
      };
    });

    setChartData({
      categoryDistribution: {
        labels: categoryData.map(item => item.category),
        datasets: [{
          data: categoryData.map(item => item.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384'
          ]
        }]
      }
    });
  };

  const getStatusSeverity = (isActive) => {
    return isActive !== false ? 'success' : 'danger';
  };

  const getStatusText = (isActive) => {
    return isActive !== false ? 'Active' : 'Inactive';
  };

  const renderUserCard = (user) => (
    <Card key={user._id} className="mb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="pi pi-user text-blue-600"></i>
          </div>
          <div>
            <h6 className="mb-1">{user.username || 'No Username'}</h6>
            <p className="text-sm text-gray-600 mb-1">{user.email}</p>
            <div className="flex items-center gap-2">
              <Tag 
                value={getStatusText(user.isActive)} 
                severity={getStatusSeverity(user.isActive)} 
              />
              <span className="text-sm text-gray-500">
                {user.points || 0} points
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            icon="pi pi-eye"
            className="p-button-sm p-button-outlined"
            onClick={() => navigate(`/admin/users/${user._id}`)}
            tooltip="View Details"
          />
          <Button
            icon="pi pi-pencil"
            className="p-button-sm p-button-outlined"
            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
            tooltip="Edit User"
          />
        </div>
      </div>
    </Card>
  );

  const renderVoucherCard = (voucher) => (
    <Card key={voucher._id} className="mb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {voucher.image ? (
              <img src={voucher.image} alt={voucher.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <i className="pi pi-image text-gray-400"></i>
            )}
          </div>
          <div>
            <h6 className="mb-1">{voucher.title}</h6>
            <p className="text-sm text-gray-600 mb-1">{voucher.description}</p>
            <div className="flex items-center gap-2">
              <Tag value={`${voucher.points} points`} severity="info" />
              {voucher.isLatest && <Tag value="Featured" severity="danger" />}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            icon="pi pi-eye"
            className="p-button-sm p-button-outlined"
            onClick={() => navigate(`/admin/vouchers/${voucher._id}`)}
            tooltip="View Details"
          />
          <Button
            icon="pi pi-pencil"
            className="p-button-sm p-button-outlined"
            onClick={() => navigate(`/admin/vouchers/edit/${voucher._id}`)}
            tooltip="Edit Voucher"
          />
        </div>
      </div>
    </Card>
  );

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts, edit profiles, and control access",
      icon: "pi pi-users",
      color: "blue",
      action: () => navigate("/admin/users"),
      stats: `${stats.totalUsers} users`
    },
    {
      title: "Voucher Management",
      description: "Create, edit, and manage vouchers and categories",
      icon: "pi pi-ticket",
      color: "green",
      action: () => navigate("/admin/vouchers"),
      stats: `${stats.totalVouchers} vouchers`
    },
    {
      title: "Category Management",
      description: "Organize vouchers with categories and subcategories",
      icon: "pi pi-tags",
      color: "orange",
      action: () => navigate("/admin/categories"),
      stats: `${stats.totalCategories} categories`
    },
    {
      title: "Transaction History",
      description: "View all voucher redemptions and transaction logs",
      icon: "pi pi-history",
      color: "purple",
      action: () => navigate("/admin/transactions"),
      stats: `${stats.totalRedeemedVouchers} redeemed`
    },
    {
      title: "System Analytics",
      description: "View detailed analytics and system performance",
      icon: "pi pi-chart-bar",
      color: "red",
      action: () => navigate("/admin/analytics"),
      stats: `${stats.totalPoints} total points`
    },
    {
      title: "System Settings",
      description: "Configure system settings and preferences",
      icon: "pi pi-cog",
      color: "gray",
      action: () => navigate("/admin/settings"),
      stats: "Configure"
    }
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management Dashboard</h1>
        <p className="text-gray-600">Comprehensive management system for the voucher redemption platform</p>
      </div>

      {/* Customer Mode Access Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Message 
            severity="info" 
            text="You can access customer features using the switch in the bottom right corner."
            className="flex-1"
          />
          <Button
            label="View Customer Portal"
            icon="pi pi-eye"
            className="p-button-outlined p-button-success ml-4"
            onClick={() => navigate('/customer/home')}
          />
        </div>
      </div>

      {/* Statistics Cards */}
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
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalRedeemedVouchers}</h3>
          <p className="text-gray-600">Redeemed Vouchers</p>
          <div className="mt-2">
            <small className="text-gray-500">Total transactions</small>
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

      {/* Quick Actions */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={action.action}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`${action.icon} text-${action.color}-600 text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <Tag value={action.stats} severity="info" className="mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <Button 
              label="View All" 
              className="p-button-text" 
              onClick={() => navigate("/admin/users")}
            />
          </div>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map(renderUserCard)
            ) : (
              <Message severity="info" text="No recent users found" />
            )}
          </div>
        </Card>

        {/* Recent Vouchers */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Vouchers</h3>
            <Button 
              label="View All" 
              className="p-button-text" 
              onClick={() => navigate("/admin/vouchers")}
            />
          </div>
          <div className="space-y-3">
            {stats.recentVouchers.length > 0 ? (
              stats.recentVouchers.map(renderVoucherCard)
            ) : (
              <Message severity="info" text="No recent vouchers found" />
            )}
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      {chartData.categoryDistribution && (
        <Card className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Voucher Distribution by Category</h3>
          <div className="w-full" style={{ height: '300px' }}>
            <Chart 
              type="doughnut" 
              data={chartData.categoryDistribution} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </Card>
      )}
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

export default connect(mapState, mapDispatch)(AdminManagementDashboard); 