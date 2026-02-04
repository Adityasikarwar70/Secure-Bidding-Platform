import { useRef, useState } from "react";
// import { CloudUpload, X } from "lucide-react";
import "./ImageUpload.css"

const ImageUpload = ({ value, onFileSelect, text}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onFileSelect(file);
  };

  return (
    <div
      className={`image-upload-box ${dragging ? "dragging" : ""}`}
       onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
         type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="d-flex justify-content-evenly gap-5">

        <div className="upload-content">
          {/* <CloudUpload size={40} /> */}
          <h6 className="heading fs-5">{text}</h6>
          <p className="subHeading fs-6 text-center">Drag & drop or click to upload</p>
          <p className="subHeading fs-6 text-center">PNG, JPG up to 5MB</p>
        </div>

        {
          value  && <div className="preview-wrapper">
          <img src={URL.createObjectURL(value)} alt="Preview" />
          <i className="bi bi-x-circle-fill"  onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              onFileSelect(null);
            }}></i>
        </div>

        }
        </div>
                
    
    </div>
  );
};

export default ImageUpload;
