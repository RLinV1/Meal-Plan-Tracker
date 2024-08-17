import React, { useRef, useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import axios from "axios";
import { triggerRefresh } from "../redux/refreshSlice"; // Import the action
import { useDispatch } from "react-redux";
import { closeEditModal } from "../redux/editItemModalSlice";
import { IoMdClose } from "react-icons/io";

const EditItemModal = ({ itemName, itemQuantity, itemCost }) => {
  const [quantity, setQuantity] = useState(itemQuantity);
  const [cost, setCost] = useState(itemCost);
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
      dispatch(closeEditModal());
    }, 300); // Match this duration with the Tailwind transition duration
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const res = await axios.patch(
        `https://diverse-erin-zaramen-37a3baa8.koyeb.app/update_value`,
        {
          name: itemName,
          quantity: parseInt(quantity),
          cost: parseFloat(cost),
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
      alert("Failed to edit item");
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
          <h2 className="text-3xl">Edit Item</h2>
          <div
            onClick={handleClose}
            className="cursor-pointer absolute top-2 right-2"
          >
            <IoMdClose size={30} />
          </div>
        </div>

        <div>
          <form
            method="POST"
            onSubmit={handleEditItem}
            className="flex flex-col gap-6"
          >
            <div className="text-xl w-full">
              You are currently editing the item:{" "}
              <span className="font-extrabold text-purple-600 text-2xl truncate inline-block align-middle max-w-xs">{itemName}</span>
            </div>
            <div>
              <p className="text-xl mb-2">Quantity:</p>
              <input
                type="number"
                placeholder="Quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-2 w-full text-lg bg-[#14285c]"
              />
            </div>
            <div>
              <p className="text-xl mb-2">Cost:</p>
              <input
                type="number"
                placeholder="Cost"
                min="1"
                step="any"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="p-2 w-full text-lg bg-[#14285c]"
              />
            </div>

            <div className="w-full flex justify-end">
              <button type="submit" className=" w-32 text-lg bg-blue-500">
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
