import React, { useEffect, useRef, useState } from "react";
import "./CreateProduct.css";
import { createProduct, getAllCategories } from "./Service/CreateProduct";
import { uploadMultipleImages } from "../../Shared/Cloudinary/Cloudinary";
import { useLoader } from "../../Context/useLoader";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    expectedPrice: "",
    durationDays: "",
    categoryId: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [imageRes, setImageRes] = useState([]);
  const fileRef = useRef();
  const [categories, setCategories] = useState();
  const { showLoader, hideLoader } = useLoader();

  const handleFiles = (files) => {
    const selected = Array.from(files);

    if (images.length + selected.length > 6) {
      alert("You can upload maximum 6 images");
      return;
    }

    const newImages = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    showLoader();
    try {
      const filesOnly = images.map((img) => img.file);
      const res = await uploadMultipleImages(filesOnly);
      setImageRes((prev) => [...prev, ...res]);
      console.log("imageres", res);
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await createProduct(form,imageRes);
      console.log(res);
      navigate("/",{replace:true})
    } catch (error) {
      console.log(error);
    }finally{
      hideLoader();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (isMounted) {
          setCategories(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // console.log(categories);
  //  console.log("imageres", imageRes);

  return (
    <div className="createProduct sectionMargin">
      <h5 className="heading fs-2">Create Product</h5>
      <div className="formWrapper sectionMargin">
        <div className="left col-12 col-lg-6">
          <form className="row g-3">
            <div className="col-12">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
                <label htmlFor="title">Title </label>
              </div>
            </div>

            <div className="col-12">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="expectedPrice"
                  placeholder="expectedPrice"
                  name="expectedPrice"
                  value={form.expectedPrice}
                  onChange={handleChange}
                />
                <label htmlFor="expectedPrice">Expected Price (₹)</label>
              </div>
            </div>

            <div className="col-12">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  id="durationDays"
                  placeholder="durationDays"
                  name="durationDays"
                  value={form.durationDays}
                  onChange={handleChange}
                />
                <label htmlFor="durationDays">Duration (Days)</label>
              </div>
            </div>

            {/* Select */}
            <div className="col-12">
              <select
                className="form-select py-3"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>

                {categories &&
                  categories.map((data) => (
                    <option key={data.categoryId} value={data.categoryId}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12">
              <div className="form-floating">
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  style={{ height: "150px" }}
                />
                <label htmlFor="description">Description</label>
              </div>
            </div>
          </form>
        </div>

        <div className="right w-50">
          <div className="upload-panel">
            <h6 className="subHeading mb-3 fs-4 fw-semibold">
              Upload Images (max 6)
            </h6>

            <div className="image-grid">
              {images.map((img, index) => (
                <div className="image-box" key={index}>
                  <img src={img.preview} alt="preview" />
                  <button
                    type="button"
                    className="remove-btn "
                    onClick={() => removeImage(index)}
                  >
                    <i className="bi bi-x fw-bolder"></i>
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <div
                  className="image-box add-box fw"
                  onClick={() => fileRef.current.click()}
                >
                  <span>+</span>
                  <p>Add Image</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileRef}
              hidden
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          <div className="d-flex flex-column justify-content-end align-items-end">
            <button
              disabled={images.length < 2 || !imageRes.length == 0}
              className="uploadImage float-end me-3"
              onClick={uploadImages}
            >
              Upload Images{" "}
              <i className="bi bi-cloud-arrow-up-fill ms-1 me-1"></i>
            </button>

            <button
              id="submit"
              onClick={handleSubmit}
              className="uploadImage float-end mt-4 me-3 col-4 "
            >
              Submit<i className="bi bi-check-square-fill ms-1 me-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
