import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: { main: '#6c5ce7' },
  },
  shape: { borderRadius: 20 },
});

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match ❌');
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password },
      );

      toast.success('Password reset successfully 🎉');
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid or expired link ❌',
      );
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          background:
            'linear-gradient(-45deg, #6c5ce7, #a29bfe, #fd79a8, #fdcb6e)',
          backgroundSize: '400% 400%',
          animation: 'gradient 12s ease infinite',
        }}
      >
        {/* LEFT SIDE FORM */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Paper
            elevation={15}
            sx={{
              width: '100%',
              maxWidth: 420,
              p: 5,
              textAlign: 'center',
              backdropFilter: 'blur(25px)',
              background: 'rgba(255,255,255,0.9)',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Reset Password
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={4}>
              Create a new secure password and continue planning your events.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: 4,
                }}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>

            <Typography
              variant="body2"
              sx={{
                mt: 4,
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
              color="primary"
              onClick={() => navigate('/auth')}
            >
              ← Back to Login
            </Typography>
          </Paper>
        </Box>

        {/* RIGHT SIDE HERO SECTION */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight="bold" mb={3}>
            Secure Your Experience
          </Typography>

          <Typography variant="h6" sx={{ maxWidth: 400, opacity: 0.9 }}>
            Your events deserve security and elegance. Update your password and
            get back to creating unforgettable moments.
          </Typography>
        </Box>

        {/* Gradient Animation */}
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </Box>
    </ThemeProvider>
  );
}

export default ResetPassword;
