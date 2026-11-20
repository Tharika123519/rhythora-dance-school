import React from 'react';
import { Container, Paper, Box, Typography, ToggleButtonGroup, ToggleButton, TextField, Button, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [role, setRole] = React.useState('Student');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password, role);
      nav('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 7 }}>
      <Paper sx={{ overflow: 'hidden', maxWidth: 440, mx: 'auto' }}>
        <Box sx={{ bgcolor: '#211b29', color: 'white', textAlign: 'center', p: 3 }}>
          <Box component="img" src="/images/logo_circular.png" sx={{ width: 65, height: 65, borderRadius: '50%' }} />
          <Typography variant="h5" color="#d6ad65" sx={{ mt: 1 }}>Rhythora Conservatory Portal</Typography>
          <Typography variant="caption">Feel the Rhythm. Live the Movement.</Typography>
        </Box>
        <Box component="form" onSubmit={submit} sx={{ p: 3 }}>
          <Typography textAlign="center" fontWeight={700}>SELECT PORTAL ACCESS ROLE</Typography>
          <ToggleButtonGroup exclusive fullWidth value={role} onChange={(e, v) => v && setRole(v)} sx={{ my: 2 }}>
            {['Student', 'Instructor', 'Admin'].map((x) => <ToggleButton key={x} value={x}>{x}</ToggleButton>)}
          </ToggleButtonGroup>
          <Typography variant="h6">{role} Sign In</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Access your personalized academy portal.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth required type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth required type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" disabled={busy} sx={{ mt: 3, py: 1.3 }}>
            {busy ? 'Signing in…' : `Sign In as ${role}`}
          </Button>
          <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
            New here? <Link component={RouterLink} to="/register">Create a Student Account</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
