/**
 * Helper function to render file upload section consistently
 * This can be used to update all file upload sections in ApplicationForm
 */
export const renderFileUploadSection = (
  field,
  label,
  required = false,
  uploadedFiles,
  uploadedDocuments,
  handleFileUpload,
  handleFileRemove,
  saving = false
) => {
  const hasFile = uploadedFiles[field] || uploadedDocuments[field];
  const fileName = uploadedFiles[field]?.name || uploadedDocuments[field]?.file_name;

  return {
    hasFile,
    fileName,
    render: (
      <Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {label} {required && <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>}
        </Typography>
        {hasFile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {fileName}
            </Typography>
            <IconButton onClick={handleFileRemove(field)} color="error" size="small" disabled={saving}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'none' }}
            disabled={saving}
          >
            {saving ? 'Uploading...' : `Upload ${label} (PDF)`}
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileUpload(field)}
              disabled={saving}
            />
          </Button>
        )}
      </Box>
    )
  };
};

