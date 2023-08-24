import React, { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";
import "../createProject/CreateProject.scss";
import { toast } from "react-toastify";
import {
  getTask,
  getProject,
  updateTask,
  RESET,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
//import { SpinnerImg } from "../../components/loader/Loader";*/
import { useParams } from "react-router-dom";

const initialStateTask = {
  description: "",
  attachmentsText: "",
};

const UpdateTask = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId, id } = useParams();
  const [taskData, setTaskData] = useState(initialStateTask);
  const { description, attachmentsText } = taskData;
  const { task, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const taskUpdate = async (e) => {
    e.preventDefault();

    if (!description || !attachmentsText) {
      return toast.error("Sva polja su obavezna.");
    }

    const newTaskData = {
      data: {
        description: taskData.description,
        attachments: taskData.attachmentsText.split("\n"),
      },
      projectId,
      id,
    };

    await dispatch(updateTask(newTaskData));
  };

  useEffect(() => {
    dispatch(getTask({ projectId, id }));
    dispatch(getProject(projectId));
    dispatch(RESET());
  }, [dispatch, projectId, id]);

  useEffect(() => {
    if (isLoggedIn && isSuccess && message === "success") {
      navigate(`/project/${projectId}/completed`);
    }
    dispatch(RESET());
  }, [isSuccess, isLoggedIn, navigate, dispatch, projectId, message]);

  return (
    <>
      <section>
        <div className="container">
          <h3 className="--mt --text-center">Prikaz zadatka za predaju</h3>
          <div className="add--item">
            <Card cardClass={"card"}>
              <form onSubmit={taskUpdate}>
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
                  value={task?.createdAt.split("T")[0]}
                />
                <label>Rok za predaju:</label>
                <input
                  type="date"
                  placeholder="datumzapredaju"
                  name="deadline"
                  required
                  disabled
                  value={task?.deadline.split("T")[0]}
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
                <label>Opis:</label>
                <textarea
                  type="text"
                  placeholder="opis"
                  name="description"
                  rows="10"
                  required
                  value={taskData?.description}
                  onChange={handleInputChange}
                />
                <label>Prilozi:</label>
                <textarea
                  type="text"
                  placeholder="prilozi"
                  name="attachmentsText"
                  rows="4"
                  required
                  value={taskData?.attachmentsText}
                  onChange={handleInputChange}
                />
                <div className="--my">
                  <button
                    type="submit"
                    className="--btn --btn-success --center-all"
                  >
                    Označi zadatak kao završen
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateTask;
