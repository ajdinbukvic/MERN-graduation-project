import React, { useEffect, useState } from "react";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import {
  updateProject,
  getProjects,
  RESET,
} from "../../redux/features/auth/authSlice";
import "../userList/UserList.scss";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactPaginate from "react-paginate";

const ProjectList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { projects, isLoading, isError, isSuccess, message, user } =
    useSelector((state) => state.auth);
  const currentUser = user;

  const updateProjectStatus = async (id, status) => {
    const projectData = {
      id,
      status,
    };
    await dispatch(updateProject(projectData));
    dispatch(getProjects());
  };

  const confirmUpdateProject = (id, status) => {
    confirmAlert({
      title: "Promjena statusa",
      message:
        "Da li ste sigurni da želite promijeniti status odabranog projekta?",
      buttons: [
        {
          label: "Promijeni",
          onClick: () => updateProjectStatus(id, status),
        },
        {
          label: "Zatvori",
        },
      ],
    });
  };

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      // toast.success("User Profile Fetched");
      // console.log(users);
    }

    dispatch(RESET());
  }, [isError, isSuccess, message, dispatch, projects]);

  // //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(projects.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(projects.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, projects]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % projects.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  return (
    <section>
      <div className="container">
        <div className="user-list">
          {isLoading && <SpinnerImg />}

          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>Moji projekti</h3>
              </span>
              {currentUser.role === "profesor" ? (
                <span>
                  <button className="--btn --btn-success">
                    <Link to="/createProject">Kreiraj novi projekat</Link>
                  </button>
                </span>
              ) : (
                ""
              )}
            </div>
            {!isLoading && projects.length === 0 ? (
              <p>Trenutno nema projekata.</p>
            ) : (
              <table className="marginTopTable">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Naziv</th>
                    <th>Predmet</th>
                    <th>Tip</th>
                    <th>Pregled</th>
                    {currentUser.role === "profesor" ? (
                      <th>Promijeni status</th>
                    ) : (
                      ""
                    )}
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((project) => {
                    const { _id, title, subject, projectType, isActive } =
                      project;

                    return (
                      <tr key={_id}>
                        {isActive ? (
                          <td className="--btn-status--active">Aktivan</td>
                        ) : (
                          <td className="--btn-status">Neaktivan</td>
                        )}
                        <td>{title}</td>
                        <td>{subject}</td>
                        <td>{projectType}</td>
                        <td>
                          <button className="--btn --btn-primary">
                            <Link to={`/project/${_id}/active`}>Otvori</Link>
                          </button>
                        </td>
                        {currentUser.role === "profesor" ? (
                          <td className="icons --center-all">
                            <span>
                              {isActive ? (
                                <HiLockClosed
                                  size={20}
                                  color={"red"}
                                  onClick={() =>
                                    confirmUpdateProject(_id, false)
                                  }
                                />
                              ) : (
                                <HiLockOpen
                                  size={20}
                                  color={"green"}
                                  onClick={() =>
                                    confirmUpdateProject(_id, true)
                                  }
                                />
                              )}
                            </span>
                          </td>
                        ) : (
                          ""
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <hr />
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Sljedeća"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="Prethodna"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="activePage"
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
