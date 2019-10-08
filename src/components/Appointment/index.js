import React from 'react'
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "../../hooks/useVisualMode"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import Error from "components/Appointment/Error"

import "components/Appointment/styles.scss";



export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT"
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function confirm() {
    transition(CONFIRM);
  }

  function deletes() {
    transition(DELETING, true)
    props
    .cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))
  };

  function edit() {
    transition(EDIT)
  }
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={(event) => {transition(CREATE)}} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          Delete={confirm}
          onEdit={edit}
        />)}
      {mode === SAVING && (
        <Status message="SAVING"/>
      )}
      {mode === ERROR_DELETE && (
        <Error 
          onClose={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
          onClose={back}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          interview={props.bookInterview}
          />)}
      
      {mode === DELETING && (
        <Status message="DELETING" />
      )}
      {mode === CONFIRM && (
        <Confirm 
        onCancel={back}
        onConfirm={deletes}
        message="Are you sure u wanna delete?" />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          interview={props.bookInterview}
          />)}
    </article>
)};
