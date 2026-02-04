import React, { useEffect, useState } from "react";
import "./AllCategory.css";
import {
  addCategory,
  DeleteCategory,
  fetchAllCategory,
} from "../Service/AllCategory";
import defaultImageUrl from "../../../../assets/Images/icon.png";
import ImageUpload from "../../../Component/ImageUpload/ImageUpload";
import { uploadToCloudinary } from "../../../../Shared/Cloudinary/Cloudinary";
import { useLoader } from "../../../../Context/useLoader";

const AllCategory = () => {
  const { showLoader, hideLoader } = useLoader();
  const [allCategory, setAllCategory] = useState([]);
  const [image, setImage] = useState();
  const [allCategoryRes, setAllCategoryRes] = useState();
  const [CategoryDeleteRes, setCategoryDeleteRes] = useState(1);
  const [form, setForm] = useState({
    Name: "",
    ImageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImageasync = async () => {
    showLoader();
    const imageUrl = await uploadToCloudinary(image);

    setForm((prev) => ({
      ...prev,
      ImageUrl: imageUrl,
    }));

    hideLoader();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await addCategory(form);
      setAllCategoryRes(res);
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();
      setImage(null);
      setForm((prev) => ({
        ...prev,
        Name: "",
        ImageUrl: "imageUrl",
      }));
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await DeleteCategory(id);
      setCategoryDeleteRes(CategoryDeleteRes + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const categories = await fetchAllCategory();
        if (isMounted) {
          setAllCategory(categories);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [allCategoryRes, CategoryDeleteRes]);
  return (
    <div>
      <div className="p-4 overflow-visible">
        {/* <h2 className="heading mb-5 fs-1">All Category</h2> */}
        <div className="category-Wrapper">
          <div className="leftside table-responsive shadow-sm rounded">
            <table className="table table-hover table-bordered table-info align-middle mb-0">
              <thead className="bg-success text-white">
                <th>#</th>
                <th>Category Name</th>
                <th>Delete</th>
              </thead>
              <tbody>
                {allCategory.map((data, key) => (
                  <tr>
                    <th>{key + 1}</th>
                    <th>
                      {" "}
                      <span className="imageCategory me-4">
                        <img
                          src={data.imageUrl ? data.imageUrl : defaultImageUrl}
                          alt=""
                        />
                      </span>{" "}
                      {data.name}
                    </th>
                    <th>
                      <button
                        className="btn btn-danger "
                        onClick={() => deleteCategory(data?.categoryId)}
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rightside">
            <div class="accordion accordion-flush" id="accordionFlushExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed heading text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Add Category
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body d-flex align-items-center justify-content-center">
                    <div className="w-100 rounded p-3">
                      <div className="form-floating col-12 col-lg-11 ms-4">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder="FirstName"
                          name="Name"
                          value={form.Name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="firstName">Category Name</label>
                      </div>

                      <div className="col-12 mt-5">
                        <ImageUpload
                          value={image}
                          onFileSelect={setImage}
                          text={"Upload Category Icon"}
                        />
                      </div>
                      <div className="mt-4 col-12 ">
                        <button
                          className="uploadImage col-4 float-end "
                          type="button"
                          onClick={uploadImageasync}
                        >
                          Upload Image{" "}
                          <i className="bi bi-file-earmark-image"></i>
                        </button>
                      </div>
                      <br />

                      <div className="mt-4 col-12 ">
                        <button
                          className="submit col-3 float-end subHeading fs-6 "
                          type="button"
                          onClick={handleSubmit}
                        >
                          Add Category
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
