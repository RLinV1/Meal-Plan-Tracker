import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { closeMealsModal } from "../redux/calculateMealsModalSlice";

const CalculateCostsModal = ({ data }) => {
  const [itemName, setItemName] = useState("");
  const [budget, setBudget] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [totalMeals, setTotalMeals] = useState(null);

  const modalRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    // Show the modal with animation
    setIsVisible(true);
    // set intial selected item as the first item
    setSelectedItem(data[0].name);

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
  }, []);

  const closeModalWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(closeMealsModal());
      setTotalMeals(null);
    }, 300); // Match this duration with the Tailwind transition duration
  };

  const handleCalculateMeals = async (e) => {
    e.preventDefault();
    try {
      const filteredItem = data.find(
        (item) => item.name.toLowerCase() === selectedItem.toLowerCase()
      );
      const cost = filteredItem.cost;
      console.log(Math.floor(budget / cost));

      setTotalMeals(Math.floor(budget / cost));
      //   console.log(selectedItem);
      //   closeModalWithAnimation();
    } catch (e) {
      console.error(e);
      alert("Failed to calculate");
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
          <h2 className="text-3xl">Meal Calculator</h2>
          <div
            onClick={handleClose}
            className="cursor-pointer absolute top-2 right-2"
          >
            <IoMdClose size={30} />
          </div>
        </div>

        {totalMeals && totalMeals >= 0 ? (
          <div>
            <h3 className="text-xl w-full flex items-center gap-2 pb-8">
              You can afford{" "}
              <span className="text-2xl text-purple-600">{totalMeals}</span>{" "}
              meal{totalMeals > 1 ? "s" : ""} of{" "}
              <span className="align-middle text-2xl text-purple-600 inline-block max-w-xs truncate">
                {selectedItem} 
              </span>{" "}
              with your current budget.
            </h3>
          </div>
        ) : (
          <div>
            <form
              method="POST"
              onSubmit={handleCalculateMeals}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-xl mb-2">Current Budget ($):</p>
                <input
                  type="number"
                  placeholder="Budget"
                  step="any"
                  onChange={(e) => setBudget(e.target.value)}
                  className="p-2 w-full text-lg bg-[#14285c]"
                  required
                />
              </div>

              <div>
                <p className="text-xl mb-2">Item Name:</p>
                <select
                  name="food-items"
                  id="food-items"
                  className="p-2 w-full text-lg bg-[#14285c]"
                  value={selectedItem} // To make the select controlled
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                  }}
                  required
                >
                  {data &&
                    data.map((item, index) => (
                      <option
                        key={item.name}
                        value={item.name}
                        className="truncate"
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-32 text-lg bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Calculate
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculateCostsModal;
