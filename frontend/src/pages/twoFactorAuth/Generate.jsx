import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import { toast } from "react-toastify";
import Modal from "../../components/modal/Modal";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { generateOTP, disableOTP } from "../../redux/features/auth/authSlice";

const Generate = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [secret, setSecret] = useState({
    otpAuthUrl: "",
    base32: "",
  });
  const [openModal, setOpenModal] = useState(false);
  //const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(RESET());
  //   if (isSuccess) {
  //     setOpenModal(true);
  //     setSecret({
  //       base32: base32,
  //       otpAuthUrl: otpAuthUrl,
  //     });
  //   }
  // }, [isSuccess, navigate, dispatch]);

  const generateQrCode = async (email) => {
    const response = await dispatch(generateOTP(email));
    setOpenModal(true);
    setSecret({
      base32: response.data.base32,
      otpAuthUrl: response.data.otpAuthUrl,
    });
  };

  const disableTwoFactorAuth = async () => {
    await dispatch(disableOTP());
  };

  // useEffect(() => {
  //   console.log(store.authUser);
  //   if (!store.authUser) {
  //     navigate("/login");
  //   }
  // }, [navigate, store.authUser]);

  return (
    <>
      <section className="bg-ct-blue-600  min-h-screen pt-10">
        <div className="max-w-4xl p-12 mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex gap-20 justify-center items-start">
          <div className="flex-grow-2">
            <h1 className="text-2xl font-semibold">Profile Page</h1>
            <div className="mt-8">
              <p className="mb-4">ID: {user?.id}</p>
              <p className="mb-4">Name: {user?.name}</p>
              <p className="mb-4">Email: {user?.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">
              Mobile App Authentication (2FA)
            </h3>
            <p className="mb-4">
              Secure your account with TOTP two-factor authentication.
            </p>
            {user?.otpEnabled ? (
              <button
                type="button"
                className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                onClick={() => disableTwoFactorAuth()}
              >
                Disable 2FA
              </button>
            ) : (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                onClick={() => generateQrCode(user?.email)}
              >
                Setup 2FA
              </button>
            )}
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

export default Generate;
