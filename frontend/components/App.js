import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null); // store article_id
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    setTimeout(() => {
      redirectToLogin();
    }, 0);
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = async ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const res = await axios.post(loginUrl, { username, password });
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      redirectToArticles();
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  const getArticles = async () => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const res = await axios.get(articlesUrl, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setArticles(res.data.articles);
      setMessage(`Here are your articles, Foo!`); // success message
    } catch (err) {
      if (err.response?.status === 401) {
        redirectToLogin();
      }
      setMessage(err.response?.data?.message || "Failed to fetch articles");
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  };

  const postArticle = async (article) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const res = await axios.post(articlesUrl, article, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setArticles([...articles, res.data.article]);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "failed to create article");
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = async ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const res = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setArticles(
        articles.map((a) =>
          a.article_id === article_id ? res.data.article : a
        )
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update article");
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // You got this!
  };

  const deleteArticle = async (article_id) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const res = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setArticles(articles.filter((a) => a.article_id !== article_id));
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete article");
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
  };

  // Helper to get current article object for ArticleForm
  const currentArticle =
    currentArticleId != null
      ? articles.find((a) => a.article_id === currentArticleId)
      : null;

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
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
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticle={currentArticle} // FIXED: pass article object
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}
