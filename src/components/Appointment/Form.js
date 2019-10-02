import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            value= {name}
            onChange = {(event) => setName(event.target.value)}
            type="text"
            placeholder="Enter Student Name"
            onSubmit={event => event.preventDefault()}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick = {() => {props.onCancel(); setName(""); setInterviewer(null) }}>Cancel</Button>
          <Button confirm onClick = {() => props.onSave({name, interviewer})}>Save</Button>
        </section>
      </section>
    </main>
)};