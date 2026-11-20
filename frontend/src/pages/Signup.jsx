import React from 'react';
import { Container, Paper, Box, Typography, Grid, TextField, Button, FormControlLabel, Checkbox, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const empty = { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function Signup() {
  const [form, setForm] = React.useState(empty);
  const [agree, setAgree] = React.useState(false);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!agree) return setError('Please accept the Terms & Conditions and Privacy Policy.');
    setBusy(true);
    try {
      await register(form);
      nav('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ overflow: 'hidden', maxWidth: 470, mx: 'auto' }}>
        <Box sx={{ bgcolor: '#211b29', color: 'white', textAlign: 'center', p: 3 }}>
          <Box component="img" src="/images/logo_circular.png" sx={{ width: 62, height: 62, borderRadius: '50%' }} />
          <Typography variant="h5" color="#d6ad65">Create Student Account</Typography>
          <Typography variant="caption">Join our conservatory and begin your dance journey.</Typography>
        </Box>
        <Box component="form" onSubmit={submit} sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth required label="First Name" value={form.firstName} onChange={set('firstName')} /></Grid>
            <Grid item xs={6}><TextField fullWidth required label="Last Name" value={form.lastName} onChange={set('lastName')} /></Grid>
            <Grid item xs={12}><TextField fullWidth required type="email" label="Email Address" value={form.email} onChange={set('email')} /></Grid>
            <Grid item xs={12}><TextField fullWidth required label="Phone Number" value={form.phone} onChange={set('phone')} /></Grid>
            <Grid item xs={12}><TextField fullWidth required type="password" label="Password (min 6 characters)" value={form.password} onChange={set('password')} inputProps={{ minLength: 6 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth required type="password" label="Confirm Password" value={form.confirmPassword} onChange={set('confirmPassword')} /></Grid>
          </Grid>
          <FormControlLabel sx={{ mt: 1 }} control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label="I agree to the Terms & Conditions and Privacy Policy." />
          <Button type="submit" fullWidth variant="contained" disabled={busy} sx={{ mt: 2 }}>{busy ? 'Creating account…' : 'Create My Account'}</Button>
          <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
            Already have an account? <Link component={RouterLink} to="/login">Sign In</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
