import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Paper,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ScaleIcon from '@mui/icons-material/Scale';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsAPI, servicesAPI, documentsAPI, getErrorMessage } from '../api/api';

const steps = [
  'Instructions',
  'General',
  'Transportation',
  'Package',
  'Uploads',
  'Review',
];

const ApplicationForm = () => {
  const { id } = useParams(); // This is service_id for new applications, or application_id for editing
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [applicationId, setApplicationId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // Track application status
  const [isViewMode, setIsViewMode] = useState(false); // Track if we're just viewing (not editing)
  const [uploadedDocuments, setUploadedDocuments] = useState({}); // Track uploaded document IDs
  const [formData, setFormData] = useState({
    // General Information
    applicationReference: '',
    applicationDate: '',
    consignmentOwner: '',
    modelOfDeclaration: '',
    typeOfDeclaration: '',
    tin: '',
    // Importer Details
    importerName: '',
    importerPhone: '',
    importerEmail: '',
    importerAddress: '',
    importerCity: '',
    importerPostalCode: '',
    importerCountry: '',
    officeLocation: '',
    importerTaxId: '',
    // Consignor Details
    consignorName: '',
    consignorAddress: '',
    consignorCity: '',
    consignorPostalCode: '',
    consignorCountry: '',
    consignorPhone: '',
    consignorEmail: '',
    cityTown: '',
    countryOfOrigin: '',
    countryOfDestination: '',
    // Transportation fields
    modeOfTransport: '',
    vesselFlightNumber: '',
    portOfLoading: '',
    portOfDischarge: '',
    expectedArrivalDate: '',
    shippingLine: '',
    containerNumber: '',
    billOfLadingNumber: '',
    // Package fields
    numberOfPackages: '',
    packageType: '',
    grossWeight: '',
    netWeight: '',
    volume: '',
    descriptionOfGoods: '',
    hsCode: '',
    valueOfGoods: '',
    currency: '',
  });
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    billOfLading: null,
    commercialInvoice: null,
    exemptionLetter: null,
    packingList: null,
    certificateOfOrigin: null,
    freightInvoice: null,
    insuranceCertificate: null,
    cargoTrackingNote: null,
    importLicense: null,
    exportDeclaration: null,
    taxClearanceCertificate: null,
    businessRegistrationCertificate: null,
    tinCertificate: null,
    technicalStandardCertificate: null,
    healthCertificate: null,
  });

  // Load application or service on mount and when id changes
  useEffect(() => {
    // Reset state when id changes
    setIsEditMode(false);
    setIsViewMode(false);
    setApplicationId(null);
    setServiceId(null);
    setApplicationStatus(null);
    setError('');
    setSuccess('');
    setActiveStep(0);
    
    // Load data
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      // Check if id is an application ID (editing/viewing) or service ID (new)
      if (id && !isNaN(id)) {
        try {
          // Try to load as application first
          const app = await applicationsAPI.getApplication(parseInt(id));
          
          if (!app || !app.id) {
            throw new Error('Invalid application data received');
          }
          
          setIsEditMode(true);
          setApplicationId(app.id);
          setServiceId(app.service_id);
          setApplicationStatus(app.status || 'draft');
          
          // When viewing an existing application, always go to review step to show details
          setIsViewMode(true);
          setActiveStep(5); // Go directly to Review step to show all details
          
          // Load service info and documents in parallel
          await Promise.all([
            loadServiceInfo(app.service_id),
            loadApplicationDocuments(app.id)
          ]);
          
          // Load application data after service info is loaded
          loadApplicationData(app);
        } catch (err) {
          console.error('Error loading application:', err);
          const errorMsg = getErrorMessage(err);
          
          // If it's a 404 or "not found" error, it might be a service ID instead
          if (err.response?.status === 404 || errorMsg?.toLowerCase().includes('not found')) {
            // Try to load as service ID
            try {
              const serviceIdNum = parseInt(id);
              setServiceId(serviceIdNum);
              await loadServiceInfo(serviceIdNum);
              setIsViewMode(false); // Not in view mode for new applications
            } catch (serviceErr) {
              setError(getErrorMessage(serviceErr) || 'Application or service not found.');
            }
          } else {
            // Show the actual error
            setError(errorMsg || 'Failed to load application. Please try again.');
          }
        }
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to load data. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadServiceInfo = async (serviceId) => {
    try {
      const service = await servicesAPI.getService(serviceId);
      setServiceName(service.name);
    } catch (err) {
      console.error('Failed to load service info:', err);
    }
  };

  const loadApplicationData = (app) => {
    // Map API response to form data
    setFormData({
      applicationReference: app.application_reference || '',
      applicationDate: app.application_date ? app.application_date.split('T')[0] : '',
      consignmentOwner: app.consignment_owner || '',
      modelOfDeclaration: app.model_of_declaration || '',
      typeOfDeclaration: app.type_of_declaration || '',
      tin: app.tin || '',
      importerName: app.importer_name || '',
      importerPhone: app.importer_phone || '',
      importerEmail: app.importer_email || '',
      importerAddress: app.importer_address || '',
      importerCity: app.importer_city || '',
      importerPostalCode: app.importer_postal_code || '',
      importerCountry: app.importer_country || '',
      officeLocation: app.office_location || '',
      importerTaxId: app.importer_tax_id || '',
      consignorName: app.consignor_name || '',
      consignorAddress: app.consignor_address || '',
      consignorCity: app.consignor_city || '',
      consignorPostalCode: app.consignor_postal_code || '',
      consignorCountry: app.consignor_country || '',
      consignorPhone: app.consignor_phone || '',
      consignorEmail: app.consignor_email || '',
      countryOfOrigin: app.country_of_origin || '',
      countryOfDestination: app.country_of_destination || '',
      modeOfTransport: app.mode_of_transport || '',
      vesselFlightNumber: app.vessel_flight_number || '',
      portOfLoading: app.port_of_loading || '',
      portOfDischarge: app.port_of_discharge || '',
      expectedArrivalDate: app.expected_arrival_date ? app.expected_arrival_date.split('T')[0] : '',
      shippingLine: app.shipping_line || '',
      containerNumber: app.container_number || '',
      billOfLadingNumber: app.bill_of_lading_number || '',
      numberOfPackages: app.number_of_packages || '',
      packageType: app.package_type || '',
      grossWeight: app.gross_weight || '',
      netWeight: app.net_weight || '',
      volume: app.volume || '',
      descriptionOfGoods: app.description_of_goods || '',
      hsCode: app.hs_code || '',
      valueOfGoods: app.value_of_goods || '',
      currency: app.currency || '',
    });
  };

  const loadApplicationDocuments = async (appId) => {
    try {
      const docs = await documentsAPI.getApplicationDocuments(appId);
      const docsMap = {};
      if (docs && Array.isArray(docs)) {
        docs.forEach(doc => {
          // Map document_type from API to form field names
          docsMap[doc.document_type] = doc;
        });
      }
      setUploadedDocuments(docsMap);
    } catch (err) {
      console.error('Failed to load documents:', err);
      // Don't show error to user, just log it - documents might not exist yet
      setUploadedDocuments({});
    }
  };

  const mapFormDataToAPI = () => {
    return {
      service_id: serviceId,
      application_reference: formData.applicationReference || undefined,
      application_date: formData.applicationDate ? new Date(formData.applicationDate).toISOString() : undefined,
      consignment_owner: formData.consignmentOwner || undefined,
      model_of_declaration: formData.modelOfDeclaration || undefined,
      type_of_declaration: formData.typeOfDeclaration || undefined,
      tin: formData.tin || undefined,
      importer_name: formData.importerName || undefined,
      importer_phone: formData.importerPhone || undefined,
      importer_email: formData.importerEmail || undefined,
      importer_address: formData.importerAddress || undefined,
      importer_city: formData.importerCity || undefined,
      importer_postal_code: formData.importerPostalCode || undefined,
      importer_country: formData.importerCountry || undefined,
      office_location: formData.officeLocation || undefined,
      importer_tax_id: formData.importerTaxId || undefined,
      consignor_name: formData.consignorName || undefined,
      consignor_address: formData.consignorAddress || undefined,
      consignor_city: formData.consignorCity || undefined,
      consignor_postal_code: formData.consignorPostalCode || undefined,
      consignor_country: formData.consignorCountry || undefined,
      consignor_phone: formData.consignorPhone || undefined,
      consignor_email: formData.consignorEmail || undefined,
      country_of_origin: formData.countryOfOrigin || undefined,
      country_of_destination: formData.countryOfDestination || undefined,
      mode_of_transport: formData.modeOfTransport || undefined,
      vessel_flight_number: formData.vesselFlightNumber || undefined,
      port_of_loading: formData.portOfLoading || undefined,
      port_of_discharge: formData.portOfDischarge || undefined,
      expected_arrival_date: formData.expectedArrivalDate ? new Date(formData.expectedArrivalDate).toISOString() : undefined,
      shipping_line: formData.shippingLine || undefined,
      container_number: formData.containerNumber || undefined,
      bill_of_lading_number: formData.billOfLadingNumber || undefined,
      number_of_packages: formData.numberOfPackages ? parseInt(formData.numberOfPackages) : undefined,
      package_type: formData.packageType || undefined,
      gross_weight: formData.grossWeight ? parseFloat(formData.grossWeight) : undefined,
      net_weight: formData.netWeight ? parseFloat(formData.netWeight) : undefined,
      volume: formData.volume ? parseFloat(formData.volume) : undefined,
      description_of_goods: formData.descriptionOfGoods || undefined,
      hs_code: formData.hsCode || undefined,
      value_of_goods: formData.valueOfGoods ? parseFloat(formData.valueOfGoods) : undefined,
      currency: formData.currency || undefined,
    };
  };

  const saveDraft = async () => {
    // Don't save if we don't have a service ID (required for creating new application)
    if (!serviceId) {
      setError('Please select a service first');
      return;
    }
    
    setSaving(true);
    setError('');
    try {
      const apiData = mapFormDataToAPI();
      
      if (applicationId) {
        // Update existing application
        await applicationsAPI.updateApplication(applicationId, apiData);
      } else {
        // Create new application
        const newApp = await applicationsAPI.createApplication(apiData);
        setApplicationId(newApp.id);
        setIsEditMode(true);
      }
      setSuccess('Draft saved successfully');
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to save draft');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (validateStep()) {
      // Save draft before moving to next step
      if (activeStep > 0 && activeStep < steps.length - 1) {
        await saveDraft();
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = () => {
    // Validation disabled - allow navigation through all steps
    return true;
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleFileUpload = (field) => async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!applicationId) {
      // Create application first if it doesn't exist
      try {
        const apiData = mapFormDataToAPI();
        const newApp = await applicationsAPI.createApplication(apiData);
        setApplicationId(newApp.id);
        setIsEditMode(true);
      } catch (err) {
        setError('Failed to create application. Please try again.');
        return;
      }
    }

    setSaving(true);
    try {
      // Upload document
      const document = await documentsAPI.uploadDocument(
        applicationId,
        field,
        file
      );
      
      setUploadedFiles({ ...uploadedFiles, [field]: file });
      setUploadedDocuments({ ...uploadedDocuments, [field]: document });
      setSuccess(`${file.name} uploaded successfully`);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to upload document');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileRemove = (field) => async () => {
    const doc = uploadedDocuments[field];
    if (doc && doc.id) {
      try {
        setSaving(true);
        await documentsAPI.deleteDocument(doc.id);
        const newDocs = { ...uploadedDocuments };
        delete newDocs[field];
        setUploadedDocuments(newDocs);
    setUploadedFiles({ ...uploadedFiles, [field]: null });
        setSuccess('Document removed successfully');
      } catch (err) {
        setError(getErrorMessage(err) || 'Failed to remove document');
      } finally {
        setSaving(false);
      }
    } else {
      setUploadedFiles({ ...uploadedFiles, [field]: null });
    }
  };

  // Helper function to render file upload section
  const renderFileUploadSection = (field, label, required = false) => {
    const hasFile = uploadedFiles[field] || uploadedDocuments[field];
    const fileName = uploadedFiles[field]?.name || uploadedDocuments[field]?.file_name;
    
    return (
      <Box>
        {label && (
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            {label} {required && <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {hasFile && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 2, 
                bgcolor: '#e8f5e9', 
                border: '1px solid #4caf50',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
              <InsertDriveFileIcon sx={{ color: '#666', fontSize: 20 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1,
                  fontWeight: 500,
                  color: '#333',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={fileName}
              >
                {fileName}
              </Typography>
              <IconButton 
                onClick={handleFileRemove(field)} 
                color="error" 
                size="small" 
                disabled={saving} 
                title="Remove file"
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'error.light',
                    color: 'error.contrastText'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ 
              textTransform: 'none',
              alignSelf: 'flex-start',
              borderColor: hasFile ? '#4caf50' : 'primary.main',
              color: hasFile ? '#4caf50' : 'primary.main',
              '&:hover': {
                borderColor: hasFile ? '#4caf50' : 'primary.dark',
                bgcolor: hasFile ? 'rgba(76, 175, 80, 0.04)' : 'rgba(25, 118, 210, 0.04)'
              }
            }}
            disabled={saving}
            size="medium"
          >
            {saving ? 'Uploading...' : hasFile ? 'Replace File' : 'Upload File'}
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/*,application/pdf"
              onChange={handleFileUpload(field)}
              disabled={saving}
            />
          </Button>
        </Box>
      </Box>
    );
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      setError('Please complete the form before submitting');
      return;
    }

    setSaving(true);
    setError('');
    try {
      // Save final draft
      await saveDraft();
      
      // Submit application
      await applicationsAPI.submitApplication(applicationId);
      setSuccess('Application submitted successfully!');
      
      // Redirect to application history after 2 seconds
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to submit application');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                Application Instructions
              </Typography>

              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  ACCREDITATION PERMIT FOR SHIPMENT.
                </Typography>
                <Typography>
                  The service is mandatory for all consignments entering The
                  Central African Republic.
                </Typography>
              </Alert>

              <Paper sx={{ p: 3, bgcolor: '#fce4ec', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  END TO END PROCESS FLOW
                </Typography>
                <Typography>
                  Brief manual to capture the process.{' '}
                  <Link href="#" underline="always">
                    Click here to download.
                  </Link>
                </Typography>
              </Paper>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 4 }}>
                Who is Eligible to submit this Application?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Accreditation Permit for Shipment is an official authorization
                granted to businesses allowing them to engage in the
                importation of goods into the Central African Republic.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How to apply
              </Typography>
              <Box component="ol" sx={{ pl: 3, mb: 3 }}>
                <li>Read through the Instructions carefully</li>
                <li>Fill in the application form</li>
                <li>Print copy of the Accreditation Permit</li>
                <li>
                  Visit{' '}
                  <Link href="https://ects.eac.int" target="_blank">
                    https://ects.eac.int
                  </Link>{' '}
                  to book for Central African Republic cargo.
                </li>
                <li>Use your permit number to submit the application.</li>
                <li>
                  Pay against the invoice generated through any of the authorised
                  options
                </li>
                <li>
                  Present a copy to all relevant authorities at the country of
                  origin, trading country and port of entry.
                </li>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Requirements during submission
              </Typography>
              <Box component="ol" sx={{ pl: 3, mb: 3 }}>
                <li>
                  Valid etax Tax Identification Number (TIN) for all Importers.
                  Visit{' '}
                  <Link href="https://nra.etax.gov.ss" target="_blank">
                    https://nra.etax.gov.ss
                  </Link>{' '}
                  to obtain a TIN if you dont have one.
                </li>
                <li>Full name and contact of the exporting company</li>
                <li>
                  Scanned copies of Bill of Lading, Commercial invoice or
                  Exemption Letter for any expemted cargo (PDF or image format)
                </li>
              </Box>

              <Alert severity="info" sx={{ bgcolor: '#e3f2fd' }}>
                Providing wrong information will attract a penalty, please ensure
                that all information provided in this application is accurate
              </Alert>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                Changes you make will be saved as draft and will not reflect in
                the application until you submit the form at the end
              </Alert>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                General Information
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Application Reference Number"
                    value={formData.applicationReference}
                    onChange={handleChange('applicationReference')}
                    helperText="Auto-generated or enter reference number"
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Application Date"
                    value={formData.applicationDate}
                    onChange={handleChange('applicationDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Consignment Owner</InputLabel>
                    <Select
                      value={formData.consignmentOwner}
                      onChange={handleChange('consignmentOwner')}
                      label="Consignment Owner"
                    >
                      <MenuItem value="Private Individual">Private Individual</MenuItem>
                      <MenuItem value="Private Company">Private Company</MenuItem>
                      <MenuItem value="Government">Government</MenuItem>
                      <MenuItem value="Non Governmental Organization">Non Governmental Organization</MenuItem>
                      <MenuItem value="International Organization">International Organization</MenuItem>
                      <MenuItem value="Diplomatic Mission">Diplomatic Mission</MenuItem>
                      <MenuItem value="Charitable Organization">Charitable Organization</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Model of Declaration</InputLabel>
                    <Select
                      value={formData.modelOfDeclaration}
                      onChange={handleChange('modelOfDeclaration')}
                      label="Model of Declaration"
                    >
                      <MenuItem value="Import">Import</MenuItem>
                      <MenuItem value="Export">Export</MenuItem>
                      <MenuItem value="Re-Import">Re-Import</MenuItem>
                      <MenuItem value="Re-Export">Re-Export</MenuItem>
                      <MenuItem value="Transit">Transit</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Type of Declaration</InputLabel>
                    <Select
                      value={formData.typeOfDeclaration}
                      onChange={handleChange('typeOfDeclaration')}
                      label="Type of Declaration"
                    >
                      <MenuItem value="IM4 Direct Permanent Import">IM4 - Direct Permanent Import</MenuItem>
                      <MenuItem value="IM5 Temporary Import">IM5 - Temporary Import</MenuItem>
                      <MenuItem value="IM6 Re-Import">IM6 - Re-Import</MenuItem>
                      <MenuItem value="IM7 Warehousing">IM7 - Warehousing</MenuItem>
                      <MenuItem value="EX4 Direct Permanent Export">EX4 - Direct Permanent Export</MenuItem>
                      <MenuItem value="EX5 Temporary Export">EX5 - Temporary Export</MenuItem>
                      <MenuItem value="EX6 Re-Export">EX6 - Re-Export</MenuItem>
                      <MenuItem value="TR1 Transit">TR1 - Transit</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                Don't have a TIN?{' '}
                <Link href="https://nra.etax.gov.ss" target="_blank">
                  Register Here
                </Link>
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Validate TIN
              </Typography>
              <TextField
                fullWidth
                label="Your TIN"
                value={formData.tin}
                onChange={handleChange('tin')}
                sx={{ mb: 4 }}
              />

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Importer Details
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Importer Name / Company Name"
                    value={formData.importerName}
                    onChange={handleChange('importerName')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Importer Phone Number"
                    value={formData.importerPhone}
                    onChange={handleChange('importerPhone')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Importer Email Address"
                    value={formData.importerEmail}
                    onChange={handleChange('importerEmail')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Importer Tax ID"
                    value={formData.importerTaxId}
                    onChange={handleChange('importerTaxId')}
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Importer Address"
                    value={formData.importerAddress}
                    onChange={handleChange('importerAddress')}
                    multiline
                    rows={2}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Importer City"
                    value={formData.importerCity}
                    onChange={handleChange('importerCity')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.importerPostalCode}
                    onChange={handleChange('importerPostalCode')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Importer Country</InputLabel>
                    <Select
                      value={formData.importerCountry}
                      onChange={handleChange('importerCountry')}
                      label="Importer Country"
                    >
                      <MenuItem value="Central African Republic">Central African Republic</MenuItem>
                      <MenuItem value="Cameroon">Cameroon</MenuItem>
                      <MenuItem value="Chad">Chad</MenuItem>
                      <MenuItem value="Congo">Congo</MenuItem>
                      <MenuItem value="Democratic Republic of Congo">Democratic Republic of Congo</MenuItem>
                      <MenuItem value="Gabon">Gabon</MenuItem>
                      <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Uganda">Uganda</MenuItem>
                      <MenuItem value="Tanzania">Tanzania</MenuItem>
                      <MenuItem value="Rwanda">Rwanda</MenuItem>
                      <MenuItem value="Burundi">Burundi</MenuItem>
                      <MenuItem value="South Sudan">South Sudan</MenuItem>
                      <MenuItem value="Sudan">Sudan</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Office Location"
                    value={formData.officeLocation}
                    onChange={handleChange('officeLocation')}
                  />
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, mt: 4 }}>
                Consignor / Exporter Details
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Consignor Name / Exporter Company Name"
                    value={formData.consignorName}
                    onChange={handleChange('consignorName')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Consignor Phone Number"
                    value={formData.consignorPhone}
                    onChange={handleChange('consignorPhone')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Consignor Email Address"
                    value={formData.consignorEmail}
                    onChange={handleChange('consignorEmail')}
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Consignor Address"
                    value={formData.consignorAddress}
                    onChange={handleChange('consignorAddress')}
                    multiline
                    rows={2}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Consignor City/Town"
                    value={formData.consignorCity}
                    onChange={handleChange('consignorCity')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.consignorPostalCode}
                    onChange={handleChange('consignorPostalCode')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Country of Consignor/Exporter</InputLabel>
                    <Select
                      value={formData.consignorCountry}
                      onChange={handleChange('consignorCountry')}
                      label="Country of Consignor/Exporter"
                    >
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Uganda">Uganda</MenuItem>
                      <MenuItem value="Tanzania">Tanzania</MenuItem>
                      <MenuItem value="Rwanda">Rwanda</MenuItem>
                      <MenuItem value="Burundi">Burundi</MenuItem>
                      <MenuItem value="Cameroon">Cameroon</MenuItem>
                      <MenuItem value="Chad">Chad</MenuItem>
                      <MenuItem value="Congo">Congo</MenuItem>
                      <MenuItem value="Democratic Republic of Congo">Democratic Republic of Congo</MenuItem>
                      <MenuItem value="Gabon">Gabon</MenuItem>
                      <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                      <MenuItem value="China">China</MenuItem>
                      <MenuItem value="India">India</MenuItem>
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      <MenuItem value="France">France</MenuItem>
                      <MenuItem value="Germany">Germany</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Country of Origin of Goods</InputLabel>
                    <Select
                      value={formData.countryOfOrigin}
                      onChange={handleChange('countryOfOrigin')}
                      label="Country of Origin of Goods"
                    >
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Uganda">Uganda</MenuItem>
                      <MenuItem value="Tanzania">Tanzania</MenuItem>
                      <MenuItem value="Rwanda">Rwanda</MenuItem>
                      <MenuItem value="Burundi">Burundi</MenuItem>
                      <MenuItem value="Cameroon">Cameroon</MenuItem>
                      <MenuItem value="Chad">Chad</MenuItem>
                      <MenuItem value="Congo">Congo</MenuItem>
                      <MenuItem value="Democratic Republic of Congo">Democratic Republic of Congo</MenuItem>
                      <MenuItem value="Gabon">Gabon</MenuItem>
                      <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                      <MenuItem value="China">China</MenuItem>
                      <MenuItem value="India">India</MenuItem>
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      <MenuItem value="France">France</MenuItem>
                      <MenuItem value="Germany">Germany</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Country of Destination</InputLabel>
                    <Select
                      value={formData.countryOfDestination}
                      onChange={handleChange('countryOfDestination')}
                      label="Country of Destination"
                    >
                      <MenuItem value="Central African Republic">Central African Republic</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Uganda">Uganda</MenuItem>
                      <MenuItem value="Tanzania">Tanzania</MenuItem>
                      <MenuItem value="Rwanda">Rwanda</MenuItem>
                      <MenuItem value="Burundi">Burundi</MenuItem>
                      <MenuItem value="Cameroon">Cameroon</MenuItem>
                      <MenuItem value="Chad">Chad</MenuItem>
                      <MenuItem value="Congo">Congo</MenuItem>
                      <MenuItem value="Democratic Republic of Congo">Democratic Republic of Congo</MenuItem>
                      <MenuItem value="Gabon">Gabon</MenuItem>
                      <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                Changes you make will be saved as draft and will not reflect in
                the application until you submit the form at the end
              </Alert>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Transportation Details
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Mode of Transport</InputLabel>
                    <Select
                      value={formData.modeOfTransport}
                      onChange={handleChange('modeOfTransport')}
                      label="Mode of Transport"
                    >
                      <MenuItem value="Sea">Sea</MenuItem>
                      <MenuItem value="Air">Air</MenuItem>
                      <MenuItem value="Road">Road</MenuItem>
                      <MenuItem value="Rail">Rail</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Vessel/Flight/Truck Number"
                    value={formData.vesselFlightNumber}
                    onChange={handleChange('vesselFlightNumber')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Port of Loading"
                    value={formData.portOfLoading}
                    onChange={handleChange('portOfLoading')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Port of Discharge"
                    value={formData.portOfDischarge}
                    onChange={handleChange('portOfDischarge')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Expected Date of Arrival"
                    value={formData.expectedArrivalDate}
                    onChange={handleChange('expectedArrivalDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Shipping Line/Carrier Name"
                    value={formData.shippingLine}
                    onChange={handleChange('shippingLine')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Container Number"
                    value={formData.containerNumber}
                    onChange={handleChange('containerNumber')}
                    helperText="If applicable"
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="Bill of Lading Number"
                    value={formData.billOfLadingNumber}
                    onChange={handleChange('billOfLadingNumber')}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                Changes you make will be saved as draft and will not reflect in
                the application until you submit the form at the end
              </Alert>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Package Information
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Packages"
                    value={formData.numberOfPackages}
                    onChange={handleChange('numberOfPackages')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Package Type</InputLabel>
                    <Select
                      value={formData.packageType}
                      onChange={handleChange('packageType')}
                      label="Package Type"
                    >
                      <MenuItem value="Cartons">Cartons</MenuItem>
                      <MenuItem value="Pallets">Pallets</MenuItem>
                      <MenuItem value="Bags">Bags</MenuItem>
                      <MenuItem value="Drums">Drums</MenuItem>
                      <MenuItem value="Containers">Containers</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Gross Weight (kg)"
                    value={formData.grossWeight}
                    onChange={handleChange('grossWeight')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Net Weight (kg)"
                    value={formData.netWeight}
                    onChange={handleChange('netWeight')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Volume (m³)"
                    value={formData.volume}
                    onChange={handleChange('volume')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    label="HS Code"
                    value={formData.hsCode}
                    onChange={handleChange('hsCode')}
                    helperText="Harmonized System Code"
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Value of Goods"
                    value={formData.valueOfGoods}
                    onChange={handleChange('valueOfGoods')}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={formData.currency}
                      onChange={handleChange('currency')}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD - US Dollar</MenuItem>
                      <MenuItem value="EUR">EUR - Euro</MenuItem>
                      <MenuItem value="XAF">XAF - Central African CFA Franc</MenuItem>
                      <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description of Goods"
                    value={formData.descriptionOfGoods}
                    onChange={handleChange('descriptionOfGoods')}
                    helperText="Provide detailed description of the goods being imported"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                Please upload all required documents in PDF or image format (JPG, PNG, GIF, WEBP). Maximum file size: 5MB per file.
              </Alert>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Upload Required Documents
              </Typography>

              <Alert severity="warning" sx={{ mb: 3, bgcolor: '#fff3cd' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Required Documents:
                </Typography>
                <Typography variant="body2">
                  Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, 
                  Cargo Tracking Note (CTN), Tax Clearance Certificate, Business Registration Certificate, 
                  and TIN Certificate are mandatory. Other documents are required based on your shipment type.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Bill of Lading */}
                {renderFileUploadSection('billOfLading', 'Bill of Lading', true)}

                {/* Commercial Invoice */}
                {renderFileUploadSection('commercialInvoice', 'Commercial Invoice', true)}

                {/* Exemption Letter */}
                {renderFileUploadSection('exemptionLetter', 'Exemption Letter (If Applicable)', false)}

                {/* Packing List */}
                {renderFileUploadSection('packingList', 'Packing List', true)}

                {/* Certificate of Origin */}
                {renderFileUploadSection('certificateOfOrigin', 'Certificate of Origin', true)}

                {/* Cargo Tracking Note (CTN) */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Cargo Tracking Note (CTN) / Bordereau de Suivi de Cargaison (BSC) <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Required for all sea shipments to Central African Republic
                      </Typography>
                  {renderFileUploadSection('cargoTrackingNote', '', true)}
                </Box>

                {/* Tax Clearance Certificate */}
                {renderFileUploadSection('taxClearanceCertificate', 'Tax Clearance Certificate', true)}

                {/* Business Registration Certificate */}
                {renderFileUploadSection('businessRegistrationCertificate', 'Business Registration Certificate', true)}

                {/* TIN Certificate */}
                {renderFileUploadSection('tinCertificate', 'TIN Certificate / Proof of TIN', true)}

                {/* Freight Invoice */}
                {renderFileUploadSection('freightInvoice', 'Freight Invoice', false)}

                {/* Insurance Certificate */}
                {renderFileUploadSection('insuranceCertificate', 'Insurance Certificate', false)}

                {/* Import License */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Import License (If Applicable)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Required for certain restricted goods
                      </Typography>
                  {renderFileUploadSection('importLicense', '', false)}
                </Box>

                {/* Export Declaration */}
                {renderFileUploadSection('exportDeclaration', 'Export Declaration (If Applicable)', false)}

                {/* Technical Standard Certificate */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Technical Standard Certificate (If Applicable)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Required for goods that must meet technical standards
                      </Typography>
                  {renderFileUploadSection('technicalStandardCertificate', '', false)}
                </Box>

                {/* Health Certificate */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Health Certificate / Phytosanitary Certificate (If Applicable)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Required for food, agricultural products, and pharmaceuticals
                      </Typography>
                  {renderFileUploadSection('healthCertificate', '', false)}
                    </Box>
                </Box>
            </CardContent>
          </Card>
        );

      case 5:
        return (
                <Box>
            {/* Header Section */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <DescriptionIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Application Review
                  </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Please review all information before submitting your application
                      </Typography>
                    </Box>
                </Box>
                {formData.applicationReference && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Application Reference</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{formData.applicationReference}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Important Notice
                  </Typography>
              <Typography variant="body2">
                Please carefully review all information below. Once submitted, changes may require creating a new application. 
                Ensure all required documents are uploaded before proceeding.
                  </Typography>
            </Alert>

            <Grid container spacing={3}>
              {/* General Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                        <DescriptionIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        General Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Application Reference
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.applicationReference || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                  </Typography>
                    </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Application Date
                      </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.applicationDate || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Consignment Owner
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.consignmentOwner || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Model of Declaration
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.modelOfDeclaration || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Type of Declaration
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.typeOfDeclaration || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            TIN
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.tin || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Importer Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                        <BusinessIcon sx={{ color: '#f57c00', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f57c00' }}>
                        Importer Details
                  </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Name/Company
                      </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.importerName || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Phone
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.importerPhone || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Email
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.importerEmail || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Tax ID
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.importerTaxId || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                  </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Address
                      </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.importerAddress || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {formData.importerCity && `${formData.importerCity}, `}
                            {formData.importerPostalCode && `${formData.importerPostalCode} `}
                            {formData.importerCountry}
                          </Typography>
                    </Box>
                </Box>
                      {formData.officeLocation && (
                <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Office Location
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.officeLocation}
                      </Typography>
                    </Box>
                  )}
                </Box>
            </CardContent>
          </Card>
              </Grid>

              {/* Consignor/Exporter Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                        <PersonIcon sx={{ color: '#2e7d32', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        Consignor/Exporter Details
                  </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Name/Company
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.consignorName || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                      </Typography>
                    </Box>
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Phone
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.consignorPhone || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                  </Typography>
                    </Box>
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Email
                      </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.consignorEmail || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                    </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Address
              </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.consignorAddress || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                  </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {formData.consignorCity && `${formData.consignorCity}, `}
                            {formData.consignorPostalCode && `${formData.consignorPostalCode} `}
                            {formData.consignorCountry}
                          </Typography>
                </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                        <PublicIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Country of Origin
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.countryOfOrigin || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Country of Destination
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.countryOfDestination || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
              </Grid>

              {/* Transportation Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#e1f5fe', borderRadius: 2 }}>
                        <LocalShippingIcon sx={{ color: '#0277bd', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0277bd' }}>
                        Transportation Details
              </Typography>
                    </Box>
                  <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formData.modeOfTransport === 'Sea' && <DirectionsBoatIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}
                        {formData.modeOfTransport === 'Air' && <FlightIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}
                        {formData.modeOfTransport !== 'Sea' && formData.modeOfTransport !== 'Air' && <LocalShippingIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Mode of Transport
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.modeOfTransport || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                      </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Vessel/Flight/Truck Number
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.vesselFlightNumber || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                        </Typography>
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Port of Loading
                  </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.portOfLoading || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Port of Discharge
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.portOfDischarge || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Expected Arrival Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.expectedArrivalDate || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                        </Box>
                      </Box>
                <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Bill of Lading Number
                  </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {formData.billOfLadingNumber || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                        </Typography>
                </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

                {/* Package Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#fce4ec', borderRadius: 2 }}>
                        <InventoryIcon sx={{ color: '#c2185b', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#c2185b' }}>
                    Package Information
                  </Typography>
                    </Box>
                  <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Number of Packages
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.numberOfPackages || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Package Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.packageType || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScaleIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Gross Weight
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                              {formData.grossWeight ? `${formData.grossWeight} kg` : <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScaleIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Net Weight
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                              {formData.netWeight ? `${formData.netWeight} kg` : <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                        <LocalAtmIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Value of Goods
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.valueOfGoods ? `${formData.valueOfGoods} ${formData.currency || ''}` : <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Description of Goods
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, whiteSpace: 'pre-wrap' }}>
                          {formData.descriptionOfGoods || <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>}
                        </Typography>
                      </Box>
                      {formData.hsCode && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            HS Code
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {formData.hsCode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

                {/* Uploaded Documents */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box sx={{ p: 1, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                        <AttachFileIcon sx={{ color: '#7b1fa2', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                    Uploaded Documents
                  </Typography>
                </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                      {[
                        { field: 'billOfLading', label: 'Bill of Lading', required: true },
                        { field: 'commercialInvoice', label: 'Commercial Invoice', required: true },
                        { field: 'packingList', label: 'Packing List', required: true },
                        { field: 'certificateOfOrigin', label: 'Certificate of Origin', required: true },
                        { field: 'cargoTrackingNote', label: 'Cargo Tracking Note (CTN)', required: true },
                        { field: 'taxClearanceCertificate', label: 'Tax Clearance Certificate', required: true },
                        { field: 'businessRegistrationCertificate', label: 'Business Registration Certificate', required: true },
                        { field: 'tinCertificate', label: 'TIN Certificate', required: true },
                        { field: 'exemptionLetter', label: 'Exemption Letter', required: false },
                        { field: 'freightInvoice', label: 'Freight Invoice', required: false },
                        { field: 'insuranceCertificate', label: 'Insurance Certificate', required: false },
                        { field: 'importLicense', label: 'Import License', required: false },
                        { field: 'exportDeclaration', label: 'Export Declaration', required: false },
                        { field: 'technicalStandardCertificate', label: 'Technical Standard Certificate', required: false },
                        { field: 'healthCertificate', label: 'Health Certificate', required: false },
                      ].map((doc) => {
                        // Check both uploadedFiles (local) and uploadedDocuments (from API)
                        // The API returns documents with document_type matching the field name
                        const hasFile = uploadedFiles[doc.field] || uploadedDocuments[doc.field];
                        const fileName = uploadedFiles[doc.field]?.name || uploadedDocuments[doc.field]?.file_name;
                        return (
                          <Grid item xs={12} sm={6} md={4} key={doc.field}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: hasFile ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                bgcolor: hasFile ? '#f1f8f4' : '#fafafa',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: 2,
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                {hasFile ? (
                                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24, flexShrink: 0, mt: 0.5 }} />
                                ) : (
                                  <InsertDriveFileIcon sx={{ color: '#999', fontSize: 24, flexShrink: 0, mt: 0.5 }} />
                                )}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      mb: 0.5,
                                      color: hasFile ? '#2e7d32' : 'text.secondary',
                                    }}
                                  >
                                    {doc.label}
                                    {doc.required && <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: hasFile ? '#333' : '#999',
                                      fontWeight: hasFile ? 500 : 400,
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={fileName || 'Not uploaded'}
                                  >
                                    {hasFile ? fileName : 'Not uploaded'}
                                  </Typography>
              </Box>
                              </Box>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
            </CardContent>
          </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Step {activeStep + 1} Content
              </Typography>
              <Typography>This step is under development.</Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box>
      <Header isAuthenticated={true} />
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {isViewMode ? 'Application Details' : serviceName || 'Application Form'}
            {formData.applicationReference && ` - ${formData.applicationReference}`}
        </Typography>
          {applicationStatus && (
            <Chip
              label={applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
              color={
                applicationStatus === 'approved'
                  ? 'success'
                  : applicationStatus === 'rejected'
                  ? 'error'
                  : applicationStatus === 'submitted'
                  ? 'info'
                  : 'default'
              }
              sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
              Loading application details...
            </Typography>
          </Box>
        ) : error && !isEditMode && !serviceId ? (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/applications')}
                  sx={{ textTransform: 'none' }}
                >
                  Back to Applications
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => loadInitialData()}
                  sx={{ textTransform: 'none' }}
                >
                  Retry
                </Button>
              </Box>
            }
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Failed to Load Application
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        ) : (
          <>
            {!isViewMode && (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
            )}

        {renderStepContent()}

            {!isViewMode && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
                  disabled={activeStep === 0 || saving}
            onClick={handleBack}
            sx={{ textTransform: 'none' }}
          >
            PREVIOUS
          </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep > 0 && activeStep < steps.length - 1 && (
                    <Button
                      variant="outlined"
                      onClick={saveDraft}
                      disabled={saving}
                      sx={{ textTransform: 'none' }}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save Draft'}
                    </Button>
                  )}
          <Button
            variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={saving || !serviceId}
            sx={{ textTransform: 'none' }}
          >
                    {saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : activeStep === steps.length - 1 ? (
                      'SUBMIT'
                    ) : (
                      'NEXT'
                    )}
          </Button>
        </Box>
              </Box>
            )}

            {isViewMode && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/applications')}
                  sx={{ textTransform: 'none' }}
                >
                  Back to Applications
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ApplicationForm;

