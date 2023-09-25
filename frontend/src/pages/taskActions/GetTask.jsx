import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import "../createProject/CreateProject.scss";
import {
  getTask,
  getProject,
  RESET,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
//import { SpinnerImg } from "../../components/loader/Loader";*/
import { useParams } from "react-router-dom";

const GetTask = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { projectId, id } = useParams();
  const { task } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTask({ projectId, id }));
    dispatch(getProject(projectId));
    dispatch(RESET());
  }, [dispatch, projectId, id]);

  return (
    <>
      <section>
        <div className="container">
          <h3 className="--mt --text-center">Prikaz urađenog zadatka</h3>
          <div className="add--item">
            <Card cardClass={"card"}>
              <form>
                <label>Naziv:</label>
                <input
                  type="text"
                  placeholder="naziv"
                  name="title"
                  required
                  disabled
                  value={task?.title}
                />
                <label>Datum kreiranja:</label>
                <input
                  type="date"
                  placeholder="datumkreiranja"
                  name="createdAt"
                  required
                  disabled
                  value={task?.createdAt?.split("T")[0]}
                />
                <label>Rok za predaju:</label>
                <input
                  type="date"
                  placeholder="datumzapredaju"
                  name="deadline"
                  required
                  disabled
                  value={task?.deadline?.split("T")[0]}
                />
                <label>Datum završetka:</label>
                <input
                  type="date"
                  placeholder="datumzavrsetka"
                  name="endDate"
                  required
                  disabled
                  value={task?.endDate ? task?.endDate?.split("T")[0] : ""}
                />
                <label>Student:</label>
                <input
                  type="text"
                  placeholder="student"
                  name="assigned"
                  required
                  disabled
                  value={task?.assignedId?.name}
                />
                <label>Opis urađenog:</label>
                <textarea
                  type="text"
                  placeholder="opis"
                  name="description"
                  rows="10"
                  required
                  disabled
                  value={task?.description}
                />
                <label>Prilozi:</label>
                {task.attachments.map((attachment, index) => {
                  return (
                    <>
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attachment}
                      </a>
                      <br></br>
                    </>
                  );
                })}
              </form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetTask;
