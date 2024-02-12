import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import TicketView from "../../Component/TicketForm";
import { useParams } from "react-router-dom";

function EditTicket() {
  const [ticketData, setTicketData] = useState();
  const { ticketId } = useParams();

  const fetchSingleTicketData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/tickets/${ticketId}`);
      setTicketData(response.data);
    } catch (error) {
      handleRequestError(error);
    }
  }, []);

  const handleRequestError = (error: unknown) => {
    console.error("An error occurred:", error);
  };

  useEffect(() => {
    fetchSingleTicketData();
  }, [fetchSingleTicketData]);

  return (
    <div className="container mx-auto">
      {ticketData && <TicketView ticketData={ticketData} />}
    </div>
  );
}

export default EditTicket;
