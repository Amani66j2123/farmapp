import React, { useState, useEffect } from "react";
import Axios from "axios";

const Customer = () => {
  const [fullName, setFullName] = useState("");
  const [civilNo, setCivilNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isValidPhoneNo, setIsValidPhoneNo] = useState(false);
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [celebrationType, setCelebrationType] = useState("");
  const [payment, setPayment] = useState("");
  const [details, setDetails] = useState("");
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [result, setResult] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isSlotAvailable, setIsSlotAvailable] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);

  const handlePhoneNoChange = (e) => {
    const val = e.target.value;
    setPhoneNo(val);
    setIsValidPhoneNo(/^[79][0-9]{7}$/.test(val));
  };

  const computePrice = () => {
    if (!date || !time) {
      alert("Please select a valid date and time first.");
      return;
    }

    let price = 35.0;
    if (["4", "5", "6"].includes(day)) {
      price += price * 0.15;
    } else {
      price += price;
    }
    const net = price + price * 0.05;
    setTotalPrice(net);
    setResult(net > 0 ? "CALCULATED" : "Not CALCULATED");
    setShowSubmit(true);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const selected = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      alert("Cannot select today or past dates.");
      return;
    }

    setDate(selectedDate);
    const dayIndex = selected.getDay();
    const dayMap = { 0: "2", 1: "3", 2: "4", 3: "5", 4: "6", 5: "7", 6: "1" };
    setDay(dayMap[dayIndex]);
    setIsSlotAvailable(true);
  };

  const handleTimeChange = async (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);
    setShowSubmit(false);

    if (!date) {
      alert("Select a date first.");
      return;
    }

    try {
      const res = await Axios.post("http://localhost:3001/checkAvailability", {
        date,
        time: selectedTime,
      });
      setIsSlotAvailable(res.data.isAvailable);
      if (!res.data.isAvailable) {
        alert("Slot already booked.");
      }
    } catch (error) {
      console.error("Time check failed:", error);
      setIsSlotAvailable(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isSlotAvailable) {
      alert("This slot is unavailable.");
      return;
    }

    // Required fields validation
    if (
      !fullName ||
      !civilNo ||
      !phoneNo ||
      !isValidPhoneNo ||
      !email.includes("@") ||
      !day ||
      !date ||
      !time ||
      !customerType ||
      numAdults <= 0 ||
      !celebrationType ||
      !payment
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await Axios.post("http://localhost:3001/addc", {
        fullName,
        civilNo,
        phoneNo,
        email,
        day,
        date,
        time,
        customerType,
        numAdults,
        numChildren,
        celebrationType,
        payment,
        details,
        totalPrice,
        result,
      });

      setResponseMsg("🎉 Booking successful!");
    } catch (error) {
      console.error("Save failed:", error);
      setResult(net > 0 ? "Booked" : "Not Booked");

      setResponseMsg("❌ Error while saving. Try again.");
    }
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = tomorrow.toISOString().split("T")[0];
    setDate(formatted);

    const dayIndex = tomorrow.getDay();
    const dayMap = { 0: "2", 1: "3", 2: "4", 3: "5", 4: "6", 5: "7", 6: "1" };
    setDay(dayMap[dayIndex]);
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        {/* 🧾 FORM SECTION */}
        <div className="col-md-6">
          <h2 className="text-primary fw-bold mb-4">🏡 Rental Form</h2>
          <form onSubmit={handleFormSubmit} className="p-4 border rounded shadow-sm bg-light">
            {/* Full Name */}
            <div className="mb-3">
              <label>Full Name</label>
              <input type="text" className="form-control" onChange={(e) => setFullName(e.target.value)} />
            </div>

            {/* Civil No */}
            <div className="mb-3">
              <label>Civil No</label>
              <input type="text" className="form-control" onChange={(e) => setCivilNo(e.target.value)} />
            </div>

            {/* Phone No */}
            <div className="mb-3">
              <label>Phone No</label>
              <input type="text" className="form-control" onChange={handlePhoneNoChange} />
              {!isValidPhoneNo && phoneNo.length > 0 && (
                <small className="text-danger">Phone must be 8 digits, start with 7 or 9</small>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Date */}
            <div className="mb-3">
              <label>Date</label>
              <input type="date" className="form-control" value={date} onChange={handleDateChange} />
            </div>

            {/* Time */}
            <div className="mb-3">
              <label>Time</label>
              <input type="time" className="form-control" value={time} onChange={handleTimeChange} />
              {!isSlotAvailable && <small className="text-danger">This time is already booked</small>}
            </div>

            {/* Customer Type */}
            <div className="mb-3">
              <label>Customer Type</label>
              <div className="form-check">
                <input type="radio" name="customerType" value="new" className="form-check-input"
                  onChange={(e) => setCustomerType(e.target.value)} />
                <label className="form-check-label">New</label>
              </div>
              <div className="form-check">
                <input type="radio" name="customerType" value="existing" className="form-check-input"
                  onChange={(e) => setCustomerType(e.target.value)} />
                <label className="form-check-label">Existing</label>
              </div>
            </div>

            {/* Adults */}
            <div className="mb-3">
              <label>Number of Adults</label>
              <input type="number" className="form-control" onChange={(e) => setNumAdults(parseInt(e.target.value))} />
            </div>

            {/* Children */}
            <div className="mb-3">
              <label>Number of Children</label>
              <input type="number" className="form-control" onChange={(e) => setNumChildren(parseInt(e.target.value))} />
            </div>

            {/* Celebration Type */}
            <div className="mb-3">
              <label>Celebration Type</label>
              <select className="form-select" onChange={(e) => setCelebrationType(e.target.value)}>
                <option value="">Select</option>
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
              </select>
            </div>

            {/* Payment */}
            <div className="mb-3">
              <label>Payment</label>
              <div className="form-check">
                <input type="radio" name="payment" value="cash" className="form-check-input"
                  onChange={(e) => setPayment(e.target.value)} />
                <label className="form-check-label">Cash</label>
              </div>
              <div className="form-check">
                <input type="radio" name="payment" value="credit" className="form-check-input"
                  onChange={(e) => setPayment(e.target.value)} />
                <label className="form-check-label">Credit</label>
              </div>
            </div>

            {/* Details */}
            <div className="mb-3">
              <label>Extra Details</label>
              <textarea className="form-control" onChange={(e) => setDetails(e.target.value)} />
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn btn-outline-primary" onClick={computePrice}>
                💰 Calculate Total
              </button>
              {showSubmit && (
                <button type="submit" className="btn btn-success">
                  ✅ Submit Reservation
                </button>
              )}
            </div>
          </form>

          {/* Response Message */}
          {responseMsg && <div className="alert mt-3 alert-info">{responseMsg}</div>}
        </div>

        {/* 📋 SUMMARY SECTION */}
        <div className="col-md-6">
          <h2 className="text-secondary fw-bold mb-4">📋 Summary</h2>
          <div className="p-3 border rounded shadow-sm bg-white">
            <p><strong>Full Name:</strong> {fullName}</p>
            <p><strong>Civil No:</strong> {civilNo}</p>
            <p><strong>Phone:</strong> {phoneNo}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Customer Type:</strong> {customerType}</p>
            <p><strong>Adults:</strong> {numAdults}</p>
            <p><strong>Children:</strong> {numChildren}</p>
            <p><strong>Celebration:</strong> {celebrationType}</p>
            <p><strong>Payment:</strong> {payment}</p>
            <p><strong>Details:</strong> {details}</p>
            <p><strong>Total Price:</strong> {totalPrice.toFixed(2)} OMR</p>
            <p><strong>Result:</strong> {result}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
