import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import Student from './student';
import StudentFilterBar from './FilterBar/studentFilterBar';
import Pagination from '@mui/material/Pagination';

const StudentListView = ({ students }) => {

  const [filteredStudents, setFilteredStudents] = React.useState([])
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState([]);
  const studentsPerPage = 10;

  React.useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  React.useEffect(() => {
    let numPages = Math.ceil(filteredStudents.length / 10)
    setTotalPages(numPages)
  }, [filteredStudents])



  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  

  return (
    <Box sx={{ flexGrow: 1 }} style={{ background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50px' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </div>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={4}>
          <StudentFilterBar students={students} setFilteredStudents={setFilteredStudents}/>
        </Grid>
        <Grid container xs={12}>
          {filteredStudents?.map((student) => (
            <Grid item xs={8} sm={8} md={8} key={student.userID}>
              <Student student={student} />
            </Grid>
          ))}
        </Grid>
      </Grid>


    </Box>
  );
};

export default StudentListView;
