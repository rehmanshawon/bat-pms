import { UserProfileUnit } from "components/UserProfileUnit";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { swalError } from "apsisEngine/helpers/helperService";
import { useEffect, useState } from "react";

const Profile = () => {
  const [data, setData] = useState(null);
  const [passLogicData, setPassLogicData] = useState(null);
  const getUserInformation = async () => {
    await fetchWrapper
      .get("apsis/auth/profile")
      .then((response) => {
        if (!response?.error) {
          setData(response.result);
        }
      })
      .catch((error) => {
        swalError(error?.message);
      });
  };

  const getConfirmPasswordLogicData = async () => {
    await fetchWrapper
      .get("apsis/auth/changepassword")
      .then((response) => {
        if (!response?.error) {
          // console.log('pass logic',response);
          setPassLogicData(response?.result);
        } else {
          swalError(response?.message);
        }
      })
      .catch((error) => {
        swalError(error?.message);
      });
  };

  useEffect(() => {
    getUserInformation();
    getConfirmPasswordLogicData();
  }, []);

  return (
    <div>
      <UserProfileUnit data={data} passLogicData={passLogicData} />
    </div>
  );
};

export default Profile;
