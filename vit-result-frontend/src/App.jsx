import { useState } from 'react';
import './App.css';

function App() {

  const [student, setStudent] = useState({
    studentName: '',
    registrationNumber: '',
    program: 'B.Tech CSE',
    semester: '5'
  });

  const [subjects, setSubjects] = useState([
    {
      subjectName: 'Web Technology',
      credits: 4,
      mse: '',
      ese: ''
    },
    {
      subjectName: 'DBMS',
      credits: 4,
      mse: '',
      ese: ''
    },
    {
      subjectName: 'Java',
      credits: 3,
      mse: '',
      ese: ''
    },
    {
      subjectName: 'Mathematics',
      credits: 3,
      mse: '',
      ese: ''
    }
  ]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStudentChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (index, field, value) => {

    const updatedSubjects = [...subjects];

    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };

    setSubjects(updatedSubjects);
  };

  const calculateResult = async (e) => {

    e.preventDefault();

    setError('');
    setResult(null);

    if (!student.studentName || !student.registrationNumber) {
      setError('Please enter student name and registration number.');
      return;
    }

    for (const subject of subjects) {

      if (
        subject.mse === '' ||
        subject.ese === ''
      ) {
        setError('Please enter MSE and ESE marks for all subjects.');
        return;
      }

      if (subject.mse < 0 || subject.mse > 30) {
        setError(`${subject.subjectName}: MSE must be between 0 and 30.`);
        return;
      }

      if (subject.ese < 0 || subject.ese > 70) {
        setError(`${subject.subjectName}: ESE must be between 0 and 70.`);
        return;
      }
    }

    const requestData = {
      ...student,
      subjects: subjects.map(subject => ({
        ...subject,
        mse: Number(subject.mse),
        ese: Number(subject.ese)
      }))
    };

    try {

      setLoading(true);

      const response = await fetch(
        'http://localhost:8080/api/results',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save result.');
      }

      const data = await response.json();

      setResult(data);

    } catch (err) {

      setError(
        'Unable to connect to Spring Boot backend. Make sure it is running on port 8080.'
      );

    } finally {

      setLoading(false);
    }
  };

  const calculateSGPA = () => {

    if (!result || !result.subjects) {
      return 0;
    }

    let totalCredits = 0;
    let weightedPoints = 0;

    result.subjects.forEach(subject => {

      totalCredits += subject.credits;

      weightedPoints +=
        subject.credits * subject.gradePoint;
    });

    return totalCredits === 0
      ? 0
      : (weightedPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="app">

      {/* Header */}

      <header className="header">

        <div className="container">

          <div className="header-content">

            <div>
              <h1>VIT Semester Result</h1>
              <p>Student Result Management System</p>
            </div>

            <div className="vit-logo">
              VIT
            </div>

          </div>

        </div>

      </header>


      <main className="container py-4">

        {/* Student Information */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h4>Student Information</h4>
          </div>

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label">
                  Student Name
                </label>

                <input
                  type="text"
                  name="studentName"
                  className="form-control"
                  placeholder="Enter student name"
                  value={student.studentName}
                  onChange={handleStudentChange}
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registrationNumber"
                  className="form-control"
                  placeholder="Enter registration number"
                  value={student.registrationNumber}
                  onChange={handleStudentChange}
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Program
                </label>

                <input
                  type="text"
                  name="program"
                  className="form-control"
                  value={student.program}
                  onChange={handleStudentChange}
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Semester
                </label>

                <select
                  name="semester"
                  className="form-select"
                  value={student.semester}
                  onChange={handleStudentChange}
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>

              </div>

            </div>

          </div>

        </div>


        {/* Subject Marks */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h4>Subject Marks</h4>
            <small>
              MSE: 30% &nbsp; | &nbsp; ESE: 70%
            </small>
          </div>

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-bordered align-middle">

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Credits</th>
                    <th>MSE / 30</th>
                    <th>ESE / 70</th>
                  </tr>

                </thead>

                <tbody>

                  {subjects.map((subject, index) => (

                    <tr key={index}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {subject.subjectName}
                        </strong>
                      </td>

                      <td>
                        {subject.credits}
                      </td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          max="30"
                          className="form-control"
                          value={subject.mse}
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              'mse',
                              e.target.value
                            )
                          }
                        />

                      </td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          max="70"
                          className="form-control"
                          value={subject.ese}
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              'ese',
                              e.target.value
                            )
                          }
                        />

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        {/* Calculate */}

        <div className="text-center mb-4">

          <button
            className="btn btn-primary btn-lg px-5"
            onClick={calculateResult}
            disabled={loading}
          >

            {loading
              ? 'Calculating...'
              : 'Calculate Result'}

          </button>

        </div>


        {/* Result */}

        {result && (

          <div className="card shadow result-card">

            <div className="card-header result-header">

              <h3>Semester Result</h3>

            </div>

            <div className="card-body">

              <div className="student-summary">

                <div>
                  <strong>Name:</strong>{' '}
                  {result.studentName}
                </div>

                <div>
                  <strong>Registration:</strong>{' '}
                  {result.registrationNumber}
                </div>

                <div>
                  <strong>Program:</strong>{' '}
                  {result.program}
                </div>

                <div>
                  <strong>Semester:</strong>{' '}
                  {result.semester}
                </div>

              </div>


              <div className="table-responsive mt-4">

                <table className="table table-bordered text-center">

                  <thead className="table-dark">

                    <tr>
                      <th>Subject</th>
                      <th>Credits</th>
                      <th>MSE</th>
                      <th>ESE</th>
                      <th>Final</th>
                      <th>Grade</th>
                      <th>Grade Point</th>
                    </tr>

                  </thead>

                  <tbody>

                    {result.subjects.map((subject) => (

                      <tr key={subject.id}>

                        <td className="text-start">
                          {subject.subjectName}
                        </td>

                        <td>
                          {subject.credits}
                        </td>

                        <td>
                          {subject.mse}
                        </td>

                        <td>
                          {subject.ese}
                        </td>

                        <td>
                          <strong>
                            {subject.finalMarks}
                          </strong>
                        </td>

                        <td>

                          <span className="grade-badge">
                            {subject.grade}
                          </span>

                        </td>

                        <td>
                          {subject.gradePoint}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              <div className="sgpa-box">

                <span>
                  Semester Grade Point Average
                </span>

                <strong>
                  {calculateSGPA()}
                </strong>

              </div>

            </div>

          </div>

        )}

      </main>


      <footer>

        <p>
          VIT Semester Result System
        </p>

      </footer>

    </div>
  );
}

export default App;