import React from "react";
//import { Link } from "react-router-dom";
import "./Home.scss";
import tasks from "../../assets/tasks.png";

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          <h2>Evidencija rada na grupnim projektima</h2>
          <p>Praćenje napretka na projektima na fakultetima ili u školama</p>
          <p>
            Kreiranje projekta od strane profesora<br></br>
            Dodavanje i raspodjela zadataka između studenata/učenika<br></br>
            Postavljanje urađenih zadataka i pregled aktivnosti članova
          </p>
          {/* <div className="hero-buttons --flex-start">
            <button className="--btn --btn-danger">
              <Link to={"/register"}>Register</Link>
            </button>
            <button className="--btn --btn-primary">
              <Link to={"/login"}>Login</Link>
            </button>
          </div> */}
        </div>

        <div className="hero-image">
          <img src={tasks} alt="Tasks" />
        </div>
      </section>
    </>
  );
};

export default Home;
