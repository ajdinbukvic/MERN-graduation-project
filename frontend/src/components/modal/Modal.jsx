import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useForm } from "react-hook-form";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { verifyOTP, RESET } from "../../redux/features/auth/authSlice";

const styles = {
  heading3: `text-xl font-semibold text-gray-900 p-4 border-b`,
  heading4: `text-lg text-ct-blue-600 font-medium border-b mb-2`,
  modalOverlay: `overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`,
  orderedList: `space-y-1 text-lg list-decimal`,
  buttonGroup: `flex items-center py-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600`,
  buttonBlue: `text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`,
  buttonGrey: `text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-lg font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600`,
  inputField: `bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/5 p-2.5`,
};

const twoFactorAuthSchema = object({
  token: string().min(1, "Morate prvo unijeti kod."),
});

const Modal = ({ otpAuthUrl, base32, closeModal }) => {
  const dispatch = useDispatch();
  const [qrcodeUrl, setqrCodeUrl] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: zodResolver(twoFactorAuthSchema),
  });

  const verifyOtp = async (token) => {
    await dispatch(verifyOTP({ token }));
    await dispatch(RESET());
    closeModal();
    // toast.success("Two-Factor Auth Enabled Successfully", {
    //   position: "top-right",
    // });
  };

  const onSubmitHandler = (values) => {
    verifyOtp(values.token);
  };

  useEffect(() => {
    QRCode.toDataURL(otpAuthUrl).then(setqrCodeUrl);
  }, [otpAuthUrl]);

  useEffect(() => {
    setFocus("token");
  }, [setFocus]);
  return (
    <div
      aria-hidden={true}
      // onClick={closeModal}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-[#222] bg-opacity-50 modalZoom"
    >
      <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
        <div className="relative bg-white rounded-lg shadow">
          <h3 className={styles.heading3}>
            Dvofaktorska autentifikacija (2FA)
          </h3>
          {/* Modal body */}
          <div className="p-6 space-y-4">
            <h4 className={styles.heading4}>
              Konfiguracija mobilne aplikacije za 2FA
            </h4>
            <div className={styles.orderedList}>
              <li>
                Instalirajte Google Authenticator (IOS - Android) or Authy (IOS
                - Android).
              </li>
              <li>
                U autentifikacijskoj aplikaciji odaberite &ldquo;+&rdquo; ikonu.
              </li>
              <li>
                Odaberite opciju &ldquo;Skeniraj QR kod&rdquo; i koristite
                kameru mobitela da skenirate QR kod.
              </li>
            </div>
            <div>
              <h4 className={styles.heading4}>Skeniraj QR kod</h4>
              <div className="flex justify-center">
                <img
                  className="block w-64 h-64 object-contain"
                  src={qrcodeUrl}
                  alt="qrcode url"
                />
              </div>
            </div>
            <div>
              <h4 className={styles.heading4}>
                Ili unesite tajni ključ unutar aplikacije
              </h4>
              <p className="text-lg">
                Tajni ključ: {base32} (Base32 enkodiran)
              </p>
            </div>
            <div>
              <h4 className={styles.heading4}>Verifikacija koda</h4>
              <p className="text-lg">
                Za aktivaciju 2FA unesite kod s autentifikacijske aplikacije
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <input
                {...register("token")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
                placeholder="TOTP kod"
              />
              <p className="mt-2 text-lg text-red-600">
                {errors.token ? errors.token.message : null}
              </p>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.buttonGrey}
                >
                  Zatvori
                </button>
                <button type="submit" className={styles.buttonBlue}>
                  Verifikacija koda
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
