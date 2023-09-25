import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SpinnerImg } from "../../components/loader/Loader";
import TaskMenu from "../../components/pageMenu/TaskMenu";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import {
  getProject,
  getMemberStats,
  RESET,
} from "../../redux/features/auth/authSlice";
import "../userList/UserList.scss";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useParams } from "react-router-dom";

const MemberStats = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { stats, isLoading, isError, isSuccess, message, project } =
    useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProject(projectId));
    dispatch(getMemberStats(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(RESET());
  }, [isError, isSuccess, message, dispatch, stats]);

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    setCurrentItems(stats);
  }, [stats]);

  return (
    <section>
      <div className="container">
        <TaskMenu id={projectId} />

        <div className="user-list">
          {isLoading && <SpinnerImg />}

          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>Aktivnost članova na projektu</h3>
              </span>
            </div>
            {/* {!isLoading && stats.length === 0 ? (
              <p>Trenutno nema statistike za prikaz.</p>
            ) : ( */}
            <table className="marginTopTable">
              <thead>
                <tr>
                  <th>Ime i prezime</th>
                  <th>Email</th>
                  <th>Uloga</th>
                  <th>Dodijeljeni</th>
                  <th>Predati</th>
                  <th>Nedostaju</th>
                </tr>
              </thead>

              <tbody>
                <tr key={project?.teamLeaderId?._id}>
                  <td>{project?.teamLeaderId?.name}</td>
                  <td>{project?.teamLeaderId?.email}</td>
                  <td>Vođa tima</td>
                  {currentItems.length ? (
                    currentItems.map((item) => {
                      const { _id, dodijeljen, predat, nedostaje } = item;
                      if (_id === project?.teamLeaderId?._id)
                        return (
                          <>
                            <td>{dodijeljen}</td>
                            <td>{predat}</td>
                            <td>{nedostaje}</td>
                          </>
                        );
                    })
                  ) : (
                    <>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </>
                  )}
                </tr>

                {project?.members?.map((item) => {
                  const { _id, name, email } = item;
                  return (
                    <tr key={_id}>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>Član</td>
                      {currentItems.length ? (
                        currentItems.map((item) => {
                          const { dodijeljen, predat, nedostaje } = item;
                          if (_id === item._id)
                            return (
                              <>
                                <td>{dodijeljen}</td>
                                <td>{predat}</td>
                                <td>{nedostaje}</td>
                              </>
                            );
                        })
                      ) : (
                        <>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* )} */}
            <hr />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberStats;
