import { useParams } from "react-router-dom";

function SingleContactView() {
    const { listName } = useParams();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Contacts in {listName}</h1>
        </div>
    );
}

export default SingleContactView;