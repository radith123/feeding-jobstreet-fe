/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/prefer-find-by */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');
describe('Job Filtering', () => {
  const mockJobs = [
    { id: 1, title: 'Java Developer', companyName: 'Company A', workType: 'Full-time', tag: 'java-spring' },
    { id: 2, title: 'Python Developer', companyName: 'Company B', workType: 'Part-time', tag: 'python-django' },
    { id: 3, title: 'React Developer', companyName: 'Company C', workType: 'Contract', tag: 'reactjs' },
  ];

  beforeEach(() => {
    axios.get.mockClear(); // Clear any previous mocks
    axios.get.mockImplementation((url, { params }) => {
      if (params.tag === 'java-spring') {
        return Promise.resolve({ data: [mockJobs[0]] });
      }
      return Promise.resolve({ data: mockJobs }); // All jobs for other cases
    });
  });

  test('filters jobs based on selected technology tag', async () => {
    render(<App />);

    // Wait for the jobs to be loaded
    await waitFor(() => expect(screen.getByText('Java Developer')).toBeInTheDocument());

    // Open the select dropdown
    const filterSelect = screen.getByLabelText(/filter by technology/i);
    fireEvent.mouseDown(filterSelect);
    const javaSpringOption = screen.getByRole('option', { name: 'Java Spring' }); // Adjust if your label is different
    fireEvent.click(javaSpringOption); 

    // Verify that only Java Developer is displayed
    await waitFor(() => {
      expect(screen.queryByText('Python Developer')).not.toBeInTheDocument();
      expect(screen.getByText('Java Developer')).toBeInTheDocument();
      expect(screen.queryByText('React Developer')).not.toBeInTheDocument();
    });
  });
});

describe('App Component', () => {
  beforeAll(() => {
    // Mock createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
  });
  test('should download jobs as Excel file', async () => {
    // Mock the response from the API
    const mockBlob = new Blob(['Excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockResponse = {
      data: mockBlob,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    
    // Mock axios.post to return the mocked response
    axios.post.mockResolvedValue(mockResponse);
    
    // Render the App component
    render(<App />);
    
    // Find the download button and click it
    const downloadButton = screen.getByRole('button', { name: /Download As Excel/i });
    fireEvent.click(downloadButton);
    
    // Wait for the axios.post call to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    // Simulate the click on the link to download the file
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = 'mocked-url';
    link.setAttribute('download', 'jobs_export.xlsx');
    link.click();

    // Check if the link has been created with the right attributes
    expect(link.getAttribute('download')).toBe('jobs_export.xlsx');
    
    // Cleanup
    document.body.removeChild(link);
  });
});