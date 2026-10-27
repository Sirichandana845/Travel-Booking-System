// FACTORY METHOD DESIGN PATTERN
// Each class creates a booking of a different travel type.

class Booking {
  constructor(details) {
    this.details = details;
  }

  // Common booking information
  getSummary() {
    return {
      type: this.type,
      from: this.details.from,
      to: this.details.to,
      date: this.details.date,
      passengers: this.details.passengers
    };
  }
}

class FlightBooking extends Booking {
  constructor(details) {
    super(details);
    this.type = "Flight";
    this.extra = "Cabin class: " + details.travelOption;
  }
}

class TrainBooking extends Booking {
  constructor(details) {
    super(details);
    this.type = "Train";
    this.extra = "Coach class: " + details.travelOption;
  }
}

class BusBooking extends Booking {
  constructor(details) {
    super(details);
    this.type = "Bus";
    this.extra = "Seat type: " + details.travelOption;
  }
}

// FACTORY: selects and creates the appropriate booking object.
class BookingFactory {
  static createBooking(type, details) {
    if (type === "flight") {
      return new FlightBooking(details);
    } else if (type === "train") {
      return new TrainBooking(details);
    } else if (type === "bus") {
      return new BusBooking(details);
    }

    throw new Error("Please select a valid travel type.");
  }
}

let selectedType = "flight";

const optionButtons = document.querySelectorAll(".travel-option");
const extraFields = document.getElementById("extraFields");
const form = document.getElementById("bookingForm");
const confirmation = document.getElementById("confirmation");
const dateInput = document.getElementById("date");

// Prevent selecting a date in the past.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().slice(0, 10);
dateInput.min = localToday;
dateInput.value = localToday;

const optionsByType = {
  flight: {
    label: "Cabin class",
    choices: ["Economy", "Business", "First Class"]
  },
  train: {
    label: "Coach class",
    choices: ["Sleeper", "AC 3 Tier", "AC 2 Tier", "Chair Car"]
  },
  bus: {
    label: "Seat type",
    choices: ["Seater", "Sleeper", "AC Sleeper"]
  }
};

// Display different options for the selected travel type.
function showTravelOptions(type) {
  const config = optionsByType[type];

  extraFields.replaceChildren();

  const label = document.createElement("label");
  label.append(document.createTextNode(config.label));

  const select = document.createElement("select");
  select.id = "travelOption";
  select.name = "travelOption";
  select.required = true;

  config.choices.forEach((choice) => {
    const option = document.createElement("option");
    option.value = choice;
    option.textContent = choice;
    select.appendChild(option);
  });

  label.appendChild(select);
  extraFields.appendChild(label);
}

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.type;

    optionButtons.forEach((item) => {
      item.classList.toggle("selected", item === button);
    });

    showTravelOptions(selectedType);
    confirmation.hidden = true;
  });
});

// Create the first set of options.
showTravelOptions(selectedType);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const details = {
    from: document.getElementById("from").value.trim(),
    to: document.getElementById("to").value.trim(),
    date: dateInput.value,
    passengers: Number(document.getElementById("passengers").value),
    travelOption: document.getElementById("travelOption").value
  };

  if (details.from.toLowerCase() === details.to.toLowerCase()) {
    alert("Departure and destination must be different.");
    return;
  }

  // Factory Method is used here to create the correct booking object.
  const booking = BookingFactory.createBooking(selectedType, details);
  const summary = booking.getSummary();

  // Use textContent to display user-provided data safely.
  confirmation.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "✓ Booking Created Successfully!";
  confirmation.appendChild(heading);

  const rows = [
    ["Booking type", summary.type],
    ["From", summary.from],
    ["To", summary.to],
    ["Journey date", summary.date],
    ["Passengers", String(summary.passengers)],
    ["Selected option", booking.extra],
    ["Demo booking ID", "TB" + Date.now().toString().slice(-8)]
  ];

  rows.forEach(([key, value]) => {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = key + ": ";
    paragraph.append(strong, document.createTextNode(value));
    confirmation.appendChild(paragraph);
  });

  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: "smooth", block: "nearest" });
});