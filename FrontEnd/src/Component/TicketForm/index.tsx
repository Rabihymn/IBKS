import { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, FormikValues } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

interface Priority {
  id: number;
  title: string;
}

interface TicketReply {
  replyId?: number;
  tId?: number;
  reply?: string;
}

interface Type {
  id: number;
  title: string;
}

interface updatedValues {
  description?: string;
  applicationName?: string;
  priorityId?: number;
  ticketTypeId?: number;
  reply?: string;
}

function TicketView({ ticketData }: { ticketData: any | null }) {
  const [prioritiesData, setPrioritiesData] = useState<Priority[]>([]);
  const [typesData, setTypesData] = useState<Type[]>([]);
  const [replyData, setReplyData] = useState<TicketReply[] | undefined>();
  const navigate = useNavigate();
  const handleRequestError = (error: unknown) => {
    console.error("An error occurred:", error);
  };

  useEffect(() => {
    if (ticketData && !replyData) {
      setReplyData(ticketData.ticketReplies);
    }
  }, [ticketData, replyData]);
  const fetchPrioritiesData = useCallback(async () => {
    try {
      const response = await axios.get("/api/tickets/priorities");
      setPrioritiesData(response.data);
    } catch (error) {
      handleRequestError(error);
    }
  }, []);

  const fetchTicketTypesData = useCallback(async () => {
    try {
      const response = await axios.get("/api/tickets/types");
      setTypesData(response.data);
    } catch (error) {
      handleRequestError(error);
    }
  }, []);

  useEffect(() => {
    fetchPrioritiesData();
    fetchTicketTypesData();
  }, [fetchPrioritiesData, fetchTicketTypesData]);

  const updateTicket = useCallback(
    async (updatedValues: updatedValues) => {
      try {
        if (!updatedValues?.reply?.trim()) {
          return;
        }
        const newReply: TicketReply = {
          replyId: Math.random(), // Generate a unique ID for the new reply
          tId: ticketData?.id || 0, // Use the ticket ID
          reply: updatedValues.reply, // Use the reply from updatedValues
        };
        setReplyData((prevReplyData) => {
          if (prevReplyData) {
            return [...prevReplyData, newReply]; // Add the new reply to the existing array
          } else {
            return [newReply]; // If replyData is not set, initialize it with the new reply
          }
        });
        await axios.put(`/api/tickets/${ticketData?.id}`, updatedValues);
      } catch (error) {
        handleRequestError(error);
      }
    },
    [ticketData?.id]
  );

  const addTicket = useCallback(async (newValues: FormikValues) => {
    try {
      await axios.post(`/api/tickets`, newValues);
      navigate(`/tickets`);
    } catch (error) {
      handleRequestError(error);
    }
  }, []);

  const handleCloseClick = () => {
    window.location.href = "/tickets";
  };

  return (
    <div className="mt-2">
      <Formik
        initialValues={{
          applicationName: ticketData?.applicationName || "HR",
          priorityId: ticketData?.priorityId || 1,
          ticketTypeId: ticketData?.ticketTypeById?.id || 1,
          title: "",
          description: "",
          statusId: 1,
          reply: "",
        }}
        validationSchema={
          ticketData
            ? undefined
            : Yup.object().shape({
                description: Yup.string()
                  .max(255)
                  .required("The Description field is required"),
                title: Yup.string()
                  .max(255)
                  .required("The Title field is required"),
              })
        }
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (ticketData) {
              await updateTicket(values);
            } else {
              await addTicket(values);
            }
          } catch (error) {
            handleRequestError(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <div className="flex items-center justify-between">
              <div>Ticket#</div>
              {ticketData ? (
                <div>
                  {ticketData.id}- {ticketData.title}
                </div>
              ) : (
                <Field
                  name="title"
                  placeholder="Title"
                  className="border border-black p-2"
                />
              )}

              <div className="gap-2 flex">
                <div>
                  <button
                    type="button"
                    onClick={handleCloseClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    close
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label>New Reply</label>
              <textarea
                name="reply"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                onChange={handleChange}
                placeholder="Reply here..."
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-12 pb-4 justify-between">
                  <div className="flex-1 max-w-36">
                    <label className="text-gray-700 text-xs font-bold mb-2">
                      Module
                    </label>
                  </div>
                  <div className="relative flex-1 max-w-36">
                    <Field
                      as="select"
                      name="applicationName"
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={values.applicationName}
                    >
                      <option value="HR">Hr</option>
                      <option value="Loader">Loader</option>
                      <option value="Finance">Finance</option>
                      <option value="Ingress">Ingress</option>
                      <option value="Cluster">Cluster</option>
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-12 pb-4 justify-between">
                  <div className="flex-1 max-w-36">
                    <label className="text-gray-700 text-xs font-bold mb-2 ">
                      Urgent Lvl
                    </label>
                  </div>
                  <div className="relative flex-1 max-w-36">
                    <Field
                      as="select"
                      name="priorityId"
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={values.priorityId || ""}
                    >
                      {prioritiesData.map((priority) => (
                        <option key={priority.id} value={priority.id}>
                          {priority.title}
                        </option>
                      ))}
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-12 pb-4 justify-between">
                  <div className="flex-1 max-w-36">
                    <label className="text-gray-700 text-xs font-bold mb-2  ">
                      Type
                    </label>
                  </div>
                  <div className="relative flex-1 max-w-36">
                    <Field
                      as="select"
                      name="ticketTypeId"
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      {typesData.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-12 pb-4">
                  <div className="flex-1 max-w-36">
                    <label className="text-gray-700 text-xs font-bold ">
                      State
                    </label>
                  </div>
                  <div>{ticketData?.statusById?.title}</div>
                </div>
                <div>
                  <label>Description</label>

                  {ticketData ? (
                    <div className="border border-black p-2 mb-2">
                      {ticketData.description}
                    </div>
                  ) : (
                    <div className="border border-black p-2 mb-2">
                      <textarea
                        name="description"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        onChange={handleChange}
                        placeholder="Right description here..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label>Replies</label>
                <div className="bg-gray-200 border border-black rounded py-3 px-4 mb-3">
                  {replyData?.map((reply: TicketReply) => (
                    <div key={reply.replyId} className="bg-white p-2 mb-4">
                      <p>{reply.reply}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TicketView;
