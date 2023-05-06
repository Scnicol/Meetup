import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Groups from "./components/Groups";
import Events from "./components/Events";
import CreateGroupForm from "./components/Groups/createGroupForm";
import UpdateGroupForm from "./components/Groups/updateGroupForm";
import GroupDetail from "./components/Groups/groupDetail";
import HomePage from "./components/HomePage";
import EventDetails from "./components/Events/EventDetail";
import UpdateEventForm from "./components/Events/UpdateEventForm";
import CreateEventForm from "./components/Events/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));


  }, [dispatch]);

  return (
    <>
    <Helmet>
      <title>Meet-Up</title>
    </Helmet>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/events">
            <Events />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroupForm />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <CreateEventForm />
          </Route>
          <Route path="/groups/:groupId/edit">
            <UpdateGroupForm />
          </Route>
          <Route path="/groups/:groupId">
            <GroupDetail />
          </Route>
          <Route path="/events/:eventId/edit">
            <UpdateEventForm />
          </Route>
          <Route path="/events/:eventId">
            <EventDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
