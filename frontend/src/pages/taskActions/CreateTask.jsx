import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import "../createProject/CreateProject.scss";
import {
  createTask,
  getProject,
  RESET,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
//import { SpinnerImg } from "../../components/loader/Loader";*/
import { useParams } from "react-router-dom";

const initialStateTask = {
  title: "",
  deadline: "",
};

const CreateTask = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [task, setTask] = useState(initialStateTask);
  const { title, deadline } = task;
  const { isLoggedIn, isSuccess, project, message } = useSelector(
    (state) => state.auth
  );
  const [assignedId, setAssignedId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const saveTask = async (e) => {
    e.preventDefault();

    if (!title || !deadline) {
      return toast.error("Sva polja su obavezna.");
    }

    if (!assignedId) {
      return toast.error("Morate prvo odabrati člana.");
    }

    const taskData = {
      data: {
        ...task,
        assignedId,
      },
      projectId,
    };

    await dispatch(createTask(taskData));
  };

  useEffect(() => {
    dispatch(getProject(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (isLoggedIn && isSuccess && message === "success") {
      navigate(`/project/${projectId}/active`);
    }
    dispatch(RESET());
  }, [isSuccess, isLoggedIn, navigate, dispatch, projectId, message]);

  return (
    <>
      <section>
        <div className="container">
          <h3 className="--mt --text-center">Kreiranje novog zadatka</h3>
          <div className="add--item">
            <Card cardClass={"card"}>
              <form onSubmit={saveTask}>
                <label>Naziv:</label>
                <input
                  type="text"
                  placeholder="naziv"
                  name="title"
                  required
                  value={task?.title}
                  onChange={handleInputChange}
                />
                <label>Rok za predaju:</label>
                <input
                  type="date"
                  placeholder="datum"
                  name="deadline"
                  required
                  value={task?.deadline}
                  onChange={handleInputChange}
                />
                <label>Odaberite člana:</label>
                <select
                  value={assignedId}
                  onChange={(e) => setAssignedId(e.target.value)}
                >
                  <option value="">-- odaberite --</option>
                  <option value={project.teamLeaderId._id}>
                    {project.teamLeaderId.name}
                  </option>
                  {project.members.map((member) => {
                    const { _id, name } = member;

                    return (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                <div className="--my">
                  <button
                    type="submit"
                    className="--btn --btn-success --center-all"
                  >
                    Kreiraj zadatak
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

export default CreateTask;
