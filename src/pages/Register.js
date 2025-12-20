import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Link,
  Alert,
  Checkbox,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { authAPI, getErrorMessage } from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(true);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    personalNumber: '',
    passportNumber: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    gender: '',
    nationality: '',
    email: '',
    confirmEmail: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Prepare registration data based on user type
      const registrationData = {
        user_type: userType,
        first_name: formData.firstName,
        email: formData.email,
        password: formData.password,
      };

      // Add type-specific fields
      if (userType === 'citizens' || userType === 'residents') {
        registrationData.personal_number = formData.personalNumber;
        registrationData.mobile_number = formData.mobileNumber;
      }

      if (userType === 'foreigners') {
        registrationData.passport_number = formData.passportNumber;
        registrationData.last_name = formData.lastName;
        registrationData.other_names = formData.otherNames;
        registrationData.gender = formData.gender;
        registrationData.nationality = formData.nationality;
      }

      if (userType === 'residents') {
        registrationData.nationality = formData.nationality;
      }

      await authAPI.register(registrationData);
      setSuccess(true);
      
      // Auto login after registration
      setTimeout(async () => {
        try {
          await authAPI.login(formData.email, formData.password);
          const user = await authAPI.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(user));
          
          // Trigger event to update user info in Header and other components
          window.dispatchEvent(new Event('userInfoUpdated'));
          
          navigate('/dashboard');
        } catch (loginErr) {
          navigate('/signin');
        }
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err) || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeDescription = () => {
    switch (userType) {
      case 'citizens':
        return 'This account is for Central African Republic citizens only. You will need your National ID number and your first name to register.';
      case 'residents':
        return 'This account is for foreigners residing in Central African Republic. You will need your foreigner certificate number and your first name to register.';
      case 'foreigners':
        return 'This account is for nationals who require a visa to enter the Central African Republic.';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header />
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 6 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            maxWidth: { xs: '100%', md: '1400px' },
            mx: 'auto',
          }}
        >
          {showAccountTypeSelection ? (
            <>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Box
                  component="img"
                  src="/car-emblem.png"
                  alt="Central African Republic"
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    mb: 3,
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                  Create Your Account
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Select your account type to get started with accessing all Government Services
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 3, md: 4, lg: 6 },
                  mb: 6,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    p: { xs: 2, sm: 3, md: 4 },
                  }}
                  onClick={() => {
                    setUserType('citizens');
                    setShowAccountTypeSelection(false);
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                    Central African Republic Citizen
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.primary', fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' } }}>
                    This account is for Central African Republic citizens only. You will need your National ID number and your first name to register.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#1976d2',
                      color: 'white',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        bgcolor: '#1565c0',
                      },
                    }}
                  >
                    Create an Account
                  </Button>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    p: { xs: 3, sm: 4, md: 5 },
                    borderRadius: 3,
                    border: '2px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => {
                    setUserType('residents');
                    setShowAccountTypeSelection(false);
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">🏠</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                    Foreign Residents
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }, lineHeight: 1.6 }}>
                    This account is for foreigners residing in Central African Republic. You will need your foreigner certificate and your first name to register.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#1976d2',
                      color: 'white',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        bgcolor: '#1565c0',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      },
                    }}
                  >
                    Create an Account
                  </Button>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    p: { xs: 3, sm: 4, md: 5 },
                    borderRadius: 3,
                    border: '2px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => {
                    setUserType('foreigners');
                    setShowAccountTypeSelection(false);
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">✈️</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                    Visitors
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }, lineHeight: 1.6 }}>
                    This account is for nationals who require a visa to enter the Central African Republic.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#1976d2',
                      color: 'white',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        bgcolor: '#1565c0',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      },
                    }}
                  >
                    Create an Account
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mb: 4,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  borderRadius: 3,
                  p: 4,
                  color: 'white',
                  mb: 4,
                }}
              >
                <Box
                  component="img"
                  src="/car-emblem.png"
                  alt="Central African Republic"
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    mb: 2,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Complete the form below to access all Government Services
                </Typography>
              </Box>

              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                  Select Account Type
                </FormLabel>
                <RadioGroup
                  row
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setFormData({
                      personalNumber: '',
                      passportNumber: '',
                      firstName: '',
                      lastName: '',
                      otherNames: '',
                      gender: '',
                      nationality: '',
                      email: '',
                      confirmEmail: '',
                      mobileNumber: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  sx={{ justifyContent: 'center', gap: 4 }}
                >
                  <FormControlLabel value="citizens" control={<Radio />} label="Citizens" />
                  <FormControlLabel value="residents" control={<Radio />} label="Residents" />
                  <FormControlLabel value="foreigners" control={<Radio />} label="Foreigners" />
                </RadioGroup>
              </FormControl>

              <Alert 
                severity="info" 
                sx={{ 
                  mb: 4, 
                  bgcolor: '#e3f2fd',
                  borderRadius: 2,
                  borderLeft: '4px solid #1976d2',
                }}
              >
                {getUserTypeDescription()}
              </Alert>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  Registration successful! Redirecting to dashboard...
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
            {/* Common fields for all account types */}
            {userType === 'citizens' && (
              <>
                <TextField
                  fullWidth
                  label="Personal Number"
                  required
                  value={formData.personalNumber}
                  onChange={handleChange('personalNumber')}
                  placeholder="e.g. 12345678"
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="First Name as per your ID"
                  required
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="e.g. JAMES"
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {userType === 'residents' && (
              <>
                <TextField
                  fullWidth
                  label="Personal Number"
                  required
                  value={formData.personalNumber}
                  onChange={handleChange('personalNumber')}
                  placeholder="e.g. 12345678"
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="First Name as per your ID"
                  required
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="e.g. JAMES"
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {userType === 'foreigners' && (
              <>
                <TextField
                  fullWidth
                  label="Passport Number"
                  required
                  value={formData.passportNumber}
                  onChange={handleChange('passportNumber')}
                  placeholder="e.g. B000000"
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="e.g. JAMES"
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Last Name (Family Name)"
                  required
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  placeholder="e.g. JONES"
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Other Names"
                  value={formData.otherNames}
                  onChange={handleChange('otherNames')}
                  placeholder="e.g. E"
                  sx={{ mb: 3 }}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={handleChange('gender')}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {/* Email fields - common for all */}
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="e.g. john.m@gmail.com"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              type="email"
              label="Confirm Email Address"
              required
              value={formData.confirmEmail}
              onChange={handleChange('confirmEmail')}
              placeholder="john.m@gmail.com"
              error={formData.email !== formData.confirmEmail && formData.confirmEmail !== ''}
              helperText={
                formData.email !== formData.confirmEmail && formData.confirmEmail !== ''
                  ? 'Emails do not match'
                  : ''
              }
              sx={{ mb: 3 }}
            />

            {/* Mobile Number - only for Citizens and Residents */}
            {(userType === 'citizens' || userType === 'residents') && (
              <TextField
                fullWidth
                label="Mobile Number"
                required
                value={formData.mobileNumber}
                onChange={handleChange('mobileNumber')}
                placeholder="0712 345678"
                sx={{ mb: 3 }}
              />
            )}

            {/* Password fields - common for all */}
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              required
              value={formData.password}
              onChange={handleChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword !== ''
              }
              helperText={
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Nationality - only for Residents and Foreigners */}
            {(userType === 'residents' || userType === 'foreigners') && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Nationality *</InputLabel>
                  <Select
                    value={formData.nationality}
                    onChange={handleChange('nationality')}
                    label="Nationality *"
                    required
                  >
                    <MenuItem value="Afghanistan">Afghanistan</MenuItem>
                    <MenuItem value="Albania">Albania</MenuItem>
                    <MenuItem value="Algeria">Algeria</MenuItem>
                    <MenuItem value="American Samoa">American Samoa</MenuItem>
                    <MenuItem value="Andorra">Andorra</MenuItem>
                    <MenuItem value="Angola">Angola</MenuItem>
                    <MenuItem value="Anguilla">Anguilla</MenuItem>
                    <MenuItem value="Antarctica">Antarctica</MenuItem>
                    <MenuItem value="Antigua and Barbuda">Antigua and Barbuda</MenuItem>
                    <MenuItem value="Argentina">Argentina</MenuItem>
                    <MenuItem value="Armenia">Armenia</MenuItem>
                    <MenuItem value="Aruba">Aruba</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                    <MenuItem value="Austria">Austria</MenuItem>
                    <MenuItem value="Azerbaijan">Azerbaijan</MenuItem>
                    <MenuItem value="Bahamas">Bahamas</MenuItem>
                    <MenuItem value="Bahrain">Bahrain</MenuItem>
                    <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                    <MenuItem value="Barbados">Barbados</MenuItem>
                    <MenuItem value="Belarus">Belarus</MenuItem>
                    <MenuItem value="Belgium">Belgium</MenuItem>
                    <MenuItem value="Belize">Belize</MenuItem>
                    <MenuItem value="Benin">Benin</MenuItem>
                    <MenuItem value="Bermuda">Bermuda</MenuItem>
                    <MenuItem value="Bhutan">Bhutan</MenuItem>
                    <MenuItem value="Bolivia">Bolivia</MenuItem>
                    <MenuItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</MenuItem>
                    <MenuItem value="Botswana">Botswana</MenuItem>
                    <MenuItem value="Bouvet Island">Bouvet Island</MenuItem>
                    <MenuItem value="Brazil">Brazil</MenuItem>
                    <MenuItem value="British Antarctic Territory">British Antarctic Territory</MenuItem>
                    <MenuItem value="British Indian Ocean Territory">British Indian Ocean Territory</MenuItem>
                    <MenuItem value="British Virgin Islands">British Virgin Islands</MenuItem>
                    <MenuItem value="Brunei">Brunei</MenuItem>
                    <MenuItem value="Bulgaria">Bulgaria</MenuItem>
                    <MenuItem value="Burkina Faso">Burkina Faso</MenuItem>
                    <MenuItem value="Burundi">Burundi</MenuItem>
                    <MenuItem value="Cambodia">Cambodia</MenuItem>
                    <MenuItem value="Cameroon">Cameroon</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                    <MenuItem value="Canton and Enderbury Islands">Canton and Enderbury Islands</MenuItem>
                    <MenuItem value="Cape Verde">Cape Verde</MenuItem>
                    <MenuItem value="Cayman Islands">Cayman Islands</MenuItem>
                    <MenuItem value="Central African Republic">Central African Republic</MenuItem>
                    <MenuItem value="Chad">Chad</MenuItem>
                    <MenuItem value="Chile">Chile</MenuItem>
                    <MenuItem value="China">China</MenuItem>
                    <MenuItem value="Christmas Island">Christmas Island</MenuItem>
                    <MenuItem value="Cocos [Keeling] Islands">Cocos [Keeling] Islands</MenuItem>
                    <MenuItem value="Colombia">Colombia</MenuItem>
                    <MenuItem value="Comoros">Comoros</MenuItem>
                    <MenuItem value="Congo - Brazzaville">Congo - Brazzaville</MenuItem>
                    <MenuItem value="Congo - Kinshasa">Congo - Kinshasa</MenuItem>
                    <MenuItem value="Cook Islands">Cook Islands</MenuItem>
                    <MenuItem value="Costa Rica">Costa Rica</MenuItem>
                    <MenuItem value="Croatia">Croatia</MenuItem>
                    <MenuItem value="Cuba">Cuba</MenuItem>
                    <MenuItem value="Cyprus">Cyprus</MenuItem>
                    <MenuItem value="Czech Republic">Czech Republic</MenuItem>
                    <MenuItem value="Côte d'Ivoire">Côte d'Ivoire</MenuItem>
                    <MenuItem value="Denmark">Denmark</MenuItem>
                    <MenuItem value="Djibouti">Djibouti</MenuItem>
                    <MenuItem value="Dominica">Dominica</MenuItem>
                    <MenuItem value="Dominican Republic">Dominican Republic</MenuItem>
                    <MenuItem value="Dronning Maud Land">Dronning Maud Land</MenuItem>
                    <MenuItem value="East Germany">East Germany</MenuItem>
                    <MenuItem value="Ecuador">Ecuador</MenuItem>
                    <MenuItem value="Egypt">Egypt</MenuItem>
                    <MenuItem value="El Salvador">El Salvador</MenuItem>
                    <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                    <MenuItem value="Eritrea">Eritrea</MenuItem>
                    <MenuItem value="Estonia">Estonia</MenuItem>
                    <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                    <MenuItem value="Falkland Islands">Falkland Islands</MenuItem>
                    <MenuItem value="Faroe Islands">Faroe Islands</MenuItem>
                    <MenuItem value="Fiji">Fiji</MenuItem>
                    <MenuItem value="Finland">Finland</MenuItem>
                    <MenuItem value="France">France</MenuItem>
                    <MenuItem value="French Guiana">French Guiana</MenuItem>
                    <MenuItem value="French Polynesia">French Polynesia</MenuItem>
                    <MenuItem value="French Southern Territories">French Southern Territories</MenuItem>
                    <MenuItem value="French Southern and Antarctic Territories">French Southern and Antarctic Territories</MenuItem>
                    <MenuItem value="Gabon">Gabon</MenuItem>
                    <MenuItem value="Gambia">Gambia</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="Germany">Germany</MenuItem>
                    <MenuItem value="Ghana">Ghana</MenuItem>
                    <MenuItem value="Gibraltar">Gibraltar</MenuItem>
                    <MenuItem value="Greece">Greece</MenuItem>
                    <MenuItem value="Greenland">Greenland</MenuItem>
                    <MenuItem value="Grenada">Grenada</MenuItem>
                    <MenuItem value="Guadeloupe">Guadeloupe</MenuItem>
                    <MenuItem value="Guam">Guam</MenuItem>
                    <MenuItem value="Guatemala">Guatemala</MenuItem>
                    <MenuItem value="Guernsey">Guernsey</MenuItem>
                    <MenuItem value="Guinea">Guinea</MenuItem>
                    <MenuItem value="Guinea-Bissau">Guinea-Bissau</MenuItem>
                    <MenuItem value="Guyana">Guyana</MenuItem>
                    <MenuItem value="Haiti">Haiti</MenuItem>
                    <MenuItem value="Heard Island and McDonald Islands">Heard Island and McDonald Islands</MenuItem>
                    <MenuItem value="Honduras">Honduras</MenuItem>
                    <MenuItem value="Hong Kong SAR China">Hong Kong SAR China</MenuItem>
                    <MenuItem value="Hungary">Hungary</MenuItem>
                    <MenuItem value="Iceland">Iceland</MenuItem>
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="Indonesia">Indonesia</MenuItem>
                    <MenuItem value="Iran">Iran</MenuItem>
                    <MenuItem value="Iraq">Iraq</MenuItem>
                    <MenuItem value="Ireland">Ireland</MenuItem>
                    <MenuItem value="Isle of Man">Isle of Man</MenuItem>
                    <MenuItem value="Israel">Israel</MenuItem>
                    <MenuItem value="Italy">Italy</MenuItem>
                    <MenuItem value="Jamaica">Jamaica</MenuItem>
                    <MenuItem value="Japan">Japan</MenuItem>
                    <MenuItem value="Jersey">Jersey</MenuItem>
                    <MenuItem value="Johnston Island">Johnston Island</MenuItem>
                    <MenuItem value="Jordan">Jordan</MenuItem>
                    <MenuItem value="Kazakhstan">Kazakhstan</MenuItem>
                    <MenuItem value="Kenya">Kenya</MenuItem>
                    <MenuItem value="Kiribati">Kiribati</MenuItem>
                    <MenuItem value="Kuwait">Kuwait</MenuItem>
                    <MenuItem value="Kyrgyzstan">Kyrgyzstan</MenuItem>
                    <MenuItem value="Laos">Laos</MenuItem>
                    <MenuItem value="Latvia">Latvia</MenuItem>
                    <MenuItem value="Lebanon">Lebanon</MenuItem>
                    <MenuItem value="Lesotho">Lesotho</MenuItem>
                    <MenuItem value="Liberia">Liberia</MenuItem>
                    <MenuItem value="Libya">Libya</MenuItem>
                    <MenuItem value="Liechtenstein">Liechtenstein</MenuItem>
                    <MenuItem value="Lithuania">Lithuania</MenuItem>
                    <MenuItem value="Luxembourg">Luxembourg</MenuItem>
                    <MenuItem value="Macau SAR China">Macau SAR China</MenuItem>
                    <MenuItem value="Macedonia">Macedonia</MenuItem>
                    <MenuItem value="Madagascar">Madagascar</MenuItem>
                    <MenuItem value="Malawi">Malawi</MenuItem>
                    <MenuItem value="Malaysia">Malaysia</MenuItem>
                    <MenuItem value="Maldives">Maldives</MenuItem>
                    <MenuItem value="Mali">Mali</MenuItem>
                    <MenuItem value="Malta">Malta</MenuItem>
                    <MenuItem value="Marshall Islands">Marshall Islands</MenuItem>
                    <MenuItem value="Martinique">Martinique</MenuItem>
                    <MenuItem value="Mauritania">Mauritania</MenuItem>
                    <MenuItem value="Mauritius">Mauritius</MenuItem>
                    <MenuItem value="Mayotte">Mayotte</MenuItem>
                    <MenuItem value="Metropolitan France">Metropolitan France</MenuItem>
                    <MenuItem value="Mexico">Mexico</MenuItem>
                    <MenuItem value="Micronesia">Micronesia</MenuItem>
                    <MenuItem value="Midway Islands">Midway Islands</MenuItem>
                    <MenuItem value="Moldova">Moldova</MenuItem>
                    <MenuItem value="Monaco">Monaco</MenuItem>
                    <MenuItem value="Mongolia">Mongolia</MenuItem>
                    <MenuItem value="Montenegro">Montenegro</MenuItem>
                    <MenuItem value="Montserrat">Montserrat</MenuItem>
                    <MenuItem value="Morocco">Morocco</MenuItem>
                    <MenuItem value="Mozambique">Mozambique</MenuItem>
                    <MenuItem value="Myanmar [Burma]">Myanmar [Burma]</MenuItem>
                    <MenuItem value="Namibia">Namibia</MenuItem>
                    <MenuItem value="Nauru">Nauru</MenuItem>
                    <MenuItem value="Nepal">Nepal</MenuItem>
                    <MenuItem value="Netherlands">Netherlands</MenuItem>
                    <MenuItem value="Netherlands Antilles">Netherlands Antilles</MenuItem>
                    <MenuItem value="Neutral Zone">Neutral Zone</MenuItem>
                    <MenuItem value="New Caledonia">New Caledonia</MenuItem>
                    <MenuItem value="New Zealand">New Zealand</MenuItem>
                    <MenuItem value="Nicaragua">Nicaragua</MenuItem>
                    <MenuItem value="Niger">Niger</MenuItem>
                    <MenuItem value="Nigeria">Nigeria</MenuItem>
                    <MenuItem value="Niue">Niue</MenuItem>
                    <MenuItem value="Norfolk Island">Norfolk Island</MenuItem>
                    <MenuItem value="North Korea">North Korea</MenuItem>
                    <MenuItem value="North Vietnam">North Vietnam</MenuItem>
                    <MenuItem value="Northern Mariana Islands">Northern Mariana Islands</MenuItem>
                    <MenuItem value="Norway">Norway</MenuItem>
                    <MenuItem value="Oman">Oman</MenuItem>
                    <MenuItem value="Pacific Islands Trust Territory">Pacific Islands Trust Territory</MenuItem>
                    <MenuItem value="Pakistan">Pakistan</MenuItem>
                    <MenuItem value="Palau">Palau</MenuItem>
                    <MenuItem value="Palestinian Territories">Palestinian Territories</MenuItem>
                    <MenuItem value="Panama">Panama</MenuItem>
                    <MenuItem value="Panama Canal Zone">Panama Canal Zone</MenuItem>
                    <MenuItem value="Papua New Guinea">Papua New Guinea</MenuItem>
                    <MenuItem value="Paraguay">Paraguay</MenuItem>
                    <MenuItem value="People's Democratic Republic of Yemen">People's Democratic Republic of Yemen</MenuItem>
                    <MenuItem value="Peru">Peru</MenuItem>
                    <MenuItem value="Philippines">Philippines</MenuItem>
                    <MenuItem value="Pitcairn Islands">Pitcairn Islands</MenuItem>
                    <MenuItem value="Poland">Poland</MenuItem>
                    <MenuItem value="Portugal">Portugal</MenuItem>
                    <MenuItem value="Puerto Rico">Puerto Rico</MenuItem>
                    <MenuItem value="Qatar">Qatar</MenuItem>
                    <MenuItem value="Romania">Romania</MenuItem>
                    <MenuItem value="Russia">Russia</MenuItem>
                    <MenuItem value="Rwanda">Rwanda</MenuItem>
                    <MenuItem value="Réunion">Réunion</MenuItem>
                    <MenuItem value="Saint Barthélemy">Saint Barthélemy</MenuItem>
                    <MenuItem value="Saint Helena">Saint Helena</MenuItem>
                    <MenuItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</MenuItem>
                    <MenuItem value="Saint Lucia">Saint Lucia</MenuItem>
                    <MenuItem value="Saint Martin">Saint Martin</MenuItem>
                    <MenuItem value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</MenuItem>
                    <MenuItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</MenuItem>
                    <MenuItem value="Samoa">Samoa</MenuItem>
                    <MenuItem value="San Marino">San Marino</MenuItem>
                    <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
                    <MenuItem value="Senegal">Senegal</MenuItem>
                    <MenuItem value="Serbia">Serbia</MenuItem>
                    <MenuItem value="Serbia and Montenegro">Serbia and Montenegro</MenuItem>
                    <MenuItem value="Seychelles">Seychelles</MenuItem>
                    <MenuItem value="Sierra Leone">Sierra Leone</MenuItem>
                    <MenuItem value="Singapore">Singapore</MenuItem>
                    <MenuItem value="Slovakia">Slovakia</MenuItem>
                    <MenuItem value="Slovenia">Slovenia</MenuItem>
                    <MenuItem value="Solomon Islands">Solomon Islands</MenuItem>
                    <MenuItem value="Somalia">Somalia</MenuItem>
                    <MenuItem value="South Africa">South Africa</MenuItem>
                    <MenuItem value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</MenuItem>
                    <MenuItem value="South Korea">South Korea</MenuItem>
                    <MenuItem value="South Sudan">South Sudan</MenuItem>
                    <MenuItem value="Spain">Spain</MenuItem>
                    <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                    <MenuItem value="Sudan">Sudan</MenuItem>
                    <MenuItem value="Suriname">Suriname</MenuItem>
                    <MenuItem value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</MenuItem>
                    <MenuItem value="Swaziland">Swaziland</MenuItem>
                    <MenuItem value="Sweden">Sweden</MenuItem>
                    <MenuItem value="Switzerland">Switzerland</MenuItem>
                    <MenuItem value="Syria">Syria</MenuItem>
                    <MenuItem value="São Tomé and Príncipe">São Tomé and Príncipe</MenuItem>
                    <MenuItem value="Taiwan">Taiwan</MenuItem>
                    <MenuItem value="Tajikistan">Tajikistan</MenuItem>
                    <MenuItem value="Tanzania">Tanzania</MenuItem>
                    <MenuItem value="Thailand">Thailand</MenuItem>
                    <MenuItem value="Timor-Leste">Timor-Leste</MenuItem>
                    <MenuItem value="Togo">Togo</MenuItem>
                    <MenuItem value="Tokelau">Tokelau</MenuItem>
                    <MenuItem value="Tonga">Tonga</MenuItem>
                    <MenuItem value="Trinidad and Tobago">Trinidad and Tobago</MenuItem>
                    <MenuItem value="Tunisia">Tunisia</MenuItem>
                    <MenuItem value="Turkey">Turkey</MenuItem>
                    <MenuItem value="Turkmenistan">Turkmenistan</MenuItem>
                    <MenuItem value="Turks and Caicos Islands">Turks and Caicos Islands</MenuItem>
                    <MenuItem value="Tuvalu">Tuvalu</MenuItem>
                    <MenuItem value="U.S. Minor Outlying Islands">U.S. Minor Outlying Islands</MenuItem>
                    <MenuItem value="U.S. Miscellaneous Pacific Islands">U.S. Miscellaneous Pacific Islands</MenuItem>
                    <MenuItem value="U.S. Virgin Islands">U.S. Virgin Islands</MenuItem>
                    <MenuItem value="Uganda">Uganda</MenuItem>
                    <MenuItem value="Ukraine">Ukraine</MenuItem>
                    <MenuItem value="Union of Soviet Socialist Republics">Union of Soviet Socialist Republics</MenuItem>
                    <MenuItem value="United Arab Emirates">United Arab Emirates</MenuItem>
                    <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                    <MenuItem value="United States">United States</MenuItem>
                    <MenuItem value="Unknown or Invalid Region">Unknown or Invalid Region</MenuItem>
                    <MenuItem value="Uruguay">Uruguay</MenuItem>
                    <MenuItem value="Uzbekistan">Uzbekistan</MenuItem>
                    <MenuItem value="Vanuatu">Vanuatu</MenuItem>
                    <MenuItem value="Vatican City">Vatican City</MenuItem>
                    <MenuItem value="Venezuela">Venezuela</MenuItem>
                    <MenuItem value="Vietnam">Vietnam</MenuItem>
                    <MenuItem value="Wake Island">Wake Island</MenuItem>
                    <MenuItem value="Wallis and Futuna">Wallis and Futuna</MenuItem>
                    <MenuItem value="Western Sahara">Western Sahara</MenuItem>
                    <MenuItem value="Yemen">Yemen</MenuItem>
                    <MenuItem value="Zambia">Zambia</MenuItem>
                    <MenuItem value="Zimbabwe">Zimbabwe</MenuItem>
                    <MenuItem value="Åland Islands">Åland Islands</MenuItem>
                  </Select>
                </FormControl>
            )}

            {/* Terms and conditions and submit button - common for all */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" underline="always">
                    terms and conditions
                  </Link>{' '}
                  *
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!agreedToTerms || loading}
              sx={{
                bgcolor: '#1976d2',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  bgcolor: '#1565c0',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                },
                '&:disabled': {
                  bgcolor: '#90caf9',
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
              </Box>
            </>
          )}

          {userType && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  onClick={() => navigate('/signin')}
                  sx={{ fontWeight: 600 }}
                >
                  Log in.
                </Link>
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 - Central African Republic - All Rights Reserved /{' '}
              <Link href="#" underline="always">
                Terms of Use
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
