import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SpinnerImg } from "../../components/loader/Loader";
import TaskMenu from "../../components/pageMenu/TaskMenu";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { getTasks, RESET } from "../../redux/features/auth/authSlice";
import "../userList/UserList.scss";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";

const MissingTasks = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { tasks, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getTasks({ projectId, filter: "nedostaje" }));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(RESET());
  }, [isError, isSuccess, message, dispatch, tasks]);

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(tasks.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(tasks.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, tasks]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % tasks.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  return (
    <section>
      <div className="container">
        <TaskMenu id={projectId} />

        <div className="user-list">
          {isLoading && <SpinnerImg />}

          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>Zadaci koji nisu urađeni</h3>
              </span>
            </div>
            {!isLoading && tasks.length === 0 ? (
              <p>Trenutno nema neurađenih zadataka.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>R. br.</th>
                    <th>Naziv zadatka</th>
                    <th>Dodijeljen studentu</th>
                    <th>Datum kreiranja</th>
                    <th>Rok za predaju</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((task, index) => {
                    const { _id, title, deadline, assignedId, createdAt } =
                      task;

                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{title}</td>
                        <td>{assignedId.name}</td>
                        <td>
                          {createdAt
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join(".")}
                        </td>
                        <td>
                          {deadline
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join(".")}
                        </td>
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

export default MissingTasks;
