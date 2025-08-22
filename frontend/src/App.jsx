import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Optionally re-fetch user details with token
      const fetchUser = async () => {
        try {
          // Example: fetch latest details if backend supports it
          // const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          //   headers: { Authorization: `Bearer ${storedUser.token}` },
          // });
          // dispatch(loginSuccess(res.data.user));

          // If no endpoint exists to verify token, fall back to localStorage
          dispatch(loginSuccess(storedUser));
        } catch (err) {
          console.error('Failed to re-authenticate user:', err);
        }
      };

      fetchUser();
    }
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
};

export default App;
