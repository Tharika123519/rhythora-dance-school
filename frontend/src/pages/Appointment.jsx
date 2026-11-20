import React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, MenuItem, Stack, Box, Alert } from '@mui/material';
import { PageHero } from '../components/Sections';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Appointment() {
  const { user } = useAuth();
  const blank = { name: '', email: '', phone: '', department: '', preferredDate: '', timeSlot: 'Morning', notes: '' };
  const [form, setForm] = React.useState(blank);
  const [done, setDone] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Pre-fill contact details for logged-in users.
  React.useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || user.phone || '' }));
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/appointments', form);
      setDone(res.message);
      setForm(blank);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <PageHero eyebrow="START YOUR JOURNEY" title="Schedule Your Session" subtitle="Tell us a little about yourself and our admissions team will help you find the right class." />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Schedule Your Session</Typography>
              {done ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>{done}</Alert>
                  <Button variant="outlined" onClick={() => setDone('')}>Book another session</Button>
                </>
              ) : (
                <Stack component="form" spacing={2} onSubmit={submit}>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField required fullWidth label="Your Full Name" value={form.name} onChange={set('name')} /></Grid>
                    <Grid item xs={12} sm={6}><TextField required fullWidth type="email" label="Email Address" value={form.email} onChange={set('email')} /></Grid>
                    <Grid item xs={12} sm={6}><TextField required fullWidth label="Phone Number" value={form.phone} onChange={set('phone')} /></Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="Department (Optional)" value={form.department} onChange={set('department')}>
                        <MenuItem value="">No preference</MenuItem>
                        <MenuItem value="Indian Dance">Indian Dance</MenuItem>
                        <MenuItem value="Western Dance">Western Dance</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField required fullWidth type="date" label="Preferred Date" InputLabelProps={{ shrink: true }} inputProps={{ min: today }} value={form.preferredDate} onChange={set('preferredDate')} /></Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="Preferred Time Slot" value={form.timeSlot} onChange={set('timeSlot')}>
                        {['Morning', 'Afternoon', 'Evening'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Goals / Prior Dance Background (Optional)" value={form.notes} onChange={set('notes')} /></Grid>
                  </Grid>
                  <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? 'Submitting…' : 'Confirm Appointment Request'}</Button>
                </Stack>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6">What to Expect</Typography>
              {[['One-on-One Faculty Assessment', 'A personal consultation to understand your goals and experience.'], ['Customized Study Plan', 'Suggested training path based on your interests and level.'], ['Personalized Curriculum Guidance', 'Understand class progression and faculty recommendations.']].map(([a, b]) => (
                <Box sx={{ my: 2 }} key={a}><Typography color="primary" fontWeight={700}>{a}</Typography><Typography variant="body2" color="text.secondary">{b}</Typography></Box>
              ))}
            </Paper>
            <Paper sx={{ p: 3, bgcolor: '#211b29', color: 'white' }}>
              <Typography variant="h6" color="#d6ad65">Need Immediate Support?</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Our admissions team is happy to help with class selection and scheduling.</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>✉ contact@rhythora.dance</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
