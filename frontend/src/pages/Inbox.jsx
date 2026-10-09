import { useState, useEffect } from "react";
import API from "../api/axios";

const Inbox = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await API.get("/intro-requests");
      setRequests(response.data.data.items || response.data.data || []);
    } catch (err) {
      // Intro requests backend endpoint may not be implemented yet
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const receivedRequests = requests.filter((r) => r.type !== "sent");
  const sentRequests = requests.filter((r) => r.type === "sent");
  const displayList =
    activeTab === "received" ? receivedRequests : sentRequests;

  return (
    <div className="page-container page-wide col g24">
      <h1 className="h1">Inbox</h1>

      <div className="row g10">
        <button
          type="button"
          className={`chip ${activeTab === "received" ? "active" : ""}`}
          aria-pressed={activeTab === "received"}
          onClick={() => setActiveTab("received")}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          type="button"
          className={`chip ${activeTab === "sent" ? "active" : ""}`}
          aria-pressed={activeTab === "sent"}
          onClick={() => setActiveTab("sent")}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      <div className="inbox">
        {loading ? (
          <div className="card empty" style={{ flex: "1 1 100%" }}>
            <p className="t3">Loading intro requests...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="card empty" style={{ flex: "1 1 100%" }}>
            <div className="card-title">Nothing here yet</div>
            <p className="t3">
              {activeTab === "received"
                ? "Intro requests from other founders or investors will show up here."
                : "Requests you send to founders or investors will show up here."}
            </p>
          </div>
        ) : (
          <div className="inbox-list" role="list">
            {displayList.map((req, idx) => (
              <div key={req._id || idx} className="conv">
                <div className="avatar" style={{ "--s": "36px" }}>
                  {req.fromName ? req.fromName.charAt(0) : "U"}
                </div>
                <div className="who">
                  <div className="fw5">{req.fromName || "Introduction"}</div>
                  <div className="s">{req.message || "Pending request"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
