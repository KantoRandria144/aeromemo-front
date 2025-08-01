import { useState, useEffect } from "react";
import { getAllDepartments } from "../../services/User/UserServices";


const HeaderHierarchy = ({
  setDepartChoosen,
}: {
  setDepartChoosen: Function;
}) => {
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      const depart = await getAllDepartments();
      setDepartments(depart);
    };
    fetchDepartment();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {departments.map((depart) => (
        <button
          onClick={() => {
            setDepartChoosen(depart);
          }}
          key={depart}
          className="p-2 border min-w-24 bg-whiten rounded-md"
        >
          {depart}
        </button>
      ))}
    </div>
  );
};

export default HeaderHierarchy;
