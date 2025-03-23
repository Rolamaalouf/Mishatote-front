"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const P5Wrapper = dynamic(() => import("./p5Canvas"), { ssr: false });

export default function Page() {
  const [selectedBag, setSelectedBag] = useState("brown");
  const [textList, setTextList] = useState([]); // Store multiple text elements
  const [imageFiles, setImageFiles] = useState([]);
  const [activeElement, setActiveElement] = useState(null);

  // Add New Text
  const addText = () => {
    const newText = {
      id: Date.now(),
      text: "New Text",
      x: 200,
      y: 200,
      fontSize: 30,
      textColor: "#000000",
      fontStyle: "Arial",
      rotation: 0,
      width: 150,
      height: 50,
    };
    setTextList([...textList, newText]);
    setActiveElement(newText.id);
  };

  // Update Text Value
  const updateText = (id, field, value) => {
    setTextList(textList.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // Delete Text
  const deleteText = (id) => {
    setTextList(textList.filter((t) => t.id !== id));
    setActiveElement(null);
  };

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImage = {
        id: Date.now(),
        url: imageUrl,
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        rotation: 0,
      };
      setImageFiles([...imageFiles, newImage]);
      setActiveElement(newImage.id);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Design Your Custom Tote Bag</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* P5.js Canvas */}
        <div className="flex flex-col items-center">
          <P5Wrapper
            selectedBag={selectedBag}
            textList={textList}
            imageFiles={imageFiles}
            setTextList={setTextList}
            setImageFiles={setImageFiles}
            activeElement={activeElement}
            setActiveElement={setActiveElement}
          />
        </div>

        {/* Controls */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Customize Your Tote Bag</h3>

          {/* Select Tote Bag */}
          <label className="block text-sm font-medium mb-1">Choose Your Tote Bag</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {["brown", "beige", "black"].map((bag) => (
              <div key={bag} className="flex flex-col items-center">
                <div
                  className={`w-24 h-24 border rounded-md cursor-pointer ${
                    selectedBag === bag ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedBag(bag)}
                >
                  <img src={`/${bag}.${bag === "brown" ? "png" : "jpg"}`} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>

          {/* Add Text */}
          <button onClick={addText} className="w-full p-2 bg-green-500 text-white rounded-md mb-4">Add Text</button>

          {/* Upload Image */}
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input type="file" onChange={handleImageUpload} accept="image/*" className="w-full p-2 border rounded mb-4" />
        </div>
      </div>
    </div>
  );
}
