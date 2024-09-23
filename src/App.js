import React, { useState, useEffect } from 'react';
import JobTable from './component/tableCom';
import { 
  Button, 
  Box, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText, } from '@mui/material';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FaSpinner } from 'react-icons/fa';

function App() {
  const [jobs, setJobs] = useState([]);
  const [tag, setTag] = useState('');  // Default empty tag
  const [tagScrape, setTagScrape] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: '',
    workType: '',
    location: '',
    salary: '',
    benefit: '',
    listingDate: '',
    tag: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleOpenGenerate = () => {
    setOpenGenerate(true);
  };

  const handleCloseGenerate= () => {
    setOpenGenerate(false);
    setTagScrape('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewJob({
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
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setNewJob((prevJob) => ({
      ...prevJob,
      listingDate: newDate,
    }));
  };

  // Technology filter options
  const techOptions = [
    { label: 'Java Spring', value: 'java-spring' },
    { label: 'Python Django', value: 'python-django' },
    { label: 'Python Flask', value: 'python-flask' },
    { label: 'NodeJs Express', value: 'nodejs-express' },
    { label: 'NodeJs Nest', value: 'nodejs-nest' },
    { label: '.Net Core', value: 'dotnet-core' },
    { label: 'Angular', value: 'angular' },
    { label: 'Reactjs', value: 'reactjs' },
    { label: 'React Native', value: 'react-native' },
    { label: 'Flutter', value: 'flutter' },
  ];

  // Fetch job data based on the tag filter
  const fetchJobs = async (filterTag = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/job', {
        params: { tag: filterTag },
      });
      console.log(`filter tag : ${filterTag}`)
      console.log(response);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onScrape = async (tagS) => {
    try {
      const response = await axios.get(`http://localhost:3000/job/scrape/${tagS}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
      if (response.status === 200) {
        console.log('Job Scraped successfully', response.data);
        setTag('');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error Scraping jobs:', error);
    } 
  };

  const handleDownload = async (filterTag = '') => {
    try {
      const response = await axios.post(`http://localhost:3000/job/export?tag=${(filterTag)}`, 
        { tag: filterTag },
        {
          responseType: 'blob', // Ensure the response is a Blob (binary data)
        }
      );
  
      // Create a URL for the Blob
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'jobs_export.xlsx'); 
      document.body.appendChild(link);
      link.click();
  
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting jobs:', error);
    }
  };

  const onCreate = async (jobData) => {
    try {
      const newJobData = {
        ...jobData,
        benefit: jobData.benefit.split(', ').map(item => item.trim())
      };
      const response = await axios.post(`http://localhost:3000/job`, newJobData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
      if (response.status === 201) {
        console.log('Job Created successfully', response.data);
        setTag('');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error updating job:', error);
      // Handle the error, possibly display an error message
    }
  };

  const onUpdate = async (jobId, jobData) => {
    try {
      const updatedJobData = {
        ...jobData,
        benefit: jobData.benefit.split(', ').map(item => item.trim())
      };
      const response = await axios.put(`http://localhost:3000/job/${jobId}`, updatedJobData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
      if (response.status === 200) {
        console.log('Job updated successfully', response.data);
        setTag('');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error updating job:', error);
      // Handle the error, possibly display an error message
    }
  };

  const onDelete = async (jobId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/job/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
      if (response.status === 204) {
        console.log('Job deleted successfully', response.data);
        setTag('');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error updating job:', error);
      // Handle the error, possibly display an error message
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};

  useEffect(() => {
    fetchJobs(tag);
  }, [tag]);

  // Handle dropdown change
  const handleFilterChange = (e) => {
    setTag(e.target.value);
    fetchJobs(tag);
  };

  const handleFilterScrapeChange = (e) => {
    setTagScrape(e.target.value);
  };

  return (
    <div className="m-5">
      <Box
        display="flex"
        justifyContent="left"
        alignItems="left"
        mb={4}
        sx={{
          backgroundColor: '#1976d2', // Material UI primary color
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          color: '#fff',
        }}
      >
        <Box
          display="inline-block"
          sx={{
            backgroundColor: '#fff', // White background
            padding: '10px 20px', // Padding for the box
            borderRadius: '32px', // Rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for depth
            textAlign: 'center',
          }}
        >
        <Typography variant="h5" component="h5" color="textPrimary" fontWeight="bold">
          Feeding Data Jobstreet
        </Typography>
        </Box>
      </Box>

      {/* Filter Section */}
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 200 }}>
          <InputLabel id="technology-filter-label">Filter by Technology</InputLabel>
          <Select
            id="technology-filter-label"
            value={tag}
            onChange={handleFilterChange}
            label="Filter by Technology"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {techOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"

            onClick={() => handleOpenGenerate()}
          >
            Generate Job
          </Button>

          <Button
            variant="contained"
            color="primary"

            onClick={() => handleOpenDialog()}
          >
            Create Job
          </Button>
          <Button
            variant="contained"
            color="primary"

            onClick={() => handleDownload(tag)}
          >
            Download As Excel
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <FaSpinner className="spinner" size={24} />
        </div>
      ) : (
        <JobTable
          jobs={jobs}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onDetail={(id) => alert(`Show details for job with ID: ${id}`)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{'Create Job'}</DialogTitle>
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
              value={newJob.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company Name"
              name="companyName"
              value={newJob.companyName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Work Type"
              name="workType"
              value={newJob.workType}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={newJob.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={newJob.salary}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Benefit"
              name="benefit"
              value={newJob.benefit}
              onChange={handleChange}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Listing Date"
              value={newJob.listingDate ? new Date(newJob.listingDate) : null}
              onChange={(newDate) => handleDateChange(newDate)}
              slots={{ textField: (params) => <TextField {...params} /> }}
            />
          </LocalizationProvider>
            <TextField
              label="Tag"
              name="tag"
              value={newJob.tag}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {'Cancel'}
          </Button>
            <Button
              onClick={() => {
                onCreate( newJob );
                handleCloseDialog();
              }}
              color="primary"
            >
              Create
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openGenerate} onClose={handleCloseGenerate}>
        <DialogTitle>{'Generate Job'}</DialogTitle>
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
            <DialogContentText>
              Generate Job by scraping data. Choose a tag to srape job with that tag. 
            </DialogContentText>
            <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 200 }}>
              <InputLabel>Tag to Scrape</InputLabel>
              <Select
                value={tagScrape}
                onChange={handleFilterScrapeChange}
                label="Tag to Scrape"
              >
                {techOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>  
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerate} color="primary">
            {'Cancel'}
          </Button>
            <Button
              onClick={() => {
                onScrape( tagScrape );
                handleCloseGenerate();
              }}
              color="primary"
            >
              Generate
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;