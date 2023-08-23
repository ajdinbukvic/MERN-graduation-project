import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import "./CreateProject.scss";
import { createProject, RESET } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
//import { SpinnerImg } from "../../components/loader/Loader";*/

const initialStateProject = {
  title: "",
  subject: "",
  projectType: "",
  teamLeader: "",
};

const initialStateMembers = {
  firstMember: "",
  secondMember: "",
  thirdMember: "",
  fourthMember: "",
  fifthMember: "",
};

const CreateProject = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [project, setProject] = useState(initialStateProject);
  const { title, subject, projectType, teamLeader } = project;
  const [membersList, setMembersList] = useState(initialStateMembers);
  const { isLoggedIn, isSuccess } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMembersList({ ...membersList, [name]: value });
  };

  const saveProject = async (e) => {
    e.preventDefault();

    if (!title || !subject || !projectType || !teamLeader) {
      return toast.error("Sva polja su obavezna.");
    }

    const members = [];
    for (const [, value] of Object.entries(membersList)) {
      if (value !== "") members.push(value);
    }

    if (members.length < 1) {
      return toast.error("Morate dodati minimalno jednog člana.");
    }
    const projectData = {
      ...project,
      members,
    };

    await dispatch(createProject(projectData));
  };

  useEffect(() => {
    if (isLoggedIn && isSuccess) {
      navigate("/");
    }
    dispatch(RESET());
  }, [isSuccess, isLoggedIn, navigate, dispatch]);

  return (
    <>
      <section>
        <div className="container">
          <h3 className="--mt --text-center">Kreiranje novog projekta</h3>
          <div className="--flex-center add-item">
            <Card cardClass={"card"}>
              <form className="projectMargin" onSubmit={saveProject}>
                <div className="--flex-center projectGap">
                  <div>
                    <label>Naziv:</label>
                    <input
                      type="text"
                      placeholder="naziv"
                      name="title"
                      required
                      value={project?.title}
                      onChange={handleInputChange}
                    />
                    <label>Predmet:</label>
                    <input
                      type="text"
                      placeholder="predmet"
                      name="subject"
                      required
                      value={project?.subject}
                      onChange={handleInputChange}
                    />

                    <label>Tip projekta:</label>
                    <input
                      type="text"
                      placeholder="tip projekta"
                      name="projectType"
                      required
                      value={project?.projectType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Vođa tima:</label>
                    <input
                      type="email"
                      placeholder="email vođe tima"
                      name="teamLeader"
                      required
                      value={project?.teamLeader}
                      onChange={handleInputChange}
                    />

                    <label>Član #1:</label>
                    <input
                      type="email"
                      placeholder="email prvog člana"
                      name="firstMember"
                      value={membersList?.firstMember}
                      onChange={handleMemberChange}
                    />
                    <label>Član #2:</label>
                    <input
                      type="email"
                      placeholder="email drugog člana"
                      name="secondMember"
                      value={membersList?.secondMember}
                      onChange={handleMemberChange}
                    />
                    <label>Član #3:</label>
                    <input
                      type="email"
                      placeholder="email trećeg člana"
                      name="thirdMember"
                      value={membersList?.thirdMember}
                      onChange={handleMemberChange}
                    />
                    <label>Član #4:</label>
                    <input
                      type="email"
                      placeholder="email četvrtog člana"
                      name="fourthMember"
                      value={membersList?.fourthMember}
                      onChange={handleMemberChange}
                    />
                    <label>Član #5:</label>
                    <input
                      type="email"
                      placeholder="email petog člana"
                      name="fifthMember"
                      value={membersList?.fifthMember}
                      onChange={handleMemberChange}
                    />
                  </div>
                </div>
                <div className="--my">
                  <button
                    type="submit"
                    className="--btn --btn-success --center-all"
                  >
                    Kreiraj projekat
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

export default CreateProject;
