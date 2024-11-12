import { isAdmin as getAdmin } from "@/libs/admin";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const App = dynamic(() => import("./app"), {ssr: false})

const AdminPage = async () => {
    const isAdmin = await getAdmin()

    if (!isAdmin) {
        redirect("/")
    }
    return ( 
        <App />
     );
}
 
export default AdminPage;