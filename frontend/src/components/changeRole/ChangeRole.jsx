import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUsers, updateUserRole } from "../../redux/features/auth/authSlice";

const ChangeRole = ({ _id }) => {
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  // Upgrade User
  const changeUserRole = async (e, _id, userRole) => {
    e.preventDefault();
    // console.log(userRole + _id);
    if (!userRole) {
      return toast.error("Morate prvo odabrati ulogu.");
    }

    const userData = {
      role: userRole,
      id: _id,
    };

    await dispatch(updateUserRole(userData));
    await dispatch(getUsers());
    setUserRole("-- odaberite --");
  };

  return (
    <div className="sort">
      <form
        className="--flex-start"
        onSubmit={(e) => changeUserRole(e, _id, userRole)}
      >
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="">-- odaberite --</option>
          <option value="student">Student</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="--btn --btn-primary" type="submit">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeRole;
