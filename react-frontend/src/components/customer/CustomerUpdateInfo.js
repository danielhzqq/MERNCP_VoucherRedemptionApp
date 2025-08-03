import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CustomerHeader from "./CustomerHeader";
import client from "../../services/restClient";

const CustomerUpdateInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    address: "",
    aboutMe: "",
    profileImage: "",
    isActive: true
  });
  
  // User data state for header
  const [userData, setUserData] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch current user data
  const fetchUserData = async () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentUser = await client.service('users').get(user._id);
      
      // Set user data for header
      setUserData(currentUser);
      
      setFormData({
        email: currentUser.email || "",
        username: currentUser.username || "",
        phoneNumber: currentUser.phoneNumber || "",
        address: currentUser.address || "",
        aboutMe: currentUser.aboutMe || "",
        profileImage: currentUser.profileImage || "",
        isActive: currentUser.isActive !== undefined ? currentUser.isActive : true
      });

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Prepare update data (only include fields that have values)
      const updateData = {};
      
      if (formData.email && formData.email !== user.email) {
        updateData.email = formData.email;
      }
      if (formData.username && formData.username !== user.username) {
        updateData.username = formData.username;
      }
      if (formData.phoneNumber !== user.phoneNumber) {
        updateData.phoneNumber = formData.phoneNumber;
      }
      if (formData.address !== user.address) {
        updateData.address = formData.address;
      }
      if (formData.aboutMe !== user.aboutMe) {
        updateData.aboutMe = formData.aboutMe;
      }
      if (formData.profileImage !== user.profileImage) {
        updateData.profileImage = formData.profileImage;
      }
      if (formData.isActive !== user.isActive) {
        updateData.isActive = formData.isActive;
      }

      // Check if there are any changes to update
      if (Object.keys(updateData).length === 0) {
        setError('No changes detected. Please make changes before saving.');
        return;
      }

      // Update user data
      await client.service('users').patch(user._id, updateData);
      
      setSuccess(true);
      
      // Refresh user data in context if needed
      if (window.refreshUserAccount) {
        window.refreshUserAccount();
      }
      
      // Show success message and redirect after a delay
      setTimeout(() => {
        navigate('/customer/account');
      }, 2000);

    } catch (err) {
      console.error('Error updating user data:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('duplicate key error')) {
        if (err.message.includes('email')) {
          setError('Email address is already in use. Please choose a different email.');
        } else if (err.message.includes('username')) {
          setError('Username is already taken. Please choose a different username.');
        } else {
          setError('A field value is already in use. Please check your input.');
        }
      } else {
        setError('Failed to update information. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle profile image upload (placeholder for future implementation)
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just update the form data with a placeholder
      // In a real implementation, you would upload the file to a server
      setFormData(prev => ({
        ...prev,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
        <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="max-w-2xl w-full flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow p-8 w-full flex flex-col items-center">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                <span className="ml-3 text-lg text-black">Loading user information...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
        <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="max-w-2xl w-full flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow p-8 w-full flex flex-col items-center">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button 
                  onClick={fetchUserData}
                  className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/customer/account')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden bg-[var(--background-color)]">
      <CustomerHeader user={userData || user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl w-full flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow p-4 w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-black mb-3 text-center">Personal Information</h1>
            
            {success && (
              <div className="w-full mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Information updated successfully! Redirecting to account page...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center mb-3">
              <img 
                alt="Profile Picture" 
                className="h-32 w-32 rounded-full object-cover mb-2" 
                src={formData.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBIbNg18nVN0zfD56mBuRPLGIvQCsNh6eYYeHqcARSFbGal4mNFkL2TApbK95ChG1QN3Iti1sRUa-S5-7Q_3aTOzH6tfdcLUqch1CJfxZ4sYJZxka-UAGSG8ijXfcrlD0GrOjOzg3Hpqa32_8h1MxXeKi02FfRLOCMHRSzh8S-cctjjRLRJKJA1g3fEh9z0GEgPXgYDXTmGVgbFGxqiiGa3APBdzGIFepppDnwNk-wG8KCVVNAriFu9N0OsB0AAzNo8M_njbRq9LIU"} 
              />
              <label className="text-xs px-2 py-1 text-black font-semibold hover:text-gray-700 cursor-pointer" style={{marginTop: '0.25rem'}}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                Edit Profile Picture
              </label>
            </div>

            <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-6 w-full mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="email">Email</label>
                  <input 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-200" 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="username">Username</label>
                  <input 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-200" 
                    id="username" 
                    type="text" 
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="phoneNumber">Phone Number</label>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-200" 
                  id="phoneNumber" 
                  type="tel" 
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-6 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="address">Address</label>
                <textarea 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 min-h-[120px] resize-y text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-200" 
                  id="address" 
                  rows={4} 
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-6 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="aboutMe">About Me</label>
                <textarea 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 min-h-[100px] resize-y text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-200" 
                  id="aboutMe" 
                  rows={3} 
                  placeholder="Tell us about yourself (optional)"
                  value={formData.aboutMe}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-6 flex items-center justify-between w-full">
                <span className="block text-sm font-medium text-gray-600 mb-0">Account Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="isActive"
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                </label>
              </div>

              <div className="mt-4 flex gap-4 w-full">
                <button 
                  type="button"
                  onClick={() => navigate('/customer/account')}
                  className="bg-gray-500 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-600 transition-colors duration-200 flex-1 sm:flex-none"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="bg-blue-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-700 transition-colors duration-200 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerUpdateInfo; 