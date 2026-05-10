import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import { validateEmail, validatePassword } from '../../utils/validators';
import logo from '../../assets/logo-1-1-300x108.jpg';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setLoginError('');
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) newErrors.email = emailResult.message;
    const passResult = validatePassword(formData.password);
    if (!passResult.valid) newErrors.password = passResult.message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setLoginError('');
    try {
      await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      setLoginError(err || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }, [formData, validate, dispatch, navigate]);

  const emailIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const lockIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const arrowIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-modal p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img src={logo} alt="AAJ SCM" className="h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">AAJ SCM</h1>
          <p className="text-sm text-secondary-500 mt-1">Logistics Portal Login</p>
        </div>

        {loginError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input id="login-email" label="Email Address" type="email" placeholder="coordinator@aajscm.com" value={formData.email} onChange={handleChange('email')} error={errors.email} leftIcon={emailIcon} />
          <Input id="login-password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange('password')} error={errors.password} leftIcon={lockIcon} />

          <div className="flex items-center justify-between">
            <Checkbox id="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} label="Remember me" />
            <button type="button" className="text-sm text-primary font-medium hover:text-primary-700 transition-colors">Forgot Password?</button>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} rightIcon={!loading && arrowIcon}>
            Sign In
          </Button>
        </form>

        <div className="my-6 border-t border-secondary-100" />
        <p className="text-center text-sm text-secondary-500">
          Need system access?{' '}
          <button className="text-primary font-medium hover:text-primary-700 transition-colors">Contact IT Support</button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
