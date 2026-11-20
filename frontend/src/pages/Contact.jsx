import React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Stack, Box, Alert } from '@mui/material';
import { PageHero } from '../components/Sections';
import { api } from '../api';

const blank = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = React.useState(blank);
  const [done, setDone] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/contacts', form);
      setDone(res.message);
      setForm(blank);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="WE'D LOVE TO HEAR FROM YOU" title="Contact Admissions & Faculty" subtitle="Have questions regarding curriculum, batch placements or studio rentals? Reach out to our admissions team." />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography className="eyebrow">STUDIO HEADQUARTERS</Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>Visit Our Academy</Typography>
              {[['Campus Address', 'Sri Krishna College Road, Coimbatore, Tamil Nadu'], ['Telephone / WhatsApp', '+91 00000 00000'], ['Email Address', 'contact@rhythora.dance'], ['Office Hours', 'Monday – Saturday, 9:00 AM – 6:00 PM']].map(([a, b]) => (
                <Box sx={{ mb: 2 }} key={a}><Typography fontWeight={700}>{a}</Typography><Typography color="text.secondary" variant="body2">{b}</Typography></Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography className="eyebrow">SEND AN ENQUIRY</Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>How May We Assist You?</Typography>
              {done ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>{done}</Alert>
                  <Button variant="outlined" onClick={() => setDone('')}>Send another message</Button>
                </>
              ) : (
                <Stack component="form" spacing={2} onSubmit={submit}>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField required fullWidth label="Your Name" value={form.name} onChange={set('name')} /></Grid>
                    <Grid item xs={12} sm={6}><TextField required fullWidth type="email" label="Email Address" value={form.email} onChange={set('email')} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={form.phone} onChange={set('phone')} /></Grid>
                    <Grid item xs={12} sm={6}><TextField required fullWidth label="Subject" value={form.subject} onChange={set('subject')} /></Grid>
                    <Grid item xs={12}><TextField required fullWidth multiline rows={4} label="Message" value={form.message} onChange={set('message')} /></Grid>
                  </Grid>
                  <Button type="submit" variant="contained" disabled={busy}>{busy ? 'Sending…' : 'Send Message'}</Button>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
