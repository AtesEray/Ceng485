import axios from "axios";
import React, { useState } from "react";

function ExpertHome() {
    const [selectedFile, setSelectedFile] = useState(null);

    // On file select (from the pop-up)
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        if (selectedFile) {
            formData.append("myFile", selectedFile, selectedFile.name);

            // Details of the uploaded file
            console.log(selectedFile);

            // Request made to the backend API
            // Send formData object
            axios.post("api/uploadfile", formData).then((response) => {
                console.log("File uploaded successfully", response.data);
            }).catch((error) => {
                console.error("Error uploading file", error);
            });
        } else {
            console.warn("No file selected for upload");
        }
    };

    // File content to be displayed after file upload is complete
    const fileData = () => {
        if (selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before pressing the Upload button</h4>
                </div>
            );
        }
    };

    return (
        <div>
            <h2>Welcome to the Expert Dashboard!</h2>
            <h3>After you choose folder, please use upload button</h3>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>Upload!</button>
            </div>
            {fileData()}
        </div>
    );
}

export default ExpertHome;
