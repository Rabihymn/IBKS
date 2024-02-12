import { RouteObject } from "react-router-dom";
import Tickets from "../Pages/Ticket";
import CreateTicket from "../Pages/Ticket/createTicket";
import EditTicket from "../Pages/Ticket/editTicket";

const router: RouteObject[] = [
  {
    path: "/",
    element: <Tickets />, // Default route renders Tickets component
  },
  {
    path: "",
    children: [
      {
        path: "/tickets",
        element: <Tickets />,
      },
      {
        path: "/tickets/:ticketId",
        element: <EditTicket />,
      },
      {
        path: "/tickets/newTicket",
        element: <CreateTicket />,
      },
    ],
  },
];

export default router;
