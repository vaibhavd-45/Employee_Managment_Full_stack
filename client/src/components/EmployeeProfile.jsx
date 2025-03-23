import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeNavbar from "./Navbar";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/employee/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);


    console.log("Selected file type:", selectedFile.type);
  console.log("Selected file size:", selectedFile.size);
  
  // Loop through and log all entries in the FormData
  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
    if (pair[1] instanceof File) {
      console.log("File name:", pair[1].name);
      console.log("File type:", pair[1].type);
      console.log("File size:", pair[1].size);
    }
  }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/employee/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        //   "Content-Type": "multipart/form-data",
        },
      });

      // Update profile picture in the state
      setEmployee((prev) => ({ ...prev, profileImage: response.data.profileImage }));
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return <p>Loading profile...</p>;

  return (
    <div>
      <EmployeeNavbar />
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Employee Profile</h2>
        <div className="flex flex-col items-center">
          <img
            src={employee.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mt-4"
          />
          <h3 className="text-xl font-semibold mt-2">{employee.name}</h3>
          <p className="text-gray-600">{employee.email}</p>
          <p className="text-gray-500">Department: {employee.department}</p>
          <p className="text-gray-500">
            Date of Joining: {new Date(employee.dateOfJoining).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4">
          <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded" />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Profile Picture"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
