import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { RESET, verifyEmail } from "../../redux/features/auth/authSlice";

const Verify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { verificationToken } = useParams();
  const { isLoading } = useSelector((state) => state.auth);

  const { isSuccess } = useSelector((state) => state.auth);
  const verifyAccount = async () => {
    await dispatch(verifyEmail(verificationToken));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
    dispatch(RESET());
  }, [isSuccess, navigate, dispatch]);

  return (
    <section>
      <div className="container">
        {isLoading && <Loader />}
        <div className="--center-all">
          <h2>Verifikacija korisničkog profila</h2>
          <p>
            Da potvrdite vašu email adresu i nastavite koristiti aplikaciju
            kliknite dugme ispod.
          </p>
          <br />

          <button className="--btn --btn-primary" onClick={verifyAccount}>
            Potvrdi verifikaciju
          </button>
        </div>
      </div>
    </section>
  );
};

export default Verify;
