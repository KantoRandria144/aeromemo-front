import { useEffect, useState } from "react";
import BodyHierarchy from "../../components/Hierarchy/BodyHierarchy";
import ModifyHierarchy from "../../components/Hierarchy/ModifyHierarchy";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getAllUsers } from "../../services/User/UserServices";
import { UserInterface } from "../../types/user";
// import HeaderHierarchy from "../../components/Hierarchy/ModifyHierarchy";

const ManageHierarchie = () => {
//   const [departChoosen, setDepartChoosen] = useState("");
  const [userData, setUserData] = useState<UserInterface[]>([]);
  const [isModifyHierarchyOpen, setIsModifyHierarchyOpen] = useState(false);
  const [userToModify, setUserToModify] = useState<UserInterface | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const users = await getAllUsers();
      setUserData(users);
    };
    fetchUser();
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-2 p-4 md:mx-10">
        {/* <HeaderHierarchy setDepartChoosen={setDepartChoosen} /> */}
        <BodyHierarchy
          userData={userData}
          setIsModifyHierarchyOpen={setIsModifyHierarchyOpen}
          setUserToModify={setUserToModify}
        />
        {isModifyHierarchyOpen && (
        <ModifyHierarchy
            setIsModifyHierarchyOpen={setIsModifyHierarchyOpen} // ✅ Correct
            userToModify={userToModify} // ✅ Correct
        />
        )}
      </div>
    </DefaultLayout>
  );
};

export default ManageHierarchie;