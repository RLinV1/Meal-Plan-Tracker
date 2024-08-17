import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PieChart } from "react-minimal-pie-chart";
import { MdArrowDownward, MdArrowUpward, MdDelete } from "react-icons/md"; // Updated icon import
import { FaRegEdit } from "react-icons/fa";

import { auth } from "../firebase-config";
import { resetRefresh } from "./redux/refreshSlice";
import { useDispatch, useSelector } from "react-redux";
import AddItemModal from "./modals/AddItemModal";
import EditItemModal from "./modals/EditItemModal";
import { openEditModal } from "./redux/editItemModalSlice";
import { openDeleteModal } from "./redux/deleteItemModalSlice";
import DeleteItemModal from "./modals/DeleteItemModal";
import CalculateCostsModal from "./modals/CalculateMealsModal";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shouldRefresh = useSelector((state) => state.refresh.shouldRefresh);
  const isAddItemModalOpen = useSelector((state) => state.addModal.isModalOpen);
  const isEditItemModalOpen = useSelector(
    (state) => state.editModal.isModalOpen
  );
  const isDeleteItemModalOpen = useSelector(
    (state) => state.deleteModal.isModalOpen
  );
  const isCalculateCostsModalOpen = useSelector(
    (state) => state.costsModal.isModalOpen
  );

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [sortBy, setSortBy] = useState("percentage");
  const [ascending, setAscending] = useState(false); // Add state to toggle ascending/descending
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemCost, setItemCost] = useState(0);
  const [userName, setUserName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = userData?.slice(indexOfFirstItem, indexOfLastItem);
  let totalPages = Math.ceil((userData?.length || 0) / rowsPerPage);

  const lineWidth = 60;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // The user is signed in.
        try {
          const idToken = await user.getIdToken(true); // Force refresh the token if needed
          const res = await axios.get(
            `http://localhost:5000/display_user_data/`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          setUserName(user.displayName);

          const data = res.data;
          const entries = Object.entries(data);

          const totalCost = entries.reduce(
            (sum, [, value]) => sum + value.cost * value.quantity,
            0
          );
          setTotalCost(totalCost.toFixed(2));

          const sortedUserData = entries
            .map(([key, value]) => ({
              name: value.name,
              cost: value.cost.toFixed(2),
              quantity: value.quantity,
              totalCost: (value.quantity * value.cost).toFixed(2),
              percentage: (
                ((value.quantity * value.cost) / totalCost) *
                100
              ).toFixed(2),
            }))
            .sort((a, b) => {
              if (sortBy === "name")
                return ascending
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
              if (sortBy === "quantity")
                return ascending
                  ? a.quantity - b.quantity
                  : b.quantity - a.quantity;
              if (sortBy === "cost")
                return ascending ? a.cost - b.cost : b.cost - a.cost;
              if (sortBy === "percentage")
                return ascending
                  ? a.percentage - b.percentage
                  : b.percentage - a.percentage;
              if (sortBy === "totalCost")
                return ascending
                  ? a.totalCost - b.totalCost
                  : b.totalCost - a.totalCost;
            });

          setUserData(sortedUserData);
          setPieData(
            sortedUserData.map((value, index) => ({
              title: value.name,
              value: Math.round(value.percentage),
              percentage: value.percentage,
              color: ["#E38627", "#C13C37", "#6A2135", "#2C3E50", "#E74C3C"][
                index % 5
              ],
            }))
          );


          // Handles page changes automatically if the user deletes an item to the last page with data
          totalPages = Math.ceil((sortedUserData?.length || 0) / rowsPerPage);
          
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }

        } catch (err) {
          console.error(err);
        }
      } else {
        // No user is signed in.
        navigate("/");
        console.log("No user is signed in.");
      }
    });
  };
  useEffect(() => {
    try {
      if (auth.currentUser) {
        console.log(auth.currentUser.displayName);
      }
      fetchUserData();
    } catch (err) {
      navigate("/");
      console.log(err);
      setError("Failed to fetch user data");
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setPieData(
        userData.map((value, index) => ({
          title: value.name,
          value: Math.round(value.percentage),
          percentage: value.percentage,
          color:
            hovered === index
              ? "grey"
              : ["#E38627", "#C13C37", "#6A2135", "#2C3E50", "#E74C3C"][
                  index % 5
                ],
        }))
      );
    }
  }, [hovered]);

  useEffect(() => {
    if (shouldRefresh) {
      // Refresh your dashboard data here
      console.log("Refreshing Dashboard Data...");
      fetchUserData();
      // Reset the refresh state after handling it
      dispatch(resetRefresh());
    }
  }, [shouldRefresh, dispatch]);

  useEffect(() => {}, [userData]);

  useEffect(() => {
    if (userData) {
      // console.log(ascending);
      // console.log(sortBy)
      const sortedUserData = userData.sort((a, b) => {
        if (sortBy === "name")
          return ascending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        if (sortBy === "quantity")
          return ascending ? a.quantity - b.quantity : b.quantity - a.quantity;
        if (sortBy === "cost")
          return ascending ? a.cost - b.cost : b.cost - a.cost;
        if (sortBy === "percentage")
          return ascending
            ? a.percentage - b.percentage
            : b.percentage - a.percentage;
        if (sortBy === "totalCost")
          return ascending
            ? a.totalCost - b.totalCost
            : b.totalCost - a.totalCost;
      });
      setPieData(
        sortedUserData.map((value, index) => ({
          title: value.name,
          value: Math.round(value.percentage),
          percentage: value.percentage,
          color:
            hovered === index
              ? "grey"
              : ["#E38627", "#C13C37", "#6A2135", "#2C3E50", "#E74C3C"][
                  index % 5
                ],
        }))
      );
    }
  }, [sortBy, ascending]);

  return (
    <div className="w-full flex flex-col items-center gap-8 p-4 my-4">
      <h1 className="text-5xl font-bold">
        Welcome, {userName ? <span>{userName}</span> : "User"}
      </h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {userData && Object.keys(userData).length > 0 ? (
        <div className="w-full flex flex-col items-center gap-4 text-center">
          <div className="flex justify-around w-full ">
            <div className="flex items-center gap-6">
              <div className="lg:w-[400px]">
                <PieChart
                  style={{
                    fontFamily:
                      '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                    fontSize: Object.keys(userData).length > 6 ? "4px" : "6px",
                  }}
                  data={pieData}
                  radius={46}
                  lineWidth={lineWidth}
                  segmentsStyle={{
                    transition: "stroke .3s",
                    cursor: "pointer",
                  }}
                  segmentsShift={(index) => (index === selected ? 3 : 0)}
                  animate
                  animationDuration={800}
                  label={({ dataEntry }) => `${dataEntry.percentage}%`}
                  labelPosition={100 - lineWidth / 2}
                  labelStyle={{
                    fill: "#fff",
                    opacity: 0.75,
                    pointerEvents: "none",
                  }}
                  onMouseOver={(_, index) => {
                    setHovered(index);
                  }}
                  onMouseOut={() => {
                    setHovered(undefined);
                  }}
                  onClick={(_, index) => {
                    setSelected(index === selected ? undefined : index);
                  }}
                />
              </div>
              <div>
                <h1>Total Expenses</h1>
                <h1>${totalCost}</h1>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full max-w-7xl flex flex-col border m-4 border-gray-300 rounded-tl-lg rounded-tr-lg  bg-[#121530]">
            <div className="flex flex-col ">
              {/* Headers */}
              <div className="flex font-semibold border-b border-gray-300 p-2 rounded-tl-lg rounded-tr-lg  bg-[#090c1e]">
                <div
                  className="flex-1 p-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("name");
                    setAscending(!ascending); // Toggle ascending/descending
                    console.log("name is clicked");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Food Name</span>
                    {sortBy === "name" &&
                      (ascending ? (
                        <MdArrowUpward className="ml-1" />
                      ) : (
                        <MdArrowDownward className="ml-1" />
                      ))}
                  </div>
                </div>
                <div
                  className="flex-1 p-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("quantity");
                    setAscending(!ascending); // Toggle ascending/descending
                    console.log("quantity is clicked");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Quantity</span>
                    {sortBy === "quantity" &&
                      (ascending ? (
                        <MdArrowUpward className="ml-1" />
                      ) : (
                        <MdArrowDownward className="ml-1" />
                      ))}
                  </div>
                </div>
                <div
                  className="flex-1 p-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("cost");
                    setAscending(!ascending); // Toggle ascending/descending
                    console.log("cost is clicked");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Food Cost</span>
                    {sortBy === "cost" &&
                      (ascending ? (
                        <MdArrowUpward className="ml-1" />
                      ) : (
                        <MdArrowDownward className="ml-1" />
                      ))}
                  </div>
                </div>
                <div
                  className="flex-1 p-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("totalCost");
                    setAscending(!ascending); // Toggle ascending/descending
                    console.log("totalCost is clicked");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Total Cost</span>
                    {sortBy === "totalCost" &&
                      (ascending ? (
                        <MdArrowUpward className="ml-1" />
                      ) : (
                        <MdArrowDownward className="ml-1" />
                      ))}
                  </div>
                </div>
                <div
                  className="flex-1 p-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("percentage");
                    setAscending(!ascending); // Toggle ascending/descending
                    console.log("percentage is clicked");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Percentage</span>
                    {sortBy === "percentage" &&
                      (ascending ? (
                        <MdArrowUpward className="ml-1" />
                      ) : (
                        <MdArrowDownward className="ml-1" />
                      ))}
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <div className="flex itmes-center justify-center">
                    <span>Action</span>
                  </div>
                </div>
              </div>

              {/* Actual data */}
              {currentItems.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#14285c]" : " "
                  } flex border-b border-gray-300 px-2 py-4 justify-around items-center`}
                >
                  <div className="flex-1 truncate">{item.name}</div>
                  <div className="flex-1 truncate">{item.quantity}</div>
                  <div className="flex-1 truncate">${item.cost}</div>
                  <div className="flex-1 truncate">${item.totalCost}</div>
                  <div className="flex-1 truncate">{item.percentage}%</div>
                  <div className="flex-1 flex gap-3 items-center justify-center">
                    <FaRegEdit
                      size={20}
                      onClick={() => {
                        setItemName(item.name);
                        setItemQuantity(item.quantity);
                        setItemCost(item.cost);
                        dispatch(openEditModal());
                      }}
                      className="cursor-pointer"
                    />
                    <MdDelete
                      size={22}
                      color="red"
                      onClick={() => {
                        setItemName(item.name);
                        dispatch(openDeleteModal());
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Pagnation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "px-4 py-2 rounded-lg"
                } `}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xl flex items-center justify-center flex-col">
          <p>Loading......</p>
          <span>Waiting For Data To Populate </span>
        </div>
      )}
      <div>{isAddItemModalOpen && <AddItemModal />}</div>
      <div>
        {isEditItemModalOpen && (
          <EditItemModal
            itemName={itemName}
            itemQuantity={itemQuantity}
            itemCost={itemCost}
          />
        )}
      </div>
      <div>
        {isDeleteItemModalOpen && <DeleteItemModal itemName={itemName} />}
      </div>
      <div>
        {isCalculateCostsModalOpen && <CalculateCostsModal data={userData} />}
      </div>
    </div>
  );
}

export default Dashboard;
