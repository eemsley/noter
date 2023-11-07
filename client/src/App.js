import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Create from "./screens/Create";
import Home from "./screens/Home";
import Note from "./screens/Note";
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNotes from "./screens/MyNotes";
import Account from "./screens/Account";
import SharedWithMe from "./screens/SharedWithMe";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {<Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/note/:id" element={<Note />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/myNotes" element={<MyNotes />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/sharedWithMe" element={<SharedWithMe />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
