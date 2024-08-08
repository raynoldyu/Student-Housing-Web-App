import * as React from 'react';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import ListingView from '../listing/listingView';
import ResponsiveAppBar from '../Navigation/appBar';
import StudentListView from './studentListView';

import { useUserAuth } from '../../contexts/AuthContext';
import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import { calculateAverageSimilarity } from '../../calculations/groupSimilarity';
import StudentFilterBar from './FilterBar/studentFilterBar';

const LandlordHome = () => {

  const { students, userData, setStudents, filteredStudents, setFilteredStudents, fetchStudentData } = useUserAuth()
  
  const theme = useTheme();


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let studentData = students;

        if (studentData.length === 0) {
          studentData = await fetchStudentData();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const studentData = await fetchStudentData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userData]);

  


  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <ResponsiveAppBar />
      
      <StudentListView students={students} />
    </div>
  );
};

export default memo(LandlordHome);
