import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Paper, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Chip, Alert, CircularProgress, Stack, Box, Grid, Card, CardContent } from '@mui/material';
import { PageHero } from '../components/Sections';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { api } from '../api';

const fmt = (d) => new Date(d).toLocaleDateString();
const Loading = ({ loading, error }) => (<>{loading && <Stack alignItems="center" sx={{ py: 3 }}><CircularProgress /></Stack>}{error && <Alert severity="error">{error}</Alert>}</>);

function AppointmentsTable({ path, editable }) {
  const { data, setData, loading, error } = useFetch(path);
  const [msg, setMsg] = React.useState('');
  const change = async (id, status) => {
    try {
      const updated = await api.patch(`/appointments/${id}`, { status });
      setData(data.map((a) => (a._id === id ? updated : a)));
    } catch (e) { setMsg(e.message); }
  };
  return (
    <>
      <Loading loading={loading} error={error || msg} />
      {data && data.length === 0 && <Typography color="text.secondary">No appointment requests yet.</Typography>}
      {data && data.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead><TableRow>{['Name', 'Contact', 'Department', 'Date', 'Slot', 'Notes', 'Status'].map((h) => <TableCell key={h}><b>{h}</b></TableCell>)}</TableRow></TableHead>
            <TableBody>
              {data.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.email}<br />{a.phone}</TableCell>
                  <TableCell>{a.department || '—'}</TableCell>
                  <TableCell>{a.preferredDate}</TableCell>
                  <TableCell>{a.timeSlot}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{a.notes || '—'}</TableCell>
                  <TableCell>
                    {editable ? (
                      <Select size="small" value={a.status} onChange={(e) => change(a._id, e.target.value)}>
                        {['Pending', 'Confirmed', 'Cancelled'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    ) : <Chip size="small" label={a.status} color={a.status === 'Confirmed' ? 'success' : a.status === 'Cancelled' ? 'error' : 'warning'} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </>
  );
}

function ContactsTable() {
  const { data, setData, loading, error } = useFetch('/contacts');
  const toggle = async (c) => {
    const updated = await api.patch(`/contacts/${c._id}`, { status: c.status === 'New' ? 'Replied' : 'New' });
    setData(data.map((x) => (x._id === c._id ? updated : x)));
  };
  return (
    <>
      <Loading loading={loading} error={error} />
      {data && data.length === 0 && <Typography color="text.secondary">No enquiries yet.</Typography>}
      {data && data.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead><TableRow>{['Received', 'From', 'Subject', 'Message', 'Status'].map((h) => <TableCell key={h}><b>{h}</b></TableCell>)}</TableRow></TableHead>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{fmt(c.createdAt)}</TableCell>
                  <TableCell>{c.name}<br />{c.email}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>{c.message}</TableCell>
                  <TableCell><Chip size="small" clickable label={c.status} color={c.status === 'New' ? 'warning' : 'success'} onClick={() => toggle(c)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </>
  );
}

function MyClasses({ name }) {
  const { data, loading, error } = useFetch(`/classes?instructor=${encodeURIComponent(name)}`);
  return (
    <>
      <Loading loading={loading} error={error} />
      {data && data.length === 0 && <Typography color="text.secondary">No classes are assigned to you yet.</Typography>}
      <Grid container spacing={2}>
        {(data || []).map((c) => (
          <Grid item xs={12} sm={6} key={c._id}>
            <Card variant="outlined"><CardContent>
              <Typography variant="h6">{c.name}</Typography>
              <Typography color="text.secondary" variant="body2">{c.category} · {c.level}</Typography>
              <Typography sx={{ mt: 1 }}>{c.schedule}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tab, setTab] = React.useState(0);

  if (loading) return <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress /></Stack>;
  if (!user) return <Navigate to="/login" replace />;

  const tabs = user.role === 'Admin'
    ? [['All Appointments', <AppointmentsTable key="a" path="/appointments" editable />], ['Enquiries', <ContactsTable key="c" />]]
    : user.role === 'Instructor'
      ? [['My Classes', <MyClasses key="m" name={user.name} />]]
      : [['My Appointments', <AppointmentsTable key="s" path="/appointments/mine" />]];

  return (
    <>
      <PageHero eyebrow={`${user.role.toUpperCase()} PORTAL`} title={`Welcome, ${user.firstName}`} subtitle={user.email} />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper sx={{ p: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>{tabs.map(([label]) => <Tab key={label} label={label} />)}</Tabs>
          {tabs[tab][1]}
        </Paper>
      </Container>
    </>
  );
}
