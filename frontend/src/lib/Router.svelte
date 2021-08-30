<script lang="ts">
<<<<<<< HEAD
  import Loading from "../routes/Loading.svelte";
  import Login from "../routes/Login.svelte";
  import Home from "../routes/Home.svelte";
  import Credentials from "../routes/Credentials.svelte";
  import Presentations from "../routes/Presentations.svelte";
  import Messages from "../routes/Messages.svelte";
  import Contacts from "../routes/Contacts.svelte"
  import Identities from "../routes/Identities.svelte";
  import Logout from "../routes/Logout.svelte";

  import { Router, Route } from "svelte-navigator";
  import AuthGuard from "./AuthGuard.svelte";
=======
import Loading from "../routes/Loading.svelte";
import Login from "../routes/Login.svelte";
import Home from "../routes/Home.svelte";
import Credentials from "../routes/Credentials.svelte";
import Presentations from "../routes/Presentations.svelte";
import Messages from "../routes/Messages.svelte";
import Connections from "../routes/Connections.svelte";
import Identities from "../routes/Identities.svelte";
import Logout from "../routes/Logout.svelte";

import { Router, Route } from "svelte-navigator";
import AuthGuard from "./AuthGuard.svelte";
>>>>>>> origin/main
</script>

<AuthGuard>
  <Router slot="not_authed">
<<<<<<< HEAD
    <Route path="">
=======
    <Route path="/">
>>>>>>> origin/main
      <Login />
    </Route>
    <Route path="login">
      <Login />
    </Route>
  </Router>
  <Router slot="authed">
    <Route path="">
      <Loading />
    </Route>

    <Route path="">
      <Home />
    </Route>

    <Route path="credentials">
      <Credentials />
    </Route>

    <Route path="presentations">
      <Presentations />
    </Route>

    <Route path="messages">
      <Messages />
    </Route>

    <Route path="connections">
      <Contacts />
    </Route>

    <Route path="identities">
      <Identities />
    </Route>

    <Route path="logout">
      <Logout />
    </Route>
  </Router>
</AuthGuard>
