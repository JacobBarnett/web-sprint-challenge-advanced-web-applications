import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import getAxiosWithAuth from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/", { replace: true });
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles", { replace: true });
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setMessage("Goodbye!");
    window.localStorage.setItem("token", "");
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    const response = await axios.post("http://localhost:9000/api/login", {
      username,
      password,
    });
    console.log(response);
    window.localStorage.setItem("token", response.data.token);
    setMessage(response.data.message);
    redirectToArticles();
    setSpinnerOn(false);
  };

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    const response = await getAxiosWithAuth().get(
      "http://localhost:9000/api/articles"
    );
    setArticles(response.data.articles);
    setMessage(response.data.message);
    setSpinnerOn(false);
  };

  const postArticle = async (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    let response;

    response = await getAxiosWithAuth().post(
      `http://localhost:9000/api/articles`,
      article
    );
    setArticles([...articles, response.data.article]);
    setMessage(response.data.message);
    setSpinnerOn(false);
  };

  const updateArticle = async ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    let response;

    response = await getAxiosWithAuth().put(
      `http://localhost:9000/api/articles/${article_id}`,
      article
    );
    const newArticles = articles.map((art) => {
      if (art.article_id === article_id) {
        return response.data.article;
      }
      return art;
    });
    setArticles(newArticles);
    setMessage(response.data.message);
    setSpinnerOn(false);
  };

  const deleteArticle = async (article_id) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    let response;

    response = await getAxiosWithAuth().delete(
      `http://localhost:9000/api/articles/${article_id}`
    );
    const newArticles = articles.filter((art) => {
      return art.article_id !== article_id;
    });
    setArticles(newArticles);
    setMessage(response.data.message);
    setSpinnerOn(false);
  };

  const currentArticle = articles.find(
    (art) => art.article_id === currentArticleId
  );
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm onLogin={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticle={currentArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                />
                <Articles
                  getArticles={getArticles}
                  articles={articles}
                  redirectToLogin={redirectToLogin}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                  deleteArticle={deleteArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}
