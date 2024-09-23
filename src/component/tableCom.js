import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const JobTable = ({ jobs, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, onDetail, onUpdate, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDetail, setIsDetail] = useState(true);
  const [selectedJob, setSelectedJob] = useState({
    id: '',
    title: '',
    companyName: '',
    workType: '',
    location: '',
    salary: '',
    benefit: '',
    listingDate: '',
    tag: '',
  });
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleOpenDialog = (job, isDetail) => {
    setSelectedJob({
      ...job,
      benefit: Array.isArray(job.benefit) ? job.benefit.join(', ') : job.benefit, // Format benefits as a string
    });
    setIsDetail(isDetail);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob({
      id: '',
      title: '',
      companyName: '',
      workType: '',
      location: '',
      salary: '',
      benefit: '',
      listingDate: '',
      tag: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setSelectedJob((prevJob) => ({
      ...prevJob,
      listingDate: newDate,
    }));
  };

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setJobToDelete(null); 
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      onDelete(jobToDelete);
      handleCloseDeleteConfirm();
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>No</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Title</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Company Name</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Work Type</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Location</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Salary</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Listing Date</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Tag</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
              <TableRow key={job.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.workType}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.salary ? job.salary : '-'}</TableCell>
                <TableCell>{new Date(job.listingDate).toLocaleDateString()}</TableCell>
                <TableCell>{job.tag}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(job, true)}
                    >
                      Detail
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleOpenDialog(job, false)}
                      style={{ marginLeft: '8px' }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(job.id)}
                      style={{ marginLeft: '8px' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={jobs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isDetail ? 'Job Details' : 'Update Job'}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '400px',
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={selectedJob.title}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company Name"
              name="companyName"
              value={selectedJob.companyName}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label="Work Type"
              name="workType"
              value={selectedJob.workType}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={selectedJob.location}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={selectedJob.salary}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label="Benefit"
              name="benefit"
              value={selectedJob.benefit}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Listing Date"
              value={selectedJob.listingDate ? new Date(selectedJob.listingDate) : null}
              onChange={(newDate) => handleDateChange(newDate)}
              disabled={isDetail}
              slots={{ textField: (params) => <TextField {...params} /> }}
            />
          </LocalizationProvider>
            <TextField
              label="Tag"
              name="tag"
              value={selectedJob.tag}
              onChange={handleChange}
              disabled={isDetail}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {isDetail ? 'Close' : 'Cancel'}
          </Button>
          {!isDetail && (
            <Button
              onClick={() => {
                onUpdate(selectedJob.id, selectedJob);
                handleCloseDialog();
              }}
              color="primary"
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobTable;
