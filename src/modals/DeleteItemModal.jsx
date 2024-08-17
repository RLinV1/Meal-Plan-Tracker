import React, { useRef, useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import axios from "axios";
import { triggerRefresh } from "../redux/refreshSlice"; // Import the action
import { useDispatch } from "react-redux";
import { closeDeleteModal } from "../redux/deleteItemModalSlice";
import { IoMdClose } from "react-icons/io";

const DeleteItemModal = ({ itemName }) => {
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
      dispatch(closeDeleteModal());
    }, 300); // Match this duration with the Tailwind transition duration
  };

  const handleDeleteItem = async (e) => {
    e.preventDefault();
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const res = await axios.delete(`http://127.0.0.1:5000/delete_item`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        data: { name: itemName }, // has to be passed like this with a data : and variables
      });
      console.log(res);
      dispatch(triggerRefresh());
      closeModalWithAnimation();
    } catch (e) {
      console.error(e);
      alert("Failed to delete item");
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
          <h2 className="text-3xl">Delete Item</h2>
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
            onSubmit={handleDeleteItem}
            className="flex flex-col gap-8"
          >
            <div className="text-xl flex items-center gap-2 w-full">
              <span>Are you sure about deleting the item </span>
              <span className="text-red-500 text-2xl max-w-xs inline-block align-middle truncate">
                {" "}
                {itemName}{" "}
              </span>
              ?
            </div>
            <div className="w-full flex justify-end">
              <button type="submit" className=" w-32 text-lg bg-red-500">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
