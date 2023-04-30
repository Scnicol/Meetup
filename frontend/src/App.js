import React, { useState, useEffect } from "react";
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

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/groups">
            <Groups/>
          </Route>
          <Route exact path="/events">
            <Events/>
          </Route>
          <Route exact path="/groups/new">
            <CreateGroupForm/>
          </Route>
          <Route path="/groups/:id">
            <UpdateGroupForm/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
