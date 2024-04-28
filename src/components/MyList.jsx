import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { AuthContext } from "../Firebase/AuthProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const MyList = () => {

    const { user , setReload} = useContext(AuthContext)

    const [details, setDetails] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/myList/${user?.email}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setDetails(data)
            })
    }, [user])

    const handleDelete = _id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                fetch(`http://localhost:5000/delete/${_id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setReload(true)
                        
                        if (data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });

                            const remaining = details.filter(d => d._id !== _id)
                            setDetails(remaining)
                            setReload(false)
                            
                        }
                    })
            }
        });
    }


    return (
        <div>
            <h1 className="text-4xl bg-purple-300">My list: {details.length}</h1>

            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <th>Tourist Spots</th>
                                <th>Country</th>
                                <th>Average cost</th>
                                <th>Modify</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {
                                details.map((detail, index) => <tr key={index}>
                                    <th>{index + 1}
                                        {/* <label>
                                            <input type="checkbox" className="checkbox" />
                                        </label> */}
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask md:w-24 h-24">
                                                    <img src={detail.image} alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{detail.tourists_spot_name}</div>
                                                <div className="text-sm opacity-50"></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {detail.country_Name}
                                    </td>
                                    <td>

                                        <span className="badge badge-ghost badge-sm">{detail.average_cost}</span>
                                    </td>
                                    {/* <td>{detail.average_cost}</td> */}
                                    <th>
                                        <Link to={`/updateForm/${detail._id}`}>
                                            <button className="btn btn-warning">Update</button>
                                        </Link>
                                    </th>
                                    <th>
                                        <button onClick={() => handleDelete(detail._id)} className="btn btn-error">Delete</button>
                                    </th>
                                </tr>)
                            }
                            
                        </tbody>
                        

                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyList;