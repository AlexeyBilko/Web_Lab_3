const DeleteRow = (props) => {
    const HandleDelete = () => {
      let intSemester = parseInt(props.itemtodelete.semester);
      let subject = props.itemtodelete.subject;
      fetch(
        process.env.REACT_APP_TO_SEND,
        {
          method: "POST",
          body: JSON.stringify({
            query: `
              mutation MyMutation {
                delete_marks_marks(where: {subject: {_eq: "${subject}"}, _and: {semester: {_eq: ${intSemester}}}}) {
                  returning {
                    id
                    mark
                    semester
                    subject
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
    }


    return(
        <button onClick={HandleDelete}>Delete</button>
    )
};

export default DeleteRow;