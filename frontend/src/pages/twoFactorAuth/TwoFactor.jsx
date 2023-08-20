import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../services/axiosPrivate";
import Modal from "../../components/modal/Modal";
import PageMenu from "../../components/pageMenu/PageMenu";
import { disableOTP, RESET } from "../../redux/features/auth/authSlice";

const TwoFactor = () => {
  const dispatch = useDispatch();

  const [secret, setSecret] = useState({
    otpAuthUrl: "",
    base32: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const border = user?.otpEnabled ? "redBorder" : "blueBorder";

  const generateQrCode = async (email) => {
    try {
      //store.setRequestLoading(true);
      const response = await axiosPrivate.post("auth/generateOTP", { email });
      //store.setRequestLoading(false);

      if (response.status === 200) {
        setOpenModal(true);
        setSecret({
          base32: response.data.base32,
          otpAuthUrl: response.data.otpAuthUrl,
        });
      }
    } catch (error) {
      //store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const disableTwoFactorAuth = async () => {
    await dispatch(disableOTP());
    await dispatch(RESET());
  };

  useEffect(() => {
    //console.log(store.authUser);
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <section>
        <div className="container">
          <PageMenu />
          <div
            className={`max-w-6xl p-12 mx-auto bg-ct-dark-100 rounded-md flex gap-40 justify-center items-start marginTop ${border}`}
          >
            <div>
              <h1 className="text-2xl font-semibold">Korisnik</h1>
              <div className="mt-8">
                <p className="mb-4">Ime i prezime: {user?.name}</p>
                <p className="mb-4">Email: {user?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">
                Autentifikacija s mobilnom aplikacijom
              </h3>
              <p className="mb-4">
                Osigurajte svoj korisnički profil sa TOTP sigurnosim kodom
                prilikom svake prijave
              </p>
              {user?.otpEnabled ? (
                <button
                  type="button"
                  className="--btn --btn-block --btn-danger"
                  onClick={() => disableTwoFactorAuth()}
                >
                  Onemogući 2FA
                </button>
              ) : (
                <button
                  type="button"
                  className="--btn --btn-block --btn-primary"
                  onClick={() => generateQrCode(user?.email)}
                >
                  Omogući 2FA
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {openModal && (
        <Modal
          base32={secret.base32}
          otpAuthUrl={secret.otpAuthUrl}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default TwoFactor;
