import { useParams } from "react-router-dom";

import VehicleForm from "@/components/admin/VehicleForm";

const AdminBook = () => {
  let id1 = "1";
  const { id } = useParams();
  id1 = id ? id : id1;

  return <VehicleForm parkingLotId={id1} />;
};

export default AdminBook;
