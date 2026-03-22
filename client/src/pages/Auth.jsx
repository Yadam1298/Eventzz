import { useState, useEffect, useRef } from 'react'; // Add useEffect and useRef
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api/api';
import { TextField, Button, ThemeProvider, createTheme } from '@mui/material';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- THEME & STYLES ---
const theme = createTheme({
  palette: { primary: { main: '#6c5ce7' } },
  shape: { borderRadius: 12 },
});

const CustomStyles = () => (
  <style>{`
    .auth-container {
      height: 100vh;
      width: 100vw;
      background: #f1f2f6;
      perspective: 2500px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .auth-stage {
      width: 1000px;
      height: 650px;
      background: white;
      border-radius: 30px;
      position: relative;
      box-shadow: 0 40px 100px rgba(0,0,0,0.1);
      overflow: hidden;
      transform: scale(0.7);
      transform-origin: center;
    }
    .book-cover {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      z-index: 100;
      transform-style: preserve-3d;
      transform-origin: left center;
      transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1);
      box-shadow: -15px 0 35px rgba(0,0,0,0.1);
    }
    .book-cover.is-flipped { transform: rotateY(-180deg); }
    .cover-side {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      padding: 60px;
      color: white;
    }
    .cover-front { background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); }
    .cover-back { 
      background: linear-gradient(135deg, #E2852E 0%, #F5C857 100%); 
      transform: rotateY(180deg); 
    }
    .event-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 50px;
      font-size: 0.75rem;
      letter-spacing: 2px;
    }
    .mobile-toggle {
      display: none;
    }
    /* ================= MOBILE RESPONSIVE ================= */
    @media (max-width: 768px) {

      html, body {
        overflow: scroll;
      }

      .auth-stage {
        margin-top:20px;
        width: 100%;
        height: 100vh;
        border-radius: 0;
        transform: none;
        padding: 20px 0;
      }

      .book-cover {
        display: none;
      }

      .container-fluid {
        flex-direction: column;
        height: 100%;
      }

      .col-6 {
        width: 100% !important;
        height: 100%;
      }

      .auth-container {
        padding: 0;
      }
      .mobtxt{
        display:flex;
        justify:center;
        align-items:center;
        font-size: 0.75rem;
      }
     .mobile-hide {
        display: none !important;
      }
        
      .mobile-toggle {
        display: block;
      }
      
      .MuiTextField-root {
         margin-bottom: 10px;
       }

       .MuiInputBase-root {
         font-size: 0.65rem;
       }

       .MuiButton-root {
         padding: 10px 0 !important;
         font-size: 0.75rem !important;
       }

       h2 {
         font-size: 1.4rem;
       }

       .text-muted {
         font-size: 0.65rem;
       }
    }
  `}</style>
);

// --- COMPONENT ---
function Auth() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const loginCarouselRef = useRef(null);
  const registerCarouselRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileView, setMobileView] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    const savedEmail = Cookies.get('rememberedEmail');
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (window.bootstrap) {
      if (loginCarouselRef.current) {
        new window.bootstrap.Carousel(loginCarouselRef.current, {
          interval: 3000,
          ride: 'carousel',
        });
      }
      if (registerCarouselRef.current) {
        new window.bootstrap.Carousel(registerCarouselRef.current, {
          interval: 3000,
          ride: 'carousel',
        });
      }
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response =
        mode === 'login'
          ? await loginUser({ email: form.email, password: form.password })
          : await registerUser(form);

      if (mode === 'login') {
        if (rememberMe) {
          Cookies.set('rememberedEmail', form.email, { expires: 7 });
        } else {
          Cookies.remove('rememberedEmail');
        }
      }

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      // ✅ SUCCESS TOAST
      if (mode === 'login') {
        toast.success('Successfully Logged In 🎉');
      } else {
        toast.success('Account Created Successfully 🎉');
      }

      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong ❌');
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CustomStyles />
      <div className="auth-container p-3">
        <div className="auth-stage d-flex">
          {/* BACKGROUND FORMS CONTAINER */}
          <div className="container-fluid d-flex p-0">
            {/* LOGIN SIDE */}
            <div
              className={`col-6 d-flex align-items-center justify-content-center p-5 
${mobileView !== 'login' ? 'mobile-hide' : ''}`}
            >
              {' '}
              <div className="w-100" style={{ maxWidth: '340px' }}>
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted mb-4">Manage your upcoming events</p>
                <form
                  onSubmit={(e) => handleSubmit(e, 'login')}
                  className="d-flex flex-column gap-3"
                >
                  <TextField
                    label="Email Address"
                    name="email"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <div className="d-flex justify-content-between align-items-center mb-1 mobtxt">
                    {/* Remember Me Checkbox */}
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe} // Connect to state
                        onChange={(e) => setRememberMe(e.target.checked)} // Update state
                        style={{ cursor: 'pointer' }}
                      />
                      <label
                        className="form-check-label text-muted small"
                        htmlFor="rememberMe"
                        style={{ cursor: 'pointer' }}
                      >
                        Remember me
                      </label>
                    </div>

                    {/* Forgot Password Link */}
                    <a
                      href="/forgot-password"
                      className="text-decoration-none small fw-bold"
                      style={{ color: '#6c5ce7' }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/forgot-password');
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    className="py-3 mt-2 fw-bold shadow-sm"
                  >
                    {isLoading ? 'Verifying...' : 'Login'}
                  </Button>
                  <div className="mobile-toggle text-center mt-3">
                    <span className="text-muted small">
                      Don't have an account?{' '}
                    </span>
                    <button
                      type="button"
                      className="btn btn-link p-0 small fw-bold"
                      onClick={() => setMobileView('register')}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* REGISTER SIDE */}
            <div
              className={`col-6 d-flex align-items-center justify-content-center p-5 
${mobileView !== 'register' ? 'mobile-hide' : ''}`}
            >
              {' '}
              <div className="w-100" style={{ maxWidth: '340px' }}>
                <h2 className="fw-bold mb-1">Planning Event?</h2>
                <p className="text-muted mb-4">
                  Join our community of planners
                </p>
                <form
                  onSubmit={(e) => handleSubmit(e, 'register')}
                  className="d-flex flex-column gap-3"
                >
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    className="py-3 mt-2 fw-bold shadow-sm"
                    style={{ backgroundColor: '#2d3436' }}
                  >
                    {isLoading ? 'Creating...' : 'Register Now'}
                  </Button>
                  <div className="mobile-toggle text-center mt-3">
                    <span className="text-muted small">
                      Already have an account?{' '}
                    </span>
                    <button
                      type="button"
                      className="btn btn-link p-0 small fw-bold"
                      onClick={() => setMobileView('login')}
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className={`book-cover ${isFlipped ? 'is-flipped' : ''}`}>
            {/* --- FRONT SIDE (Login View) --- */}
            <div className="cover-side cover-front d-flex flex-column align-items-start text-start">
              <span className="event-badge mb-3 text-uppercase">
                Elite Planners
              </span>
              <h1 className="display-5 fw-bold mb-3">
                Plan Your Next Masterpiece
              </h1>

              <div
                id="carouselLogin"
                className="carousel slide"
                ref={loginCarouselRef}
                data-bs-ride="carousel"
              >
                <div
                  className="carousel-indicators"
                  style={{ marginBottom: '-1px' }}
                >
                  <button
                    type="button"
                    data-bs-target="#carouselLogin"
                    data-bs-slide-to="0"
                    className="active"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselLogin"
                    data-bs-slide-to="1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselLogin"
                    data-bs-slide-to="2"
                  ></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src="https://content.jdmagicbox.com/comp/mysore/t6/0821px821.x821.220222153619.h6t6/catalogue/srk-event-management-vijaynagar-4th-stage-mysore-photographers-p1lg7qaaye.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="1"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://4.imimg.com/data4/TR/PB/MY-11071660/wedding-party-event-management.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="2"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://www.mbatuts.com/wp-content/uploads/2019/11/Event-Planning-Business-in-plan.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="3"
                    />
                  </div>
                </div>
              </div>

              <p className="lead mb-4 opacity-75">
                Experience the luxury of being a guest at your own event.{' '}
              </p>
              <button
                className="btn btn-light rounded-pill px-4 py-2 fw-bold d-block mx-auto"
                onClick={() => setIsFlipped(true)}
              >
                Sign Up?
              </button>
            </div>

            {/* --- BACK SIDE (Register View) --- */}
            <div className="cover-side cover-back d-flex flex-column align-items-start text-start">
              <h1
                className="display-4 fw-bold mb-3"
                style={{ fontSize: '41px' }}
              >
                Join us to celebrate
              </h1>

              {/* Note the different ID and REF here */}
              <div
                id="carouselRegister"
                className="carousel slide"
                ref={registerCarouselRef}
                data-bs-ride="carousel"
              >
                <div
                  className="carousel-indicators"
                  style={{ marginBottom: '20px' }}
                >
                  <button
                    type="button"
                    data-bs-target="#carouselRegister"
                    data-bs-slide-to="0"
                    className="active"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselRegister"
                    data-bs-slide-to="1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselRegister"
                    data-bs-slide-to="2"
                  ></button>
                </div>
                <div className="carousel-inner mb-5">
                  <div className="carousel-item active">
                    <img
                      src="https://content.jdmagicbox.com/comp/mysore/t6/0821px821.x821.220222153619.h6t6/catalogue/srk-event-management-vijaynagar-4th-stage-mysore-photographers-p1lg7qaaye.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="1"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://4.imimg.com/data4/TR/PB/MY-11071660/wedding-party-event-management.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="2"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://www.mbatuts.com/wp-content/uploads/2019/11/Event-Planning-Business-in-plan.jpg"
                      className="d-block mx-auto mb-4"
                      style={{
                        width: '350px',
                        height: '200px',
                        borderRadius: '6px',
                        border: '2px solid #fff',
                        objectFit: 'cover',
                      }}
                      alt="3"
                    />
                  </div>
                </div>
              </div>

              <p className="lead mb-4 opacity-75">
                We don’t just plan events; we orchestrate masterpieces. You
                simply show up. Log back in to check your guest lists...
              </p>
              <button
                className="btn btn-light rounded-pill px-4 py-2 fw-bold d-block mx-auto"
                onClick={() => setIsFlipped(false)}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default Auth;
