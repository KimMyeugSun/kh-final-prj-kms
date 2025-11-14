import { Box, Button, Typography } from '@mui/material';

const ResearchCard = ({ icon, label, sx, active = false, onClick }) => (
  <Button
    onClick={onClick}
    variant={active ? 'contained' : 'outlined'}
    disableElevation
    fullWidth
    sx={{
      justifyContent: 'flex-start',
      textTransform: 'none',
      p: 3,
      borderRadius: 2,
      gap: 2,
      transition: 'all 0.15s ease-in-out',
      ...(active
        ? {
            borderColor: 'primary.main',
            bgcolor: 'primary.light',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2)',
            transform: 'translateY(2px)',
          }
        : {
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              transform: 'translateY(-1px)',
            },
          }),
      ...sx,
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        color: active ? 'success.main' : 'primary.main',
        transition: 'all 0.15s ease-in-out',
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: 600, color: active ? 'text.primary' : 'GrayText' }}
    >
      {label}
    </Typography>
  </Button>
);

export default ResearchCard;
