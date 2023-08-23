import React from "react";
import "./Home.scss";
import tasks from "../../assets/tasks.png";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";
import ProjectList from "../projectList/ProjectList";

const Home = () => {
  return (
    <>
      <ShowOnLogout>
        <section className="container hero">
          <div className="hero-text">
            <h2>Evidencija rada na grupnim projektima</h2>
            <p>Praćenje napretka na projektima na fakultetima ili u školama</p>
            <p>
              Kreiranje projekta od strane profesora<br></br>
              Dodavanje i raspodjela zadataka između studenata/učenika<br></br>
              Postavljanje urađenih zadataka i pregled aktivnosti članova
            </p>
          </div>
          <div className="hero-image">
            <img src={tasks} alt="Tasks" />
          </div>
        </section>
      </ShowOnLogout>
      <ShowOnLogin>
        <ProjectList />
      </ShowOnLogin>
    </>
  );
};

export default Home;
