import React, { useRef, useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import axios from "axios";
import { triggerRefresh } from "../redux/refreshSlice"; // Import the action
import { useDispatch } from "react-redux";
import { closeAddModal } from "../redux/addItemModalSlice";
import { IoMdClose } from "react-icons/io";

const AddItemModal = () => {
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    // Show the modal with animation
    setIsVisible(true);

    // Function to handle clicks outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModalWithAnimation();
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const closeModalWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(closeAddModal());
    }, 300); // Match this duration with the Tailwind transition duration
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const res = await axios.post(
        `https://diverse-erin-zaramen-37a3baa8.koyeb.app/add_user_data`,
        {
          name: itemName.trim().toLowerCase(),
          cost: parseFloat(parseFloat(itemCost).toFixed(2)),
          quantity: parseInt(itemQuantity),
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      dispatch(triggerRefresh());
      closeModalWithAnimation();
    } catch (e) {
      console.error(e);
      alert("Failed to add item");
    }
  };

  const handleClose = () => {
    closeModalWithAnimation();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-[#090c1e] p-4 rounded-lg shadow-lg w-[50vw] relative transition-transform duration-300 transform ${
          isVisible ? "scale-100 translate-y-0" : "scale-75 -translate-y-3/4"
        }`}
        ref={modalRef}
      >
        <div className="flex justify-between items-start my-8 pb-3 w-full h-full border-b border-gray-300">
          <h2 className="text-3xl">Add Item</h2>
          <div
            onClick={handleClose}
            className="cursor-pointer absolute top-2 right-2"
          >
            <IoMdClose size={30}/>
          </div>
        </div>

        <div>
          <form
            method="POST"
            onSubmit={handleAddItem}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xl mb-2">Name (only lowercase):</p>
              <input
                type="text"
                placeholder="Item Name"
                value={itemName.toLowerCase()}
                onChange={(e) => setItemName(e.target.value)}
                className="p-2 w-full text-lg bg-[#14285c]"
              />
            </div>
            <div>
              <p className="text-xl mb-2">Cost (Rounded Down to Penny):</p>
              <input
                type="number"
                placeholder="Cost"
                step="any"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value)}
                className="p-2 w-full text-lg bg-[#14285c]"
              />
            </div>
            <div>
              <p className="text-xl mb-2">Quantity:</p>
              <input
                type="number"
                placeholder="Quantity"
                min="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                className="p-2 w-full text-lg bg-[#14285c]"
              />
            </div>

            <div className="w-full flex justify-end">
              <button type="submit" className=" w-32 text-lg bg-blue-500">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
