import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Table() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/tickets?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
      );
      setData(response.data.tickets);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error(error);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const headers = {
    Lvl: "priorityIdById",
    "#": "id",
    Title: "title",
    Module: "ApplicationName",
    Type: "TicketTypeById",
    State: "statusById",
  };

  const currentItems = data;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const navigate = useNavigate();

  const handleViewClick = (rowId: number) => {
    navigate(`/tickets/${rowId}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const limit = 10;
    const startPage = Math.max(1, currentPage - limit);
    const endPage = Math.min(totalPages, currentPage + limit);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => paginate(i)}
            className={`px-3 py-1 rounded-md focus:outline-none ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  function renderPriorityIndicator(priorityTitle: string) {
    let color = "";
    switch (priorityTitle) {
      case "Low":
        color = "bg-green-500";
        break;
      case "Medium":
        color = "bg-yellow-500";
        break;
      case "High":
        color = "bg-red-500";
        break;
      case "None":
        color = "bg-gray-500";
        break;
      default:
        color = "bg-gray-500";
    }

    return <div className={`h-4 w-4 rounded-full ${color}`}></div>;
  }
  return (
    <div className="p-8">
      <div className="flex flex-col">
        <div className="text-end">
          <Link to="/tickets/newTicket">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create new ticket
            </button>
          </Link>
        </div>
        <div>
          <div className="inline-block min-w-full py-2">
            <div className="overflow-hidden">
              <table className="min-w-full border text-center text-sm font-light border-black">
                <thead className="font-medium border-black">
                  <tr>
                    {Object.keys(headers).map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={"py-4 border-black border"}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border border-black"
                      onClick={() => handleViewClick(item.id)}
                    >
                      <td
                        className={
                          "whitespace-nowrap border border-black py-4 "
                        }
                      >
                        <div className="flex justify-center">
                          {renderPriorityIndicator(item.priorityIdById.title)}
                        </div>
                      </td>
                      <td
                        className={"whitespace-nowrap border border-black py-4"}
                      >
                        {item.id}
                      </td>
                      <td
                        className={"whitespace-nowrap border border-black py-4"}
                        style={{ maxWidth: "150px", overflow: "hidden" }}
                      >
                        {item.title}
                      </td>
                      <td
                        className={"whitespace-nowrap border border-black py-4"}
                      >
                        {item.applicationName}
                      </td>
                      <td
                        className={"whitespace-nowrap border border-black py-4"}
                      >
                        {item.ticketTypeById.title}
                      </td>
                      <td
                        className={"whitespace-nowrap border border-black py-4"}
                      >
                        {item.statusById.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <label htmlFor="itemsPerPage" className="mr-2">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <ul className="flex items-center">{renderPageNumbers()}</ul>
        </div>
      </div>
    </div>
  );
}

export default Table;
