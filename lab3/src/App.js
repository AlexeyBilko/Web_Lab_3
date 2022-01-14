import { useEffect, useState } from 'react';
import './App.css';
import DeleteRow from './DeleteRow';


function App() {
  const [marks, setMarks] = useState([]);
  const [subject, setSubject] = useState("");
  const [mark, setMark] = useState(0);
  const [semester, setSemester] = useState(0);
  const [teacher, setTeacher] = useState("");

  const [error, setError] = useState(false);

  const operationsDoc = `
    query MyQuery {
      marks_marks {
        mark
        semester
        subject
        teacher
      }
    }
  `;

  useEffect(()=>{
    fetch(
      process.env.REACT_APP_TO_SEND,
      {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: {},
          operationName: "MyQuery"
        })
      }
    ).then(res => res.json()).then(
      (result) => {
          setMarks(result.data.marks_marks);
      }
    )
    .catch((excption) => {
      console.log("Error");
      setError(true);
    })
  })

  const handleAddLine = (event) => {
    event.preventDefault();
    let intMark = parseInt(mark);
    let intSemester = parseInt(semester);
    fetch(
      process.env.REACT_APP_TO_SEND,
      {
        method: "POST",
        body: JSON.stringify({
          query: `
            mutation MyMutation {
              insert_marks_marks(objects: {mark: ${intMark}, semester: ${intSemester}, subject: "${subject}", teacher: "${teacher}"}){
                returning {
                  id,
                  mark,
                  semester,
                  subject,
                  teacher
                }
              }
            }
          `,
          variables: {},
          operationName: "MyMutation"
        })
      }
    ).then(res => res.json())
    .then((result) => {
      console.log(result);
    })
    .catch((excption) => {
      console.log("Error");
      setError(true);
    })
    setMark(0);
    setSemester(0);
    setSubject("");
    setTeacher("");
  }

  return (
    <main>
    <div className="App">
        <form onSubmit={handleAddLine} id="msform">
            <fieldset>
                <h2 className="fs-title">Create New Line</h2>
                <input type="text" name="subject" placeholder="subject" value={subject} onChange={(e) => setSubject(e.target.value)}/>
                <input type="number" name="mark" placeholder="mark" value={mark} onChange={(e) => setMark(e.target.value)}/>
                <input type="number" name="semester" placeholder="semester" value={semester} onChange={(e) => setSemester(e.target.value)}/>
                <input type="text" name="teacher" placeholder="teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)}/>
                <input type="submit" name="next" className="next action-button" value="Add" />
            </fieldset>
        </form>
        <div style={{display: error ? "block" : "none" }} className="errorSend">
          <label>Fetch error</label>
        </div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Mark</th>
              <th>Semester</th>
              <th>Teacher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {marks.map(item => {
              return (
                <tr key={item.id}>
                  <td>{ item.subject }</td>
                  <td>{ item.mark }</td>
                  <td>{ item.semester }</td>
                  <td>{ item.teacher }</td>
                  <td><DeleteRow itemtodelete={item}></DeleteRow></td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
    </main>
  );
}

export default App;
