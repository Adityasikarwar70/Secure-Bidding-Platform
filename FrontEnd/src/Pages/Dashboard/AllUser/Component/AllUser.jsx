import React, { useEffect, useState } from 'react'
import "./AllUser.css"
import { fetchAllUser } from '../Service/AllUser';
import { Link } from 'react-router-dom';

const AllUser = () => {
     const [allUsers, setAllUsers] = useState([]);
    
      useEffect(() => {
        const getAllUsers = async () => {
          try {
            const res = await fetchAllUser();
            setAllUsers(res);
          } catch (error) {
            console.log(error);
          }
        };
    
        getAllUsers();
      }, []);
    
      console.log(allUsers);
  return (
     <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1">All User</h2>
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-dark align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Mobile No</th>
                <th>Private Info</th>
                <th>Address</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.length > 0 ? (
                allUsers.map((data, index) => (
                  <tr key={data.id || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      <p>
                        {data.firstName} {data.lastName} {data?.verified == true && <i className=" bi bi-patch-check-fill green ms-2"></i>} <br />{" "}
                        <span className="">{data.email}</span> <br />
                        {data.roles.map((data) => (
                          <span className="roles">{data.name}</span>
                        ))}
                      </p>
                    </td>

                    {/* <td>₹{data.basePrice}</td> */}

                    <td className="text-success fw-semibold">
                      {data.mobileNo}
                    </td>

                    <td>
                      <p>
                        {data.panCardNumber?.length > 7
                          ? data.panCardNumber.slice(0, 7) +
                            "#".repeat(data.panCardNumber.length - 7)
                          : data.panCardNumber}
                        <br />
                        {data.aadharCardNumber?.length > 7
                          ? data.aadharCardNumber.slice(0, 7) +
                            "#".repeat(data.aadharCardNumber.length - 7)
                          : data.aadharCardNumber}
                      </p>
                    </td>
                    <td>
                        {data.address.length > 15 ? data.address.slice(0, 15) +
                            "..." : data.address }
                    </td>

                    <td className="text-center">
                      <div className="py-1">
                        <Link
                          to={`/profile/${data.id}`}
                          className="go-button subHeading fs-6 "
                        >
                          {" "}
                          View Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 subHeading">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllUser