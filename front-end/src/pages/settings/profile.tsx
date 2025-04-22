import { TagRole } from "@/components/common";
import { EditProfileModal } from "@/components/settings/profile";
import { SRC_DAMAGED_PICTURE, SRC_USER } from "@/constants";
import { formatDateTime, useDisclosure } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { Pencil } from "lucide-react";

export const SettingProfilePage = () => {
  const { isOpen: open, onOpen, onClose } = useDisclosure();

  const { dataUser } = useAppSelector((state) => state.utils);

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}>
  //       <Spin size='large' tip='Loading profile...' />
  //     </div>
  //   );
  // }

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const tokenData = parseJwt(dataUser.token);
  const tokenExpiry = tokenData?.exp ? new Date(tokenData.exp * 1000) : null;

  return (
    <div className='p-2 w-full h-full flex flex-col overflow-hidden'>
      <div className='w-full bg-white p-2 rounded-md h-min max-h-full flex flex-col shadow-xl overflow-hidden'>
        <div className=' w-full flex justify-between items-center h-min p-2'>
          <p className=' text-lg font-bold'>Profile Settings</p>
          <Pencil
            className=' text-gray-400 cursor-pointer 
          hover:text-orange-400 hover:rotate-12 hover:scale-105 
          active:text-orange-300 active:rotate-0 active:scale-95'
            onClick={onOpen}
          />
        </div>

        <div className='flex gap-6 justify-center items-center w-full'>
          <img
            src={dataUser?.profile_picture ?? ""}
            alt='profile'
            width='160'
            height='160'
            className='!max-w-[160px] !max-h-[160px] w-[160px] h-[160px] object-cover rounded-full border-[1px] my-4 shadow-md'
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                dataUser?.profile_picture ?? "" === ""
                  ? SRC_USER
                  : SRC_DAMAGED_PICTURE;
            }}
          />

          <div className=' font-bold flex flex-col  text-2xl text-slate-400 h-ful'>
            <div className=' flex gap-4 items-center justify-center text-black'>
              <p className='text-4xl'>
                {dataUser?.first_name} {dataUser?.last_name}
              </p>
              <TagRole role={dataUser?.role} isView />
            </div>
            <p>{dataUser?.position}</p>
            <p>@{dataUser?.username}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 w-full gap-2'>
          {[
            {
              title: "Account Informatio",
              data: [
                { label: "Employee Number", value: dataUser?.employee_number },
                { label: "Account ID", value: dataUser?.account_id },
                { label: "Username", value: dataUser?.username },
              ],
            },
            {
              title: "Session Information",
              data: [
                {
                  label: "Account Created",
                  value: formatDateTime(String(dataUser?.created_at)),
                },
                {
                  label: "Last Updated",
                  value: formatDateTime(String(dataUser?.updated_at)),
                },
                {
                  label: "Session Expires",
                  value: formatDateTime(String(tokenExpiry)) ?? "",
                },
              ],
            },
          ]?.map(({ title, data }) => (
            <div className='w-full border-[1px] flex flex-col gap-2 rounded-md shadow-sm p-2 px-4'>
              <p className=' text-lg font-bold'>{title}</p>
              {data?.map(({ label, value }) => (
                <div>
                  <p className=' text-sm text-slate-400'>{label} :</p>
                  <p className=' text-md font-medium'>{value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {open && <EditProfileModal {...{ open, onClose }} />}
    </div>
  );
};
